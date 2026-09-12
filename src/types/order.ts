import { CartItem } from "@/types/cart";

export interface CreateOrderPayload {
  customerName: string;
  phone: string;
  address: string;
  items: CartItem[];
}

export interface CreateOrderResponse {
  success: boolean;
  message: string;
  data: {
    id: number;
    totalAmount: string;
    status: string;
  };
}

export type OrderStatus =
  | "PENDING"
  | "CONFIRMED"
  | "DELIVERED"
  | "CANCELLED";

export interface OrderItem {
  id: number;
  productId: number;
  size: string;
  quantity: number;
  price: string;
  product: {
    id: number;
    name: string;
    imageUrl: string;
  };
}

export interface Order {
  id: number;
  customerName: string;
  phone: string;
  address: string;
  totalAmount: string;
  status: OrderStatus;
  createdAt: string;
  updatedAt: string;
  items: OrderItem[];
}

export interface OrdersResponse {
  success: boolean;
  message: string;
  data: Order[];
}