import { useEffect, useMemo, useState } from "react";
import type { AuthUser } from "../types";
import {
  clearSession,
  readSession,
  writeSession,
  type PersistedSession,
} from "../lib/session";

interface SessionState {
  token: string | null;
  user: AuthUser | null;
  ready: boolean;
}

export function useSession() {
  const [session, setSession] = useState<SessionState>({
    token: null,
    user: null,
    ready: false,
  });

  useEffect(() => {
    const persisted = readSession();
    setSession({
      token: persisted?.token ?? null,
      user: persisted?.user ?? null,
      ready: true,
    });
  }, []);

  const actions = useMemo(
    () => ({
      save(nextSession: PersistedSession) {
        writeSession(nextSession);
        setSession({
          token: nextSession.token,
          user: nextSession.user,
          ready: true,
        });
      },
      clear() {
        clearSession();
        setSession({
          token: null,
          user: null,
          ready: true,
        });
      },
    }),
    []
  );

  return {
    ...session,
    ...actions,
    isAuthenticated: Boolean(session.token && session.user),
  };
}
