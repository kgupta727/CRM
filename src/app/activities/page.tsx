"use client";
import { useActivitiesStore, ActivityType } from "@/store/activities";
import { useLeadsStore } from "@/store/leads";
import { useState } from "react";

const types: ActivityType[] = ["call", "meeting", "email", "whatsapp"];

export default function ActivitiesPage() {
  const { activities, addActivity, removeActivity } = useActivitiesStore();
  const leads = useLeadsStore((s) => s.leads);
  const [type, setType] = useState<ActivityType>("call");
  const [leadId, setLeadId] = useState<string | undefined>(undefined);
  const [subject, setSubject] = useState("");
  const [notes, setNotes] = useState("");
  const [outcome, setOutcome] = useState("");

  const onAdd = () => {
    addActivity({ type, leadId, subject, notes, outcome });
    setType("call");
    setLeadId(undefined);
    setSubject("");
    setNotes("");
    setOutcome("");
  };

  return (
    <div className="grid gap-6">
      <h1 className="text-2xl font-semibold">Activities</h1>
      <div className="rounded-lg border bg-white p-4">
        <h2 className="mb-2 font-medium">Log Activity</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          <select className="rounded border p-2" value={type} onChange={(e) => setType(e.target.value as ActivityType)}>
            {types.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
          <select className="rounded border p-2" value={leadId ?? ""} onChange={(e) => setLeadId(e.target.value || undefined)}>
            <option value="">(optional) Link to Lead</option>
            {leads.map((l) => (
              <option key={l.id} value={l.id}>{l.title}</option>
            ))}
          </select>
          <input className="rounded border p-2" placeholder="Subject" value={subject} onChange={(e) => setSubject(e.target.value)} />
          <input className="rounded border p-2" placeholder="Outcome" value={outcome} onChange={(e) => setOutcome(e.target.value)} />
          <textarea className="rounded border p-2 sm:col-span-2" rows={4} placeholder="Notes" value={notes} onChange={(e) => setNotes(e.target.value)} />
        </div>
        <button className="mt-3 rounded bg-black px-4 py-2 text-white" onClick={onAdd}>Add</button>
      </div>

      <div className="rounded-lg border bg-white p-4">
        <h2 className="mb-2 font-medium">Activity Log</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left p-2">Type</th>
                <th className="text-left p-2">Lead</th>
                <th className="text-left p-2">Subject</th>
                <th className="text-left p-2">Outcome</th>
                <th className="text-left p-2">Created</th>
                <th className="text-left p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {activities.map((a) => (
                <tr key={a.id} className="border-b">
                  <td className="p-2">{a.type}</td>
                  <td className="p-2">{leads.find((l) => l.id === a.leadId)?.title || "-"}</td>
                  <td className="p-2">{a.subject || "-"}</td>
                  <td className="p-2">{a.outcome || "-"}</td>
                  <td className="p-2">{new Date(a.createdAt).toLocaleString()}</td>
                  <td className="p-2"><button className="rounded border px-2 py-1" onClick={() => removeActivity(a.id)}>Delete</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
