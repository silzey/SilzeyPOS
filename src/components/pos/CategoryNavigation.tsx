"use client";

import type { FC } from 'react';
import { Button } from '@/components/ui/button';
import type { Category } from '@/types/pos';

interface CategoryNavigationProps {
  categories: Category[];
  activeCategory: Category;
  onSelectCategory: (category: Category) => void;
}

const CategoryNavigation: FC<CategoryNavigationProps> = ({ categories, activeCategory, onSelectCategory }) => {
  return (
    <nav className="mb-8" aria-label="Product categories">
      <div className="container mx-auto flex justify-center flex-wrap gap-3 sm:gap-4">
        {categories.map((category) => (
          <Button
            key={category}
            variant={activeCategory === category ? "default" : "secondary"}
            onClick={() => onSelectCategory(category)}
            className="rounded-full px-4 sm:px-6 py-2 text-sm sm:text-base shadow-sm hover:shadow-md transition-all duration-200"
            aria-pressed={activeCategory === category}
          >
            {category}
          </Button>
        ))}
      </div>
    </nav>
  );
};

export default CategoryNavigation;
