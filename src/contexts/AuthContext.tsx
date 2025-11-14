import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase, Profile } from '../lib/supabase';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  loading: boolean;
  isGuest: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, fullName: string) => Promise<void>;
  signOut: () => Promise<void>;
  continueAsGuest: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isGuest, setIsGuest] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      (async () => {
        setSession(session);
        setUser(session?.user ?? null);

        if (session?.user) {
          const { data: userData } = await supabase
            .from('users')
            .select('*')
            .eq('id', session.user.id)
            .maybeSingle();

          setProfile(userData); // Considera renombrar a setUser o manejar el tipo según corresponda
        }

        setLoading(false);
      })();
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      (async () => {
        setSession(session);
        setUser(session?.user ?? null);

        if (session?.user) {
          const { data: userData } = await supabase
            .from('users')
            .select('*')
            .eq('id', session.user.id)
            .maybeSingle();

          setProfile(userData); // Considera renombrar a setUser o manejar el tipo según corresponda
          setIsGuest(false);
        } else {
          setProfile(null);
        }
      })();
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    // Buscar usuario en la tabla genérica
    const { data: users, error } = await supabase
      .from('registered_users')
      .select('*')
      .eq('email', email)
      .eq('password', password)
      .limit(1);
    if (error) throw error;
    if (!users || users.length === 0) {
      throw new Error('Credenciales incorrectas o usuario no existe');
    }
    // Usuario encontrado, simular login
    setUser(users[0]);
    setProfile(users[0]);   // Puedes ajustar el manejo de estado según lo que uses en la app
  };

  const signUp = async (email: string, password: string, fullName: string) => {
    // Omitimos el registro en auth, sólo insertamos en tabla genérica
    const { error: regError } = await supabase
      .from('registered_users')
      .insert({
        email,
        full_name: fullName,
        password,
        created_at: new Date().toISOString()
      });
    if (regError) throw regError;
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    setIsGuest(false);
  };

  const continueAsGuest = () => {
    setIsGuest(true);
    setLoading(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        profile,
        loading,
        isGuest,
        signIn,
        signUp,
        signOut,
        continueAsGuest,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
