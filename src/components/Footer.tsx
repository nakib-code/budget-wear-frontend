import Image from "next/image";

export default function Footer() {
  return (
    <footer className="border-t border-border bg-white">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10">
        <div className="grid grid-cols-1 gap-7 sm:grid-cols-3 sm:gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2.5">
              <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-lg sm:h-11 sm:w-11 sm:rounded-xl">
                <Image
                  src="/web-app-manifest-192x192.png"
                  alt="Budget Wear logo"
                  width={44}
                  height={44}
                  className="h-full w-full object-contain"
                  priority
                />
              </div>

              <div>
                <p className="text-base font-extrabold tracking-[0.08em] text-foreground">
                  Budget wear
                </p>

                <p className="text-[9px] font-medium uppercase tracking-[0.18em] text-muted">
                  Men&apos;s Wear
                </p>
              </div>
            </div>

            <p className="mt-3 max-w-xs text-xs leading-5 text-muted sm:text-sm sm:leading-6">
              Premium men&apos;s shirts with easy ordering, Cash on Delivery and
              convenient exchange.
            </p>
          </div>

          {/* Customer Promise */}
          <div>
            <h3 className="text-sm font-bold text-foreground">
              Customer Service
            </h3>

            <div className="mt-3 space-y-2.5 text-xs text-muted sm:text-sm">
              <p>Cash on Delivery</p>
              <p>ঢাকায় ২৪ ঘণ্টায় ডেলিভারি</p>
              <p>Easy Exchange</p>
            </div>
          </div>

          {/* Order Info */}
          <div>
            <h3 className="text-sm font-bold text-foreground">
              Order Information
            </h3>

            <p className="mt-3 text-xs leading-5 text-muted sm:text-sm sm:leading-6">
              যেকোনো ৩ পিস বা তার বেশি শার্ট সিলেক্ট করে আপনার অর্ডার সম্পন্ন
              করুন।
            </p>
          </div>
        </div>

        <div className="mt-7 border-t border-border pt-5 text-center sm:mt-8 sm:pt-6">
          <p className="text-[11px] text-muted sm:text-xs">
            © {new Date().getFullYear()} Budget wear. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
