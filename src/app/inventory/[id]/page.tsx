import { Suspense } from 'react';
import { INVENTORY_CARS } from '@/data/cars';
import { CarDetailClient } from '@/components/inventory/CarDetailClient';

export function generateStaticParams() {
  return INVENTORY_CARS.map((car) => ({
    id: car.id,
  }));
}

async function CarDetailContent({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <CarDetailClient id={id} />;
}

export default function CarDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-transparent flex items-center justify-center font-mono text-xs text-cyan-400">
          Loading 3D Machine Suite...
        </div>
      }
    >
      <CarDetailContent params={params} />
    </Suspense>
  );
}
