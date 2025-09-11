'use client';

import { Suspense, useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useCartStore } from '@/store/cart';
import { formatCurrency } from '@/lib/utils';

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
  const id = useMemo(() => searchParams.get('orderId') || searchParams.get('order_id') || '', [searchParams]);
  const name = useMemo(() => searchParams.get('name') || '', [searchParams]);
  const sessionId = useMemo(() => searchParams.get('session_id') || '', [searchParams]);
  const clear = useCartStore((s) => s.clear);

  const [status, setStatus] = useState<OrderStatus>(OrderStatus.Waiting);
  const [paymentVerified, setPaymentVerified] = useState(false);
  const [customerName, setCustomerName] = useState(name);
  const [orderDetails, setOrderDetails] = useState<any>(null);

  // Verify payment if coming from Stripe
  useEffect(() => {
    if (sessionId && id && !paymentVerified) {
      const verifyPayment = async () => {
        try {
          const response = await fetch('/api/verify-payment', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ sessionId, orderId: id }),
          });

          const data = await response.json();

          if (response.ok) {
            setPaymentVerified(true);
            setCustomerName(data.customerName || name);
            // Clear cart after successful payment verification
            clear();
          } else {
            console.error('Payment verification failed:', data.error);
          }
        } catch (err) {
          console.error('Payment verification error:', err);
        }
      };

      verifyPayment();
    } else if (!sessionId) {
      // Not coming from Stripe, mark as verified for existing flow
      setPaymentVerified(true);
    }
  }, [sessionId, id, paymentVerified, name, clear]);

  // Load order details from sessionStorage
  useEffect(() => {
    if (id) {
      try {
        const storedDetails = sessionStorage.getItem(`orderDetails_${id}`);
        if (storedDetails) {
          const details = JSON.parse(storedDetails);
          setOrderDetails(details);
          setCustomerName(details.customerName || name);
        }
      } catch (e) {
        console.warn('Could not load order details:', e);
      }
    }
  }, [id, name]);

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
        customerName: customerName,
        status,
        createdAt: new Date().toISOString(),
      };
      sessionStorage.setItem('lastOrder', JSON.stringify(orderRecord));
    } catch (_) {
      // ignore storage errors
    }
  }, [id, customerName, status]);

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

  if (!paymentVerified && sessionId) {
    return (
      <div className="container-responsive py-8 md:py-16 mx-8 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500 mx-auto mb-4"></div>
        <p className="text-gray-600">Verifying your payment...</p>
      </div>
    );
  }

  return (
    <div className="container-responsive py-8 md:py-16 mx-8 text-center">
      <h1 className="text-3xl text-brand font-bold">{customerName ? `Thank you, ${customerName}!` : 'Thank you!'}</h1>
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

      {/* Compact Order Details */}
      {orderDetails && orderDetails.items && orderDetails.items.length > 0 && (
        <div className="max-w-md mx-auto mt-8">
          <div className="text-left">
            <h3 className="text-sm font-medium text-muted mb-3">Your Order</h3>
            <div className="space-y-2">
              {orderDetails.items.map((item: any, index: number) => (
                <div key={index} className="flex justify-between text-sm">
                  <span className="text-muted">
                    {item.qty}x {item.name}
                    {item.spiceLevel && ` (${item.spiceLevel})`}
                  </span>
                  <span className="text-muted">{formatCurrency(item.total)}</span>
                </div>
              ))}
              <div className="border-t border-gray-200 pt-2 mt-3 space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="text-muted">Subtotal</span>
                  <span className="text-muted">{formatCurrency(orderDetails.subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted">Tax (7.5%)</span>
                  <span className="text-muted">{formatCurrency(orderDetails.tax)}</span>
                </div>
                <div className="flex justify-between text-sm font-medium pt-1 border-t border-gray-200">
                  <span>Total</span>
                  <span>{formatCurrency(orderDetails.total)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
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
