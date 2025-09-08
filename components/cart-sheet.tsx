'use client';
import { useState } from 'react';
import { useCartStore } from '@/store/cart';
import { formatCurrency } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { getItemById } from '@/data/menu';
import Image from 'next/image';
import Link from 'next/link';
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
  SheetClose,
} from '@/components/ui/sheet';
import { ShoppingCart } from 'lucide-react';

export function CartSheet() {
  const lines = useCartStore((s) => s.lines);
  const remove = useCartStore((s) => s.remove);
  const setQty = useCartStore((s) => s.setQty);
  const count = useCartStore((s) => Object.values(s.lines).reduce((a, l) => a + l.qty, 0));
  const [open, setOpen] = useState(false);

  const subtotal = Object.values(lines).reduce((a, l) => a + l.priceCents * l.qty, 0);
  const taxRate = 0.075; // 7.5% sales tax
  const taxAmount = Math.round(subtotal * taxRate);
  const totalWithTax = subtotal + taxAmount;

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <button className="relative inline-flex items-center justify-center">
          <ShoppingCart className="h-5 w-5" />
          {count > 0 && (
            <span className="absolute -right-2 -top-2 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-amber-500 px-1 text-[10px] text-white">
              {count}
            </span>
          )}
        </button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-md flex flex-col bg-white">
        <SheetHeader>
          <SheetTitle>Your Cart</SheetTitle>
        </SheetHeader>

        <div className="flex-grow overflow-y-auto py-4 border-t pt-4">
          {Object.keys(lines).length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <ShoppingCart className="h-12 w-12 mb-4 text-muted-foreground" />
              <p className="text-muted-foreground mb-4">Your cart is empty</p>
              <SheetClose asChild>
                <Link href="/order">
                  <Button variant="outline">Browse Menu</Button>
                </Link>
              </SheetClose>
            </div>
          ) : (
            <ul className="divide-y divide-black/5">
              {Object.values(lines).map((l) => {
                const menuItem = getItemById(l.id);
                return (
                  <li key={l.id} className="py-4">
                    <div className="flex gap-3">
                      {/* Item Image */}
                      <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                        <Image
                          src={menuItem?.image || '/images/placeholder.svg'}
                          alt={l.name}
                          fill
                          className="object-cover"
                          sizes="64px"
                        />
                      </div>
                      
                      {/* Item Details */}
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <p className="font-medium text-sm">{l.name}</p>
                            {/* Badges and customizations */}
                            <div className="flex flex-wrap gap-1 mt-1">
                              {menuItem?.veg && <Badge className="badge-veg text-xs py-0 px-1">🌿</Badge>}
                              {menuItem?.spicy && <Badge className="badge-spicy text-xs py-0 px-1">🌶</Badge>}
                              {l.spiceLevel && (
                                <Badge className="bg-orange-100 text-orange-700 text-xs py-0 px-1">
                                  {l.spiceLevel}
                                </Badge>
                              )}
                            </div>
                            {/* Special Instructions */}
                            {l.specialInstructions && (
                              <p className="text-xs text-gray-600 mt-1 italic">
                                Note: {l.specialInstructions}
                              </p>
                            )}
                          </div>
                          <span className="font-medium text-sm">{formatCurrency(l.qty * l.priceCents)}</span>
                        </div>
                        
                        {/* Quantity Controls */}
                        <div className="flex items-center justify-between mt-2">
                          <div className="flex items-center gap-2">
                            <button
                              className="h-6 w-6 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50"
                              onClick={() => setQty(l.id, l.qty - 1)}>
                              <span className="text-xs">−</span>
                            </button>
                            <span className="w-6 text-center text-sm font-medium">{l.qty}</span>
                            <button
                              className="h-6 w-6 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50"
                              onClick={() => setQty(l.id, l.qty + 1)}>
                              <span className="text-xs">+</span>
                            </button>
                          </div>
                          <button 
                            className="text-xs text-red-600 hover:text-red-700"
                            onClick={() => remove(l.id)}>
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {Object.keys(lines).length > 0 && (
          <SheetFooter className="border-t pt-4">
            <div className="w-full space-y-4">
              {/* Subtotal */}
              <div className="flex justify-between text-sm">
                <span>Subtotal</span>
                <span>{formatCurrency(subtotal)}</span>
              </div>
              
              {/* Tax */}
              <div className="flex justify-between text-sm text-gray-600">
                <span>Tax (7.5%)</span>
                <span>{formatCurrency(taxAmount)}</span>
              </div>
              
              {/* Total */}
              <div className="flex justify-between text-lg font-semibold border-t pt-2">
                <span>Total</span>
                <span>{formatCurrency(totalWithTax)}</span>
              </div>
              
              <SheetClose asChild>
                <Link href="/order" className="w-full">
                  <Button className="w-full bg-amber-500 hover:bg-amber-600 text-white">
                    Checkout • {formatCurrency(totalWithTax)}
                  </Button>
                </Link>
              </SheetClose>
            </div>
          </SheetFooter>
        )}
      </SheetContent>
    </Sheet>
  );
}
