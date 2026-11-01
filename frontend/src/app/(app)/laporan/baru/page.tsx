"use client";

import { useState } from "react";
import Link from "next/link";
import { CheckCircle2, ImagePlus, Info } from "lucide-react";
import { PageHeader, RoleGuard } from "@/components/ui";
import { CATEGORIES } from "@/lib/mock-data";
import type { ReportType } from "@/lib/types";

const MAX_MB = 5;
const ALLOWED = ["image/jpeg", "image/png", "image/webp"];
const EMPTY = { title: "", category: "", location: "", date: "", description: "", privateDetail: "" };

export default function NewReportPage() {
  const [type, setType] = useState<ReportType>("LOST");
  const [f, setF] = useState(EMPTY);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [sent, setSent] = useState(false);
  const today = new Date().toISOString().slice(0, 10);

  const set = (k: keyof typeof EMPTY) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setF((s) => ({ ...s, [k]: e.target.value }));

  const onFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const picked = e.target.files?.[0] ?? null;
    setErrors((x) => ({ ...x, file: "" }));
    if (preview) URL.revokeObjectURL(preview);
    if (!picked) { setFile(null); setPreview(null); return; }
    if (!ALLOWED.includes(picked.type)) {
      setErrors((x) => ({ ...x, file: "Format foto harus JPG, PNG, atau WEBP." }));
      setFile(null); setPreview(null); e.target.value = ""; return;
    }
    if (picked.size > MAX_MB * 1024 * 1024) {
      setErrors((x) => ({ ...x, file: `Ukuran foto maksimal ${MAX_MB} MB.` }));
      setFile(null); setPreview(null); e.target.value = ""; return;
    }
    setFile(picked);
    setPreview(URL.createObjectURL(picked));
  };

  const submit = (ev: React.FormEvent) => {
    ev.preventDefault();
    const e: Record<string, string> = {};
    if (f.title.trim().length < 5) e.title = "Judul minimal 5 karakter.";
    if (!f.category) e.category = "Pilih kategori.";
    if (f.location.trim().length < 3) e.location = "Isi lokasi kehilangan atau penemuan.";
    if (!f.date) e.date = "Pilih tanggal.";
    else if (f.date > today) e.date = "Tanggal tidak boleh di masa depan.";
    if (f.description.trim().length < 10) e.description = "Deskripsi minimal 10 karakter.";
    if (type === "FOUND" && !file) e.file = "Foto wajib untuk laporan barang temuan.";
    setErrors(e);
    if (Object.keys(e).length) return;
    // TODO: POST multipart ke /api/items. Backend memvalidasi ulang (class-validator, MIME, ukuran, konten),
    // menyimpan foto ke MinIO, status awal PENDING_VERIFICATION, lalu menulis audit event.
    setSent(true);
  };

  const reset = () => {
    setSent(false); setF(EMPTY); setFile(null); setPreview(null); setErrors({});
  };

  if (sent) {
    return (
      <RoleGuard allow={["CIVITAS"]}>
        <div className="max-w-xl rounded-lg border border-slate-200 bg-white p-6">
          <CheckCircle2 className="h-8 w-8 text-emerald-600" aria-hidden />
          <h1 className="mt-3 text-xl font-semibold">Laporan terkirim</h1>
          <p className="mt-1 text-sm text-slate-600">
            Status laporan: Menunggu verifikasi. Petugas akan memeriksa sebelum laporan dipublikasikan. Anda bisa memantau statusnya di dashboard.
          </p>
          <div className="mt-5 flex gap-2">
            <Link href="/dashboard" className="btn-primary">Ke dashboard</Link>
            <button className="btn-outline" onClick={reset}>Buat laporan lain</button>
          </div>
        </div>
      </RoleGuard>
    );
  }

  return (
    <RoleGuard allow={["CIVITAS"]}>
      <PageHeader title="Input laporan" desc="Laporkan barang yang hilang atau yang Anda temukan di lingkungan FTE." />
      <form onSubmit={submit} noValidate className="grid max-w-5xl gap-6 lg:grid-cols-[1.4fr_1fr]">
        <div className="space-y-5 rounded-lg border border-slate-200 bg-white p-5">
          <fieldset>
            <legend className="label">Jenis laporan</legend>
            <div className="grid grid-cols-2 gap-2">
              {([["LOST", "Barang hilang"], ["FOUND", "Barang temuan"]] as const).map(([v, l]) => (
                <label key={v} className={`cursor-pointer rounded-md border px-3 py-2.5 text-center text-sm font-medium ${type === v ? "border-brand-500 bg-brand-50 text-brand-700" : "border-slate-300 text-slate-600"}`}>
                  <input type="radio" name="type" value={v} checked={type === v} onChange={() => setType(v)} className="sr-only" />
                  {l}
                </label>
              ))}
            </div>
          </fieldset>

          <div>
            <label htmlFor="title" className="label">Judul</label>
            <input id="title" className="input" maxLength={100} placeholder="Contoh: Dompet kulit warna cokelat" value={f.title} onChange={set("title")} />
            {errors.title && <p className="err">{errors.title}</p>}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="category" className="label">Kategori</label>
              <select id="category" className="input" value={f.category} onChange={set("category")}>
                <option value="">Pilih kategori</option>
                {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
              </select>
              {errors.category && <p className="err">{errors.category}</p>}
            </div>
            <div>
              <label htmlFor="date" className="label">{type === "LOST" ? "Tanggal kehilangan" : "Tanggal ditemukan"}</label>
              <input id="date" type="date" max={today} className="input" value={f.date} onChange={set("date")} />
              {errors.date && <p className="err">{errors.date}</p>}
            </div>
          </div>

          <div>
            <label htmlFor="location" className="label">Lokasi</label>
            <input id="location" className="input" maxLength={120} placeholder="Contoh: Gedung N, lantai 2" value={f.location} onChange={set("location")} />
            {errors.location && <p className="err">{errors.location}</p>}
          </div>

          <div>
            <label htmlFor="description" className="label">Deskripsi publik</label>
            <textarea id="description" rows={3} maxLength={500} className="input" value={f.description} onChange={set("description")} />
            <p className="hint">Tampil di hasil pencarian. Jangan tulis nomor kartu, alamat, atau ciri yang hanya diketahui pemilik.</p>
            {errors.description && <p className="err">{errors.description}</p>}
          </div>

          <div>
            <label htmlFor="priv" className="label">Ciri khusus (privat, opsional)</label>
            <textarea id="priv" rows={2} maxLength={500} className="input" value={f.privateDetail} onChange={set("privateDetail")} />
            <p className="hint">Hanya dilihat petugas untuk mencocokkan klaim. Tidak pernah ditampilkan ke publik.</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-lg border border-slate-200 bg-white p-5">
            <p className="label">Foto barang {type === "FOUND" ? "(wajib)" : "(opsional)"}</p>
            <label htmlFor="photo" className="grid cursor-pointer place-items-center gap-2 rounded-md border border-dashed border-slate-300 bg-slate-50 p-5 text-center text-sm text-slate-600 hover:border-brand-500">
              {preview ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={preview} alt="Pratinjau foto barang" className="max-h-48 rounded" />
              ) : (
                <>
                  <ImagePlus className="h-6 w-6 text-slate-400" aria-hidden />
                  <span>Pilih foto JPG, PNG, atau WEBP</span>
                </>
              )}
            </label>
            <input id="photo" type="file" accept="image/jpeg,image/png,image/webp" className="sr-only" onChange={onFile} />
            <p className="hint">Maksimal {MAX_MB} MB. Server memeriksa ulang tipe dan isi berkas.</p>
            {errors.file && <p className="err">{errors.file}</p>}
          </div>

          <div className="flex gap-2 rounded-md border border-sky-200 bg-sky-50 p-3 text-sm text-sky-900">
            <Info className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
            Setelah dikirim, laporan berstatus &quot;Menunggu verifikasi&quot; sampai petugas menyetujuinya.
          </div>

          <button type="submit" className="btn-primary w-full">Kirim laporan</button>
        </div>
      </form>
    </RoleGuard>
  );
}