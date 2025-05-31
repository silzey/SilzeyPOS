"use client";

import type { FC } from 'react';
import ProductCard from '@/components/pos/ProductCard';
import { Button } from '@/components/ui/button';
import type { Product } from '@/types/pos';
import { PackageOpen } from 'lucide-react';

interface ProductGridProps {
  products: Product[];
  onProductSelect: (product: Product) => void;
  onLoadMore: () => void;
  canLoadMore: boolean;
}

const ProductGrid: FC<ProductGridProps> = ({ products, onProductSelect, onLoadMore, canLoadMore }) => {
  if (products.length === 0) {
    return (
      <div className="container mx-auto text-center py-12">
        <PackageOpen className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
        <p className="text-xl text-muted-foreground">No products found matching your criteria.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-8">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} onProductSelect={onProductSelect} />
        ))}
      </div>
      {canLoadMore && (
        <div className="text-center mb-8">
          <Button onClick={onLoadMore} variant="default" size="lg" className="shadow-md hover:shadow-lg transition-shadow duration-300">
            Load More Products
          </Button>
        </div>
      )}
    </div>
  );
};

export default ProductGrid;
