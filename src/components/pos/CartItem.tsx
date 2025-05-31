"use client";

import type { FC } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import type { CartItem as CartItemType } from '@/types/pos';
import { Minus, Plus, Trash2 } from 'lucide-react';

interface CartItemProps {
  item: CartItemType;
  onUpdateQuantity: (productId: string, delta: number) => void;
  onRemoveItem: (productId: string) => void;
}

const CartItem: FC<CartItemProps> = ({ item, onUpdateQuantity, onRemoveItem }) => {
  return (
    <div className="flex gap-4 py-4 border-b border-border last:border-b-0">
      <Image
        src={item.image}
        alt={item.name}
        width={80}
        height={80}
        className="rounded-md object-cover"
        data-ai-hint={item.dataAiHint || item.category.toLowerCase()}
      />
      <div className="flex-grow">
        <h4 className="text-md font-semibold font-headline">{item.name}</h4>
        <p className="text-sm text-muted-foreground">{item.tags}</p>
        <p className="text-sm font-medium text-primary">${item.price} each</p>
      </div>
      <div className="flex flex-col items-end justify-between">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            onClick={() => onUpdateQuantity(item.id, -1)}
            aria-label={`Decrease quantity of ${item.name}`}
          >
            <Minus className="h-4 w-4" />
          </Button>
          <span className="w-8 text-center font-medium" aria-live="polite">{item.quantity}</span>
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            onClick={() => onUpdateQuantity(item.id, 1)}
            aria-label={`Increase quantity of ${item.name}`}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="text-destructive hover:text-destructive hover:bg-destructive/10 mt-1"
          onClick={() => onRemoveItem(item.id)}
          aria-label={`Remove ${item.name} from cart`}
        >
          <Trash2 className="h-4 w-4 mr-1" /> Remove
        </Button>
      </div>
    </div>
  );
};

export default CartItem;
