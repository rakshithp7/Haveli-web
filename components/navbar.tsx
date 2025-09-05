'use client';
import Link from 'next/link';
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from 'framer-motion';
import { useCartStore } from '@/store/cart';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import { useUIStore } from '@/store/ui';
import { usePathname } from 'next/navigation';

export function Navbar() {
  const count = useCartStore((s) => s.totalQuantity);
  const [open, setOpen] = useState(false);
  const { scrollY } = useScroll();
  const { scrolled, setNavScrolled } = useUIStore((s) => ({
    scrolled: s.navScrolled,
    setNavScrolled: s.setNavScrolled,
  }));
  const pathname = usePathname();
  const isHomePage = pathname === '/';

  // Handle scroll detection for all pages
  useMotionValueEvent(scrollY, 'change', (v) => {
    const threshold = 120; // px from top
    const next = v > threshold;
    if (next !== scrolled) setNavScrolled(next);
  });

  return (
    <header
      className={cn(
        'z-30 transition-all duration-300 ease-in-out',
        scrolled ? 'sticky top-2' : 'absolute left-0 right-0 top-8'
      )}>
      <div
        className={cn(
          'transition-colors transition-shadow transition-transform duration-300 ease-in-out max-w-5xl mx-auto border border-transparent',
          scrolled
            ? 'rounded-2xl border-white/10 bg-gradient-to-r from-black/40 to-black/30 shadow-lg backdrop-blur-xl supports-[backdrop-filter]:bg-black/20'
            : 'border-transparent bg-transparent'
        )}>
        <div className={cn('container-responsive grid h-16 items-center', 'grid-cols-2 md:grid-cols-[auto_auto_auto]')}>
          {/* Left region (desktop): Menu, Contact always on left */}
          <nav className={cn('hidden items-center justify-self-end text-lg md:flex', scrolled ? 'gap-12' : 'gap-24')}>
            <Link href="/menu" className="hover:text-[--color-brand]">
              Menu
            </Link>
            <Link href="/contact" className="hover:text-[--color-brand]">
              Contact
            </Link>
          </nav>

          {/* Center logo (shown when scrolled on home page, or always on other pages) */}
          <div id="nav-center" className="hidden items-center justify-center md:flex">
            <AnimatePresence initial={false}>
              {(scrolled || !isHomePage) && (
                <Link href="/">
                  <motion.img
                    key="nav-logo"
                    layoutId={isHomePage ? "haveli-logo" : "nav-logo"}
                    src="/logo.webp"
                    alt="Haveli"
                    width={120}
                    height={36}
                    className="h-8 w-auto cursor-pointer hover:opacity-80 transition-opacity duration-200"
                    transition={{ type: 'spring', stiffness: 500, damping: 40, mass: 0.6 }}
                  />
                </Link>
              )}
            </AnimatePresence>
          </div>

          {/* Right region (desktop): Catering, Order always on right, closer to center */}
          <nav className={cn('hidden items-center justify-self-start text-lg md:flex', scrolled ? 'gap-12' : 'gap-24')}>
            <Link href="/catering" className="hover:text-[--color-brand]">
              Catering
            </Link>
            <Link href="/order" className="relative inline-flex items-center gap-2">
              <span>Order</span>
              {count > 0 && (
                <span className="absolute -right-2 -top-2 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-[--color-brand] px-1 text-[10px] text-white">
                  {count}
                </span>
              )}
            </Link>
          </nav>

          {/* Mobile logo (shown when scrolled on home page, or always on other pages) */}
          <div className="flex items-center md:hidden">
            <AnimatePresence initial={false}>
              {(scrolled || !isHomePage) && (
                <Link href="/">
                  <motion.img
                    key="mobile-nav-logo"
                    layoutId={isHomePage ? "haveli-logo-mobile" : "mobile-nav-logo"}
                    src="/logo.webp"
                    alt="Haveli"
                    width={100}
                    height={30}
                    className="h-6 w-auto cursor-pointer hover:opacity-80 transition-opacity duration-200"
                    transition={{ type: 'spring', stiffness: 500, damping: 40, mass: 0.6 }}
                  />
                </Link>
              )}
            </AnimatePresence>
          </div>

          {/* Mobile controls */}
          <div className="flex items-center gap-2 md:hidden justify-self-end">
            <Link href="/order" className="relative inline-flex items-center gap-2" onClick={() => setOpen(false)}>
              <span>Order</span>
              {count > 0 && (
                <span className="absolute -right-2 -top-2 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-[--color-brand] px-1 text-[10px] text-white">
                  {count}
                </span>
              )}
            </Link>
            <button
              aria-label="Toggle menu"
              aria-expanded={open}
              onClick={() => setOpen((v) => !v)}
              className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-white/10 bg-black/20 hover:bg-black/30 text-white">
              {open ? (
                // Close icon
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              ) : (
                // Hamburger icon
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round">
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <line x1="3" y1="12" x2="21" y2="12" />
                  <line x1="3" y1="18" x2="21" y2="18" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile menu panel */}
        <div
          className={cn(
            'md:hidden overflow-hidden transition-[max-height,opacity] duration-300',
            open ? 'max-h-64 opacity-100' : 'max-h-0 opacity-0'
          )}>
          <div className="flex flex-col gap-2 py-2 text-sm">
            <Link href="/menu" className="rounded-md px-2 py-2 hover:bg-black/5" onClick={() => setOpen(false)}>
              Menu
            </Link>
            <Link href="/catering" className="rounded-md px-2 py-2 hover:bg-black/5" onClick={() => setOpen(false)}>
              Catering
            </Link>
            <Link href="/contact" className="rounded-md px-2 py-2 hover:bg-black/5" onClick={() => setOpen(false)}>
              Contact
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
