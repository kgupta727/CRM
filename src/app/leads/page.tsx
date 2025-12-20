"use client";
import { useLeadsStore, LeadStatus, LeadSource, type Lead } from "@/store/leads";
import Badge from "@/components/Badge";
import { useEffect, useMemo, useState } from "react";

const statuses: LeadStatus[] = ["new", "contacted", "qualified", "won", "lost"];
const sources: LeadSource[] = ["website", "referral", "inbound", "outbound", "event", "other"];

export default function LeadsPage() {
  const { leads, addLead, removeLead } = useLeadsStore();
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 200);
    return () => clearTimeout(t);
  }, []);

  // Form state
  const [title, setTitle] = useState("");
  const [contactName, setContactName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [status, setStatus] = useState<LeadStatus>("new");
  const [source, setSource] = useState<LeadSource>("website");

  // Filters
  const [filterStatus, setFilterStatus] = useState<LeadStatus | "all">("all");
  const [filterSource, setFilterSource] = useState<LeadSource | "all">("all");

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

  // Sorting
  const [sortKey, setSortKey] = useState<keyof Lead>("createdAt");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
  const sortedLeads = useMemo(() => {
    let arr = [...leads];
    if (filterStatus !== "all") arr = arr.filter((l) => l.status === filterStatus);
    if (filterSource !== "all") arr = arr.filter((l) => l.source === filterSource);
    arr.sort((a, b) => {
      const av = a[sortKey] ?? "";
      const bv = b[sortKey] ?? "";
      const cmp = String(av).localeCompare(String(bv));
      return sortDir === "asc" ? cmp : -cmp;
    });
    return arr;
  }, [leads, sortKey, sortDir, filterStatus, filterSource]);

  const toggleSort = (key: keyof Lead) => {
    if (sortKey === key) setSortDir(sortDir === "asc" ? "desc" : "asc");
    else { setSortKey(key); setSortDir("asc"); }
  };

  return (
    <div className="grid gap-6 page">
      <h1 className="text-2xl font-semibold">Leads</h1>
      <div className="rounded-lg border bg-white p-4">
        <h2 className="mb-2 font-medium">Add Lead</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          <input className="input" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
          <input className="input" placeholder="Contact Name" value={contactName} onChange={(e) => setContactName(e.target.value)} />
          <input className="input" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <input className="input" placeholder="Phone" value={phone} onChange={(e) => setPhone(e.target.value)} />
          <select className="select" value={status} onChange={(e) => setStatus(e.target.value as LeadStatus)}>
            {statuses.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
          <select className="select" value={source} onChange={(e) => setSource(e.target.value as LeadSource)}>
            {sources.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
        <button className="mt-3 btn btn-primary" onClick={onAdd}>Add</button>
      </div>

      <div className="card p-4">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-medium">Lead List</h2>
          <div className="flex gap-2">
            <select className="select" value={filterStatus} onChange={(e) => setFilterStatus(e.target.value as LeadStatus | "all")}>
              <option value="all">All Status</option>
              {statuses.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
            <select className="select" value={filterSource} onChange={(e) => setFilterSource(e.target.value as LeadSource | "all")}>
              <option value="all">All Sources</option>
              {sources.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left p-2"><button className="btn btn-outline px-2 py-1" onClick={() => toggleSort("title")}>Title</button></th>
                <th className="text-left p-2">Contact</th>
                <th className="text-left p-2"><button className="btn btn-outline px-2 py-1" onClick={() => toggleSort("status")}>Status</button></th>
                <th className="text-left p-2"><button className="btn btn-outline px-2 py-1" onClick={() => toggleSort("source")}>Source</button></th>
                <th className="text-left p-2"><button className="btn btn-outline px-2 py-1" onClick={() => toggleSort("createdAt")}>Created</button></th>
                <th className="text-left p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td className="p-2" colSpan={6}><div className="skeleton h-6 w-full"></div></td></tr>
              ) : sortedLeads.map((l) => (
                <tr key={l.id} className="border-b">
                  <td className="p-2">{l.title}</td>
                  <td className="p-2">{l.contactName || "-"}</td>
                  <td className="p-2">
                    <Badge
                      text={l.status}
                      variant={l.status === "won" ? "success" : l.status === "lost" ? "danger" : l.status === "qualified" ? "info" : l.status === "contacted" ? "warning" : "default"}
                    />
                  </td>
                  <td className="p-2"><Badge text={l.source} variant="info" /></td>
                  <td className="p-2">{new Date(l.createdAt).toLocaleString()}</td>
                  <td className="p-2">
                    <button className="btn btn-outline px-2 py-1" onClick={() => removeLead(l.id)}>Delete</button>
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
