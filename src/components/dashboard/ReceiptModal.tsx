
"use client";

import type { FC } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import type { TransactionType } from './RecentTransactionsTable';
import { Printer, X } from 'lucide-react';

interface ReceiptModalProps {
  transaction: TransactionType | null;
  isOpen: boolean;
  onClose: () => void;
}

const ReceiptModal: FC<ReceiptModalProps> = ({ transaction, isOpen, onClose }) => {
  if (!transaction) return null;

  // Inline handler for the print button for direct testing
  const handleDirectPrint = () => {
    alert('Print button was clicked! Attempting to call window.print() now.');
    console.log('Print button onClick handler fired. Calling window.print()...');
    try {
      window.print();
      console.log('window.print() was executed.');
    } catch (error) {
      console.error('Error during window.print():', error);
      alert('An error occurred while trying to print. Please check the browser console.');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-sm p-0 shadow-xl rounded-lg">
        <div className="p-6">
          <DialogHeader className="mb-2">
            <div className="flex flex-row justify-between items-center">
              <h1 className="text-3xl font-cursive text-primary">Silzey POS</h1>
              <DialogClose asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <X className="h-5 w-5" />
                </Button>
              </DialogClose>
            </div>
            <DialogTitle className="text-xl font-semibold text-center pt-2 font-headline">
              RECEIPT
            </DialogTitle>
          </DialogHeader>
          
          <Separator className="my-3 border-dashed" />

          <div className="space-y-1.5 text-sm mb-4">
            <div className="flex justify-between"><span>Transaction ID:</span> <strong>{transaction.id}</strong></div>
            <div className="flex justify-between"><span>Date:</span> <strong>{transaction.date}</strong></div>
            <div className="flex justify-between"><span>Customer:</span> <strong>{transaction.customer}</strong></div>
          </div>
          
          <Separator className="my-3" />

          <h4 className="font-semibold mb-1 text-sm">Items:</h4>
          <div className="space-y-1 text-sm mb-3 max-h-32 overflow-y-auto">
            {transaction.items && transaction.items.length > 0 ? (
              transaction.items.map((item, index) => (
                 <div key={index} className="flex justify-between">
                    <span>{item.name} (x{item.qty})</span>
                    <span>{typeof item.price === 'number' ? `$${item.price.toFixed(2)}` : item.price}</span>
                 </div>
              ))
            ) : (
                 <div className="flex justify-between">
                    <span>Total Purchase (No itemization)</span>
                    <span>{transaction.amount}</span>
                 </div>
            )}
          </div>
          
          <Separator className="my-3" />

          <div className="flex justify-between items-center text-lg font-bold my-4 text-primary">
            <span>TOTAL:</span>
            <span>{transaction.amount}</span>
          </div>

          <Separator className="my-3 border-dashed" />
          <p className="text-xs text-center text-muted-foreground mt-4">
            Thank you for your business!
            <br />
            Questions? Contact (555) 123-4567
          </p>
        </div>

        <DialogFooter className="p-4 bg-muted/10 border-t flex-col sm:flex-row gap-2">
          <Button variant="outline" onClick={onClose} className="w-full sm:w-auto">
            Close
          </Button>
          <Button onClick={handleDirectPrint} className="w-full sm:w-auto">
            <Printer className="mr-2 h-4 w-4" /> Print
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ReceiptModal;
