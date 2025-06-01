
"use client"
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Download, Eye, Printer } from 'lucide-react';

// Keep original transactions data or ensure it's accessible
const transactions = [
  { id: 'TRX731', customer: 'Aisha Khan', date: '2024-07-28', amount: '$75.50', status: 'Completed', items: [{name: 'Flower Product A', qty: 1, price: 30.00}, {name: 'Edible Product B', qty: 2, price: 22.75}] },
  { id: 'TRX732', customer: 'Ben Carter', date: '2024-07-28', amount: '$120.00', status: 'Completed', items: [{name: 'Vape Cartridge X', qty: 2, price: 60.00}] },
  { id: 'TRX733', customer: 'Chloe Davis', date: '2024-07-27', amount: '$45.20', status: 'Pending', items: [{name: 'Concentrate Y', qty: 1, price: 45.20}] },
  { id: 'TRX734', customer: 'Daniel Evans', date: '2024-07-27', amount: '$210.80', status: 'Completed', items: [{name: 'Premium Flower Z', qty: 1, price: 70.00}, {name: 'Accessory Pack', qty: 1, price: 140.80}] },
  { id: 'TRX735', customer: 'Elena Foster', date: '2024-07-26', amount: '$99.99', status: 'Failed', items: [{name: 'Specialty Edible', qty: 3, price: 33.33}] },
  { id: 'TRX736', customer: 'Finn Green', date: '2024-07-26', amount: '$32.00', status: 'Completed', items: [{name: 'Pre-roll Pack', qty: 1, price: 32.00}] },
];

export type TransactionType = typeof transactions[0];

const convertToCSV = (data: typeof transactions) => {
  const headers = ['ID', 'Customer', 'Date', 'Amount', 'Status'];
  const csvRows = [
    headers.join(','),
    ...data.map(row =>
      [
        row.id,
        `"${row.customer.replace(/"/g, '""')}"`,
        row.date,
        row.amount.replace('$', ''),
        row.status
      ].join(',')
    )
  ];
  return csvRows.join('\n');
};

const downloadCSV = (csvString: string, filename: string) => {
  const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  } else {
    alert("CSV download is not supported in your browser.");
  }
};

export const RecentTransactionsTable = () => {
  const handleDownload = () => {
    const csvString = convertToCSV(transactions);
    downloadCSV(csvString, 'recent_transactions.csv');
  };

  return (
    <>
      <Card className="shadow-lg">
        <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <div>
            <CardTitle className="font-headline text-primary">Recent Transactions</CardTitle>
            <CardDescription>Latest transactions processed by the POS (mock data).</CardDescription>
          </div>
          <Button variant="outline" size="sm" onClick={handleDownload} className="w-full sm:w-auto">
            <Download className="mr-2 h-4 w-4" />
            Download CSV
          </Button>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">ID</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead className="text-center">Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions.map((transaction) => (
                  <TableRow key={transaction.id} className="hover:bg-muted/50">
                    <TableCell className="font-medium">{transaction.id}</TableCell>
                    <TableCell>{transaction.customer}</TableCell>
                    <TableCell>{transaction.date}</TableCell>
                    <TableCell className="text-right">{transaction.amount}</TableCell>
                    <TableCell className="text-center">
                      <Badge
                        variant={transaction.status === 'Completed' ? 'default' : transaction.status === 'Pending' ? 'secondary' : 'destructive'}
                        className={`capitalize ${transaction.status === 'Completed' ? 'bg-green-500/20 text-green-700 border-green-500/30' : transaction.status === 'Pending' ? 'bg-yellow-500/20 text-yellow-700 border-yellow-500/30' : 'bg-red-500/20 text-red-700 border-red-500/30'}`}
                      >
                        {transaction.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right space-x-1">
                      <Button variant="ghost" size="icon" onClick={() => alert('Viewing details for ' + transaction.id + ' (mock)')} aria-label="View transaction details">
                        <Eye className="h-4 w-4" />
                      </Button>
                       <Link href={`/dashboard/print-receipt/${transaction.id}`} passHref legacyBehavior>
                        <a target="_blank" rel="noopener noreferrer" aria-label={`Print receipt for ${transaction.id}`}>
                          <Button variant="ghost" size="icon">
                            <Printer className="h-4 w-4" />
                          </Button>
                        </a>
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </>
  );
};
