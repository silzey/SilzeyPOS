
export type Category = "Flower" | "Concentrates" | "Vapes" | "Edibles";

export interface Product {
  id: string;
  name: string;
  image: string;
  price: string;
  tags: string;
  rating: string;
  category: Category;
  dataAiHint?: string;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface CustomerInfo {
  firstName: string;
  lastName:string;
  dob: string;
  phoneNumber: string;
}

export interface UserProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  avatarUrl: string;
  dataAiHint?: string; // Added for avatars
  bio?: string;
  memberSince: string;
  rewardsPoints?: number;
}

export type OrderStatus = "In-Store" | "Online";
export type TransactionStatus = "Completed" | "Pending" | "Failed";

export interface TransactionItem { id?: string; name: string; qty: number; price: number };

export interface Order {
  id: string;
  customerName: string; // Could be customerId in a real system
  orderDate: string;
  status: OrderStatus;
  totalAmount: number;
  itemCount: number;
  items: CartItem[]; // Changed from TransactionItem[] to CartItem[]
  shippingAddress?: string;
  paymentMethod?: string;
}

export interface TransactionType {
  id: string;
  customer: string;
  date: string;
  amount: string;
  status: TransactionStatus;
  items: TransactionItem[];
}

// New Customer type
export interface Customer extends UserProfile {
  orderHistory: Order[];
  currentOrder?: Order;
}
