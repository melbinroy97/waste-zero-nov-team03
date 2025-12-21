import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import type { User } from "@/types";
import { getCurrentUser, loginUser, registerUser } from "@/lib/api";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: any) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // LOAD CURRENT USER
  const loadUser = useCallback(async () => {
    try {
      setIsLoading(true);
      const userData = await getCurrentUser();
      setUser(userData);
    } catch {
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) loadUser();
    else setIsLoading(false);
  }, [loadUser]);

  // LOGIN FUNCTION
  const login = async (email: string, password: string) => {
     console.log("LOGIN FUNCTION CALLED", email);
    const res = await loginUser(email, password);
    console.log("LOGIN API RESPONSE", res);
    if (!res?.token || !res?.user) {
    throw new Error("Invalid login response");
  }
    localStorage.setItem("token", res.token);
    setUser(res.user);
  };

  // REGISTER FUNCTION
  const register = async (data: any) => {
    const res = await registerUser(data);
    localStorage.setItem("token", res.token);
    setUser(res.user);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
