import { create } from "zustand";
import { persist } from "zustand/middleware";

export type ActivityType = "call" | "meeting" | "email" | "whatsapp";

export interface Activity {
  id: string;
  type: ActivityType;
  leadId?: string;
  subject?: string;
  notes?: string;
  outcome?: string;
  scheduledAt?: string; // ISO
  createdAt: string; // ISO
}

interface ActivitiesState {
  activities: Activity[];
  addActivity: (activity: Omit<Activity, "id" | "createdAt">) => void;
  removeActivity: (id: string) => void;
  clear: () => void;
}

export const useActivitiesStore = create<ActivitiesState>()(
  persist(
    (set) => ({
      activities: [],
      addActivity: (activity) =>
        set((state) => ({
          activities: [
            {
              id: crypto.randomUUID(),
              createdAt: new Date().toISOString(),
              ...activity,
            },
            ...state.activities,
          ],
        })),
      removeActivity: (id) => set((state) => ({ activities: state.activities.filter((a) => a.id !== id) })),
      clear: () => set({ activities: [] }),
    }),
    { name: "crm-activities" }
  )
);
