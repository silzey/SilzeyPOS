
"use client";

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, PrinterIcon, XCircle } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

// Mock transaction data - in a real app, you'd fetch this or have it available
const allTransactions = [
  { id: 'TRX731', customer: 'Aisha Khan', date: '2024-07-28', amount: '$75.50', status: 'Completed', items: [{name: 'Flower Product A', qty: 1, price: 30.00}, {name: 'Edible Product B', qty: 2, price: 22.75}] },
  { id: 'TRX732', customer: 'Ben Carter', date: '2024-07-28', amount: '$120.00', status: 'Completed', items: [{name: 'Vape Cartridge X', qty: 2, price: 60.00}] },
  { id: 'TRX733', customer: 'Chloe Davis', date: '2024-07-27', amount: '$45.20', status: 'Pending', items: [{name: 'Concentrate Y', qty: 1, price: 45.20}] },
  { id: 'TRX734', customer: 'Daniel Evans', date: '2024-07-27', amount: '$210.80', status: 'Completed', items: [{name: 'Premium Flower Z', qty: 1, price: 70.00}, {name: 'Accessory Pack', qty: 1, price: 140.80}] },
  { id: 'TRX735', customer: 'Elena Foster', date: '2024-07-26', amount: '$99.99', status: 'Failed', items: [{name: 'Specialty Edible', qty: 3, price: 33.33}] },
  { id: 'TRX736', customer: 'Finn Green', date: '2024-07-26', amount: '$32.00', status: 'Completed', items: [{name: 'Pre-roll Pack', qty: 1, price: 32.00}] },
];

type TransactionItem = { name: string; qty: number; price: number };
interface TransactionType {
  id: string;
  customer: string;
  date: string;
  amount: string;
  status: string;
  items: TransactionItem[];
}

export default function PrintableReceiptPage() {
  const params = useParams();
  const router = useRouter();
  const transactionId = params.transactionId as string;
  const [transaction, setTransaction] = useState<TransactionType | null | undefined>(undefined); // undefined for loading state

  useEffect(() => {
    if (transactionId) {
      const foundTransaction = allTransactions.find(t => t.id === transactionId);
      setTransaction(foundTransaction || null); // null if not found
    }
  }, [transactionId]);

  useEffect(() => {
    if (transaction) {
      // Automatically trigger print dialog once transaction data is loaded
      // Using a short timeout to ensure content is rendered before print dialog
      const timer = setTimeout(() => {
        window.print();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [transaction]);

  const handlePrint = () => {
    window.print();
  };

  const handleClose = () => {
    // Attempt to close the tab if opened via target="_blank"
    // Otherwise, navigate back or to a default page
    if (window.opener) {
      window.close();
    } else {
      router.push('/dashboard'); // Or router.back() if preferred
    }
  };
  
  if (transaction === undefined) { // Loading state
    return (
      <div className="min-h-screen bg-gray-100 p-4 sm:p-8 flex justify-center items-center">
        <div className="bg-white p-6 sm:p-8 shadow-2xl rounded-lg w-full max-w-md print:shadow-none print:border-none">
          <Skeleton className="h-8 w-3/4 mb-4" />
          <Skeleton className="h-4 w-1/2 mb-2" />
          <Skeleton className="h-4 w-1/3 mb-6" />
          <Separator className="my-4" />
          <Skeleton className="h-6 w-1/4 mb-2" />
          <Skeleton className="h-4 w-full mb-1" />
          <Skeleton className="h-4 w-full mb-1" />
          <Skeleton className="h-4 w-3/4 mb-4" />
          <Separator className="my-4" />
          <Skeleton className="h-8 w-1/2 ml-auto mb-6" />
          <div className="mt-8 flex flex-col sm:flex-row justify-end gap-3 print:hidden">
            <Skeleton className="h-10 w-full sm:w-24" />
            <Skeleton className="h-10 w-full sm:w-24" />
          </div>
        </div>
      </div>
    );
  }

  if (!transaction) {
    return (
      <div className="min-h-screen bg-gray-100 p-8 flex flex-col justify-center items-center text-center">
        <XCircle className="w-16 h-16 text-destructive mb-4" />
        <h1 className="text-2xl font-bold text-destructive mb-2">Transaction Not Found</h1>
        <p className="text-muted-foreground mb-6">The transaction ID "{transactionId}" could not be found.</p>
        <Button onClick={() => router.push('/dashboard')} variant="outline">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
        </Button>
      </div>
    );
  }

  const itemsSubtotal = transaction.items.reduce((acc, item) => acc + (item.price * item.qty), 0);

  const getStatusBadgeVariant = () => {
    if (transaction.status === 'Completed') return 'default';
    if (transaction.status === 'Pending') return 'secondary';
    return 'destructive';
  };

  const getStatusBadgeClassName = () => {
    if (transaction.status === 'Completed') return 'bg-green-500/20 text-green-700 border-green-500/30';
    if (transaction.status === 'Pending') return 'bg-yellow-500/20 text-yellow-700 border-yellow-500/30';
    return 'bg-red-500/20 text-red-700 border-red-500/30';
  };


  return (
    <div className="min-h-screen bg-gray-100 p-2 sm:p-4 print:bg-white print:p-0 flex justify-center items-start sm:items-center">
      <style jsx global>{`
        @media print {
          body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          .no-print { display: none !important; }
          @page { margin: 0.5in; } /* Adjust page margins for printing */
        }
      `}</style>
      <div className="bg-white p-6 shadow-2xl rounded-lg w-full max-w-sm print:shadow-none print:border-none print:max-w-full print:rounded-none">
        <header className="text-center mb-6">
          <h1 className="text-3xl font-cursive text-primary">Silzey POS</h1>
          <p className="text-xl font-headline font-semibold">RECEIPT</p>
        </header>

        <Separator className="my-4 border-dashed" />

        <section className="text-sm space-y-1 mb-4">
          <div className="flex justify-between"><span>Transaction ID:</span> <strong className="font-mono">{transaction.id}</strong></div>
          <div className="flex justify-between"><span>Date:</span> <strong>{new Date(transaction.date).toLocaleString()}</strong></div>
          <div className="flex justify-between"><span>Customer:</span> <strong>{transaction.customer}</strong></div>
          <div className="flex justify-between"><span>Status:</span> <Badge variant={getStatusBadgeVariant()} className={`capitalize ${getStatusBadgeClassName()}`}>{transaction.status}</Badge></div>
        </section>

        <Separator className="my-4" />

        <section className="mb-4">
          <h2 className="font-semibold text-sm mb-1">Items Purchased:</h2>
          <div className="space-y-1 text-xs">
            {transaction.items.map((item, index) => (
              <div key={index} className="grid grid-cols-[1fr_auto_auto] gap-x-2 items-center">
                <span className="truncate">{item.name} (x{item.qty})</span>
                <span className="text-right">${item.price.toFixed(2)} ea.</span>
                <span className="text-right font-medium">${(item.price * item.qty).toFixed(2)}</span>
              </div>
            ))}
          </div>
        </section>
        
        <Separator className="my-4" />

        <section className="text-right space-y-1 mb-6">
          <div className="flex justify-between items-center text-lg font-bold text-primary">
            <span>TOTAL:</span>
            <span>{transaction.amount}</span>
          </div>
        </section>
        
        <Separator className="my-4 border-dashed" />

        <footer className="text-center text-xs text-muted-foreground">
          <p>Thank you for your business at Silzey POS!</p>
          <p>Questions? Call (555) 123-4567</p>
        </footer>

        <div className="mt-8 flex flex-col sm:flex-row justify-end gap-3 no-print">
          <Button onClick={handleClose} variant="outline" className="w-full sm:w-auto">
            <XCircle className="mr-2 h-4 w-4" /> Close
          </Button>
          <Button onClick={handlePrint} className="w-full sm:w-auto">
            <PrinterIcon className="mr-2 h-4 w-4" /> Print Again
          </Button>
        </div>
      </div>
    </div>
  );
}
