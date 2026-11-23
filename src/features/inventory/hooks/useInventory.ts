"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/shared/lib/AuthContext";
import { InventoryItem, NEXT_STATUS } from "../types";
import { getUserInventory, deleteItem, updateItem } from "../services/inventoryService";

export function useInventory() {
  const { user } = useAuth();
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refresh, setRefresh] = useState(0);

  useEffect(() => {
    let isMounted = true;
    const loadItems = async () => {
      if (!user) return;
      await Promise.resolve();
      if (!isMounted) return;
      setLoading(true);
      try {
        const data = await getUserInventory(user.uid);
        data.sort((a, b) => a.name.localeCompare(b.name));
        if (isMounted) setItems(data);
      } catch (error) {
        console.error("Error cargando inventario:", error);
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    loadItems();
    return () => { isMounted = false; };
  }, [user, refresh]);

  const reload = useCallback(() => setRefresh((prev) => prev + 1), []);

  const removeItem = useCallback(async (id?: string) => {
    if (!id) return;
    const ok = window.confirm("¿Eliminar este ítem del inventario? Esta acción no se puede deshacer.");
    if (!ok) return;
    try {
      await deleteItem(id);
      setRefresh((prev) => prev + 1);
    } catch (error) {
      console.error("Error al eliminar ítem:", error);
    }
  }, []);

  const advanceStatus = useCallback(async (item: InventoryItem) => {
    if (!item.id) return;
    const next = NEXT_STATUS[item.status];
    try {
      await updateItem(item.id, {
        status: next,
        timesUsed: next === "en_uso" ? (item.timesUsed ?? 0) + 1 : (item.timesUsed ?? 0),
      });
      setRefresh((prev) => prev + 1);
    } catch (error) {
      console.error("Error al cambiar estado:", error);
    }
  }, []);

  return { items, loading, reload, removeItem, advanceStatus };
}
