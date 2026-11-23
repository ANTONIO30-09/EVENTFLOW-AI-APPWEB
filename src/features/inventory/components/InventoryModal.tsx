"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { X, Loader2 } from "lucide-react";
import { useAuth } from "@/shared/lib/AuthContext";
import { createItem, updateItem } from "../services/inventoryService";
import { InventoryItem, CATEGORY_LABELS, STATUS_LABELS, INVENTORY_CATEGORIES } from "../types";
import { INVENTORY_CATALOG, findCatalogEntry } from "../catalog";

const itemSchema = z.object({
  name: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
  category: z.enum(INVENTORY_CATEGORIES),
  quantity: z.number({ error: "Ingresa una cantidad válida" }).min(1, "La cantidad mínima es 1"),
  status: z.enum(["disponible", "en_uso", "usado"]),
  notes: z.string().optional(),
});

type ItemFormValues = z.infer<typeof itemSchema>;

interface Props {
  onClose: () => void;
  onItemSaved: () => void;
  itemToEdit?: InventoryItem | null;
}

const inputClass =
  "w-full bg-white/[0.04] border border-white/10 rounded-xl py-3 px-4 text-sm text-white placeholder:text-brand-porcelain/40 focus:outline-none focus:border-brand-bronze/60 transition-colors";

export default function InventoryModal({ onClose, onItemSaved, itemToEdit }: Props) {
  const { user } = useAuth();
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<ItemFormValues>({
    resolver: zodResolver(itemSchema),
    defaultValues: itemToEdit
      ? {
          name: itemToEdit.name,
          category: itemToEdit.category,
          quantity: itemToEdit.quantity,
          status: itemToEdit.status,
          notes: itemToEdit.notes ?? "",
        }
      : { category: "mobiliario", status: "disponible", quantity: 1, notes: "" },
  });

  const handleNameChange = (value: string) => {
    const match = findCatalogEntry(value);
    if (match) setValue("category", match.category, { shouldValidate: true });
  };

  const onSubmit = async (data: ItemFormValues) => {
    try {
      setError(null);
      if (!user) throw new Error("No user");
      const payload = { ...data, notes: data.notes ?? "" };

      if (itemToEdit && itemToEdit.id) {
        await updateItem(itemToEdit.id, payload);
      } else {
        await createItem({ ...payload, adminId: user.uid });
      }
      onItemSaved();
      onClose();
    } catch (err) {
      setError("Ocurrió un error. Intenta de nuevo.");
      console.error(err);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="w-full max-w-lg bg-[#0d131f] border border-white/10 rounded-[2rem] shadow-2xl p-8 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">
            {itemToEdit ? "Editar ítem" : "Nuevo ítem"}
          </h2>
          <button onClick={onClose} className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-colors" title="Cerrar">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} autoComplete="off" className="flex flex-col gap-4">
          <div>
            <label className="block text-xs font-bold text-brand-porcelain/60 mb-2">Nombre</label>
            <input type="text" list="inventory-catalog" autoComplete="off" placeholder="Ej: Silla Tiffany (elige una sugerencia o escribe la tuya)" className={inputClass} {...register("name", { onChange: (e) => handleNameChange(e.target.value) })} />
            <datalist id="inventory-catalog">
              {INVENTORY_CATALOG.map((entry) => (
                <option key={entry.name} value={entry.name} />
              ))}
            </datalist>
            {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-brand-porcelain/60 mb-2">Categoría</label>
              <select className={inputClass} {...register("category")}>
                {Object.entries(CATEGORY_LABELS).map(([value, label]) => (
                  <option key={value} value={value} className="bg-[#0d131f]">{label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-brand-porcelain/60 mb-2">Cantidad</label>
              <input type="number" min={1} className={inputClass} {...register("quantity", { valueAsNumber: true })} />
              {errors.quantity ? <p className="text-red-400 text-xs mt-1">{errors.quantity.message}</p> : <p className="text-[11px] text-brand-porcelain/40 mt-1">Se genera un QR por unidad.</p>}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-brand-porcelain/60 mb-2">Estado</label>
            <select className={inputClass} {...register("status")}>
              {Object.entries(STATUS_LABELS).map(([value, label]) => (
                <option key={value} value={value} className="bg-[#0d131f]">{label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-brand-porcelain/60 mb-2">Notas (opcional)</label>
            <textarea rows={3} placeholder="Detalles, ubicación en bodega, estado físico..." className={`${inputClass} resize-none`} {...register("notes")} />
          </div>

          {error && <p className="text-red-400 text-sm">{error}</p>}

          <div className="flex gap-3 mt-2">
            <button type="button" onClick={onClose} className="flex-1 py-3 bg-white/5 border border-white/10 rounded-xl text-sm font-bold text-white hover:bg-white/10 transition-all">
              Cancelar
            </button>
            <button type="submit" disabled={isSubmitting} className="flex-1 py-3 bg-gradient-to-r from-brand-bronze to-[#FFD700] text-brand-night rounded-xl text-sm font-bold hover:scale-[1.02] transition-all disabled:opacity-60 flex items-center justify-center gap-2">
              {isSubmitting && <Loader2 size={16} className="animate-spin" />}
              {itemToEdit ? "Guardar cambios" : "Crear ítem"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
