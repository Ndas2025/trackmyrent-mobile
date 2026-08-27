import type { Session, User } from "@supabase/supabase-js";
import { createContext, type ReactNode, useContext, useEffect, useMemo, useState } from "react";
import { authService } from "../backend/auth";
import { isBackendConfigured, supabase } from "../backend/client";

type SignUpResult = {
  needsEmailConfirmation: boolean;
};

type AuthContextValue = {
  isBackendConfigured: boolean;
  loading: boolean;
  session: Session | null;
  user: User | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<SignUpResult>;
  signOut: () => Promise<void>;
  requestAccountDeletion: (reason: string) => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    if (!supabase) {
      setLoading(false);
      return;
    }

    supabase.auth.getSession()
      .then(({ data }) => {
        setSession(data.session ?? null);
      })
      .catch(console.warn)
      .finally(() => setLoading(false));

    const { data: subscription } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
      setLoading(false);
    });

    return () => {
      subscription.subscription.unsubscribe();
    };
  }, []);

  const value = useMemo<AuthContextValue>(() => ({
    isBackendConfigured,
    loading,
    session,
    user: session?.user ?? null,
    signIn: async (email: string, password: string) => {
      await authService.signIn(email, password);
    },
    signUp: async (email: string, password: string) => {
      const data = await authService.signUp(email, password);
      return {
        needsEmailConfirmation: !data.session
      };
    },
    signOut: async () => {
      await authService.signOut();
    },
    requestAccountDeletion: async (reason: string) => {
      await authService.requestAccountDeletion(reason);
    }
  }), [loading, session]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const value = useContext(AuthContext);
  if (!value) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return value;
}
