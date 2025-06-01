
"use client";

import type { ReactNode } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Home, ShoppingBag, Users, BarChart3, LogOut as LogOutIcon, Menu, Terminal } from 'lucide-react'; // Added Terminal
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const { user, loading, signOut } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.replace('/auth/signin');
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return (
      <div className="min-h-screen flex flex-col sm:flex-row bg-muted/40">
        <aside className="hidden sm:flex flex-col w-64 bg-background border-r p-4 space-y-4">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-8 w-full" /> 
          <Skeleton className="h-8 w-full mt-auto" />
        </aside>
        <div className="flex-1 flex flex-col min-w-0"> {/* Added min-w-0 for flex children */}
          <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-4 border-b bg-background px-6">
            <Skeleton className="h-8 w-32" />
            <Skeleton className="h-8 w-8 rounded-full" />
          </header>
          <main className="flex-1 p-6 space-y-6 overflow-y-auto">
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

  let headerTitle = `Welcome, ${user.firstName}!`;
  if (pathname === '/dashboard') {
    headerTitle = 'Overview';
  } else if (pathname === '/dashboard/orders') {
    headerTitle = 'Orders Management';
  } else if (pathname.startsWith('/dashboard/customers')) {
    headerTitle = 'Customer Management';
    if (pathname.split('/').length > 3) headerTitle = "Customer Profile";
  } else if (pathname === '/dashboard/live-queue') { // New page
    headerTitle = 'Live POS Queue';
  } else if (pathname === '/dashboard/analytics') { 
    headerTitle = 'Analytics';
  }


  const commonNavLinks = (
    <>
      <Button
        variant={pathname === '/dashboard' ? "secondary" : "ghost"}
        className="w-full justify-start text-foreground hover:bg-primary/10 hover:text-primary"
        asChild
        onClick={() => isMobileMenuOpen && setIsMobileMenuOpen(false)}
      >
        <Link href="/dashboard"><Home className="mr-3 h-5 w-5" /> Overview</Link>
      </Button>
      <Button
        variant={pathname === '/dashboard/live-queue' ? "secondary" : "ghost"}
        className="w-full justify-start text-foreground hover:bg-primary/10 hover:text-primary"
        asChild
        onClick={() => isMobileMenuOpen && setIsMobileMenuOpen(false)}
      >
        <Link href="/dashboard/live-queue"><Terminal className="mr-3 h-5 w-5" /> Live POS Queue</Link>
      </Button>
      <Button
        variant={pathname === '/dashboard/orders' ? "secondary" : "ghost"}
        className="w-full justify-start text-foreground hover:bg-primary/10 hover:text-primary"
        asChild
        onClick={() => isMobileMenuOpen && setIsMobileMenuOpen(false)}
      >
        <Link href="/dashboard/orders"><ShoppingBag className="mr-3 h-5 w-5" /> All Orders</Link>
      </Button>
      <Button
        variant={pathname.startsWith('/dashboard/customers') ? "secondary" : "ghost"}
        className="w-full justify-start text-foreground hover:bg-primary/10 hover:text-primary"
        asChild
        onClick={() => isMobileMenuOpen && setIsMobileMenuOpen(false)}
      >
        <Link href="/dashboard/customers"><Users className="mr-3 h-5 w-5" /> Customers</Link>
      </Button>
      <Button 
        variant={pathname === '/dashboard/analytics' ? "secondary" : "ghost"}
        className="w-full justify-start text-foreground hover:bg-primary/10 hover:text-primary" 
        onClick={() => { alert("Navigate to Analytics (mock)"); if (isMobileMenuOpen) setIsMobileMenuOpen(false); }}
      >
        <BarChart3 className="mr-3 h-5 w-5" /> Analytics
      </Button>
    </>
  );


  return (
    <div className="min-h-screen flex flex-col sm:flex-row bg-muted/10">
      <aside className="hidden sm:flex flex-col w-64 bg-background border-r shadow-md flex-shrink-0">
        <div className="p-6 border-b">
          <Link href="/" passHref>
            <h1 className="text-2xl font-bold font-headline text-primary cursor-pointer">Silzey POS</h1>
          </Link>
          <p className="text-xs text-muted-foreground">Admin Dashboard</p>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          {commonNavLinks}
        </nav>
        <div className="p-4 mt-auto border-t">
           <Button variant="outline" className="w-full justify-start" onClick={signOut}>
            <LogOutIcon className="mr-3 h-5 w-5" /> Sign Out
          </Button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0"> {/* Added min-w-0 for flex children */}
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-4 border-b bg-background px-6 shadow-sm">
          <div className="flex items-center gap-4">
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="sm:hidden">
                  <Menu className="h-5 w-5"/>
                  <span className="sr-only">Open menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="sm:hidden w-64 p-0 pt-10 flex flex-col"> {/* Added flex flex-col */}
                <div className="p-6 border-b mb-2">
                  <Link href="/" passHref onClick={() => setIsMobileMenuOpen(false)}>
                    <h1 className="text-2xl font-bold font-headline text-primary cursor-pointer">Silzey POS</h1>
                  </Link>
                   <p className="text-xs text-muted-foreground">Admin Dashboard</p>
                </div>
                <nav className="flex-1 p-4 space-y-2 overflow-y-auto"> {/* Added overflow-y-auto */}
                  {commonNavLinks}
                </nav>
                 <div className="p-4 mt-auto border-t">
                   <Button variant="outline" className="w-full justify-start" onClick={() => { signOut(); setIsMobileMenuOpen(false);}}>
                    <LogOutIcon className="mr-3 h-5 w-5" /> Sign Out
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
            <h1 className="text-xl font-semibold font-headline text-foreground truncate"> {/* Added truncate */}
              {headerTitle}
            </h1>
          </div>
           <div></div> {/* This div helps balance the header if needed */}
        </header>
        <main className="flex-1 p-4 sm:p-6 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
