
"use client";

import { useEffect, useState, Suspense } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, PrinterIcon, XCircle, ShoppingBag, UserCircle } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import type { TransactionItem, Order, TransactionStatus, OrderStatus as AppOrderStatus } from '@/types/pos'; // Use AppOrderStatus to avoid conflict
import { mockOrders } from '@/app/dashboard/orders/page'; // Import mockOrders

// Mock transaction data - in a real app, you'd fetch this or have it available
const mockTransactionsData: Array<{
  id: string;
  customer: string;
  date: string;
  amount: string;
  status: TransactionStatus;
  items: TransactionItem[];
}> = [
  { id: 'TRX731', customer: 'Aisha Khan', date: '2024-07-28', amount: '$75.50', status: 'Completed', items: [{name: 'Flower Product A', qty: 1, price: 30.00}, {name: 'Edible Product B', qty: 2, price: 22.75}] },
  { id: 'TRX732', customer: 'Ben Carter', date: '2024-07-28', amount: '$120.00', status: 'Completed', items: [{name: 'Vape Cartridge X', qty: 2, price: 60.00}] },
  { id: 'TRX733', customer: 'Chloe Davis', date: '2024-07-27', amount: '$45.20', status: 'Pending', items: [{name: 'Concentrate Y', qty: 1, price: 45.20}] },
  { id: 'TRX734', customer: 'Daniel Evans', date: '2024-07-27', amount: '$210.80', status: 'Completed', items: [{name: 'Premium Flower Z', qty: 1, price: 70.00}, {name: 'Accessory Pack', qty: 1, price: 140.80}] },
  { id: 'TRX735', customer: 'Elena Foster', date: '2024-07-26', amount: '$99.99', status: 'Failed', items: [{name: 'Specialty Edible', qty: 3, price: 33.33}] },
  { id: 'TRX736', customer: 'Finn Green', date: '2024-07-26', amount: '$32.00', status: 'Completed', items: [{name: 'Pre-roll Pack', qty: 1, price: 32.00}] },
];

interface DisplayableRecord {
  id: string;
  recordType: 'Transaction' | 'Order';
  customerName: string;
  date: string; // ISO string
  status: TransactionStatus | AppOrderStatus;
  items: TransactionItem[];
  totalAmountDisplay: string; // Formatted, e.g., "$123.45"
  identifierLabel: string; // "Transaction ID" or "Order ID"
}

function PrintableReceiptContent() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const recordId = params.id as string;
  const recordTypeParam = searchParams.get('type') as 'transaction' | 'order' | null;

  const [record, setRecord] = useState<DisplayableRecord | null | undefined>(undefined); // undefined for loading

  useEffect(() => {
    if (recordId && recordTypeParam) {
      let foundRecord: DisplayableRecord | null = null;
      if (recordTypeParam === 'transaction') {
        const transaction = mockTransactionsData.find(t => t.id === recordId);
        if (transaction) {
          foundRecord = {
            id: transaction.id,
            recordType: 'Transaction',
            customerName: transaction.customer,
            date: transaction.date, // Assuming this is already a suitable date string or ISO
            status: transaction.status,
            items: transaction.items,
            totalAmountDisplay: transaction.amount,
            identifierLabel: 'Transaction ID'
          };
        }
      } else if (recordTypeParam === 'order') {
        const order = mockOrders.find(o => o.id === recordId);
        if (order) {
          foundRecord = {
            id: order.id,
            recordType: 'Order',
            customerName: order.customerName,
            date: order.orderDate, // This is an ISO string
            status: order.status,
            items: order.items,
            totalAmountDisplay: `$${order.totalAmount.toFixed(2)}`,
            identifierLabel: 'Order ID'
          };
        }
      }
      setRecord(foundRecord);
    }
  }, [recordId, recordTypeParam]);

  useEffect(() => {
    if (record && record !== undefined) { // Ensure record is loaded and not null
      const timer = setTimeout(() => {
        window.print();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [record]);

  const handlePrint = () => window.print();
  const handleClose = () => window.opener ? window.close() : router.push('/dashboard');

  if (record === undefined) { // Loading state
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
        </div>
      </div>
    );
  }

  if (!record) {
    return (
      <div className="min-h-screen bg-gray-100 p-8 flex flex-col justify-center items-center text-center">
        <XCircle className="w-16 h-16 text-destructive mb-4" />
        <h1 className="text-2xl font-bold text-destructive mb-2">Record Not Found</h1>
        <p className="text-muted-foreground mb-6">The ID "{recordId}" (type: {recordTypeParam || 'unknown'}) could not be found.</p>
        <Button onClick={() => router.push('/dashboard')} variant="outline">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
        </Button>
      </div>
    );
  }

  const getStatusBadgeInfo = (status: TransactionStatus | AppOrderStatus, type: 'Transaction' | 'Order') => {
    if (type === 'Transaction') {
        const s = status as TransactionStatus;
        if (s === 'Completed') return { variant: 'default', className: 'bg-green-500/20 text-green-700 border-green-500/30' };
        if (s === 'Pending') return { variant: 'secondary', className: 'bg-yellow-500/20 text-yellow-700 border-yellow-500/30' };
        return { variant: 'destructive', className: 'bg-red-500/20 text-red-700 border-red-500/30' };
    } else { // Order
        const s = status as AppOrderStatus;
        if (s === 'In-Store') return { variant: 'default', className: 'bg-blue-500/20 text-blue-700 border-blue-500/30' };
        if (s === 'Online') return { variant: 'secondary', className: 'bg-green-500/20 text-green-700 border-green-500/30' };
        return { variant: 'outline', className: 'border-muted-foreground' };
    }
  };
  const statusBadge = getStatusBadgeInfo(record.status, record.recordType);


  return (
    <div className="min-h-screen bg-gray-100 p-2 sm:p-4 print:bg-white print:p-0 flex justify-center items-start sm:items-center">
      <style jsx global>{`
        @media print { body { -webkit-print-color-adjust: exact; print-color-adjust: exact; } .no-print { display: none !important; } @page { margin: 0.5in; } }
      `}</style>
      <div className="bg-white p-6 shadow-2xl rounded-lg w-full max-w-sm print:shadow-none print:border-none print:max-w-full print:rounded-none">
        <header className="text-center mb-6">
          <h1 className="text-3xl font-cursive text-primary">Silzey POS</h1>
          <p className="text-xl font-headline font-semibold uppercase">{record.recordType} DETAILS</p>
        </header>
        <Separator className="my-4 border-dashed" />
        <section className="text-sm space-y-1 mb-4">
          <div className="flex justify-between"><span>{record.identifierLabel}:</span> <strong className="font-mono">{record.id}</strong></div>
          <div className="flex justify-between"><span>Date:</span> <strong>{new Date(record.date).toLocaleString()}</strong></div>
          <div className="flex justify-between"><span>Customer:</span> <strong>{record.customerName}</strong></div>
          <div className="flex justify-between"><span>Status:</span> <Badge variant={statusBadge.variant as any} className={`capitalize ${statusBadge.className}`}>{record.status}</Badge></div>
        </section>
        <Separator className="my-4" />
        <section className="mb-4">
          <h2 className="font-semibold text-sm mb-1 flex items-center"><ShoppingBag className="mr-2 h-4 w-4 text-primary" />Items:</h2>
          <div className="space-y-1 text-xs">
            {record.items.map((item, index) => (
              <div key={index} className="grid grid-cols-[1fr_auto_auto] gap-x-2 items-center py-1 border-b border-border/50 last:border-b-0">
                <span className="truncate">{item.name} (x{item.qty})</span>
                <span className="text-right">${item.price.toFixed(2)} ea.</span>
                <span className="text-right font-medium">${(item.price * item.qty).toFixed(2)}</span>
              </div>
            ))}
             {record.items.length === 0 && <p className="text-muted-foreground text-center py-2">No items in this {record.recordType.toLowerCase()}.</p>}
          </div>
        </section>
        <Separator className="my-4" />
        <section className="text-right space-y-1 mb-6">
          <div className="flex justify-between items-center text-lg font-bold text-primary">
            <span>TOTAL:</span>
            <span>{record.totalAmountDisplay}</span>
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

// Wrap with Suspense for useSearchParams
export default function PrintableReceiptPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex justify-center items-center"><Skeleton className="h-64 w-96" /></div>}>
      <PrintableReceiptContent />
    </Suspense>
  );
}
