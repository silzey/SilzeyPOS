
"use client";

import { useEffect, useState, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, PrinterIcon, XCircle } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import type { InventoryItem } from '@/types/pos';
import { generateMockInventory } from '@/lib/mockInventory';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

function PrintableInventoryContent() {
  const router = useRouter();
  const [inventory, setInventory] = useState<InventoryItem[] | undefined>(undefined);

  useEffect(() => {
    setInventory(generateMockInventory());
  }, []);

  useEffect(() => {
    if (inventory && inventory.length > 0) {
      const timer = setTimeout(() => {
        window.print();
      }, 500); 
      return () => clearTimeout(timer);
    }
  }, [inventory]);

  const handlePrint = () => window.print();
  const handleClose = () => window.opener ? window.close() : router.push('/dashboard/inventory');

  if (inventory === undefined) {
    return (
      <div className="min-h-screen bg-gray-100 p-4 sm:p-8 flex justify-center items-center print:bg-white">
        <div className="bg-white p-6 sm:p-8 shadow-xl rounded-lg w-full max-w-4xl print:shadow-none print:border-none">
          <Skeleton className="h-8 w-1/2 mb-4" />
          <Skeleton className="h-4 w-1/3 mb-6" />
          <Separator className="my-4 print:hidden" />
          <Table>
            <TableHeader>
              <TableRow>
                {[...Array(6)].map((_, i) => <TableHead key={i}><Skeleton className="h-5 w-full" /></TableHead>)}
              </TableRow>
            </TableHeader>
            <TableBody>
              {[...Array(5)].map((_, i) => (
                <TableRow key={i}>
                  {[...Array(6)].map((_, j) => <TableCell key={j}><Skeleton className="h-5 w-full" /></TableCell>)}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    );
  }

  if (inventory.length === 0) {
    return (
      <div className="min-h-screen bg-gray-100 p-8 flex flex-col justify-center items-center text-center print:bg-white">
        <XCircle className="w-16 h-16 text-destructive mb-4" />
        <h1 className="text-2xl font-bold text-destructive mb-2">No Inventory Data</h1>
        <p className="text-muted-foreground mb-6">There is no inventory data available to print.</p>
        <Button onClick={handleClose} variant="outline" className="no-print">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-2 sm:p-4 print:bg-white print:p-0">
      <style jsx global>{`
        @media print {
          body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          .no-print { display: none !important; }
          @page { margin: 0.5in; size: landscape; }
          table { width: 100%; border-collapse: collapse; }
          th, td { border: 1px solid #ccc; padding: 4px; text-align: left; font-size: 9pt; } /* Reduced font size */
          th { background-color: #f0f0f0 !important; /* Ensure background prints */ }
        }
        .print-table-container { font-family: Arial, sans-serif; }
      `}</style>
      <div className="bg-white p-4 sm:p-6 shadow-xl rounded-lg w-full max-w-5xl mx-auto print:shadow-none print:border-none print:max-w-full print:rounded-none print-table-container">
        <header className="text-center mb-6 print:mb-4">
          <h1 className="text-2xl font-headline font-semibold uppercase text-primary">Inventory List</h1>
          <p className="text-sm text-muted-foreground">Printed on: {new Date().toLocaleDateString()} at {new Date().toLocaleTimeString()}</p>
        </header>
        
        <Table className="text-xs"> {/* Base class for screen, print styles override */}
          <TableHeader>
            <TableRow>
              <TableHead className="w-[30%] print:w-auto">Product Name</TableHead>
              <TableHead className="w-[15%] print:w-auto">SKU</TableHead>
              <TableHead className="w-[15%] print:w-auto">Category</TableHead>
              <TableHead className="w-[20%] print:w-auto">Supplier</TableHead>
              <TableHead className="text-center w-[10%] print:w-auto">Stock</TableHead>
              <TableHead className="text-right w-[10%] print:w-auto">Sale Price</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {inventory.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="font-medium">{item.name}</TableCell>
                <TableCell>{item.sku}</TableCell>
                <TableCell>{item.category}</TableCell>
                <TableCell>{item.supplier}</TableCell>
                <TableCell className="text-center">{item.stock}</TableCell>
                <TableCell className="text-right">${item.salePrice.toFixed(2)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        
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

export default function PrintableInventoryPage() {
  return (
    <Suspense fallback={
        <div className="min-h-screen flex justify-center items-center">
            <div className="bg-white p-6 sm:p-8 shadow-xl rounded-lg w-full max-w-4xl print:shadow-none print:border-none">
              <Skeleton className="h-8 w-1/2 mb-4" />
              <Skeleton className="h-4 w-1/3 mb-6" />
              <Separator className="my-4 print:hidden" />
              <Table>
                <TableHeader>
                  <TableRow>
                    {[...Array(6)].map((_, i) => <TableHead key={i}><Skeleton className="h-5 w-full" /></TableHead>)}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {[...Array(5)].map((_, i) => (
                    <TableRow key={i}>
                      {[...Array(6)].map((_, j) => <TableCell key={j}><Skeleton className="h-5 w-full" /></TableCell>)}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
        </div>
    }>
      <PrintableInventoryContent />
    </Suspense>
  );
}

