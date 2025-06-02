
"use client";

import type { FC, ChangeEvent, DragEvent } from 'react'; // Added DragEvent
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
import { X, Package, Tag, Building, BarChartBig, DollarSign, CalendarDays, Info, AlertTriangle, Save, Edit, StarIcon, ImagePlus } from 'lucide-react'; // Added ImagePlus
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
  const [isDraggingOver, setIsDraggingOver] = useState(false); // For drag & drop visual feedback

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
      processedValue = value === '' ? '' : parseFloat(value);
    }
    setEditableItem(prev => prev ? { ...prev, [name]: processedValue } : null);
  };

  const handleSaveClick = () => {
    if (editableItem) {
      const fieldsToValidateAsNumbers = {
        stock: editableItem.stock,
        lowStockThreshold: editableItem.lowStockThreshold,
        purchasePrice: editableItem.purchasePrice,
        salePrice: editableItem.salePrice,
        rating: editableItem.rating
      };

      for (const [fieldName, fieldValue] of Object.entries(fieldsToValidateAsNumbers)) {
        const numValue = parseFloat(String(fieldValue));
        if (isNaN(numValue) || numValue < 0) {
          alert(`${fieldName.replace(/([A-Z])/g, ' $1').toLowerCase()} must be a valid non-negative number.`);
          return;
        }
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
    if (item) setEditableItem({...item});
    setIsEditing(false);
  }

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDraggingOver(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDraggingOver(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDraggingOver(false);
    const files = e.dataTransfer.files;
    if (files && files[0]) {
      const file = files[0];
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (loadEvent) => {
          if (loadEvent.target?.result && editableItem) {
            setEditableItem({ ...editableItem, imageUrl: loadEvent.target.result as string });
          }
        };
        reader.readAsDataURL(file);
      } else {
        alert('Please drop an image file (e.g., PNG, JPG, GIF).');
      }
    }
  };

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

        <ScrollArea className="max-h-[calc(80vh-180px)]"> {/* Adjusted max-h for more content */}
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
            
            {/* Image Display and Editing Section */}
            <div className="md:col-span-2 space-y-3">
              {isEditing && <Label className="mb-1 text-sm font-medium">Product Image</Label>}
              <div className="w-full flex justify-center">
                <div className="w-40 h-40 relative border-2 border-primary/30 rounded-lg overflow-hidden shadow-md bg-muted/10 p-1">
                  <Image
                    src={editableItem.imageUrl}
                    alt={editableItem.name}
                    layout="fill"
                    objectFit="contain" // Ensures the entire photo fits
                    className="rounded-sm" 
                    data-ai-hint={editableItem.dataAiHint || editableItem.category.toLowerCase()}
                    key={editableItem.imageUrl} // Force re-render if URL changes
                  />
                </div>
              </div>

              {isEditing && (
                <div className="space-y-3 pt-2">
                  <div>
                    <Label htmlFor="itemImageUrl" className="text-xs text-muted-foreground">Image URL</Label>
                    <Input id="itemImageUrl" name="imageUrl" value={editableItem.imageUrl} onChange={handleInputChange} placeholder="https://example.com/image.png" className="h-9"/>
                  </div>
                  <div
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    className={`p-4 py-6 border-2 border-dashed rounded-md text-center cursor-pointer transition-colors
                                ${isDraggingOver ? 'border-primary bg-primary/10 ring-2 ring-primary ring-offset-2' : 'border-border hover:border-muted-foreground/70'}`}
                  >
                    <ImagePlus className={`mx-auto h-8 w-8 mb-1 ${isDraggingOver ? 'text-primary' : 'text-muted-foreground/70'}`} />
                    <p className="text-xs text-muted-foreground">
                      {isDraggingOver ? 'Release to upload image' : 'Drag & drop image here, or use URL input'}
                    </p>
                  </div>
                </div>
              )}
            </div>
            
            <Separator className="md:col-span-2 my-2" />

            {/* Other Fields */}
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
                    <div className="md:col-span-2 space-y-1 pt-2">
                        <h3 className="font-semibold text-sm mb-1 flex items-center"><Info className="mr-2 h-4 w-4 text-primary" />Notes:</h3>
                        <p className="text-sm text-muted-foreground bg-muted/50 p-3 rounded-md border border-border/70 whitespace-pre-wrap">{editableItem.notes}</p>
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

const DetailItem: FC<DetailItemProps> = ({ icon: IconComponent, label, value, isBadge, isComponent, className }) => (
    <div className={`flex items-start text-sm ${isComponent ? '' : 'py-2 border-b border-border/30 last:border-b-0'}`}>
        {IconComponent && <IconComponent className={`mr-3 h-5 w-5 text-muted-foreground shrink-0 mt-0.5 ${className || ''}`} />}
        {!IconComponent && !isComponent && <div className="w-8 shrink-0"></div>} {/* Placeholder for alignment if no icon and not a component */}
        <span className="text-muted-foreground w-2/5 shrink-0">{label}</span>
        {isComponent ? <div className="ml-auto text-right">{value}</div> :
         isBadge ? <Badge variant="secondary" className="ml-auto capitalize whitespace-nowrap">{String(value)}</Badge> :
        <strong className={`ml-auto font-medium text-right ${className || 'text-foreground'}`}>{String(value)}</strong>}
    </div>
);

export default InventoryItemDetailModal;
