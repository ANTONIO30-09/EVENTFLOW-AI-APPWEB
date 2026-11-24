export interface Guest {
  id?: string;
  eventId: string;
  name: string;
  phone?: string;
  tableNumber: string;
  familyGroup: string;
  companions: number;
  checkedIn: boolean;
  checkInTime?: string | null;
  createdAt?: number;
}
