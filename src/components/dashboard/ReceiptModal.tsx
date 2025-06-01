
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
  // CRUCIAL: Check browser console for this log when you expect the modal to open.
  console.log(`DEBUG: ReceiptModal rendering. isOpen: ${isOpen}, Transaction ID: ${transaction?.id}`);

  if (!transaction) {
    // This check ensures we don't try to render without a transaction.
    // If the modal isn't opening, this might not even be reached.
    console.log('DEBUG: ReceiptModal - No transaction provided, returning null.');
    return null;
  }
  
  // If isOpen is false, Radix Dialog won't render its content visibly.
  // This is mostly for clarity, as Dialog handles its own open state.
  if (!isOpen) {
    console.log('DEBUG: ReceiptModal - isOpen is false, Dialog will not be visible.');
    // The Dialog component itself handles not rendering content if open is false,
    // but we'll keep the log for clarity.
  }

  return (
    <Dialog open={isOpen} onOpenChange={(openState) => {
      // This function is called by Radix when the dialog's open state changes (e.g., by pressing Esc or clicking overlay)
      console.log(`DEBUG: ReceiptModal Dialog onOpenChange called. New openState: ${openState}`);
      if (!openState) {
        onClose(); // Call the passed onClose handler
      }
    }}>
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
          <Button variant="outline" onClick={() => {
            console.log('DEBUG: Close button in ReceiptModal clicked.');
            onClose();
          }} className="w-full sm:w-auto">
            Close
          </Button>
          <Button
            id="diagnostic-print-button"
            onClick={() => {
              // THIS IS THE MOST BASIC TEST FOR A CLICK
              alert('Button in Modal CLICKED!');
              console.log('CONSOLE LOG: Button in Modal CLICKED - logged!');
              // We can add window.print() back later if the alert fires.
              // try {
              //   window.print();
              //   console.log('CONSOLE LOG: window.print() was executed.');
              // } catch (error) {
              //   console.error('CONSOLE LOG: Error during window.print():', error);
              //   alert('ALERT: An error occurred while trying to print. Check console.');
              // }
            }}
            className="w-full sm:w-auto"
            style={{ border: '5px solid red', padding: '15px', fontSize: '18px', fontWeight: 'bold', backgroundColor: 'pink' }}
          >
            <Printer className="mr-2 h-5 w-5" /> CLICK ME!
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ReceiptModal;
