'use server';

import qs from 'query-string';
import {
  isMockMode,
  mockBitcoinData,
  mockOHLCData,
  mockTrendingCoins,
  mockCategories,
  getMockCoinData,
  getMockOHLCData,
} from './mock-data';

const BASE_URL = process.env.COINGECKO_BASE_URL;
const API_KEY = process.env.COINGECKO_API_KEY;

/** Check if mock mode is explicitly enabled or API is unavailable */
const EXPLICIT_MOCK_MODE = isMockMode();

/**
 * Returns mock data based on endpoint
 */
function getMockData<T>(endpoint: string): T | null {
  console.log('[MockData] Requesting endpoint:', endpoint);

  // Specific Bitcoin endpoints (for main page)
  if (endpoint.includes('/coins/bitcoin/ohlc')) {
    return mockOHLCData as T;
  }
  if (endpoint === '/coins/bitcoin' || endpoint.startsWith('/coins/bitcoin?')) {
    return mockBitcoinData as T;
  }
  // Categories - strict check first
  if (endpoint === '/coins/categories' || endpoint.includes('/coins/categories')) {
    console.log('[MockData] Returning categories mock');
    return mockCategories as T;
  }
  // Dynamic coin OHLC data: /coins/{id}/ohlc
  const ohlcMatch = endpoint.match(/\/coins\/([^/]+)\/ohlc/);
  if (ohlcMatch) {
    const coinId = ohlcMatch[1];
    const coinData = getMockCoinData(coinId);
    const basePrice = coinData.market_data.current_price.usd;
    return getMockOHLCData(basePrice) as T;
  }
  // Dynamic coin data: /coins/{id}
  const coinMatch = endpoint.match(/\/coins\/([^/?]+)/);
  if (coinMatch) {
    const coinId = coinMatch[1];
    return getMockCoinData(coinId) as T;
  }
  // Trending coins
  if (endpoint.includes('/search/trending')) {
    return mockTrendingCoins as T;
  }
  return null;
}

/**
 * Fetches data from CoinGecko API or returns mock data
 * Automatically falls back to mock data on API errors (429, 400, etc.)
 */
export async function fetcher<T>(
  endpoint: string,
  params?: QueryParams,
  revalidate = 60,
): Promise<T> {
  // Return mock data if explicitly enabled
  if (EXPLICIT_MOCK_MODE) {
    const mockData = getMockData<T>(endpoint);
    if (mockData) {
      return mockData;
    }
    throw new Error(`No mock data available for endpoint: ${endpoint}`);
  }

  const url = qs.stringifyUrl(
    {
      url: `${BASE_URL}/${endpoint}`,
      query: params,
    },
    { skipEmptyString: true, skipNull: true },
  );

  try {
    const response = await fetch(url, {
      headers: {
        'x-cg-pro-api-key': API_KEY!,
        'Content-Type': 'application/json',
      },
      next: { revalidate },
    });

    if (!response.ok) {
      // Fallback to mock data on rate limit or bad request
      if (response.status === 429 || response.status === 400 || response.status === 401) {
        console.warn(`[CoinGecko] API error ${response.status}, falling back to mock data`);
        const mockData = getMockData<T>(endpoint);
        if (mockData) {
          return mockData;
        }
      }
      const errorBody: CoinGeckoErrorBody = await response.json().catch(() => ({}));
      throw new Error(`API Error: ${response.status}: ${errorBody.error || response.statusText}`);
    }

    return response.json();
  } catch (error) {
    // Fallback to mock data on network errors
    const mockData = getMockData<T>(endpoint);
    if (mockData) {
      console.warn('[CoinGecko] Network error, falling back to mock data');
      return mockData;
    }
    throw error;
  }
}

/**
 * Gets pool data for a coin
 */
export async function getPools(
  id: string,
  network?: string | null,
  contractAddress?: string | null,
): Promise<PoolData> {
  const fallback: PoolData = {
    id: '',
    address: '',
    name: '',
    network: '',
  };

  // Return fallback in mock mode
  if (EXPLICIT_MOCK_MODE) {
    return fallback;
  }

  if (network && contractAddress) {
    try {
      const poolData = await fetcher<{ data: PoolData[] }>(
        `/onchain/networks/${network}/tokens/${contractAddress}/pools`,
      );
      return poolData.data?.[0] ?? fallback;
    } catch (error) {
      console.log(error);
      return fallback;
    }
  }

  try {
    const poolData = await fetcher<{ data: PoolData[] }>('/onchain/search/pools', { query: id });
    return poolData.data?.[0] ?? fallback;
  } catch {
    return fallback;
  }
}
