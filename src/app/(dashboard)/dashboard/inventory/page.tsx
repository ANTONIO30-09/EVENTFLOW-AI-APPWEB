"use client";

import { useMemo, useState } from "react";
import { Plus, Search, Loader2, Package, SearchX, QrCode, Edit, Trash2, RefreshCw } from "lucide-react";
import { motion } from "framer-motion";
import { useInventory } from "@/features/inventory/hooks/useInventory";
import InventoryModal from "@/features/inventory/components/InventoryModal";
import QRModal from "@/features/inventory/components/QRModal";
import {
  InventoryItem,
  InventoryCategory,
  InventoryStatus,
  CATEGORY_LABELS,
  STATUS_LABELS,
  NEXT_STATUS_ACTION,
} from "@/features/inventory/types";

const STATUS_STYLES: Record<InventoryStatus, string> = {
  disponible: "bg-green-500/15 text-green-400 border-green-500/30",
  en_uso: "bg-blue-500/15 text-blue-400 border-blue-500/30",
  usado: "bg-white/10 text-brand-porcelain/60 border-white/15",
};

export default function InventoryPage() {
  const { items, loading, reload, removeItem, advanceStatus } = useInventory();
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<InventoryCategory | "todas">("todas");
  const [statusFilter, setStatusFilter] = useState<InventoryStatus | "todos">("todos");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [itemToEdit, setItemToEdit] = useState<InventoryItem | null>(null);
  const [qrItem, setQrItem] = useState<InventoryItem | null>(null);

  const totalUnits = useMemo(() => items.reduce((sum, i) => sum + (i.quantity || 0), 0), [items]);
  const inUseCount = useMemo(() => items.filter((i) => i.status === "en_uso").length, [items]);

  const filteredItems = useMemo(() => {
    const term = search.trim().toLowerCase();
    return items.filter((i) => {
      const matchesCategory = categoryFilter === "todas" || i.category === categoryFilter;
      const matchesStatus = statusFilter === "todos" || i.status === statusFilter;
      const matchesText =
        term === "" ||
        i.name.toLowerCase().includes(term) ||
        (i.notes ?? "").toLowerCase().includes(term);
      return matchesCategory && matchesStatus && matchesText;
    });
  }, [items, search, categoryFilter, statusFilter]);

  const handleOpenCreate = () => {
    setItemToEdit(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: InventoryItem) => {
    setItemToEdit(item);
    setIsModalOpen(true);
  };

  const selectClass =
    "bg-white/[0.04] border border-white/10 rounded-xl py-3 px-4 text-sm text-white focus:outline-none focus:border-brand-bronze/60 transition-colors";

  const kpis = [
    { label: "Ítems registrados", value: items.length },
    { label: "Unidades totales", value: totalUnits },
    { label: "Ítems en uso", value: inUseCount },
  ];

  return (
    <div className="max-w-7xl mx-auto flex flex-col gap-6 relative px-6 py-8 md:px-10 md:py-10 overflow-x-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-[-5%] left-[10%] w-[600px] h-[600px] bg-brand-bronze/15 rounded-full blur-[140px]" />
        <div className="absolute top-[20%] right-[-10%] w-[500px] h-[500px] bg-green-600/10 rounded-full blur-[140px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex justify-between items-end pt-4"
      >
        <div>
          <h1 className="text-4xl font-black text-white mb-2 tracking-tight drop-shadow-lg">Inventario y QRs</h1>
          <p className="text-brand-porcelain/60">Controla tu stock y reutiliza lo que ya usaste en eventos anteriores.</p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="group flex items-center gap-2 bg-gradient-to-r from-brand-bronze to-[#FFD700] text-brand-night font-bold py-3 px-6 rounded-xl hover:scale-105 transition-all shadow-[0_0_30px_rgba(184,134,62,0.4)] overflow-hidden relative"
        >
          <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/40 to-transparent group-hover:translate-x-full transition-transform duration-700 ease-in-out" />
          <Plus size={20} className="relative z-10" />
          <span className="relative z-10">Nuevo Ítem</span>
        </button>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {kpis.map((kpi) => (
          <div key={kpi.label} className="bg-white/[0.04] backdrop-blur-2xl border border-white/10 p-6 rounded-[2rem] shadow-[0_8px_32px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.1)]">
            <p className="text-sm text-brand-porcelain/50 font-medium mb-1">{kpi.label}</p>
            <p className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-br from-white to-white/60">{kpi.value}</p>
          </div>
        ))}
      </div>

      <div className="flex flex-col lg:flex-row gap-4 lg:items-center">
        <div className="relative w-full lg:max-w-md">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-porcelain/40" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por nombre o notas..."
            className="w-full bg-white/[0.04] border border-white/10 rounded-xl py-3 pl-11 pr-4 text-sm text-white placeholder:text-brand-porcelain/40 focus:outline-none focus:border-brand-bronze/60 transition-colors"
          />
        </div>
        <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value as InventoryCategory | "todas")} className={selectClass}>
          <option value="todas" className="bg-[#0d131f]">Todas las categorías</option>
          {Object.entries(CATEGORY_LABELS).map(([value, label]) => (
            <option key={value} value={value} className="bg-[#0d131f]">{label}</option>
          ))}
        </select>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as InventoryStatus | "todos")} className={selectClass}>
          <option value="todos" className="bg-[#0d131f]">Todos los estados</option>
          {Object.entries(STATUS_LABELS).map(([value, label]) => (
            <option key={value} value={value} className="bg-[#0d131f]">{label}</option>
          ))}
        </select>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><Loader2 className="animate-spin text-brand-bronze" size={40} /></div>
      ) : items.length === 0 ? (
        <div className="bg-white/[0.04] backdrop-blur-2xl border border-white/10 rounded-[2.5rem] p-16 flex flex-col items-center justify-center text-center min-h-[350px]">
          <div className="w-24 h-24 bg-gradient-to-br from-brand-bronze/20 to-transparent rounded-full flex items-center justify-center mb-6 border border-brand-bronze/30">
            <Package size={36} className="text-brand-bronze" />
          </div>
          <h3 className="text-2xl font-bold text-white mb-3">Tu inventario está vacío</h3>
          <p className="text-brand-porcelain/50 max-w-md mb-8 text-sm">Registra tu primer ítem para llevar el control de tu stock y generar su código QR.</p>
          <button onClick={handleOpenCreate} className="flex items-center gap-2 bg-white/5 border border-white/10 text-white font-bold py-3 px-8 rounded-xl hover:bg-white/10 hover:border-brand-bronze transition-all">
            <Plus size={18} className="text-brand-bronze" />
            Agregar mi primer ítem
          </button>
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="bg-white/[0.04] backdrop-blur-2xl border border-white/10 rounded-[2.5rem] p-12 flex flex-col items-center justify-center text-center min-h-[250px]">
          <SearchX size={36} className="text-brand-porcelain/40 mb-4" />
          <h3 className="text-xl font-bold text-white mb-2">Sin resultados</h3>
          <p className="text-brand-porcelain/50 text-sm">Prueba con otro texto o cambia los filtros.</p>
        </div>
      ) : (
        <div className="bg-white/[0.04] backdrop-blur-2xl border border-white/10 rounded-[2rem] overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.3)]">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm min-w-[820px]">
              <thead>
                <tr className="text-xs uppercase tracking-wider text-brand-porcelain/50 border-b border-white/10">
                  <th className="px-6 py-4 font-bold">Ítem</th>
                  <th className="px-4 py-4 font-bold">Categoría</th>
                  <th className="px-4 py-4 font-bold">Cant.</th>
                  <th className="px-4 py-4 font-bold">Estado</th>
                  <th className="px-4 py-4 font-bold">Usos</th>
                  <th className="px-6 py-4 font-bold text-right">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredItems.map((item) => (
                  <tr key={item.id} className="border-b border-white/5 last:border-0 hover:bg-white/[0.03] transition-colors">
                    <td className="px-6 py-4">
                      <p className="font-bold text-white">{item.name}</p>
                      {item.notes && <p className="text-xs text-brand-porcelain/50 truncate max-w-[260px]">{item.notes}</p>}
                    </td>
                    <td className="px-4 py-4 text-brand-porcelain/70">{CATEGORY_LABELS[item.category]}</td>
                    <td className="px-4 py-4 text-white font-bold">{item.quantity}</td>
                    <td className="px-4 py-4">
                      <span className={`px-3 py-1 rounded-full text-[11px] font-bold border ${STATUS_STYLES[item.status]}`}>
                        {STATUS_LABELS[item.status]}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-brand-porcelain/70">{item.timesUsed ?? 0}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => advanceStatus(item)}
                          className="px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-xs font-bold text-white hover:bg-brand-bronze/20 hover:border-brand-bronze/50 transition-all flex items-center gap-1.5"
                        >
                          <RefreshCw size={13} className="text-brand-bronze" />
                          {NEXT_STATUS_ACTION[item.status]}
                        </button>
                        <button onClick={() => setQrItem(item)} className="p-2.5 bg-white/5 rounded-full hover:bg-brand-bronze/20 hover:text-brand-bronze transition-all text-white/50 border border-white/10" title="Ver QR">
                          <QrCode size={16} />
                        </button>
                        <button onClick={() => handleOpenEdit(item)} className="p-2.5 bg-white/5 rounded-full hover:bg-brand-bronze/20 hover:text-brand-bronze transition-all text-white/50 border border-white/10" title="Editar">
                          <Edit size={16} />
                        </button>
                        <button onClick={() => removeItem(item.id)} className="p-2.5 bg-white/5 rounded-full hover:bg-red-500/20 hover:text-red-400 transition-all text-white/50 border border-white/10" title="Eliminar">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {isModalOpen && (
        <InventoryModal
          onClose={() => setIsModalOpen(false)}
          onItemSaved={reload}
          itemToEdit={itemToEdit}
        />
      )}

      {qrItem && <QRModal item={qrItem} onClose={() => setQrItem(null)} />}
    </div>
  );
}
