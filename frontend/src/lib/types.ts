export type Role = "CIVITAS" | "PETUGAS" | "SUPER_ADMIN";

export type ReportType = "LOST" | "FOUND";

// Sesuai flowchart Gambar 3.2 pada laporan Project 1
export type ReportStatus =
  | "PENDING_VERIFICATION"
  | "APPROVED"
  | "NEED_REVISION"
  | "REJECTED"
  | "RESOLVED";

export interface Report {
  id: string;
  type: ReportType;
  title: string;
  category: string;
  location: string;
  date: string;
  status: ReportStatus;
  reporter: string;
}

export interface AuditLog {
  id: string;
  time: string;
  actor: string;
  role: Role;
  action: string;
  object: string;
  meta: string;
}

export interface UserAccount {
  id: string;
  name: string;
  email: string;
  role: Role;
  active: boolean;
}