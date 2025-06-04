
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
import { CATEGORIES as PRODUCT_CATEGORIES_LIST, TAGS as PRODUCT_TAGS_LIST } from '@/lib/data';

const POS_PENDING_ORDERS_STORAGE_KEY = 'posPendingOrdersSilzey';
const DASHBOARD_COMPLETED_ORDERS_STORAGE_KEY = 'dashboardCompletedOrdersSilzey'; // For orders processed by dashboard

const ALL_ORDER_STATUSES: OrderStatus[] = ["In-Store", "Online", "Pending Checkout"];

// --- Mock Data Generation (Kept for baseline, but localStorage will be primary for dynamic orders) ---
const mockProductNamesByCategory: Record<ProductCategory, string[]> = {
  "Flower": ["Mystic Haze Flower", "Stardust Sativa Pre-Roll", "Quasar Queen Flower", "Blue Dream Bud", "Green Crack Strain"],
  "Concentrates": ["Galaxy Gold Concentrate", "Cosmic Kush Shatter", "Nebula Nectar Wax", "Lunar Rosin", "Solar Flare Oil"],
  "Vapes": ["Orion's Haze Vape Pen", "Pulsar Pineapple Express Cartridge", "Zero-G Indica Disposable", "Comet Berry Vape", "Astro Mint Pods"],
  "Edibles": ["Lunar Lavender Gummies", "Orion's Belt Brownies", "Cosmic Kush Cookies", "Stardust Cereal Bar", "Nebula Nectar Chocolate"],
};

const getMockImageForCategory = (category: ProductCategory, index: number): { url: string; hint: string } => {
  return {
    url: `https://placehold.co/100x100`, // Changed here
    hint: "cannabis"
  };
};

const generateMockCartItems = (itemCount: number): CartItem[] => {
  const items: CartItem[] = [];
  const usedNames: Set<string> = new Set();
  for (let i = 0; i < itemCount; i++) {
    const category = PRODUCT_CATEGORIES_LIST[Math.floor(Math.random() * PRODUCT_CATEGORIES_LIST.length)];
    const productNamesForCategory = mockProductNamesByCategory[category];
    let name = productNamesForCategory[Math.floor(Math.random() * productNamesForCategory.length)];
    let uniqueNameAttempt = 0;
    while(usedNames.has(`${category}-${name}`) && uniqueNameAttempt < productNamesForCategory.length * 2) {
        name = productNamesForCategory[Math.floor(Math.random() * productNamesForCategory.length)];
        uniqueNameAttempt++;
    }
    usedNames.add(`${category}-${name}`);
    const imageDetails = getMockImageForCategory(category, i);
    items.push({
      id: `product-item-${category}-${Math.random().toString(36).substring(2, 9)}`,
      name: name,
      price: (Math.random() * 40 + 10).toFixed(2),
      tags: PRODUCT_TAGS_LIST[Math.floor(Math.random() * PRODUCT_TAGS_LIST.length)],
      rating: (Math.random() * 1.5 + 3.5).toFixed(1),
      category: category,
      image: imageDetails.url,
      dataAiHint: imageDetails.hint,
      quantity: Math.floor(Math.random() * 3) + 1,
    });
  }
  return items;
};

const generateInitialMockOrders = (): Order[] => Array.from({ length: 25 }, (_, i) => { // Reduced static mocks
  const statusIndex = i % (ALL_ORDER_STATUSES.length -1); // Exclude "Pending Checkout" for initial mocks
  const date = new Date(2024, 6, 28 - (i % 28));
  const items = generateMockCartItems(Math.floor(Math.random() * 4) + 1);
  const totalAmount = items.reduce((sum, item) => sum + parseFloat(item.price) * item.quantity, 0);
  return {
    id: `MOCK-ORD-${String(1001 + i).padStart(4, '0')}`,
    customerName: ['Liam Smith', 'Olivia Johnson', 'Noah Williams', 'Emma Brown', 'Oliver Jones'][i % 5],
    orderDate: date.toISOString(),
    status: ALL_ORDER_STATUSES[statusIndex],
    totalAmount: parseFloat(totalAmount.toFixed(2)),
    itemCount: items.reduce((sum, item) => sum + item.quantity, 0),
    items: items,
    shippingAddress: `${123 + i} Main St, Anytown, USA`,
    paymentMethod: ['Credit Card', 'PayPal', 'Stripe', 'Cash'][i % 4]
  };
});
// --- End Mock Data Generation ---

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
    case "Pending Checkout": return "destructive"; // Will be styled by className
    default: return "outline";
  }
};

const getStatusBadgeClassName = (status: OrderStatus): string => {
  switch (status) {
    case "In-Store": return "bg-blue-500/20 text-blue-700 border-blue-500/30";
    case "Online": return "bg-green-500/20 text-green-700 border-green-500/30";
    case "Pending Checkout": return "bg-orange-500/20 text-orange-700 border-orange-500/30 animate-pulse"; // Pulsating effect
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
    // Load orders from all sources
    const staticMockOrders = generateInitialMockOrders();
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

    // Combine and deduplicate (prefer localStorage if IDs match)
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
                  {ALL_ORDER_STATUSES.map(status => (
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

</content>
  </change>
  <change>
    <file>src/app/profile/page.tsx</file>
    <content><![CDATA[
"use client";

import type { UserProfile as UserProfileType } from '@/types/pos';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Edit3, Award, ShieldCheck, Activity, LogIn } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Skeleton } from '@/components/ui/skeleton';


export default function ProfilePage() {
  const { user, loading, signOut } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.replace('/auth/signin');
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-background text-foreground font-body p-4 sm:p-6 md:p-8 flex items-center justify-center">
        <div className="container mx-auto max-w-3xl">
          <Card className="overflow-hidden shadow-xl border-primary">
            <CardHeader className="bg-muted/30 p-6 flex flex-col sm:flex-row items-center gap-4">
              <Skeleton className="w-24 h-24 sm:w-32 sm:h-32 rounded-full" />
              <div className="text-center sm:text-left space-y-2">
                <Skeleton className="h-8 w-48" />
                <Skeleton className="h-5 w-64" />
                <Skeleton className="h-4 w-40" />
              </div>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <Skeleton className="h-6 w-1/4 mb-1" />
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-6 w-1/3 mb-2" />
              <Card className="bg-muted/20 p-4 border-border">
                <Skeleton className="h-4 w-3/4 mb-1.5" />
                <Skeleton className="h-4 w-full mb-1.5" />
                <Skeleton className="h-4 w-2/3 mb-1.5" />
              </Card>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Skeleton className="h-24 w-full" />
                <Skeleton className="h-24 w-full" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground font-body p-4 sm:p-6 md:p-8">
      <div className="container mx-auto max-w-3xl">
        <div className="mb-6 flex justify-between items-center">
          <Link href="/" passHref>
            <Button variant="outline">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to POS
            </Button>
          </Link>
          <h1 className="text-2xl sm:text-3xl font-bold font-headline text-primary">
            User Profile
          </h1>
          <Button variant="outline" onClick={signOut}>
            <LogIn className="mr-2 h-4 w-4" /> Sign Out
          </Button>
        </div>

        <Card className="overflow-hidden shadow-xl border-primary">
          <CardHeader className="bg-muted/30 p-6 flex flex-col sm:flex-row items-center gap-4">
            <div className="relative w-24 h-24 sm:w-32 sm:h-32 rounded-full overflow-hidden border-4 border-primary">
              <Image
                src={user.avatarUrl || 'https://placehold.co/150x150'} // Changed here
                alt={`${user.firstName} ${user.lastName}`}
                layout="fill"
                objectFit="cover"
                data-ai-hint={user.dataAiHint || "user avatar"}
              />
            </div>
            <div className="text-center sm:text-left">
              <CardTitle className="text-2xl sm:text-3xl font-headline">
                {user.firstName} {user.lastName}
              </CardTitle>
              <CardDescription className="text-md text-muted-foreground">{user.email}</CardDescription>
              <p className="text-sm text-muted-foreground mt-1">Member Since: {new Date(user.memberSince).toLocaleDateString()}</p>
            </div>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            {user.bio && (
              <div>
                <h3 className="text-lg font-semibold font-headline mb-1">Bio</h3>
                <p className="text-foreground/80 leading-relaxed">{user.bio}</p>
              </div>
            )}

            <div>
              <h3 className="text-lg font-semibold font-headline mb-2 flex items-center">
                <Activity className="mr-2 h-5 w-5 text-primary" />
                Recent Activity
              </h3>
              <Card className="bg-muted/20 p-4 border-border">
                <ul className="list-disc list-inside text-foreground/80 space-y-1.5 text-sm">
                  <li>Purchased 'Blue Dream' (Flower) - 2 days ago</li>
                  <li>Redeemed 100 loyalty points - 1 week ago</li>
                  <li>Viewed 'Concentrates' category - 1 week ago</li>
                  <li>First purchase: 'Sour Diesel' (Flower) on {new Date(user.memberSince).toLocaleDateString()}</li>
                </ul>
              </Card>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="bg-accent/10 p-4 border-accent/30">
                    <CardHeader className="p-0 pb-2 flex flex-row items-center space-x-2">
                         <Award className="h-5 w-5 text-accent" />
                         <CardTitle className="text-md font-semibold text-accent-foreground">Rewards Points</CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                        <p className="text-2xl font-bold text-accent">{user.rewardsPoints ?? 0}</p>
                    </CardContent>
                </Card>
                 <Card className="bg-secondary/10 p-4 border-secondary/30">
                    <CardHeader className="p-0 pb-2 flex flex-row items-center space-x-2">
                        <ShieldCheck className="h-5 w-5 text-secondary" />
                         <CardTitle className="text-md font-semibold text-secondary-foreground">Account Status</CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                        <p className="text-lg font-medium text-green-600">Active</p>
                    </CardContent>
                </Card>
            </div>
             <div className="mt-6 flex justify-end">
               <Button variant="outline" disabled>
                <Edit3 className="mr-2 h-4 w-4" /> Edit Profile
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
