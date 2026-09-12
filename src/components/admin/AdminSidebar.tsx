"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

interface AdminSidebarProps {
  open: boolean;
  onClose: () => void;
}

const menuItems = [
  {
    label: "Dashboard",
    href: "/admin/dashboard",
    icon: "▦",
  },
  {
    label: "Products",
    href: "/admin/products",
    icon: "□",
  },
  {
    label: "Orders",
    href: "/admin/orders",
    icon: "≡",
  },
  {
    label: "Inventory",
    href: "/admin/inventory",
    icon: "◈",
  },
];

export default function AdminSidebar({
  open,
  onClose,
}: AdminSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    router.replace("/admin/login");
  };

  return (
    <>
      {open && (
        <button
          type="button"
          aria-label="Close sidebar"
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-border bg-white transition-transform duration-300 lg:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-20 items-center border-b border-border px-5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-sm font-extrabold text-white">
            B
          </div>

          <div className="ml-3">
            <p className="text-base font-extrabold tracking-[0.08em] text-foreground">
              Budget wear
            </p>

            <p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-muted">
              Admin Panel
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="ml-auto text-xl text-muted lg:hidden"
            aria-label="Close"
          >
            ×
          </button>
        </div>

        <nav className="flex-1 space-y-1 px-3 py-5">
          {menuItems.map((item) => {
            const isActive =
              pathname === item.href ||
              pathname.startsWith(`${item.href}/`);

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={`flex min-h-11 items-center rounded-xl px-3 text-sm font-semibold transition ${
                  isActive
                    ? "bg-primary text-white"
                    : "text-foreground hover:bg-background hover:text-primary"
                }`}
              >
                <span className="flex w-8 items-center justify-center text-base">
                  {item.icon}
                </span>

                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-border p-3">
          <button
            type="button"
            onClick={handleLogout}
            className="flex min-h-11 w-full items-center rounded-xl px-3 text-sm font-semibold text-foreground transition hover:bg-red-50 hover:text-red-600"
          >
            <span className="flex w-8 items-center justify-center">
              ↪
            </span>

            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
}