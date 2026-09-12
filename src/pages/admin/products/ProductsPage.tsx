"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import AdminHeader from "@/components/admin/AdminHeader";
import AdminSidebar from "@/components/admin/AdminSidebar";

import {
  deleteProduct,
  getProducts,
} from "@/services/product.service";

import { Product } from "@/types/product";

export default function ProductsPage() {
  const router = useRouter();

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [deletingId, setDeletingId] =
    useState<number | null>(null);

  const [error, setError] = useState("");

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
      } catch (error) {
        console.error(
          "Failed to load products:",
          error,
        );

        setError(
          error instanceof Error
            ? error.message
            : "Failed to load products",
        );
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, [router]);

  const handleDelete = async (productId: number) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this product?",
    );

    if (!confirmed) {
      return;
    }

    setError("");
    setDeletingId(productId);

    try {
      await deleteProduct(productId);

      setProducts((currentProducts) =>
        currentProducts.filter(
          (product) => product.id !== productId,
        ),
      );
    } catch (error) {
      console.error(
        "Failed to delete product:",
        error,
      );

      setError(
        error instanceof Error
          ? error.message
          : "Failed to delete product",
      );
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-center">
          <div className="mx-auto h-9 w-9 animate-spin rounded-full border-4 border-border border-t-primary" />

          <p className="mt-4 text-sm text-muted">
            Loading products...
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
            <div className="mb-7 flex items-end justify-between gap-4 sm:mb-9">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">
                  Store
                </p>

                <h1 className="mt-2 text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
                  All Products
                </h1>

                <p className="mt-2 text-sm text-muted">
                  Manage your shirt collection.
                </p>
              </div>

              <button
                type="button"
                onClick={() =>
                  router.push("/admin/products/add")
                }
                className="min-h-10 shrink-0 rounded-lg bg-primary px-3 text-xs font-bold text-white transition hover:bg-primary-hover sm:min-h-11 sm:rounded-xl sm:px-4 sm:text-sm"
              >
                + Add Product
              </button>
            </div>

            {error && (
              <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
                {error}
              </div>
            )}

            {products.length === 0 ? (
              <div className="rounded-2xl border border-border bg-white px-5 py-14 text-center shadow-sm">
                <p className="text-sm font-semibold text-foreground sm:text-base">
                  No products available.
                </p>

                <p className="mt-2 text-xs text-muted sm:text-sm">
                  Add your first product to get started.
                </p>

                <button
                  type="button"
                  onClick={() =>
                    router.push("/admin/products/add")
                  }
                  className="mt-5 rounded-xl bg-primary px-4 py-3 text-sm font-bold text-white transition hover:bg-primary-hover"
                >
                  Add Product
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {products.map((product) => {
                  const totalStock =
                    product.inventories.reduce(
                      (total, inventory) =>
                        total + inventory.stock,
                      0,
                    );

                  const availableSizes =
                    product.inventories.filter(
                      (inventory) =>
                        inventory.stock > 0,
                    );

                  const isDeleting =
                    deletingId === product.id;

                  return (
                    <article
                      key={product.id}
                      className={`overflow-hidden rounded-2xl border border-border bg-white shadow-sm transition ${
                        isDeleting
                          ? "opacity-60"
                          : ""
                      }`}
                    >
                      <div className="aspect-[4/3] overflow-hidden bg-background">
                        <img
                          src={product.imageUrl}
                          alt={product.name}
                          className="h-full w-full object-cover"
                          loading="lazy"
                        />
                      </div>

                      <div className="p-4 sm:p-5">
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <h2 className="truncate text-base font-bold text-foreground sm:text-lg">
                              {product.name}
                            </h2>

                            <p className="mt-1 text-sm font-bold text-primary">
                              ৳{product.price}
                            </p>
                          </div>

                          <span
                            className={`shrink-0 rounded-full px-2.5 py-1 text-[10px] font-bold sm:text-xs ${
                              totalStock > 0
                                ? "bg-green-50 text-green-600"
                                : "bg-red-50 text-red-600"
                            }`}
                          >
                            {totalStock > 0
                              ? "In Stock"
                              : "Out of Stock"}
                          </span>
                        </div>

                        <div className="mt-4 border-t border-border pt-4">
                          <p className="text-xs font-semibold text-muted">
                            Size & Stock
                          </p>

                          <div className="mt-2 flex flex-wrap gap-2">
                            {product.inventories.map(
                              (inventory) => (
                                <span
                                  key={inventory.id}
                                  className="rounded-lg border border-border bg-background px-2.5 py-1.5 text-xs font-semibold text-foreground"
                                >
                                  {inventory.size}:{" "}
                                  {inventory.stock}
                                </span>
                              ),
                            )}
                          </div>

                          <p className="mt-3 text-xs text-muted">
                            {availableSizes.length}{" "}
                            available size
                            {availableSizes.length !==
                            1
                              ? "s"
                              : ""}
                          </p>
                        </div>

                        <div className="mt-5 grid grid-cols-2 gap-2">
                          <button
                            type="button"
                            disabled={isDeleting}
                            onClick={() =>
                              router.push(
                                `/admin/products/${product.id}/edit`,
                              )
                            }
                            className="min-h-10 rounded-lg border border-border px-3 text-xs font-bold text-foreground transition hover:border-primary hover:text-primary disabled:cursor-not-allowed disabled:opacity-50 sm:min-h-11 sm:text-sm"
                          >
                            Edit
                          </button>

                          <button
                            type="button"
                            disabled={isDeleting}
                            onClick={() =>
                              handleDelete(product.id)
                            }
                            className="min-h-10 rounded-lg border border-red-200 px-3 text-xs font-bold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50 sm:min-h-11 sm:text-sm"
                          >
                            {isDeleting
                              ? "Deleting..."
                              : "Delete"}
                          </button>
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