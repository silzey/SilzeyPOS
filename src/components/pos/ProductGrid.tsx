
"use client";

import type { FC } from 'react';
import ProductCard from '@/components/pos/ProductCard';
import type { Product } from '@/types/pos';
import { PackageOpen } from 'lucide-react';

interface ProductGridProps {
  products: Product[];
  onProductSelect: (product: Product) => void;
}

const PRODUCTS_PER_ROW = 10;
const NUM_ROWS = 5;

const ProductGrid: FC<ProductGridProps> = ({ products, onProductSelect }) => {
  if (!products || products.length === 0) {
    return (
      <div className="container mx-auto text-center py-12">
        <PackageOpen className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
        <p className="text-xl text-muted-foreground">No products found matching your criteria.</p>
      </div>
    );
  }

  const rows: Product[][] = Array.from({ length: NUM_ROWS }, (_, rowIndex) => {
    const startIndex = rowIndex * PRODUCTS_PER_ROW;
    const endIndex = startIndex + PRODUCTS_PER_ROW;
    return products.slice(startIndex, endIndex);
  });

  return (
    <div className="container mx-auto space-y-8 py-4">
      {rows.map((rowItems, rowIndex) => (
        // We render a row container even if it's empty to maintain the 5-row structure,
        // but content within will only appear if rowItems has products.
        <div key={`row-${rowIndex}`} className="overflow-hidden rounded-lg shadow-sm border border-border/50 bg-muted/20 p-1">
          {/* Optional: Add a row title if desired in the future. For now, keeping it clean.
          <h3 className="text-md font-semibold mb-2 pl-3 pt-2 text-muted-foreground">Shelf {rowIndex + 1}</h3>
          */}
          <div className="flex overflow-x-auto space-x-4 p-3">
            {rowItems.length > 0 ? (
              rowItems.map((product) => (
                <div key={product.id} className="flex-shrink-0 w-56 md:w-60 lg:w-64">
                  <ProductCard product={product} onProductSelect={onProductSelect} />
                </div>
              ))
            ) : (
              <div className="flex items-center justify-center h-48 w-full text-muted-foreground italic text-sm">
                {/* This placeholder is for an empty row within the 5 rows if not enough products */}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProductGrid;
