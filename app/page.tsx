'use client';
import Link from 'next/link';
import Image from 'next/image';
import { menu } from '@/data/menu';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatCurrency } from '@/lib/utils';
import { testimonials } from '@/data/testimonials';
import { useUIStore } from '@/store/ui';
import { motion, AnimatePresence } from 'framer-motion';

export default function HomePage() {
  const featured = menu.filter((m) => m.featured).slice(0, 6);
  const { navScrolled: scrolled } = useUIStore();

  return (
    <div>
      {/* Hero */}
      <section className="relative grid min-h-screen place-items-center overflow-hidden">
        {/* Hero background with image and gradient overlay */}
        <div
          className="pointer-events-none absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: 'url(/images/hero-bg.jpg)' }}
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[rgba(20,24,36,0.85)] via-[rgba(20,24,36,0.7)] to-[rgba(20,24,36,0.9)]" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(245,158,11,0.15),transparent_40%),radial-gradient(circle_at_80%_30%,rgba(245,158,11,0.1),transparent_35%),radial-gradient(circle_at_50%_80%,rgba(245,158,11,0.12),transparent_35%)]" />
        <div className="container-responsive relative z-10 grid place-items-center py-16 sm:py-24 text-center">
          <div className="max-w-2xl">
            <h1 className="sr-only">Haveli — Authentic Indian Cuisine</h1>
            <AnimatePresence mode="wait" initial={false}>
              {!scrolled && (
                <motion.img
                  key="hero-logo"
                  layoutId="haveli-logo"
                  src="/logo.webp"
                  alt="Haveli"
                  width={240}
                  height={72}
                  className="mx-auto h-auto w-[240px] md:w-[400px] xl:w-[500px]"
                  transition={{ type: 'spring', stiffness: 500, damping: 40, mass: 0.6 }}
                />
              )}
            </AnimatePresence>
            <p className="mt-6 inline-block rounded-full bg-[--color-brand]/10 px-4 py-1.5 text-[--color-brand] text-lg font-medium tracking-wide">
              Authentic Indian Cuisine
            </p>
            <h2 className="mt-5 text-2xl md:text-3xl lg:text-4xl font-light tracking-wide leading-relaxed">
              From our tandoor to your table. <br />
              <span className="font-medium text-[--color-brand]">Fresh, vibrant, and unforgettable.</span>
            </h2>
            <div className="mt-8 flex items-center justify-center gap-4">
              <Button
                asChild
                variant="default"
                size="lg"
                className="transform hover:translate-y-[-2px] transition-all duration-200 text-base font-medium">
                <Link href="/menu">View Menu</Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="backdrop-blur-xl transform hover:translate-y-[-2px] transition-all duration-200 text-base font-medium">
                <Link href="/order">Start Order</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Featured items */}
      <section className="container-responsive py-10">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold">Featured</h2>
          <Link href="/menu" className="text-sm text-[--color-brand]">
            See full menu →
          </Link>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((item) => (
            <div key={item.id} className="card overflow-hidden transition hover:shadow-lg">
              <div className="relative aspect-[4/3]">
                <Image src={item.image} alt={item.name} fill className="object-cover" />
              </div>
              <CardContent>
                <div className="flex items-center justify-between">
                  <h3 className="font-medium">{item.name}</h3>
                  <span className="text-[--color-brand] font-semibold">{formatCurrency(item.priceCents)}</span>
                </div>
                <p className="mt-1 line-clamp-2 text-sm text-muted">{item.description}</p>
                <div className="mt-2 flex gap-2">
                  {item.veg && <Badge className="badge-veg">🌿 Veg</Badge>}
                  {item.spicy && <Badge className="badge-spicy">🌶 Spicy</Badge>}
                </div>
              </CardContent>
            </div>
          ))}
        </div>
      </section>

      {/* Hours/Location */}
      <section className="container-responsive grid gap-6 py-10 sm:grid-cols-2">
        <Card>
          <CardContent>
            <h3 className="mb-2 text-lg font-semibold">Hours</h3>
            <ul className="text-sm text-muted">
              <li>Mon–Thu: 11:30am – 9:00pm</li>
              <li>Fri–Sat: 11:30am – 10:00pm</li>
              <li>Sun: 12:00pm – 9:00pm</li>
            </ul>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <h3 className="mb-2 text-lg font-semibold">Location</h3>
            <p className="text-sm text-muted">123 Spice Rd, Your City, ST</p>
            <div className="mt-3 overflow-hidden rounded-md">
              <iframe
                title="Google Map"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3153.019205322699!2d-122.41941568467737!3d37.77492957975924!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzfCsDQ2JzI5LjciTiAxMjLCsDI1JzA3LjkiVw!5e0!3m2!1sen!2sus!4v1610000000000"
                width="100%"
                height="220"
                loading="lazy"
              />
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Testimonials */}
      <section className="bg-black/30 py-10">
        <div className="container-responsive">
          <h2 className="mb-4 text-xl font-semibold">What guests say</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {testimonials.map((t, i) => (
              <Card key={i}>
                <CardContent>
                  <p className="text-sm">“{t.text}”</p>
                  <p className="mt-2 text-xs text-muted">— {t.name}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
