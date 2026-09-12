"use client";

import Image from "next/image";
import { useMemo, useState } from "react";

import { CartItem } from "@/types/cart";
import { Product } from "@/types/product";

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
    <article className="group flex h-full min-w-0 flex-col overflow-hidden rounded-xl border border-border bg-surface shadow-sm transition-shadow duration-300 sm:rounded-2xl sm:hover:shadow-md">
      {/* Product Image */}
      <div className="relative aspect-[4/5] overflow-hidden bg-slate-100 sm:aspect-[3/4] sm:h-[420px]">
        <Image
          src={product.imageUrl}
          alt={product.name}
          fill
          priority={false}
          sizes="(max-width: 639px) 50vw, (max-width: 1023px) 50vw, 33vw"
          className="object-cover transition-transform duration-500 sm:group-hover:scale-[1.03]"
        />

        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-black/15 to-transparent sm:h-20" />
      </div>

      {/* Product Content */}
      <div className="flex flex-1 flex-col p-2.5 sm:p-5">
        {/* Product Name + Price */}
        <div className="flex items-start justify-between gap-1.5 sm:gap-2">
          <div className="min-w-0 flex-1">
            <h2 className="truncate text-[12px] font-bold leading-4.5 text-foreground sm:text-lg sm:leading-6">
              {product.name}
            </h2>

            <p className="mt-0.5 text-[7px] font-semibold uppercase tracking-[0.15em] text-muted sm:mt-1 sm:text-[10px]">
              Men&apos;s Wear
            </p>
          </div>

          <p className="shrink-0 text-[12px] font-extrabold leading-5 text-primary sm:text-lg sm:leading-6">
            ৳{product.price}
          </p>
        </div>

        {/* Description */}
        {product.description && (
          <p className="mt-1.5 line-clamp-2 text-[9px] leading-3.5 text-muted sm:mt-2.5 sm:text-sm sm:leading-5">
            {product.description}
          </p>
        )}

        {/* Size Selection */}
        <div className="mt-auto pt-3 sm:pt-5">
          <div className="flex items-center justify-between gap-2">
            <p className="text-[9px] font-bold text-foreground sm:text-sm">
              Size
            </p>

            {selectedInventory && (
              <p className="text-[8px] font-medium text-muted sm:text-xs">
                {selectedInventory.stock} available
              </p>
            )}
          </div>

          {/* Size Buttons */}
          <div className="mt-1.5 flex flex-wrap gap-1 sm:mt-2 sm:gap-2">
            {availableSizes.map((inventory) => {
              const isSelected =
                selectedSize === inventory.size;

              return (
                <button
                  key={inventory.id}
                  type="button"
                  onClick={() =>
                    setSelectedSize(inventory.size)
                  }
                  aria-pressed={isSelected}
                  className={`h-7 min-w-8 rounded-md border px-1.5 text-[9px] font-bold leading-none transition-colors duration-200 active:scale-95 sm:h-10 sm:min-w-11 sm:rounded-lg sm:px-2.5 sm:text-xs ${
                    isSelected
                      ? "border-primary bg-primary text-white"
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
            className="mt-2.5 h-9 w-full rounded-lg bg-primary px-2 text-[9px] font-bold text-white shadow-sm transition-colors duration-200 hover:bg-primary-hover hover:shadow-md active:scale-[0.98] sm:mt-4 sm:h-11 sm:rounded-xl sm:px-4 sm:text-sm"
          >
            Select Product
          </button>
        </div>
      </div>
    </article>
  );
}
