import type { Lead } from "@/store/leads";
import type { Activity } from "@/store/activities";

export const sampleLeads: Lead[] = [
  {
    id: "seed-1",
    title: "Acme Corp Website Inquiry",
    contactName: "Jane Doe",
    email: "jane@example.com",
    status: "new",
    source: "website",
    phone: "+1-555-555",
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
  {
    id: "seed-2",
    title: "Referral: Beta Ltd",
    contactName: "John Smith",
    status: "qualified",
    source: "referral",
    email: "john@beta.com",
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
  },
];

export const sampleActivities: Activity[] = [
  {
    id: "act-1",
    type: "call",
    leadId: "seed-1",
    subject: "Initial discovery call",
    outcome: "interested",
    notes: "Discussed product fit and pricing",
    createdAt: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: "act-2",
    type: "email",
    leadId: "seed-2",
    subject: "Proposal sent",
    outcome: "awaiting-reply",
    createdAt: new Date().toISOString(),
  },
];
