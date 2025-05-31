
"use client";

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import type { Product, CartItem, Category, CustomerInfo } from '@/types/pos';
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


const INITIAL_VISIBLE_COUNT = 12;

export default function PosPage() {
  const [showSplash, setShowSplash] = useState(true);
  const [activeCategory, setActiveCategory] = useState<Category>(CATEGORIES[0]);
  const [sortOption, setSortOption] = useState("A-Z");
  const [selectedTag, setSelectedTag] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE_COUNT);
  const [viewCart, setViewCart] = useState(false);
  const [viewCheckout, setViewCheckout] = useState(false);
  const [showThankYouCard, setShowThankYouCard] = useState(false);
  const [checkoutMessage, setCheckoutMessage] = useState("");
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo>({
    firstName: "", lastName: "", dob: "", phoneNumber: ""
  });
  const [rewardsPoints, setRewardsPoints] = useState(0);
  const [upsellData, setUpsellData] = useState<UpsellSuggestionsOutput | null>(null);
  const [isLoadingUpsell, setIsLoadingUpsell] = useState(false);

  const { toast } = useToast();

  useEffect(() => {
    const timer = setTimeout(() => setShowSplash(false), 3000); // Splash for 3s
    return () => clearTimeout(timer);
  }, []);

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
    setVisibleCount(INITIAL_VISIBLE_COUNT);
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
        .filter((item) => item.quantity > 0) // Remove if quantity is 0
    );
  }, []);

  const removeFromCart = useCallback((productId: string) => {
    setCart((prev) => prev.filter((item) => item.id !== productId));
    toast({ title: "Item removed", description: "Product removed from cart.", variant: "destructive", duration: 3000 });
  }, [toast]);

  const handleLoadMore = useCallback(() => {
    setVisibleCount((prev) => prev + INITIAL_VISIBLE_COUNT);
  }, []);

  const totalPrice = useMemo(() =>
    cart.reduce((acc, item) => acc + parseFloat(item.price) * item.quantity, 0).toFixed(2),
  [cart]);

  const cartItemCount = useMemo(() => cart.reduce((acc, item) => acc + item.quantity, 0), [cart]);

  const handleOpenCheckout = async () => {
    if (cart.length === 0) {
      toast({ title: "Empty Cart", description: "Please add items before checking out.", variant: "destructive" });
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
    if (!customerInfo.firstName || !customerInfo.lastName || !customerInfo.dob || !customerInfo.phoneNumber) {
      setCheckoutMessage("Please fill in all customer information fields.");
      return;
    }

    const pointsEarned = Math.floor(parseFloat(totalPrice));
    const newTotalRewards = rewardsPoints + pointsEarned;
    setRewardsPoints(newTotalRewards);

    setCheckoutMessage(`Sale complete! Earned ${pointsEarned} points. Total: ${newTotalRewards}`);
    
    setShowThankYouCard(true);
    setViewCheckout(false); // Close checkout dialog
    
    // Reset state for next transaction
    setCart([]);
    setCustomerInfo({ firstName: "", lastName: "", dob: "", phoneNumber: "" });
    // rewardsPoints will be reset when thank you card timer finishes (page reload behavior)
    // If no reload, reset here: setRewardsPoints(0) for the next customer after current rewards shown.
    // For this version, it will reset on reload as per original request.

    setTimeout(() => {
       // Reset rewards points for the next customer IF we weren't reloading
       // setRewardsPoints(0); // This line is for a non-reloading scenario
      window.location.reload(); 
    }, 5000); // Thank you card for 5 seconds, then reload
  }, [customerInfo, totalPrice, rewardsPoints, toast]);


  if (showSplash) return <SplashScreen isVisible={showSplash} />;
  if (showThankYouCard) return <ThankYouCard isVisible={showThankYouCard} />;

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
          products={filteredAndSortedProducts.slice(0, visibleCount)}
          onProductSelect={setSelectedProduct}
          onLoadMore={handleLoadMore}
          canLoadMore={visibleCount < filteredAndSortedProducts.length}
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
        totalPrice={totalPrice}
      />
      
      {viewCheckout && (
        <CheckoutDialog
          isOpen={viewCheckout}
          onClose={() => setViewCheckout(false)}
          cart={cart}
          totalPrice={totalPrice}
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

