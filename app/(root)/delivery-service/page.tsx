"use client";

import dynamic from 'next/dynamic';

const DeliveryServiceComponent = dynamic(
  () => import('@/components/delivery/DeliveryServiceComponent'),
  { ssr: false }
);

export default function DeliveryService() {
  return <DeliveryServiceComponent />;
} 