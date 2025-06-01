
"use client";

import { useState, useMemo } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Download, Eye, Edit, PackageSearch, Filter } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { Order, OrderStatus, TransactionItem } from '@/types/pos';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useRouter } from 'next/navigation';
import OrderReceiptModal from '@/components/dashboard/OrderReceiptModal';

const ORDER_STATUSES: OrderStatus[] = ["In-Store", "Online"];

const mockProductNames = [
  "Mystic Haze Flower", "Cosmic Kush Edible", "Nebula Nectar Vape", "Galaxy Gold Concentrate",
  "Stardust Sativa Pre-Roll", "Zero-G Indica Bud", "Lunar Lavender Tincture", "Orion's Belt Gummies",
  "Pulsar Pineapple Express", "Quasar Queen Flower"
];

const generateMockItems = (itemCount: number): TransactionItem[] => {
  const items: TransactionItem[] = [];
  for (let i = 0; i < itemCount; i++) {
    items.push({
      id: `item-${Math.random().toString(36).substr(2, 9)}`, // Added unique ID for items
      name: mockProductNames[Math.floor(Math.random() * mockProductNames.length)],
      qty: Math.floor(Math.random() * 3) + 1,
      price: parseFloat((Math.random() * 50 + 10).toFixed(2))
    });
  }
  return items;
};

export const mockOrders: Order[] = Array.from({ length: 50 }, (_, i) => {
  const statusIndex = i % ORDER_STATUSES.length;
  const date = new Date(2024, 6, 28 - (i % 28));
  const itemCount = Math.floor(Math.random() * 5) + 1;
  const items = generateMockItems(itemCount);
  const totalAmount = items.reduce((sum, item) => sum + item.price * item.qty, 0);

  return {
    id: `ORD-${String(1001 + i).padStart(4, '0')}`,
    customerName: ['Liam Smith', 'Olivia Johnson', 'Noah Williams', 'Emma Brown', 'Oliver Jones', 'Ava Garcia', 'Elijah Miller', 'Sophia Davis', 'Lucas Rodriguez', 'Isabella Martinez'][i % 10],
    orderDate: date.toISOString(),
    status: ORDER_STATUSES[statusIndex],
    totalAmount: parseFloat(totalAmount.toFixed(2)),
    itemCount: itemCount,
    items: items,
    shippingAddress: `${123 + i} Main St, Anytown, USA`,
    paymentMethod: ['Credit Card', 'PayPal', 'Stripe', 'Cash'][i % 4]
  };
});

const convertOrdersToCSV = (data: Order[]) => {
  const headers = ['Order ID', 'Customer Name', 'Order Date', 'Status', 'Total Amount', 'Item Count', 'Shipping Address', 'Payment Method'];
  const csvRows = [
    headers.join(','),
    ...data.map(order =>
      [
        order.id,
        `"${order.customerName.replace(/"/g, '""')}"`,
        new Date(order.orderDate).toLocaleDateString(),
        order.status,
        order.totalAmount.toFixed(2),
        order.itemCount,
        `"${order.shippingAddress?.replace(/"/g, '""') || ''}"`,
        `"${order.paymentMethod || ''}"`
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

const getStatusBadgeVariant = (status: OrderStatus): "default" | "secondary" | "outline" => {
  switch (status) {
    case "In-Store": return "default";
    case "Online": return "secondary";
    default: return "outline";
  }
};

const getStatusBadgeClassName = (status: OrderStatus): string => {
  switch (status) {
    case "In-Store": return "bg-blue-500/20 text-blue-700 border-blue-500/30";
    case "Online": return "bg-green-500/20 text-green-700 border-green-500/30";
    default: return "border-muted-foreground";
  }
};


export default function OrdersPage() {
  const [filterOrderId, setFilterOrderId] = useState('');
  const [filterCustomerName, setFilterCustomerName] = useState('');
  const [filterStatus, setFilterStatus] = useState<OrderStatus | 'All'>('All');
  const [selectedOrderForModal, setSelectedOrderForModal] = useState<Order | null>(null);
  const [isReceiptModalOpen, setIsReceiptModalOpen] = useState(false);
  const router = useRouter();

  const filteredOrders = useMemo(() => {
    return mockOrders.filter(order => {
      const orderIdMatch = filterOrderId ? order.id.toLowerCase().includes(filterOrderId.toLowerCase()) : true;
      const customerNameMatch = filterCustomerName ? order.customerName.toLowerCase().includes(filterCustomerName.toLowerCase()) : true;
      const statusMatch = filterStatus === 'All' || order.status === filterStatus;
      return orderIdMatch && customerNameMatch && statusMatch;
    });
  }, [filterOrderId, filterCustomerName, filterStatus]);

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
            <CardDescription>View and manage all customer orders.</CardDescription>
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
                  {ORDER_STATUSES.map(status => (
                    <SelectItem key={status} value={status}>{status}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
             <Button variant="outline" size="sm" className="h-9 md:self-end w-full md:w-auto">
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
                    <TableRow key={order.id} className="hover:bg-muted/50">
                      <TableCell className="font-medium">{order.id}</TableCell>
                      <TableCell>{order.customerName}</TableCell>
                      <TableCell>{new Date(order.orderDate).toLocaleDateString()}</TableCell>
                      <TableCell className="text-right">${order.totalAmount.toFixed(2)}</TableCell>
                      <TableCell className="text-center">{order.itemCount}</TableCell>
                      <TableCell className="text-center">
                        <Badge
                          variant={getStatusBadgeVariant(order.status)}
                          className={`capitalize ${getStatusBadgeClassName(order.status)}`}
                        >
                          {order.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right space-x-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="hover:bg-primary/10"
                          aria-label={`View details for order ${order.id}`}
                           onClick={() => handleShowOrderReceipt(order)}
                        >
                          <Eye className="h-4 w-4 text-primary" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => alert('Editing order ' + order.id + ' (mock)')} aria-label="Edit order">
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
