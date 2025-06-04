
"use client";

import type { FC } from 'react';
import Image from 'next/image';
import type { Product } from '@/types/pos';

interface ProductStoryReelProps {
  products: Product[];
  onProductSelect?: (product: Product) => void; // Optional: if circles should open details
}

const ProductStoryReel: FC<ProductStoryReelProps> = ({ products, onProductSelect }) => {
  if (!products || products.length === 0) {
    return null;
  }

  return (
    <div className="container mx-auto mb-8 px-0">
      <div className="overflow-x-auto whitespace-nowrap py-3 no-scrollbar flex gap-3 sm:gap-4 pl-4 pr-4">
        {products.map((product, index) => {
          const isFifthItem = (index + 1) % 5 === 0;
          return (
            <div
              key={product.id}
              className="inline-flex flex-col items-center cursor-pointer group"
              onClick={() => onProductSelect && onProductSelect(product)}
              tabIndex={onProductSelect ? 0 : -1}
              onKeyDown={(e) => onProductSelect && e.key === 'Enter' && onProductSelect(product)}
              aria-label={`View ${product.name}`}
            >
              {/* Sized Relative Wrapper for positioning */}
              <div className="relative w-16 h-16 sm:w-20 sm:h-20">
                {isFifthItem && (
                  <div
                    className="absolute inset-[-2px] rounded-full rotating-red-border z-0"
                    // inset-[-2px] makes it 2px larger on all sides than its parent before its own border.
                    // The .rotating-red-border class applies its own border (e.g., border-2).
                  />
                )}
                {/* Image Container */}
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
                    priority={index < 5} // Prioritize first few images
                    loading={index < 5 ? "eager" : "lazy"} // Eager load first few
                  />
                </div>
              </div>
              <p className="text-xs text-center mt-1.5 w-16 sm:w-20 truncate text-muted-foreground group-hover:text-primary transition-colors">
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
