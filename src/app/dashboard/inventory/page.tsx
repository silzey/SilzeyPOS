
"use client";

import { useState, useMemo, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import { StatCard } from '@/components/dashboard/StatCard';
import type { InventoryItem, Category } from '@/types/pos';
import { Package, PackagePlus, PrinterIcon, Search, Filter, AlertTriangle, Boxes, DollarSign, TrendingDown, TrendingUp, Eye, ImageOff } from 'lucide-react';
import { CATEGORIES as PRODUCT_CATEGORIES_LIST } from '@/lib/data';
import { generateMockInventory, saveInventory } from '@/lib/mockInventory';
import InventoryItemDetailModal from '@/components/dashboard/InventoryItemDetailModal';
import { useToast } from "@/hooks/use-toast";

type StockStatusFilter = "All" | "In Stock" | "Low Stock" | "Out of Stock";

// Helper to check for valid image URLs that next/image can handle
const isValidNextImageUrl = (url?: string): boolean => {
  if (!url || typeof url !== 'string') return false;
  if (url.startsWith('data:')) return true; // Data URLs are fine
  if (url.startsWith('/')) return true; // Relative paths are fine

  if (url.startsWith('http://') || url.startsWith('https:')) {
    try {
      const parsedUrl = new URL(url);
      const imageExtensions = ['.png', '.jpg', '.jpeg', '.gif', '.webp', '.svg'];
      const pathname = parsedUrl.pathname.toLowerCase();
      // Allow if placehold.co 
      if (parsedUrl.hostname === 'placehold.co') return true;
      // For other http/https, check for common image extensions
      if (imageExtensions.some(ext => pathname.endsWith(ext))) {
        return true;
      }
      return false; // If http/https and no recognized image extension
    } catch (e) {
      return false; // Invalid URL structure
    }
  }
  return false; // Not a data URL, relative path, or valid http/https with image extension
};


export default function InventoryPage() {
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<Category | 'All'>('All');
  const [stockStatusFilter, setStockStatusFilter] = useState<StockStatusFilter>('All');
  const [selectedItemForModal, setSelectedItemForModal] = useState<InventoryItem | null>(null);
  const [isItemModalOpen, setIsItemModalOpen] = useState(false);
  const { toast } = useToast();

  const loadInventory = useCallback(() => {
    setIsLoading(true);
    setInventoryItems(generateMockInventory());
    setIsLoading(false);
  }, []);

  useEffect(() => {
    loadInventory();
  }, [loadInventory]);

  const filteredItems = useMemo(() => {
    return inventoryItems.filter(item => {
      const searchMatch = searchTerm === '' ||
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.sku.toLowerCase().includes(searchTerm.toLowerCase());
      const categoryMatch = categoryFilter === 'All' || item.category === categoryFilter;
      const stockStatusMatch = stockStatusFilter === 'All' ||
        (stockStatusFilter === 'In Stock' && item.stock > item.lowStockThreshold) ||
        (stockStatusFilter === 'Low Stock' && item.stock > 0 && item.stock <= item.lowStockThreshold) ||
        (stockStatusFilter === 'Out of Stock' && item.stock === 0);
      return searchMatch && categoryMatch && stockStatusMatch;
    });
  }, [inventoryItems, searchTerm, categoryFilter, stockStatusFilter]);

  const getStockBadge = (stock: number, threshold: number) => {
    if (stock === 0) return <Badge variant="destructive" className="bg-red-500/20 text-red-700 border-red-500/30">Out of Stock</Badge>;
    if (stock <= threshold) return <Badge variant="destructive" className="bg-yellow-500/20 text-yellow-700 border-yellow-500/30">Low Stock</Badge>;
    return <Badge variant="default" className="bg-green-500/20 text-green-700 border-green-500/30">In Stock</Badge>;
  };

  const handleViewItemDetails = (item: InventoryItem) => {
    setSelectedItemForModal(item);
    setIsItemModalOpen(true);
  };

  const handleCloseItemModal = () => {
    setIsItemModalOpen(false);
    setSelectedItemForModal(null);
  };

  const handleSaveItem = (editedItem: InventoryItem) => {
    const updatedInventory = inventoryItems.map(item =>
      item.id === editedItem.id ? editedItem : item
    );
    setInventoryItems(updatedInventory);
    saveInventory(updatedInventory);
    handleCloseItemModal();
    toast({ title: "Item Saved!", description: `${editedItem.name} has been updated successfully.` });
  };


  const totalProducts = inventoryItems.length;
  const lowStockCount = inventoryItems.filter(item => item.stock > 0 && item.stock <= item.lowStockThreshold).length;
  const outOfStockCount = inventoryItems.filter(item => item.stock === 0).length;
  const inventoryValue = inventoryItems.reduce((sum, item) => sum + (item.salePrice * item.stock), 0);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-28 w-full" />)}
        </div>
        <Card className="shadow-lg">
          <CardHeader>
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-64 mt-1" />
          </CardHeader>
          <CardContent className="py-4 border-y border-border">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <Skeleton className="h-9 w-full" />
                <Skeleton className="h-9 w-full" />
                <Skeleton className="h-9 w-full" />
            </div>
          </CardContent>
          <CardContent className="pt-4">
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <>
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Total Products" value={totalProducts.toString()} icon={Boxes} description={`${inventoryItems.filter(item => item.stock > 0).length} in stock`} />
        <StatCard title="Low Stock Items" value={lowStockCount.toString()} icon={TrendingDown} description="Needs reordering soon" />
        <StatCard title="Out of Stock" value={outOfStockCount.toString()} icon={AlertTriangle} description="Urgently reorder" />
        <StatCard title="Inventory Value" value={`$${inventoryValue.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}`} icon={DollarSign} description="Based on sale price" />
      </div>

      <Card className="shadow-lg">
        <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <div>
            <CardTitle className="font-headline text-primary flex items-center">
              <Package className="mr-2 h-6 w-6" /> Inventory List
            </CardTitle>
            <CardDescription>Manage your product stock levels, suppliers, and pricing.</CardDescription>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            <Button variant="outline" size="sm" className="w-full sm:w-auto" onClick={() => window.open('/dashboard/print-inventory', '_blank')}>
              <PrinterIcon className="mr-2 h-4 w-4" /> Print Inventory
            </Button>
            <Button size="sm" className="w-full sm:w-auto" onClick={() => alert('Opening add new product form (mock)...')}>
              <PackagePlus className="mr-2 h-4 w-4" /> Add New Product
            </Button>
          </div>
        </CardHeader>

        <CardContent className="py-4 border-y border-border">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 items-end">
            <div className="flex-grow min-w-[150px]">
              <Label htmlFor="searchTerm" className="text-xs text-muted-foreground block mb-1">Search by Name/SKU</Label>
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="searchTerm"
                  placeholder="Product name or SKU..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="h-9 pl-9"
                />
              </div>
            </div>
            <div className="flex-grow min-w-[150px]">
              <Label htmlFor="categoryFilter" className="text-xs text-muted-foreground block mb-1">Filter by Category</Label>
              <Select value={categoryFilter} onValueChange={(value) => setCategoryFilter(value as Category | 'All')}>
                <SelectTrigger id="categoryFilter" className="h-9">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All Categories</SelectItem>
                  {PRODUCT_CATEGORIES_LIST.map(cat => (
                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex-grow min-w-[150px]">
              <Label htmlFor="stockStatusFilter" className="text-xs text-muted-foreground block mb-1">Filter by Stock Status</Label>
              <Select value={stockStatusFilter} onValueChange={(value) => setStockStatusFilter(value as StockStatusFilter)}>
                <SelectTrigger id="stockStatusFilter" className="h-9">
                  <SelectValue placeholder="Select stock status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All Statuses</SelectItem>
                  <SelectItem value="In Stock">In Stock</SelectItem>
                  <SelectItem value="Low Stock">Low Stock</SelectItem>
                  <SelectItem value="Out of Stock">Out of Stock</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>

        <CardContent className="pt-4">
          <ScrollArea className="h-[600px] w-full">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[250px]">Product</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Supplier</TableHead>
                  <TableHead className="text-center">Stock</TableHead>
                  <TableHead className="text-right">Sale Price</TableHead>
                  <TableHead>Last Restock</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredItems.length > 0 ? (
                  filteredItems.map((item) => (
                    <TableRow key={item.id} className="hover:bg-muted/50">
                      <TableCell>
                        <div className="flex items-center gap-3">
                          {isValidNextImageUrl(item.imageUrl) ? (
                            <Image
                              src={item.imageUrl}
                              alt={item.name}
                              width={40}
                              height={40}
                              className="rounded-md object-cover"
                              data-ai-hint={item.dataAiHint || item.category.toLowerCase()}
                            />
                          ) : (
                            <div className="w-10 h-10 flex items-center justify-center bg-muted rounded-md">
                              <ImageOff className="h-5 w-5 text-muted-foreground" />
                            </div>
                          )}
                          <div>
                            <div className="font-medium truncate max-w-[150px]" title={item.name}>{item.name}</div>
                            <div className="text-xs text-muted-foreground">{item.sku}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{item.category}</TableCell>
                      <TableCell className="truncate max-w-[120px]" title={item.supplier}>{item.supplier}</TableCell>
                      <TableCell className="text-center">
                        <div className="flex flex-col items-center">
                           <span>{item.stock} units</span>
                           {getStockBadge(item.stock, item.lowStockThreshold)}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">${Number(item.salePrice).toFixed(2)}</TableCell>
                      <TableCell>{new Date(item.lastRestockDate).toLocaleDateString()}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="icon" onClick={() => handleViewItemDetails(item)} aria-label={`View details for ${item.name}`}>
                          <Eye className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                      No inventory items match your filters.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
    <InventoryItemDetailModal
        item={selectedItemForModal}
        isOpen={isItemModalOpen}
        onClose={handleCloseItemModal}
        onSave={handleSaveItem}
    />
    </>
  );
}
