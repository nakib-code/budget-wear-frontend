"use client";

import { FormEvent, useMemo, useState } from "react";

import { CartItem } from "@/types/cart";
import { createOrder } from "@/services/order.service";

interface OrderFormProps {
  items: CartItem[];
  onClose: () => void;
  onSuccess: (orderId: number) => void;
}

export default function OrderForm({
  items,
  onClose,
  onSuccess,
}: OrderFormProps) {
  const [customerName, setCustomerName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const totalAmount = useMemo(
    () =>
      items.reduce(
        (total, item) =>
          total + Number(item.price) * item.quantity,
        0,
      ),
    [items],
  );

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    setError("");

    if (customerName.trim().length < 2) {
      setError("Please enter your full name.");
      return;
    }

    if (phone.trim().length < 11) {
      setError("Please enter a valid phone number.");
      return;
    }

    if (address.trim().length < 5) {
      setError("Please enter your full delivery address.");
      return;
    }

    if (items.length < 3) {
      setError(
        "Please select at least 3 different products.",
      );
      return;
    }

    try {
      setLoading(true);

      const response = await createOrder({
        customerName: customerName.trim(),
        phone: phone.trim(),
        address: address.trim(),
        items,
      });

      onSuccess(response.data.id);
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Failed to place order.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 p-3 sm:p-4">
      <div className="flex min-h-full items-end justify-center sm:items-center">
        <div className="w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl">
          {/* Header */}
          <div className="sticky top-0 z-10 flex items-center justify-between border-b border-border bg-white px-4 py-4 sm:px-6">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-primary sm:text-xs">
                Cash on Delivery
              </p>

              <h2 className="mt-1 text-lg font-extrabold text-foreground sm:text-2xl">
                Place Your Order
              </h2>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-background text-xl text-muted transition hover:text-foreground active:scale-95"
              aria-label="Close order form"
            >
              ×
            </button>
          </div>

          <div className="max-h-[calc(100vh-2rem)] overflow-y-auto px-4 pb-5 sm:px-6 sm:pb-6">
            {/* Selected Products */}
            <section className="pt-5">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-foreground">
                  Selected Products
                </h3>

                <span className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-bold text-primary">
                  {items.length} items
                </span>
              </div>

              <div className="mt-3 space-y-2">
                {items.map((item) => (
                  <div
                    key={`${item.productId}-${item.size}`}
                    className="flex items-center justify-between gap-3 rounded-xl border border-border bg-background p-3"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-foreground">
                        {item.productName}
                      </p>

                      <p className="mt-1 text-xs text-muted">
                        Size {item.size}
                      </p>
                    </div>

                    <p className="shrink-0 text-sm font-bold text-foreground">
                      ৳{item.price}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-4 flex items-center justify-between rounded-xl bg-primary/5 px-4 py-3">
                <span className="text-sm font-semibold text-foreground">
                  Total Amount
                </span>

                <span className="text-lg font-extrabold text-primary">
                  ৳{totalAmount}
                </span>
              </div>
            </section>

            {/* Error */}
            {error && (
              <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium leading-5 text-red-600">
                {error}
              </div>
            )}

            {/* Form */}
            <form
              onSubmit={handleSubmit}
              className="mt-6 space-y-4"
            >
              <div>
                <label
                  htmlFor="customer-name"
                  className="mb-2 block text-sm font-semibold text-foreground"
                >
                  Full Name
                </label>

                <input
                  id="customer-name"
                  type="text"
                  required
                  autoComplete="name"
                  value={customerName}
                  onChange={(event) =>
                    setCustomerName(event.target.value)
                  }
                  placeholder="আপনার পুরো নাম"
                  className="h-12 w-full rounded-xl border border-border bg-white px-4 text-sm outline-none transition focus:border-primary"
                />
              </div>

              <div>
                <label
                  htmlFor="customer-phone"
                  className="mb-2 block text-sm font-semibold text-foreground"
                >
                  Phone Number
                </label>

                <input
                  id="customer-phone"
                  type="tel"
                  inputMode="numeric"
                  required
                  autoComplete="tel"
                  value={phone}
                  onChange={(event) =>
                    setPhone(event.target.value)
                  }
                  placeholder="01XXXXXXXXX"
                  className="h-12 w-full rounded-xl border border-border bg-white px-4 text-sm outline-none transition focus:border-primary"
                />
              </div>

              <div>
                <label
                  htmlFor="delivery-address"
                  className="mb-2 block text-sm font-semibold text-foreground"
                >
                  Delivery Address
                </label>

                <textarea
                  id="delivery-address"
                  rows={4}
                  required
                  autoComplete="street-address"
                  value={address}
                  onChange={(event) =>
                    setAddress(event.target.value)
                  }
                  placeholder="আপনার সম্পূর্ণ ডেলিভারি ঠিকানা"
                  className="w-full resize-none rounded-xl border border-border bg-white px-4 py-3 text-sm leading-6 outline-none transition focus:border-primary"
                />
              </div>

              {/* Payment */}
              <div className="rounded-xl border border-border bg-background p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 font-bold text-primary">
                    ৳
                  </div>

                  <div>
                    <p className="text-sm font-bold text-foreground">
                      Cash on Delivery
                    </p>

                    <p className="mt-0.5 text-xs text-muted">
                      পণ্য হাতে পেয়ে পেমেন্ট করুন
                    </p>
                  </div>
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="min-h-12 w-full rounded-xl bg-primary px-4 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-primary-hover active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading
                  ? "Placing Order..."
                  : `Place Order · ৳${totalAmount}`}
              </button>

              <p className="text-center text-[11px] leading-4 text-muted">
                অর্ডার কনফার্ম করার পর আমাদের টিম আপনার সাথে
                যোগাযোগ করবে।
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}