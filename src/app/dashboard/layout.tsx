
"use client";

import type { ReactNode } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Home, ShoppingBag, Users, BarChart3, LogOut as LogOutIcon } from 'lucide-react';

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const { user, loading, signOut } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.replace('/auth/signin');
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return (
      <div className="min-h-screen flex bg-muted/40">
        <aside className="hidden sm:flex flex-col w-64 bg-background border-r p-4 space-y-4">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-8 w-full mt-auto" />
        </aside>
        <div className="flex-1 flex flex-col">
          <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-4 border-b bg-background px-6">
            <Skeleton className="h-8 w-32" />
            <Skeleton className="h-8 w-8 rounded-full" />
          </header>
          <main className="flex-1 p-6 space-y-6">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-32 w-full rounded-lg" />)}
            </div>
            <Skeleton className="h-96 w-full rounded-lg" />
            <Skeleton className="h-64 w-full rounded-lg" />
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-muted/10">
      {/* Sidebar */}
      <aside className="hidden sm:flex flex-col w-64 bg-background border-r shadow-md">
        <div className="p-6 border-b">
          <Link href="/" passHref>
            <h1 className="text-2xl font-bold font-headline text-primary cursor-pointer">Silzey POS</h1>
          </Link>
          <p className="text-xs text-muted-foreground">Admin Dashboard</p>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <Button variant="ghost" className="w-full justify-start text-foreground hover:bg-primary/10 hover:text-primary" asChild>
            <Link href="/dashboard"><Home className="mr-3 h-5 w-5" /> Overview</Link>
          </Button>
          <Button variant="ghost" className="w-full justify-start text-foreground hover:bg-primary/10 hover:text-primary" onClick={() => alert("Navigate to Orders (mock)")}>
            <ShoppingBag className="mr-3 h-5 w-5" /> Orders
          </Button>
          <Button variant="ghost" className="w-full justify-start text-foreground hover:bg-primary/10 hover:text-primary" onClick={() => alert("Navigate to Customers (mock)")}>
            <Users className="mr-3 h-5 w-5" /> Customers
          </Button>
           <Button variant="ghost" className="w-full justify-start text-foreground hover:bg-primary/10 hover:text-primary" onClick={() => alert("Navigate to Analytics (mock)")}>
            <BarChart3 className="mr-3 h-5 w-5" /> Analytics
          </Button>
        </nav>
        <div className="p-4 mt-auto border-t">
           <Button variant="outline" className="w-full justify-start" onClick={signOut}>
            <LogOutIcon className="mr-3 h-5 w-5" /> Sign Out
          </Button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-4 border-b bg-background px-6 shadow-sm">
          <h1 className="text-xl font-semibold font-headline text-foreground">
            Welcome, {user.firstName}!
          </h1>
          {/* Mobile Menu Trigger (optional for future use) */}
           <Button variant="outline" size="icon" className="sm:hidden" onClick={() => alert("Open mobile menu (mock)")}>
            <Home className="h-5 w-5"/> {/* Placeholder icon */}
          </Button>
        </header>
        <main className="flex-1 p-6 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
