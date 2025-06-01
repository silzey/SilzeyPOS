
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
  console.log(`DEBUG: ReceiptModal COMPONENT RENDER props -> isOpen: ${isOpen}, Transaction ID: ${transaction?.id}`);

  if (!isOpen || !transaction) {
    // This log helps confirm if the modal is simply not being told to open, or lacks data.
    console.log(`DEBUG: ReceiptModal not rendering Dialog body because isOpen is ${isOpen} or transaction is ${transaction ? 'present' : 'absent'}.`);
    return null; // Don't render the Dialog if not open or no transaction
  }
  
  // If we reach here, isOpen is true and transaction exists.
  console.log(`DEBUG: ReceiptModal rendering Dialog body for Transaction ID: ${transaction.id}`);

  return (
    <Dialog 
      open={isOpen} // Controlled by the isOpen prop
      onOpenChange={(openState) => {
        // This callback is triggered by Radix Dialog when its open state *would* change (e.g. Esc, overlay click)
        console.log(`DEBUG: ReceiptModal Dialog onOpenChange CALLED. Radix wants to set openState to: ${openState}. Current "isOpen" prop from parent: ${isOpen}. Transaction ID: ${transaction?.id}`);
        if (!openState) {
          console.log(`DEBUG: ReceiptModal onOpenChange -> Radix wants to close. Calling parent's onClose() handler.`);
          onClose(); // Inform parent to update its state (which controls this Dialog's 'open' prop)
        } else {
          console.log(`DEBUG: ReceiptModal onOpenChange -> Radix wants to open. This is unusual for a fully controlled dialog unless it's the initial mount with open=true.`);
        }
    }}>
      <DialogContent className="sm:max-w-sm p-0 shadow-xl rounded-lg">
        <div className="p-6">
          <DialogHeader className="mb-2">
            <div className="flex flex-row justify-between items-center">
              <h1 className="text-3xl font-cursive text-primary">Silzey POS</h1>
              <DialogClose asChild>
                <Button variant="ghost" size="icon" className="rounded-full" aria-label="Close receipt">
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
                    <span>${typeof item.price === 'number' ? item.price.toFixed(2) : 'N/A'}</span>
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
            console.log('DEBUG: Close button in ReceiptModal footer clicked. Calling onClose().');
            onClose();
          }} className="w-full sm:w-auto">
            Close
          </Button>
          <Button
            id="diagnostic-print-button" 
            onClick={() => {
              alert('Button in Modal CLICKED!'); // Basic alert to confirm click registration
              console.log('CONSOLE LOG: Button in Modal CLICKED - logged!');
              try {
                window.print();
                console.log('CONSOLE LOG: window.print() was executed.');
              } catch (error) {
                console.error('CONSOLE LOG: Error during window.print():', error);
                alert('ALERT: An error occurred while trying to print. Check console.');
              }
            }}
            className="w-full sm:w-auto"
            style={{ border: '5px solid deeppink', padding: '15px', fontSize: '18px', fontWeight: 'bold', backgroundColor: 'lightpink' }}
          >
            <Printer className="mr-2 h-5 w-5" /> CLICK ME!
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ReceiptModal;

