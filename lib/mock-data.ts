/**
 * Mock data for CoinGecko API
 * Used when API keys are not configured (demo/presentation mode)
 */

/** Mock coin database for dynamic endpoints */
const MOCK_COINS: Record<string, Partial<CoinDetailsData>> = {
  bitcoin: {
    id: 'bitcoin',
    name: 'Bitcoin',
    symbol: 'btc',
    market_cap_rank: 1,
    image: {
      large: 'https://coin-images.coingecko.com/coins/images/1/large/bitcoin.png',
      small: 'https://coin-images.coingecko.com/coins/images/1/small/bitcoin.png',
    },
    market_data: {
      current_price: { usd: 97500.0 },
      price_change_24h_in_currency: { usd: 1250.5 },
      price_change_percentage_24h_in_currency: { usd: 1.3 },
      price_change_percentage_30d_in_currency: { usd: 12.5 },
      market_cap: { usd: 1920000000000 },
      total_volume: { usd: 45000000000 },
    },
  },
  ethereum: {
    id: 'ethereum',
    name: 'Ethereum',
    symbol: 'eth',
    market_cap_rank: 2,
    image: {
      large: 'https://coin-images.coingecko.com/coins/images/279/large/ethereum.png',
      small: 'https://coin-images.coingecko.com/coins/images/279/small/ethereum.png',
    },
    market_data: {
      current_price: { usd: 3450.0 },
      price_change_24h_in_currency: { usd: 85.5 },
      price_change_percentage_24h_in_currency: { usd: 2.1 },
      price_change_percentage_30d_in_currency: { usd: 8.3 },
      market_cap: { usd: 415000000000 },
      total_volume: { usd: 18000000000 },
    },
  },
  solana: {
    id: 'solana',
    name: 'Solana',
    symbol: 'sol',
    market_cap_rank: 5,
    image: {
      large: 'https://coin-images.coingecko.com/coins/images/4128/large/solana.png',
      small: 'https://coin-images.coingecko.com/coins/images/4128/small/solana.png',
    },
    market_data: {
      current_price: { usd: 185.0 },
      price_change_24h_in_currency: { usd: 6.2 },
      price_change_percentage_24h_in_currency: { usd: 3.5 },
      price_change_percentage_30d_in_currency: { usd: 15.8 },
      market_cap: { usd: 87000000000 },
      total_volume: { usd: 4500000000 },
    },
  },
  ripple: {
    id: 'ripple',
    name: 'XRP',
    symbol: 'xrp',
    market_cap_rank: 4,
    image: {
      large: 'https://coin-images.coingecko.com/coins/images/44/large/xrp-symbol-white-128.png',
      small: 'https://coin-images.coingecko.com/coins/images/44/small/xrp-symbol-white-128.png',
    },
    market_data: {
      current_price: { usd: 2.35 },
      price_change_24h_in_currency: { usd: -0.02 },
      price_change_percentage_24h_in_currency: { usd: -0.8 },
      price_change_percentage_30d_in_currency: { usd: 45.2 },
      market_cap: { usd: 135000000000 },
      total_volume: { usd: 8500000000 },
    },
  },
  dogecoin: {
    id: 'dogecoin',
    name: 'Dogecoin',
    symbol: 'doge',
    market_cap_rank: 8,
    image: {
      large: 'https://coin-images.coingecko.com/coins/images/5/large/dogecoin.png',
      small: 'https://coin-images.coingecko.com/coins/images/5/small/dogecoin.png',
    },
    market_data: {
      current_price: { usd: 0.32 },
      price_change_24h_in_currency: { usd: 0.016 },
      price_change_percentage_24h_in_currency: { usd: 5.2 },
      price_change_percentage_30d_in_currency: { usd: 22.1 },
      market_cap: { usd: 47000000000 },
      total_volume: { usd: 2800000000 },
    },
  },
  cardano: {
    id: 'cardano',
    name: 'Cardano',
    symbol: 'ada',
    market_cap_rank: 9,
    image: {
      large: 'https://coin-images.coingecko.com/coins/images/975/large/cardano.png',
      small: 'https://coin-images.coingecko.com/coins/images/975/small/cardano.png',
    },
    market_data: {
      current_price: { usd: 0.95 },
      price_change_24h_in_currency: { usd: -0.012 },
      price_change_percentage_24h_in_currency: { usd: -1.2 },
      price_change_percentage_30d_in_currency: { usd: 18.5 },
      market_cap: { usd: 33000000000 },
      total_volume: { usd: 1200000000 },
    },
  },
};

/**
 * Generate mock coin data for any coinId
 * Falls back to Bitcoin data structure with modified values
 */
export function getMockCoinData(coinId: string): CoinDetailsData {
  const coin = MOCK_COINS[coinId];
  if (coin) {
    return {
      ...coin,
      asset_platform_id: null,
      description: { en: `${coin.name} is a popular cryptocurrency.` },
      links: {
        homepage: [`https://${coinId}.org`],
        blockchain_site: [`https://explorer.${coinId}.org`],
        subreddit_url: `https://reddit.com/r/${coinId}`,
      },
      tickers: [],
    } as CoinDetailsData;
  }
  // Fallback for unknown coins
  return {
    id: coinId,
    name: coinId.charAt(0).toUpperCase() + coinId.slice(1),
    symbol: coinId.slice(0, 3).toUpperCase(),
    asset_platform_id: null,
    image: {
      large: 'https://coin-images.coingecko.com/coins/images/1/large/bitcoin.png',
      small: 'https://coin-images.coingecko.com/coins/images/1/small/bitcoin.png',
    },
    market_data: {
      current_price: { usd: 100.0 },
      price_change_24h_in_currency: { usd: 2.5 },
      price_change_percentage_24h_in_currency: { usd: 2.5 },
      price_change_percentage_30d_in_currency: { usd: 10.0 },
      market_cap: { usd: 1000000000 },
      total_volume: { usd: 50000000 },
    },
    market_cap_rank: 100,
    description: { en: `${coinId} is a cryptocurrency.` },
    links: {
      homepage: [`https://${coinId}.org`],
      blockchain_site: [`https://explorer.${coinId}.org`],
      subreddit_url: `https://reddit.com/r/${coinId}`,
    },
    tickers: [],
  };
}

/**
 * Generate mock OHLC data for any coin
 */
export function getMockOHLCData(basePrice?: number): OHLCData[] {
  return generateMockOHLC(basePrice);
}

/** Bitcoin mock data for /coins/bitcoin endpoint */
export const mockBitcoinData: CoinDetailsData = {
  id: 'bitcoin',
  name: 'Bitcoin',
  symbol: 'btc',
  asset_platform_id: null,
  image: {
    large: 'https://coin-images.coingecko.com/coins/images/1/large/bitcoin.png',
    small: 'https://coin-images.coingecko.com/coins/images/1/small/bitcoin.png',
  },
  market_data: {
    current_price: { usd: 97500.0 },
    price_change_24h_in_currency: { usd: 1250.5 },
    price_change_percentage_24h_in_currency: { usd: 1.3 },
    price_change_percentage_30d_in_currency: { usd: 12.5 },
    market_cap: { usd: 1920000000000 },
    total_volume: { usd: 45000000000 },
  },
  market_cap_rank: 1,
  description: {
    en: 'Bitcoin is the first successful internet money based on peer-to-peer technology.',
  },
  links: {
    homepage: ['https://bitcoin.org'],
    blockchain_site: ['https://blockchain.info'],
    subreddit_url: 'https://reddit.com/r/bitcoin',
  },
  tickers: [],
};

/** OHLC mock data for /coins/bitcoin/ohlc endpoint */
export const mockOHLCData: OHLCData[] = generateMockOHLC(96000);

function generateMockOHLC(basePrice = 96000): OHLCData[] {
  const now = Date.now();
  const hourMs = 3600000;
  const data: OHLCData[] = [];
  let price = basePrice;
  const volatility = basePrice * 0.005; // 0.5% volatility

  for (let i = 24; i >= 0; i--) {
    const timestamp = now - i * hourMs;
    const open = price;
    const change = (Math.random() - 0.48) * volatility;
    const close = price + change;
    const high = Math.max(open, close) + Math.random() * (volatility * 0.4);
    const low = Math.min(open, close) - Math.random() * (volatility * 0.4);
    data.push([timestamp, open, high, low, close]);
    price = close;
  }

  return data;
}

/** Trending coins mock data for /search/trending endpoint */
export const mockTrendingCoins: { coins: TrendingCoin[] } = {
  coins: [
    {
      item: {
        id: 'bitcoin',
        name: 'Bitcoin',
        symbol: 'BTC',
        market_cap_rank: 1,
        thumb: 'https://coin-images.coingecko.com/coins/images/1/thumb/bitcoin.png',
        large: 'https://coin-images.coingecko.com/coins/images/1/large/bitcoin.png',
        data: {
          price: 97500,
          price_change_percentage_24h: { usd: 1.3 },
        },
      },
    },
    {
      item: {
        id: 'ethereum',
        name: 'Ethereum',
        symbol: 'ETH',
        market_cap_rank: 2,
        thumb: 'https://coin-images.coingecko.com/coins/images/279/thumb/ethereum.png',
        large: 'https://coin-images.coingecko.com/coins/images/279/large/ethereum.png',
        data: {
          price: 3450,
          price_change_percentage_24h: { usd: 2.1 },
        },
      },
    },
    {
      item: {
        id: 'solana',
        name: 'Solana',
        symbol: 'SOL',
        market_cap_rank: 5,
        thumb: 'https://coin-images.coingecko.com/coins/images/4128/thumb/solana.png',
        large: 'https://coin-images.coingecko.com/coins/images/4128/large/solana.png',
        data: {
          price: 185,
          price_change_percentage_24h: { usd: 3.5 },
        },
      },
    },
    {
      item: {
        id: 'ripple',
        name: 'XRP',
        symbol: 'XRP',
        market_cap_rank: 4,
        thumb: 'https://coin-images.coingecko.com/coins/images/44/thumb/xrp-symbol-white-128.png',
        large: 'https://coin-images.coingecko.com/coins/images/44/large/xrp-symbol-white-128.png',
        data: {
          price: 2.35,
          price_change_percentage_24h: { usd: -0.8 },
        },
      },
    },
    {
      item: {
        id: 'dogecoin',
        name: 'Dogecoin',
        symbol: 'DOGE',
        market_cap_rank: 8,
        thumb: 'https://coin-images.coingecko.com/coins/images/5/thumb/dogecoin.png',
        large: 'https://coin-images.coingecko.com/coins/images/5/large/dogecoin.png',
        data: {
          price: 0.32,
          price_change_percentage_24h: { usd: 5.2 },
        },
      },
    },
    {
      item: {
        id: 'cardano',
        name: 'Cardano',
        symbol: 'ADA',
        market_cap_rank: 9,
        thumb: 'https://coin-images.coingecko.com/coins/images/975/thumb/cardano.png',
        large: 'https://coin-images.coingecko.com/coins/images/975/large/cardano.png',
        data: {
          price: 0.95,
          price_change_percentage_24h: { usd: -1.2 },
        },
      },
    },
  ],
};

/** Categories mock data for /coins/categories endpoint */
export const mockCategories: Category[] = [
  {
    name: 'Layer 1 (L1)',
    top_3_coins: [
      'https://coin-images.coingecko.com/coins/images/1/small/bitcoin.png',
      'https://coin-images.coingecko.com/coins/images/279/small/ethereum.png',
      'https://coin-images.coingecko.com/coins/images/4128/small/solana.png',
    ],
    market_cap_change_24h: 2.5,
    market_cap: 2500000000000,
    volume_24h: 85000000000,
  },
  {
    name: 'Smart Contract Platform',
    top_3_coins: [
      'https://coin-images.coingecko.com/coins/images/279/small/ethereum.png',
      'https://coin-images.coingecko.com/coins/images/4128/small/solana.png',
      'https://coin-images.coingecko.com/coins/images/975/small/cardano.png',
    ],
    market_cap_change_24h: 1.8,
    market_cap: 650000000000,
    volume_24h: 32000000000,
  },
  {
    name: 'DeFi',
    top_3_coins: [
      'https://coin-images.coingecko.com/coins/images/12559/small/Avalanche_Circle_RedWhite_Trans.png',
      'https://coin-images.coingecko.com/coins/images/13442/small/steth_logo.png',
      'https://coin-images.coingecko.com/coins/images/9956/small/Badge_Dai.png',
    ],
    market_cap_change_24h: -0.5,
    market_cap: 120000000000,
    volume_24h: 8500000000,
  },
  {
    name: 'Meme',
    top_3_coins: [
      'https://coin-images.coingecko.com/coins/images/5/small/dogecoin.png',
      'https://coin-images.coingecko.com/coins/images/11939/small/shiba.png',
      'https://coin-images.coingecko.com/coins/images/29850/small/pepe-token.jpeg',
    ],
    market_cap_change_24h: 8.2,
    market_cap: 75000000000,
    volume_24h: 12000000000,
  },
  {
    name: 'Exchange Token',
    top_3_coins: [
      'https://coin-images.coingecko.com/coins/images/825/small/bnb-icon2_2x.png',
      'https://coin-images.coingecko.com/coins/images/2822/small/huobi-token-logo.png',
      'https://coin-images.coingecko.com/coins/images/4713/small/matic-token-icon.png',
    ],
    market_cap_change_24h: 0.9,
    market_cap: 95000000000,
    volume_24h: 5500000000,
  },
  {
    name: 'Gaming (GameFi)',
    top_3_coins: [
      'https://coin-images.coingecko.com/coins/images/12129/small/sandbox_logo.jpg',
      'https://coin-images.coingecko.com/coins/images/12493/small/GALA-COINGECKO.png',
      'https://coin-images.coingecko.com/coins/images/13029/small/axie_infinity_logo.png',
    ],
    market_cap_change_24h: -2.1,
    market_cap: 18000000000,
    volume_24h: 1200000000,
  },
  {
    name: 'AI & Big Data',
    top_3_coins: [
      'https://coin-images.coingecko.com/coins/images/26375/small/FET_logo.png',
      'https://coin-images.coingecko.com/coins/images/22959/small/AGIX-token-img.png',
      'https://coin-images.coingecko.com/coins/images/16547/small/photo_2023-03-29_21.47.00.jpeg',
    ],
    market_cap_change_24h: 4.5,
    market_cap: 25000000000,
    volume_24h: 3200000000,
  },
  {
    name: 'Stablecoins',
    top_3_coins: [
      'https://coin-images.coingecko.com/coins/images/325/small/Tether.png',
      'https://coin-images.coingecko.com/coins/images/6319/small/usdc.png',
      'https://coin-images.coingecko.com/coins/images/9956/small/Badge_Dai.png',
    ],
    market_cap_change_24h: 0.1,
    market_cap: 165000000000,
    volume_24h: 95000000000,
  },
  {
    name: 'Privacy Coins',
    top_3_coins: [
      'https://coin-images.coingecko.com/coins/images/69/small/monero_logo.png',
      'https://coin-images.coingecko.com/coins/images/486/small/circle-zcash-color.png',
      'https://coin-images.coingecko.com/coins/images/63/small/dash-logo.png',
    ],
    market_cap_change_24h: -1.5,
    market_cap: 4500000000,
    volume_24h: 180000000,
  },
  {
    name: 'Layer 2 (L2)',
    top_3_coins: [
      'https://coin-images.coingecko.com/coins/images/25244/small/Optimism.png',
      'https://coin-images.coingecko.com/coins/images/16547/small/photo_2023-03-29_21.47.00.jpeg',
      'https://coin-images.coingecko.com/coins/images/4713/small/matic-token-icon.png',
    ],
    market_cap_change_24h: 3.2,
    market_cap: 22000000000,
    volume_24h: 2800000000,
  },
];

/**
 * Check if mock mode is enabled
 * Mock mode activates when:
 * - API keys are not configured
 * - API keys are empty strings
 * - MOCK_MODE env variable is explicitly set to 'true'
 */
export const isMockMode = (): boolean => {
  // Explicit mock mode flag
  if (process.env.MOCK_MODE === 'true') {
    return true;
  }
  const baseUrl = process.env.COINGECKO_BASE_URL?.trim();
  const apiKey = process.env.COINGECKO_API_KEY?.trim();
  // Check if values are empty or not set
  return !baseUrl || !apiKey || baseUrl.length === 0 || apiKey.length === 0;
};
