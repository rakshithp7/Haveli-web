'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCartStore } from '@/store/cart';
import { formatCurrency } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

export default function CheckoutPage() {
  const router = useRouter();
  const lines = useCartStore((s) => s.lines);
  const clear = useCartStore((s) => s.clear);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');
  const [isHydrated, setIsHydrated] = useState(false);

  // Form state
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');

  // Manually hydrate the Zustand store when the component mounts (client-side only)
  useEffect(() => {
    useCartStore.persist.rehydrate();
    setIsHydrated(true);
  }, []);

  // Calculate totals
  const subtotal = Object.values(lines).reduce((a, l) => a + l.priceCents * l.qty, 0);
  const taxRate = 0.075; // 7.5% sales tax
  const taxAmount = Math.round(subtotal * taxRate);
  const totalWithTax = subtotal + taxAmount;

  // Show loading state while store is hydrating
  if (!isHydrated) {
    return (
      <div className="container max-w-3xl mx-auto py-12 px-4 text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-500 mx-auto mb-4"></div>
        <p className="text-gray-600">Loading checkout...</p>
      </div>
    );
  }

  // If cart is empty after hydration, show empty state
  if (Object.keys(lines).length === 0) {
    return (
      <div className="container max-w-3xl mx-auto py-12 px-4 text-center">
        <h1 className="text-2xl font-bold mb-4">Your cart is empty</h1>
        <p className="text-muted mb-6">Add some items to proceed to checkout.</p>
        <Button onClick={() => router.push('/order')} className="bg-amber-500 hover:bg-amber-600! text-white">
          Browse Menu
        </Button>
      </div>
    );
  }

  // Handle form submission and payment
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Form validation
    if (!name.trim()) {
      setError('Please enter your name');
      return;
    }

    if (!phone.trim()) {
      setError('Please enter your phone number');
      return;
    }

    try {
      setIsProcessing(true);
      setError('');

      // Create line items with customizations for API
      const lineItems = Object.values(lines).map((item) => ({
        id: item.id,
        qty: item.qty,
        spiceLevel: item.spiceLevel,
        specialInstructions: item.specialInstructions,
      }));

      // Create Stripe checkout session
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          lines: lineItems,
          customerInfo: { name, phone },
        }),
      });

      const data = await response.json();

      if (!response.ok || data.error) {
        throw new Error(data.error || 'Failed to create checkout session');
      }

      if (!data.url) {
        throw new Error('Missing checkout URL');
      }

      // Store order details for status page before redirecting
      try {
        const orderDetails = {
          orderId: data.orderId,
          customerName: name,
          items: lineItems.map(item => {
            const menuItem = Object.values(lines).find(l => l.id === item.id);
            return {
              ...item,
              name: menuItem?.name || '',
              priceCents: menuItem?.priceCents || 0,
              total: (menuItem?.priceCents || 0) * item.qty
            };
          }),
          subtotal: Object.values(lines).reduce((sum, item) => sum + (item.priceCents * item.qty), 0),
          tax: Math.round(Object.values(lines).reduce((sum, item) => sum + (item.priceCents * item.qty), 0) * 0.075),
          total: totalWithTax
        };
        sessionStorage.setItem(`orderDetails_${data.orderId}`, JSON.stringify(orderDetails));
      } catch (e) {
        console.warn('Could not store order details:', e);
      }

      // Redirect to Stripe checkout (don't clear cart until payment is confirmed)
      window.location.href = data.url;
    } catch (err) {
      console.error('Checkout error:', err);
      setError(err instanceof Error ? err.message : 'Payment processing failed');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="container max-w-3xl mx-auto py-12 px-4">
      <h1 className="text-2xl font-bold text-center mb-8">Complete Your Order</h1>

      {error && <div className="bg-red-50 text-red-700 p-4 rounded-md mb-6">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid gap-12 md:grid-cols-5">
          {/* Contact info form */}
          <div className="md:col-span-3">
            <h2 className="font-semibold text-lg">Contact Information</h2>

            <div className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium mb-1">
                  Full Name
                </label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your name"
                  required
                />
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium mb-1">
                  Phone Number
                </label>
                <Input
                  id="phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Enter your phone number"
                  required
                />
              </div>
            </div>
          </div>
          {/* Order summary section */}
          <div className="md:col-span-2 space-y-4">
            <h2 className="font-semibold text-lg">Order Summary</h2>

            <div className="space-y-2 max-h-64 overflow-y-auto">
              {Object.values(lines).map((item) => (
                <div key={item.cartId} className="flex justify-between text-sm">
                  <div>
                    <span className="font-medium">{item.name}</span>
                    <span className="text-gray-500 ml-1">×{item.qty}</span>
                  </div>
                  <span>{formatCurrency(item.priceCents * item.qty)}</span>
                </div>
              ))}
            </div>

            <div className="border-t pt-4 space-y-2">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>{formatCurrency(subtotal)}</span>
              </div>

              <div className="flex justify-between text-gray-600">
                <span>Tax (7.5%)</span>
                <span>{formatCurrency(taxAmount)}</span>
              </div>

              <div className="flex justify-between font-semibold text-lg">
                <span>Total</span>
                <span>{formatCurrency(totalWithTax)}</span>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-amber-500 hover:bg-amber-600! text-white"
              disabled={isProcessing}>
              {isProcessing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Redirecting to Payment...
                </>
              ) : (
                `Continue to Payment • ${formatCurrency(totalWithTax)}`
              )}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
