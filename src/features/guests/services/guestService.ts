import { collection, addDoc, query, where, getDocs, deleteDoc, doc, updateDoc, writeBatch } from "firebase/firestore";
import { db } from "@/shared/lib/firebase";
import { Guest } from "../types";

export interface NewGuestInput {
  name: string;
  phone: string;
  companions?: number;
  familyGroup?: string;
}

const buildGuestData = (eventId: string, input: NewGuestInput) => ({
  eventId,
  name: input.name,
  phone: input.phone,
  tableNumber: "",
  familyGroup: input.familyGroup ?? "",
  companions: input.companions ?? 0,
  checkedIn: false,
  checkInTime: null,
  createdAt: Date.now(),
});

export const getEventGuests = async (eventId: string) => {
  const q = query(collection(db, "guests"), where("eventId", "==", eventId));
  const snap = await getDocs(q);
  return snap.docs.map((d) => {
    const data = d.data();
    return {
      id: d.id,
      eventId: data.eventId ?? eventId,
      name: data.name ?? "",
      phone: data.phone ?? "",
      tableNumber: data.tableNumber ?? "",
      familyGroup: data.familyGroup ?? "",
      companions: typeof data.companions === "number" ? data.companions : 0,
      checkedIn: data.checkedIn === true,
      checkInTime: data.checkInTime ?? null,
      createdAt: typeof data.createdAt === "number" ? data.createdAt : undefined,
    } as Guest;
  });
};

export const createGuest = async (eventId: string, input: NewGuestInput) => {
  const ref = await addDoc(collection(db, "guests"), buildGuestData(eventId, input));
  return ref.id;
};

export const updateGuest = async (id: string, data: Partial<Guest>) => {
  await updateDoc(doc(db, "guests", id), data);
};

export const deleteGuest = async (id: string) => {
  await deleteDoc(doc(db, "guests", id));
};

// Importacion en lotes (maximo 500 por lote en Firestore; usamos 200)
export const importGuests = async (eventId: string, rows: NewGuestInput[]) => {
  const CHUNK = 200;
  let saved = 0;
  for (let i = 0; i < rows.length; i += CHUNK) {
    const batch = writeBatch(db);
    rows.slice(i, i + CHUNK).forEach((row) => {
      batch.set(doc(collection(db, "guests")), buildGuestData(eventId, row));
    });
    await batch.commit();
    saved += Math.min(CHUNK, rows.length - i);
  }
  return saved;
};
