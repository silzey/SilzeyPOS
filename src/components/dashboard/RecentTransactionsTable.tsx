
"use client"
import { useState, useEffect, useMemo, useCallback } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Download, Eye, Printer, RefreshCw } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { TransactionType, TransactionStatus, Order, CartItem } from '@/types/pos';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import OrderReceiptModal from '@/components/dashboard/OrderReceiptModal';

const DASHBOARD_COMPLETED_ORDERS_STORAGE_KEY = 'dashboardCompletedOrdersSilzey';

const convertOrdersToTransactions = (orders: Order[]): TransactionType[] => {
  if (!orders || orders.length === 0) {
    return [];
  }
  return orders.map(order => ({
    id: `TRX-ORD-${order.id.substring(order.id.length - 7)}`,
    originalOrderId: order.id,
    originalOrderType: 'order',
    customer: order.customerName,
    date: order.processedAt || order.orderDate,
    amount: `$${order.totalAmount.toFixed(2)}`,
    status: 'Completed', // Assuming all orders from this key are completed
    items: order.items.map((item: CartItem) => ({
      id: item.id,
      name: item.name,
      qty: item.quantity,
      price: parseFloat(item.price),
    })),
  }));
};


const convertToCSV = (data: TransactionType[]) => {
  const headers = ['Transaction ID', 'Original Order ID', 'Customer', 'Date', 'Amount', 'Status', 'Items (Name|Qty|Price;...)'];
  const csvRows = [
    headers.join(','),
    ...data.map(transaction =>
      [
        transaction.id,
        transaction.originalOrderId || '',
        `"${transaction.customer.replace(/"/g, '""')}"`,
        new Date(transaction.date).toLocaleDateString(),
        transaction.amount.replace('$', ''),
        transaction.status,
        `"${transaction.items.map(item => `${item.name}|${item.qty}|${item.price}`).join(';')}"`
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
  const [allTransactions, setAllTransactions] = useState<TransactionType[]>([]);
  const [filterCustomer, setFilterCustomer] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedOrderForModal, setSelectedOrderForModal] = useState<Order | null>(null);
  const [isReceiptModalOpen, setIsReceiptModalOpen] = useState(false);

  const fetchData = useCallback(async () => {
    await new Promise(resolve => setTimeout(resolve, 300)); 
    let completedOrdersFromStorage: Order[] = [];
    try {
      const completedOrdersRaw = localStorage.getItem(DASHBOARD_COMPLETED_ORDERS_STORAGE_KEY);
      if (completedOrdersRaw) {
        completedOrdersFromStorage = JSON.parse(completedOrdersRaw);
      }
    } catch (e) {
      console.error("Error parsing completed dashboard orders from localStorage in RTT:", e);
      completedOrdersFromStorage = [];
    }

    if (completedOrdersFromStorage && completedOrdersFromStorage.length > 0) {
      const converted = convertOrdersToTransactions(completedOrdersFromStorage);
      setAllTransactions(converted.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
    } else {
      setAllTransactions([]);
    }
  }, []);

  useEffect(() => {
    const initialLoad = async () => {
      setIsLoading(true);
      try {
        await fetchData();
      } catch (error) {
        console.error("Error during initial data load for RTT:", error);
      } finally {
        setIsLoading(false);
      }
    };
    initialLoad();
  }, [fetchData]);

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    try {
      await fetchData();
    } catch (error) {
      console.error("Error during data refresh for RTT:", error);
    } finally {
      setIsRefreshing(false);
    }
  }, [fetchData]);

  const filteredTransactions = useMemo(() => {
    return allTransactions.filter(transaction => {
      const customerMatch = filterCustomer ? transaction.customer.toLowerCase().includes(filterCustomer.toLowerCase()) : true;
      return customerMatch;
    });
  }, [allTransactions, filterCustomer]);

  const handleDownload = () => {
    if (filteredTransactions.length === 0) {
        alert("No transactions to download.");
        return;
    }
    const csvString = convertToCSV(filteredTransactions);
    downloadCSV(csvString, 'recent_transactions_from_pos.csv');
  };

  const handleShowOrderReceipt = (transaction: TransactionType) => {
    if (!transaction.originalOrderId) {
      alert("Cannot view details: Original order ID not found for this transaction.");
      return;
    }
    try {
      const completedOrdersRaw = localStorage.getItem(DASHBOARD_COMPLETED_ORDERS_STORAGE_KEY);
      if (completedOrdersRaw) {
        const completedOrders: Order[] = JSON.parse(completedOrdersRaw);
        const orderToShow = completedOrders.find(o => o.id === transaction.originalOrderId);
        if (orderToShow) {
          setSelectedOrderForModal(orderToShow);
          setIsReceiptModalOpen(true);
        } else {
          alert(`Original order (${transaction.originalOrderId}) not found in completed orders.`);
        }
      } else {
        alert("No completed orders found in storage.");
      }
    } catch (e) {
      console.error("Error loading order for modal:", e);
      alert("Error loading order details.");
    }
  };

  const handleCloseOrderReceiptModal = () => {
    setIsReceiptModalOpen(false);
    setSelectedOrderForModal(null);
  };
  
  if (isLoading) {
    return (
        <Card className="shadow-lg">
            <CardHeader>
                <Skeleton className="h-7 w-48" />
                <Skeleton className="h-4 w-64 mt-1" />
            </CardHeader>
            <CardContent className="py-4 border-y border-border">
                 <Skeleton className="h-9 w-full" />
            </CardContent>
            <CardContent className="pt-4">
                 <div className="space-y-3">
                    {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-10 w-full" />)}
                </div>
            </CardContent>
        </Card>
    );
  }

  return (
    <>
      <Card className="shadow-lg">
        <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <div>
            <CardTitle className="font-headline text-primary">Recent POS Transactions</CardTitle>
            <CardDescription>Transactions from completed POS checkouts. Refresh to see new ones.</CardDescription>
          </div>
          <Button variant="outline" size="sm" onClick={handleDownload} className="w-full sm:w-auto" disabled={filteredTransactions.length === 0}>
            <Download className="mr-2 h-4 w-4" />
            Download CSV
          </Button>
        </CardHeader>

        <CardContent className="py-4 border-y border-border">
          <div className="flex flex-col sm:flex-row gap-4 items-end">
            <div className="flex-grow sm:flex-1 min-w-[150px] sm:min-w-[200px]">
              <Label htmlFor="filterCustomerRTT" className="text-xs text-muted-foreground block mb-1">Filter by Customer</Label>
              <Input
                id="filterCustomerRTT"
                placeholder="Customer name..."
                value={filterCustomer}
                onChange={(e) => setFilterCustomer(e.target.value)}
                className="h-9"
              />
            </div>
            <Button variant="outline" size="sm" onClick={handleRefresh} className="h-9 md:self-end w-full md:w-auto" disabled={isRefreshing}>
                <RefreshCw className={`mr-2 h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} /> 
                {isRefreshing ? 'Refreshing...' : 'Refresh List'}
            </Button>
          </div>
        </CardContent>

        <CardContent className="pt-4">
          <ScrollArea className="h-[300px] w-full">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[150px]">Transaction ID</TableHead>
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
                      <TableCell className="font-medium" title={transaction.originalOrderId ? `Orig. Order: ${transaction.originalOrderId}` : ''}>
                        {transaction.id}
                      </TableCell>
                      <TableCell>{transaction.customer}</TableCell>
                      <TableCell>{new Date(transaction.date).toLocaleString()}</TableCell>
                      <TableCell className="text-right">{transaction.amount}</TableCell>
                      <TableCell className="text-center">
                        <Badge
                          variant={'default'} // Status is always 'Completed' here, so variant can be 'default' or green-styled
                          className={`capitalize ${getStatusBadgeClassName(transaction.status)}`}
                        >
                          {transaction.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right space-x-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          title={`View Details for Order ${transaction.originalOrderId}`}
                          aria-label={`View details for order ${transaction.originalOrderId}`}
                          onClick={() => handleShowOrderReceipt(transaction)}
                          disabled={!transaction.originalOrderId}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          title={`Print Receipt for Order ${transaction.originalOrderId}`}
                          aria-label={`Print receipt for order ${transaction.originalOrderId}`}
                          onClick={() => {
                            if (transaction.originalOrderId && transaction.originalOrderType === 'order') {
                              const url = `/dashboard/print-receipt/${transaction.originalOrderId}?type=order`;
                              window.open(url, '_blank');
                            } else {
                               alert('Cannot print receipt: Original order ID not found.');
                            }
                          }}
                          disabled={!transaction.originalOrderId}
                        >
                          <Printer className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                      No transactions found. Process orders from the Live POS Queue to see them here.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </ScrollArea>
        </CardContent>
      </Card>
      {selectedOrderForModal && (
        <OrderReceiptModal
          order={selectedOrderForModal}
          isOpen={isReceiptModalOpen}
          onClose={handleCloseOrderReceiptModal}
        />
      )}
    </>
  );
};
