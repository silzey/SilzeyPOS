"use client";

import type { FC } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ShoppingBag, User } from 'lucide-react';

interface HeaderProps {
  cartItemCount: number;
  onOpenCart: () => void;
}

const Header: FC<HeaderProps> = ({ cartItemCount, onOpenCart }) => {
  return (
    <header className="sticky top-0 z-40 bg-background py-6 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-3xl sm:text-4xl font-bold font-headline text-primary">
          Silzey POS
        </h1>
        <div className="flex items-center gap-3">
          <Link href="/profile" passHref>
            <Button
              variant="outline"
              size="icon"
              className="rounded-full shadow-md hover:shadow-lg transition-shadow duration-300 group"
              aria-label="View user profile"
            >
              <User className="h-5 w-5 group-hover:text-primary transition-colors" />
            </Button>
          </Link>
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
      </div>
    </header>
  );
};

export default Header;