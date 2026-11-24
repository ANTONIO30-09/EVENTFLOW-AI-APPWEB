"use client";

import { useState, useEffect, useCallback } from "react";
import { Guest } from "../types";
import { getEventGuests, deleteGuest } from "../services/guestService";

export function useGuests(eventId: string | undefined) {
  const [guests, setGuests] = useState<Guest[]>([]);
  const [loading, setLoading] = useState(true);
  const [refresh, setRefresh] = useState(0);

  useEffect(() => {
    let isMounted = true;
    const load = async () => {
      if (!eventId) return;
      await Promise.resolve();
      if (!isMounted) return;
      setLoading(true);
      try {
        const data = await getEventGuests(eventId);
        data.sort((a, b) => a.name.localeCompare(b.name));
        if (isMounted) setGuests(data);
      } catch (error) {
        console.error("Error cargando invitados:", error);
        if (isMounted) setGuests([]);
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    load();
    return () => { isMounted = false; };
  }, [eventId, refresh]);

  const reload = useCallback(() => setRefresh((prev) => prev + 1), []);

  const removeGuest = useCallback(async (id?: string) => {
    if (!id) return;
    const ok = window.confirm("¿Eliminar este invitado? Esta acción no se puede deshacer.");
    if (!ok) return;
    try {
      await deleteGuest(id);
      setRefresh((prev) => prev + 1);
    } catch (error) {
      console.error("Error al eliminar invitado:", error);
    }
  }, []);

  return { guests: eventId ? guests : [], loading: eventId ? loading : false, reload, removeGuest };
}
