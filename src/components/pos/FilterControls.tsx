"use client";

import type { FC } from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, ListFilter, ArrowDownUp } from 'lucide-react';

interface FilterControlsProps {
  sortOption: string;
  onSortChange: (value: string) => void;
  tags: string[];
  selectedTag: string;
  onTagChange: (value: string) => void;
  searchTerm: string;
  onSearchChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const FilterControls: FC<FilterControlsProps> = ({
  sortOption,
  onSortChange,
  tags,
  selectedTag,
  onTagChange,
  searchTerm,
  onSearchChange,
}) => {
  return (
    <div className="mb-8">
      <div className="container mx-auto flex flex-col sm:flex-row justify-center items-center gap-4 sm:gap-6">
        <div className="relative w-full sm:w-auto">
          <ArrowDownUp className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Select value={sortOption} onValueChange={onSortChange}>
            <SelectTrigger className="w-full sm:w-[180px] pl-10 shadow-sm" aria-label="Sort products">
              <SelectValue placeholder="Sort by..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="A-Z">Name: A-Z</SelectItem>
              <SelectItem value="PriceLowHigh">Price: Low to High</SelectItem>
              <SelectItem value="PriceHighLow">Price: High to Low</SelectItem>
              <SelectItem value="Rating">Rating: High to Low</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="relative w-full sm:w-auto">
          <ListFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Select value={selectedTag} onValueChange={onTagChange}>
            <SelectTrigger className="w-full sm:w-[180px] pl-10 shadow-sm" aria-label="Filter by tag">
              <SelectValue placeholder="Filter by tag..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Tags</SelectItem>
              {tags.map((tag) => (
                <SelectItem key={tag} value={tag}>
                  {tag}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="relative w-full sm:w-auto sm:flex-grow max-w-xs">
           <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={onSearchChange}
            className="w-full pl-10 shadow-sm"
            aria-label="Search products"
          />
        </div>
      </div>
    </div>
  );
};

export default FilterControls;
