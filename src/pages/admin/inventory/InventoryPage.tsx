"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import AdminHeader from "@/components/admin/AdminHeader";
import AdminSidebar from "@/components/admin/AdminSidebar";

import { getProducts } from "@/services/product.service";
import { updateInventory } from "@/services/inventory.service";

import { Product } from "@/types/product";

export default function InventoryPage() {
  const router = useRouter();

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [stockValues, setStockValues] = useState<
    Record<number, number>
  >({});

  const [savingProductId, setSavingProductId] =
    useState<number | null>(null);

  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] =
    useState("");

  useEffect(() => {
    const loadProducts = async () => {
      const token = localStorage.getItem("adminToken");

      if (!token) {
        router.replace("/admin/login");
        return;
      }

      try {
        const data = await getProducts();

        setProducts(data);

        const initialStockValues: Record<number, number> = {};

        data.forEach((product) => {
          product.inventories.forEach((inventory) => {
            initialStockValues[inventory.id] =
              inventory.stock;
          });
        });

        setStockValues(initialStockValues);
      } catch (error) {
        console.error(
          "Failed to load inventory:",
          error,
        );

        setError(
          error instanceof Error
            ? error.message
            : "Failed to load inventory",
        );
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, [router]);

  const handleStockChange = (
    inventoryId: number,
    value: string,
  ) => {
    const parsedValue = Number(value);

    const stock =
      Number.isFinite(parsedValue) && parsedValue >= 0
        ? Math.floor(parsedValue)
        : 0;

    setStockValues((currentValues) => ({
      ...currentValues,
      [inventoryId]: stock,
    }));
  };

  const handleSaveProduct = async (
    product: Product,
  ) => {
    setError("");
    setSuccessMessage("");
    setSavingProductId(product.id);

    try {
      for (const inventory of product.inventories) {
        const newStock =
          stockValues[inventory.id] ?? inventory.stock;

        if (newStock !== inventory.stock) {
          await updateInventory(
            inventory.id,
            newStock,
          );
        }
      }

      setProducts((currentProducts) =>
        currentProducts.map((currentProduct) => {
          if (currentProduct.id !== product.id) {
            return currentProduct;
          }

          return {
            ...currentProduct,
            inventories:
              currentProduct.inventories.map(
                (inventory) => ({
                  ...inventory,
                  stock:
                    stockValues[inventory.id] ??
                    inventory.stock,
                }),
              ),
          };
        }),
      );

      setSuccessMessage(
        `${product.name} stock updated successfully.`,
      );

      window.setTimeout(() => {
        setSuccessMessage("");
      }, 2500);
    } catch (error) {
      console.error(
        "Failed to update inventory:",
        error,
      );

      setError(
        error instanceof Error
          ? error.message
          : "Failed to update inventory",
      );
    } finally {
      setSavingProductId(null);
    }
  };

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-center">
          <div className="mx-auto h-9 w-9 animate-spin rounded-full border-4 border-border border-t-primary" />

          <p className="mt-4 text-sm text-muted">
            Loading inventory...
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
                Inventory
              </h1>

              <p className="mt-2 text-sm text-muted">
                Manage product stock by size.
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

            {products.length === 0 ? (
              <div className="rounded-2xl border border-border bg-white px-5 py-14 text-center shadow-sm">
                <p className="text-sm font-semibold text-foreground sm:text-base">
                  No inventory available.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {products.map((product) => {
                  const totalStock =
                    product.inventories.reduce(
                      (total, inventory) =>
                        total +
                        (stockValues[inventory.id] ??
                          inventory.stock),
                      0,
                    );

                  const isSaving =
                    savingProductId === product.id;

                  return (
                    <article
                      key={product.id}
                      className="rounded-2xl border border-border bg-white p-4 shadow-sm sm:p-5"
                    >
                      <div className="flex items-center gap-3">
                        <div className="h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-background">
                          <img
                            src={product.imageUrl}
                            alt={product.name}
                            className="h-full w-full object-cover"
                            loading="lazy"
                          />
                        </div>

                        <div className="min-w-0">
                          <h2 className="truncate text-sm font-bold text-foreground sm:text-base">
                            {product.name}
                          </h2>

                          <p className="mt-1 text-xs text-muted">
                            Total stock: {totalStock}
                          </p>
                        </div>
                      </div>

                      <div className="mt-5 space-y-2">
                        {product.inventories.map(
                          (inventory) => {
                            const currentStock =
                              stockValues[
                                inventory.id
                              ] ?? inventory.stock;

                            return (
                              <div
                                key={inventory.id}
                                className="flex items-center justify-between rounded-xl border border-border bg-background px-3 py-3"
                              >
                                <div>
                                  <p className="text-sm font-bold text-foreground">
                                    Size {inventory.size}
                                  </p>

                                  <p
                                    className={`mt-0.5 text-xs font-medium ${
                                      currentStock > 0
                                        ? "text-green-600"
                                        : "text-red-600"
                                    }`}
                                  >
                                    {currentStock > 0
                                      ? "In stock"
                                      : "Out of stock"}
                                  </p>
                                </div>

                                <input
                                  type="number"
                                  min="0"
                                  value={currentStock}
                                  onChange={(
                                    event,
                                  ) =>
                                    handleStockChange(
                                      inventory.id,
                                      event.target.value,
                                    )
                                  }
                                  className="h-10 w-20 rounded-lg border border-border bg-white px-2 text-center text-sm font-semibold outline-none transition focus:border-primary"
                                />
                              </div>
                            );
                          },
                        )}
                      </div>

                      <button
                        type="button"
                        disabled={isSaving}
                        onClick={() =>
                          handleSaveProduct(product)
                        }
                        className="mt-5 min-h-11 w-full rounded-xl bg-primary px-4 py-3 text-sm font-bold text-white transition hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {isSaving
                          ? "Saving..."
                          : "Save Changes"}
                      </button>
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