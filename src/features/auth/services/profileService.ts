import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "@/shared/lib/firebase";
import { UserProfile, UserRole } from "../types";

const ROLES: UserRole[] = ["admin", "organizador", "staff", "pendiente"];

export const getProfile = async (uid: string): Promise<UserProfile | null> => {
  const snap = await getDoc(doc(db, "profiles", uid));
  if (!snap.exists()) return null;
  const d = snap.data();
  const role: UserRole = ROLES.includes(d.role) ? d.role : "pendiente";
  return {
    uid,
    name: d.name ?? d.displayName ?? "",
    email: d.email ?? "",
    role,
    active: d.active === true,
    adminId: typeof d.adminId === "string" ? d.adminId : undefined,
  };
};

// Si el perfil esta pendiente pero el correo ya fue autorizado, las reglas
// permiten pasarlo a admin. Si no esta autorizado, la regla lo rechaza.
export const tryPromoteToAdmin = async (uid: string): Promise<boolean> => {
  try {
    await updateDoc(doc(db, "profiles", uid), { role: "admin", active: true });
    return true;
  } catch {
    return false;
  }
};
