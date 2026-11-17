'use client';

import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { CarDetailClient } from '@/components/inventory/CarDetailClient';

function CarDetailQueryContent() {
  const searchParams = useSearchParams();
  const id = searchParams.get('id') || searchParams.get('car') || '';
  return <CarDetailClient id={id} />;
}

export default function InventoryDetailPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#06070a] flex items-center justify-center font-mono text-xs text-cyan-400">
          Loading 3D Machine Suite...
        </div>
      }
    >
      <CarDetailQueryContent />
    </Suspense>
  );
}
