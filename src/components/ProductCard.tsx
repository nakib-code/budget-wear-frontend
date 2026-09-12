"use client";

import { useMemo, useState } from "react";

import { Product } from "@/types/product";
import { CartItem } from "@/types/cart";

interface ProductCardProps {
  product: Product;
  onSelect: (item: CartItem) => void;
}

export default function ProductCard({
  product,
  onSelect,
}: ProductCardProps) {
  const availableSizes = useMemo(
    () =>
      product.inventories.filter(
        (inventory) => inventory.stock > 0,
      ),
    [product.inventories],
  );

  const [selectedSize, setSelectedSize] = useState(
    availableSizes[0]?.size ?? "",
  );

  const selectedInventory = availableSizes.find(
    (inventory) => inventory.size === selectedSize,
  );

  const handleSelect = () => {
    if (!selectedInventory) {
      return;
    }

    onSelect({
      productId: product.id,
      productName: product.name,
      size: selectedSize,
      quantity: 1,
      price: product.price,
    });
  };

  if (availableSizes.length === 0) {
    return null;
  }

  return (
    <article className="group flex h-full min-w-0 flex-col overflow-hidden rounded-2xl border border-border bg-surface shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
      {/* Product Image */}
      <div className="relative aspect-[3/4] overflow-hidden bg-background sm:aspect-auto sm:h-[420px]">
        <img
          src={product.imageUrl}
          alt={product.name}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />

        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/20 to-transparent" />
      </div>

      {/* Product Info */}
      <div className="flex flex-1 flex-col p-3.5 sm:p-5">
        <div className="flex items-start justify-between gap-2.5">
          <div className="min-w-0">
            <h2 className="truncate text-sm font-bold leading-5 text-foreground sm:text-xl sm:leading-6">
              {product.name}
            </h2>

            <p className="mt-1 text-[10px] font-medium uppercase tracking-[0.14em] text-muted sm:text-xs">
              Men&apos;s Wear
            </p>
          </div>

          <p className="shrink-0 rounded-full bg-primary/10 px-2.5 py-1 text-sm font-extrabold text-primary sm:px-3 sm:py-1.5 sm:text-lg">
            ৳{product.price}
          </p>
        </div>

        {product.description && (
          <p className="mt-2 line-clamp-2 text-[11px] leading-4.5 text-muted sm:mt-3 sm:text-sm sm:leading-6">
            {product.description}
          </p>
        )}

        {/* Size Selection */}
        <div className="mt-auto pt-4 sm:pt-6">
          <div className="flex items-center justify-between">
            <p className="text-xs font-bold text-foreground sm:text-sm">
              Select Size
            </p>

            {selectedInventory && (
              <p className="text-[10px] font-medium text-muted sm:text-xs">
                {selectedInventory.stock} available
              </p>
            )}
          </div>

          <div className="mt-2.5 flex flex-wrap gap-2">
            {availableSizes.map((inventory) => {
              const isSelected =
                selectedSize === inventory.size;

              return (
                <button
                  key={inventory.id}
                  type="button"
                  onClick={() => setSelectedSize(inventory.size)}
                  aria-pressed={isSelected}
                  className={`min-h-10 min-w-11 rounded-lg border px-3 text-xs font-bold transition-all duration-200 active:scale-95 sm:min-h-11 sm:min-w-12 sm:text-sm ${
                    isSelected
                      ? "border-primary bg-primary text-white shadow-sm"
                      : "border-border bg-white text-foreground hover:border-primary hover:text-primary"
                  }`}
                >
                  {inventory.size}
                </button>
              );
            })}
          </div>

          {/* Select Product Button */}
          <button
            type="button"
            onClick={handleSelect}
            className="mt-4 min-h-11 w-full rounded-xl bg-primary px-4 py-3 text-xs font-bold text-white shadow-sm transition-all duration-200 hover:bg-primary-hover hover:shadow-md active:scale-[0.99] sm:mt-5 sm:min-h-12 sm:text-sm"
          >
            Select Product
          </button>
        </div>
      </div>
    </article>
  );
}