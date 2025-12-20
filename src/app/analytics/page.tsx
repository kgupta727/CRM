"use client";
import { useMemo } from "react";
import { useLeadsStore } from "@/store/leads";
import { useActivitiesStore } from "@/store/activities";
import { Bar, Line, Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, PointElement, LineElement, ArcElement, Tooltip, Legend);

export default function AnalyticsPage() {
  const leads = useLeadsStore((s) => s.leads);
  const activities = useActivitiesStore((s) => s.activities);

  // KPI summary
  const kpis = useMemo(() => {
    const won = leads.filter((l) => l.status === "won").length;
    const lost = leads.filter((l) => l.status === "lost").length;
    const qualified = leads.filter((l) => l.status === "qualified").length;
    const conversionRate = leads.length > 0 ? ((won / leads.length) * 100).toFixed(1) : "0.0";
    return { total: leads.length, won, lost, qualified, conversionRate, activitiesCount: activities.length };
  }, [leads, activities]);

  const leadsBySource = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const l of leads) counts[l.source] = (counts[l.source] ?? 0) + 1;
    const labels = Object.keys(counts);
    const data = labels.map((k) => counts[k]);
    return { labels, data };
  }, [leads]);

  const activitiesByDay = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const a of activities) {
      const day = new Date(a.createdAt).toISOString().slice(0, 10);
      counts[day] = (counts[day] ?? 0) + 1;
    }
    const labels = Object.keys(counts).sort();
    const data = labels.map((k) => counts[k]);
    return { labels, data };
  }, [activities]);

  const activitiesByType = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const a of activities) counts[a.type] = (counts[a.type] ?? 0) + 1;
    const labels = Object.keys(counts);
    const data = labels.map((k) => counts[k]);
    return { labels, data };
  }, [activities]);

  return (
    <div className="grid gap-6 page">
      <h1 className="text-2xl font-semibold">Analytics Dashboard</h1>
      
      {/* KPI Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="card p-4">
          <p className="text-sm" style={{ color: "var(--muted)" }}>Total Leads</p>
          <p className="text-3xl font-bold">{kpis.total}</p>
        </div>
        <div className="card p-4">
          <p className="text-sm" style={{ color: "var(--muted)" }}>Won</p>
          <p className="text-3xl font-bold" style={{ color: "var(--success)" }}>{kpis.won}</p>
        </div>
        <div className="card p-4">
          <p className="text-sm" style={{ color: "var(--muted)" }}>Conversion Rate</p>
          <p className="text-3xl font-bold">{kpis.conversionRate}%</p>
        </div>
        <div className="card p-4">
          <p className="text-sm" style={{ color: "var(--muted)" }}>Activities</p>
          <p className="text-3xl font-bold">{kpis.activitiesCount}</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="card p-4">
          <h2 className="mb-3 font-medium">Leads by Source</h2>
          <Bar
            data={{
              labels: leadsBySource.labels,
              datasets: [
                { label: "Leads", data: leadsBySource.data, backgroundColor: "#0EA5A4" },
              ],
            }}
            options={{ responsive: true, plugins: { legend: { display: false } } }}
          />
        </div>
        <div className="card p-4">
          <h2 className="mb-3 font-medium">Activities per Day</h2>
          <Line
            data={{
              labels: activitiesByDay.labels,
              datasets: [
                { label: "Activities", data: activitiesByDay.data, borderColor: "#0EA5A4", tension: 0.3 },
              ],
            }}
            options={{ responsive: true, plugins: { legend: { display: false } } }}
          />
        </div>
        <div className="card p-4">
          <h2 className="mb-3 font-medium">Activities by Type</h2>
          <Doughnut
            data={{
              labels: activitiesByType.labels,
              datasets: [
                {
                  data: activitiesByType.data,
                  backgroundColor: ["#0EA5A4", "#0ea5e9", "#f59e0b", "#22c55e"],
                },
              ],
            }}
            options={{ responsive: true, plugins: { legend: { position: "bottom" } } }}
          />
        </div>
      </div>
    </div>
  );
}
