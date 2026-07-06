import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import type { Language, Role } from "@/types";

interface SessionState {
  role: Role;
  language: Language;
  setRole: (r: Role) => void;
  setLanguage: (l: Language) => void;
}

const SessionContext = createContext<SessionState | null>(null);

export function SessionProvider({ children }: { children: ReactNode }) {
  const [role, setRole] = useState<Role>("fan");
  const [language, setLanguage] = useState<Language>("en");
  const value = useMemo(() => ({ role, language, setRole, setLanguage }), [role, language]);
  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
}

export function useSession(): SessionState {
  const ctx = useContext(SessionContext);
  if (!ctx) throw new Error("useSession must be used inside <SessionProvider>");
  return ctx;
}
