
"use client";

import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

// This page is deprecated and should not be used.
// The correct page for printing receipts is /dashboard/print-receipt/[id]?type=...

export default function DeprecatedPrintableReceiptPage() {
  return (
    <div className="min-h-screen bg-gray-100 p-8 flex flex-col justify-center items-center text-center">
      <h1 className="text-2xl font-bold text-destructive mb-2">Page Deprecated</h1>
      <p className="text-muted-foreground mb-6">
        This specific receipt page URL is no longer in use.
      </p>
      <p className="text-sm text-muted-foreground mb-6">
        Please use links from the main dashboard tables to print receipts.
      </p>
      <Link href="/dashboard" passHref>
        <Button variant="outline">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
        </Button>
      </Link>
    </div>
  );
}
