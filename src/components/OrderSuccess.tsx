"use client";

interface OrderSuccessProps {
  orderId: number;
  onClose: () => void;
}

export default function OrderSuccess({
  orderId,
  onClose,
}: OrderSuccessProps) {
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-3 sm:p-4">
      <div className="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl">
        <div className="px-5 pb-7 pt-8 text-center sm:px-8 sm:pb-8 sm:pt-10">
          {/* Success Icon */}
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-50 text-2xl font-bold text-green-600 ring-8 ring-green-50/70 sm:h-20 sm:w-20 sm:text-3xl">
            ✓
          </div>

          <p className="mt-6 text-xs font-bold uppercase tracking-[0.2em] text-primary">
            Order Confirmed
          </p>

          <h2 className="mt-2 text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
            Order Placed Successfully
          </h2>

          <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-muted">
            ধন্যবাদ! আপনার অর্ডারটি সফলভাবে নেওয়া হয়েছে।
            আমাদের টিম শিগগিরই আপনার সাথে যোগাযোগ করবে।
          </p>

          {/* Order ID */}
          <div className="mt-6 rounded-xl border border-border bg-background px-4 py-4">
            <p className="text-xs font-semibold text-muted">
              Your Order ID
            </p>

            <p className="mt-1 text-xl font-extrabold text-primary">
              #{orderId}
            </p>
          </div>

          {/* COD Info */}
          <div className="mt-4 rounded-xl border border-border bg-white px-4 py-4 text-left">
            <div className="flex items-start gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 font-bold text-primary">
                ৳
              </div>

              <div>
                <p className="text-sm font-bold text-foreground">
                  Cash on Delivery
                </p>

                <p className="mt-1 text-xs leading-5 text-muted">
                  পণ্য হাতে পাওয়ার সময় পেমেন্ট করবেন।
                </p>
              </div>
            </div>
          </div>

          {/* Continue Shopping */}
          <button
            type="button"
            onClick={onClose}
            className="mt-6 min-h-12 w-full rounded-xl bg-primary px-4 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-primary-hover active:scale-[0.99]"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    </div>
  );
}