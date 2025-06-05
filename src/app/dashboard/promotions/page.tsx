
"use client";

import { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Ticket, Zap, Trash2, PlusCircle, PackageOpen, AlertTriangle } from 'lucide-react';
import type { InventoryItem, ReelConfigItem } from '@/types/pos';
import { generateMockInventory } from '@/lib/mockInventory';
import { useToast } from "@/hooks/use-toast";
import { ScrollArea } from '@/components/ui/scroll-area';

const REEL_CONFIG_STORAGE_KEY = 'silzeyPosReelConfigV2'; // Changed key to reset if old structure exists
const MAX_REEL_ITEMS = 25;

const BADGE_OPTIONS = ["None", "New", "Featured", "5% Off", "10% Off", "Limited"];

export default function PromotionsPage() {
  const [allInventory, setAllInventory] = useState<InventoryItem[]>([]);
  const [reelConfigItems, setReelConfigItems] = useState<ReelConfigItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const inventory = generateMockInventory();
    setAllInventory(inventory);

    const storedConfigRaw = localStorage.getItem(REEL_CONFIG_STORAGE_KEY);
    if (storedConfigRaw) {
      try {
        const storedConfig = JSON.parse(storedConfigRaw);
        // Basic validation: check if it's an array and items have expected properties
        if (Array.isArray(storedConfig) && storedConfig.every(item => 'inventoryItemId' in item && 'badgeType' in item && 'pulsatingBorder' in item)) {
          setReelConfigItems(storedConfig);
        } else {
          // If data is malformed, initialize with default
          initializeDefaultReelConfig(inventory);
        }
      } catch (e) {
        console.error("Error parsing reel config from localStorage:", e);
        initializeDefaultReelConfig(inventory); // Initialize on error
      }
    } else {
      initializeDefaultReelConfig(inventory);
    }
    setIsLoading(false);
  }, []);

  const initializeDefaultReelConfig = (inventory: InventoryItem[]) => {
    // Select first few items from "Flower" and "Concentrates" for a visually appealing default
    const flowerItems = inventory.filter(item => item.category === "Flower").slice(0, 5);
    const concentrateItems = inventory.filter(item => item.category === "Concentrates").slice(0, 5);
    const defaultSelection = [...flowerItems, ...concentrateItems].slice(0, MAX_REEL_ITEMS);

    const initialConfig: ReelConfigItem[] = defaultSelection.map((item, index) => ({
      inventoryItemId: item.id,
      badgeType: index % 3 === 0 ? 'New' : (index % 3 === 1 ? 'Featured' : 'None'),
      pulsatingBorder: index % 4 === 0,
    }));
    setReelConfigItems(initialConfig);
    // Optionally save this default to localStorage immediately
    // localStorage.setItem(REEL_CONFIG_STORAGE_KEY, JSON.stringify(initialConfig));
  };

  const handleBadgeChange = (inventoryItemId: string, newBadge: string) => {
    setReelConfigItems(prev => prev.map(item => item.inventoryItemId === inventoryItemId ? { ...item, badgeType: newBadge } : item));
  };

  const handleBorderToggle = (inventoryItemId: string) => {
    setReelConfigItems(prev => prev.map(item => item.inventoryItemId === inventoryItemId ? { ...item, pulsatingBorder: !item.pulsatingBorder } : item));
  };

  const handleRemoveFromReel = (inventoryItemId: string) => {
    setReelConfigItems(prev => prev.filter(item => item.inventoryItemId !== inventoryItemId));
    toast({ title: "Item Removed", description: "Product removed from story reel configuration." });
  };

  const handleAddProductToReel = () => {
    if (reelConfigItems.length >= MAX_REEL_ITEMS) {
      toast({ title: "Reel Full", description: `Cannot add more than ${MAX_REEL_ITEMS} items to the reel.`, variant: "destructive" });
      return;
    }
    // Find an inventory item not already in the reel
    const currentReelItemIds = new Set(reelConfigItems.map(rc => rc.inventoryItemId));
    const availableInventory = allInventory.filter(invItem => !currentReelItemIds.has(invItem.id));

    if (availableInventory.length === 0) {
      toast({ title: "No More Products", description: "All available inventory items are already in the reel or there are no items in inventory.", variant: "destructive" });
      return;
    }
    const itemToAdd = availableInventory[Math.floor(Math.random() * availableInventory.length)];
    setReelConfigItems(prev => [...prev, { inventoryItemId: itemToAdd.id, badgeType: "None", pulsatingBorder: false }]);
    toast({ title: "Product Added", description: `${itemToAdd.name} added to reel configuration. Configure its badge and border below.` });
  };

  const handleSaveReelConfiguration = () => {
    localStorage.setItem(REEL_CONFIG_STORAGE_KEY, JSON.stringify(reelConfigItems));
    toast({ title: "Configuration Saved", description: "Product story reel configuration has been saved." });
  };

  const getInventoryItemDetails = (inventoryItemId: string): InventoryItem | undefined => {
    return allInventory.find(item => item.id === inventoryItemId);
  };
  
  if (isLoading) {
    return <div className="flex justify-center items-center h-64"><Zap className="h-8 w-8 animate-spin text-primary" /> Loading Reel Config...</div>;
  }

  return (
    <div className="space-y-8">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="font-headline text-primary flex items-center">
            <Ticket className="mr-2 h-6 w-6" /> Promotions Management
          </CardTitle>
          <CardDescription>Manage promotional activities like discounts, featured products, and the POS story reel.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            General promotions settings and coupon management (coming soon).
          </p>
        </CardContent>
      </Card>

      <Card className="shadow-xl">
        <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <div>
            <CardTitle className="font-headline text-primary flex items-center">
              <Zap className="mr-2 h-6 w-6 text-yellow-500" /> Product Story Reel Configuration
            </CardTitle>
            <CardDescription>Manage products in the POS story reel. Max {MAX_REEL_ITEMS} items.</CardDescription>
          </div>
           <Button size="sm" onClick={handleAddProductToReel} className="w-full sm:w-auto" disabled={reelConfigItems.length >= MAX_REEL_ITEMS}>
            <PlusCircle className="mr-2 h-4 w-4" /> Add Product to Reel
          </Button>
        </CardHeader>
        <CardContent>
          {reelConfigItems.length === 0 && !isLoading ? (
            <div className="text-center py-10">
              <PackageOpen className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-xl font-semibold text-muted-foreground">No items in Story Reel.</p>
              <p className="text-sm text-muted-foreground">Add products to feature them in the POS story reel.</p>
            </div>
          ) : (
            <ScrollArea className="h-[500px] w-full">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[80px]">Image</TableHead>
                    <TableHead className="min-w-[200px]">Product Name</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead className="w-[150px]">Badge Type</TableHead>
                    <TableHead className="text-center w-[150px]">Pulsating Border</TableHead>
                    <TableHead className="text-right w-[100px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {reelConfigItems.map((configItem) => {
                    const product = getInventoryItemDetails(configItem.inventoryItemId);
                    if (!product) {
                      return (
                        <TableRow key={configItem.inventoryItemId} className="bg-destructive/10">
                          <TableCell colSpan={6} className="text-center text-destructive font-medium py-3">
                            <div className="flex items-center justify-center">
                              <AlertTriangle className="h-5 w-5 mr-2" />
                              Error: Product with ID '{configItem.inventoryItemId}' not found in inventory. Consider removing it.
                              <Button variant="ghost" size="icon" onClick={() => handleRemoveFromReel(configItem.inventoryItemId)} className="ml-2">
                                <Trash2 className="h-4 w-4 text-destructive" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    }
                    return (
                      <TableRow key={product.id}>
                        <TableCell>
                          <Image
                            src={product.imageUrl || 'https://placehold.co/60x60.png'}
                            alt={product.name}
                            width={60}
                            height={60}
                            className="rounded-md object-cover"
                            data-ai-hint={product.dataAiHint || product.category.toLowerCase()}
                          />
                        </TableCell>
                        <TableCell className="font-medium">{product.name}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{product.category}</Badge>
                        </TableCell>
                        <TableCell>
                          <Select value={configItem.badgeType} onValueChange={(value) => handleBadgeChange(product.id, value)}>
                            <SelectTrigger className="h-9 w-full">
                              <SelectValue placeholder="Select badge" />
                            </SelectTrigger>
                            <SelectContent>
                              {BADGE_OPTIONS.map(opt => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell className="text-center">
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <div className="flex justify-center">
                                  <Switch
                                    checked={configItem.pulsatingBorder}
                                    onCheckedChange={() => handleBorderToggle(product.id)}
                                    aria-label={`Toggle pulsating border for ${product.name}`}
                                  />
                                </div>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>{configItem.pulsatingBorder ? 'Disable' : 'Enable'} pulsating border</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </TableCell>
                        <TableCell className="text-right">
                         <Button variant="ghost" size="icon" onClick={() => handleRemoveFromReel(product.id)}>
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </ScrollArea>
          )}
        </CardContent>
        <CardFooter className="border-t pt-6 flex justify-end">
          <Button onClick={handleSaveReelConfiguration} disabled={reelConfigItems.length === 0 && isLoading}>
            Save Reel Configuration
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
