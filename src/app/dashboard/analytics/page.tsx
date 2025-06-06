
"use client";

import { useEffect, useState, useMemo } from 'react';
import { BarChart, Bar, PieChart, Pie, Cell, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { StatCard } from '@/components/dashboard/StatCard';
import type { Order, Category, UserProfile } from '@/types/pos';
import { DollarSign, ShoppingCart, Users, TrendingUp, ClipboardList, ShieldCheck, Network, CalendarCheck, ClipboardCheck, Archive, Brain } from 'lucide-react'; // Added Brain
import { Skeleton } from '@/components/ui/skeleton';

const DASHBOARD_COMPLETED_ORDERS_STORAGE_KEY = 'dashboardCompletedOrdersSilzey';
const ALL_USERS_STORAGE_KEY = 'allUserProfilesSilzeyPOS';
const CATEGORIES_FOR_CHART: Category[] = ["Flower", "Concentrates", "Vapes", "Edibles"];

const PIE_CHART_COLORS = ["hsl(var(--chart-1))", "hsl(var(--chart-2))", "hsl(var(--chart-3))", "hsl(var(--chart-4))", "hsl(var(--chart-5))"];

interface ChartData {
  name: string;
  value: number;
}

const generateMonthlySalesData = (orders: Order[]): Array<{ name: string; sales: number }> => {
  const salesByMonth: { [key: string]: number } = {};
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  orders.forEach(order => {
    const date = new Date(order.processedAt || order.orderDate);
    const monthKey = `${monthNames[date.getMonth()]} ${date.getFullYear()}`;
    salesByMonth[monthKey] = (salesByMonth[monthKey] || 0) + order.totalAmount;
  });

  const sortedMonths = Object.keys(salesByMonth).sort((a, b) => {
    const [monthA, yearA] = a.split(' ');
    const [monthB, yearB] = b.split(' ');
    return new Date(`${monthA} 1, ${yearA}`).getTime() - new Date(`${monthB} 1, ${yearB}`).getTime();
  });
  
  const recentMonthsData = sortedMonths.slice(-12).map(monthKey => ({
    name: monthKey.split(' ')[0],
    sales: salesByMonth[monthKey]
  }));

  if (recentMonthsData.length < 6) {
    const currentYear = new Date().getFullYear();
    const currentMonthIndex = new Date().getMonth();
    for(let i = 5; i >= 0 && recentMonthsData.length < 6 ; i--) {
        let monthIndex = currentMonthIndex - i;
        let year = currentYear;
        if (monthIndex < 0) {
            monthIndex += 12;
            year -=1;
        }
        const monthName = monthNames[monthIndex];
        if (!recentMonthsData.find(d => d.name === monthName && d.sales > 0)) {
             recentMonthsData.unshift({name: monthName, sales: 0});
        }
    }
     return recentMonthsData.slice(-6);
  }
  return recentMonthsData;
};


export default function AnalyticsPage() {
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [averageOrderValue, setAverageOrderValue] = useState(0);
  const [totalOrders, setTotalOrders] = useState(0);
  const [totalCustomers, setTotalCustomers] = useState(0);
  const [averageItemsPerOrder, setAverageItemsPerOrder] = useState(0);
  const [revenueByCategory, setRevenueByCategory] = useState<ChartData[]>([]);
  const [monthlySales, setMonthlySales] = useState<Array<{name: string; sales: number}>>([]);
  const [salesByPaymentMethod, setSalesByPaymentMethod] = useState<ChartData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    let allCompletedOrders: Order[] = [];
    let allUserProfiles: UserProfile[] = [];

    if (typeof window !== 'undefined') {
      const completedOrdersRaw = localStorage.getItem(DASHBOARD_COMPLETED_ORDERS_STORAGE_KEY);
      if (completedOrdersRaw) {
        try { allCompletedOrders = JSON.parse(completedOrdersRaw); } catch (e) { console.error("Error parsing completed orders:", e); }
      }

      const usersRaw = localStorage.getItem(ALL_USERS_STORAGE_KEY);
      if (usersRaw) {
        try { allUserProfiles = JSON.parse(usersRaw); } catch (e) { console.error("Error parsing user profiles:", e); }
      }
    }

    const revenue = allCompletedOrders.reduce((sum, order) => sum + order.totalAmount, 0);
    setTotalRevenue(revenue);
    setTotalOrders(allCompletedOrders.length);
    setAverageOrderValue(allCompletedOrders.length > 0 ? revenue / allCompletedOrders.length : 0);
    
    const customerIdsFromOrders = new Set(allCompletedOrders.map(order => order.customerId).filter(Boolean));
    const customerIdsFromProfiles = new Set(allUserProfiles.map(profile => profile.id));
    const uniqueCustomerIds = new Set([...customerIdsFromOrders, ...customerIdsFromProfiles]);
    setTotalCustomers(uniqueCustomerIds.size);

    const totalItemsSold = allCompletedOrders.reduce((sum, order) => sum + order.itemCount, 0);
    setAverageItemsPerOrder(allCompletedOrders.length > 0 ? totalItemsSold / allCompletedOrders.length : 0);

    const categoryRevenueMap: Record<string, number> = {};
    allCompletedOrders.forEach(order => {
      order.items.forEach(item => {
        if (CATEGORIES_FOR_CHART.includes(item.category)) {
          categoryRevenueMap[item.category] = (categoryRevenueMap[item.category] || 0) + (parseFloat(item.price) * item.quantity);
        }
      });
    });
    const categoryData = CATEGORIES_FOR_CHART.map(cat => ({
      name: cat,
      value: parseFloat(categoryRevenueMap[cat]?.toFixed(2) || "0")
    })).filter(d => d.value > 0);
    setRevenueByCategory(categoryData);

    setMonthlySales(generateMonthlySalesData(allCompletedOrders));

    const paymentMethodRevenueMap: Record<string, number> = {};
    allCompletedOrders.forEach(order => {
        const method = order.paymentMethod || 'Unknown';
        paymentMethodRevenueMap[method] = (paymentMethodRevenueMap[method] || 0) + order.totalAmount;
    });
    const paymentData = Object.entries(paymentMethodRevenueMap)
        .map(([name, value]) => ({ name, value: parseFloat(value.toFixed(2)) }))
        .filter(d => d.value > 0)
        .sort((a,b) => b.value - a.value); // Sort for consistent display
    setSalesByPaymentMethod(paymentData);

    setIsLoading(false);
  }, []);

  if (isLoading) {
    return (
      <div className="space-y-8">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {[...Array(5)].map((_, i) => <Skeleton key={i} className="h-28 w-full" />)}
        </div>
        <Skeleton className="h-96 w-full" /> {/* For Sales Over Time Bar Chart */}
        <div className="grid gap-6 md:grid-cols-2">
          <Skeleton className="h-96 w-full" /> {/* For Revenue by Category Pie Chart */}
          <Skeleton className="h-96 w-full" /> {/* For Sales by Payment Method Pie Chart */}
        </div>
        <Skeleton className="h-64 w-full" /> {/* For Compliance & Data Integrity Card */}
        <Skeleton className="h-48 w-full" /> {/* For Advanced Analytics Card */}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <Card className="shadow-md">
        <CardHeader>
            <CardTitle className="font-headline text-2xl text-primary">Key Performance Indicators</CardTitle>
            <CardDescription>High-level overview of your business performance.</CardDescription>
        </CardHeader>
        <CardContent>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
                <StatCard title="Total Revenue" value={`$${totalRevenue.toFixed(2)}`} icon={DollarSign} description="All time gross revenue" />
                <StatCard title="Average Order Value" value={`$${averageOrderValue.toFixed(2)}`} icon={ShoppingCart} description="Average amount per order" />
                <StatCard title="Total Orders" value={totalOrders.toString()} icon={TrendingUp} description="All completed orders" />
                <StatCard title="Total Customers" value={totalCustomers.toString()} icon={Users} description="Unique customer profiles" />
                <StatCard title="Avg. Items Per Order" value={averageItemsPerOrder.toFixed(1)} icon={ClipboardList} description="Average items in each sale" />
            </div>
        </CardContent>
      </Card>

      <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="font-headline text-primary">Sales Over Time</CardTitle>
            <CardDescription>Monthly sales revenue (mock data for last 6-12 months).</CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={monthlySales}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value >= 1000 ? `${value/1000}k` : value}`} />
                <Tooltip
                    cursor={{ fill: 'hsl(var(--accent))', fillOpacity: 0.3 }}
                    contentStyle={{ backgroundColor: "hsl(var(--popover))", border: "1px solid hsl(var(--border))", borderRadius: "var(--radius)" }}
                    labelStyle={{ color: "hsl(var(--popover-foreground))", fontWeight: "bold" }}
                    itemStyle={{ color: "hsl(var(--popover-foreground))" }}
                    formatter={(value: number) => [`$${value.toFixed(2)}`, "Sales"]}
                />
                <Legend wrapperStyle={{ color: "hsl(var(--muted-foreground))", paddingTop: '10px' }} />
                <Bar dataKey="sales" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} barSize={30} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="font-headline text-primary">Revenue by Category</CardTitle>
            <CardDescription>Distribution of revenue across product categories.</CardDescription>
          </CardHeader>
          <CardContent>
            {revenueByCategory.length > 0 ? (
            <ResponsiveContainer width="100%" height={350}>
              <PieChart>
                <Pie
                  data={revenueByCategory}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={110}
                  fill="#8884d8"
                  dataKey="value"
                  stroke="hsl(var(--background))"
                >
                  {revenueByCategory.map((entry, index) => (
                    <Cell key={`cell-cat-${index}`} fill={PIE_CHART_COLORS[index % PIE_CHART_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: number, name: string) => [`$${value.toFixed(2)}`, name]}/>
                <Legend 
                    iconSize={10} 
                    wrapperStyle={{ fontSize: '12px', color: "hsl(var(--muted-foreground))" }} 
                    formatter={(value, entry) => <span style={{ color: entry.color }}>{value}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
            ) : (
                <div className="flex items-center justify-center h-[350px]">
                    <p className="text-muted-foreground">No revenue data available for categories.</p>
                </div>
            )}
          </CardContent>
        </Card>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="font-headline text-primary">Sales by Payment Method</CardTitle>
            <CardDescription>Revenue distribution across payment methods.</CardDescription>
          </CardHeader>
          <CardContent>
            {salesByPaymentMethod.length > 0 ? (
            <ResponsiveContainer width="100%" height={350}>
              <PieChart>
                <Pie
                  data={salesByPaymentMethod}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={110}
                  fill="#8884d8"
                  dataKey="value"
                  stroke="hsl(var(--background))"
                >
                  {salesByPaymentMethod.map((entry, index) => (
                    <Cell key={`cell-pay-${index}`} fill={PIE_CHART_COLORS[(index + 2) % PIE_CHART_COLORS.length]} /> // Offset colors
                  ))}
                </Pie>
                <Tooltip formatter={(value: number, name: string) => [`$${value.toFixed(2)}`, name]}/>
                <Legend 
                    iconSize={10} 
                    wrapperStyle={{ fontSize: '12px', color: "hsl(var(--muted-foreground))" }} 
                    formatter={(value, entry) => <span style={{ color: entry.color }}>{value}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
            ) : (
                <div className="flex items-center justify-center h-[350px]">
                    <p className="text-muted-foreground">No sales data available by payment method.</p>
                </div>
            )}
          </CardContent>
        </Card>
      </div>
      
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="font-headline text-primary flex items-center">
            <ShieldCheck className="mr-3 h-7 w-7" /> Compliance & Data Integrity
          </CardTitle>
          <CardDescription>Tools and information for maintaining regulatory compliance and data accuracy.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="p-4 border rounded-lg bg-muted/30">
            <h4 className="font-semibold text-md flex items-center mb-1">
              <Network className="mr-2 h-5 w-5 text-primary/80" /> Real-time System & State Integration
            </h4>
            <p className="text-sm text-muted-foreground">
              Our POS is a real-time, web-based system designed for seamless integration with state cannabis tracking systems. 
              (Conceptual - actual integration requires specific state API development and certification).
            </p>
          </div>

          <div className="p-4 border rounded-lg bg-muted/30">
            <h4 className="font-semibold text-md flex items-center mb-1">
              <CalendarCheck className="mr-2 h-5 w-5 text-primary/80" /> Daily Record Reconciliation
            </h4>
            <p className="text-sm text-muted-foreground">
              Tools to reconcile daily POS transaction data with the state tracking system at the end of each business day.
              (Feature under development - placeholder for reconciliation reports and automated dashboards).
            </p>
          </div>

          <div className="p-4 border rounded-lg bg-muted/30">
            <h4 className="font-semibold text-md flex items-center mb-1">
              <ClipboardCheck className="mr-2 h-5 w-5 text-primary/80" /> Weekly Physical Inventory Reconciliation
            </h4>
            <p className="text-sm text-muted-foreground">
              Functionality to support and record weekly physical inventory counts and reconcile them with system records (at least once a week).
              (Feature under development - placeholder for inventory audit tools and variance reports).
            </p>
          </div>

          <div className="p-4 border rounded-lg bg-muted/30">
            <h4 className="font-semibold text-md flex items-center mb-1">
              <Archive className="mr-2 h-5 w-5 text-primary/80" /> Comprehensive Transaction Recording
            </h4>
            <p className="text-sm text-muted-foreground">
              All critical transactions including sales, transfers, returns, recalls, spoilage, and destruction of cannabis are accurately recorded within the system.
              (Placeholder for detailed transaction audit logs, export capabilities, and specialized reporting views for these transaction types).
            </p>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="font-headline text-primary flex items-center">
            <Brain className="mr-3 h-7 w-7" /> Advanced Analytics
          </CardTitle>
          <CardDescription>Unlock deeper insights into your business operations.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 border rounded-lg bg-muted/30">
            <h4 className="font-semibold text-md mb-1">Predictive Sales Forecasting</h4>
            <p className="text-sm text-muted-foreground">
              Leverage historical data and AI to predict future sales trends. (Feature under development)
            </p>
          </div>
          <div className="p-4 border rounded-lg bg-muted/30">
            <h4 className="font-semibold text-md mb-1">Customer Segmentation & Behavior</h4>
            <p className="text-sm text-muted-foreground">
              Analyze customer purchasing patterns to tailor marketing and product offerings. (Feature under development)
            </p>
          </div>
          <div className="p-4 border rounded-lg bg-muted/30">
            <h4 className="font-semibold text-md mb-1">Promotional Campaign Analysis</h4>
            <p className="text-sm text-muted-foreground">
              Measure the ROI and impact of your promotional activities. (Feature under development)
            </p>
          </div>
        </CardContent>
      </Card>

    </div>
  );
}

    

    