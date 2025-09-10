'use client';
import { useState } from 'react';
import Image from 'next/image';
import { useCartStore } from '@/store/cart';
import { formatCurrency } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/components/ui/use-toast';
import { cn } from '@/lib/utils';

export type SpiceLevel = 'mild' | 'medium' | 'spicy' | 'indian-spicy';

interface ItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: {
    id: string;
    name: string;
    description: string;
    priceCents: number;
    image: string;
    veg?: boolean;
    spicy?: boolean;
  } | null;
}

export function ItemModal({ isOpen, onClose, item }: ItemModalProps) {
  const [quantity, setQuantity] = useState(1);
  const [spiceLevel, setSpiceLevel] = useState<SpiceLevel | null>(null);
  const [specialInstructions, setSpecialInstructions] = useState('');
  const add = useCartStore((s) => s.add);

  if (!item) return null;

  // Debug: log item properties
  console.log('Modal item:', item, 'spicy:', item.spicy);

  const handleAddToCart = () => {
    // Add item to cart with selected quantity, spice level, and special instructions
    add(
      { id: item.id, name: item.name, priceCents: item.priceCents },
      quantity,
      spiceLevel || undefined,
      specialInstructions || undefined
    );

    // Show success toast
    const spiceText = spiceLevel ? ` (${spiceLevel} spice)` : '';
    const instructionsText = specialInstructions ? ' with special instructions' : '';
    toast.success(`${quantity}x ${item.name}${spiceText}${instructionsText} added to cart`);

    // Reset modal state and close
    setQuantity(1);
    setSpiceLevel(null);
    setSpecialInstructions('');
    onClose();
  };

  const incrementQuantity = () => setQuantity((prev) => prev + 1);
  const decrementQuantity = () => setQuantity((prev) => Math.max(1, prev - 1));

  const spiceLevels: { value: SpiceLevel; label: string; emoji: string }[] = [
    { value: 'mild', label: 'Mild', emoji: '🌶️' },
    { value: 'medium', label: 'Medium', emoji: '🌶️🌶️' },
    { value: 'spicy', label: 'Spicy', emoji: '🌶️🌶️🌶️' },
    { value: 'indian-spicy', label: 'Indian Spicy', emoji: '🌶️🌶️🌶️🌶️' },
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-8 pb-8">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative w-full max-w-md bg-white rounded-lg shadow-xl max-h-[calc(100vh-4rem)] overflow-hidden flex flex-col">
        {/* Image - Top portion */}
        <div className="relative w-full aspect-[3/2]">
          <Image
            src={item.image}
            alt={item.name}
            fill
            className="object-cover w-full h-full"
            sizes="(max-width: 448px) 100vw, 448px"
          />
        </div>

        {/* Content - Scrollable */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {/* Header */}
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">{item.name}</h2>
            <span className="text-lg text-amber-500 font-bold">{formatCurrency(item.priceCents)}</span>
          </div>

          {/* Badges */}
          <div className="flex gap-2">
            {item.veg && <Badge className="badge-veg">🌿 Veg</Badge>}
            {item.spicy && <Badge className="badge-spicy">🌶 Spicy</Badge>}
          </div>

          {/* Description */}
          <p className="text-sm text-muted leading-relaxed">{item.description}</p>

          {/* Quantity Controls */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Quantity</label>
            <div className="flex items-center justify-center bg-gray-50 rounded-lg p-2 w-32">
              <Button variant="ghost" size="sm" onClick={decrementQuantity} className="h-8 w-8 p-0 hover:bg-gray-200">
                −
              </Button>
              <span className="px-4 py-1 bg-white rounded font-medium min-w-[2rem] text-center">{quantity}</span>
              <Button variant="ghost" size="sm" onClick={incrementQuantity} className="h-8 w-8 p-0 hover:bg-gray-200">
                +
              </Button>
            </div>
          </div>

          {/* Spice Level (optional) - Debug: always show */}
          {(item.spicy || true) && (
            <div className="space-y-2">
              <label className="text-sm font-medium">Spice Level (Optional)</label>
              <div className="grid grid-cols-2 gap-2">
                {spiceLevels.map((level) => (
                  <button
                    key={level.value}
                    onClick={() => setSpiceLevel(spiceLevel === level.value ? null : level.value)}
                    className={`p-2 text-xs rounded-md border transition-colors ${
                      spiceLevel === level.value
                        ? 'border-amber-500 bg-amber-50 text-amber-600'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}>
                    <div className="text-center">
                      <div className="text-sm">{level.emoji}</div>
                      <div className="font-medium">{level.label}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Special Instructions */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Special Instructions (Optional)</label>
            <Textarea
              placeholder="e.g., No onions, extra sauce, make it mild, etc."
              value={specialInstructions}
              onChange={(e) => setSpecialInstructions(e.target.value)}
              className="w-full min-h-[80px] resize-none"
              rows={3}
            />
          </div>
        </div>

        {/* Add to Cart Button - Fixed at bottom */}
        <div className="flex flex-row gap-2 p-6 pt-4 border-t border-gray-300 bg-white">
          <Button variant="destructive" onClick={onClose} className="w-10 hover:bg-gray-100">
            X
          </Button>
          <Button onClick={handleAddToCart} className="w-full bg-amber-500 hover:bg-amber-600! text-white">
            Add {quantity} to Cart • {formatCurrency(item.priceCents * quantity)}
          </Button>
        </div>
      </div>
    </div>
  );
}
