import type { Role } from "./types";

export const ROLES: Role[] = ["CIVITAS", "PETUGAS", "SUPER_ADMIN"];

export const ROLE_LABEL: Record<Role, string> = {
  CIVITAS: "Civitas",
  PETUGAS: "Petugas L&F",
  SUPER_ADMIN: "Super Admin",
};