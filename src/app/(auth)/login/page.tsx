"use client";
import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/shared/lib/firebase"; // Asegúrate de que esta ruta sea correcta
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push("/dashboard");
    } catch (err: any) { // eslint-disable-line @typescript-eslint/no-explicit-any
      if (err.code === "auth/invalid-credential" || err.code === "auth/wrong-password") {
        setError("Credenciales inválidas.");
      } else if (err.code === "auth/user-not-found") {
        setError("Usuario no encontrado.");
      } else {
        setError("Ocurrió un error. Intenta de nuevo.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0d131f] p-4">
      <div className="bg-white/5 backdrop-blur-lg border border-white/10 p-8 rounded-3xl w-full max-w-md shadow-2xl">
        <h1 className="text-3xl font-bold text-brand-porcelain mb-6 text-center">Iniciar Sesión</h1>
        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Correo electrónico" className="p-3 rounded-lg bg-white/10 text-white border border-white/20 focus:outline-none focus:border-brand-bronze" required />
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Contraseña" className="p-3 rounded-lg bg-white/10 text-white border border-white/20 focus:outline-none focus:border-brand-bronze" required />
          {error && <p className="text-red-400 text-sm">{error}</p>}
          <button type="submit" disabled={loading} className="bg-brand-bronze text-brand-night font-bold p-3 rounded-lg hover:scale-105 transition-transform mt-2">
            {loading ? "Cargando..." : "Entrar"}
          </button>
        </form>
        <Link href="/" className="block text-center text-brand-porcelain/60 mt-6 hover:text-brand-bronze transition-colors">Volver al inicio</Link>
      </div>
    </div>
  );
}
