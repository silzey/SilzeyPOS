"use client";

import type { FC } from 'react';
import { Button } from '@/components/ui/button';
import { ShoppingBag } from 'lucide-react';

interface HeaderProps {
  cartItemCount: number;
  onOpenCart: () => void;
}

const Header: FC<HeaderProps> = ({ cartItemCount, onOpenCart }) => {
  return (
    <header className="py-6 mb-6">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-3xl sm:text-4xl font-bold font-headline text-primary">
          Silzey POS
        </h1>
        <Button
          onClick={onOpenCart}
          variant="outline"
          className="rounded-full shadow-md hover:shadow-lg transition-shadow duration-300 group"
          aria-label={`Open cart with ${cartItemCount} items`}
        >
          <ShoppingBag className="h-5 w-5 mr-2 group-hover:text-primary transition-colors" />
          <span className="font-semibold">Cart</span>
          {cartItemCount > 0 && (
            <span className="ml-2 bg-primary text-primary-foreground text-xs font-bold px-2 py-0.5 rounded-full">
              {cartItemCount}
            </span>
          )}
        </Button>
      </div>
    </header>
  );
};

export default Header;
