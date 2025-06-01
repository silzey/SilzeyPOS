
"use client";

import type { FC } from 'react';
import Image from 'next/image'; // Import Image
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { X, ShoppingBag, UserCircle, CalendarDays, Hash, DollarSign, MapPin, CreditCardIcon, Printer } from 'lucide-react';
import type { Order, OrderStatus as AppOrderStatus, CartItem } from '@/types/pos'; // Import CartItem

interface OrderReceiptModalProps {
  order: Order | null;
  isOpen: boolean;
  onClose: () => void;
}

const getStatusBadgeClassName = (status: AppOrderStatus): string => {
  switch (status) {
    case "In-Store": return "bg-blue-500/20 text-blue-700 border-blue-500/30";
    case "Online": return "bg-green-500/20 text-green-700 border-green-500/30";
    default: return "border-muted-foreground";
  }
};

const OrderReceiptModal: FC<OrderReceiptModalProps> = ({ order, isOpen, onClose }) => {
  if (!isOpen || !order) return null;

  const statusBadgeClassName = getStatusBadgeClassName(order.status);

  const handlePrint = () => {
    window.open(`/dashboard/print-receipt/${order.id}?type=order`, '_blank');
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-lg p-0 overflow-hidden shadow-2xl">
        <DialogHeader className="p-6 border-b border-border">
          <DialogTitle className="text-2xl font-headline text-primary flex items-center">
             <Hash className="mr-2 h-5 w-5"/> Order Details: {order.id}
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className="max-h-[60vh]">
          <div className="p-6 space-y-5">
            <section className="text-sm space-y-2">
              <div className="flex items-center">
                <UserCircle className="mr-3 h-5 w-5 text-muted-foreground" />
                <span>Customer:</span> <strong className="ml-auto font-medium">{order.customerName}</strong>
              </div>
              <div className="flex items-center">
                <CalendarDays className="mr-3 h-5 w-5 text-muted-foreground" />
                <span>Date:</span> <strong className="ml-auto font-medium">{new Date(order.orderDate).toLocaleString()}</strong>
              </div>
              <div className="flex items-center">
                <ShoppingBag className="mr-3 h-5 w-5 text-muted-foreground" />
                <span>Status:</span> <Badge variant="outline" className={`ml-auto capitalize ${statusBadgeClassName}`}>{order.status}</Badge>
              </div>
               {order.shippingAddress && (
                <div className="flex items-start">
                    <MapPin className="mr-3 h-5 w-5 text-muted-foreground mt-0.5" />
                    <span>Shipping:</span> <strong className="ml-auto font-medium text-right">{order.shippingAddress}</strong>
                </div>
               )}
                {order.paymentMethod && (
                <div className="flex items-center">
                    <CreditCardIcon className="mr-3 h-5 w-5 text-muted-foreground" />
                    <span>Payment:</span> <strong className="ml-auto font-medium">{order.paymentMethod}</strong>
                </div>
                )}
            </section>
            
            <Separator />

            <section>
              <h3 className="font-semibold text-md mb-2 flex items-center"><ShoppingBag className="mr-2 h-4 w-4 text-primary" />Items ({order.itemCount}):</h3>
              <div className="space-y-2 text-xs">
                {order.items.map((item: CartItem) => ( // Specify item as CartItem
                  <div key={item.id} className="flex items-center gap-3 py-1.5 border-b border-border/60 last:border-b-0">
                    <Image
                        src={item.image}
                        alt={item.name}
                        width={40}
                        height={40}
                        className="rounded object-cover"
                        data-ai-hint={item.dataAiHint || item.category.toLowerCase()}
                      />
                    <div className="flex-grow">
                      <span className="block font-medium text-sm">{item.name} (x{item.quantity})</span>
                      <span className="text-muted-foreground">${parseFloat(item.price).toFixed(2)} ea.</span>
                    </div>
                    <span className="font-semibold text-sm">${(parseFloat(item.price) * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
                {order.items.length === 0 && <p className="text-muted-foreground text-center py-2">No items in this order.</p>}
              </div>
            </section>

            <Separator />

            <section className="text-right space-y-1">
              <div className="flex justify-between items-center text-lg font-bold text-primary">
                <DollarSign className="mr-2 h-5 w-5 text-primary invisible" /> {/* For alignment */}
                <span>TOTAL:</span>
                <span>${order.totalAmount.toFixed(2)}</span>
              </div>
            </section>
          </div>
        </ScrollArea>
        
        <DialogFooter className="p-6 bg-muted/30 flex-col sm:flex-row justify-between">
          <Button variant="outline" onClick={onClose} className="w-full sm:w-auto mb-2 sm:mb-0">
             <X className="mr-2 h-4 w-4" /> Close
          </Button>
           <Button onClick={handlePrint} className="w-full sm:w-auto">
            <Printer className="mr-2 h-4 w-4" /> Print Receipt
          </Button> 
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default OrderReceiptModal;
