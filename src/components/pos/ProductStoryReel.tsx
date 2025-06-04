
"use client";

import type { FC } from 'react';
import Image from 'next/image';
import type { Product } from '@/types/pos';
import { Badge } from '@/components/ui/badge';

interface ProductStoryReelProps {
  products: Product[];
  onProductSelect?: (product: Product) => void; // Optional: if circles should open details
}

const ProductStoryReel: FC<ProductStoryReelProps> = ({ products, onProductSelect }) => {
  if (!products || products.length === 0) {
    return null;
  }

  const overlayOptions: string[] = [
    "New", 
    "5% off", 
    "10% off",
    "7% off" 
  ];

  return (
    <div className="container mx-auto mb-8 px-0">
      <div className="overflow-x-auto whitespace-nowrap py-3 no-scrollbar flex gap-3 sm:gap-4 px-0"> {/* Changed pl-4 pr-4 to px-0 */}
        {products.map((product, index) => {
          const isFifthItem = (index + 1) % 5 === 0;
          
          const selectedOverlayText = overlayOptions[index % overlayOptions.length];

          return (
            <div
              key={product.id}
              className="inline-flex flex-col items-center cursor-pointer group first:ml-4 last:mr-4 md:first:ml-0 md:last:mr-0" // Add margin for first/last on mobile, remove on md+
              onClick={() => onProductSelect && onProductSelect(product)}
              tabIndex={onProductSelect ? 0 : -1}
              onKeyDown={(e) => onProductSelect && e.key === 'Enter' && onProductSelect(product)}
              aria-label={`View ${product.name}`}
            >
              <div className="relative w-16 h-16 sm:w-20 sm:h-20">
                {isFifthItem && (
                  <div
                    className="absolute inset-[-2px] rounded-full pulsating-color-border z-0"
                  />
                )}
                <div
                  className="w-full h-full rounded-full overflow-hidden border-2 border-primary/30 
                             group-hover:border-primary shadow-md transition-all duration-200 
                             relative transform group-hover:scale-105 z-10 bg-background"
                >
                  <Image
                    src={product.image}
                    alt={product.name}
                    layout="fill"
                    objectFit="cover"
                    className="rounded-full"
                    data-ai-hint={product.dataAiHint || product.category.toLowerCase()}
                    priority={index < 5} 
                    loading={index < 5 ? "eager" : "lazy"}
                  />
                </div>
              </div>

              <div className="h-5 mt-1 flex items-center justify-center">
                {selectedOverlayText === "New" && (
                  <Badge variant="default" className="bg-green-600 hover:bg-green-700 text-white text-[10px] px-1.5 py-0.5 leading-none">New</Badge>
                )}
                {(selectedOverlayText === "5% off" || selectedOverlayText === "10% off" || selectedOverlayText === "7% off") && (
                  <Badge variant="destructive" className="text-[10px] px-1.5 py-0.5 leading-none">{selectedOverlayText}</Badge>
                )}
              </div>
              
              <p className="text-xs text-center mt-0.5 w-16 sm:w-20 truncate text-muted-foreground group-hover:text-primary transition-colors">
                {product.name}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ProductStoryReel;
