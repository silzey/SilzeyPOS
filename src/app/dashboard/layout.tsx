
"use client";

import type { ReactNode } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import FullPageLoader from '@/components/ui/loader'; // Import the new loader
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Home, ShoppingBag, Users, BarChart3, LogOut as LogOutIcon, Menu, Terminal, Package, Ticket, Settings as SettingsIcon, Store, CreditCard, UserCog } from 'lucide-react'; // Added SettingsIcon, Store, CreditCard, UserCog
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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
    return <FullPageLoader />; // Use the new FullPageLoader
  }

  let headerTitle = `Welcome, ${user.firstName}!`;
  if (pathname === '/dashboard') {
    headerTitle = 'Overview';
  } else if (pathname === '/dashboard/orders') {
    headerTitle = 'Orders Management';
  } else if (pathname.startsWith('/dashboard/customers')) {
    headerTitle = 'Customer Management';
    if (pathname.split('/').length > 3 && pathname.split('/')[3] !== '') headerTitle = "Customer Profile";
  } else if (pathname === '/dashboard/live-queue') { 
    headerTitle = 'Live POS Queue';
  } else if (pathname === '/dashboard/inventory') {
    headerTitle = 'Inventory Management';
  } else if (pathname === '/dashboard/analytics') { 
    headerTitle = 'Analytics';
  } else if (pathname === '/dashboard/promotions') {
    headerTitle = 'Promotions Management';
  } else if (pathname.startsWith('/dashboard/settings')) { 
    if (pathname === '/dashboard/settings/store-profile') {
        headerTitle = 'Store Profile Settings';
    } else if (pathname === '/dashboard/settings/payment-methods') {
        headerTitle = 'Payment Methods Settings';
    } else if (pathname === '/dashboard/settings/staff-management') {
        headerTitle = 'Staff Management Settings';
    } else {
        headerTitle = 'Store Settings';
    }
  }


  const settingsDropdownItems = (isMobile?: boolean) => (
    <>
      <DropdownMenuItem onClick={() => { router.push('/dashboard/settings/store-profile'); if (isMobile) setIsMobileMenuOpen(false); }}>
        <Store className="mr-2 h-4 w-4" /> Store Profile
      </DropdownMenuItem>
      <DropdownMenuItem onClick={() => { router.push('/dashboard/settings/payment-methods'); if (isMobile) setIsMobileMenuOpen(false); }}>
        <CreditCard className="mr-2 h-4 w-4" /> Payment Methods
      </DropdownMenuItem>
      <DropdownMenuItem onClick={() => { router.push('/dashboard/settings/staff-management'); if (isMobile) setIsMobileMenuOpen(false); }}>
        <UserCog className="mr-2 h-4 w-4" /> Staff Management
      </DropdownMenuItem>
    </>
  );

  const commonNavLinks = (isMobile?: boolean) => (
    <>
      <Button
        variant={pathname === '/dashboard' ? "secondary" : "ghost"}
        className="w-full justify-start text-foreground hover:bg-primary/10 hover:text-primary"
        asChild
        onClick={() => isMobile && setIsMobileMenuOpen(false)}
      >
        <Link href="/dashboard"><Home className="mr-3 h-5 w-5" /> Overview</Link>
      </Button>
      <Button
        variant={pathname === '/dashboard/live-queue' ? "secondary" : "ghost"}
        className="w-full justify-start text-foreground hover:bg-primary/10 hover:text-primary"
        asChild
        onClick={() => isMobile && setIsMobileMenuOpen(false)}
      >
        <Link href="/dashboard/live-queue"><Terminal className="mr-3 h-5 w-5" /> Live POS Queue</Link>
      </Button>
      <Button
        variant={pathname.startsWith('/dashboard/inventory') ? "secondary" : "ghost"}
        className="w-full justify-start text-foreground hover:bg-primary/10 hover:text-primary"
        asChild
        onClick={() => isMobile && setIsMobileMenuOpen(false)}
      >
        <Link href="/dashboard/inventory"><Package className="mr-3 h-5 w-5" /> Inventory</Link>
      </Button>
      <Button
        variant={pathname === '/dashboard/orders' ? "secondary" : "ghost"}
        className="w-full justify-start text-foreground hover:bg-primary/10 hover:text-primary"
        asChild
        onClick={() => isMobile && setIsMobileMenuOpen(false)}
      >
        <Link href="/dashboard/orders"><ShoppingBag className="mr-3 h-5 w-5" /> All Orders</Link>
      </Button>
      <Button
        variant={pathname.startsWith('/dashboard/customers') ? "secondary" : "ghost"}
        className="w-full justify-start text-foreground hover:bg-primary/10 hover:text-primary"
        asChild
        onClick={() => isMobile && setIsMobileMenuOpen(false)}
      >
        <Link href="/dashboard/customers"><Users className="mr-3 h-5 w-5" /> Customers</Link>
      </Button>
      <Button 
        variant={pathname === '/dashboard/promotions' ? "secondary" : "ghost"}
        className="w-full justify-start text-foreground hover:bg-primary/10 hover:text-primary" 
        onClick={() => { alert("Navigate to Promotions (mock)"); if (isMobile) setIsMobileMenuOpen(false); }}
      >
        <Ticket className="mr-3 h-5 w-5" /> Promotions
      </Button>
      <Button 
        variant={pathname === '/dashboard/analytics' ? "secondary" : "ghost"}
        className="w-full justify-start text-foreground hover:bg-primary/10 hover:text-primary" 
        onClick={() => { alert("Navigate to Analytics (mock)"); if (isMobile) setIsMobileMenuOpen(false); }}
      >
        <BarChart3 className="mr-3 h-5 w-5" /> Analytics
      </Button>
      
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant={pathname.startsWith('/dashboard/settings') ? "secondary" : "ghost"}
            className="w-full justify-start text-foreground hover:bg-primary/10 hover:text-primary"
          >
            <SettingsIcon className="mr-3 h-5 w-5" /> Settings
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56">
          <DropdownMenuLabel>Store Configuration</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {settingsDropdownItems(isMobile)}
        </DropdownMenuContent>
      </DropdownMenu>
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
          {commonNavLinks(false)}
        </nav>
        <div className="p-4 mt-auto border-t">
           <Button variant="outline" className="w-full justify-start" onClick={signOut}>
            <LogOutIcon className="mr-3 h-5 w-5" /> Sign Out
          </Button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-4 border-b bg-background px-6 shadow-sm">
          <div className="flex items-center gap-4">
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="sm:hidden">
                  <Menu className="h-5 w-5"/>
                  <span className="sr-only">Open menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="sm:hidden w-64 p-0 pt-10 flex flex-col">
                <div className="p-6 border-b mb-2">
                  <Link href="/" passHref onClick={() => setIsMobileMenuOpen(false)}>
                    <h1 className="text-2xl font-bold font-headline text-primary cursor-pointer">Silzey POS</h1>
                  </Link>
                   <p className="text-xs text-muted-foreground">Admin Dashboard</p>
                </div>
                <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                  {commonNavLinks(true)}
                </nav>
                 <div className="p-4 mt-auto border-t">
                   <Button variant="outline" className="w-full justify-start" onClick={() => { signOut(); setIsMobileMenuOpen(false);}}>
                    <LogOutIcon className="mr-3 h-5 w-5" /> Sign Out
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
            <h1 className="text-xl font-semibold font-headline text-foreground truncate">
              {headerTitle}
            </h1>
          </div>
           <div></div>
        </header>
        <main className="flex-1 p-4 sm:p-6 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
