"use client";

import type { FC } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter, SheetClose } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import CartItem from '@/components/pos/CartItem';
import type { CartItem as CartItemType } from '@/types/pos';
import { ShoppingCart, X, CreditCard } from 'lucide-react';

interface CartSheetProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItemType[];
  onUpdateQuantity: (productId: string, delta: number) => void;
  onRemoveItem: (productId: string) => void;
  onCheckout: () => void;
  totalPrice: string;
}

const CartSheet: FC<CartSheetProps> = ({
  isOpen,
  onClose,
  cart,
  onUpdateQuantity,
  onRemoveItem,
  onCheckout,
  totalPrice,
}) => {
  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent className="w-full sm:max-w-md flex flex-col p-0 shadow-2xl">
        <SheetHeader className="p-6 border-b border-border">
          <SheetTitle className="text-2xl font-headline text-primary flex items-center">
            <ShoppingCart className="mr-3 h-6 w-6" /> Your Cart
          </SheetTitle>
        </SheetHeader>
        
        <div className="flex-grow overflow-y-auto px-6 py-2">
          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <ShoppingCart className="h-16 w-16 text-muted-foreground mb-4" />
              <p className="text-lg text-muted-foreground">Your cart is empty.</p>
              <p className="text-sm text-muted-foreground">Add some products to get started!</p>
            </div>
          ) : (
            cart.map((item) => (
              <CartItem
                key={item.id}
                item={item}
                onUpdateQuantity={onUpdateQuantity}
                onRemoveItem={onRemoveItem}
              />
            ))
          )}
        </div>
        
        {cart.length > 0 && (
          <SheetFooter className="p-6 border-t border-border bg-muted/30">
            <div className="w-full">
              <div className="flex justify-between items-center mb-4">
                <span className="text-lg font-semibold">Total:</span>
                <span className="text-xl font-bold text-primary">${totalPrice}</span>
              </div>
              <Button onClick={onCheckout} className="w-full text-lg py-6 bg-primary hover:bg-primary/90">
                <CreditCard className="mr-2 h-5 w-5" /> Proceed to Checkout
              </Button>
            </div>
          </SheetFooter>
        )}
         <SheetClose asChild>
            <Button variant="ghost" onClick={onClose} className="absolute top-4 right-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-secondary sm:hidden">
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </Button>
          </SheetClose>
      </SheetContent>
    </Sheet>
  );
};

export default CartSheet;
