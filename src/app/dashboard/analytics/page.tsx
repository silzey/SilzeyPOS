
"use client";

import { useEffect, useState, useMemo } from 'react';
import { BarChart, Bar, PieChart, Pie, Cell, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { StatCard } from '@/components/dashboard/StatCard';
import type { Order, Category, UserProfile } from '@/types/pos';
import { DollarSign, ShoppingCart, Users, TrendingUp, Percent } from 'lucide-react'; // Added Percent icon
import { Skeleton } from '@/components/ui/skeleton';

const DASHBOARD_COMPLETED_ORDERS_STORAGE_KEY = 'dashboardCompletedOrdersSilzey';
const ALL_USERS_STORAGE_KEY = 'allUserProfilesSilzeyPOS';
const CATEGORIES_FOR_CHART: Category[] = ["Flower", "Concentrates", "Vapes", "Edibles"]; // For pie chart

// Define colors for the pie chart slices - ensure enough colors for your categories
const PIE_CHART_COLORS = ["hsl(var(--chart-1))", "hsl(var(--chart-2))", "hsl(var(--chart-3))", "hsl(var(--chart-4))", "hsl(var(--chart-5))"];

interface RevenueByCategoryData {
  name: Category;
  value: number;
}

// Helper for monthly sales data for BarChart
const generateMonthlySalesData = (orders: Order[]): Array<{ name: string; sales: number }> => {
  const salesByMonth: { [key: string]: number } = {};
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  orders.forEach(order => {
    const date = new Date(order.processedAt || order.orderDate);
    const monthKey = `${monthNames[date.getMonth()]} ${date.getFullYear()}`;
    salesByMonth[monthKey] = (salesByMonth[monthKey] || 0) + order.totalAmount;
  });

  // Get the last 6-12 months of data for the chart
  const sortedMonths = Object.keys(salesByMonth).sort((a, b) => {
    const [monthA, yearA] = a.split(' ');
    const [monthB, yearB] = b.split(' ');
    return new Date(`${monthA} 1, ${yearA}`).getTime() - new Date(`${monthB} 1, ${yearB}`).getTime();
  });
  
  const recentMonthsData = sortedMonths.slice(-12).map(monthKey => ({
    name: monthKey.split(' ')[0], // Just month name for brevity
    sales: salesByMonth[monthKey]
  }));

  if (recentMonthsData.length < 6) { // Pad with zero sales months if not enough data
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
        if (!recentMonthsData.find(d => d.name === monthName && d.sales > 0)) { // Avoid overwriting actual data
             recentMonthsData.unshift({name: monthName, sales: 0});
        }
    }
     return recentMonthsData.slice(-6); // Ensure only 6 months displayed
  }

  return recentMonthsData;
};


export default function AnalyticsPage() {
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [averageOrderValue, setAverageOrderValue] = useState(0);
  const [totalOrders, setTotalOrders] = useState(0);
  const [totalCustomers, setTotalCustomers] = useState(0);
  const [revenueByCategory, setRevenueByCategory] = useState<RevenueByCategoryData[]>([]);
  const [monthlySales, setMonthlySales] = useState<Array<{name: string; sales: number}>>([]);
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

    // Calculate KPIs
    const revenue = allCompletedOrders.reduce((sum, order) => sum + order.totalAmount, 0);
    setTotalRevenue(revenue);
    setTotalOrders(allCompletedOrders.length);
    setAverageOrderValue(allCompletedOrders.length > 0 ? revenue / allCompletedOrders.length : 0);
    
    const customerIdsFromOrders = new Set(allCompletedOrders.map(order => order.customerId).filter(Boolean));
    const customerIdsFromProfiles = new Set(allUserProfiles.map(profile => profile.id));
    const uniqueCustomerIds = new Set([...customerIdsFromOrders, ...customerIdsFromProfiles]);
    setTotalCustomers(uniqueCustomerIds.size);


    // Revenue by Category
    const categoryRevenueMap: Record<Category, number> = { Flower: 0, Concentrates: 0, Vapes: 0, Edibles: 0 };
    allCompletedOrders.forEach(order => {
      order.items.forEach(item => {
        if (CATEGORIES_FOR_CHART.includes(item.category)) {
          categoryRevenueMap[item.category] = (categoryRevenueMap[item.category] || 0) + (parseFloat(item.price) * item.quantity);
        }
      });
    });
    const categoryData = CATEGORIES_FOR_CHART.map(cat => ({
      name: cat,
      value: parseFloat(categoryRevenueMap[cat].toFixed(2))
    })).filter(d => d.value > 0);
    setRevenueByCategory(categoryData);

    // Monthly Sales
    setMonthlySales(generateMonthlySalesData(allCompletedOrders));

    setIsLoading(false);
  }, []);

  if (isLoading) {
    return (
      <div className="space-y-8">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-28 w-full" />)}
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          <Skeleton className="h-96 w-full" />
          <Skeleton className="h-96 w-full" />
        </div>
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
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                <StatCard title="Total Revenue" value={`$${totalRevenue.toFixed(2)}`} icon={DollarSign} description="All time gross revenue" />
                <StatCard title="Average Order Value" value={`$${averageOrderValue.toFixed(2)}`} icon={ShoppingCart} description="Average amount per order" />
                <StatCard title="Total Orders" value={totalOrders.toString()} icon={TrendingUp} description="All completed orders" />
                <StatCard title="Total Customers" value={totalCustomers.toString()} icon={Users} description="Unique customer profiles" />
            </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        <Card className="shadow-lg lg:col-span-3">
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

        <Card className="shadow-lg lg:col-span-2">
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
                    <Cell key={`cell-${index}`} fill={PIE_CHART_COLORS[index % PIE_CHART_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: number, name: string) => [`$${value.toFixed(2)}`, name]}/>
                <Legend 
                    iconSize={10} 
                    wrapperStyle={{ fontSize: '12px', color: "hsl(var(--muted-foreground))" }} 
                    formatter={(value, entry) => {
                        const { color } = entry;
                        return <span style={{ color }}>{value}</span>;
                    }}
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
      </div>
      
      {/* Placeholder for more advanced sections */}
      <Card className="shadow-md">
        <CardHeader>
            <CardTitle className="font-headline text-xl text-primary">Advanced Analytics</CardTitle>
            <CardDescription>More detailed reports and insights (coming soon).</CardDescription>
        </CardHeader>
        <CardContent>
            <p className="text-muted-foreground">Future sections like Top Selling Products, Customer Segmentation, Inventory Analysis, etc., will appear here.</p>
        </CardContent>
      </Card>

    </div>
  );
}
