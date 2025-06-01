
"use client";

import type { FC } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogFooter, DialogClose } from '@/components/ui/dialog';
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

  const handlePrint = () => {
    window.print();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-sm p-0 shadow-xl rounded-lg">
        <div className="p-6">
          <DialogHeader className="flex flex-row justify-between items-center mb-4">
            <h1 className="text-3xl font-cursive text-primary">Silzey POS</h1>
            <DialogClose asChild>
              <Button variant="ghost" size="icon" className="rounded-full">
                <X className="h-5 w-5" />
              </Button>
            </DialogClose>
          </DialogHeader>
          
          <Separator className="my-3 border-dashed" />
          <h2 className="text-xl font-semibold text-center mb-3 font-headline">RECEIPT</h2>
          <Separator className="my-3 border-dashed" />

          <div className="space-y-1.5 text-sm mb-4">
            <div className="flex justify-between"><span>Transaction ID:</span> <strong>{transaction.id}</strong></div>
            <div className="flex justify-between"><span>Date:</span> <strong>{transaction.date}</strong></div>
            <div className="flex justify-between"><span>Customer:</span> <strong>{transaction.customer}</strong></div>
          </div>
          
          <Separator className="my-3" />

          {/* Mock Items - In a real app, you'd loop through actual itemized data */}
          <div className="space-y-1 text-sm mb-3">
            <h4 className="font-semibold mb-1">Items:</h4>
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
          <Button onClick={handlePrint} className="w-full sm:w-auto">
            <Printer className="mr-2 h-4 w-4" /> Print
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ReceiptModal;
