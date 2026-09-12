export default function InfoBar() {
  return (
    <section className="border-b border-border bg-white">
      <div className="mx-auto max-w-7xl px-3 py-3 sm:px-6 sm:py-4">
        <div className="grid grid-cols-3 overflow-hidden rounded-xl border border-border bg-background shadow-sm sm:rounded-2xl">
          {/* Cash on Delivery */}
          <div className="flex min-w-0 flex-col items-center justify-center px-2 py-3 text-center sm:flex-row sm:gap-3 sm:px-4 sm:py-4 sm:text-left">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm sm:h-10 sm:w-10 sm:text-base">
              ৳
            </div>

            <div className="min-w-0">
              <p className="text-[10px] font-bold leading-4 text-foreground sm:text-sm">
                Cash on Delivery
              </p>

              <p className="mt-0.5 hidden text-[11px] leading-4 text-muted sm:block">
                অর্ডারের পর পেমেন্ট
              </p>
            </div>
          </div>

          {/* Delivery */}
          <div className="flex min-w-0 flex-col items-center justify-center border-x border-border px-2 py-3 text-center sm:flex-row sm:gap-3 sm:px-4 sm:py-4 sm:text-left">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm sm:h-10 sm:w-10 sm:text-base">
              ↗
            </div>

            <div className="min-w-0">
              <p className="text-[10px] font-bold leading-4 text-foreground sm:text-sm">
                ২৪ ঘণ্টায় ডেলিভারি
              </p>

              <p className="mt-0.5 hidden text-[11px] leading-4 text-muted sm:block">
                ঢাকা শহরে
              </p>
            </div>
          </div>

          {/* Exchange */}
          <div className="flex min-w-0 flex-col items-center justify-center px-2 py-3 text-center sm:flex-row sm:gap-3 sm:px-4 sm:py-4 sm:text-left">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm sm:h-10 sm:w-10 sm:text-base">
              ↻
            </div>

            <div className="min-w-0">
              <p className="text-[10px] font-bold leading-4 text-foreground sm:text-sm">
                Easy Exchange
              </p>

              <p className="mt-0.5 hidden text-[11px] leading-4 text-muted sm:block">
                সহজে পরিবর্তন
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}