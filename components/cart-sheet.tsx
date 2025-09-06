'use client';
import { useState } from 'react';
import { useCartStore } from '@/store/cart';
import { formatCurrency } from '@/lib/utils';
import { Button } from '@/components/ui/button';
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
              {Object.values(lines).map((l) => (
                <li key={l.id} className="py-3">
                  <div className="flex justify-between">
                    <p className="font-medium">{l.name}</p>
                    <span className="font-medium">{formatCurrency(l.qty * l.priceCents)}</span>
                  </div>
                  <div className="flex items-center justify-between mt-1">
                    <div className="flex items-center gap-2">
                      <button
                        className="h-6 w-6 rounded-full border border-gray-200 flex items-center justify-center"
                        onClick={() => setQty(l.id, l.qty - 1)}>
                        -
                      </button>
                      <span className="w-6 text-center text-sm">{l.qty}</span>
                      <button
                        className="h-6 w-6 rounded-full border border-gray-200 flex items-center justify-center"
                        onClick={() => setQty(l.id, l.qty + 1)}>
                        +
                      </button>
                    </div>
                    <button className="text-xs text-red-600" onClick={() => remove(l.id)}>
                      Remove
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {Object.keys(lines).length > 0 && (
          <SheetFooter className="border-t pt-4">
            <div className="w-full space-y-4">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-medium">{formatCurrency(subtotal)}</span>
              </div>
              <SheetClose asChild>
                <Link href="/order" className="w-full">
                  <Button className="w-full bg-green-600 text-white hover:bg-green-700">Checkout</Button>
                </Link>
              </SheetClose>
            </div>
          </SheetFooter>
        )}
      </SheetContent>
    </Sheet>
  );
}
