"use client";

import { useEffect, useState } from "react";

import ProductCard from "@/components/ProductCard";
import SelectionModal from "@/components/SelectionModal";
import OrderForm from "@/components/OrderForm";
import OrderSuccess from "@/components/OrderSuccess";

import { getProducts } from "@/services/product.service";
import { Product } from "@/types/product";
import { CartItem } from "@/types/cart";

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedItems, setSelectedItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);

  const [showSelectionModal, setShowSelectionModal] =
    useState(false);

  const [showOrderForm, setShowOrderForm] = useState(false);

  const [orderId, setOrderId] = useState<number | null>(null);

  const [showSelectionToast, setShowSelectionToast] =
    useState(false);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const data = await getProducts();
        setProducts(data);
      } catch (error) {
        console.error("Failed to load products:", error);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
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
        updatedItems.map(
          (selectedItem) => selectedItem.productId,
        ),
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

  const handleOrderSuccess = (id: number) => {
    setShowOrderForm(false);
    setSelectedItems([]);
    setOrderId(id);
  };

  const selectedProductCount = new Set(
    selectedItems.map((item) => item.productId),
  ).size;

  if (loading) {
    return (
      <main className="min-h-[70vh] bg-background px-4 py-10 sm:px-6">
        <div className="mx-auto flex min-h-[50vh] max-w-7xl items-center justify-center">
          <div className="text-center">
            <div className="mx-auto h-9 w-9 animate-spin rounded-full border-4 border-border border-t-primary sm:h-10 sm:w-10" />

            <p className="mt-4 text-sm text-muted">
              Loading products...
            </p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <>
      <main className="min-h-screen bg-background">
        <section className="px-3 py-8 sm:px-6 sm:py-12 lg:py-16">
          <div className="mx-auto max-w-7xl">
            {/* Section Heading */}
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

              <p className="mx-auto mt-2 max-w-lg text-xs leading-5 text-muted sm:mt-3 sm:text-sm sm:leading-6 lg:text-base">
                আপনার পছন্দের শার্ট বেছে নিন এবং যেকোনো ৩ পিস
                বা তার বেশি সিলেক্ট করে অর্ডার করুন।
              </p>

              {selectedProductCount > 0 && (
                <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-primary/15 bg-white px-3.5 py-2 shadow-sm">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-[11px] font-bold text-white">
                    {selectedProductCount}
                  </span>

                  <span className="text-xs font-semibold text-foreground sm:text-sm">
                    {selectedProductCount} টি প্রোডাক্ট সিলেক্ট করা হয়েছে
                  </span>
                </div>
              )}
            </div>

            {/* Products */}
            {products.length === 0 ? (
              <div className="rounded-2xl border border-border bg-surface px-4 py-12 text-center sm:px-5 sm:py-16">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-background text-lg">
                  —
                </div>

                <p className="mt-4 text-sm font-semibold text-foreground sm:text-base">
                  এখন কোনো পণ্য available নেই।
                </p>

                <p className="mt-1.5 text-xs text-muted sm:text-sm">
                  পরে আবার চেষ্টা করুন।
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3 xl:gap-7">
                {products.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onSelect={handleSelectProduct}
                  />
                ))}
              </div>
            )}
          </div>
        </section>
      </main>

      {/* Selection Toast */}
      {showSelectionToast && selectedProductCount > 0 && (
        <div className="fixed right-3 top-[84px] z-40 sm:right-6 sm:top-[92px]">
          <div className="flex items-center gap-2.5 rounded-xl border border-border bg-white px-3 py-2.5 shadow-xl sm:gap-3 sm:px-4 sm:py-3">
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-xs font-bold text-white sm:h-8 sm:w-8 sm:text-sm">
              {selectedProductCount}
            </div>

            <div>
              <p className="text-xs font-bold text-foreground sm:text-sm">
                Selected {selectedProductCount}
              </p>

              <p className="text-[10px] text-muted sm:text-xs">
                {3 - selectedProductCount > 0
                  ? `${3 - selectedProductCount} more to order`
                  : "Ready to order"}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Selection Modal */}
      {showSelectionModal && (
        <SelectionModal
          onBuyNow={() => {
            setShowSelectionModal(false);
            setShowOrderForm(true);
          }}
          onSelectMore={() => {
            setShowSelectionModal(false);
          }}
        />
      )}

      {/* Order Form */}
      {showOrderForm && (
        <OrderForm
          items={selectedItems}
          onClose={() => {
            setShowOrderForm(false);
          }}
          onSuccess={handleOrderSuccess}
        />
      )}

      {/* Order Success */}
      {orderId !== null && (
        <OrderSuccess
          orderId={orderId}
          onClose={() => {
            setOrderId(null);
          }}
        />
      )}
    </>
  );
}