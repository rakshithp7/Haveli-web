'use client';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { formatCurrency } from '@/lib/utils';
import { useCartStore } from '@/store/cart';
import { toast } from '@/components/ui/use-toast';
import { MenuItem } from '@/data/menu';

interface MenuItemCardProps {
  item: MenuItem;
  onOpenModal: (item: MenuItem) => void;
}

export function MenuItemCard({ item, onOpenModal }: MenuItemCardProps) {
  const { remove, setQty, getItemQuantity, findCartItemsByBaseId } = useCartStore();

  // Quantity control sub-component
  const QuantityControl = () => {
    const currentQty = getItemQuantity(item.id);

    if (currentQty === 0) {
      return (
        <Button onClick={() => onOpenModal(item)} className="w-full">
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
            // Get all variations of this item in the cart
            const cartItems = findCartItemsByBaseId(item.id);

            if (cartItems.length === 0) {
              // This shouldn't happen, but handle it gracefully
              return;
            }

            // If only one item or one variation left, remove it
            if (currentQty === 1 || (cartItems.length === 1 && cartItems[0].qty === 1)) {
              remove(cartItems[0].cartId);
              toast.success(`${item.name} removed from cart`);
            } else {
              // Multiple items, just decrease the first one we find
              // This is a simplified approach - ideally you'd open the modal to select which variation to decrease
              setQty(cartItems[0].cartId, cartItems[0].qty - 1);
            }
          }}
          className="h-8 w-10 p-0 hover:bg-red-100 hover:text-red-600">
          −
        </Button>
        <span className="px-8 py-1 bg-white rounded font-medium min-w-[2rem] text-center">{currentQty}</span>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onOpenModal(item)}
          className="h-8 w-10 p-0 hover:bg-green-100 hover:text-green-600">
          +
        </Button>
      </div>
    );
  };

  return (
    <Card className="overflow-hidden border border-black/10 rounded-xl">
      <div className="relative aspect-[4/3]">
        <Image src={item.image} alt={item.name} fill className="object-cover" />
      </div>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <h3 className="font-medium text-lg">{item.name}</h3>
          <span className="text-brand font-semibold">{formatCurrency(item.priceCents)}</span>
        </div>
        <p className="mt-1 line-clamp-2 text-sm text-muted">{item.description}</p>
        <div className="mt-2 flex gap-2">
          {item.veg && <Badge className="badge-veg">🌿 Veg</Badge>}
          {item.spicy && <Badge className="badge-spicy">🌶 Spicy</Badge>}
        </div>
        <div className="mt-4">
          <QuantityControl />
        </div>
      </CardContent>
    </Card>
  );
}
