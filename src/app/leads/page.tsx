"use client";
import { useLeadsStore, LeadStatus, LeadSource } from "@/store/leads";
import { useState } from "react";

const statuses: LeadStatus[] = ["new", "contacted", "qualified", "won", "lost"];
const sources: LeadSource[] = ["website", "referral", "inbound", "outbound", "event", "other"];

export default function LeadsPage() {
  const { leads, addLead, removeLead } = useLeadsStore();
  const [title, setTitle] = useState("");
  const [contactName, setContactName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [status, setStatus] = useState<LeadStatus>("new");
  const [source, setSource] = useState<LeadSource>("website");

  const onAdd = () => {
    if (!title.trim()) return;
    addLead({ title, contactName, email, phone, status, source });
    setTitle("");
    setContactName("");
    setEmail("");
    setPhone("");
    setStatus("new");
    setSource("website");
  };

  return (
    <div className="grid gap-6">
      <h1 className="text-2xl font-semibold">Leads</h1>
      <div className="rounded-lg border bg-white p-4">
        <h2 className="mb-2 font-medium">Add Lead</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          <input className="rounded border p-2" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
          <input className="rounded border p-2" placeholder="Contact Name" value={contactName} onChange={(e) => setContactName(e.target.value)} />
          <input className="rounded border p-2" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <input className="rounded border p-2" placeholder="Phone" value={phone} onChange={(e) => setPhone(e.target.value)} />
          <select className="rounded border p-2" value={status} onChange={(e) => setStatus(e.target.value as LeadStatus)}>
            {statuses.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
          <select className="rounded border p-2" value={source} onChange={(e) => setSource(e.target.value as LeadSource)}>
            {sources.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
        <button className="mt-3 rounded bg-black px-4 py-2 text-white" onClick={onAdd}>Add</button>
      </div>

      <div className="rounded-lg border bg-white p-4">
        <h2 className="mb-2 font-medium">Lead List</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left p-2">Title</th>
                <th className="text-left p-2">Contact</th>
                <th className="text-left p-2">Status</th>
                <th className="text-left p-2">Source</th>
                <th className="text-left p-2">Created</th>
                <th className="text-left p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {leads.map((l) => (
                <tr key={l.id} className="border-b">
                  <td className="p-2">{l.title}</td>
                  <td className="p-2">{l.contactName || "-"}</td>
                  <td className="p-2">{l.status}</td>
                  <td className="p-2">{l.source}</td>
                  <td className="p-2">{new Date(l.createdAt).toLocaleString()}</td>
                  <td className="p-2">
                    <button className="rounded border px-2 py-1" onClick={() => removeLead(l.id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
