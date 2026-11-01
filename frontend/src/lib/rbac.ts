import type { Role } from "./types";

export const ROLES: Role[] = ["CIVITAS", "PETUGAS", "SUPER_ADMIN"];

export const ROLE_LABEL: Record<Role, string> = {
  CIVITAS: "Civitas",
  PETUGAS: "Petugas L&F",
  SUPER_ADMIN: "Super Admin",
};

// Use case mengikuti Gambar 3.1 pada laporan Project 1
export const USE_CASES = [
  { id: "UC-01", name: "Autentikasi dan sesi" },
  { id: "UC-02", name: "Buat laporan lost/found" },
  { id: "UC-03", name: "Cari dan filter laporan publik" },
  { id: "UC-04", name: "Ajukan klaim dan bukti privat" },
  { id: "UC-05", name: "Moderasi laporan" },
  { id: "UC-06", name: "Tinjau klaim dan serah terima" },
  { id: "UC-07", name: "Kelola akun dan kategori" },
  { id: "UC-08", name: "Baca audit keamanan" },
  { id: "UC-09", name: "Lihat riwayat dan status" },
] as const;

export const ROLE_USECASES: Record<Role, string[]> = {
  CIVITAS: ["UC-01", "UC-02", "UC-03", "UC-04", "UC-09"],
  PETUGAS: ["UC-01", "UC-05", "UC-06", "UC-09"],
  SUPER_ADMIN: ["UC-01", "UC-07", "UC-08"],
};

/**
 * CATATAN KEAMANAN: pemeriksaan di frontend hanya mengatur tampilan.
 * Otorisasi sebenarnya HARUS diterapkan ulang di backend (Express.js).
 */
export const can = (role: Role, useCase: string) =>
  ROLE_USECASES[role].includes(useCase);