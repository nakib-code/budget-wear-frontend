"use client";

interface SelectionModalProps {
  onBuyNow: () => void;
  onSelectMore: () => void;
}

export default function SelectionModal({
  onBuyNow,
  onSelectMore,
}: SelectionModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 p-3 sm:items-center sm:p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-5 shadow-2xl sm:p-6">
        <div className="mx-auto mb-4 h-1.5 w-12 rounded-full bg-border sm:hidden" />

        <h2 className="text-xl font-bold text-foreground sm:text-2xl">
          ৩টি পণ্য সিলেক্ট হয়েছে
        </h2>

        <p className="mt-2 text-sm leading-6 text-muted">
          এখনই অর্ডার করতে পারেন অথবা আরও কিছু পণ্য সিলেক্ট
          করতে পারেন।
        </p>

        <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
          <button
            type="button"
            onClick={onBuyNow}
            className="min-h-12 rounded-xl bg-primary px-4 py-3 text-sm font-bold text-white transition hover:bg-primary-hover active:scale-[0.99]"
          >
            Buy Now
          </button>

          <button
            type="button"
            onClick={onSelectMore}
            className="min-h-12 rounded-xl border border-border px-4 py-3 text-sm font-bold text-foreground transition hover:border-primary hover:text-primary active:scale-[0.99]"
          >
            Select More
          </button>
        </div>
      </div>
    </div>
  );
}