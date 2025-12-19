"use client";
import { useMemo } from "react";
import { useLeadsStore } from "@/store/leads";
import { useActivitiesStore } from "@/store/activities";
import { Bar, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, PointElement, LineElement, Tooltip, Legend);

export default function AnalyticsPage() {
  const leads = useLeadsStore((s) => s.leads);
  const activities = useActivitiesStore((s) => s.activities);

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

  return (
    <div className="grid gap-6">
      <h1 className="text-2xl font-semibold">Analytics</h1>
      <div className="grid gap-6 sm:grid-cols-2">
        <div className="rounded-lg border bg-white p-4">
          <h2 className="mb-2 font-medium">Leads by Source</h2>
          <Bar
            data={{
              labels: leadsBySource.labels,
              datasets: [
                { label: "Leads", data: leadsBySource.data, backgroundColor: "#0ea5e9" },
              ],
            }}
            options={{ responsive: true, plugins: { legend: { display: false } } }}
          />
        </div>
        <div className="rounded-lg border bg-white p-4">
          <h2 className="mb-2 font-medium">Activities per Day</h2>
          <Line
            data={{
              labels: activitiesByDay.labels,
              datasets: [
                { label: "Activities", data: activitiesByDay.data, borderColor: "#22c55e" },
              ],
            }}
            options={{ responsive: true, plugins: { legend: { display: false } } }}
          />
        </div>
      </div>
    </div>
  );
}
