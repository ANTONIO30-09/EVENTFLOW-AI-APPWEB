import { Guest } from "@/features/guests/types";
import { InventoryItem, InventoryStatus, InventoryCategory } from "@/features/inventory/types";

export const peopleOf = (g: Guest) => 1 + (g.companions || 0);

export interface GuestStats {
  guests: number;
  people: number;
  checkedInGuests: number;
  checkedInPeople: number;
  withTable: number;
  withoutPhone: number;
}

export const guestStats = (guests: Guest[]): GuestStats => {
  let people = 0;
  let checkedInGuests = 0;
  let checkedInPeople = 0;
  let withTable = 0;
  let withoutPhone = 0;
  for (const g of guests) {
    const p = peopleOf(g);
    people += p;
    if (g.checkedIn) {
      checkedInGuests += 1;
      checkedInPeople += p;
    }
    if (g.tableNumber) withTable += 1;
    if (!g.phone) withoutPhone += 1;
  }
  return { guests: guests.length, people, checkedInGuests, checkedInPeople, withTable, withoutPhone };
};

export const pct = (part: number, total: number) => (total === 0 ? 0 : Math.round((part / total) * 100));

export interface InventoryStats {
  items: number;
  units: number;
  byStatus: Record<InventoryStatus, { items: number; units: number }>;
  byCategory: { category: InventoryCategory; items: number; units: number }[];
  topUsed: InventoryItem[];
}

export const inventoryStats = (items: InventoryItem[]): InventoryStats => {
  const byStatus: InventoryStats["byStatus"] = {
    disponible: { items: 0, units: 0 },
    en_uso: { items: 0, units: 0 },
    usado: { items: 0, units: 0 },
  };
  const categories = new Map<InventoryCategory, { items: number; units: number }>();
  let units = 0;

  for (const item of items) {
    const q = item.quantity || 0;
    units += q;
    if (byStatus[item.status]) {
      byStatus[item.status].items += 1;
      byStatus[item.status].units += q;
    }
    const current = categories.get(item.category) ?? { items: 0, units: 0 };
    categories.set(item.category, { items: current.items + 1, units: current.units + q });
  }

  const byCategory = Array.from(categories.entries())
    .map(([category, v]) => ({ category, ...v }))
    .sort((a, b) => b.units - a.units);

  const topUsed = items
    .filter((i) => (i.timesUsed ?? 0) > 0)
    .sort((a, b) => (b.timesUsed ?? 0) - (a.timesUsed ?? 0))
    .slice(0, 5);

  return { items: items.length, units, byStatus, byCategory, topUsed };
};
