"use client";

import type { FC } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { CartItem, CustomerInfo } from '@/types/pos';
import type { UpsellSuggestionsOutput } from '@/ai/flows/upsell-suggestions';
import UpsellSection from '@/components/pos/UpsellSection';
import { AlertCircle, CheckCircle, X } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';


interface CheckoutDialogProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  totalPrice: string;
  rewardsPoints: number;
  onFinalizeSale: () => void;
  customerInfo: CustomerInfo;
  onCustomerInfoChange: (field: keyof CustomerInfo, value: string) => void;
  message: string;
  upsellData: UpsellSuggestionsOutput | null;
  isLoadingUpsell: boolean;
}

const CheckoutDialog: FC<CheckoutDialogProps> = ({
  isOpen,
  onClose,
  cart,
  totalPrice,
  rewardsPoints,
  onFinalizeSale,
  customerInfo,
  onCustomerInfoChange,
  message,
  upsellData,
  isLoadingUpsell,
}) => {
  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-2xl p-0 overflow-hidden shadow-2xl animate-modal-slide-in">
        <DialogHeader className="p-6 border-b border-border">
          <DialogTitle className="text-2xl font-headline text-primary">Complete Your Purchase</DialogTitle>
          {message && (
            <DialogDescription className={`mt-2 text-sm flex items-center ${message.startsWith("Please") ? "text-destructive" : "text-green-600"}`}>
              {message.startsWith("Please") ? <AlertCircle className="h-4 w-4 mr-2" /> : <CheckCircle className="h-4 w-4 mr-2" />}
              {message}
            </DialogDescription>
          )}
        </DialogHeader>

        <ScrollArea className="max-h-[calc(80vh-160px)]">
          <div className="p-6 space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-2 font-headline">Order Summary</h3>
              <div className="space-y-2 text-sm max-h-40 overflow-y-auto pr-2">
                {cart.map((item) => (
                  <div key={item.id} className="flex justify-between items-center">
                    <span>{item.name} (x{item.quantity})</span>
                    <span className="font-medium">${(parseFloat(item.price) * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
              <div className="flex justify-between font-bold text-xl mt-3 pt-3 border-t border-primary">
                <span>Grand Total:</span>
                <span>${totalPrice}</span>
              </div>
            </div>

            <UpsellSection suggestions={upsellData} isLoading={isLoadingUpsell} />

            <div className="bg-accent/20 p-4 rounded-md text-center">
              <p className="text-md font-semibold text-accent-foreground">
                Current Rewards Points: <span className="text-accent font-bold">{rewardsPoints}</span>
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-3 font-headline">Customer Information</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName">First Name</Label>
                  <Input id="firstName" value={customerInfo.firstName} onChange={(e) => onCustomerInfoChange('firstName', e.target.value)} placeholder="Enter first name" />
                </div>
                <div>
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input id="lastName" value={customerInfo.lastName} onChange={(e) => onCustomerInfoChange('lastName', e.target.value)} placeholder="Enter last name" />
                </div>
                <div>
                  <Label htmlFor="dob">Date of Birth</Label>
                  <Input id="dob" type="date" value={customerInfo.dob} onChange={(e) => onCustomerInfoChange('dob', e.target.value)} />
                </div>
                <div>
                  <Label htmlFor="phoneNumber">Phone Number</Label>
                  <Input id="phoneNumber" type="tel" value={customerInfo.phoneNumber} onChange={(e) => onCustomerInfoChange('phoneNumber', e.target.value)} placeholder="Enter phone number" />
                </div>
              </div>
            </div>
          </div>
        </ScrollArea>
        
        <DialogFooter className="p-6 bg-muted/50 flex-col sm:flex-row gap-2 sm:gap-0">
          <Button variant="outline" onClick={onClose} className="w-full sm:w-auto">
             <X className="mr-2 h-4 w-4" /> Cancel
          </Button>
          <Button onClick={onFinalizeSale} className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white">
            <CheckCircle className="mr-2 h-4 w-4" /> Finalize Sale
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CheckoutDialog;
