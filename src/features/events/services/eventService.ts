import { collection, addDoc, query, where, getDocs, deleteDoc, doc, updateDoc } from "firebase/firestore";
import { db } from "@/shared/lib/firebase";
import { AdminEvent } from "../types";

export const createEvent = async (eventData: Omit<AdminEvent, "id" | "createdAt">) => {
  const eventsRef = collection(db, "events");
  const docRef = await addDoc(eventsRef, {
    ...eventData,
    createdAt: Date.now(),
  });
  return docRef.id;
};

export const updateEvent = async (id: string, data: Partial<AdminEvent>) => {
  const docRef = doc(db, "events", id);
  await updateDoc(docRef, data);
};

export const getUserEvents = async (organizerId: string) => {
  const eventsRef = collection(db, "events");
  const q = query(eventsRef, where("organizerId", "==", organizerId));
  const querySnapshot = await getDocs(q);
  
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  })) as AdminEvent[];
};

export const deleteEvent = async (eventId: string) => {
  await deleteDoc(doc(db, "events", eventId));
};
