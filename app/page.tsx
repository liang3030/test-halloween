'use client';

import { Mint } from '@/component/mint';
import { Profile } from '@/component/profile';
import { config } from '@/util/wagmiConfig';
import { WagmiConfig } from 'wagmi';

export default function Home() {
  return (
    <WagmiConfig config={config}>
      <main className="flex min-h-screen flex-col items-center justify-between p-24">
        <Profile />
        <Mint />
      </main>
    </WagmiConfig>
  );
}
