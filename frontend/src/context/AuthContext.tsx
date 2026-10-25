import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { api } from '../services/api';

export interface User {
  id: string;
  email: string;
  name: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (name: string, email: string, password: string, role?: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem('smarthive_user');
    if (savedUser) {
      try {
        return JSON.parse(savedUser);
      } catch {
        return null;
      }
    }
    return null;
  });

  const [token, setToken] = useState<string | null>(() => localStorage.getItem('smarthive_token'));
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const verifyToken = async () => {
      const storedToken = localStorage.getItem('smarthive_token');
      if (storedToken) {
        try {
          const res = await api.getMe();
          if (res.data && res.data.user) {
            setUser(res.data.user);
            localStorage.setItem('smarthive_user', JSON.stringify(res.data.user));
          }
        } catch (err) {
          console.warn('Session expired or invalid, logging out:', err);
          // Only clear if 401
          logout();
        }
      }
      setIsLoading(false);
    };

    verifyToken();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const res = await api.login({ email, password });
      if (res.data && res.data.token) {
        const receivedToken = res.data.token;
        const receivedUser = res.data.user;

        localStorage.setItem('smarthive_token', receivedToken);
        localStorage.setItem('smarthive_user', JSON.stringify(receivedUser));

        setToken(receivedToken);
        setUser(receivedUser);

        return { success: true };
      }
      return { success: false, error: 'Login failed: Invalid server response' };
    } catch (err: any) {
      const msg = err.response?.data?.error || err.message || 'Authentication failed';
      return { success: false, error: msg };
    }
  };

  const register = async (name: string, email: string, password: string, role = 'SOC_ANALYST') => {
    try {
      const res = await api.register({ name, email, password, role });
      if (res.data && res.data.token) {
        const receivedToken = res.data.token;
        const receivedUser = res.data.user;

        localStorage.setItem('smarthive_token', receivedToken);
        localStorage.setItem('smarthive_user', JSON.stringify(receivedUser));

        setToken(receivedToken);
        setUser(receivedUser);

        return { success: true };
      }
      return { success: false, error: 'Registration failed: Invalid response' };
    } catch (err: any) {
      const msg = err.response?.data?.error || err.message || 'Registration failed';
      return { success: false, error: msg };
    }
  };

  const logout = () => {
    localStorage.removeItem('smarthive_token');
    localStorage.removeItem('smarthive_user');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token && !!user,
        isLoading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
