"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/shared/lib/AuthContext";
import { AdminEvent } from "../types";
import { getUserEvents, deleteEvent } from "../services/eventService";

export function useEvents() {
  const { user } = useAuth();
  const [events, setEvents] = useState<AdminEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [refresh, setRefresh] = useState(0);

  useEffect(() => {
    let isMounted = true;
    const loadEvents = async () => {
      if (!user) return;
      await Promise.resolve();
      if (!isMounted) return;
      setLoading(true);
      try {
        const data = await getUserEvents(user.uid);
        data.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
        if (isMounted) setEvents(data);
      } catch (error) {
        console.error("Error cargando eventos:", error);
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    loadEvents();
    return () => { isMounted = false; };
  }, [user, refresh]);

  const reload = useCallback(() => setRefresh((prev) => prev + 1), []);

  const removeEvent = useCallback(async (id?: string) => {
    if (!id) return;
    const ok = window.confirm("¿Estás seguro de que deseas eliminar este evento? Esta acción no se puede deshacer.");
    if (!ok) return;
    try {
      await deleteEvent(id);
      setRefresh((prev) => prev + 1);
    } catch (error) {
      console.error("Error al eliminar:", error);
    }
  }, []);

  return { events, loading, reload, removeEvent };
}
