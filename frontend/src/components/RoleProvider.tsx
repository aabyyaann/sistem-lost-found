"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { Role } from "@/lib/types";
import { DEMO_USERS } from "@/lib/mock-data";

interface SessionUser { name: string; email: string; role: Role }

interface Ctx {
  user: SessionUser | null;
  ready: boolean;
  login: (role: Role, email?: string, name?: string) => void;
  logout: () => void;
}

const SessionContext = createContext<Ctx | null>(null);
const KEY = "lf_demo_session";

/**
 * SESI DEMO untuk keperluan UI saja.
 * Versi final: sesi dikelola backend lewat cookie HttpOnly + Secure + SameSite.
 */
export function RoleProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<SessionUser | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(KEY);
      if (raw) setUser(JSON.parse(raw) as SessionUser);
    } catch {
      /* abaikan data sesi yang rusak */
    }
    setReady(true);
  }, []);

  const login = useCallback((role: Role, email?: string, name?: string) => {
    const base = DEMO_USERS[role];
    const next = { role, email: email || base.email, name: name || base.name };
    setUser(next);
    window.localStorage.setItem(KEY, JSON.stringify(next));
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    window.localStorage.removeItem(KEY);
  }, []);

  const value = useMemo(() => ({ user, ready, login, logout }), [user, ready, login, logout]);
  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
}

export function useSession() {
  const ctx = useContext(SessionContext);
  if (!ctx) throw new Error("useSession harus dipakai di dalam RoleProvider");
  return ctx;
}