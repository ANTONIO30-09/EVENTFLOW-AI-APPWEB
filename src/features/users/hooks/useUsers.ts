"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/shared/lib/AuthContext";
import { ManagedUser } from "../types/managed";
import { getManagedUsers, setUserActive } from "../services/userService";

export function useUsers() {
  const { user } = useAuth();
  const [users, setUsers] = useState<ManagedUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [refresh, setRefresh] = useState(0);

  useEffect(() => {
    let isMounted = true;
    const load = async () => {
      if (!user) return;
      await Promise.resolve();
      if (!isMounted) return;
      setLoading(true);
      try {
        const data = await getManagedUsers(user.uid);
        data.sort((a, b) => a.name.localeCompare(b.name));
        if (isMounted) setUsers(data);
      } catch (error) {
        console.error("Error cargando usuarios:", error);
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    load();
    return () => { isMounted = false; };
  }, [user, refresh]);

  const reload = useCallback(() => setRefresh((prev) => prev + 1), []);

  const toggleActive = useCallback(async (u: ManagedUser) => {
    try {
      await setUserActive(u.uid, !u.active);
      setRefresh((prev) => prev + 1);
    } catch (error) {
      console.error("Error al cambiar estado:", error);
    }
  }, []);

  return { users, loading, reload, toggleActive };
}
