"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/shared/lib/AuthContext";
import { getAuthErrorMessage } from "@/features/auth/services/authService";
import { Mail, Lock, Loader2, ArrowRight, User, Building, ArrowLeft, Eye, EyeOff } from "lucide-react";
import { motion } from "framer-motion";
import { Playfair_Display } from "next/font/google";

const playfair = Playfair_Display({ subsets: ["latin"], weight: ["400", "700"] });

const registerSchema = z.object({
  name: z.string().min(3, "El nombre debe tener al menos 3 caracteres"),
  organization: z.string().min(2, "Ingresa el nombre de tu empresa"),
  email: z.string().email("Ingresa un correo electrónico válido"),
  password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const router = useRouter();
  const { register: registerAuth, loginGoogle } = useAuth();
  const [authError, setAuthError] = useState<string | null>(null);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormValues) => {
    try {
      setAuthError(null);
      await registerAuth(data.email, data.password, data.name, data.organization);
      router.push("/dashboard");
    } catch (error: unknown) {
      const err = error as { code?: string };
      setAuthError(getAuthErrorMessage(err.code || "", error));
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setIsGoogleLoading(true);
      setAuthError(null);
      await loginGoogle();
      router.push("/dashboard");
    } catch (error: unknown) {
      const err = error as { code?: string };
      setAuthError(getAuthErrorMessage(err.code || "", error));
    } finally {
      setIsGoogleLoading(false);
    }
  };

  return (
    <div className="h-screen w-full flex bg-[#0d131f] overflow-hidden">
      
      {/* LADO IZQUIERDO - Imagen con texto flotante */}
      <div className="hidden lg:flex w-1/2 relative items-center justify-center p-12 overflow-hidden">
        <Image src="/images/login-bg.png" alt="EventFlow AI" fill className="object-cover brightness-125" priority />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0d131f]/50 via-transparent to-[#0d131f]" />
        
        {/* Botón Volver al Inicio en la esquina inferior */}
        <Link href="/" className="absolute bottom-10 left-12 z-20 inline-flex items-center gap-2 text-white/70 hover:text-white transition-colors text-xs font-bold tracking-widest uppercase drop-shadow-md">
          <ArrowLeft size={16} /> Volver al inicio
        </Link>
        
        <motion.div 
          initial={{ opacity: 0, x: -30 }} 
          animate={{ opacity: 1, x: 0 }} 
          transition={{ duration: 1, delay: 0.2 }} 
          className="relative z-10 w-full max-w-lg"
        >
          
          
          <h1 className={`${playfair.className} text-5xl xl:text-6xl text-white leading-[1.15] mb-6 drop-shadow-[0_5px_25px_rgba(0,0,0,1)]`}>
            Eleva la <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-bronze to-[#FFD700] italic">excelencia</span> <br />
            de tus eventos.
          </h1>
          <p className="text-white/90 text-lg font-light drop-shadow-[0_2px_10px_rgba(0,0,0,1)] leading-relaxed font-medium">
            Únete a la plataforma que está redefiniendo la logística con Inteligencia Artificial.
          </p>
        </motion.div>
      </div>

      {/* LADO DERECHO - Formulario */}
      <div className="w-full lg:w-1/2 h-full flex items-center justify-center p-6 relative overflow-y-auto no-scrollbar">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(184,134,62,0.15)_0%,_transparent_70%)] pointer-events-none" />
        
        <motion.div 
          initial={{ opacity: 0, x: 20 }} 
          animate={{ opacity: 1, x: 0 }} 
          transition={{ duration: 0.6, delay: 0.2 }} 
          className="w-full max-w-[400px] bg-white/[0.08] backdrop-blur-3xl border border-white/20 p-8 rounded-[2.5rem] shadow-[0_8px_32px_rgba(0,0,0,0.4),inset_0_0_0_1px_rgba(255,255,255,0.1)] relative z-10 my-auto"
        >
          <div className="text-center mb-6">
            <h2 className={`${playfair.className} text-3xl text-white mb-1 font-bold`}>Crear Cuenta</h2>
            <p className="text-brand-porcelain/50 text-xs">Comienza a gestionar eventos como un profesional</p>
          </div>

          {authError && (
            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-xs text-center">
              {authError}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3">
            <div className="group">
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-porcelain/30 group-focus-within:text-brand-bronze transition-colors" size={18} />
                <input type="text" placeholder="Nombre completo" {...register("name")} className="w-full bg-[#0d131f]/60 border border-white/10 text-white rounded-xl py-3 pl-11 pr-4 focus:outline-none focus:border-brand-bronze focus:bg-[#0d131f]/90 transition-all text-sm placeholder:text-brand-porcelain/30" />
              </div>
              {errors.name && <p className="text-red-400 text-[10px] mt-1 ml-1">{errors.name.message}</p>}
            </div>

            <div className="group">
              <div className="relative">
                <Building className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-porcelain/30 group-focus-within:text-brand-bronze transition-colors" size={18} />
                <input type="text" placeholder="Empresa u Organización" {...register("organization")} className="w-full bg-[#0d131f]/60 border border-white/10 text-white rounded-xl py-3 pl-11 pr-4 focus:outline-none focus:border-brand-bronze focus:bg-[#0d131f]/90 transition-all text-sm placeholder:text-brand-porcelain/30" />
              </div>
              {errors.organization && <p className="text-red-400 text-[10px] mt-1 ml-1">{errors.organization.message}</p>}
            </div>

            <div className="group">
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-porcelain/30 group-focus-within:text-brand-bronze transition-colors" size={18} />
                <input type="email" placeholder="Correo electrónico" {...register("email")} className="w-full bg-[#0d131f]/60 border border-white/10 text-white rounded-xl py-3 pl-11 pr-4 focus:outline-none focus:border-brand-bronze focus:bg-[#0d131f]/90 transition-all text-sm placeholder:text-brand-porcelain/30" />
              </div>
              {errors.email && <p className="text-red-400 text-[10px] mt-1 ml-1">{errors.email.message}</p>}
            </div>

            <div className="group">
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-porcelain/30 group-focus-within:text-brand-bronze transition-colors" size={18} />
                <input type={showPassword ? "text" : "password"} placeholder="Contraseña" {...register("password")} className="w-full bg-[#0d131f]/60 border border-white/10 text-white rounded-xl py-3 pl-11 pr-11 focus:outline-none focus:border-brand-bronze focus:bg-[#0d131f]/90 transition-all text-sm placeholder:text-brand-porcelain/30" />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-brand-porcelain/30 hover:text-white transition-colors">
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && <p className="text-red-400 text-[10px] mt-1 ml-1">{errors.password.message}</p>}
            </div>

            <button type="submit" disabled={isSubmitting} className="group relative w-full flex items-center justify-center gap-2 bg-gradient-to-r from-brand-bronze to-[#FFD700] text-brand-night font-black py-3.5 rounded-xl hover:scale-[1.02] transition-transform shadow-[0_0_30px_rgba(184,134,62,0.3)] disabled:opacity-70 disabled:hover:scale-100 overflow-hidden mt-1">
              <span className="relative z-10 flex items-center gap-2">
                {isSubmitting ? <Loader2 className="animate-spin" size={18} /> : "Crear mi cuenta"}
                {!isSubmitting && <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />}
              </span>
              <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/40 to-transparent group-hover:translate-x-full transition-transform duration-700 ease-in-out" />
            </button>
          </form>

          <div className="my-4 flex items-center gap-4">
            <div className="h-px flex-1 bg-white/10" />
            <span className="text-[10px] text-brand-porcelain/40 uppercase tracking-widest font-bold">o</span>
            <div className="h-px flex-1 bg-white/10" />
          </div>

          <button onClick={handleGoogleLogin} disabled={isGoogleLoading} className="w-full flex items-center justify-center gap-3 bg-white/5 border border-white/10 text-white font-medium py-3.5 rounded-xl hover:bg-white/10 transition-all hover:border-white/20">
            {isGoogleLoading ? <Loader2 className="animate-spin" size={20} /> : (
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
            )}
            Continuar con Google
          </button>

          <p className="mt-6 text-center text-xs text-brand-porcelain/50">
            ¿Ya tienes cuenta?{" "}
            <Link href="/login" className="text-[#FFD700] font-bold hover:text-brand-bronze transition-colors">Inicia sesión</Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
