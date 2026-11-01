"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { useSession } from "@/components/RoleProvider";
import { PageHeader, RoleBadge } from "@/components/ui";
import { AUDIT_LOGS } from "@/lib/mock-data";

const TH = "px-4 py-2.5 text-left text-xs font-semibold text-slate-500";
const TD = "px-4 py-3 text-sm";

export default function ActivityLogPage() {
  const { user } = useSession();
  const [q, setQ] = useState("");
  const [action, setAction] = useState("");
  const isAdmin = user!.role === "SUPER_ADMIN";

  // UC-08: Super Admin membaca seluruh audit. UC-09: peran lain hanya melihat riwayat miliknya.
  const base = useMemo(
    () => (isAdmin ? AUDIT_LOGS : AUDIT_LOGS.filter((l) => l.actor === user!.name)),
    [isAdmin, user]
  );
  const actions = useMemo(() => Array.from(new Set(base.map((l) => l.action))), [base]);
  const rows = base.filter(
    (l) =>
      (!action || l.action === action) &&
      (!q || `${l.actor} ${l.object} ${l.meta}`.toLowerCase().includes(q.toLowerCase()))
  );

  return (
    <>
      <PageHeader
        title={isAdmin ? "Activity log" : "Riwayat aktivitas saya"}
        desc={
          isAdmin
            ? "Catatan tindakan penting untuk penelusuran dan audit. Metadata tidak memuat kata sandi, token, atau isi bukti klaim."
            : "Riwayat laporan dan klaim yang terkait dengan akun Anda."
        }
      />
      <div className="rounded-lg border border-slate-200 bg-white">
        <div className="grid gap-2 border-b border-slate-200 p-4 sm:grid-cols-[2fr_1fr]">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-slate-400" aria-hidden />
            <input
              className="input pl-9"
              placeholder="Cari pelaku, objek, atau metadata"
              aria-label="Cari log"
              value={q}
              onChange={(e) => setQ(e.target.value.slice(0, 80))}
            />
          </div>
          <select className="input" aria-label="Filter aksi" value={action} onChange={(e) => setAction(e.target.value)}>
            <option value="">Semua aksi</option>
            {actions.map((a) => <option key={a}>{a}</option>)}
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px]">
            <thead className="bg-slate-50">
              <tr>{["Waktu", "Pelaku", "Peran", "Aksi", "Objek", "Metadata"].map((h) => <th key={h} className={TH}>{h}</th>)}</tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {rows.map((l) => (
                <tr key={l.id}>
                  <td className={`${TD} whitespace-nowrap tabular-nums text-slate-600`}>
                    {new Date(l.time).toLocaleString("id-ID", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" })}
                  </td>
                  <td className={`${TD} font-medium`}>{l.actor}</td>
                  <td className={TD}><RoleBadge role={l.role} /></td>
                  <td className={`${TD} font-mono text-xs`}>{l.action}</td>
                  <td className={`${TD} tabular-nums`}>{l.object}</td>
                  <td className={`${TD} text-slate-600`}>{l.meta}</td>
                </tr>
              ))}
              {rows.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-10 text-center text-sm text-slate-500">
                    Belum ada aktivitas yang cocok.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}