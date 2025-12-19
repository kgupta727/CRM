import { create } from "zustand";
import { persist } from "zustand/middleware";

export type LeadStatus = "new" | "contacted" | "qualified" | "won" | "lost";
export type LeadSource = "website" | "referral" | "inbound" | "outbound" | "event" | "other";

export interface Lead {
  id: string;
  title: string;
  contactName?: string;
  email?: string;
  phone?: string;
  status: LeadStatus;
  source: LeadSource;
  createdAt: string; // ISO
}

interface LeadsState {
  leads: Lead[];
  addLead: (lead: Omit<Lead, "id" | "createdAt">) => void;
  updateLead: (id: string, patch: Partial<Lead>) => void;
  removeLead: (id: string) => void;
  clear: () => void;
}

export const useLeadsStore = create<LeadsState>()(
  persist(
    (set) => ({
      leads: [],
      addLead: (lead) =>
        set((state) => ({
          leads: [
            {
              id: crypto.randomUUID(),
              createdAt: new Date().toISOString(),
              ...lead,
            },
            ...state.leads,
          ],
        })),
      updateLead: (id, patch) =>
        set((state) => ({
          leads: state.leads.map((l) => (l.id === id ? { ...l, ...patch } : l)),
        })),
      removeLead: (id) => set((state) => ({ leads: state.leads.filter((l) => l.id !== id) })),
      clear: () => set({ leads: [] }),
    }),
    { name: "crm-leads" }
  )
);
