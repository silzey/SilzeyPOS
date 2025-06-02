
"use client";

import { useEffect, useState } from 'react';
import { DollarSign, Users, ShoppingCart, FileText, ListChecks, Settings, PackageSearch, BarChartBig, UserPlus, AlertTriangle } from 'lucide-react';
import { StatCard } from '@/components/dashboard/StatCard';
import { SalesOverviewChart } from '@/components/dashboard/SalesOverviewChart';
import { RecentTransactionsTable } from '@/components/dashboard/RecentTransactionsTable';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import type { Order, UserProfile, InventoryItem } from '@/types/pos';

const DASHBOARD_COMPLETED_ORDERS_STORAGE_KEY = 'dashboardCompletedOrdersSilzey';
const NEWLY_REGISTERED_USERS_STORAGE_KEY = 'newlyRegisteredUsersSilzey';
const INVENTORY_STORAGE_KEY = 'silzeyAppInventory';
const POS_PENDING_ORDERS_STORAGE_KEY = 'posPendingOrdersSilzey';

// Helper function to get today's date in YYYY-MM-DD format
const getTodayDateString = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

// Helper to check if an ISO date string matches today's date
const isToday = (isoDateString?: string) => {
  if (!isoDateString) return false;
  try {
    const date = new Date(isoDateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}` === getTodayDateString();
  } catch (e) {
    return false; 
  }
};

export default function DashboardPage() {
  const router = useRouter();
  const [todaysRevenue, setTodaysRevenue] = useState(0);
  const [newCustomersToday, setNewCustomersToday] = useState(0);
  const [totalProducts, setTotalProducts] = useState(0);
  const [productsInStock, setProductsInStock] = useState(0);
  const [openOrdersCount, setOpenOrdersCount] = useState(0);
  const [revenueChange, setRevenueChange] = useState(0); // Mock for now
  const [newCustomerChange, setNewCustomerChange] = useState(0); // Mock for now

  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Calculate Today's Revenue
      const completedOrdersRaw = localStorage.getItem(DASHBOARD_COMPLETED_ORDERS_STORAGE_KEY);
      let revenue = 0;
      if (completedOrdersRaw) {
        try {
          const completedOrders: Order[] = JSON.parse(completedOrdersRaw);
          completedOrders.forEach(order => {
            if (order.processedAt && isToday(order.processedAt)) {
              revenue += order.totalAmount;
            }
          });
        } catch (e) { console.error("Error parsing completed orders for revenue:", e); }
      }
      setTodaysRevenue(revenue);
      // Mock revenue change for now
      setRevenueChange(Math.floor(Math.random() * 30 - 10)); 

      // Calculate New Customers Today
      const newUsersRaw = localStorage.getItem(NEWLY_REGISTERED_USERS_STORAGE_KEY);
      let newUsersCount = 0;
      if (newUsersRaw) {
        try {
          const newUsers: UserProfile[] = JSON.parse(newUsersRaw);
          newUsers.forEach(user => {
            if (isToday(user.memberSince)) {
              newUsersCount++;
            }
          });
        } catch (e) { console.error("Error parsing new users:", e); }
      }
      setNewCustomersToday(newUsersCount);
      // Mock new customer change for now
      setNewCustomerChange(Math.floor(Math.random() * 5 - 2));


      // Calculate Total Products & In Stock
      const inventoryRaw = localStorage.getItem(INVENTORY_STORAGE_KEY);
      if (inventoryRaw) {
        try {
          const inventory: InventoryItem[] = JSON.parse(inventoryRaw);
          setTotalProducts(inventory.length);
          setProductsInStock(inventory.filter(item => item.stock > 0).length);
        } catch (e) { console.error("Error parsing inventory:", e); }
      } else {
         setTotalProducts(0);
         setProductsInStock(0);
      }

      // Calculate Open Orders
      const pendingOrdersRaw = localStorage.getItem(POS_PENDING_ORDERS_STORAGE_KEY);
      if (pendingOrdersRaw) {
        try {
          const pendingOrders: Order[] = JSON.parse(pendingOrdersRaw);
          setOpenOrdersCount(pendingOrders.length);
        } catch (e) { console.error("Error parsing pending orders:", e); }
      } else {
        setOpenOrdersCount(0);
      }
    }
  }, []);

  const formatRevenueChange = (change: number) => {
    return `${change >= 0 ? '+' : ''}${change}% from yesterday`;
  };
   const formatCustomerChange = (change: number) => {
    return `${change >= 0 ? '+' : ''}${change} today`;
  };


  return (
    <div className="space-y-8">
      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Today's Revenue" value={`$${todaysRevenue.toFixed(2)}`} icon={DollarSign} description={formatRevenueChange(revenueChange)} />
        <StatCard title="New Customers" value={newCustomersToday.toString()} icon={UserPlus} description={formatCustomerChange(newCustomerChange)} />
        <StatCard title="Total Products" value={totalProducts.toString()} icon={PackageSearch} description={`${productsInStock} in stock`} />
        <StatCard title="Open Orders" value={openOrdersCount.toString()} icon={ListChecks} description={`${openOrdersCount} require attention`} />
      </div>

      {/* Main Content Grid (Chart and Management/Reports Cards) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <SalesOverviewChart />
        </div>
        
        <div className="space-y-8 lg:col-span-1">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center font-headline text-primary">
                <FileText className="mr-2 h-5 w-5" /> Quick Reports
              </CardTitle>
              <CardDescription>Download common sales reports.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full" variant="outline" onClick={() => alert('Downloading Daily Sales Report (mock)... This would trigger a backend process.')}>
                Daily Sales
              </Button>
              <Button className="w-full" variant="outline" onClick={() => alert('Downloading Weekly Summary (mock)... This would trigger a backend process.')}>
                Weekly Summary
              </Button>
               <Button className="w-full" variant="outline" onClick={() => alert('Downloading Product Performance (mock)... This would trigger a backend process.')}>
                Product Performance
              </Button>
            </CardContent>
          </Card>

          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center font-headline text-primary">
                <Settings className="mr-2 h-5 w-5" /> Management
              </CardTitle>
              <CardDescription>Access key management areas.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Link href="/dashboard/inventory" passHref className="block w-full">
                <Button className="w-full" variant="secondary">
                  Manage Inventory
                </Button>
              </Link>
              <Link href="/dashboard/customers" passHref className="block w-full">
                <Button className="w-full" variant="secondary">
                 View Customer List
                </Button>
              </Link>
              <Button className="w-full" variant="secondary" onClick={() => alert("Navigating to Store Settings (mock)...")}>
                Store Settings
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
      
      {/* Recent Transactions Table */}
      <RecentTransactionsTable />
    </div>
  );
}
