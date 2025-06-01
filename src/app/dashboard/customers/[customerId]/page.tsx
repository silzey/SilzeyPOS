
"use client";

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { getCustomerById } from '@/lib/mockCustomers';
import type { Customer, Order, CartItem } from '@/types/pos';
import { ArrowLeft, Mail, CalendarDays, Gift, ShoppingCart, Star, Edit, Info } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

const OrderItemCard: React.FC<{ item: CartItem }> = ({ item }) => (
  <div className="flex items-center gap-3 p-2 border border-border rounded-md bg-card hover:bg-muted/50 transition-colors">
    <Image
      src={item.image}
      alt={item.name}
      width={60}
      height={60}
      className="rounded-md object-cover aspect-square"
      data-ai-hint={item.dataAiHint || item.category.toLowerCase()}
    />
    <div className="flex-grow text-xs">
      <p className="font-semibold text-foreground truncate">{item.name}</p>
      <p className="text-muted-foreground">Qty: {item.quantity}</p>
      <p className="text-muted-foreground">Price: ${parseFloat(item.price).toFixed(2)}</p>
    </div>
    <p className="font-semibold text-primary text-sm">${(parseFloat(item.price) * item.quantity).toFixed(2)}</p>
  </div>
);

const OrderCard: React.FC<{ order: Order; title: string }> = ({ order, title }) => (
  <Card className="shadow-md">
    <CardHeader className="pb-3">
      <CardTitle className="text-lg font-headline text-primary flex items-center">
        <ShoppingCart className="mr-2 h-5 w-5" /> {title} (ID: {order.id})
      </CardTitle>
      <div className="text-xs text-muted-foreground space-x-3">
        <span>Date: {new Date(order.orderDate).toLocaleDateString()}</span>
        <Badge variant={order.status === "In-Store" ? "default" : "secondary"} className="capitalize">{order.status}</Badge>
      </div>
    </CardHeader>
    <CardContent>
      <p className="text-sm font-semibold mb-2">Items ({order.itemCount}):</p>
      <ScrollArea className="h-48 pr-3"> {/* Max height for item list */}
        <div className="space-y-2">
          {order.items.map(item => <OrderItemCard key={item.id} item={item} />)}
        </div>
      </ScrollArea>
      <Separator className="my-3" />
      <div className="flex justify-end items-center">
        <span className="text-md font-semibold mr-2">Total:</span>
        <span className="text-lg font-bold text-primary">${order.totalAmount.toFixed(2)}</span>
      </div>
    </CardContent>
  </Card>
);


export default function CustomerProfilePage() {
  const params = useParams();
  const router = useRouter();
  const customerId = params.customerId as string;
  const [customer, setCustomer] = useState<Customer | null | undefined>(undefined); // undefined for loading state

  useEffect(() => {
    if (customerId) {
      const foundCustomer = getCustomerById(customerId);
      setCustomer(foundCustomer);
    }
  }, [customerId]);

  if (customer === undefined) { // Loading state
    return (
        <div className="space-y-6">
            <Skeleton className="h-10 w-48" /> {/* Back button and Edit button */}
            <Card className="shadow-lg">
                <CardHeader className="flex flex-row items-center gap-6 p-6">
                    <Skeleton className="h-24 w-24 rounded-full" />
                    <div className="space-y-2">
                        <Skeleton className="h-8 w-56" />
                        <Skeleton className="h-5 w-64" />
                        <Skeleton className="h-4 w-40" />
                    </div>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                    <Skeleton className="h-5 w-32" />
                    <Skeleton className="h-12 w-full" />
                    <div className="grid md:grid-cols-2 gap-6 mt-4">
                         <Skeleton className="h-72 w-full" /> {/* Order History Card */}
                         <Skeleton className="h-72 w-full" /> {/* Current Order Card */}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
  }

  if (!customer) {
    return (
      <div className="text-center py-10">
        <Info className="mx-auto h-12 w-12 text-destructive mb-4" />
        <h1 className="text-2xl font-bold text-destructive">Customer Not Found</h1>
        <p className="text-muted-foreground mb-6">The customer profile with ID "{customerId}" could not be found.</p>
        <Button onClick={() => router.push('/dashboard/customers')} variant="outline">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Customer List
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <Button variant="outline" onClick={() => router.push('/dashboard/customers')}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Customer List
        </Button>
         <Button variant="outline" disabled> {/* Future feature */}
          <Edit className="mr-2 h-4 w-4" /> Edit Profile
        </Button>
      </div>

      <Card className="shadow-xl overflow-hidden">
        <CardHeader className="flex flex-col md:flex-row items-center gap-6 p-6 bg-muted/20 border-b">
          <Avatar className="h-24 w-24 md:h-32 md:w-32 border-4 border-primary">
            <AvatarImage src={customer.avatarUrl} alt={`${customer.firstName} ${customer.lastName}`} data-ai-hint={customer.dataAiHint || 'person'} />
            <AvatarFallback className="text-3xl">{customer.firstName.charAt(0)}{customer.lastName.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="text-center md:text-left">
            <CardTitle className="text-2xl md:text-3xl font-bold font-headline text-primary">
              {customer.firstName} {customer.lastName}
            </CardTitle>
            <div className="text-muted-foreground mt-1 space-y-0.5 text-sm">
                <p className="flex items-center justify-center md:justify-start"><Mail className="mr-2 h-4 w-4"/>{customer.email}</p>
                <p className="flex items-center justify-center md:justify-start"><CalendarDays className="mr-2 h-4 w-4"/>Member Since: {customer.memberSince}</p>
            </div>
            <div className="mt-2 flex items-center justify-center md:justify-start gap-2 bg-accent/20 text-accent-foreground p-2 rounded-md max-w-xs mx-auto md:mx-0">
              <Gift className="h-5 w-5 text-accent" />
              <span className="font-semibold">Rewards Points:</span>
              <span className="font-bold text-lg text-accent">{customer.rewardsPoints ?? 0}</span>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          {customer.bio && (
            <div className="mb-6">
              <h3 className="text-md font-semibold font-headline mb-1">Bio</h3>
              <p className="text-sm text-foreground/80 bg-slate-50 p-3 rounded-md border border-slate-200">{customer.bio}</p>
            </div>
          )}

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-xl font-semibold font-headline mb-3 text-foreground">Order History</h3>
              {customer.orderHistory && customer.orderHistory.length > 0 ? (
                 <ScrollArea className="h-[500px] pr-3 space-y-4"> {/* Max height for order history list */}
                    {customer.orderHistory.map(order => (
                        <OrderCard key={order.id} order={order} title="Past Order" />
                    ))}
                </ScrollArea>
              ) : (
                <p className="text-muted-foreground text-sm">No past orders found.</p>
              )}
            </div>
            <div>
              <h3 className="text-xl font-semibold font-headline mb-3 text-foreground">Current Order</h3>
              {customer.currentOrder ? (
                <OrderCard order={customer.currentOrder} title="Current Order" />
              ) : (
                <p className="text-muted-foreground text-sm">No current order.</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
