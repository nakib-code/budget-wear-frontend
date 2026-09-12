"use client";

interface AdminHeaderProps {
  onMenuClick: () => void;
}

export default function AdminHeader({
  onMenuClick,
}: AdminHeaderProps) {
  return (
    <header className="sticky top-0 z-30 border-b border-border bg-white/95 backdrop-blur-md">
      <div className="flex min-h-16 items-center justify-between px-4 sm:px-6">
        <button
          type="button"
          onClick={onMenuClick}
          className="flex h-10 w-10 items-center justify-center rounded-lg border border-border text-lg text-foreground transition hover:border-primary hover:text-primary lg:hidden"
          aria-label="Open menu"
        >
          ☰
        </button>

        <div className="ml-auto flex items-center gap-3">
          <div className="hidden text-right sm:block">
            <p className="text-sm font-semibold text-foreground">
              Administrator
            </p>

            <p className="text-xs text-muted">
              Store Management
            </p>
          </div>

          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-sm font-bold text-white">
            A
          </div>
        </div>
      </div>
    </header>
  );
}