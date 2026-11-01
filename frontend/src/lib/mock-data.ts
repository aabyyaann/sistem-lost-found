import type { AuditLog, Report, Role, UserAccount } from "./types";

// Data contoh. Ganti dengan pemanggilan REST API saat backend siap.

export const CATEGORIES = [
  "Dompet & kartu",
  "Elektronik",
  "Tas",
  "Kunci",
  "Alat tulis",
  "Pakaian & aksesori",
  "Lainnya",
];

export const DEMO_USERS: Record<Role, { name: string; email: string }> = {
  CIVITAS: { name: "Ardika Putra Hadian", email: "ardika@student.telkomuniversity.ac.id" },
  PETUGAS: { name: "Petugas Lost & Found", email: "petugas.lf@telkomuniversity.ac.id" },
  SUPER_ADMIN: { name: "Naufal Alif Abyan", email: "admin.fte@telkomuniversity.ac.id" },
};

export const REPORTS: Report[] = [
  { id: "LF-0012", type: "FOUND", title: "Dompet kulit warna cokelat", category: "Dompet & kartu", location: "Gedung N, lantai 2", date: "2026-02-10", status: "APPROVED", reporter: "Rina Maharani" },
  { id: "LF-0013", type: "LOST", title: "Laptop 14 inci warna abu-abu", category: "Elektronik", location: "Laboratorium Sistem Digital", date: "2026-02-11", status: "PENDING_VERIFICATION", reporter: "Ardika Putra Hadian" },
  { id: "LF-0014", type: "FOUND", title: "Kunci motor dengan gantungan", category: "Kunci", location: "Parkiran Gedung Fakultas Teknik Elektro", date: "2026-02-11", status: "APPROVED", reporter: "Dimas Prakoso" },
  { id: "LF-0015", type: "FOUND", title: "Tas ransel hitam", category: "Tas", location: "Kantin Telkom University", date: "2026-02-12", status: "PENDING_VERIFICATION", reporter: "Salsa Nuraini" },
  { id: "LF-0016", type: "LOST", title: "Kalkulator ilmiah", category: "Alat tulis", location: "Ruang kelas B-204", date: "2026-02-12", status: "NEED_REVISION", reporter: "Ardika Putra Hadian" },
  { id: "LF-0017", type: "FOUND", title: "Earphone nirkabel putih", category: "Elektronik", location: "Perpustakaan", date: "2026-02-13", status: "RESOLVED", reporter: "Bagas Wibowo" },
  { id: "LF-0018", type: "LOST", title: "Jaket almamater", category: "Pakaian & aksesori", location: "Masjid kampus", date: "2026-02-13", status: "REJECTED", reporter: "Fikri Ramadhan" },
];

export const AUDIT_LOGS: AuditLog[] = [
  { id: "AL-0091", time: "2026-02-13T09:12:00", actor: "Ardika Putra Hadian", role: "CIVITAS", action: "LOGIN_SUCCESS", object: "session", meta: "browser=Chrome" },
  { id: "AL-0092", time: "2026-02-13T09:20:00", actor: "Ardika Putra Hadian", role: "CIVITAS", action: "REPORT_CREATED", object: "LF-0013", meta: "status=PENDING_VERIFICATION" },
  { id: "AL-0093", time: "2026-02-13T10:05:00", actor: "Petugas Lost & Found", role: "PETUGAS", action: "REPORT_APPROVED", object: "LF-0014", meta: "public_fields=title,category,location" },
  { id: "AL-0094", time: "2026-02-13T10:31:00", actor: "Petugas Lost & Found", role: "PETUGAS", action: "REPORT_NEED_REVISION", object: "LF-0016", meta: "reason=foto kurang jelas" },
  { id: "AL-0095", time: "2026-02-13T11:02:00", actor: "Ardika Putra Hadian", role: "CIVITAS", action: "CLAIM_SUBMITTED", object: "LF-0012", meta: "status=PENDING, bukti=privat" },
  { id: "AL-0096", time: "2026-02-13T11:40:00", actor: "Petugas Lost & Found", role: "PETUGAS", action: "CLAIM_COMPLETED", object: "LF-0017", meta: "handover=confirmed" },
  { id: "AL-0097", time: "2026-02-13T13:15:00", actor: "Naufal Alif Abyan", role: "SUPER_ADMIN", action: "ROLE_CHANGED", object: "USR-004", meta: "CIVITAS->PETUGAS" },
  { id: "AL-0098", time: "2026-02-13T14:02:00", actor: "unknown", role: "CIVITAS", action: "LOGIN_RATE_LIMITED", object: "session", meta: "attempts=5" },
  { id: "AL-0099", time: "2026-02-13T14:30:00", actor: "Naufal Alif Abyan", role: "SUPER_ADMIN", action: "AUDIT_READ", object: "audit_logs", meta: "filter=today" },
];

export const USERS: UserAccount[] = [
  { id: "USR-001", name: "Ardika Putra Hadian", email: "ardika@student.telkomuniversity.ac.id", role: "CIVITAS", active: true },
  { id: "USR-002", name: "Rina Maharani", email: "rina@student.telkomuniversity.ac.id", role: "CIVITAS", active: true },
  { id: "USR-003", name: "Dimas Prakoso", email: "dimas@student.telkomuniversity.ac.id", role: "CIVITAS", active: false },
  { id: "USR-004", name: "Petugas Lost & Found", email: "petugas.lf@telkomuniversity.ac.id", role: "PETUGAS", active: true },
  { id: "USR-005", name: "Naufal Alif Abyan", email: "admin.fte@telkomuniversity.ac.id", role: "SUPER_ADMIN", active: true },
];