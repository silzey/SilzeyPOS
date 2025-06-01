
"use client";

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import type { Product, CartItem, Category, CustomerInfo, Order, UserProfile } from '@/types/pos';
import { CATEGORIES, TAGS, generateProducts } from '@/lib/data';
import { getUpsellSuggestions, type UpsellSuggestionsOutput } from '@/ai/flows/upsell-suggestions';

import SplashScreen from '@/components/pos/SplashScreen';
import ThankYouCard from '@/components/pos/ThankYouCard';
import Header from '@/components/pos/Header';
import CategoryNavigation from '@/components/pos/CategoryNavigation';
import FilterControls from '@/components/pos/FilterControls';
import ProductGrid from '@/components/pos/ProductGrid';
import ProductDetailModal from '@/components/pos/ProductDetailModal';
import CartSheet from '@/components/pos/CartSheet';
import CheckoutDialog from '@/components/pos/CheckoutDialog';
import { useToast } from "@/hooks/use-toast";
import { useAuth } from '@/contexts/AuthContext'; // Import useAuth

const POS_PENDING_ORDERS_STORAGE_KEY = 'posPendingOrdersSilzey';

export default function PosPage() {
  const [showSplash, setShowSplash] = useState(true);
  const [activeCategory, setActiveCategory] = useState<Category>(CATEGORIES[0]);
  const [sortOption, setSortOption] = useState("A-Z");
  const [selectedTag, setSelectedTag] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [viewCart, setViewCart] = useState(false);
  const [viewCheckout, setViewCheckout] = useState(false);
  const [showThankYouCard, setShowThankYouCard] = useState(false);
  const [thankYouMessage, setThankYouMessage] = useState("");
  const [checkoutMessage, setCheckoutMessage] = useState("");
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo>({
    firstName: "", lastName: "", dob: "", phoneNumber: ""
  });
  const [rewardsPoints, setRewardsPoints] = useState(0);
  const [upsellData, setUpsellData] = useState<UpsellSuggestionsOutput | null>(null);
  const [isLoadingUpsell, setIsLoadingUpsell] = useState(false);

  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    const timer = setTimeout(() => setShowSplash(false), 3000); 
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (user) {
      setCustomerInfo(prev => ({
        ...prev,
        firstName: user.firstName || "",
        lastName: user.lastName || "",
      }));
      setRewardsPoints(user.rewardsPoints || 0);
    } else {
      setCustomerInfo({ firstName: "", lastName: "", dob: "", phoneNumber: "" });
      setRewardsPoints(0);
    }
  }, [user]);

  const allProductsForCategory = useMemo(() => generateProducts(activeCategory), [activeCategory]);

  const filteredAndSortedProducts = useMemo(() => {
    let products = [...allProductsForCategory];
    if (selectedTag) {
      products = products.filter((p) => p.tags === selectedTag);
    }
    if (searchTerm.trim() !== "") {
      const term = searchTerm.toLowerCase();
      products = products.filter((p) => p.name.toLowerCase().includes(term));
    }

    products.sort((a, b) => {
      if (sortOption === "A-Z") return a.name.localeCompare(b.name);
      if (sortOption === "PriceLowHigh") return parseFloat(a.price) - parseFloat(b.price);
      if (sortOption === "PriceHighLow") return parseFloat(b.price) - parseFloat(a.price);
      if (sortOption === "Rating") return parseFloat(b.rating) - parseFloat(a.rating);
      return 0;
    });
    return products;
  }, [allProductsForCategory, selectedTag, searchTerm, sortOption]);

  const handleSelectCategory = useCallback((category: Category) => {
    setActiveCategory(category);
    setSelectedTag("");
    setSearchTerm("");
  }, []);

  const addToCart = useCallback((product: Product) => {
    setCart((prev) => {
      const found = prev.find((item) => item.id === product.id);
      if (found) {
        return prev.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    toast({ title: `${product.name} added to cart`, description: "Quantity updated.", duration: 3000 });
  }, [toast]);

  const updateQuantity = useCallback((productId: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) =>
          item.id === productId ? { ...item, quantity: Math.max(0, item.quantity + delta) } : item
        )
        .filter((item) => item.quantity > 0) 
    );
  }, []);

  const removeFromCart = useCallback((productId: string) => {
    setCart((prev) => prev.filter((item) => item.id !== productId));
    toast({ title: "Item removed", description: "Product removed from cart.", variant: "destructive", duration: 3000 });
  }, [toast]);

  const totalPrice = useMemo(() =>
    cart.reduce((acc, item) => acc + parseFloat(item.price) * item.quantity, 0),
  [cart]);

  const cartItemCount = useMemo(() => cart.reduce((acc, item) => acc + item.quantity, 0), [cart]);

  const handleOpenCheckout = async () => {
    if (cart.length === 0) {
      toast({ title: "Empty Cart", description: "Please add items before checking out.", variant: "destructive" });
      return;
    }
    if (!user) {
        toast({ title: "Please Sign In", description: "You need to be signed in to place an order.", variant: "destructive" });
        return;
    }
    setCheckoutMessage("");
    setViewCart(false);
    setViewCheckout(true);

    setIsLoadingUpsell(true);
    setUpsellData(null);
    try {
      const cartItemsForAI = cart.map(item => ({ name: item.name, category: item.category }));
      const suggestions = await getUpsellSuggestions({ cartItems: cartItemsForAI });
      setUpsellData(suggestions);
    } catch (error) {
      console.error("Error fetching upsell suggestions:", error);
      toast({ title: "AI Error", description: "Could not fetch upsell suggestions.", variant: "destructive" });
    } finally {
      setIsLoadingUpsell(false);
    }
  };

  const handleCustomerInfoChange = useCallback((field: keyof CustomerInfo, value: string) => {
    setCustomerInfo(prev => ({ ...prev, [field]: value }));
  }, []);
  
  const finalizeSale = useCallback(() => {
    if (!user) {
      setCheckoutMessage("Error: No user signed in. Please sign in to complete the order.");
      toast({ title: "Not Signed In", description: "Please sign in to complete your order.", variant: "destructive" });
      return;
    }
    if (!customerInfo.firstName || !customerInfo.lastName || !customerInfo.dob || !customerInfo.phoneNumber) {
      setCheckoutMessage("Please fill in all customer information fields.");
      return;
    }

    const newOrder: Order = {
      id: `POS-ORD-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      customerName: `${customerInfo.firstName} ${customerInfo.lastName}`,
      customerId: user.id,
      orderDate: new Date().toISOString(),
      status: "Pending Checkout",
      totalAmount: parseFloat(totalPrice.toFixed(2)),
      itemCount: cartItemCount,
      items: cart,
      submittedByPOS: true,
    };

    try {
      const existingPendingOrdersRaw = localStorage.getItem(POS_PENDING_ORDERS_STORAGE_KEY);
      const existingPendingOrders: Order[] = existingPendingOrdersRaw ? JSON.parse(existingPendingOrdersRaw) : [];
      existingPendingOrders.push(newOrder);
      localStorage.setItem(POS_PENDING_ORDERS_STORAGE_KEY, JSON.stringify(existingPendingOrders));
      
      setCheckoutMessage(""); 
      setThankYouMessage(`Order ${newOrder.id} submitted! A budtender will process it shortly.`);
      setShowThankYouCard(true);
      setViewCheckout(false); 
      
      setCart([]);
      setCustomerInfo({ firstName: user.firstName || "", lastName: user.lastName || "", dob: "", phoneNumber: "" });
      
      toast({ title: "Order Submitted!", description: `Your order ${newOrder.id} is pending processing.`, duration: 5000 });

      setTimeout(() => {
        setShowThankYouCard(false);
      }, 5000);

    } catch (error) {
      console.error("Error saving pending order to localStorage:", error);
      setCheckoutMessage("An error occurred while submitting your order. Please try again.");
      toast({ title: "Submission Error", description: "Could not submit order to local queue.", variant: "destructive" });
    }

  }, [user, customerInfo, cart, totalPrice, cartItemCount, toast]);

  if (showSplash) return <SplashScreen isVisible={showSplash} />;
  if (showThankYouCard) return <ThankYouCard isVisible={showThankYouCard} message={thankYouMessage} />;

  return (
    <div className="min-h-screen bg-background text-foreground font-body">
      <Header cartItemCount={cartItemCount} onOpenCart={() => setViewCart(true)} />
      <main className="pb-12 pt-24">
        <CategoryNavigation
          categories={CATEGORIES}
          activeCategory={activeCategory}
          onSelectCategory={handleSelectCategory}
        />
        <FilterControls
          sortOption={sortOption}
          onSortChange={setSortOption}
          tags={TAGS}
          selectedTag={selectedTag}
          onTagChange={setSelectedTag}
          searchTerm={searchTerm}
          onSearchChange={(e) => setSearchTerm(e.target.value)}
        />
        <ProductGrid
          products={filteredAndSortedProducts}
          onProductSelect={setSelectedProduct}
        />
      </main>

      {selectedProduct && (
        <ProductDetailModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onAddToCart={addToCart}
        />
      )}

      <CartSheet
        isOpen={viewCart}
        onClose={() => setViewCart(false)}
        cart={cart}
        onUpdateQuantity={updateQuantity}
        onRemoveItem={removeFromCart}
        onCheckout={handleOpenCheckout}
        totalPrice={totalPrice.toFixed(2)}
      />
      
      {viewCheckout && (
        <CheckoutDialog
          isOpen={viewCheckout}
          onClose={() => setViewCheckout(false)}
          cart={cart}
          totalPrice={totalPrice.toFixed(2)}
          rewardsPoints={rewardsPoints}
          onFinalizeSale={finalizeSale}
          customerInfo={customerInfo}
          onCustomerInfoChange={handleCustomerInfoChange}
          message={checkoutMessage}
          upsellData={upsellData}
          isLoadingUpsell={isLoadingUpsell}
        />
      )}
    </div>
  );
}
