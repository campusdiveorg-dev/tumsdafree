'use client';

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { api, setCsrfToken } from '@/services/api';

interface User {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'member';
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, pass: string) => Promise<User>;
  register: (name: string, email: string, pass: string) => Promise<any>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get('/auth/me')
      .then((data) => {
        setUser(data.user);
        setCsrfToken(data.csrf_token);
      })
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const csrf = await api.get('/auth/csrf');
    setCsrfToken(csrf.csrf_token);

    const data = await api.post('/auth/login', { email, password });
    setUser(data.user);
    setCsrfToken(data.csrf_token);
    return data.user;
  }, []);

  const register = useCallback(async (name: string, email: string, password: string) => {
    const csrf = await api.get('/auth/csrf');
    setCsrfToken(csrf.csrf_token);
    const data = await api.post('/auth/register', { name, email, password });
    return data;
  }, []);

  const logout = useCallback(async () => {
    await api.post('/auth/logout').catch(() => {});
    setUser(null);
    setCsrfToken(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
}
