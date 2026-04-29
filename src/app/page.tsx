'use client';

import dynamic from 'next/dynamic';

const Heart = dynamic(() => import('@/components/ui/heart').then(mod => mod.Heart), { ssr: false });

export default function Home() {
  return (
    <main className="relative w-full h-screen bg-black overflow-hidden">
      <div className="absolute inset-0">
        <Heart />
      </div>
    </main>
  );
}
