
"use client";

import type { FC } from 'react';
import Image from 'next/image';
import type { ReelDisplayProduct } from '@/types/pos'; // Updated to use ReelDisplayProduct
import { Badge } from '@/components/ui/badge';

interface ProductStoryReelProps {
  products: ReelDisplayProduct[];
  onProductSelect?: (product: ReelDisplayProduct) => void;
}

const ProductStoryReel: FC<ProductStoryReelProps> = ({ products, onProductSelect }) => {
  if (!products || products.length === 0) {
    return null;
  }

  const getBadgeVariant = (badgeType?: string): "default" | "secondary" | "destructive" | "outline" => {
    if (!badgeType || badgeType.toLowerCase() === "none") return "default"; // Effectively hidden or no style
    if (badgeType.toLowerCase().includes("new")) return "default"; // Default 'New' will be green
    if (badgeType.toLowerCase().includes("off")) return "destructive"; // Discounts are red
    if (badgeType.toLowerCase().includes("featured")) return "secondary"; // Featured is secondary style
    if (badgeType.toLowerCase().includes("limited")) return "outline"; // Limited is outline
    return "default";
  };

  const getBadgeClassName = (badgeType?: string): string => {
     if (!badgeType || badgeType.toLowerCase() === "none") return "";
     if (badgeType.toLowerCase().includes("new")) return "bg-green-600 hover:bg-green-700 text-white";
     return ""; // Other variants will use their default shadcn styling
  }

  return (
    <div className="container mx-auto mb-8 px-0">
      <div className="overflow-x-auto whitespace-nowrap py-3 no-scrollbar flex gap-3 sm:gap-4 px-0">
        {products.map((product, index) => {
          const showBadge = product.badgeType && product.badgeType.toLowerCase() !== 'none';
          
          return (
            <div
              key={product.id}
              className="inline-flex flex-col items-center cursor-pointer group first:ml-4 last:mr-4 md:first:ml-0 md:last:mr-0"
              onClick={() => onProductSelect && onProductSelect(product)}
              tabIndex={onProductSelect ? 0 : -1}
              onKeyDown={(e) => onProductSelect && e.key === 'Enter' && onProductSelect(product)}
              aria-label={`View ${product.name}`}
            >
              <div className="relative w-16 h-16 sm:w-20 sm:h-20">
                {product.pulsatingBorder && (
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
                {showBadge && (
                  <Badge 
                    variant={getBadgeVariant(product.badgeType)} 
                    className={`${getBadgeClassName(product.badgeType)} text-[10px] px-1.5 py-0.5 leading-none`}
                  >
                    {product.badgeType}
                  </Badge>
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
