"use client";

import { useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { X, Loader2 } from "lucide-react";
import { useAuth } from "@/shared/lib/AuthContext";
import { createManagedUser, CreatedUser } from "../services/userService";
import { STAFF_EMAIL_DOMAIN } from "../constants";

const schema = z
  .object({
    name: z.string().trim().min(3, "Escribe el nombre completo"),
    role: z.enum(["organizador", "staff"]),
    accessType: z.enum(["email", "username"]),
    email: z.string().optional(),
  })
  .refine(
    (d) => d.accessType !== "email" || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test((d.email ?? "").trim()),
    { message: "Ingresa un correo válido", path: ["email"] }
  );

type FormValues = z.infer<typeof schema>;

interface Props {
  onClose: () => void;
  onCreated: (created: CreatedUser, name: string, role: string) => void;
}

const inputClass =
  "w-full bg-white/[0.04] border border-white/10 rounded-xl py-3 px-4 text-sm text-white placeholder:text-brand-porcelain/40 focus:outline-none focus:border-brand-bronze/60 transition-colors";

const friendlyError = (err: unknown) => {
  const code = typeof err === "object" && err !== null && "code" in err ? String((err as { code: unknown }).code) : "";
  switch (code) {
    case "auth/email-already-in-use":
      return "Ese correo ya tiene una cuenta.";
    case "auth/invalid-email":
      return "El correo no es válido.";
    case "auth/operation-not-allowed":
      return "El acceso por correo y contraseña no está habilitado en Firebase.";
    case "permission-denied":
    case "firestore/permission-denied":
      return "No tienes permisos para crear este usuario.";
    default:
      return "Ocurrió un error. Intenta de nuevo.";
  }
};

export default function UserModal({ onClose, onCreated }: Props) {
  const { user } = useAuth();
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { name: "", role: "staff", accessType: "username", email: "" },
  });

  const accessType = useWatch({ control, name: "accessType" });

  const onSubmit = async (data: FormValues) => {
    try {
      setError(null);
      if (!user) throw new Error("No user");
      const created = await createManagedUser({
        name: data.name,
        role: data.role,
        accessType: data.accessType,
        email: data.email,
        adminId: user.uid,
      });
      onCreated(created, data.name.trim(), data.role);
    } catch (err) {
      console.error(err);
      setError(friendlyError(err));
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="w-full max-w-lg bg-[#0d131f] border border-white/10 rounded-[2rem] shadow-2xl p-8 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">Nuevo usuario</h2>
          <button onClick={onClose} className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-colors" title="Cerrar">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} autoComplete="off" className="flex flex-col gap-4">
          <div>
            <label className="block text-xs font-bold text-brand-porcelain/60 mb-2">Nombre completo</label>
            <input type="text" placeholder="Ej: Carlos Pérez Mamani" className={inputClass} {...register("name")} />
            {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-brand-porcelain/60 mb-2">Rol</label>
              <select
                className={inputClass}
                {...register("role", {
                  onChange: (e) => setValue("accessType", e.target.value === "organizador" ? "email" : "username"),
                })}
              >
                <option value="staff" className="bg-[#0d131f]">Staff</option>
                <option value="organizador" className="bg-[#0d131f]">Organizador</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-brand-porcelain/60 mb-2">Cómo ingresará</label>
              <select className={inputClass} {...register("accessType")}>
                <option value="email" className="bg-[#0d131f]">Con su correo</option>
                <option value="username" className="bg-[#0d131f]">Sin correo</option>
              </select>
            </div>
          </div>

          {accessType === "email" ? (
            <div>
              <label className="block text-xs font-bold text-brand-porcelain/60 mb-2">Correo</label>
              <input type="email" placeholder="persona@gmail.com" className={inputClass} {...register("email")} />
              {errors.email ? (
                <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>
              ) : (
                <p className="text-[11px] text-brand-porcelain/40 mt-1">
                  Recibirá un enlace para crear su propia contraseña. El correo debe ser real.
                </p>
              )}
            </div>
          ) : (
            <p className="text-[11px] text-brand-porcelain/50 bg-white/[0.03] border border-white/10 rounded-xl p-3">
              Se generará un usuario como <span className="text-brand-bronze">nombre.apellido.rol@{STAFF_EMAIL_DOMAIN}</span> y una
              contraseña segura. Los verás una sola vez para entregárselos en mano.
            </p>
          )}

          {error && <p className="text-red-400 text-sm">{error}</p>}

          <div className="flex gap-3 mt-2">
            <button type="button" onClick={onClose} className="flex-1 py-3 bg-white/5 border border-white/10 rounded-xl text-sm font-bold text-white hover:bg-white/10 transition-all">
              Cancelar
            </button>
            <button type="submit" disabled={isSubmitting} className="flex-1 py-3 bg-gradient-to-r from-brand-bronze to-[#FFD700] text-brand-night rounded-xl text-sm font-bold hover:scale-[1.02] transition-all disabled:opacity-60 flex items-center justify-center gap-2">
              {isSubmitting && <Loader2 size={16} className="animate-spin" />}
              Crear usuario
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
