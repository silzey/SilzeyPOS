
"use client";

import type { FC } from 'react';
import Image from 'next/image';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { X, Package, Tag, Building, BarChartBig, DollarSign, CalendarDays, Info, AlertTriangle, Edit } from 'lucide-react';
import type { InventoryItem } from '@/types/pos';

interface InventoryItemDetailModalProps {
  item: InventoryItem | null;
  isOpen: boolean;
  onClose: () => void;
}

const getStockBadgeInfo = (stock: number, threshold: number): { text: string; className: string } => {
  if (stock === 0) return { text: "Out of Stock", className: "bg-red-500/20 text-red-700 border-red-500/30" };
  if (stock <= threshold) return { text: "Low Stock", className: "bg-yellow-500/20 text-yellow-700 border-yellow-500/30" };
  return { text: "In Stock", className: "bg-green-500/20 text-green-700 border-green-500/30" };
};

const InventoryItemDetailModal: FC<InventoryItemDetailModalProps> = ({ item, isOpen, onClose }) => {
  if (!isOpen || !item) return null;

  const stockBadge = getStockBadgeInfo(item.stock, item.lowStockThreshold);

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-lg p-0 overflow-hidden shadow-2xl">
        <DialogHeader className="p-6 border-b border-border">
          <DialogTitle className="text-2xl font-headline text-primary flex items-center">
             <Package className="mr-3 h-6 w-6"/> {item.name}
          </DialogTitle>
          <DialogDescription>
            SKU: {item.sku}
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[60vh]">
          <div className="p-6 space-y-5">
            <div className="flex justify-center mb-4">
                <Image
                    src={item.imageUrl}
                    alt={item.name}
                    width={128}
                    height={128}
                    className="rounded-lg object-cover border-2 border-primary shadow-md"
                    data-ai-hint={item.dataAiHint || item.category.toLowerCase()}
                />
            </div>
            
            <section className="text-sm space-y-2">
              <div className="flex items-center">
                <Tag className="mr-3 h-5 w-5 text-muted-foreground" />
                <span>Category:</span> <Badge variant="secondary" className="ml-auto capitalize">{item.category}</Badge>
              </div>
              <div className="flex items-center">
                <Building className="mr-3 h-5 w-5 text-muted-foreground" />
                <span>Supplier:</span> <strong className="ml-auto font-medium">{item.supplier}</strong>
              </div>
            </section>
            
            <Separator />

             <section className="text-sm space-y-2">
                <h3 className="font-semibold text-md mb-1 flex items-center"><BarChartBig className="mr-2 h-4 w-4 text-primary" />Stock Details:</h3>
                 <div className="flex items-center">
                    <span className="w-1/2">Current Stock:</span>
                    <strong className="ml-auto font-medium">{item.stock} units</strong>
                </div>
                <div className="flex items-center">
                    <span className="w-1/2">Status:</span>
                    <Badge variant="outline" className={`ml-auto capitalize ${stockBadge.className}`}>{stockBadge.text}</Badge>
                </div>
                <div className="flex items-center">
                    <AlertTriangle className="mr-3 h-5 w-5 text-yellow-600" />
                    <span className="w-1/2">Low Stock Threshold:</span>
                    <strong className="ml-auto font-medium">{item.lowStockThreshold} units</strong>
                </div>
                <div className="flex items-center">
                    <CalendarDays className="mr-3 h-5 w-5 text-muted-foreground" />
                    <span>Last Restock:</span>
                    <strong className="ml-auto font-medium">{new Date(item.lastRestockDate).toLocaleDateString()}</strong>
                </div>
            </section>

            <Separator />

            <section className="text-sm space-y-2">
                 <h3 className="font-semibold text-md mb-1 flex items-center"><DollarSign className="mr-2 h-4 w-4 text-primary" />Pricing:</h3>
                 <div className="flex items-center">
                    <span className="w-1/2">Purchase Price:</span>
                    <strong className="ml-auto font-medium">${item.purchasePrice.toFixed(2)}</strong>
                </div>
                <div className="flex items-center">
                    <span className="w-1/2">Sale Price:</span>
                    <strong className="ml-auto font-medium text-primary">${item.salePrice.toFixed(2)}</strong>
                </div>
            </section>

            {item.notes && (
                <>
                    <Separator />
                    <section className="text-sm space-y-1">
                        <h3 className="font-semibold text-md mb-1 flex items-center"><Info className="mr-2 h-4 w-4 text-primary" />Notes:</h3>
                        <p className="text-muted-foreground bg-muted/50 p-2 rounded-md border border-border/70">{item.notes}</p>
                    </section>
                </>
            )}

          </div>
        </ScrollArea>
        
        <DialogFooter className="p-6 bg-muted/30 flex-col sm:flex-row justify-between">
          <Button variant="outline" onClick={onClose} className="w-full sm:w-auto mb-2 sm:mb-0">
             <X className="mr-2 h-4 w-4" /> Close
          </Button>
           <Button onClick={() => alert(`Editing ${item.name} (actual edit form not implemented)`)} className="w-full sm:w-auto">
            <Edit className="mr-2 h-4 w-4" /> Edit Item (Placeholder)
          </Button> 
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default InventoryItemDetailModal;
