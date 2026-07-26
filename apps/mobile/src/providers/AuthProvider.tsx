import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { AppState, AppStateStatus } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Session } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase/client';

const LAST_EMAIL_KEY = '@obrakit/last_email';
// Tiempo máximo en background/inactividad antes de forzar un nuevo login.
const INACTIVITY_TIMEOUT_MS = 60 * 1000; // 1 minuto

type AuthContextValue = {
  session: Session | null;
  tenantId: string | null;
  loading: boolean;
  lastEmail: string | null;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signUp: (email: string, password: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [tenantId, setTenantId] = useState<string | null>(null);
  const [lastEmail, setLastEmail] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const backgroundedAt = useRef<number | null>(null);
  const appStateRef = useRef(AppState.currentState);

  const loadTenantId = async (userId: string) => {
    const { data, error } = await supabase
      .from('tenant_members')
      .select('tenant_id')
      .eq('user_id', userId)
      .limit(1)
      .maybeSingle();
    if (!error && data?.tenant_id) {
      setTenantId(data.tenant_id);
    } else {
      setTenantId(null);
    }
  };

  // Al abrir la app desde cero SIEMPRE se exige login: no restauramos una
  // sesión persistida automáticamente. Solo recordamos el último email para
  // precargarlo y que el usuario únicamente tenga que escribir la contraseña.
  useEffect(() => {
    (async () => {
      try {
        const savedEmail = await AsyncStorage.getItem(LAST_EMAIL_KEY);
        setLastEmail(savedEmail);
      } catch {
        // AsyncStorage puede fallar en frío alguna vez; no es bloqueante.
      }

      try {
        await Promise.race([
          supabase.auth.signOut(),
          new Promise((resolve) => setTimeout(resolve, 3000)),
        ]);
      } catch {
        // Si signOut() falla (p.ej. no había sesión previa), no pasa nada.
      } finally {
        setSession(null);
        setTenantId(null);
        setLoading(false);
      }
    })();

    const { data: subscription } = supabase.auth.onAuthStateChange(async (_event, newSession) => {
      setSession(newSession);
      if (newSession?.user.id) {
        await loadTenantId(newSession.user.id);
      } else {
        setTenantId(null);
      }
    });

    return () => subscription.subscription.unsubscribe();
  }, []);

  // Cierra la sesión si la app estuvo en background/inactiva más de 1 minuto.
  useEffect(() => {
    const subscription = AppState.addEventListener('change', async (nextState: AppStateStatus) => {
      const goingToBackground =
        appStateRef.current === 'active' && nextState.match(/inactive|background/);
      const comingToForeground = appStateRef.current !== 'active' && nextState === 'active';

      if (goingToBackground) {
        backgroundedAt.current = Date.now();
      } else if (comingToForeground && backgroundedAt.current) {
        const elapsed = Date.now() - backgroundedAt.current;
        backgroundedAt.current = null;
        if (elapsed >= INACTIVITY_TIMEOUT_MS) {
          await supabase.auth.signOut();
        }
      }

      appStateRef.current = nextState;
    });

    return () => subscription.remove();
  }, []);

  const signIn: AuthContextValue['signIn'] = async (email, password) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (!error) {
      await AsyncStorage.setItem(LAST_EMAIL_KEY, email);
      setLastEmail(email);
    }
    return { error: error?.message ?? null };
  };

  // Nota: el registro real crea el tenant + profile vía tu Server Action /
  // función SECURITY DEFINER en la web. Aquí solo damos de alta el usuario en
  // Supabase Auth; si necesitas crear el tenant desde móvil, expón esa lógica
  // como una Supabase Edge Function y llámala aquí en lugar de duplicarla.
  const signUp: AuthContextValue['signUp'] = async (email, password) => {
    const { error } = await supabase.auth.signUp({ email, password });
    return { error: error?.message ?? null };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <AuthContext.Provider value={{ session, tenantId, loading, lastEmail, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth debe usarse dentro de <AuthProvider>');
  return ctx;
}
