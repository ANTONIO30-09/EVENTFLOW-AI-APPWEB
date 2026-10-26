"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/shared/lib/firebase";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push("/dashboard");
    } catch (err: any) {
      console.error(err);
      // Traducimos el error de Firebase a un mensaje amigable
      if (err.code === "auth/invalid-credential" || err.code === "auth/wrong-password") {
        setError("Correo o contraseña incorrectos.");
      } else if (err.code === "auth/user-not-found") {
        setError("No existe un usuario con este correo.");
      } else {
        setError("Ocurrió un error al iniciar sesión. Intenta de nuevo.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-4 bg-[#0d131f] relative overflow-hidden">
      
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-brand-bronze/20 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[30%] h-[30%] bg-brand-sage/10 blur-[100px] rounded-full pointer-events-none" />

      <div className="w-full max-w-md rounded-[28px] border border-brand-porcelain/20 bg-brand-porcelain/10 p-8 shadow-2xl backdrop-blur-md relative z-10">
        <h1 className="text-center font-serif text-4xl text-brand-bronze mb-2">
          EventFlow AI
        </h1>
        <p className="text-center text-brand-porcelain/70 mb-8 font-sans text-sm">
          Panel de Administración Web
        </p>
        
        {error && (
          <div className="mb-4 p-3 bg-brand-brick/20 border border-brand-brick/50 rounded-xl text-brand-brick text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-brand-porcelain mb-2">Correo Electrónico</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="admin@eventflow.com"
              className="w-full rounded-xl border border-brand-porcelain/20 bg-brand-porcelain/5 px-4 py-3 text-brand-porcelain placeholder:text-brand-porcelain/30 focus:border-brand-bronze focus:outline-none focus:ring-1 focus:ring-brand-bronze transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-brand-porcelain mb-2">Contraseña</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
              className="w-full rounded-xl border border-brand-porcelain/20 bg-brand-porcelain/5 px-4 py-3 text-brand-porcelain placeholder:text-brand-porcelain/30 focus:border-brand-bronze focus:outline-none focus:ring-1 focus:ring-brand-bronze transition-all"
            />
          </div>
          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full rounded-full bg-brand-bronze py-3 font-semibold text-brand-night transition hover:bg-brand-bronze/90 disabled:opacity-70 flex justify-center items-center"
          >
            {isLoading ? "Verificando..." : "Iniciar Sesión"}
          </button>
        </form>

        <div className="mt-6 text-center">
          <Link href="/" className="text-xs text-brand-porcelain/50 hover:text-brand-bronze transition-colors">
            ← Volver a la página principal
          </Link>
        </div>
      </div>
    </div>
  );
}
