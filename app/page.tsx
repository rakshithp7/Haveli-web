'use client';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { testimonials } from '@/data/testimonials';
import { useUIStore } from '@/store/ui';
import { motion, AnimatePresence } from 'framer-motion';
import { OpenStatusBadge } from '@/components/open-status-badge';
import GradientText from '@/components/ui/GradientText';

export default function HomePage() {
  const { navScrolled: scrolled } = useUIStore();

  return (
    <div className="-mt-24">
      {/* Hero */}
      <section className="text-white relative grid min-h-screen place-items-center overflow-hidden">
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
            {/* Logo container with fixed dimensions to reserve space */}
            <div className="h-[140px] w-[240px] md:h-[240px] md:w-[400px] xl:h-[300px] xl:w-[500px] mx-auto">
              <AnimatePresence mode="wait" initial={false}>
                {!scrolled && (
                  <Link href="/">
                    <motion.img
                      key="hero-logo"
                      layoutId="haveli-logo"
                      src="/logo.webp"
                      alt="Haveli"
                      width={240}
                      height={72}
                      className="mx-auto h-auto w-[240px] md:w-[400px] xl:w-[500px] cursor-pointer hover:opacity-90 transition-opacity duration-200"
                      transition={{ type: 'spring', stiffness: 500, damping: 40, mass: 0.6 }}
                    />
                  </Link>
                )}
              </AnimatePresence>
            </div>
            <p className="mt-6 inline-block rounded-full bg-brand/10 px-4 py-1.5 text-brand text-lg font-medium tracking-wide">
              Authentic Indian Cuisine
            </p>
            <h2 className="mt-5 text-2xl md:text-3xl lg:text-4xl font-light tracking-wide leading-relaxed">
              From our <i>tandoor</i> to your <i>table</i>. <br />
              {/* <SplitText
                text="Fresh, vibrant, and unforgettable."
                delay={100}
                className="font-medium text-brand"
                duration={0.8}
                splitType="chars"
                from={{ opacity: 0, y: 40 }}
                to={{ opacity: 1, y: 0 }}
                tag="span"
                ease="power3.out"
                onLetterAnimationComplete={() => console.log('Letter animation complete')}
              /> */}
              {/* <ShinyText
                text="Fresh, vibrant, and unforgettable."
                disabled={false}
                speed={3}
                className="font-medium text-brand"
              /> */}
              <GradientText colors={['#f59e0b', '#b45309', '#f59e0b']} animationSpeed={10} showBorder={false}>
                Fresh, vibrant, and unforgettable.
              </GradientText>
            </h2>
            <div className="mt-8 flex items-center justify-center gap-4">
              <Button asChild variant="default" size="lg">
                <Link href="/menu">View Menu</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/order">Start Order</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Featured items */}
      {/* <section className="container-responsive py-10">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold">Featured</h2>
          <Link href="/menu" className="text-sm text-brand">
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
                  <span className="text-brand font-semibold">{formatCurrency(item.priceCents)}</span>
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
      </section> */}

      {/* Hours/Location */}
      <section className="container-responsive grid gap-6 py-10 sm:grid-cols-2 px-4">
        <Card>
          <CardContent>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-semibold">Hours</h3>
              <OpenStatusBadge />
            </div>
            <ul className="text-sm text-muted space-y-1">
              <li>
                <span className="font-medium">Monday:</span> 11:30am–3pm, 5pm–10pm
              </li>
              <li>
                <span className="font-medium">Tuesday:</span> Closed
              </li>
              <li>
                <span className="font-medium">Wednesday:</span> 11:30am–3pm, 5pm–10pm
              </li>
              <li>
                <span className="font-medium">Thursday:</span> 11:30am–3pm, 5pm–10pm
              </li>
              <li>
                <span className="font-medium">Friday:</span> 11:30am–3pm, 5pm–11pm
              </li>
              <li>
                <span className="font-medium">Saturday:</span> 11:30am–3pm, 5pm–11pm
              </li>
              <li>
                <span className="font-medium">Sunday:</span> 11:30am–3pm, 5pm–10pm
              </li>
            </ul>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <h3 className="mb-2 text-lg font-semibold">Location</h3>
            <p className="text-sm text-muted">1251 E Fowler Ave, Tampa, FL 33612</p>
            <div className="mt-3 overflow-hidden rounded-md">
              <iframe
                title="Google Map"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3522.779595015724!2d-82.44811578498513!3d28.05393408265754!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x88c2c7b0a2d9762d%3A0xa4a741025efd9983!2sHaveli%20Indian%20Kitchen!5e0!3m2!1sen!2sus!4v1716264598830!5m2!1sen!2sus"
                width="100%"
                height="220"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-gradient-to-b from-black/10 to-black/20 px-4">
        <div className="container-responsive max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-sm tracking-wider text-brand uppercase font-semibold">Customer Experiences</span>
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-semibold mt-2">
              What Our <span className="text-brand">Guests</span> Say
            </h2>
            <div className="mt-2 w-24 h-1 bg-brand/70 mx-auto rounded-full"></div>
          </div>
          <div className="grid grid-cols-1 gap-8 md:gap-10 sm:grid-cols-2 lg:grid-cols-3">
            {testimonials.map((t, i) => (
              <Card
                key={i}
                className="overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 group bg-white/90 backdrop-blur-sm rounded-lg">
                <CardContent className="p-7 relative">
                  {/* Rating Stars */}
                  <div className="flex items-center mb-3 gap-1">
                    {[...Array(5)].map((_, starIndex) => (
                      <svg
                        key={starIndex}
                        xmlns="http://www.w3.org/2000/svg"
                        className={`w-4 h-4 ${starIndex < t.rating ? 'text-amber-400' : 'text-gray-300'}`}
                        fill="currentColor"
                        viewBox="0 0 24 24">
                        <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                      </svg>
                    ))}
                  </div>

                  {/* Quote mark */}
                  <div className="absolute top-4 right-6 text-5xl text-brand/10 group-hover:text-brand/15 transition-colors duration-300">
                    &ldquo;
                  </div>

                  {/* Review content */}
                  <div className="relative">
                    <p className="text-sm leading-relaxed line-clamp-5">{t.text}</p>

                    {/* Reviewer info */}
                    <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="h-10 w-10 rounded-full bg-brand/20 grid place-items-center text-brand font-medium">
                          {t.name.charAt(0)}
                        </div>
                        <div className="ml-3">
                          <p className="font-medium text-sm">{t.name}</p>
                          <p className="text-xs text-muted">Verified Customer</p>
                        </div>
                      </div>
                      {t.date && <div className="text-xs text-muted">{t.date}</div>}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* View more button */}
          <div className="flex justify-center mt-10">
            <Button variant="outline" className="border-brand text-brand hover:bg-brand/5 px-6">
              Read All Reviews
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
