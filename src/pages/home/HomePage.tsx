"use client";

import { useEffect, useState } from "react";

import OrderForm from "@/components/OrderForm";
import OrderSuccess from "@/components/OrderSuccess";
import ProductCard from "@/components/ProductCard";
import SelectionModal from "@/components/SelectionModal";

import { getProducts } from "@/services/product.service";
import { CartItem } from "@/types/cart";
import { Product } from "@/types/product";

const PRODUCTS_CACHE_KEY = "budget-wear-products";
const PRODUCTS_CACHE_TIME = 5 * 60 * 1000;

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedItems, setSelectedItems] = useState<CartItem[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showSelectionModal, setShowSelectionModal] = useState(false);

  const [showOrderForm, setShowOrderForm] = useState(false);

  const [orderId, setOrderId] = useState<number | null>(null);

  const [showSelectionToast, setShowSelectionToast] = useState(false);

  const loadProducts = async (showLoader = true) => {
    if (showLoader) {
      setLoading(true);
    }

    setError("");

    try {
      const cachedData = localStorage.getItem(PRODUCTS_CACHE_KEY);

      if (cachedData) {
        try {
          const parsed = JSON.parse(cachedData) as {
            data: Product[];
            timestamp: number;
          };

          if (
            Array.isArray(parsed.data) &&
            typeof parsed.timestamp === "number"
          ) {
            setProducts(parsed.data);

            if (Date.now() - parsed.timestamp < PRODUCTS_CACHE_TIME) {
              setLoading(false);
              return;
            }
          }
        } catch (cacheError) {
          console.error("Failed to read product cache:", cacheError);

          localStorage.removeItem(PRODUCTS_CACHE_KEY);
        }
      }

      const data = await getProducts();

      setProducts(data);

      localStorage.setItem(
        PRODUCTS_CACHE_KEY,
        JSON.stringify({
          data,
          timestamp: Date.now(),
        }),
      );
    } catch (requestError) {
      console.error("Failed to load products:", requestError);

      setError(
        requestError instanceof Error
          ? requestError.message
          : "Unable to load products.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void loadProducts();
    }, 0);

    return () => {
      window.clearTimeout(timer);
    };
  }, []);

  const handleSelectProduct = (item: CartItem) => {
    setSelectedItems((currentItems) => {
      const existingItemIndex = currentItems.findIndex(
        (selectedItem) =>
          selectedItem.productId === item.productId &&
          selectedItem.size === item.size,
      );

      let updatedItems: CartItem[];

      if (existingItemIndex !== -1) {
        updatedItems = [...currentItems];
        updatedItems[existingItemIndex] = item;
      } else {
        updatedItems = [...currentItems, item];
      }

      const uniqueProductIds = new Set(
        updatedItems.map((selectedItem) => selectedItem.productId),
      );

      const selectedCount = uniqueProductIds.size;

      if (existingItemIndex === -1 && selectedCount < 3) {
        setShowSelectionToast(true);

        window.setTimeout(() => {
          setShowSelectionToast(false);
        }, 1800);
      }

      if (selectedCount >= 3) {
        setShowSelectionToast(false);
        setShowSelectionModal(true);
      }

      return updatedItems;
    });
  };

  const handleBuyNow = () => {
    setShowSelectionModal(false);
    setShowOrderForm(true);
  };

  const handleSelectMore = () => {
    setShowSelectionModal(false);
  };

  const handleOrderSuccess = (id: number) => {
    setShowOrderForm(false);
    setSelectedItems([]);
    setOrderId(id);

    // Remove cached stock after a successful order.
    localStorage.removeItem(PRODUCTS_CACHE_KEY);
  };

  const selectedProductCount = new Set(
    selectedItems.map((item) => item.productId),
  ).size;

  const totalSelectedAmount = selectedItems.reduce(
    (total, item) => total + Number(item.price) * item.quantity,
    0,
  );

  return (
    <>
      <main className="min-h-screen bg-background">
        <section className="px-3 py-8 sm:px-6 sm:py-12 lg:py-16">
          <div className="mx-auto max-w-7xl">
            {/* Intro */}
            <div className="mx-auto mb-7 max-w-2xl text-center sm:mb-10">
              <div className="mx-auto flex w-fit items-center gap-2 rounded-full border border-primary/15 bg-primary/5 px-3 py-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-primary" />

                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary sm:text-xs">
                  Men&apos;s Collection
                </p>
              </div>

              <h1 className="mt-4 text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl lg:text-4xl">
                Find Your Perfect Shirt
              </h1>
            </div>

            {/* Loading Skeleton */}
            {loading && products.length === 0 && (
              <div className="grid grid-cols-2 gap-3 sm:gap-6 lg:grid-cols-3 xl:gap-7">
                {Array.from({ length: 6 }).map((_, index) => (
                  <div
                    key={index}
                    className="overflow-hidden rounded-xl border border-border bg-white shadow-sm sm:rounded-2xl"
                  >
                    <div className="aspect-[4/5] animate-pulse bg-slate-200 sm:aspect-[3/4] sm:h-[420px]" />

                    <div className="space-y-3 p-3 sm:p-5">
                      <div className="h-4 w-2/3 animate-pulse rounded bg-slate-200" />

                      <div className="h-3 w-1/3 animate-pulse rounded bg-slate-200" />

                      <div className="h-3 w-full animate-pulse rounded bg-slate-200" />

                      <div className="flex gap-2">
                        <div className="h-7 w-9 animate-pulse rounded-md bg-slate-200" />
                        <div className="h-7 w-9 animate-pulse rounded-md bg-slate-200" />
                        <div className="h-7 w-9 animate-pulse rounded-md bg-slate-200" />
                      </div>

                      <div className="h-9 w-full animate-pulse rounded-lg bg-slate-200" />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Error State */}
            {!loading && error && products.length === 0 && (
              <div className="mx-auto max-w-md rounded-2xl border border-red-200 bg-white px-5 py-10 text-center shadow-sm">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-50 text-lg font-bold text-red-600">
                  !
                </div>

                <h2 className="mt-4 text-base font-bold text-foreground sm:text-lg">
                  Products could not be loaded
                </h2>

                <p className="mt-2 text-xs leading-5 text-muted sm:text-sm">
                  Please check your connection and try again.
                </p>

                <button
                  type="button"
                  onClick={() => loadProducts()}
                  className="mt-5 min-h-10 rounded-lg bg-primary px-5 py-2.5 text-xs font-bold text-white transition-colors hover:bg-primary-hover active:scale-[0.98] sm:min-h-11 sm:rounded-xl sm:px-6 sm:text-sm"
                >
                  Try Again
                </button>
              </div>
            )}

            {/* Products */}
            {!loading && !error && products.length === 0 && (
              <div className="mx-auto max-w-md rounded-2xl border border-border bg-white px-5 py-10 text-center shadow-sm">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-lg font-bold text-primary">
                  !
                </div>

                <h2 className="mt-4 text-base font-bold text-foreground sm:text-lg">
                  No products available
                </h2>

                <p className="mt-2 text-xs leading-5 text-muted sm:text-sm">
                  New products will appear here soon.
                </p>
              </div>
            )}

            {!loading && products.length > 0 && (
              <>
                {/* Selection Hint */}
                <div className="mx-auto mb-5 flex max-w-lg items-center justify-center gap-2 rounded-full border border-primary/15 bg-primary/[0.06] px-3 py-2.5 sm:mb-7 sm:px-5 sm:py-3">
                  <span className="flex h-5 min-w-8 shrink-0 items-center justify-center rounded-full bg-primary px-1.5 text-[9px] font-extrabold text-white sm:h-6 sm:min-w-9 sm:text-[10px]">
                    ৩+
                  </span>

                  <p className="text-center text-[10px] font-semibold leading-4.5 text-foreground sm:text-sm sm:leading-5">
                    আপনার পছন্দের শার্ট বেছে নিন এবং{" "}
                    <span className="font-extrabold text-primary">
                      ৩ পিস বা তার বেশি
                    </span>{" "}
                    সিলেক্ট করে অর্ডার করুন।
                  </p>
                </div>

                {/* Selected Count */}
                {selectedProductCount > 0 && (
                  <div className="mx-auto mb-5 w-fit rounded-full border border-primary/10 bg-white px-3 py-1.5 shadow-sm sm:mb-7 sm:px-4 sm:py-2">
                    <p className="text-[10px] font-bold text-foreground sm:text-xs">
                      Selected{" "}
                      <span className="text-primary">
                        {selectedProductCount}
                      </span>{" "}
                      product
                      {selectedProductCount > 1 ? "s" : ""}
                    </p>
                  </div>
                )}

                {/* Product Grid */}
                <div className="grid grid-cols-2 gap-3 sm:gap-6 lg:grid-cols-3 xl:gap-7">
                  {products.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      onSelect={handleSelectProduct}
                    />
                  ))}
                </div>

                {/* Refresh Error */}
                {error && products.length > 0 && (
                  <div className="mx-auto mt-5 flex max-w-xl items-center justify-between gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3">
                    <p className="text-xs font-medium text-red-600">
                      Couldn&apos;t refresh products.
                    </p>

                    <button
                      type="button"
                      onClick={() => loadProducts(false)}
                      className="shrink-0 text-xs font-bold text-red-700 underline underline-offset-2"
                    >
                      Retry
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </section>
      </main>
      {/* Selection Toast */}
      {showSelectionToast && (
        <div className="fixed inset-x-0 bottom-5 z-50 flex justify-center px-4">
          <div className="rounded-full border border-border bg-white px-4 py-2.5 text-xs font-bold text-foreground shadow-lg">
            Selected{" "}
            <span className="text-primary">{selectedProductCount}</span>
          </div>
        </div>
      )}
      {/* Selection Modal */}
      ```tsx
      {showSelectionModal && (
        <SelectionModal
          onBuyNow={handleBuyNow}
          onSelectMore={handleSelectMore}
        />
      )}
      ```
      {/* Order Form */}
      {showOrderForm && (
        <OrderForm
          items={selectedItems}
          onSuccess={handleOrderSuccess}
          onClose={() => setShowOrderForm(false)}
        />
      )}
      {/* Order Success */}
      {orderId !== null && (
        <OrderSuccess orderId={orderId} onClose={() => setOrderId(null)} />
      )}
    </>
  );
}
