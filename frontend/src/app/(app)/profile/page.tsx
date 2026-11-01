"use client";

import { useState } from "react";
import { Monitor } from "lucide-react";
import { useSession } from "@/components/RoleProvider";
import { PageHeader, RoleBadge, Toast } from "@/components/ui";

const PANEL = "rounded-lg border border-slate-200 bg-white";

export default function ProfilePage() {
  const { user } = useSession();
  const [name, setName] = useState(user!.name);
  const [phone, setPhone] = useState("");
  const [unit, setUnit] = useState("S1 Teknik Komputer");
  const [pw, setPw] = useState({ current: "", next: "", confirm: "" });
  const [pwErr, setPwErr] = useState("");
  const [toast, setToast] = useState<string | null>(null);
  const [sessions, setSessions] = useState([
    { id: 1, device: "Chrome di Windows", info: "Sesi ini", current: true },
    { id: 2, device: "Safari di iPhone", info: "Terakhir aktif kemarin", current: false },
  ]);

  const saveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim().length < 3) return setToast("Nama minimal 3 karakter.");
    // TODO: PATCH /api/me (backend memvalidasi dan mencatat audit event).
    setToast("Profil disimpan.");
  };

  const savePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pw.current) return setPwErr("Isi kata sandi saat ini.");
    if (pw.next.length < 12) return setPwErr("Kata sandi baru minimal 12 karakter.");
    if (!/[A-Za-z]/.test(pw.next) || !/\d/.test(pw.next)) return setPwErr("Gunakan kombinasi huruf dan angka.");
    if (pw.next !== pw.confirm) return setPwErr("Konfirmasi kata sandi tidak sama.");
    setPwErr("");
    setPw({ current: "", next: "", confirm: "" });
    setToast("Kata sandi diperbarui. Sesi lain akan diakhiri.");
  };

  return (
    <>
      <PageHeader title="Profil" desc="Kelola data akun dan keamanan sesi Anda." />
      <div className="grid max-w-5xl gap-6 lg:grid-cols-2">
        <form onSubmit={saveProfile} className={`${PANEL} space-y-4 p-5`}>
          <div className="flex items-center gap-3">
            <span className="grid h-12 w-12 place-items-center rounded-full bg-brand-50 text-lg font-semibold text-brand-700">
              {user!.name[0]}
            </span>
            <div>
              <p className="font-semibold">{user!.name}</p>
              <RoleBadge role={user!.role} />
            </div>
          </div>
          <div>
            <label htmlFor="pname" className="label">Nama lengkap</label>
            <input id="pname" className="input" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div>
            <label htmlFor="pemail" className="label">Email</label>
            <input id="pemail" className="input bg-slate-50" value={user!.email} readOnly />
            <p className="hint">Email tidak dapat diubah dari halaman ini.</p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="phone" className="label">Nomor telepon</label>
              <input
                id="phone"
                inputMode="tel"
                className="input"
                placeholder="08xxxxxxxxxx"
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/[^\d+]/g, "").slice(0, 15))}
              />
            </div>
            <div>
              <label htmlFor="unit" className="label">Program studi / unit</label>
              <input id="unit" className="input" value={unit} onChange={(e) => setUnit(e.target.value)} />
            </div>
          </div>
          <p className="hint">Nomor telepon hanya dilihat petugas saat serah terima barang.</p>
          <button className="btn-primary" type="submit">Simpan profil</button>
        </form>

        <div className="space-y-6">
          <form onSubmit={savePassword} className={`${PANEL} space-y-4 p-5`}>
            <h2 className="font-semibold">Ganti kata sandi</h2>
            {([["current", "Kata sandi saat ini", "current-password"], ["next", "Kata sandi baru", "new-password"], ["confirm", "Konfirmasi kata sandi baru", "new-password"]] as const).map(([k, l, ac]) => (
              <div key={k}>
                <label htmlFor={`pw-${k}`} className="label">{l}</label>
                <input
                  id={`pw-${k}`}
                  type="password"
                  autoComplete={ac}
                  className="input"
                  value={pw[k]}
                  onChange={(e) => setPw((s) => ({ ...s, [k]: e.target.value }))}
                />
              </div>
            ))}
            {pwErr && <p role="alert" className="err">{pwErr}</p>}
            <button className="btn-outline" type="submit">Perbarui kata sandi</button>
          </form>

          <div className={`${PANEL} p-5`}>
            <h2 className="mb-3 font-semibold">Sesi aktif</h2>
            <ul className="divide-y divide-slate-100">
              {sessions.map((s) => (
                <li key={s.id} className="flex items-center justify-between gap-3 py-2.5">
                  <div className="flex items-center gap-3">
                    <Monitor className="h-4 w-4 text-slate-400" aria-hidden />
                    <div>
                      <p className="text-sm font-medium">{s.device}</p>
                      <p className="text-xs text-slate-500">{s.info}</p>
                    </div>
                  </div>
                  {!s.current && (
                    <button
                      className="btn-outline px-3 py-1.5 text-xs"
                      onClick={() => { setSessions((x) => x.filter((y) => y.id !== s.id)); setToast("Sesi diakhiri."); }}
                    >
                      Akhiri
                    </button>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      <Toast message={toast} onClose={() => setToast(null)} />
    </>
  );
}