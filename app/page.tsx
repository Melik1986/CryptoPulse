import React, { Suspense } from 'react';
import CoinOverview from '@/components/home/CoinOverview';
import TrendingCoins from '@/components/home/TrendingCoins';
import {
  CategoriesFallback,
  CoinOverviewFallback,
  TrendingCoinsFallback,
} from '@/components/home/HomeFallback';
import Categories from '@/components/home/Categories';
import { HeroScene } from '@/components/vault-hero/HeroSceneClient';

const Page = async () => {
  return (
    <main className="main-container">
      {/* Hero Section с 3D Vault */}
      <section className="w-full mb-24">
        <HeroScene />
      </section>

      <section className="home-grid mt-[-1.9rem]">
        <Suspense fallback={<CoinOverviewFallback />}>
          <CoinOverview />
        </Suspense>

        <Suspense fallback={<TrendingCoinsFallback />}>
          <TrendingCoins />
        </Suspense>
      </section>

      <section className="w-full mt-7 space-y-4">
        <Suspense fallback={<CategoriesFallback />}>
          <Categories />
        </Suspense>
      </section>
    </main>
  );
};

export default Page;
