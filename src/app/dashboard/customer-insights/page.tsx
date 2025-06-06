
"use client";

import { useEffect, useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import type { UserProfile, Order, CartItem, Category } from '@/types/pos';
import { mockCustomers } from '@/lib/mockCustomers';
import { DollarSign, ShoppingCart, Users, TrendingUp, Percent, CalendarPlus, UserCheck, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

const ALL_USERS_STORAGE_KEY = 'allUserProfilesSilzeyPOS';
const DASHBOARD_COMPLETED_ORDERS_STORAGE_KEY = 'dashboardCompletedOrdersSilzey';

interface CustomerMetrics extends UserProfile {
  totalSpent: number;
  orderCount: number;
  averageOrderValue: number;
  preferredCategories: { category: Category; count: number }[];
  lastOrderDate?: Date;
}

const calculateCustomerMetrics = (customers: UserProfile[], orders: Order[]): CustomerMetrics[] => {
  return customers.map(customer => {
    const customerOrders = orders.filter(order => order.customerId === customer.id);
    const totalSpent = customerOrders.reduce((sum, order) => sum + order.totalAmount, 0);
    const orderCount = customerOrders.length;
    const averageOrderValue = orderCount > 0 ? totalSpent / orderCount : 0;

    const categoryCounts: Record<string, number> = {};
    customerOrders.forEach(order => {
      order.items.forEach(item => {
        categoryCounts[item.category] = (categoryCounts[item.category] || 0) + item.quantity;
      });
    });
    const preferredCategories = Object.entries(categoryCounts)
      .map(([category, count]) => ({ category: category as Category, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 3);

    const lastOrderDate = customerOrders.length > 0 
        ? new Date(Math.max(...customerOrders.map(o => new Date(o.orderDate).getTime())))
        : undefined;

    return {
      ...customer,
      totalSpent,
      orderCount,
      averageOrderValue,
      preferredCategories,
      lastOrderDate,
    };
  });
};

const SegmentCard: React.FC<{ title: string; description: string; icon: React.ElementType; customers: CustomerMetrics[]; actionText?: string; criteriaNote?: string }> = 
  ({ title, description, icon: Icon, customers, actionText, criteriaNote }) => {
  if (!customers || customers.length === 0) {
    return (
      <Card className="shadow-lg">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-3">
            <Icon className="h-7 w-7 text-primary" />
            <CardTitle className="text-lg font-headline">{title}</CardTitle>
          </div>
          <CardDescription className="text-xs">{description}</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground text-center py-4">No customers fit this segment currently.</p>
          {criteriaNote && <p className="text-xs text-muted-foreground italic mt-2 text-center">Criteria: {criteriaNote}</p>}
        </CardContent>
      </Card>
    );
  }
  return (
    <Card className="shadow-lg">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-3">
          <Icon className="h-7 w-7 text-primary" />
          <CardTitle className="text-lg font-headline">{title}</CardTitle>
        </div>
        <CardDescription className="text-xs">{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[200px]">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Customer</TableHead>
                <TableHead className="text-right">Metric</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {customers.slice(0, 5).map(customer => (
                <TableRow key={customer.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Avatar className="h-8 w-8 border">
                        <AvatarImage src={customer.avatarUrl} alt={customer.firstName} data-ai-hint={customer.dataAiHint || 'person'} />
                        <AvatarFallback>{customer.firstName.charAt(0)}{customer.lastName.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <Link href={`/dashboard/customers/${customer.id}`} className="hover:underline text-primary text-xs font-medium">
                        {customer.firstName} {customer.lastName}
                      </Link>
                    </div>
                  </TableCell>
                  <TableCell className="text-right text-xs">
                    {title.includes("Spenders") && `$${customer.totalSpent.toFixed(2)} spent`}
                    {title.includes("Frequent") && `${customer.orderCount} orders`}
                    {title.includes("Category") && customer.preferredCategories[0]?.category}
                    {title.includes("Newcomers") && `Joined: ${new Date(customer.memberSince).toLocaleDateString()}`}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </ScrollArea>
        {criteriaNote && <p className="text-xs text-muted-foreground italic mt-2">Criteria: {criteriaNote}</p>}
        {actionText && <p className="text-sm font-semibold text-accent-foreground mt-3">{actionText}</p>}
      </CardContent>
    </Card>
  );
};


export default function CustomerInsightsPage() {
  const [customerMetrics, setCustomerMetrics] = useState<CustomerMetrics[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Moved PRODUCT_CATEGORIES_LIST declaration here
  const PRODUCT_CATEGORIES_LIST: Category[] = ["Flower", "Concentrates", "Vapes", "Edibles"];

  useEffect(() => {
    setIsLoading(true);
    let allUserProfiles: UserProfile[] = [...mockCustomers]; // Start with static mocks
    let allOrders: Order[] = [];

    if (typeof window !== 'undefined') {
      const storedUsersRaw = localStorage.getItem(ALL_USERS_STORAGE_KEY);
      if (storedUsersRaw) {
        try {
          const storedUsers = JSON.parse(storedUsersRaw) as UserProfile[];
          // Combine and deduplicate users, giving preference to stored users if email matches
          const profileMap = new Map<string, UserProfile>();
          storedUsers.forEach(u => profileMap.set(u.email, u));
          mockCustomers.forEach(mc => {
            if (!profileMap.has(mc.email)) profileMap.set(mc.email, mc);
          });
          allUserProfiles = Array.from(profileMap.values());
        } catch (e) { console.error("Error parsing stored users:", e); }
      }

      const completedOrdersRaw = localStorage.getItem(DASHBOARD_COMPLETED_ORDERS_STORAGE_KEY);
      if (completedOrdersRaw) {
        try { allOrders = JSON.parse(completedOrdersRaw); } catch (e) { console.error("Error parsing completed orders:", e); }
      }
    }
    
    // Add order history from static mockCustomers if not present in allOrders
    mockCustomers.forEach(mc => {
        if (mc.orderHistory && mc.orderHistory.length > 0) {
            mc.orderHistory.forEach(mco => {
                if (!allOrders.some(order => order.id === mco.id)) {
                    allOrders.push({...mco, customerId: mc.id }); // Ensure customerId is set
                }
            });
        }
    });


    const metrics = calculateCustomerMetrics(allUserProfiles, allOrders);
    setCustomerMetrics(metrics.sort((a,b) => b.totalSpent - a.totalSpent)); // Default sort by total spent
    setIsLoading(false);
  }, []);

  const topSpenders = useMemo(() => 
    [...customerMetrics].sort((a, b) => b.totalSpent - a.totalSpent).slice(0, 10), 
  [customerMetrics]);

  const frequentBuyers = useMemo(() => 
    [...customerMetrics].sort((a, b) => b.orderCount - a.orderCount).filter(c => c.orderCount > 0).slice(0, 10), 
  [customerMetrics]);

  const categoryEnthusiasts = useMemo(() => {
    const enthusiasts: Record<string, CustomerMetrics[]> = {};
    PRODUCT_CATEGORIES_LIST.forEach(cat => {
      enthusiasts[cat] = customerMetrics
        .filter(c => c.preferredCategories.some(pc => pc.category === cat && pc.count > 0) && c.orderCount > 0)
        .sort((a, b) => (b.preferredCategories.find(pc => pc.category === cat)?.count || 0) - (a.preferredCategories.find(pc => pc.category === cat)?.count || 0))
        .slice(0, 5);
    });
    return enthusiasts;
  }, [customerMetrics, PRODUCT_CATEGORIES_LIST]); // Added PRODUCT_CATEGORIES_LIST to dependency array
  

  const recentNewcomers = useMemo(() => {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    return customerMetrics
      .filter(c => new Date(c.memberSince) > thirtyDaysAgo && c.orderCount > 0)
      .sort((a,b) => new Date(b.memberSince).getTime() - new Date(a.memberSince).getTime())
      .slice(0,10);
  }, [customerMetrics]);


  if (isLoading) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader><Skeleton className="h-8 w-1/2" /></CardHeader>
          <CardContent className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-64 w-full" />)}
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="shadow-xl">
        <CardHeader>
          <CardTitle className="font-headline text-2xl text-primary flex items-center">
            <Users className="mr-3 h-7 w-7" /> Customer Segmentation & Insights
          </CardTitle>
          <CardDescription>
            Illustrative customer segments based on purchasing behavior. Click names to view full profiles.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid md:grid-cols-2 lg:grid-cols-2 gap-6">
          <SegmentCard
            title="Top Spenders"
            description="Customers with the highest total purchase value."
            icon={DollarSign}
            customers={topSpenders}
            actionText="Consider loyalty rewards or exclusive offers."
            criteriaNote="Top 10 by total historical spend."
          />
          <SegmentCard
            title="Frequent Buyers"
            description="Customers who make purchases most often."
            icon={ShoppingCart}
            customers={frequentBuyers}
            actionText="Engage with early access or subscription models."
            criteriaNote="Top 10 by total order count (min. 1 order)."
          />
          {PRODUCT_CATEGORIES_LIST.map(category => (
            categoryEnthusiasts[category] && categoryEnthusiasts[category].length > 0 && (
              <SegmentCard
                key={category}
                title={`${category} Enthusiasts`}
                description={`Customers who frequently purchase ${category.toLowerCase()}.`}
                icon={Percent}
                customers={categoryEnthusiasts[category]}
                actionText={`Target with new ${category.toLowerCase()} arrivals or special bundles.`}
                criteriaNote={`Top 5 by ${category} purchase volume (min. 1 order).`}
              />
            )
          ))}
           <SegmentCard
            title="Recent & Engaged Newcomers"
            description="New customers who've made purchases in the last 30 days."
            icon={CalendarPlus}
            customers={recentNewcomers}
            actionText="Nurture with welcome series and special first-timer deals."
            criteriaNote="Joined in last 30 days & made at least 1 purchase."
          />
        </CardContent>
      </Card>
       <Card className="shadow-xl mt-8">
        <CardHeader>
          <CardTitle className="font-headline text-xl text-primary flex items-center">
            <Sparkles className="mr-3 h-6 w-6" /> Future Enhancements
          </CardTitle>
          <CardDescription>
            Potential future developments for deeper customer understanding.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid md:grid-cols-2 gap-4 text-sm">
            <div className="p-3 bg-muted/30 rounded-md border">
                <h4 className="font-semibold text-primary/90">RFM Analysis</h4>
                <p className="text-muted-foreground text-xs">Segment by Recency, Frequency, Monetary value for more granular targeting.</p>
            </div>
            <div className="p-3 bg-muted/30 rounded-md border">
                <h4 className="font-semibold text-primary/90">Behavioral Cohorts</h4>
                <p className="text-muted-foreground text-xs">Track groups of customers over time based on acquisition date or first action.</p>
            </div>
            <div className="p-3 bg-muted/30 rounded-md border">
                <h4 className="font-semibold text-primary/90">Churn Prediction (Mock)</h4>
                <p className="text-muted-foreground text-xs">Identify customers at risk of churning based on declining activity.</p>
            </div>
            <div className="p-3 bg-muted/30 rounded-md border">
                <h4 className="font-semibold text-primary/90">Personalized Recommendations AI</h4>
                <p className="text-muted-foreground text-xs">Integrate AI to suggest products based on individual or segment behavior.</p>
            </div>
        </CardContent>
      </Card>
    </div>
  );
}

