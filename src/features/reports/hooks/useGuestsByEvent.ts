"use client";

import { useEffect, useMemo, useState, useCallback } from "react";
import { AdminEvent } from "@/features/events/types";
import { Guest } from "@/features/guests/types";
import { getEventGuests } from "@/features/guests/services/guestService";

export function useGuestsByEvent(events: AdminEvent[]) {
  const [byEvent, setByEvent] = useState<Record<string, Guest[]>>({});
  const [loading, setLoading] = useState(true);
  const [refresh, setRefresh] = useState(0);

  const ids = useMemo(() => events.map((e) => e.id).filter((id): id is string => Boolean(id)), [events]);

  useEffect(() => {
    let isMounted = true;
    const load = async () => {
      await Promise.resolve();
      if (!isMounted) return;
      setLoading(true);
      try {
        const entries = await Promise.all(ids.map(async (id) => [id, await getEventGuests(id)] as const));
        if (isMounted) setByEvent(Object.fromEntries(entries));
      } catch (error) {
        console.error("Error cargando invitados para reportes:", error);
        if (isMounted) setByEvent({});
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    load();
    return () => { isMounted = false; };
  }, [ids, refresh]);

  const reload = useCallback(() => setRefresh((prev) => prev + 1), []);

  return { byEvent, loading, reload };
}
