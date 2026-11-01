"use client";

import { useState } from "react";
import { Check, Minus, Plus, Trash2 } from "lucide-react";
import { PageHeader, RoleGuard, Toast } from "@/components/ui";
import { CATEGORIES, USERS } from "@/lib/mock-data";
import { ROLES, ROLE_LABEL, ROLE_USECASES, USE_CASES } from "@/lib/rbac";
import type { Role, UserAccount } from "@/lib/types";

const PANEL = "rounded-lg border border-slate-200 bg-white";
const TH = "px-4 py-2.5 text-left text-xs font-semibold text-slate-500";
const TD = "px-4 py-3 text-sm";

export default function AccessPage() {
  const [users, setUsers] = useState<UserAccount[]>(USERS);
  const [cats, setCats] = useState<string[]>(CATEGORIES);
  const [newCat, setNewCat] = useState("");
  const [toast, setToast] = useState<string | null>(null);

  // UC-07: perubahan peran dan status akun diproses backend dan dicatat di audit log.
  const changeRole = (u: UserAccount, role: Role) => {
    setUsers((xs) => xs.map((x) => (x.id === u.id ? { ...x, role } : x)));
    setToast(`Peran ${u.name} diubah menjadi ${ROLE_LABEL[role]}. Tercatat di activity log.`);
  };
  const toggleActive = (u: UserAccount) => {
    setUsers((xs) => xs.map((x) => (x.id === u.id ? { ...x, active: !x.active } : x)));
    setToast(`Akun ${u.name} ${u.active ? "dinonaktifkan" : "diaktifkan"}.`);
  };
  const addCat = (e: React.FormEvent) => {
    e.preventDefault();
    const v = newCat.trim();
    if (v.length < 3 || cats.some((c) => c.toLowerCase() === v.toLowerCase())) {
      return setToast("Nama kategori minimal 3 karakter dan belum terdaftar.");
    }
    setCats((c) => [...c, v]);
    setNewCat("");
    setToast(`Kategori "${v}" ditambahkan.`);
  };

  return (
    <RoleGuard allow={["SUPER_ADMIN"]}>
      <PageHeader title="Hak akses" desc="Atur peran akun dan kategori barang. Setiap perubahan dicatat di activity log." />

      <section className={`${PANEL} mb-6 overflow-x-auto`} aria-labelledby="matrix">
        <h2 id="matrix" className="border-b border-slate-200 px-4 py-3 font-semibold">Matriks peran dan use case</h2>
        <table className="w-full min-w-[560px]">
          <thead className="bg-slate-50">
            <tr>
              <th className={TH}>Use case</th>
              {ROLES.map((r) => <th key={r} className={`${TH} text-center`}>{ROLE_LABEL[r]}</th>)}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {USE_CASES.map((uc) => (
              <tr key={uc.id}>
                <td className={TD}><span className="mr-2 tabular-nums text-slate-500">{uc.id}</span>{uc.name}</td>
                {ROLES.map((r) => {
                  const ok = ROLE_USECASES[r].includes(uc.id);
                  return (
                    <td key={r} className={`${TD} text-center`}>
                      {ok
                        ? <Check className="mx-auto h-4 w-4 text-emerald-600" aria-label="Diizinkan" />
                        : <Minus className="mx-auto h-4 w-4 text-slate-300" aria-label="Tidak diizinkan" />}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
        <p className="border-t border-slate-200 px-4 py-3 text-xs text-slate-500">
          Matriks mengikuti diagram use case. Penegakan hak akses tetap dilakukan di backend pada setiap endpoint.
        </p>
      </section>

      <div className="grid gap-6 xl:grid-cols-[2fr_1fr]">
        <section className={`${PANEL} overflow-x-auto`} aria-labelledby="akun">
          <h2 id="akun" className="border-b border-slate-200 px-4 py-3 font-semibold">Akun pengguna</h2>
          <table className="w-full min-w-[560px]">
            <thead className="bg-slate-50">
              <tr>{["Nama", "Peran", "Status"].map((h) => <th key={h} className={TH}>{h}</th>)}</tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {users.map((u) => (
                <tr key={u.id}>
                  <td className={TD}>
                    <p className="font-medium">{u.name}</p>
                    <p className="text-xs text-slate-500">{u.email}</p>
                  </td>
                  <td className={TD}>
                    <select
                      className="input w-40 py-1.5"
                      aria-label={`Peran ${u.name}`}
                      value={u.role}
                      onChange={(e) => changeRole(u, e.target.value as Role)}
                    >
                      {ROLES.map((r) => <option key={r} value={r}>{ROLE_LABEL[r]}</option>)}
                    </select>
                  </td>
                  <td className={TD}>
                    <button
                      onClick={() => toggleActive(u)}
                      aria-pressed={u.active}
                      className={`rounded-full px-3 py-1 text-xs font-medium ring-1 ring-inset ${u.active ? "bg-emerald-50 text-emerald-800 ring-emerald-200" : "bg-slate-100 text-slate-600 ring-slate-200"}`}
                    >
                      {u.active ? "Aktif" : "Nonaktif"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        <section className={`${PANEL} p-4`} aria-labelledby="kat">
          <h2 id="kat" className="mb-3 font-semibold">Kategori barang</h2>
          <form onSubmit={addCat} className="mb-3 flex gap-2">
            <input
              className="input"
              aria-label="Kategori baru"
              placeholder="Kategori baru"
              maxLength={40}
              value={newCat}
              onChange={(e) => setNewCat(e.target.value)}
            />
            <button className="btn-primary" type="submit" aria-label="Tambah kategori"><Plus className="h-4 w-4" /></button>
          </form>
          <ul className="divide-y divide-slate-100">
            {cats.map((c) => (
              <li key={c} className="flex items-center justify-between py-2 text-sm">
                {c}
                <button
                  onClick={() => setCats((x) => x.filter((y) => y !== c))}
                  aria-label={`Hapus ${c}`}
                  className="rounded p-1 text-slate-400 hover:bg-slate-100 hover:text-brand-600"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </li>
            ))}
          </ul>
        </section>
      </div>
      <Toast message={toast} onClose={() => setToast(null)} />
    </RoleGuard>
  );
}