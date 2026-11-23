"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { User, onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase";
import { loginWithEmail, registerWithEmail, loginWithGoogle, logoutUser } from "@/features/auth/services/authService";
import { getProfile, tryPromoteToAdmin } from "@/features/auth/services/profileService";
import { UserProfile } from "@/features/auth/types";

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  login: (e: string, p: string) => Promise<void>;
  register: (e: string, p: string, n: string, o: string) => Promise<void>;
  loginGoogle: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (!currentUser) {
        setProfile(null);
        setLoading(false);
        return;
      }
      try {
        let p = await getProfile(currentUser.uid);
        if (p && p.role === "pendiente" && (await tryPromoteToAdmin(currentUser.uid))) {
          p = await getProfile(currentUser.uid);
        }
        setProfile(p);
      } catch (error) {
        console.error("Error cargando perfil:", error);
        setProfile(null);
      } finally {
        setLoading(false);
      }
    });
    return () => unsubscribe();
  }, []);

  const login = async (email: string, pass: string) => { await loginWithEmail(email, pass); };
  const register = async (email: string, pass: string, name: string, org: string) => { await registerWithEmail(email, pass, name, org); };
  const loginGoogle = async () => { await loginWithGoogle(); };
  const logout = async () => { await logoutUser(); };

  return (
    <AuthContext.Provider value={{ user, profile, loading, login, register, loginGoogle, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth debe usarse dentro de un AuthProvider");
  return context;
};
