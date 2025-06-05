
"use client";

import { useState, useMemo, useEffect } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Download, Eye, Edit, PackageSearch, Filter, AlertTriangle } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { Order, OrderStatus, CartItem, Category as ProductCategory } from '@/types/pos';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useRouter } from 'next/navigation';
import OrderReceiptModal from '@/components/dashboard/OrderReceiptModal';
import { generateInitialMockOrders } from '@/lib/mockOrderData'; // Import from new lib file
// CATEGORIES and TAGS are not directly used here anymore for mock generation, but might be for UI if expanded.

const POS_PENDING_ORDERS_STORAGE_KEY = 'posPendingOrdersSilzey';
const DASHBOARD_COMPLETED_ORDERS_STORAGE_KEY = 'dashboardCompletedOrdersSilzey';

// This constant is used for the filter dropdown in this page's UI.
const ALL_ORDER_STATUSES_FOR_FILTER: OrderStatus[] = ["In-Store", "Online", "Pending Checkout"];

const convertOrdersToCSV = (data: Order[]) => {
  const headers = ['Order ID', 'Customer Name', 'Customer ID', 'Order Date', 'Status', 'Total Amount', 'Item Count', 'Shipping Address', 'Payment Method', 'Submitted by POS', 'Items (Name|Qty|Price;...)'];
  const csvRows = [
    headers.join(','),
    ...data.map(order =>
      [
        order.id,
        `"${order.customerName.replace(/"/g, '""')}"`,
        order.customerId || '',
        new Date(order.orderDate).toLocaleDateString(),
        order.status,
        order.totalAmount.toFixed(2),
        order.itemCount,
        `"${order.shippingAddress?.replace(/"/g, '""') || ''}"`,
        `"${order.paymentMethod || ''}"`,
        order.submittedByPOS ? 'Yes' : 'No',
        `"${order.items.map(item => `${item.name}|${item.quantity}|${item.price}`).join(';')}"`
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

const getStatusBadgeVariant = (status: OrderStatus): "default" | "secondary" | "outline" | "destructive" => {
  switch (status) {
    case "In-Store": return "default";
    case "Online": return "secondary";
    case "Pending Checkout": return "destructive";
    default: return "outline";
  }
};

const getStatusBadgeClassName = (status: OrderStatus): string => {
  switch (status) {
    case "In-Store": return "bg-blue-500/20 text-blue-700 border-blue-500/30";
    case "Online": return "bg-green-500/20 text-green-700 border-green-500/30";
    case "Pending Checkout": return "bg-orange-500/20 text-orange-700 border-orange-500/30 animate-pulse";
    default: return "border-muted-foreground";
  }
};


export default function OrdersPage() {
  const [allOrders, setAllOrders] = useState<Order[]>([]);
  const [filterOrderId, setFilterOrderId] = useState('');
  const [filterCustomerName, setFilterCustomerName] = useState('');
  const [filterStatus, setFilterStatus] = useState<OrderStatus | 'All'>('All');
  const [selectedOrderForModal, setSelectedOrderForModal] = useState<Order | null>(null);
  const [isReceiptModalOpen, setIsReceiptModalOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const staticMockOrders = generateInitialMockOrders(); // Use imported generator
    let pendingOrders: Order[] = [];
    try {
      const pendingOrdersRaw = localStorage.getItem(POS_PENDING_ORDERS_STORAGE_KEY);
      if (pendingOrdersRaw) {
        pendingOrders = JSON.parse(pendingOrdersRaw);
      }
    } catch (e) {
      console.error("Error parsing pending orders from localStorage", e);
    }

    let completedDashboardOrders: Order[] = [];
     try {
      const completedRaw = localStorage.getItem(DASHBOARD_COMPLETED_ORDERS_STORAGE_KEY);
      if (completedRaw) {
        completedDashboardOrders = JSON.parse(completedRaw);
      }
    } catch (e) {
      console.error("Error parsing completed dashboard orders from localStorage", e);
    }

    const combined = [...pendingOrders, ...completedDashboardOrders, ...staticMockOrders];
    const uniqueOrders = Array.from(new Map(combined.map(order => [order.id, order])).values());

    setAllOrders(uniqueOrders.sort((a,b) => new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime() ));
  }, []);


  const filteredOrders = useMemo(() => {
    return allOrders.filter(order => {
      const orderIdMatch = filterOrderId ? order.id.toLowerCase().includes(filterOrderId.toLowerCase()) : true;
      const customerNameMatch = filterCustomerName ? order.customerName.toLowerCase().includes(filterCustomerName.toLowerCase()) : true;
      const statusMatch = filterStatus === 'All' || order.status === filterStatus;
      return orderIdMatch && customerNameMatch && statusMatch;
    });
  }, [allOrders, filterOrderId, filterCustomerName, filterStatus]);

  const handleDownload = () => {
    const csvString = convertOrdersToCSV(filteredOrders);
    downloadCSV(csvString, 'orders_report.csv');
  };

  const handleShowOrderReceipt = (order: Order) => {
    setSelectedOrderForModal(order);
    setIsReceiptModalOpen(true);
  };

  const handleCloseOrderReceiptModal = () => {
    setIsReceiptModalOpen(false);
    setSelectedOrderForModal(null);
  };

  return (
    <>
    <div className="space-y-6">
      <Card className="shadow-lg">
        <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <div>
            <CardTitle className="font-headline text-primary flex items-center">
              <PackageSearch className="mr-2 h-6 w-6" /> Orders List
            </CardTitle>
            <CardDescription>View and manage all customer orders. Pending POS checkouts are highlighted.</CardDescription>
          </div>
          <Button variant="outline" size="sm" onClick={handleDownload} className="w-full sm:w-auto">
            <Download className="mr-2 h-4 w-4" />
            Download CSV
          </Button>
        </CardHeader>

        <CardContent className="py-4 border-y border-border">
          <div className="flex flex-col md:flex-row gap-4 items-end">
            <div className="flex-grow md:flex-1 min-w-[150px]">
              <Label htmlFor="filterOrderId" className="text-xs text-muted-foreground block mb-1">Filter by Order ID</Label>
              <Input
                id="filterOrderId"
                placeholder="ORD-1234..."
                value={filterOrderId}
                onChange={(e) => setFilterOrderId(e.target.value)}
                className="h-9"
              />
            </div>
            <div className="flex-grow md:flex-1 min-w-[150px]">
              <Label htmlFor="filterCustomerName" className="text-xs text-muted-foreground block mb-1">Filter by Customer</Label>
              <Input
                id="filterCustomerName"
                placeholder="Customer name..."
                value={filterCustomerName}
                onChange={(e) => setFilterCustomerName(e.target.value)}
                className="h-9"
              />
            </div>
            <div className="flex-grow md:flex-1 min-w-[150px]">
              <Label htmlFor="filterStatus" className="text-xs text-muted-foreground block mb-1">Filter by Status</Label>
              <Select value={filterStatus} onValueChange={(value) => setFilterStatus(value as OrderStatus | 'All')}>
                <SelectTrigger id="filterStatus" className="h-9">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All Statuses</SelectItem>
                  {ALL_ORDER_STATUSES_FOR_FILTER.map(status => (
                    <SelectItem key={status} value={status}>{status}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
             <Button variant="outline" size="sm" className="h-9 md:self-end w-full md:w-auto" onClick={() => { /* Placeholder */ }}>
                <Filter className="mr-2 h-4 w-4" /> Apply Filters
            </Button>
          </div>
        </CardContent>

        <CardContent className="pt-4">
          <ScrollArea className="h-[600px] w-full">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[120px]">Order ID</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                  <TableHead className="text-center">Items</TableHead>
                  <TableHead className="text-center">Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrders.length > 0 ? (
                  filteredOrders.map((order) => (
                    <TableRow key={order.id} className={`hover:bg-muted/50 ${order.status === 'Pending Checkout' ? 'bg-orange-500/5' : ''}`}>
                      <TableCell className="font-medium">{order.id}</TableCell>
                      <TableCell>{order.customerName}</TableCell>
                      <TableCell>{new Date(order.orderDate).toLocaleDateString()}</TableCell>
                      <TableCell className="text-right">${order.totalAmount.toFixed(2)}</TableCell>
                      <TableCell className="text-center">{order.itemCount}</TableCell>
                      <TableCell className="text-center">
                        <div className="flex items-center justify-center">
                          {order.status === 'Pending Checkout' && (
                            <span className="mr-2 h-3 w-3 rounded-full bg-destructive pulsate-red-dot"></span>
                          )}
                          <Badge
                            variant={getStatusBadgeVariant(order.status)}
                            className={`capitalize ${getStatusBadgeClassName(order.status)}`}
                          >
                            {order.status}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell className="text-right space-x-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="hover:bg-primary/10 text-primary"
                          aria-label={`View details for order ${order.id}`}
                           onClick={() => handleShowOrderReceipt(order)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => alert('Editing order ' + order.id + ' (mock)')} aria-label="Edit order" disabled={order.status === 'Pending Checkout'}>
                          <Edit className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                      No orders match your filters.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
    {selectedOrderForModal && (
        <OrderReceiptModal
          order={selectedOrderForModal}
          isOpen={isReceiptModalOpen}
          onClose={handleCloseOrderReceiptModal}
        />
      )}
    </>
  );
}
