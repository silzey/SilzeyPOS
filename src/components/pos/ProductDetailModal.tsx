
"use client";

import type { FC } from 'react';
import Image from 'next/image';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import StarRating from '@/components/pos/StarRating';
import type { Product } from '@/types/pos';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart, X, MessageSquare } from 'lucide-react'; // Added MessageSquare for review icon
import { useToast } from "@/hooks/use-toast"; // Import useToast

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (product: Product) => void;
}

const ProductDetailModal: FC<ProductDetailModalProps> = ({ product, onClose, onAddToCart }) => {
  const { toast } = useToast(); // Initialize toast

  if (!product) return null;

  const handleAddToCart = () => {
    onAddToCart(product);
    onClose();
  };

  const handleWriteReview = () => {
    toast({
      title: "Feature Coming Soon!",
      description: "You'll soon be able to write and submit your product reviews here.",
    });
    // In a real app, you might open a new review submission modal or navigate to a review page.
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
          <div className="flex justify-between items-center pt-1 text-sm text-muted-foreground">
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
          <Button variant="outline" onClick={onClose} className="w-full sm:w-auto order-3 sm:order-1">
            <X className="mr-2 h-4 w-4" /> Close
          </Button>
          <Button 
            variant="secondary" 
            onClick={handleWriteReview} 
            className="w-full sm:w-auto order-2"
          >
            <MessageSquare className="mr-2 h-4 w-4" /> Write a Review
          </Button>
          <Button onClick={handleAddToCart} className="w-full sm:w-auto bg-primary hover:bg-primary/90 order-1 sm:order-3">
            <ShoppingCart className="mr-2 h-4 w-4" /> Add to Cart
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ProductDetailModal;
