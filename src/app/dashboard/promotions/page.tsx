
"use client";

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card'; // Added CardFooter
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Ticket, PackageSearch, Zap, Settings2, Trash2, PlusCircle, PackageOpen } from 'lucide-react';

interface ReelItem {
  id: string;
  name: string;
  category: string;
  badgeType: string;
  pulsatingBorder: boolean;
}

const mockReelItems: ReelItem[] = [
  { id: 'reel-1', name: 'Mystic Haze Flower', category: 'Flower', badgeType: 'New', pulsatingBorder: true },
  { id: 'reel-2', name: 'Galaxy Gold Concentrate', category: 'Concentrates', badgeType: '10% Off', pulsatingBorder: false },
  { id: 'reel-3', name: 'Orion Haze Vape Pen', category: 'Vapes', badgeType: 'Limited', pulsatingBorder: true },
  { id: 'reel-4', name: 'Lunar Lavender Gummies', category: 'Edibles', badgeType: 'Featured', pulsatingBorder: false },
];


export default function PromotionsPage() {
  const [reelItems, setReelItems] = useState<ReelItem[]>(mockReelItems);

  const handleBadgeChange = (itemId: string, newBadge: string) => {
    setReelItems(prev => prev.map(item => item.id === itemId ? { ...item, badgeType: newBadge } : item));
  };

  const handleBorderToggle = (itemId: string) => {
    setReelItems(prev => prev.map(item => item.id === itemId ? { ...item, pulsatingBorder: !item.pulsatingBorder } : item));
  };

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
            General promotions settings and coupon management will go here.
          </p>
        </CardContent>
      </Card>

      <Card className="shadow-xl">
        <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <div>
            <CardTitle className="font-headline text-primary flex items-center">
              <Zap className="mr-2 h-6 w-6 text-yellow-500" /> Product Story Reel Configuration
            </CardTitle>
            <CardDescription>Control which products appear in the "story reel" on the main POS screen and their appearance.</CardDescription>
          </div>
           <Button size="sm" onClick={() => alert('Mock: Open product selector to add to reel...')} className="w-full sm:w-auto">
            <PlusCircle className="mr-2 h-4 w-4" /> Add Product to Reel
          </Button>
        </CardHeader>
        <CardContent>
          {reelItems.length === 0 ? (
            <div className="text-center py-10">
              <PackageOpen className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-xl font-semibold text-muted-foreground">No items in Story Reel.</p>
              <p className="text-sm text-muted-foreground">Add products to feature them in the POS story reel.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="min-w-[200px]">Product Name</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Badge Type</TableHead>
                    <TableHead className="text-center">Pulsating Border</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {reelItems.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.name}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{item.category}</Badge>
                      </TableCell>
                      <TableCell>
                        <Select value={item.badgeType} onValueChange={(value) => handleBadgeChange(item.id, value)}>
                          <SelectTrigger className="h-8 w-[120px]">
                            <SelectValue placeholder="Select badge" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="None">None</SelectItem>
                            <SelectItem value="New">New</SelectItem>
                            <SelectItem value="5% Off">5% Off</SelectItem>
                            <SelectItem value="10% Off">10% Off</SelectItem>
                            <SelectItem value="Featured">Featured</SelectItem>
                            <SelectItem value="Limited">Limited</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell className="text-center">
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Switch
                                checked={item.pulsatingBorder}
                                onCheckedChange={() => handleBorderToggle(item.id)}
                                aria-label={`Toggle pulsating border for ${item.name}`}
                              />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>{item.pulsatingBorder ? 'Disable' : 'Enable'} pulsating border</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </TableCell>
                      <TableCell className="text-right">
                         <Button variant="ghost" size="icon" onClick={() => alert(`Mock: Removing ${item.name} from reel`)}>
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
        <CardFooter className="border-t pt-6 flex justify-end">
          <Button onClick={() => alert('Mock: Saving story reel configuration...')} disabled={reelItems.length === 0}>
            Save Reel Configuration
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
