"use client";

import type { FC } from 'react';
import Image from 'next/image';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import StarRating from '@/components/pos/StarRating';
import type { Product } from '@/types/pos';
import { Badge } from '@/components/ui/badge';

interface ProductCardProps {
  product: Product;
  onProductSelect: (product: Product) => void;
}

const ProductCard: FC<ProductCardProps> = ({ product, onProductSelect }) => {
  return (
    <Card 
      className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col h-full cursor-pointer group"
      onClick={() => onProductSelect(product)}
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onProductSelect(product)}
      aria-label={`View details for ${product.name}`}
    >
      <CardHeader className="p-0 relative aspect-[4/3] overflow-hidden">
        <Image
          src={product.image}
          alt={product.name}
          width={300}
          height={225}
          className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
          data-ai-hint={product.dataAiHint || product.category.toLowerCase()}
          priority={false} 
          loading="lazy"
        />
      </CardHeader>
      <CardContent className="p-4 flex-grow">
        <CardTitle className="text-lg font-headline mb-1 truncate group-hover:text-primary transition-colors">
          {product.name}
        </CardTitle>
        <div className="flex justify-between items-center mb-2">
          <Badge variant="secondary" className="text-xs">{product.tags}</Badge>
          <StarRating rating={product.rating} starSize={16} />
        </div>
        <p className="text-xl font-semibold text-foreground mb-1">
          ${product.price}
        </p>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button 
          variant="outline" 
          className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-200"
          aria-hidden="true" 
          tabIndex={-1} 
        >
          View Details
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProductCard;
