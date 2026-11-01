"use client";

import { useMemo, useState } from "react";
import { Search, X } from "lucide-react";
import { useSession } from "@/components/RoleProvider";
import { PageHeader, StatusBadge, Toast } from "@/components/ui";
import { CATEGORIES, REPORTS, USERS } from "@/lib/mock-data";
import type { Report, ReportStatus } from "@/lib/types";

const STATUS_OPTIONS: { v: ReportStatus; l: string }[] = [
  { v: "PENDING_VERIFICATION", l: "Menunggu verifikasi" },
  { v: "APPROVED", l: "Dipublikasikan" },
  { v: "NEED_REVISION", l: "Perlu revisi" },
  { v: "REJECTED", l: "Ditolak" },
  { v: "RESOLVED", l: "Selesai" },
];

export default function DashboardPage() {
  const { user } = useSession();
  const [reports, setReports] = useState<Report[]>(REPORTS);
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("");
  const [status, setStatus] = useState("");
  const [type, setType] = useState("");
  const [claimFor, setClaimFor] = useState<Report | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const role = user!.role;
  const staff = role !== "CIVITAS";

  // UC-03: Civitas hanya melihat laporan terpublikasi + laporan miliknya (proyeksi publik).
  const visible = useMemo(() => {
    return reports.filter((r) => {
      if (!staff && r.status !== "APPROVED" && r.status !== "RESOLVED" && r.reporter !== user!.name) return false;
      if (q && !`${r.title} ${r.location} ${r.id}`.toLowerCase().includes(q.toLowerCase())) return false;
      if (cat && r.category !== cat) return false;
      if (status && r.status !== status) return false;
      if (type && r.type !== type) return false;
      return true;
    });
  }, [reports, q, cat, status, type, staff, user]);

  const mine = reports.filter((r) => r.reporter === user!.name);
  const stats =
    role === "CIVITAS"
      ? [
          { l: "Laporan saya", v: mine.length },
          { l: "Menunggu verifikasi", v: mine.filter((r) => r.status === "PENDING_VERIFICATION").length },
          { l: "Perlu revisi", v: mine.filter((r) => r.status === "NEED_REVISION").length },
          { l: "Barang kembali", v: mine.filter((r) => r.status === "RESOLVED").length },
        ]
      : role === "PETUGAS"
      ? [
          { l: "Antrean moderasi", v: reports.filter((r) => r.status === "PENDING_VERIFICATION").length },
          { l: "Klaim perlu ditinjau", v: 2 },
          { l: "Perlu revisi", v: reports.filter((r) => r.status === "NEED_REVISION").length },
          { l: "Selesai", v: reports.filter((r) => r.status === "RESOLVED").length },
        ]
      : [
          { l: "Akun terdaftar", v: USERS.length },
          { l: "Akun nonaktif", v: USERS.filter((u) => !u.active).length },
          { l: "Total laporan", v: reports.length },
          { l: "Event audit hari ini", v: 9 },
        ];

  // UC-05: moderasi. Pada versi final, backend mencatat audit event.
  const moderate = (id: string, next: ReportStatus, label: string) => {
    setReports((rs) => rs.map((r) => (r.id === id ? { ...r, status: next } : r)));
    setToast(`${id}: ${label}. Keputusan dicatat di activity log.`);
  };

  return (
    <>
      <PageHeader
        title={`Halo, ${user!.name.split(" ")[0]}`}
        desc={
          role === "CIVITAS"
            ? "Cari barang Anda atau laporkan temuan. Detail pribadi dan ciri khusus barang tidak ditampilkan di sini."
            : role === "PETUGAS"
            ? "Moderasi laporan baru dan tinjau klaim yang masuk."
            : "Ringkasan akun dan aktivitas sistem."
        }
      />

      <dl className="mb-8 grid grid-cols-2 gap-3 lg:grid-cols-4">
        {stats.map((s) => (
          <div key={s.l} className="rounded-lg border border-slate-200 bg-white p-4">
            <dt className="text-sm text-slate-500">{s.l}</dt>
            <dd className="mt-1 text-3xl font-semibold tabular-nums">{s.v}</dd>
          </div>
        ))}
      </dl>

      <section aria-labelledby="daftar" className="rounded-lg border border-slate-200 bg-white">
        <div className="border-b border-slate-200 p-4">
          <h2 id="daftar" className="mb-3 font-semibold">Daftar laporan</h2>
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr_1fr]">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-slate-400" aria-hidden />
              <input className="input pl-9" placeholder="Cari judul, lokasi, atau ID" aria-label="Cari laporan" value={q} onChange={(e) => setQ(e.target.value.slice(0, 80))} />
            </div>
            <select className="input" aria-label="Filter jenis" value={type} onChange={(e) => setType(e.target.value)}>
              <option value="">Semua jenis</option>
              <option value="LOST">Hilang</option>
              <option value="FOUND">Temuan</option>
            </select>
            <select className="input" aria-label="Filter kategori" value={cat} onChange={(e) => setCat(e.target.value)}>
              <option value="">Semua kategori</option>
              {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
            </select>
            <select className="input" aria-label="Filter status" value={status} onChange={(e) => setStatus(e.target.value)}>
              <option value="">Semua status</option>
              {STATUS_OPTIONS.map((s) => <option key={s.v} value={s.v}>{s.l}</option>)}
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px]">
            <thead className="bg-slate-50">
              <tr>
                {["ID", "Jenis", "Barang", "Kategori", "Lokasi", "Tanggal", "Status", ""].map((h) => (
                  <th key={h} className="px-4 py-2.5 text-left text-xs font-semibold text-slate-500">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {visible.map((r) => (
                <tr key={r.id}>
                  <td className="px-4 py-3 text-sm font-medium tabular-nums">{r.id}</td>
                  <td className="px-4 py-3 text-sm">{r.type === "LOST" ? "Hilang" : "Temuan"}</td>
                  <td className="px-4 py-3 text-sm font-medium">{r.title}</td>
                  <td className="px-4 py-3 text-sm text-slate-600">{r.category}</td>
                  <td className="px-4 py-3 text-sm text-slate-600">{r.location}</td>
                  <td className="px-4 py-3 text-sm tabular-nums text-slate-600">
                    {new Date(r.date).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}
                  </td>
                  <td className="px-4 py-3 text-sm"><StatusBadge status={r.status} /></td>
                  <td className="px-4 py-3 text-sm">
                    <div className="flex justify-end gap-1.5">
                      {role === "CIVITAS" && r.type === "FOUND" && r.status === "APPROVED" && (
                        <button className="btn-primary px-3 py-1.5 text-xs" onClick={() => setClaimFor(r)}>Ajukan klaim</button>
                      )}
                      {role === "PETUGAS" && r.status === "PENDING_VERIFICATION" && (
                        <>
                          <button className="btn-primary px-3 py-1.5 text-xs" onClick={() => moderate(r.id, "APPROVED", "disetujui")}>Setujui</button>
                          <button className="btn-outline px-3 py-1.5 text-xs" onClick={() => moderate(r.id, "NEED_REVISION", "dikembalikan untuk revisi")}>Revisi</button>
                          <button className="btn-outline px-3 py-1.5 text-xs" onClick={() => moderate(r.id, "REJECTED", "ditolak")}>Tolak</button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {visible.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-4 py-10 text-center text-sm text-slate-500">
                    Tidak ada laporan yang cocok. Ubah kata kunci atau filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {claimFor && (
        <ClaimDialog
          report={claimFor}
          onClose={() => setClaimFor(null)}
          onDone={(m) => { setClaimFor(null); setToast(m); }}
        />
      )}
      <Toast message={toast} onClose={() => setToast(null)} />
    </>
  );
}

// UC-04: klaim + bukti privat. Bukti dikirim ke backend dan disimpan sebagai objek privat di MinIO.
function ClaimDialog({ report, onClose, onDone }: { report: Report; onClose: () => void; onDone: (m: string) => void }) {
  const [reason, setReason] = useState("");
  const [proof, setProof] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [err, setErr] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (reason.trim().length < 20) return setErr("Jelaskan alasan klaim minimal 20 karakter.");
    if (proof.trim().length < 10) return setErr("Tuliskan ciri khusus yang hanya diketahui pemilik.");
    if (file && !["image/jpeg", "image/png", "image/webp", "application/pdf"].includes(file.type)) return setErr("Berkas bukti harus JPG, PNG, WEBP, atau PDF.");
    if (file && file.size > 5 * 1024 * 1024) return setErr("Ukuran berkas bukti maksimal 5 MB.");
    onDone(`Klaim untuk ${report.id} terkirim dengan status PENDING. Petugas akan meninjau bukti Anda.`);
  };

  return (
    <div className="fixed inset-0 z-40 grid place-items-center bg-black/40 p-4" role="dialog" aria-modal="true" aria-labelledby="claim-title">
      <form onSubmit={submit} className="w-full max-w-lg space-y-4 rounded-lg border border-slate-200 bg-white p-6 shadow-xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 id="claim-title" className="text-lg font-semibold">Ajukan klaim {report.id}</h2>
            <p className="text-sm text-slate-600">{report.title}</p>
          </div>
          <button type="button" onClick={onClose} aria-label="Tutup" className="rounded p-1 text-slate-500 hover:bg-slate-100">
            <X className="h-4 w-4" />
          </button>
        </div>
        <div>
          <label htmlFor="reason" className="label">Alasan klaim</label>
          <textarea id="reason" rows={3} className="input" value={reason} onChange={(e) => setReason(e.target.value)} />
        </div>
        <div>
          <label htmlFor="proof" className="label">Ciri khusus barang (bukti privat)</label>
          <textarea id="proof" rows={3} className="input" value={proof} onChange={(e) => setProof(e.target.value)} />
          <p className="hint">Hanya dilihat petugas. Tidak pernah ditampilkan ke publik.</p>
        </div>
        <div>
          <label htmlFor="file" className="label">Berkas pendukung (opsional)</label>
          <input id="file" type="file" accept=".jpg,.jpeg,.png,.webp,.pdf" className="input" onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
        </div>
        {err && <p role="alert" className="err">{err}</p>}
        <div className="flex justify-end gap-2">
          <button type="button" className="btn-outline" onClick={onClose}>Batal</button>
          <button type="submit" className="btn-primary">Kirim klaim</button>
        </div>
      </form>
    </div>
  );
}