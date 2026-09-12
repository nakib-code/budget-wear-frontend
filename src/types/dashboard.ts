export interface DashboardStats {
  totalProducts: number;
  availableProducts: number;
  outOfStockProducts: number;
  todayOrders: number;
  pendingOrders: number;
  deliveredOrders: number;
}

export interface DashboardStatsResponse {
  success: boolean;
  message: string;
  data: DashboardStats;
}