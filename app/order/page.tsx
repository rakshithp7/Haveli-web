'use client';
import Image from 'next/image';
import { useState, useEffect, useRef, useMemo } from 'react';
import { categories, getMenuByCategory } from '@/data/menu';
import { formatCurrency } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select } from '@/components/ui/select';
import { useCartStore } from '@/store/cart';
import { useUIStore } from '@/store/ui';
import { toast } from '@/components/ui/use-toast';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { env } from '@/lib/env';
import { useRouter } from 'next/navigation';

const stripePromise = env.stripe.pk ? loadStripe(env.stripe.pk) : null;

const schema = z.object({
  name: z.string().min(2),
  phone: z.string().min(7),
  tipPercent: z.enum(['0', '10', '15', '20']).default('0'),
  pickup: z.enum(['ASAP', '+15', '+30']).default('ASAP'),
  notes: z.string().max(300).optional(),
});
type Values = z.infer<typeof schema>;

export default function OrderPage() {
  // Function to get icon based on category
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Appetizers Veg':
        return (
          <span role="img" aria-label="Vegetarian appetizers">
            🥗
          </span>
        );
      case 'Appetizers Non-Veg':
        return (
          <span role="img" aria-label="Non-vegetarian appetizers">
            🍗
          </span>
        );
      case 'Entrees Veg':
        return (
          <span role="img" aria-label="Vegetarian main course">
            🥘
          </span>
        );
      case 'Entrees Chicken':
        return (
          <span role="img" aria-label="Chicken main course">
            🍛
          </span>
        );
      case 'Breads':
        return (
          <span role="img" aria-label="Breads">
            🥖
          </span>
        );
      case 'Drinks':
        return (
          <span role="img" aria-label="Drinks">
            🥤
          </span>
        );
      default:
        return (
          <span role="img" aria-label="Food item">
            🍽️
          </span>
        );
    }
  };

  const [active, setActive] = useState(categories[0]);
  const [searchQuery, setSearchQuery] = useState('');
  const add = useCartStore((s) => s.add);
  const lines = useCartStore((s) => s.lines);
  const remove = useCartStore((s) => s.remove);
  const setQty = useCartStore((s) => s.setQty);
  const clear = useCartStore((s) => s.clear);
  const scrolled = useUIStore((s) => s.navScrolled);

  // Quantity control component
  const QuantityControl = ({ itemId, item }: { itemId: string; item: { id: string; name: string; priceCents: number } }) => {
    const currentQty = lines[itemId]?.qty || 0;

    if (currentQty === 0) {
      return (
        <Button
          onClick={() => {
            add(item, 1);
            toast.success(`${item.name} added to cart`);
          }}
          className="w-full">
          Add
        </Button>
      );
    }

    return (
      <div className="flex items-center justify-between bg-gray-50 rounded-lg p-1 w-full">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            if (currentQty === 1) {
              remove(itemId);
              toast.success(`${item.name} removed from cart`);
            } else {
              setQty(itemId, currentQty - 1);
            }
          }}
          className="h-8 w-8 p-0 hover:bg-red-100 hover:text-red-600">
          −
        </Button>
        <span className="px-3 py-1 bg-white rounded font-medium min-w-[2rem] text-center">
          {currentQty}
        </span>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            setQty(itemId, currentQty + 1);
            toast.success(`${item.name} added to cart`);
          }}
          className="h-8 w-8 p-0 hover:bg-green-100 hover:text-green-600">
          +
        </Button>
      </div>
    );
  };
  const [loading, setLoading] = useState(true);
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});

  const subtotal = useMemo(() => Object.values(lines).reduce((a, l) => a + l.priceCents * l.qty, 0), [lines]);
  const form = useForm<Values>({ resolver: zodResolver(schema), defaultValues: { tipPercent: '0', pickup: 'ASAP' } });
  const tipPercent = Number(form.watch('tipPercent'));
  const tipCents = Math.round((subtotal * tipPercent) / 100);
  const totalCents = subtotal + tipCents;

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 400);
    return () => clearTimeout(t);
  }, []);

  // Scroll to section when tab is clicked
  const scrollToSection = (category: typeof active) => {
    setActive(category);
    const sectionRef = sectionRefs.current[category];
    if (sectionRef) {
      sectionRef.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Update active tab based on scroll position
  useEffect(() => {
    if (loading) return;

    const handleScroll = () => {
      const scrollPosition = window.scrollY + 170; // Increased offset for the fixed header

      // Find which section is currently in view
      let currentSection = categories[0];
      for (const category of categories) {
        const section = sectionRefs.current[category];
        if (section && section.offsetTop <= scrollPosition) {
          currentSection = category;
        }
      }

      if (currentSection !== active) {
        setActive(currentSection);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [active, loading]);

  // Filter all items based on search query
  const filteredItems = searchQuery
    ? categories.flatMap((category) =>
        getMenuByCategory(category).filter(
          (item) =>
            item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.description.toLowerCase().includes(searchQuery.toLowerCase())
        )
      )
    : [];

  return (
    <div className="relative pb-4">
      {/* Fixed tabs section - higher z-index and positioned to be above navbar */}
      <div className="sticky top-0 z-40 bg-white shadow-sm py-4 border-b border-gray-100">
        <div className="container mx-auto px-4 flex flex-wrap items-center justify-between gap-4">
          <div className="overflow-x-auto flex-grow md:flex-grow-0 md:max-w-[75%] flex flex-row flex-nowrap items-center">
            {categories.map((c) => (
              <TabsTrigger
                key={c}
                value={c}
                active={active === c}
                onClick={() => scrollToSection(c)}
                className="mr-2 mb-0">
                {getCategoryIcon(c)}
                <span className="ml-2">{c}</span>
              </TabsTrigger>
            ))}
          </div>

          <div className="relative w-full md:w-auto max-w-[220px] shrink-0">
            <Input
              type="text"
              placeholder="Search menu..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pr-10"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
          </div>
        </div>
      </div>

      {/* Content container */}
      <div className="container mx-auto px-4 mt-4">
        {/* Show search results if there's a search query */}
        {searchQuery && (
          <section className="py-6 mx-auto">
            <h2 className="text-xl font-semibold mb-4">Search Results</h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {loading ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="card overflow-hidden">
                    <div className="skeleton aspect-[4/3]" />
                    <div className="p-4">
                      <div className="skeleton h-4 w-1/2" />
                      <div className="mt-2 skeleton h-3 w-3/4" />
                      <div className="mt-4 skeleton h-8 w-24" />
                    </div>
                  </div>
                ))
              ) : filteredItems.length > 0 ? (
                filteredItems.map((item) => (
                  <div key={item.id} className="card overflow-hidden">
                    <div className="relative aspect-[4/3]">
                      <Image 
                        src={item.image} 
                        alt={item.name} 
                        fill 
                        className="object-cover"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      />
                    </div>
                    <div className="p-4">
                      <div className="flex items-center justify-between">
                        <h3 className="font-medium">{item.name}</h3>
                        <span className="text-[--color-brand] font-semibold">{formatCurrency(item.priceCents)}</span>
                      </div>
                      <p className="mt-1 line-clamp-2 text-sm text-muted">{item.description}</p>
                      <div className="mt-2 flex gap-2">
                        {item.veg && <Badge className="badge-veg">🌿 Veg</Badge>}
                        {item.spicy && <Badge className="badge-spicy">🌶 Spicy</Badge>}
                      </div>
                      <div className="mt-4">
                        <QuantityControl 
                          itemId={item.id} 
                          item={{ id: item.id, name: item.name, priceCents: item.priceCents }} 
                        />
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-full text-center py-8">
                  <p className="text-lg text-muted">No items found matching &ldquo;{searchQuery}&rdquo;</p>
                </div>
              )}
            </div>
          </section>
        )}

        {/* Show all categories if there's no search query */}
        {!searchQuery &&
          categories.map((category) => (
            <section
              key={category}
              className="py-8 mx-auto scroll-m-36"
              ref={(el) => {
                sectionRefs.current[category] = el;
              }}>
              <h2 className="text-2xl font-semibold mb-6 flex items-center">
                {getCategoryIcon(category)}
                <span className="ml-2">{category}</span>
              </h2>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {loading
                  ? Array.from({ length: 3 }).map((_, i) => (
                      <div key={i} className="card overflow-hidden">
                        <div className="skeleton aspect-[4/3]" />
                        <div className="p-4">
                          <div className="skeleton h-4 w-1/2" />
                          <div className="mt-2 skeleton h-3 w-3/4" />
                          <div className="mt-4 skeleton h-8 w-24" />
                        </div>
                      </div>
                    ))
                  : getMenuByCategory(category).map((item) => (
                      <div key={item.id} className="card overflow-hidden">
                        <div className="relative aspect-[4/3]">
                          <Image 
                        src={item.image} 
                        alt={item.name} 
                        fill 
                        className="object-cover"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      />
                        </div>
                        <div className="p-4">
                          <div className="flex items-center justify-between">
                            <h3 className="font-medium">{item.name}</h3>
                            <span className="text-[--color-brand] font-semibold">
                              {formatCurrency(item.priceCents)}
                            </span>
                          </div>
                          <p className="mt-1 line-clamp-2 text-sm text-muted">{item.description}</p>
                          <div className="mt-2 flex gap-2">
                            {item.veg && <Badge className="badge-veg">🌿 Veg</Badge>}
                            {item.spicy && <Badge className="badge-spicy">🌶 Spicy</Badge>}
                          </div>
                          <div className="mt-4">
                            <QuantityControl 
                              itemId={item.id} 
                              item={{ id: item.id, name: item.name, priceCents: item.priceCents }} 
                            />
                          </div>
                        </div>
                      </div>
                    ))}
              </div>
            </section>
          ))}
      </div>
    </div>
  );
}

function CheckoutBox({
  totalCents,
  clearCart,
  lines,
  formValues,
}: {
  totalCents: number;
  clearCart: () => void;
  lines: ReturnType<typeof useCartStore.getState>['lines'];
  formValues: ReturnType<typeof useForm<Values>>;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);

  async function onSubmit() {
    if (!stripe || !elements) return;
    const values = formValues.getValues();
    setSubmitting(true);
    try {
      const res = await fetch('/api/create-payment-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lines: Object.values(lines).map((l) => ({ id: l.id, qty: l.qty })),
          tipPercent: Number(values.tipPercent),
          contact: { name: values.name, phone: values.phone },
          notes: values.notes,
        }),
      });
      if (!res.ok) throw new Error('Failed to create payment intent');
      const data = await res.json();
      const { clientSecret, orderId } = data;
      const result = await stripe.confirmPayment({
        elements,
        clientSecret,
        confirmParams: { return_url: window.location.origin + '/order/confirm?orderId=' + orderId },
        redirect: 'if_required',
      });
      if (result.error) throw result.error;
      clearCart();
      router.push(`/order/confirm?orderId=${orderId}`);
    } catch (e) {
      console.error(e);
      alert('Payment failed. Please check details and try again.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div>
      <PaymentElement />
      <Button onClick={onSubmit} disabled={submitting} className="w-full mt-3">
        {submitting ? 'Processing…' : `Pay ${formatCurrency(totalCents)}`}
      </Button>
    </div>
  );
}
