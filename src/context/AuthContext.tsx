'use client';

import type { ReactNode } from 'react';
import React, { createContext, useContext, useState, useEffect } from 'react';
import { authApi, type AuthResponse } from '@/lib/api/auth';
import { usersApi } from '@/lib/api/users';

type User = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  dateOfBirth?: string;
  avatar?: string;
  isEmailVerified: boolean;
  createdAt: string;
  updatedAt: string;
  preferences: {
    id: string;
    theme: 'light' | 'dark' | 'system';
    language: 'es' | 'en';
    emailNotifications: boolean;
    pushNotifications: boolean;
    newsletter: boolean;
  };
};

type AuthContextType = {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (email: string, password: string, firstName: string, lastName: string) => Promise<void>;
  refreshUser: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Verificar token existente y cargar usuario
    const loadUser = async () => {
      try {
        const token = localStorage.getItem('abono-lago-token');
        if (token) {
          const profile = await usersApi.getProfile();
          setUser(profile);
        }
      } catch (error) {
        console.error('Failed to load user', error);
        localStorage.removeItem('abono-lago-token');
        // Eliminar cookie
        document.cookie = 'abono-lago-token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT';
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  const login = React.useCallback(async (email: string, password: string) => {
    const response: AuthResponse = await authApi.login({ email, password });
    localStorage.setItem('abono-lago-token', response.token);
    // También establecer cookie para middleware
    document.cookie = `abono-lago-token=${response.token}; path=/; max-age=604800`; // 7 días
    setUser(response.user);
  }, []);

  const logout = React.useCallback(() => {
    localStorage.removeItem('abono-lago-token');
    // Eliminar cookie
    document.cookie = 'abono-lago-token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT';
    setUser(null);
  }, []);

  const register = React.useCallback(async (email: string, password: string, firstName: string, lastName: string) => {
    const response: AuthResponse = await authApi.register({
      email,
      password,
      firstName,
      lastName
    });
    localStorage.setItem('abono-lago-token', response.token);
    // También establecer cookie para middleware
    document.cookie = `abono-lago-token=${response.token}; path=/; max-age=604800`; // 7 días
    setUser(response.user);
  }, []);

  const refreshUser = React.useCallback(async () => {
    try {
      const profile = await usersApi.getProfile();
      setUser(profile);
    } catch (error) {
      console.error('Failed to refresh user', error);
    }
  }, []);

  const value = React.useMemo(() => ({
    user,
    token: typeof window !== 'undefined' ? localStorage.getItem('abono-lago-token') : null, // Simplest way to expose current token
    loading,
    login,
    logout,
    register,
    refreshUser
  }), [user, loading, login, logout, register, refreshUser]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
