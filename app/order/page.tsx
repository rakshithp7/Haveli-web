'use client';
import { useState, useEffect, useRef } from 'react';
import { categories, getMenuByCategory, MenuItem } from '@/data/menu';
import { TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { useUIStore } from '@/store/ui';
import { CartSheet } from '@/components/cart-sheet';
import { ItemModal } from '@/components/item-modal';
import { MenuItemCard } from '@/components/menu-item-card';

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
  const scrolled = useUIStore((s) => s.navScrolled);

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<{
    id: string;
    name: string;
    description: string;
    priceCents: number;
    image: string;
    veg?: boolean;
    spicy?: boolean;
  } | null>(null);

  const openItemModal = (item: MenuItem) => {
    setSelectedItem(item);
    setModalOpen(true);
  };

  // We've moved the QuantityControl component to MenuItemCard
  const [loading, setLoading] = useState(true);
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});

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
      <div className="sticky top-0 z-10 bg-white shadow-sm py-4">
        <div className="container mx-auto px-4 flex flex-wrap items-center justify-between gap-4 relative">
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

          {/* Cart icon in filter bar when scrolled - positioned at far right */}
          {scrolled && (
            <div className="absolute right-4 top-1/2 -translate-y-1/2 translate-x-22 flex items-center justify-center p-2 rounded-full bg-white/90 hover:bg-gray-200 transition-colors border border-black/20">
              <CartSheet />
            </div>
          )}
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
                filteredItems.map((item) => <MenuItemCard key={item.id} item={item} onOpenModal={openItemModal} />)
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
                      <MenuItemCard key={item.id} item={item} onOpenModal={openItemModal} />
                    ))}
              </div>
            </section>
          ))}
      </div>

      {/* Item Modal */}
      <ItemModal isOpen={modalOpen} onClose={() => setModalOpen(false)} item={selectedItem} />
    </div>
  );
}
