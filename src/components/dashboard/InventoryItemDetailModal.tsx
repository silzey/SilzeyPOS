
"use client";

import type { FC, ChangeEvent } from 'react';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { X, Package, Tag, Building, BarChartBig, DollarSign, CalendarDays, Info, AlertTriangle, Save, Edit, StarIcon } from 'lucide-react';
import type { InventoryItem } from '@/types/pos';

interface InventoryItemDetailModalProps {
  item: InventoryItem | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (editedItem: InventoryItem) => void;
}

const getStockBadgeInfo = (stock: number, threshold: number): { text: string; className: string } => {
  if (stock === 0) return { text: "Out of Stock", className: "bg-red-500/20 text-red-700 border-red-500/30" };
  if (stock <= threshold) return { text: "Low Stock", className: "bg-yellow-500/20 text-yellow-700 border-yellow-500/30" };
  return { text: "In Stock", className: "bg-green-500/20 text-green-700 border-green-500/30" };
};

const InventoryItemDetailModal: FC<InventoryItemDetailModalProps> = ({ item, isOpen, onClose, onSave }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editableItem, setEditableItem] = useState<InventoryItem | null>(null);

  useEffect(() => {
    if (item) {
      setEditableItem({ ...item }); 
      setIsEditing(false); 
    } else {
      setEditableItem(null);
    }
  }, [item]);

  if (!isOpen || !editableItem) return null;

  const stockBadge = getStockBadgeInfo(editableItem.stock, editableItem.lowStockThreshold);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    let processedValue: string | number = value;

    const numericFields = ['stock', 'lowStockThreshold', 'purchasePrice', 'salePrice', 'rating'];
    if (numericFields.includes(name)) {
      // Allow empty string for easier editing, validation will happen on save
      processedValue = value === '' ? '' : parseFloat(value);
    }
    setEditableItem(prev => prev ? { ...prev, [name]: processedValue } : null);
  };

  const handleSaveClick = () => {
    if (editableItem) {
      // Basic validation
      const fieldsToValidateAsNumbers = {
        stock: editableItem.stock,
        lowStockThreshold: editableItem.lowStockThreshold,
        purchasePrice: editableItem.purchasePrice,
        salePrice: editableItem.salePrice,
        rating: editableItem.rating
      };

      for (const [fieldName, fieldValue] of Object.entries(fieldsToValidateAsNumbers)) {
        const numValue = parseFloat(String(fieldValue)); // Ensure it's treated as number
        if (isNaN(numValue) || numValue < 0) {
          alert(`${fieldName.replace(/([A-Z])/g, ' $1').toLowerCase()} must be a valid non-negative number.`);
          return;
        }
         // Update editableItem with parsed numbers to ensure correct type before saving
        (editableItem as any)[fieldName] = numValue;
      }
      
      if (parseFloat(editableItem.rating) > 5) {
         alert("Rating cannot be more than 5.");
         return;
      }


      onSave(editableItem);
      setIsEditing(false);
    }
  };
  
  const handleCancelEdit = () => {
    if (item) setEditableItem({...item}); // Reset to original item data
    setIsEditing(false);
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-2xl p-0 overflow-hidden shadow-2xl">
        <DialogHeader className="p-6 border-b border-border flex flex-row justify-between items-center">
          <div>
            <DialogTitle className="text-2xl font-headline text-primary flex items-center">
              <Package className="mr-3 h-6 w-6"/> {isEditing ? 'Edit: ' : ''}{editableItem.name}
            </DialogTitle>
            <DialogDescription>
              SKU: {editableItem.sku} (Category: {editableItem.category})
            </DialogDescription>
          </div>
          {!isEditing ? (
            <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
              <Edit className="mr-2 h-4 w-4" /> Edit
            </Button>
          ) : (
             <Button variant="outline" size="sm" onClick={handleCancelEdit}>
                <X className="mr-2 h-4 w-4" /> Cancel Edit
            </Button>
          )}
        </DialogHeader>

        <ScrollArea className="max-h-[60vh]">
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
            <div className="md:col-span-2 flex justify-center mb-2">
                <Image
                    src={editableItem.imageUrl}
                    alt={editableItem.name}
                    width={128}
                    height={128}
                    className="rounded-lg object-cover border-2 border-primary shadow-md"
                    data-ai-hint={editableItem.dataAiHint || editableItem.category.toLowerCase()}
                />
            </div>

            {isEditing ? (
              <>
                <div className="md:col-span-2 space-y-1">
                    <Label htmlFor="itemName">Product Name</Label>
                    <Input id="itemName" name="name" value={editableItem.name} onChange={handleInputChange} />
                </div>
                <div className="space-y-1">
                    <Label htmlFor="itemSupplier">Supplier</Label>
                    <Input id="itemSupplier" name="supplier" value={editableItem.supplier} onChange={handleInputChange} />
                </div>
                <div className="space-y-1">
                    <Label htmlFor="itemStock">Current Stock</Label>
                    <Input id="itemStock" name="stock" type="number" value={String(editableItem.stock)} onChange={handleInputChange} min="0" />
                </div>
                 <div className="space-y-1">
                    <Label htmlFor="itemLowStockThreshold">Low Stock Threshold</Label>
                    <Input id="itemLowStockThreshold" name="lowStockThreshold" type="number" value={String(editableItem.lowStockThreshold)} onChange={handleInputChange} min="0"/>
                </div>
                <div className="space-y-1">
                    <Label htmlFor="itemPurchasePrice">Purchase Price ($)</Label>
                    <Input id="itemPurchasePrice" name="purchasePrice" type="number" step="0.01" value={String(editableItem.purchasePrice)} onChange={handleInputChange} min="0"/>
                </div>
                 <div className="space-y-1">
                    <Label htmlFor="itemSalePrice">Sale Price ($)</Label>
                    <Input id="itemSalePrice" name="salePrice" type="number" step="0.01" value={String(editableItem.salePrice)} onChange={handleInputChange} min="0"/>
                </div>
                 <div className="space-y-1">
                    <Label htmlFor="itemTags">Tags (comma-separated)</Label>
                    <Input id="itemTags" name="tags" value={editableItem.tags} onChange={handleInputChange} />
                </div>
                <div className="space-y-1">
                    <Label htmlFor="itemRating">Rating (0-5)</Label>
                    <Input id="itemRating" name="rating" type="number" step="0.1" min="0" max="5" value={String(editableItem.rating)} onChange={handleInputChange} />
                </div>
                <div className="md:col-span-2 space-y-1">
                    <Label htmlFor="itemNotes">Notes</Label>
                    <Textarea id="itemNotes" name="notes" value={editableItem.notes || ''} onChange={handleInputChange} rows={3} />
                </div>
              </>
            ) : (
              <>
                <DetailItem icon={Tag} label="Category:" value={editableItem.category} isBadge />
                <DetailItem icon={Building} label="Supplier:" value={editableItem.supplier} />
                <DetailItem icon={BarChartBig} label="Current Stock:" value={`${editableItem.stock} units`} />
                <DetailItem icon={null} label="Status:" value={<Badge variant="outline" className={`capitalize ${stockBadge.className}`}>{stockBadge.text}</Badge>} isComponent />
                <DetailItem icon={AlertTriangle} label="Low Stock Threshold:" value={`${editableItem.lowStockThreshold} units`} className="text-yellow-600" />
                <DetailItem icon={CalendarDays} label="Last Restock:" value={new Date(editableItem.lastRestockDate).toLocaleDateString()} />
                <DetailItem icon={DollarSign} label="Purchase Price:" value={`$${Number(editableItem.purchasePrice).toFixed(2)}`} />
                <DetailItem icon={DollarSign} label="Sale Price:" value={`$${Number(editableItem.salePrice).toFixed(2)}`} className="text-primary" />
                 <DetailItem icon={Tag} label="Tags:" value={editableItem.tags} />
                <DetailItem icon={StarIcon} label="Rating:" value={`${editableItem.rating} / 5`} />

                {editableItem.notes && (
                    <div className="md:col-span-2 space-y-1">
                        <h3 className="font-semibold text-md mb-1 flex items-center"><Info className="mr-2 h-4 w-4 text-primary" />Notes:</h3>
                        <p className="text-sm text-muted-foreground bg-muted/50 p-2 rounded-md border border-border/70">{editableItem.notes}</p>
                    </div>
                )}
              </>
            )}
          </div>
        </ScrollArea>

        <DialogFooter className="p-6 bg-muted/30 flex-col sm:flex-row gap-3">
          <Button variant="outline" onClick={isEditing ? handleCancelEdit : onClose} className="w-full sm:w-auto">
             <X className="mr-2 h-4 w-4" /> {isEditing ? 'Cancel' : 'Close'}
          </Button>
          {isEditing && (
            <Button onClick={handleSaveClick} className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white">
              <Save className="mr-2 h-4 w-4" /> Save Changes
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};


interface DetailItemProps {
    icon: React.ElementType | null;
    label: string;
    value: string | React.ReactNode;
    isBadge?: boolean;
    isComponent?: boolean;
    className?: string;
}

const DetailItem: FC<DetailItemProps> = ({ icon: Icon, label, value, isBadge, isComponent, className }) => (
    <div className={`flex items-center text-sm ${isComponent ? '' : 'py-1.5 border-b border-border/30 last:border-b-0'}`}>
        {Icon && <Icon className={`mr-3 h-5 w-5 text-muted-foreground ${className || ''}`} />}
        <span className="text-muted-foreground w-2/5">{label}</span>
        {isComponent ? <div className="ml-auto">{value}</div> :
         isBadge ? <Badge variant="secondary" className="ml-auto capitalize">{value}</Badge> :
        <strong className={`ml-auto font-medium ${className || 'text-foreground'}`}>{value}</strong>}
    </div>
);

export default InventoryItemDetailModal;
