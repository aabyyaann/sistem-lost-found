"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { FilePlus2, LayoutDashboard, LogOut, ScrollText, ShieldCheck, UserCircle } from "lucide-react";
import type { Role } from "@/lib/types";
import { ROLE_LABEL } from "@/lib/rbac";
import { useSession } from "./RoleProvider";

const NAV: { href: string; label: string; icon: typeof LayoutDashboard; roles: Role[] }[] = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard, roles: ["CIVITAS", "PETUGAS", "SUPER_ADMIN"] },
  { href: "/laporan/baru", label: "Input laporan", icon: FilePlus2, roles: ["CIVITAS"] },
  { href: "/activity-log", label: "Activity log", icon: ScrollText, roles: ["CIVITAS", "PETUGAS", "SUPER_ADMIN"] },
  { href: "/hak-akses", label: "Hak akses", icon: ShieldCheck, roles: ["SUPER_ADMIN"] },
  { href: "/profile", label: "Profil", icon: UserCircle, roles: ["CIVITAS", "PETUGAS", "SUPER_ADMIN"] },
];

export function Sidebar() {
  const { user, logout } = useSession();
  const pathname = usePathname();
  const router = useRouter();
  if (!user) return null;
  const items = NAV.filter((n) => n.roles.includes(user.role));

  const doLogout = () => {
    logout();
    router.replace("/login");
  };

  return (
    <>
      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-r border-slate-200 bg-white md:flex">
        <div className="border-b border-slate-200 px-5 py-5">
          <div className="flex items-center gap-2.5">
            <span className="grid h-8 w-8 place-items-center rounded-md bg-brand-600 text-sm font-bold text-white">LF</span>
            <div className="leading-tight">
              <p className="text-sm font-semibold">Lost &amp; Found</p>
              <p className="text-xs text-slate-500">Fakultas Teknik Elektro</p>
            </div>
          </div>
        </div>
        <nav className="flex-1 space-y-1 p-3" aria-label="Menu utama">
          {items.map(({ href, label, icon: Icon }) => {
            const active = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                aria-current={active ? "page" : undefined}
                className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors ${active ? "bg-brand-50 text-brand-700" : "text-slate-600 hover:bg-slate-100"}`}
              >
                <Icon className="h-4 w-4" aria-hidden /> {label}
              </Link>
            );
          })}
        </nav>
        <div className="border-t border-slate-200 p-4">
          <p className="truncate text-sm font-medium">{user.name}</p>
          <p className="mb-3 text-xs text-slate-500">{ROLE_LABEL[user.role]}</p>
          <button onClick={doLogout} className="btn-outline w-full px-3 py-1.5 text-xs">
            <LogOut className="h-3.5 w-3.5" aria-hidden /> Keluar
          </button>
        </div>
      </aside>

      <header className="border-b border-slate-200 bg-white md:hidden">
        <div className="flex items-center justify-between px-4 py-3">
          <span className="text-sm font-semibold">Lost &amp; Found FTE</span>
          <button onClick={doLogout} className="btn-outline px-3 py-1.5 text-xs">Keluar</button>
        </div>
        <nav className="flex gap-1 overflow-x-auto px-3 pb-2" aria-label="Menu utama">
          {items.map(({ href, label }) => (
            <Link key={href} href={href} className={`whitespace-nowrap rounded-md px-3 py-1.5 text-sm ${pathname === href ? "bg-brand-50 font-medium text-brand-700" : "text-slate-600"}`}>
              {label}
            </Link>
          ))}
        </nav>
      </header>
    </>
  );
}