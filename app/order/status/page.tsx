'use client';

import { Suspense, useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';

enum OrderStatus {
  Waiting = 'waiting',
  InProgress = 'in_progress',
}

const statusMessage: Record<OrderStatus, string> = {
  [OrderStatus.Waiting]: 'waiting for the kitchen to accept your order',
  [OrderStatus.InProgress]: "we're getting started and will notify you when it's ready",
};

function StatusContent() {
  const searchParams = useSearchParams();
  const id = useMemo(() => searchParams.get('orderId') || '', [searchParams]);
  const name = useMemo(() => searchParams.get('name') || '', [searchParams]);

  const [status, setStatus] = useState<OrderStatus>(OrderStatus.Waiting);

  // After 10 seconds, update the message
  useEffect(() => {
    const timer = setTimeout(() => {
      setStatus(OrderStatus.InProgress);
    }, 10000);
    return () => clearTimeout(timer);
  }, []);

  // Store order details in sessionStorage
  useEffect(() => {
    if (!id) return;
    try {
      const orderRecord = {
        orderId: id,
        customerName: name,
        status,
        createdAt: new Date().toISOString(),
      };
      sessionStorage.setItem('lastOrder', JSON.stringify(orderRecord));
    } catch (_) {
      // ignore storage errors
    }
  }, [id, name, status]);

  // Attempt to hydrate from sessionStorage on mount for this order
  useEffect(() => {
    try {
      const raw = sessionStorage.getItem('lastOrder');
      if (!raw) return;
      const parsed = JSON.parse(raw) as { orderId?: string; status?: string };
      if (parsed?.orderId === id) {
        if (parsed.status === OrderStatus.InProgress) setStatus(OrderStatus.InProgress);
        else if (parsed.status === OrderStatus.Waiting) setStatus(OrderStatus.Waiting);
      }
    } catch {}
  }, [id]);

  return (
    <div className="container-responsive py-8 md:py-16 mx-8 text-center">
      <h1 className="text-3xl text-brand font-bold">{name ? `Thank you, ${name}!` : 'Thank you!'}</h1>
      <p className="mt-2 text-muted">Your order has been received.</p>
      {id && (
        <p className="mt-4 text-sm">
          Order number: <span className="font-mono">{id}</span>
        </p>
      )}
      <div className="flex justify-center mb-8">
        {status === OrderStatus.InProgress && (
          <video autoPlay loop muted playsInline preload="auto" className="w-64 h-64 object-cover">
            <source src="/cooking.webm" type="video/webm" />
            Your browser does not support the video tag.
          </video>
        )}
      </div>
      <p className="mt-6">{statusMessage[status]}</p>
    </div>
  );
}

export default function StatusPage() {
  return (
    <Suspense fallback={<div className="container-responsive py-8 md:py-16 mx-8 text-center">Loading...</div>}>
      <StatusContent />
    </Suspense>
  );
}
