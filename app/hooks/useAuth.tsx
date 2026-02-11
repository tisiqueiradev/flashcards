'use client';
import { useState, useEffect, createContext, useContext } from "react";

interface User {
  email: string;
  id: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    // Sempre usar microtask para evitar chamadas síncronas de setState
    queueMicrotask(() => {
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
      setLoading(false);
    });
  }, []);

  const signIn = async (email: string, password: string) => {
    setLoading(true);

    const fakeUser: User = { email, id: crypto.randomUUID() };
    localStorage.setItem("user", JSON.stringify(fakeUser));
    setUser(fakeUser);

    setLoading(false);
  };

  const signOut = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
