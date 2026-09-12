import api from "@/lib/api";

import {
  CreateOrderPayload,
  CreateOrderResponse,
  Order,
  OrdersResponse,
  OrderStatus,
} from "@/types/order";

export const createOrder = async (
  payload: CreateOrderPayload,
): Promise<CreateOrderResponse> => {
  return api<CreateOrderResponse>("/orders", {
    method: "POST",
    body: JSON.stringify(payload),
  });
};

export const getOrders = async (): Promise<Order[]> => {
  const token = localStorage.getItem("adminToken");

  if (!token) {
    throw new Error("Admin token not found");
  }

  const response = await api<OrdersResponse>("/orders", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

export const updateOrderStatus = async (
  orderId: number,
  status: OrderStatus,
): Promise<Order> => {
  const token = localStorage.getItem("adminToken");

  if (!token) {
    throw new Error("Admin token not found");
  }

  const response = await api<{
    success: boolean;
    message: string;
    data: Order;
  }>(`/orders/${orderId}/status`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      status,
    }),
  });

  return response.data;
};