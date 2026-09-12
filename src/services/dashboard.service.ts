import api from "@/lib/api";
import { DashboardStatsResponse } from "@/types/dashboard";

export const getDashboardStats =
  async (): Promise<DashboardStatsResponse> => {
    const token = localStorage.getItem("adminToken");

    if (!token) {
      throw new Error("Admin token not found");
    }

    return api<DashboardStatsResponse>("/dashboard/stats", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  };