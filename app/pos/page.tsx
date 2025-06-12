"use client";

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import type { Product, CartItem, Category, CustomerInfo, Order, UserProfile, InventoryItem, ReelConfigItem, ReelDisplayProduct } from '@/types/pos';
import { CATEGORIES, TAGS } from '@/lib/data';
import { generateMockInventory } from '@/lib/mockInventory';
import { getUpsellSuggestions, type UpsellSuggestionsOutput } from '@/ai/flows/upsell-suggestions';

import SplashScreen from '@/components/pos/SplashScreen';
import ThankYouCard from '@/components/pos/ThankYouCard';
import Header from '@/components/pos/Header';
import CategoryNavigation from '@/components/pos/CategoryNavigation';
import FilterControls from '@/components/pos/FilterControls';
import ProductStoryReel from '@/components/pos/ProductStoryReel';
import ProductGrid from '@/components/pos/ProductGrid';
import ProductDetailModal from '@/components/pos/ProductDetailModal';
import CartSheet from '@/components/pos/CartSheet';
import CheckoutDialog from '@/components/pos/CheckoutDialog';
import { useToast } from "@/hooks/use-toast";
import { useAuth } from '@/contexts/AuthContext';

const POS_PENDING_ORDERS_STORAGE_KEY = 'posPendingOrdersSilzey';
const REEL_CONFIG_STORAGE_KEY = 'silzeyPosReelConfigV2';
const WEED_PHOTO_CATEGORIES_FOR_REEL_FALLBACK: Category[] = ["Flower", "Concentrates"];

// Helper to map InventoryItem to Product for POS display
const mapInventoryItemToProduct = (item: InventoryItem): Product => ({
  id: item.id,
  name: item.name,
  image: item.imageUrl,
  price: item.salePrice.toFixed(2),
  tags: item.tags,
  rating: item.rating,
  category: item.category,
  dataAiHint: item.dataAiHint,
});


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
  const [masterInventory, setMasterInventory] = useState<InventoryItem[]>([]);
  const [reelDisplayProducts, setReelDisplayProducts] = useState<ReelDisplayProduct[]>([]);

  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    const timer = setTimeout(() => setShowSplash(false), 3000);
    const inventory = generateMockInventory();
    setMasterInventory(inventory);
    return () => clearTimeout(timer);
  }, []);

  // Effect to load and prepare story reel products
  useEffect(() => {
    if (masterInventory.length > 0) {
      const storedConfigRaw = localStorage.getItem(REEL_CONFIG_STORAGE_KEY);
      let productsForReel: ReelDisplayProduct[] = [];

      if (storedConfigRaw) {
        try {
          const reelConfig: ReelConfigItem[] = JSON.parse(storedConfigRaw);
          productsForReel = reelConfig.map(config => {
            const inventoryItem = masterInventory.find(item => item.id === config.inventoryItemId);
            if (inventoryItem) {
              return {
                ...mapInventoryItemToProduct(inventoryItem),
                badgeType: config.badgeType,
                pulsatingBorder: config.pulsatingBorder,
              };
            }
            return null;
          }).filter(Boolean) as ReelDisplayProduct[];
        } catch (e) {
          console.error("Error parsing reel config for POS display:", e);
          // Fallback if parsing fails
        }
      }
      
      // Fallback logic if no config or parsing failed and productsForReel is empty
      if (productsForReel.length === 0) {
        const fallbackItems = masterInventory
            .filter(item => item.stock > 0 && WEED_PHOTO_CATEGORIES_FOR_REEL_FALLBACK.includes(item.category))
            .map(mapInventoryItemToProduct)
            .map((product, index) => ({
              ...product,
              badgeType: index % 5 === 0 ? 'New' : (index % 5 === 1 ? 'Featured' : 'None'),
              pulsatingBorder: index % 7 === 0,
            }));
        const shuffledFallback = [...fallbackItems].sort(() => 0.5 - Math.random());
        productsForReel = shuffledFallback.slice(0, 25);
      }
      
      setReelDisplayProducts(productsForReel.slice(0, 25)); // Ensure max 25 items
    }
  }, [masterInventory]);


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

  const productsForCategory = useMemo(() => {
    return masterInventory
      .filter(item => item.category === activeCategory && item.stock > 0)
      .map(mapInventoryItemToProduct);
  }, [masterInventory, activeCategory]);

  const filteredAndSortedProducts = useMemo(() => {
    let products = [...productsForCategory];
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
  }, [productsForCategory, selectedTag, searchTerm, sortOption]);

  const handleSelectCategory = useCallback((category: Category) => {
    setActiveCategory(category);
    setSelectedTag("");
    setSearchTerm("");
  }, []);

  const addToCart = useCallback((product: Product) => {
    const inventoryItem = masterInventory.find(item => item.id === product.id);
    if (!inventoryItem) {
        toast({ title: "Error", description: "Product not found in inventory.", variant: "destructive" });
        return;
    }

    const existingCartItem = cart.find(item => item.id === product.id);
    const currentQuantityInCart = existingCartItem ? existingCartItem.quantity : 0;

    if (inventoryItem.stock <= currentQuantityInCart) {
        toast({ title: "Out of Stock", description: `Cannot add more ${product.name}. Max stock reached.`, variant: "destructive", duration: 3000 });
        return;
    }

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
  }, [toast, masterInventory, cart]);

  const updateQuantity = useCallback((productId: string, delta: number) => {
    const inventoryItem = masterInventory.find(item => item.id === productId);
    if (!inventoryItem) return;

    setCart((prev) => {
        const updatedCart = prev.map((item) => {
            if (item.id === productId) {
                const newQuantity = Math.max(0, item.quantity + delta);
                if (newQuantity > inventoryItem.stock) {
                    toast({ title: "Stock Limit", description: `Only ${inventoryItem.stock} units of ${item.name} available.`, variant: "destructive" });
                    return { ...item, quantity: inventoryItem.stock };
                }
                return { ...item, quantity: newQuantity };
            }
            return item;
        });
        return updatedCart.filter((item) => item.quantity > 0);
    });
  }, [masterInventory, toast]);

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

    const currentInventoryState = generateMockInventory(); // Get fresh state for this transaction
    const updatedInventoryTransaction = [...currentInventoryState];
    let possibleToFinalize = true;

    for (const cartItem of cart) {
        const inventoryIndex = updatedInventoryTransaction.findIndex(invItem => invItem.id === cartItem.id);
        if (inventoryIndex !== -1) {
            if (updatedInventoryTransaction[inventoryIndex].stock >= cartItem.quantity) {
                updatedInventoryTransaction[inventoryIndex].stock -= cartItem.quantity;
            } else {
                toast({ title: "Stock Issue", description: `Not enough stock for ${cartItem.name}. Only ${updatedInventoryTransaction[inventoryIndex].stock} available.`, variant: "destructive" });
                possibleToFinalize = false;
                break;
            }
        } else {
             toast({ title: "Error", description: `Item ${cartItem.name} not found in inventory for stock update.`, variant: "destructive" });
             possibleToFinalize = false;
             break;
        }
    }

    if (!possibleToFinalize) {
        setCheckoutMessage("Could not finalize sale due to stock issues. Please review cart or inventory.");
        // Do not update masterInventory state here, as the transaction failed.
        // The generateMockInventory() inside this function was only for the transaction's scope.
        return;
    }

    // If successful, save the updated inventory to localStorage AND update the masterInventory state
    if (typeof window !== 'undefined') {
        localStorage.setItem('silzeyAppInventory', JSON.stringify(updatedInventoryTransaction));
    }
    setMasterInventory(updatedInventoryTransaction); // Update the main page's inventory state

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
       // Revert inventory in localStorage if submission to pending orders fails
       localStorage.setItem('silzeyAppInventory', JSON.stringify(currentInventoryState));
       setMasterInventory(currentInventoryState);
    }

  }, [user, customerInfo, cart, totalPrice, cartItemCount, toast, masterInventory]); // Added masterInventory to dependency array

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
        <ProductStoryReel 
            products={reelDisplayProducts} 
            onProductSelect={setSelectedProduct} 
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
