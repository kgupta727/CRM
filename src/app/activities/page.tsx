"use client";
import { useActivitiesStore, ActivityType, type Activity } from "@/store/activities";
import { useLeadsStore } from "@/store/leads";
import { useEffect, useMemo, useState } from "react";
import Badge from "@/components/Badge";

const types: ActivityType[] = ["call", "meeting", "email", "whatsapp"];

export default function ActivitiesPage() {
  const { activities, addActivity, removeActivity } = useActivitiesStore();
  const leads = useLeadsStore((s) => s.leads);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 200);
    return () => clearTimeout(t);
  }, []);

  // Form state
  const [type, setType] = useState<ActivityType>("call");
  const [leadId, setLeadId] = useState<string | undefined>(undefined);
  const [subject, setSubject] = useState("");
  const [notes, setNotes] = useState("");
  const [outcome, setOutcome] = useState("");

  // Filter
  const [filterType, setFilterType] = useState<ActivityType | "all">("all");

  const onAdd = () => {
    addActivity({ type, leadId, subject, notes, outcome });
    setType("call");
    setLeadId(undefined);
    setSubject("");
    setNotes("");
    setOutcome("");
  };

  // Sorting
  const [sortKey, setSortKey] = useState<keyof Activity>("createdAt");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
  const sortedActivities = useMemo(() => {
    let arr = [...activities];
    if (filterType !== "all") arr = arr.filter((a) => a.type === filterType);
    arr.sort((a, b) => {
      const av = a[sortKey] ?? "";
      const bv = b[sortKey] ?? "";
      const cmp = String(av).localeCompare(String(bv));
      return sortDir === "asc" ? cmp : -cmp;
    });
    return arr;
  }, [activities, sortKey, sortDir, filterType]);

  const toggleSort = (key: keyof Activity) => {
    if (sortKey === key) setSortDir(sortDir === "asc" ? "desc" : "asc");
    else { setSortKey(key); setSortDir("asc"); }
  };

  return (
    <div className="grid gap-6 page">
      <h1 className="text-2xl font-semibold">Activities</h1>
      <div className="card p-4">
        <h2 className="mb-2 font-medium">Log Activity</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          <select className="select" value={type} onChange={(e) => setType(e.target.value as ActivityType)}>
            {types.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
          <select className="select" value={leadId ?? ""} onChange={(e) => setLeadId(e.target.value || undefined)}>
            <option value="">(optional) Link to Lead</option>
            {leads.map((l) => (
              <option key={l.id} value={l.id}>{l.title}</option>
            ))}
          </select>
          <input className="input" placeholder="Subject" value={subject} onChange={(e) => setSubject(e.target.value)} />
          <input className="input" placeholder="Outcome" value={outcome} onChange={(e) => setOutcome(e.target.value)} />
          <textarea className="textarea sm:col-span-2" rows={4} placeholder="Notes" value={notes} onChange={(e) => setNotes(e.target.value)} />
        </div>
        <button className="mt-3 btn btn-primary" onClick={onAdd}>Add</button>
      </div>

      <div className="card p-4">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-medium">Activity Log</h2>
          <select className="select" value={filterType} onChange={(e) => setFilterType(e.target.value as ActivityType | "all")}>
            <option value="all">All Types</option>
            {types.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left p-2"><button className="btn btn-outline px-2 py-1" onClick={() => toggleSort("type")}>Type</button></th>
                <th className="text-left p-2">Lead</th>
                <th className="text-left p-2">Subject</th>
                <th className="text-left p-2">Outcome</th>
                <th className="text-left p-2"><button className="btn btn-outline px-2 py-1" onClick={() => toggleSort("createdAt")}>Created</button></th>
                <th className="text-left p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td className="p-2" colSpan={6}><div className="skeleton h-6 w-full"></div></td></tr>
              ) : sortedActivities.map((a) => (
                <tr key={a.id} className="border-b">
                  <td className="p-2"><Badge text={a.type} variant="info" /></td>
                  <td className="p-2">{leads.find((l) => l.id === a.leadId)?.title || "-"}</td>
                  <td className="p-2">{a.subject || "-"}</td>
                  <td className="p-2">{a.outcome ? <Badge text={a.outcome} variant="warning" /> : "-"}</td>
                  <td className="p-2">{new Date(a.createdAt).toLocaleString()}</td>
                  <td className="p-2"><button className="btn btn-outline px-2 py-1" onClick={() => removeActivity(a.id)}>Delete</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
