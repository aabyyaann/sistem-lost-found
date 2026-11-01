"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Lock } from "lucide-react";
import { ROLES, ROLE_LABEL } from "@/lib/rbac";
import type { Role } from "@/lib/types";

const MAX_ATTEMPTS = 5;

export default function LoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [role, setRole] = useState<Role>("CIVITAS");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [attempts, setAttempts] = useState(0);
  const locked = attempts >= MAX_ATTEMPTS;

  const validate = () => {
    const e: Record<string, string> = {};
    if (mode === "register" && name.trim().length < 3) e.name = "Nama lengkap minimal 3 karakter.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = "Masukkan alamat email yang valid.";
    if (password.length < 8) e.password = "Kata sandi minimal 8 karakter.";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const submit = (ev: React.FormEvent) => {
    ev.preventDefault();
    if (locked) return;
    if (!validate()) {
      setAttempts((a) => a + 1);
      return;
    }
    // TODO: ganti dengan POST ke /auth/login atau /auth/register di backend.
    // Backend memvalidasi ulang input, menerapkan rate limit, dan mengirim cookie sesi HttpOnly.
    // Sesi demo di bawah hanya untuk melihat tampilan tiap peran.
    const session = { role: mode === "register" ? "CIVITAS" : role, email, name: name || email.split("@")[0] };
    window.localStorage.setItem("lf_demo_session", JSON.stringify(session));
    router.push("/dashboard");
  };

  return (
    <div className="grid min-h-screen lg:grid-cols-[1.05fr_1fr]">
      <section className="hidden flex-col justify-between bg-brand-900 p-12 text-white lg:flex">
        <div className="flex items-center gap-2.5">
          <span className="grid h-9 w-9 place-items-center rounded-md bg-brand-500 text-sm font-bold">LF</span>
          <span className="text-sm font-medium">Telkom University · Fakultas Teknik Elektro</span>
        </div>
        <div>
          <h1 className="max-w-md text-4xl font-semibold leading-tight tracking-tight">Barang hilang kembali ke pemiliknya.</h1>
          <p className="mt-4 max-w-md text-base leading-relaxed text-white/75">
            Laporkan barang yang hilang atau ditemukan di lingkungan FTE. Petugas memverifikasi klaim sebelum barang diserahkan, jadi hanya pemilik sah yang menerimanya.
          </p>
        </div>
        <p className="text-xs text-white/60">Data pribadi dan bukti klaim hanya dapat dilihat oleh petugas berwenang.</p>
      </section>

      <section className="flex items-center justify-center px-5 py-10">
        <div className="w-full max-w-sm">
          <div className="mb-6 flex gap-1 rounded-md bg-slate-100 p-1" role="tablist">
            {(["login", "register"] as const).map((m) => (
              <button
                key={m}
                type="button"
                role="tab"
                aria-selected={mode === m}
                onClick={() => { setMode(m); setErrors({}); }}
                className={`flex-1 rounded px-3 py-1.5 text-sm font-medium transition-colors ${mode === m ? "bg-white shadow-sm" : "text-slate-600"}`}
              >
                {m === "login" ? "Masuk" : "Daftar"}
              </button>
            ))}
          </div>

          <h2 className="text-xl font-semibold">{mode === "login" ? "Masuk ke akun Anda" : "Buat akun baru"}</h2>
          <p className="mt-1 text-sm text-slate-600">Gunakan email kampus Anda.</p>

          {locked && (
            <div role="alert" className="mt-4 flex gap-2 rounded-md border border-brand-100 bg-brand-50 p-3 text-sm text-brand-700">
              <Lock className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
              Terlalu banyak percobaan. Coba lagi dalam 15 menit.
            </div>
          )}

          <form onSubmit={submit} noValidate className="mt-5 space-y-4">
            {mode === "register" && (
              <div>
                <label htmlFor="name" className="label">Nama lengkap</label>
                <input id="name" className="input" autoComplete="name" value={name} onChange={(e) => setName(e.target.value)} />
                {errors.name && <p className="err">{errors.name}</p>}
              </div>
            )}

            <div>
              <label htmlFor="email" className="label">Email</label>
              <input
                id="email"
                type="email"
                className="input"
                autoComplete="email"
                placeholder="nama@student.telkomuniversity.ac.id"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              {errors.email && <p className="err">{errors.email}</p>}
            </div>

            <div>
              <label htmlFor="password" className="label">Kata sandi</label>
              <div className="relative">
                <input
                  id="password"
                  type={show ? "text" : "password"}
                  className="input pr-10"
                  autoComplete={mode === "login" ? "current-password" : "new-password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShow((s) => !s)}
                  aria-label={show ? "Sembunyikan kata sandi" : "Tampilkan kata sandi"}
                  className="absolute inset-y-0 right-0 grid w-10 place-items-center text-slate-500"
                >
                  {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.password && <p className="err">{errors.password}</p>}
            </div>

            {mode === "login" && (
              <div className="rounded-md border border-dashed border-slate-300 bg-slate-50 p-3">
                <label htmlFor="role" className="label">Masuk sebagai (mode demo)</label>
                <select id="role" className="input" value={role} onChange={(e) => setRole(e.target.value as Role)}>
                  {ROLES.map((r) => <option key={r} value={r}>{ROLE_LABEL[r]}</option>)}
                </select>
                <p className="hint">Hanya untuk melihat tampilan tiap peran. Pada sistem asli, peran ditentukan backend.</p>
              </div>
            )}

            <button type="submit" className="btn-primary w-full" disabled={locked}>
              {mode === "login" ? "Masuk" : "Buat akun"}
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}