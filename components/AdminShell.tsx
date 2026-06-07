"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

type AdminShellProps = {
  title: string;
  description: string;
  children: React.ReactNode;
};

const links = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/upload", label: "Excel Import" },
  { href: "/admin/manage", label: "Manage Data" },
  { href: "/admin/requests", label: "Request Logs" },
];

export function AdminShell({ title, description, children }: AdminShellProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [isSigningOut, setIsSigningOut] = useState(false);

  async function handleLogout() {
    setIsSigningOut(true);
    await fetch("/api/admin/logout", { method: "POST" });
    router.refresh();
    window.location.href = "/admin";
  }

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,#dcfce7_0%,transparent_25%),linear-gradient(180deg,#f5fff8_0%,#ecfdf3_42%,#ffffff_100%)]">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 rounded-[2rem] border border-emerald-200/80 bg-white/95 p-6 shadow-[0_24px_80px_-38px_rgba(22,101,52,0.22)] lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.22em] text-emerald-700">
              Genom Data Admin
            </p>
            <h1 className="mt-2 text-3xl font-semibold text-emerald-950">{title}</h1>
            <p className="mt-2 max-w-2xl text-sm text-emerald-900/70">{description}</p>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            disabled={isSigningOut}
            className="rounded-2xl border border-emerald-200 bg-white px-4 py-2.5 text-sm font-medium text-emerald-800 transition hover:bg-emerald-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSigningOut ? "Signing out..." : "Sign Out"}
          </button>
        </div>

        <div className="grid gap-6 lg:grid-cols-[220px_minmax(0,1fr)]">
          <aside className="rounded-[2rem] border border-emerald-200/80 bg-white/95 p-4 shadow-[0_20px_60px_-40px_rgba(22,101,52,0.25)]">
            <nav className="space-y-2">
              {links.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`block rounded-2xl px-4 py-3 text-sm font-medium transition ${
                      isActive
                        ? "bg-emerald-700 text-white shadow-sm"
                        : "text-emerald-900 hover:bg-emerald-50"
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>
          </aside>
          <section className="min-w-0">{children}</section>
        </div>
      </div>
    </main>
  );
}
