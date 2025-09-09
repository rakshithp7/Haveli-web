'use client';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatCurrency } from '@/lib/utils';
import { useCartStore } from '@/store/cart';
import { toast } from '@/components/ui/use-toast';
import { MenuItem } from '@/data/menu';

interface MenuItemCardProps {
  item: MenuItem;
  onOpenModal: (item: MenuItem) => void;
}

export function MenuItemCard({ item, onOpenModal }: MenuItemCardProps) {
  const { lines, remove, setQty } = useCartStore();

  // Quantity control sub-component
  const QuantityControl = () => {
    const currentQty = lines[item.id]?.qty || 0;

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
            if (currentQty === 1) {
              remove(item.id);
              toast.success(`${item.name} removed from cart`);
            } else {
              setQty(item.id, currentQty - 1);
            }
          }}
          className="h-8 w-8 p-0 hover:bg-red-100 hover:text-red-600">
          −
        </Button>
        <span className="px-3 py-1 bg-white rounded font-medium min-w-[2rem] text-center">{currentQty}</span>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onOpenModal(item)}
          className="h-8 w-8 p-0 hover:bg-green-100 hover:text-green-600">
          +
        </Button>
      </div>
    );
  };

  return (
    <div className="card overflow-hidden">
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
          <QuantityControl />
        </div>
      </div>
    </div>
  );
}
