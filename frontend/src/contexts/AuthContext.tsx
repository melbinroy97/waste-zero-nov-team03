import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { User, UserRole } from '@/types';
import { getCurrentUser, refreshToken } from '@/lib/api';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (role: UserRole) => Promise<void>;
  logout: () => void;
  switchRole: (role: UserRole) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadUser = useCallback(async (role?: UserRole) => {
    try {
      setIsLoading(true);
      const storedRole = role || (localStorage.getItem('userRole') as UserRole) || 'volunteer';
      const userData = await getCurrentUser(storedRole);
      setUser(userData);
      localStorage.setItem('userRole', userData.role);
    } catch (error) {
      console.error('Failed to load user:', error);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    if (isLoggedIn) {
      loadUser();
    } else {
      setIsLoading(false);
    }

    // Token refresh interval
    const refreshInterval = setInterval(async () => {
      if (localStorage.getItem('isLoggedIn') === 'true') {
        await refreshToken();
      }
    }, 5 * 60 * 1000); // Refresh every 5 minutes

    return () => clearInterval(refreshInterval);
  }, [loadUser]);

  const login = async (role: UserRole) => {
    localStorage.setItem('isLoggedIn', 'true');
    await loadUser(role);
  };

  const logout = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userRole');
    localStorage.removeItem('token');
    setUser(null);
  };

  const switchRole = async (role: UserRole) => {
    await loadUser(role);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        logout,
        switchRole,
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
