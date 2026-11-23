import { collection, addDoc, query, where, getDocs, deleteDoc, doc, updateDoc } from "firebase/firestore";
import { db } from "@/shared/lib/firebase";
import { InventoryItem } from "../types";

export const createItem = async (
  itemData: Omit<InventoryItem, "id" | "createdAt" | "timesUsed">
) => {
  const itemsRef = collection(db, "inventory");
  const docRef = await addDoc(itemsRef, {
    ...itemData,
    timesUsed: itemData.status === "en_uso" ? 1 : 0,
    createdAt: Date.now(),
  });
  return docRef.id;
};

export const updateItem = async (id: string, data: Partial<InventoryItem>) => {
  const docRef = doc(db, "inventory", id);
  await updateDoc(docRef, data);
};

export const getUserInventory = async (organizerId: string) => {
  const itemsRef = collection(db, "inventory");
  const q = query(itemsRef, where("organizerId", "==", organizerId));
  const snapshot = await getDocs(q);

  return snapshot.docs.map((d) => ({
    id: d.id,
    ...d.data(),
  })) as InventoryItem[];
};

export const deleteItem = async (itemId: string) => {
  await deleteDoc(doc(db, "inventory", itemId));
};
