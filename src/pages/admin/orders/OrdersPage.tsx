"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import AdminHeader from "@/components/admin/AdminHeader";
import AdminSidebar from "@/components/admin/AdminSidebar";

import {
  getOrders,
  updateOrderStatus,
} from "@/services/order.service";

import {
  Order,
  OrderStatus,
} from "@/types/order";

export default function OrdersPage() {
  const router = useRouter();

  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [updatingOrderId, setUpdatingOrderId] =
    useState<number | null>(null);

  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] =
    useState("");

  useEffect(() => {
    const loadOrders = async () => {
      const token = localStorage.getItem("adminToken");

      if (!token) {
        router.replace("/admin/login");
        return;
      }

      try {
        const data = await getOrders();
        setOrders(data);
      } catch (error) {
        console.error("Failed to load orders:", error);

        setError(
          error instanceof Error
            ? error.message
            : "Failed to load orders",
        );
      } finally {
        setLoading(false);
      }
    };

    loadOrders();
  }, [router]);

  const getStatusClass = (status: OrderStatus) => {
    switch (status) {
      case "PENDING":
        return "bg-yellow-50 text-yellow-700";

      case "CONFIRMED":
        return "bg-blue-50 text-blue-700";

      case "DELIVERED":
        return "bg-green-50 text-green-700";

      case "CANCELLED":
        return "bg-red-50 text-red-700";

      default:
        return "bg-background text-muted";
    }
  };

  const getAvailableStatuses = (
    currentStatus: OrderStatus,
  ): OrderStatus[] => {
    if (currentStatus === "PENDING") {
      return [
        "PENDING",
        "CONFIRMED",
        "CANCELLED",
      ];
    }

    if (currentStatus === "CONFIRMED") {
      return [
        "CONFIRMED",
        "DELIVERED",
        "CANCELLED",
      ];
    }

    if (currentStatus === "DELIVERED") {
      return ["DELIVERED"];
    }

    return ["CANCELLED"];
  };

  const handleStatusChange = async (
    orderId: number,
    status: OrderStatus,
  ) => {
    if (status === "CANCELLED") {
      const confirmed = window.confirm(
        "Are you sure you want to cancel this order? Stock will be restored.",
      );

      if (!confirmed) {
        return;
      }
    }

    setError("");
    setSuccessMessage("");
    setUpdatingOrderId(orderId);

    try {
      const updatedOrder = await updateOrderStatus(
        orderId,
        status,
      );

      setOrders((currentOrders) =>
        currentOrders.map((order) =>
          order.id === orderId
            ? updatedOrder
            : order,
        ),
      );

      setSuccessMessage(
        `Order #${orderId} updated to ${status}.`,
      );

      window.setTimeout(() => {
        setSuccessMessage("");
      }, 2500);
    } catch (error) {
      console.error(
        "Failed to update order status:",
        error,
      );

      setError(
        error instanceof Error
          ? error.message
          : "Failed to update order status",
      );
    } finally {
      setUpdatingOrderId(null);
    }
  };

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-center">
          <div className="mx-auto h-9 w-9 animate-spin rounded-full border-4 border-border border-t-primary" />

          <p className="mt-4 text-sm text-muted">
            Loading orders...
          </p>
        </div>
      </main>
    );
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
                Store
              </p>

              <h1 className="mt-2 text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
                Orders
              </h1>

              <p className="mt-2 text-sm text-muted">
                Manage customer orders and order status.
              </p>
            </div>

            {error && (
              <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
                {error}
              </div>
            )}

            {successMessage && (
              <div className="mb-5 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm font-medium text-green-600">
                {successMessage}
              </div>
            )}

            {orders.length === 0 ? (
              <div className="rounded-2xl border border-border bg-white px-5 py-14 text-center shadow-sm">
                <p className="text-sm font-semibold text-foreground sm:text-base">
                  No orders found.
                </p>

                <p className="mt-2 text-xs text-muted sm:text-sm">
                  New customer orders will appear here.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map((order) => {
                  const isUpdating =
                    updatingOrderId === order.id;

                  const availableStatuses =
                    getAvailableStatuses(order.status);

                  return (
                    <article
                      key={order.id}
                      className="rounded-2xl border border-border bg-white p-4 shadow-sm sm:p-5"
                    >
                      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <h2 className="text-base font-bold text-foreground sm:text-lg">
                              Order #{order.id}
                            </h2>

                            <span
                              className={`rounded-full px-2.5 py-1 text-[10px] font-bold sm:text-xs ${getStatusClass(
                                order.status,
                              )}`}
                            >
                              {order.status}
                            </span>
                          </div>

                          <p className="mt-2 text-sm font-semibold text-foreground">
                            {order.customerName}
                          </p>

                          <p className="mt-1 text-sm text-muted">
                            {order.phone}
                          </p>

                          <p className="mt-1 text-sm leading-6 text-muted">
                            {order.address}
                          </p>
                        </div>

                        <div className="shrink-0 sm:text-right">
                          <p className="text-lg font-extrabold text-primary">
                            ৳{order.totalAmount}
                          </p>

                          <p className="mt-1 text-xs text-muted">
                            {new Date(
                              order.createdAt,
                            ).toLocaleString()}
                          </p>
                        </div>
                      </div>

                      {/* Status Control */}
                      <div className="mt-5 rounded-xl border border-border bg-background p-3 sm:p-4">
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                          <div>
                            <p className="text-xs font-bold uppercase tracking-wide text-muted">
                              Order Status
                            </p>

                            <p className="mt-1 text-sm text-foreground">
                              Update the current order status.
                            </p>
                          </div>

                          <select
                            value={order.status}
                            disabled={
                              isUpdating ||
                              availableStatuses.length === 1
                            }
                            onChange={(event) =>
                              handleStatusChange(
                                order.id,
                                event.target
                                  .value as OrderStatus,
                              )
                            }
                            className="min-h-11 w-full rounded-xl border border-border bg-white px-3 text-sm font-semibold text-foreground outline-none transition focus:border-primary disabled:cursor-not-allowed disabled:opacity-60 sm:w-52"
                          >
                            {availableStatuses.map(
                              (status) => (
                                <option
                                  key={status}
                                  value={status}
                                >
                                  {status}
                                </option>
                              ),
                            )}
                          </select>
                        </div>

                        {isUpdating && (
                          <p className="mt-2 text-xs font-medium text-primary">
                            Updating order...
                          </p>
                        )}
                      </div>

                      {/* Order Items */}
                      <div className="mt-5 border-t border-border pt-4">
                        <p className="text-xs font-bold uppercase tracking-wide text-muted">
                          Order Items
                        </p>

                        <div className="mt-3 space-y-3">
                          {order.items.map((item) => (
                            <div
                              key={item.id}
                              className="flex items-center gap-3 rounded-xl bg-background p-3"
                            >
                              <div className="h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-white">
                                <img
                                  src={item.product.imageUrl}
                                  alt={item.product.name}
                                  className="h-full w-full object-cover"
                                  loading="lazy"
                                />
                              </div>

                              <div className="min-w-0 flex-1">
                                <p className="truncate text-sm font-semibold text-foreground">
                                  {item.product.name}
                                </p>

                                <p className="mt-1 text-xs text-muted">
                                  Size {item.size} ×{" "}
                                  {item.quantity}
                                </p>
                              </div>

                              <p className="shrink-0 text-sm font-bold text-foreground">
                                ৳
                                {Number(item.price) *
                                  item.quantity}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}