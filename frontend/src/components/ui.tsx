"use client";

import { useEffect } from "react";
import { ShieldAlert } from "lucide-react";
import type { ReportStatus, Role } from "@/lib/types";
import { ROLE_LABEL } from "@/lib/rbac";
import { useSession } from "./RoleProvider";

const STATUS_STYLE: Record<ReportStatus, { label: string; cls: string }> = {
  PENDING_VERIFICATION: { label: "Menunggu verifikasi", cls: "bg-amber-50 text-amber-800 ring-amber-200" },
  APPROVED: { label: "Dipublikasikan", cls: "bg-emerald-50 text-emerald-800 ring-emerald-200" },
  NEED_REVISION: { label: "Perlu revisi", cls: "bg-sky-50 text-sky-800 ring-sky-200" },
  REJECTED: { label: "Ditolak", cls: "bg-brand-50 text-brand-700 ring-brand-100" },
  RESOLVED: { label: "Selesai", cls: "bg-slate-100 text-slate-700 ring-slate-200" },
};

export function StatusBadge({ status }: { status: ReportStatus }) {
  const s = STATUS_STYLE[status];
  return <span className={`inline-flex whitespace-nowrap rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${s.cls}`}>{s.label}</span>;
}

export function RoleBadge({ role }: { role: Role }) {
  const cls =
    role === "SUPER_ADMIN" ? "bg-brand-50 text-brand-700 ring-brand-100"
    : role === "PETUGAS" ? "bg-indigo-50 text-indigo-800 ring-indigo-200"
    : "bg-slate-100 text-slate-700 ring-slate-200";
  return <span className={`inline-flex whitespace-nowrap rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${cls}`}>{ROLE_LABEL[role]}</span>;
}

export function PageHeader({ title, desc, action }: { title: string; desc?: string; action?: React.ReactNode }) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
        {desc && <p className="mt-1 max-w-2xl text-sm text-slate-600">{desc}</p>}
      </div>
      {action}
    </div>
  );
}

export function Toast({ message, onClose }: { message: string | null; onClose: () => void }) {
  useEffect(() => {
    if (!message) return;
    const t = setTimeout(onClose, 4000);
    return () => clearTimeout(t);
  }, [message, onClose]);
  if (!message) return null;
  return (
    <div role="status" className="fixed bottom-5 right-5 z-50 max-w-sm rounded-md bg-ink px-4 py-3 text-sm text-white shadow-lg">
      {message}
    </div>
  );
}

export function RoleGuard({ allow, children }: { allow: Role[]; children: React.ReactNode }) {
  const { user } = useSession();
  if (!user) return null;
  if (!allow.includes(user.role)) {
    return (
      <div className="flex max-w-xl items-start gap-3 rounded-lg border border-slate-200 bg-white p-5">
        <ShieldAlert className="mt-0.5 h-5 w-5 shrink-0 text-brand-600" aria-hidden />
        <div>
          <h2 className="font-semibold">Anda tidak punya akses ke halaman ini</h2>
          <p className="mt-1 text-sm text-slate-600">
            Halaman ini hanya untuk {allow.map((r) => ROLE_LABEL[r]).join(", ")}. Backend juga menolak permintaan yang tidak berwenang.
          </p>
        </div>
      </div>
    );
  }
  return <>{children}</>;
}