import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase, isSupabaseConfigured } from '../services/supabase';
import { api } from '../services/api';
import { FarmerProfile } from '../types';

interface AuthUser {
  id: string;
  email: string;
}

interface AuthContextType {
  user: AuthUser | null;
  profile: FarmerProfile | null;
  loading: boolean;
  login: (email: string, pass: string) => Promise<void>;
  register: (email: string, pass: string, fullName: string, lang: 'en' | 'hi') => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  loginAsDemo: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [profile, setProfile] = useState<FarmerProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Initialize auth
  useEffect(() => {
    async function initAuth() {
      try {
        if (isSupabaseConfigured && supabase) {
          const { data: { session } } = await supabase.auth.getSession();
          if (session?.user) {
            setUser({ id: session.user.id, email: session.user.email || '' });
            localStorage.setItem('kisan_auth_token', session.access_token);
            await fetchProfile();
          }

          supabase.auth.onAuthStateChange(async (_event, session) => {
            if (session?.user) {
              setUser({ id: session.user.id, email: session.user.email || '' });
              localStorage.setItem('kisan_auth_token', session.access_token);
              await fetchProfile();
            } else {
              setUser(null);
              setProfile(null);
              localStorage.removeItem('kisan_auth_token');
            }
          });
        } else {
          // Check local demo session
          const savedUser = localStorage.getItem('kisan_demo_user');
          if (savedUser) {
            setUser(JSON.parse(savedUser));
            await fetchProfile();
          }
        }
      } catch (err) {
        console.error('Auth initialization error:', err);
      } finally {
        setLoading(false);
      }
    }

    initAuth();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await api.get('/profile');
      if (res.data?.success && res.data?.data) {
        setProfile(res.data.data);
      }
    } catch (e) {
      console.warn('Profile fetch note:', e);
    }
  };

  const login = async (email: string, pass: string) => {
    setLoading(true);
    try {
      if (isSupabaseConfigured && supabase) {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password: pass,
        });
        if (error) throw error;
        if (data.session) {
          setUser({ id: data.user.id, email: data.user.email || '' });
          localStorage.setItem('kisan_auth_token', data.session.access_token);
          await fetchProfile();
        }
      } else {
        // Local dev login fallback
        const demoUser: AuthUser = {
          id: '00000000-0000-0000-0000-000000000001',
          email,
        };
        setUser(demoUser);
        localStorage.setItem('kisan_demo_user', JSON.stringify(demoUser));
        localStorage.setItem('kisan_auth_token', 'demo-farmer-token');
        await fetchProfile();
      }
    } finally {
      setLoading(false);
    }
  };

  const register = async (email: string, pass: string, fullName: string, lang: 'en' | 'hi') => {
    setLoading(true);
    try {
      if (isSupabaseConfigured && supabase) {
        const { data, error } = await supabase.auth.signUp({
          email,
          password: pass,
          options: {
            data: { full_name: fullName, preferred_language: lang },
          },
        });
        if (error) throw error;
        if (data.user) {
          setUser({ id: data.user.id, email: data.user.email || '' });
          if (data.session) {
            localStorage.setItem('kisan_auth_token', data.session.access_token);
          }
          // Initialize profile
          await api.post('/profile', {
            full_name: fullName,
            preferred_language: lang,
          });
          await fetchProfile();
        }
      } else {
        const demoUser: AuthUser = {
          id: '00000000-0000-0000-0000-000000000001',
          email,
        };
        setUser(demoUser);
        localStorage.setItem('kisan_demo_user', JSON.stringify(demoUser));
        localStorage.setItem('kisan_auth_token', 'demo-farmer-token');
        await api.post('/profile', {
          full_name: fullName,
          preferred_language: lang,
        });
        await fetchProfile();
      }
    } finally {
      setLoading(false);
    }
  };

  const loginAsDemo = async () => {
    const demoUser: AuthUser = {
      id: '00000000-0000-0000-0000-000000000001',
      email: 'ramesh.farmer@kisanai.org',
    };
    setUser(demoUser);
    localStorage.setItem('kisan_demo_user', JSON.stringify(demoUser));
    localStorage.setItem('kisan_auth_token', 'demo-farmer-token');
    // Ensure demo profile exists
    await api.post('/profile', {
      full_name: 'Ramesh Patel',
      state: 'Maharashtra',
      district: 'Nashik',
      village: 'Dindori',
      preferred_language: 'en',
      farming_experience: 12,
      default_land_area: 4.5,
      land_unit: 'acre',
    });
    await fetchProfile();
  };

  const logout = async () => {
    if (isSupabaseConfigured && supabase) {
      await supabase.auth.signOut();
    }
    setUser(null);
    setProfile(null);
    localStorage.removeItem('kisan_demo_user');
    localStorage.removeItem('kisan_auth_token');
  };

  const resetPassword = async (email: string) => {
    if (isSupabaseConfigured && supabase) {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/login`,
      });
      if (error) throw error;
    } else {
      // Simulate reset confirmation
      console.log(`Password recovery requested for ${email}`);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        loading,
        login,
        register,
        logout,
        resetPassword,
        loginAsDemo,
        refreshProfile: fetchProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
};
