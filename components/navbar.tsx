'use client';
import Link from 'next/link';
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import { useUIStore } from '@/store/ui';
import { usePathname } from 'next/navigation';
import { CartSheet } from './cart-sheet';

export function Navbar() {
  const [open, setOpen] = useState(false);
  const { scrollY } = useScroll();
  // Access store values individually to avoid object creation on each render
  const scrolled = useUIStore((s) => s.navScrolled);
  const setNavScrolled = useUIStore((s) => s.setNavScrolled);
  const pathname = usePathname();
  const isHomePage = pathname === '/';
  const isOrderPage = pathname === '/order';

  // Handle scroll detection for all pages
  useMotionValueEvent(scrollY, 'change', (v) => {
    const threshold = 120; // px from top
    const next = v > threshold;
    if (next !== scrolled) setNavScrolled(next);
  });

  // On order page, hide navbar when scrolled to give more space for menu browsing
  const shouldHideNavbar = isOrderPage && scrolled;
  // On order page when scrolled, hide floating cart since it moves to filter bar
  const shouldHideFloatingCart = isOrderPage && scrolled;

  return (
    <header
      className={cn(
        'z-30 transition-all duration-300 ease-in-out',
        shouldHideNavbar 
          ? 'hidden' 
          : scrolled 
            ? 'sticky top-0 md:top-2' 
            : 'hidden md:block absolute left-0 right-0 top-8'
      )}>
      {/* Floating Cart Icon - hidden on order page when scrolled */}
      {!shouldHideFloatingCart && (
        <div className="fixed top-4 right-4 z-40">
          <div
            className={cn(
              'flex items-center justify-center p-2 rounded-full shadow-lg transition-all duration-300',
              scrolled || !isHomePage
                ? 'bg-white/90 dark:bg-black/70 text-black dark:text-white'
                : 'bg-black/30 text-white'
            )}>
            <CartSheet />
          </div>
        </div>
      )}
      <div
        className={cn(
          'transition duration-300 ease-in-out max-w-4xl mx-auto border border-transparent',
          scrolled
            ? 'rounded-none md:rounded-2xl shadow-lg backdrop-blur-xl border-black/10 bg-gradient-to-r from-white/90 to-white/80 supports-[backdrop-filter]:bg-white/70 dark:border-white/10 dark:from-black/40 dark:to-black/30 dark:supports-[backdrop-filter]:bg-black/20'
            : 'border-transparent bg-transparent'
        )}>
        <div className={cn('container-responsive grid h-16 items-center', 'grid-cols-2 md:grid-cols-[auto_auto_auto]')}>
          {/* Left region (desktop): Menu, Contact always on left */}
          <nav className={cn('hidden items-center justify-self-end text-lg md:flex gap-24')}>
            <Link
              href="/menu"
              className={cn(
                'nav-link transition-colors',
                isHomePage && !scrolled ? 'text-white hover:text-white/80' : 'hover:text-[--color-brand]'
              )}>
              Menu
            </Link>
            <Link
              href="/contact"
              className={cn(
                'nav-link transition-colors',
                isHomePage && !scrolled ? 'text-white hover:text-white/80' : 'hover:text-[--color-brand]'
              )}>
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
                    layoutId={isHomePage ? 'haveli-logo' : 'nav-logo'}
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
          <nav className={cn('hidden items-center justify-self-start text-lg md:flex gap-24')}>
            <Link
              href="/catering"
              className={cn(
                'nav-link transition-colors',
                isHomePage && !scrolled ? 'text-white hover:text-white/80' : 'hover:text-[--color-brand]'
              )}>
              Catering
            </Link>
            <Link
              href="/order"
              className={cn(
                'nav-link transition-colors',
                isHomePage && !scrolled ? 'text-white hover:text-white/80' : 'hover:text-[--color-brand]'
              )}>
              Order
            </Link>
          </nav>

          {/* Mobile logo (shown when scrolled on home page, or always on other pages) */}
          <div className="flex items-center md:hidden ml-4">
            <AnimatePresence initial={false}>
              {(scrolled || !isHomePage) && (
                <Link href="/">
                  <motion.img
                    key="mobile-nav-logo"
                    layoutId={isHomePage ? 'haveli-logo-mobile' : 'mobile-nav-logo'}
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
          <div className="flex items-center gap-6 md:hidden justify-self-end mr-4">
            <Link href="/order" className="relative inline-flex items-center gap-2" onClick={() => setOpen(false)}>
              <span
                className={cn(
                  isHomePage && !scrolled ? 'text-white hover:text-white/80' : 'hover:text-[--color-brand]'
                )}>
                Order
              </span>
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
            <Link
              href="/menu"
              className={cn(
                'rounded-md px-2 py-2 hover:bg-black/5',
                isHomePage && !scrolled ? 'text-white hover:text-white/80' : ''
              )}
              onClick={() => setOpen(false)}>
              Menu
            </Link>
            <Link
              href="/catering"
              className={cn(
                'rounded-md px-2 py-2 hover:bg-black/5',
                isHomePage && !scrolled ? 'text-white hover:text-white/80' : ''
              )}
              onClick={() => setOpen(false)}>
              Catering
            </Link>
            <Link
              href="/contact"
              className={cn(
                'rounded-md px-2 py-2 hover:bg-black/5',
                isHomePage && !scrolled ? 'text-white hover:text-white/80' : ''
              )}
              onClick={() => setOpen(false)}>
              Contact
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
