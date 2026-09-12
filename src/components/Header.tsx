"use client";

import { useState } from "react";
import SizeGuideModal from "@/components/SizeGuideModal";
import Image from "next/image";

export default function Header() {
  const [showSizeGuide, setShowSizeGuide] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-border bg-white/95 backdrop-blur-md">
        <div className="mx-auto flex h-[68px] max-w-7xl items-center justify-between px-4 sm:h-[76px] sm:px-6">
          {/* Brand */}
          <div className="flex min-w-0 items-center">
            <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-lg sm:h-11 sm:w-11 sm:rounded-xl">
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
            </div>

            <div className="ml-2.5 min-w-0 sm:ml-3">
              <p className="truncate text-base font-extrabold tracking-[0.12em] text-foreground sm:text-lg">
                Budget wear
              </p>

              <p className="hidden text-[9px] font-medium uppercase tracking-[0.22em] text-muted sm:block">
                Men&apos;s Wear
              </p>
            </div>
          </div>

          {/* Size Guide */}
          <button
            type="button"
            onClick={() => setShowSizeGuide(true)}
            className="inline-flex min-h-10 items-center gap-2 rounded-lg border border-border bg-white px-3 text-xs font-bold text-foreground transition-all hover:border-primary hover:bg-primary hover:text-white active:scale-[0.97] sm:min-h-11 sm:rounded-xl sm:px-4 sm:text-sm"
          >
            <span className="text-sm sm:text-base">⌘</span>
            <span>Size Guide</span>
          </button>
        </div>
      </header>

      {showSizeGuide && (
        <SizeGuideModal onClose={() => setShowSizeGuide(false)} />
      )}
    </>
  );
}
