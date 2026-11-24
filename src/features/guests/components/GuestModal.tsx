"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { X, Loader2 } from "lucide-react";
import { Guest } from "../types";
import { createGuest, updateGuest } from "../services/guestService";
import { normalizePhone } from "../lib/parseGuests";

const schema = z.object({
  name: z.string().trim().min(3, "Escribe el nombre completo"),
  phone: z.string().optional(),
  companions: z.number({ error: "Ingresa un número válido" }).int("Debe ser un número entero").min(0, "No puede ser negativo").max(20, "Máximo 20"),
  familyGroup: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

interface Props {
  eventId: string;
  guestToEdit?: Guest | null;
  onClose: () => void;
  onSaved: () => void;
}

const inputClass =
  "w-full bg-white/[0.04] border border-white/10 rounded-xl py-3 px-4 text-sm text-white placeholder:text-brand-porcelain/40 focus:outline-none focus:border-brand-bronze/60 transition-colors";

export default function GuestModal({ eventId, guestToEdit, onClose, onSaved }: Props) {
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: guestToEdit
      ? {
          name: guestToEdit.name,
          phone: guestToEdit.phone ?? "",
          companions: guestToEdit.companions,
          familyGroup: guestToEdit.familyGroup,
        }
      : { name: "", phone: "", companions: 0, familyGroup: "" },
  });

  const onSubmit = async (data: FormValues) => {
    try {
      setError(null);
      const phone = data.phone && data.phone.trim() !== "" ? normalizePhone(data.phone).phone : "";
      const payload = {
        name: data.name.trim(),
        phone,
        companions: data.companions,
        familyGroup: (data.familyGroup ?? "").trim(),
      };
      if (guestToEdit && guestToEdit.id) {
        await updateGuest(guestToEdit.id, payload);
      } else {
        await createGuest(eventId, payload);
      }
      onSaved();
      onClose();
    } catch (err) {
      console.error(err);
      setError("Ocurrió un error. Intenta de nuevo.");
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="w-full max-w-lg bg-[#0d131f] border border-white/10 rounded-[2rem] shadow-2xl p-8 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">{guestToEdit ? "Editar invitado" : "Nuevo invitado"}</h2>
          <button onClick={onClose} className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-colors" title="Cerrar">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} autoComplete="off" className="flex flex-col gap-4">
          <div>
            <label className="block text-xs font-bold text-brand-porcelain/60 mb-2">Nombre completo</label>
            <input type="text" placeholder="Ej: Juan Pérez" className={inputClass} {...register("name")} />
            {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name.message}</p>}
          </div>

          <div>
            <label className="block text-xs font-bold text-brand-porcelain/60 mb-2">Teléfono / WhatsApp (opcional)</label>
            <input type="text" placeholder="70123456" className={inputClass} {...register("phone")} />
            <p className="text-[11px] text-brand-porcelain/40 mt-1">Si son 8 dígitos se guarda como +591.</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-brand-porcelain/60 mb-2">Acompañantes</label>
              <input type="number" min={0} className={inputClass} {...register("companions", { valueAsNumber: true })} />
              {errors.companions && <p className="text-red-400 text-xs mt-1">{errors.companions.message}</p>}
            </div>
            <div>
              <label className="block text-xs font-bold text-brand-porcelain/60 mb-2">Grupo familiar</label>
              <input type="text" placeholder="Ej: Familia Pérez" className={inputClass} {...register("familyGroup")} />
            </div>
          </div>

          {error && <p className="text-red-400 text-sm">{error}</p>}

          <div className="flex gap-3 mt-2">
            <button type="button" onClick={onClose} className="flex-1 py-3 bg-white/5 border border-white/10 rounded-xl text-sm font-bold text-white hover:bg-white/10 transition-all">
              Cancelar
            </button>
            <button type="submit" disabled={isSubmitting} className="flex-1 py-3 bg-gradient-to-r from-brand-bronze to-[#FFD700] text-brand-night rounded-xl text-sm font-bold hover:scale-[1.02] transition-all disabled:opacity-60 flex items-center justify-center gap-2">
              {isSubmitting && <Loader2 size={16} className="animate-spin" />}
              {guestToEdit ? "Guardar cambios" : "Agregar invitado"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
