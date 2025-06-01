
"use client"
import { useState, useEffect, useMemo } from 'react';
// Removed Link import as it's no longer used directly for the action button
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Download, Eye, Printer } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { TransactionType as Transaction, TransactionItem, TransactionStatus } from '@/types/pos';
import { useRouter } from 'next/navigation'; // Added for programmatic navigation if needed

const transactionsData: Transaction[] = [
  { id: 'TRX731', customer: 'Aisha Khan', date: '2024-07-28', amount: '$75.50', status: 'Completed', items: [{name: 'Flower Product A', qty: 1, price: 30.00}, {name: 'Edible Product B', qty: 2, price: 22.75}] },
  { id: 'TRX732', customer: 'Ben Carter', date: '2024-07-28', amount: '$120.00', status: 'Completed', items: [{name: 'Vape Cartridge X', qty: 2, price: 60.00}] },
  { id: 'TRX733', customer: 'Chloe Davis', date: '2024-07-27', amount: '$45.20', status: 'Pending', items: [{name: 'Concentrate Y', qty: 1, price: 45.20}] },
  { id: 'TRX734', customer: 'Daniel Evans', date: '2024-07-27', amount: '$210.80', status: 'Completed', items: [{name: 'Premium Flower Z', qty: 1, price: 70.00}, {name: 'Accessory Pack', qty: 1, price: 140.80}] },
  { id: 'TRX735', customer: 'Elena Foster', date: '2024-07-26', amount: '$99.99', status: 'Failed', items: [{name: 'Specialty Edible', qty: 3, price: 33.33}] },
  { id: 'TRX736', customer: 'Finn Green', date: '2024-07-26', amount: '$32.00', status: 'Completed', items: [{name: 'Pre-roll Pack', qty: 1, price: 32.00}] },
];


const convertToCSV = (data: Transaction[]) => {
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

const getStatusBadgeClassName = (status: TransactionStatus): string => {
  switch (status) {
    case 'Completed': return 'bg-green-500/20 text-green-700 border-green-500/30';
    case 'Pending': return 'bg-yellow-500/20 text-yellow-700 border-yellow-500/30';
    case 'Failed': return 'bg-red-500/20 text-red-700 border-red-500/30';
    default: return 'border-muted-foreground';
  }
};

export const RecentTransactionsTable = () => {
  const [filterCustomer, setFilterCustomer] = useState('');
  const [filterStatus, setFilterStatus] = useState<TransactionStatus | 'All'>('All');
  const router = useRouter(); // Initialize router

  const filteredTransactions = useMemo(() => {
    return transactionsData.filter(transaction => {
      const customerMatch = filterCustomer ? transaction.customer.toLowerCase().includes(filterCustomer.toLowerCase()) : true;
      const statusMatch = filterStatus === 'All' || transaction.status === filterStatus;
      return customerMatch && statusMatch;
    });
  }, [filterCustomer, filterStatus]);

  const handleDownload = () => {
    const csvString = convertToCSV(filteredTransactions);
    downloadCSV(csvString, 'recent_transactions.csv');
  };

  return (
    <>
      <Card className="shadow-lg">
        <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <div>
            <CardTitle className="font-headline text-primary">Recent Transactions</CardTitle>
            <CardDescription>Latest transactions processed by the POS.</CardDescription>
          </div>
          <Button variant="outline" size="sm" onClick={handleDownload} className="w-full sm:w-auto">
            <Download className="mr-2 h-4 w-4" />
            Download CSV
          </Button>
        </CardHeader>

        <CardContent className="py-4 border-y border-border">
          <div className="flex flex-col sm:flex-row gap-4 items-end">
            <div className="flex-grow sm:flex-1 min-w-[150px] sm:min-w-[200px]">
              <Label htmlFor="filterCustomer" className="text-xs text-muted-foreground block mb-1">Filter by Customer</Label>
              <Input
                id="filterCustomer"
                placeholder="Customer name..."
                value={filterCustomer}
                onChange={(e) => setFilterCustomer(e.target.value)}
                className="h-9"
              />
            </div>
            <div className="flex-grow sm:flex-1 min-w-[150px] sm:min-w-[180px]">
              <Label htmlFor="filterStatus" className="text-xs text-muted-foreground block mb-1">Filter by Status</Label>
              <Select value={filterStatus} onValueChange={(value) => setFilterStatus(value as TransactionStatus | 'All')}>
                <SelectTrigger id="filterStatus" className="h-9">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All Statuses</SelectItem>
                  <SelectItem value="Completed">Completed</SelectItem>
                  <SelectItem value="Pending">Pending</SelectItem>
                  <SelectItem value="Failed">Failed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>

        <CardContent className="pt-4">
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
                {filteredTransactions.length > 0 ? (
                  filteredTransactions.map((transaction) => (
                    <TableRow key={transaction.id} className="hover:bg-muted/50">
                      <TableCell className="font-medium">{transaction.id}</TableCell>
                      <TableCell>{transaction.customer}</TableCell>
                      <TableCell>{transaction.date}</TableCell>
                      <TableCell className="text-right">{transaction.amount}</TableCell>
                      <TableCell className="text-center">
                        <Badge
                          variant={transaction.status === 'Completed' ? 'default' : transaction.status === 'Pending' ? 'secondary' : 'destructive'}
                          className={`capitalize ${getStatusBadgeClassName(transaction.status)}`}
                        >
                          {transaction.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right space-x-1">
                        <Button variant="ghost" size="icon" onClick={() => alert('Viewing details for ' + transaction.id + ' (mock)')} aria-label="View transaction details (legacy)">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          aria-label={`Print receipt for ${transaction.id}`}
                          onClick={() => {
                            const url = `/dashboard/print-receipt/${transaction.id}?type=transaction`;
                            console.log(`DEBUG_RTT: Print icon clicked for ${transaction.id}. Attempting to navigate to: ${url}`);
                            alert(`DEBUG_RTT: Print icon clicked for ${transaction.id}. Attempting to navigate to: ${url}`);
                            window.open(url, '_blank');
                          }}
                        >
                          <Printer className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                      No transactions match your filters.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </>
  );
};

