
"use client";

import type { FC } from 'react';
import Image from 'next/image';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'; // Removed DialogDescription from imports
import { Button } from '@/components/ui/button';
import StarRating from '@/components/pos/StarRating';
import type { Product } from '@/types/pos';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart, X } from 'lucide-react';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (product: Product) => void;
}

const ProductDetailModal: FC<ProductDetailModalProps> = ({ product, onClose, onAddToCart }) => {
  if (!product) return null;

  const handleAddToCart = () => {
    onAddToCart(product);
    onClose();
  };

  return (
    <Dialog open={!!product} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="sm:max-w-lg p-0 overflow-hidden shadow-2xl animate-modal-fade-in">
        <DialogHeader className="p-6 pb-0">
          <div className="relative w-full aspect-[16/10] rounded-lg overflow-hidden mb-4">
            <Image
              src={product.image}
              alt={product.name}
              layout="fill"
              objectFit="cover"
              data-ai-hint={product.dataAiHint || product.category.toLowerCase()}
              priority
            />
          </div>
          <DialogTitle className="text-xl sm:text-2xl font-headline text-primary">{product.name}</DialogTitle>
          {/* Replaced DialogDescription with a div to prevent p > div nesting */}
          <div className="flex justify-between items-center pt-1 text-sm text-muted-foreground"> {/* Added text-sm text-muted-foreground to mimic DialogDescription's typical text styling */}
            <Badge variant="secondary">{product.tags}</Badge>
            <StarRating rating={product.rating} />
          </div>
        </DialogHeader>
        
        <div className="p-6 pt-2">
          <p className="text-xl sm:text-2xl font-semibold text-foreground mb-4">
            Price: ${product.price}
          </p>
          {/* Add more product details here if needed */}
        </div>

        <DialogFooter className="p-6 bg-muted/50 flex-col sm:flex-row gap-2 sm:gap-0">
          <Button variant="outline" onClick={onClose} className="w-full sm:w-auto">
            <X className="mr-2 h-4 w-4" /> Close
          </Button>
          <Button onClick={handleAddToCart} className="w-full sm:w-auto bg-primary hover:bg-primary/90">
            <ShoppingCart className="mr-2 h-4 w-4" /> Add to Cart
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ProductDetailModal;
