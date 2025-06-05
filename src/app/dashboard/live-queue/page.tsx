
"use client";

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import type { Order } from '@/types/pos';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, CheckCircle, ListChecks, RefreshCw, ShoppingCart, Link as LinkIcon } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import Image from 'next/image';

const POS_PENDING_ORDERS_STORAGE_KEY = 'posPendingOrdersSilzey';
const DASHBOARD_COMPLETED_ORDERS_STORAGE_KEY = 'dashboardCompletedOrdersSilzey';

export default function LivePosQueuePage() {
  const [pendingOrders, setPendingOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [processingOrderId, setProcessingOrderId] = useState<string | null>(null);
  const { user } = useAuth(); // To ensure budtender is logged in
  const router = useRouter();
  const { toast } = useToast();

  const loadPendingOrders = useCallback(() => {
    setIsLoading(true);
    try {
      const pendingOrdersRaw = localStorage.getItem(POS_PENDING_ORDERS_STORAGE_KEY);
      const loadedOrders = pendingOrdersRaw ? JSON.parse(pendingOrdersRaw) : [];
      // Sort by newest first
      setPendingOrders(loadedOrders.sort((a: Order, b: Order) => new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime()));
    } catch (e) {
      console.error("Error loading pending orders from localStorage", e);
      toast({ title: "Load Error", description: "Could not load pending orders.", variant: "destructive" });
      setPendingOrders([]);
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    if (!user) {
      router.push('/auth/signin'); // Redirect if not logged in
      return;
    }
    loadPendingOrders();
  }, [user, router, loadPendingOrders]);

  const handleProcessOrder = async (orderToProcess: Order) => {
    setProcessingOrderId(orderToProcess.id);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    try {
      // Update order status
      const processedOrder: Order = {
        ...orderToProcess,
        status: 'In-Store', // Or 'Online' if applicable, defaulting to In-Store
        processedAt: new Date().toISOString(),
      };

      // Remove from pending orders in localStorage
      const currentPendingOrdersRaw = localStorage.getItem(POS_PENDING_ORDERS_STORAGE_KEY);
      let currentPendingOrders: Order[] = currentPendingOrdersRaw ? JSON.parse(currentPendingOrdersRaw) : [];
      currentPendingOrders = currentPendingOrders.filter(order => order.id !== orderToProcess.id);
      localStorage.setItem(POS_PENDING_ORDERS_STORAGE_KEY, JSON.stringify(currentPendingOrders));

      // Add to completed/dashboard orders in localStorage
      const completedOrdersRaw = localStorage.getItem(DASHBOARD_COMPLETED_ORDERS_STORAGE_KEY);
      let completedOrders: Order[] = completedOrdersRaw ? JSON.parse(completedOrdersRaw) : [];
      completedOrders.push(processedOrder);
      localStorage.setItem(DASHBOARD_COMPLETED_ORDERS_STORAGE_KEY, JSON.stringify(completedOrders));
      
      // TODO: In a real app, update customer's order history here via API

      toast({
        title: "Order Processed!",
        description: `Order ${processedOrder.id} marked as 'In-Store'.`,
      });
      loadPendingOrders(); // Refresh the list

    } catch (error) {
      console.error("Error processing order:", error);
      toast({ title: "Processing Error", description: `Failed to process order ${orderToProcess.id}.`, variant: "destructive" });
    } finally {
      setProcessingOrderId(null);
    }
  };

  const handleMockPlaidConnect = () => {
    toast({
      title: "Plaid Integration (Mock)",
      description: "This would typically launch Plaid Link to securely connect a bank account.",
      duration: 5000,
    });
  };


  if (isLoading && pendingOrders.length === 0) { // Show full loader only on initial empty load
    return <div className="flex justify-center items-center h-full"><RefreshCw className="h-8 w-8 animate-spin text-primary" /> <p className="ml-2">Loading pending orders...</p></div>;
  }

  return (
    <div className="space-y-8">
      <Card className="shadow-xl">
        <CardHeader>
          <CardTitle className="font-headline text-primary flex items-center">
            <ListChecks className="mr-2 h-6 w-6" /> Live POS Order Queue
          </CardTitle>
          <CardDescription>Orders submitted from the Point of Sale terminal awaiting processing.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex justify-end">
            <Button onClick={loadPendingOrders} variant="outline" size="sm" disabled={isLoading}>
              <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh Queue
            </Button>
          </div>
          {pendingOrders.length === 0 && !isLoading ? (
            <div className="text-center py-10">
              <ShoppingCart className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-xl font-semibold text-muted-foreground">No pending orders.</p>
              <p className="text-sm text-muted-foreground">New orders from the POS will appear here.</p>
            </div>
          ) : (
            <ScrollArea className="h-[calc(100vh-340px)]"> {/* Adjust height as needed */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-1">
                {pendingOrders.map(order => (
                  <Card key={order.id} className="flex flex-col shadow-lg hover:shadow-xl transition-shadow">
                    <CardHeader className="pb-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-lg font-semibold text-primary truncate" title={order.id}>
                            Order ID: {order.id.substring(order.id.length - 7)}
                          </CardTitle>
                          <CardDescription className="text-xs">
                            Customer: {order.customerName} {order.customerId && `(${order.customerId.substring(order.customerId.length - 6)})`}
                          </CardDescription>
                        </div>
                        <Badge variant="destructive" className="bg-orange-500 text-white animate-pulse whitespace-nowrap">
                          Pending Checkout
                        </Badge>
                      </div>
                       <p className="text-xs text-muted-foreground mt-1">
                        Submitted: {new Date(order.orderDate).toLocaleString()}
                      </p>
                    </CardHeader>
                    <CardContent className="flex-grow space-y-2 text-sm">
                      <p className="font-medium">Items ({order.itemCount}):</p>
                      <ScrollArea className="h-32 pr-2">
                        <ul className="space-y-1 text-xs">
                          {order.items.map(item => (
                            <li key={item.id} className="flex items-center gap-2">
                               <Image src={item.image} alt={item.name} width={24} height={24} className="rounded-sm" data-ai-hint={item.dataAiHint || item.category.toLowerCase()} />
                               <span className="flex-grow truncate" title={item.name}>{item.name} (x{item.quantity})</span>
                               <span>${(parseFloat(item.price) * item.quantity).toFixed(2)}</span>
                            </li>
                          ))}
                        </ul>
                      </ScrollArea>
                       <div className="font-bold text-md text-right pt-2 border-t mt-2">
                        Total: ${order.totalAmount.toFixed(2)}
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button
                        className="w-full bg-green-600 hover:bg-green-700 text-white"
                        onClick={() => handleProcessOrder(order)}
                        disabled={processingOrderId === order.id}
                      >
                        {processingOrderId === order.id ? (
                          <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                          <CheckCircle className="mr-2 h-4 w-4" />
                        )}
                        Process Checkout
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          )}
        </CardContent>
      </Card>

      <Card className="shadow-xl">
        <CardHeader>
          <CardTitle className="font-headline text-primary flex items-center">
            <LinkIcon className="mr-2 h-6 w-6" /> Plaid Integration (Mock)
          </CardTitle>
          <CardDescription>
            This section is a placeholder to demonstrate where Plaid integration for bank account linking and payments could be initiated.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center space-y-4 p-8">
          <p className="text-sm text-muted-foreground text-center">
            For ACH payments or verifying customer bank accounts, you would integrate Plaid Link here.
          </p>
          <Button 
            onClick={handleMockPlaidConnect} 
            variant="default" 
            className="bg-[#00A0FF] hover:bg-[#008fdd] text-white px-6 py-3 text-base"
          >
            <LinkIcon className="mr-2 h-5 w-5" /> Connect a bank account
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
