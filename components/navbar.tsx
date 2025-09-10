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
  const isOrderSubpage = pathname.startsWith('/order/') && !isOrderPage;

  // Handle scroll detection for all pages
  useMotionValueEvent(scrollY, 'change', (v) => {
    const threshold = 120; // px from top
    const next = v > threshold;
    if (next !== scrolled) setNavScrolled(next);
  });

  // On order page, hide navbar when scrolled to give more space for menu browsing
  const shouldHideNavbar = isOrderPage && scrolled;

  return (
    <header
      className={cn(
        'z-30 transition-all duration-200 ease-in-out',
        shouldHideNavbar
          ? 'hidden'
          : scrolled
          ? 'sticky top-0 md:top-2'
          : 'block absolute left-0 right-0 top-4 md:top-8'
      )}>
      <div
        className={cn(
          'transition duration-200 ease-in-out max-w-5xl mx-auto border',
          scrolled
            ? 'rounded-none md:rounded-2xl shadow-md md:shadow-lg backdrop-blur-xl border-black/10 bg-gradient-to-r from-white/90 to-white/80'
            : 'border-transparent bg-transparent',
          isHomePage && !scrolled && open ? 'bg-white/10 backdrop-blur-xl' : ''
        )}>
        <div className="container-responsive h-16 items-center grid grid-cols-3">
          {/* Left region (desktop): Menu, Contact always on left */}
          <nav className={cn('hidden items-center justify-self-end text-lg md:flex gap-24')}>
            <Link
              href="/menu"
              className={cn(
                'nav-link transition-colors',
                isHomePage && !scrolled ? 'text-white hover:text-white/80' : 'hover:text-brand',
                pathname === '/menu' && 'active'
              )}>
              Menu
            </Link>
            <Link
              href="/contact"
              className={cn(
                'nav-link transition-colors',
                isHomePage && !scrolled ? 'text-white hover:text-white/80' : 'hover:text-brand',
                pathname === '/contact' && 'active'
              )}>
              Contact
            </Link>
          </nav>

          {/* Center logo (desktop) / Center controls (mobile) */}
          <div id="nav-center" className="flex items-center justify-center">
            {/* Desktop: Logo in center */}
            <AnimatePresence initial={false}>
              {(scrolled || !isHomePage) && (
                <Link href="/" className="hidden md:block">
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

            {/* Mobile: Menu button and page name in center */}
            <div className="flex items-center gap-3 md:hidden">
              <button
                aria-label="Toggle menu"
                aria-expanded={open}
                onClick={() => setOpen((v) => !v)}
                className={cn(
                  'inline-flex h-9 w-9 items-center justify-center rounded-md border border-white/10  text-white',
                  isHomePage && !scrolled ? 'bg-transparent' : 'bg-amber-500/70 hover:bg-amber-500/90'
                )}>
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

              {/* Current page name */}
              <span className={cn('text-sm font-medium', isHomePage && !scrolled ? 'text-white' : 'text-gray-700')}>
                {pathname === '/menu'
                  ? 'Menu'
                  : pathname === '/contact'
                  ? 'Contact'
                  : pathname === '/catering'
                  ? 'Catering'
                  : pathname === '/order'
                  ? 'Order'
                  : pathname === '/order/checkout'
                  ? 'Checkout'
                  : pathname === '/order/status'
                  ? 'Order Status'
                  : 'Home'}
              </span>
            </div>
          </div>

          {/* Right region (desktop): Catering, Order always on right, closer to center */}
          <nav className={cn('hidden items-center justify-self-start text-lg md:flex gap-24')}>
            <Link
              href="/catering"
              className={cn(
                'nav-link transition-colors',
                isHomePage && !scrolled ? 'text-white hover:text-white/80' : 'hover:text-brand',
                pathname === '/catering' && 'active'
              )}>
              Catering
            </Link>
            <Link
              href="/order"
              className={cn(
                'nav-link transition-colors',
                isHomePage && !scrolled ? 'text-white hover:text-white/80' : 'hover:text-brand',
                pathname === '/order' && 'active'
              )}>
              Order
            </Link>
          </nav>

          {/* Mobile Haveli Logo */}
          <div className="flex items-center md:hidden justify-self-start ml-14">
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

          {/* Mobile right: Empty space for balance */}
          <div className="flex items-center md:hidden justify-self-end mr-4">{/* Empty for balance */}</div>
        </div>

        {/* Mobile menu panel */}
        <div
          className={cn(
            'md:hidden overflow-hidden transition-[max-height,opacity] duration-300 z-100 shadow-md',
            open ? 'max-h-64 opacity-100 backdrop-blur-md' : 'max-h-0 opacity-0'
          )}>
          <div
            className={cn(
              'flex flex-col gap-2 py-2 text-sm ',
              isHomePage && !scrolled ? 'text-white hover:text-white/80' : 'bg-white'
            )}>
            <Link
              href="/menu"
              className={cn('rounded-md px-2 py-2 hover:bg-black/5 nav-link', pathname === '/menu' && 'active')}
              onClick={() => setOpen(false)}>
              Menu
            </Link>
            <Link
              href="/order"
              className={cn('rounded-md px-2 py-2 hover:bg-black/5 nav-link', pathname === '/order' && 'active')}
              onClick={() => setOpen(false)}>
              Order
            </Link>
            <Link
              href="/catering"
              className={cn('rounded-md px-2 py-2 hover:bg-black/5 nav-link', pathname === '/catering' && 'active')}
              onClick={() => setOpen(false)}>
              Catering
            </Link>
            <Link
              href="/contact"
              className={cn('rounded-md px-2 py-2 hover:bg-black/5 nav-link', pathname === '/contact' && 'active')}
              onClick={() => setOpen(false)}>
              Contact
            </Link>
          </div>
        </div>
      </div>

      {/* Floating Cart Icon - hidden on order subpages and hidden on order page when scrolled */}
      {!isOrderSubpage && (
        <div className="absolute top-4 right-4 md:right-8 z-40">
          <div
            className={cn(
              'flex items-center justify-center p-2 rounded-full border border-black/20 transition-all duration-300',
              scrolled || !isHomePage
                ? 'bg-white/90 dark:bg-black/70 text-black dark:text-white hover:bg-gray-200'
                : 'bg-black/30 text-white hover:bg-white/20'
            )}>
            <CartSheet />
          </div>
        </div>
      )}
    </header>
  );
}
