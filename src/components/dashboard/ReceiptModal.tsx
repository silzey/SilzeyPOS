
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
  console.log(`%cDEBUG_MODAL: Component Rendered. Props -> isOpen: ${isOpen}, TXN ID: ${transaction?.id || 'null'}`, "color: purple; font-weight: bold;");

  if (!isOpen || !transaction) {
    console.log(`%cDEBUG_MODAL: Not rendering Dialog body. isOpen: ${isOpen}, TXN: ${transaction ? 'present' : 'absent'}. Returning null.`, "color: purple;");
    return null;
  }
  
  console.log(`%cDEBUG_MODAL: Rendering Dialog body for TXN ID: ${transaction.id}. isOpen is true.`, "color: purple;");

  return (
    <Dialog 
      open={isOpen}
      onOpenChange={(openState) => {
        console.log(`%cDEBUG_MODAL: Dialog onOpenChange CALLED by Radix. Radix wants to set openState to: ${openState}. Current "isOpen" prop from parent: ${isOpen}. TXN ID: ${transaction?.id}`, "color: red; font-weight: bold;");
        if (!openState) {
          console.log('%cDEBUG_MODAL: onOpenChange -> Radix wants to close. Calling parent onClose() is *TEMPORARILY COMMENTED OUT FOR DIAGNOSIS*.', "color: red; font-style: italic;");
          // onClose(); // <<<<<<<< TEMPORARILY COMMENTED OUT!
        } else {
          console.log('%cDEBUG_MODAL: onOpenChange -> Radix wants to open. This is normal for initial mount with open=true.', "color: red;");
        }
    }}>
      <DialogContent className="sm:max-w-sm p-0 shadow-xl rounded-lg">
        <div className="p-6">
          <DialogHeader className="mb-2">
            <div className="flex flex-row justify-between items-center">
              <h1 className="text-3xl font-cursive text-primary">Silzey POS</h1>
              <DialogClose asChild>
                <Button variant="ghost" size="icon" className="rounded-full" aria-label="Close receipt" onClick={() => {
                    console.log('%cDEBUG_MODAL: Manual DialogClose X button clicked. Calling onClose().', "color: orange;");
                    onClose();
                }}>
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
            console.log('%cDEBUG_MODAL: Footer Close button clicked. Calling onClose().', "color: orange;");
            onClose();
          }} className="w-full sm:w-auto">
            Close
          </Button>
          <Button
            id="diagnostic-print-button" 
            onClick={() => {
              alert('MODAL BUTTON CLICKED! Check console.');
              console.log('%cMODAL_BUTTON_CLICK: "CLICK ME!" button was clicked.', "background: lime; color: black; font-size: 14px; font-weight: bold;");
              // window.print(); // window.print() temporarily commented out for focus on click registration
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
