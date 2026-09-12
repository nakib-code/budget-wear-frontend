"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import AdminHeader from "@/components/admin/AdminHeader";
import AdminSidebar from "@/components/admin/AdminSidebar";
import DashboardCard from "@/components/admin/DashboardCard";

import { getDashboardStats } from "@/services/dashboard.service";
import { DashboardStats } from "@/types/dashboard";

export default function AdminDashboardPage() {
  const router = useRouter();

  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const loadDashboard = async () => {
      const token = localStorage.getItem("adminToken");

      if (!token) {
        router.replace("/admin/login");
        return;
      }

      try {
        const response = await getDashboardStats();
        setStats(response.data);
      } catch (error) {
        console.error("Failed to load dashboard:", error);

        localStorage.removeItem("adminToken");
        router.replace("/admin/login");
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, [router]);

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-center">
          <div className="mx-auto h-9 w-9 animate-spin rounded-full border-4 border-border border-t-primary" />

          <p className="mt-4 text-sm text-muted">
            Loading dashboard...
          </p>
        </div>
      </main>
    );
  }

  if (!stats) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <AdminSidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="lg:pl-64">
        <AdminHeader
          onMenuClick={() => setSidebarOpen(true)}
        />

        <main className="px-4 py-7 sm:px-6 sm:py-10">
          <div className="mx-auto max-w-7xl">
            <div className="mb-7 sm:mb-9">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">
                Overview
              </p>

              <h1 className="mt-2 text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
                Dashboard
              </h1>

              <p className="mt-2 text-sm text-muted">
                Monitor your store at a glance.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-3">
              <DashboardCard
                title="Total Products"
                value={stats.totalProducts}
                description="Active products"
              />

              <DashboardCard
                title="Available Products"
                value={stats.availableProducts}
                description="Currently in stock"
              />

              <DashboardCard
                title="Out of Stock"
                value={stats.outOfStockProducts}
                description="No stock available"
              />

              <DashboardCard
                title="Today's Orders"
                value={stats.todayOrders}
                description="Orders placed today"
              />

              <DashboardCard
                title="Pending Orders"
                value={stats.pendingOrders}
                description="Waiting for action"
              />

              <DashboardCard
                title="Delivered Orders"
                value={stats.deliveredOrders}
                description="Successfully delivered"
              />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}