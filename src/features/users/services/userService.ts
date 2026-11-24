import { getApps, initializeApp } from "firebase/app";
import {
  createUserWithEmailAndPassword,
  deleteUser,
  getAuth,
  sendPasswordResetEmail,
  signOut,
  updateProfile,
} from "firebase/auth";
import {
  arrayRemove,
  arrayUnion,
  collection,
  doc,
  getDocs,
  query,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { app, auth, db } from "@/shared/lib/firebase";
import { AccessType, ManagedRole, ManagedUser } from "../types/managed";
import { buildUsername, generatePassword } from "../lib/credentials";

// Segunda instancia: crear cuentas aqui NO cierra la sesion del admin.
const getSecondaryAuth = () => {
  const existing = getApps().find((a) => a.name === "secondary");
  return getAuth(existing ?? initializeApp(app.options, "secondary"));
};

export interface CreateUserInput {
  name: string;
  role: ManagedRole;
  accessType: AccessType;
  email?: string;
  adminId: string;
}

export interface CreatedUser {
  uid: string;
  loginEmail: string;
  accessType: AccessType;
  password?: string; // solo cuentas sin correo; se muestra una vez
  emailSent: boolean;
}

const errorCode = (err: unknown) =>
  typeof err === "object" && err !== null && "code" in err ? String((err as { code: unknown }).code) : "";

export const createManagedUser = async (input: CreateUserInput): Promise<CreatedUser> => {
  const secondaryAuth = getSecondaryAuth();
  const password = generatePassword();
  const name = input.name.trim();

  let cred;
  let loginEmail = "";

  if (input.accessType === "email") {
    loginEmail = (input.email ?? "").trim().toLowerCase();
    cred = await createUserWithEmailAndPassword(secondaryAuth, loginEmail, password);
  } else {
    let lastError: unknown = null;
    for (let attempt = 1; attempt <= 30; attempt++) {
      loginEmail = buildUsername(name, input.role, attempt);
      try {
        cred = await createUserWithEmailAndPassword(secondaryAuth, loginEmail, password);
        break;
      } catch (err) {
        lastError = err;
        if (errorCode(err) !== "auth/email-already-in-use") throw err;
      }
    }
    if (!cred) throw lastError ?? new Error("No se pudo generar un usuario unico");
  }

  try {
    try {
      await updateProfile(cred.user, { displayName: name });
    } catch {
      // el nombre real vive en Firestore; esto es solo cosmetico
    }
    // El perfil lo escribe la sesion del admin (las reglas exigen adminId == su UID)
    await setDoc(doc(db, "profiles", cred.user.uid), {
      uid: cred.user.uid,
      name,
      email: loginEmail,
      role: input.role,
      active: true,
      adminId: input.adminId,
      accessType: input.accessType,
      mustChangePassword: input.accessType === "username",
      createdAt: Date.now(),
    });
  } catch (err) {
    // Rollback: no dejar una cuenta de Auth sin perfil
    try {
      await deleteUser(cred.user);
    } catch {
      // si falla, queda para limpiar en la consola
    }
    await signOut(secondaryAuth).catch(() => {});
    throw err;
  }

  const uid = cred.user.uid;
  await signOut(secondaryAuth).catch(() => {});

  let emailSent = false;
  if (input.accessType === "email") {
    try {
      await sendPasswordResetEmail(auth, loginEmail);
      emailSent = true;
    } catch {
      emailSent = false;
    }
  }

  return {
    uid,
    loginEmail,
    accessType: input.accessType,
    password: input.accessType === "username" ? password : undefined,
    emailSent,
  };
};

export const getManagedUsers = async (adminId: string) => {
  const q = query(collection(db, "profiles"), where("adminId", "==", adminId));
  const snap = await getDocs(q);
  return snap.docs.map((d) => {
    const data = d.data();
    return {
      uid: d.id,
      name: data.name ?? data.displayName ?? "",
      email: data.email ?? "",
      role: data.role ?? "",
      active: data.active === true,
      adminId: data.adminId ?? adminId,
      accessType: data.accessType,
      mustChangePassword: data.mustChangePassword === true,
      createdAt: typeof data.createdAt === "number" ? data.createdAt : undefined,
    } as ManagedUser;
  });
};

export const setUserActive = async (uid: string, active: boolean) => {
  await updateDoc(doc(db, "profiles", uid), { active });
};

export const resendInvite = async (email: string) => {
  await sendPasswordResetEmail(auth, email);
};

export const assignUserToEvent = async (eventId: string, uid: string) => {
  await updateDoc(doc(db, "events", eventId), { assignedUserIds: arrayUnion(uid) });
};

export const unassignUserFromEvent = async (eventId: string, uid: string) => {
  await updateDoc(doc(db, "events", eventId), { assignedUserIds: arrayRemove(uid) });
};
