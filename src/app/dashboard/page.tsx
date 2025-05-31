
"use client";

import { DollarSign, Users, ShoppingCart, FileText, ListChecks, Settings, PackageSearch, BarChartBig } from 'lucide-react';
import { StatCard } from '@/components/dashboard/StatCard';
import { SalesOverviewChart } from '@/components/dashboard/SalesOverviewChart';
import { RecentTransactionsTable } from '@/components/dashboard/RecentTransactionsTable';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link'; // Keep if direct links are needed, otherwise Button onClick is fine

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Today's Revenue" value="$1,250.75" icon={DollarSign} description="+15% from yesterday" />
        <StatCard title="New Customers" value="8" icon={Users} description="+2 today" />
        <StatCard title="Total Products" value="1,480" icon={PackageSearch} description="7 categories" />
        <StatCard title="Open Orders" value="12" icon={ListChecks} description="3 require attention" />
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
              <Button className="w-full" variant="secondary" onClick={() => alert("Navigating to Inventory Management (mock)...")}>
                Manage Inventory
              </Button>
              <Button className="w-full" variant="secondary" onClick={() => alert("Navigating to User List (mock)...")}>
                View User List
              </Button>
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
