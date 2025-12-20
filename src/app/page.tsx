"use client";
import Link from "next/link";
import { useTasksStore } from "@/store/tasks";
import { useLeadsStore } from "@/store/leads";
import { useActivitiesStore } from "@/store/activities";
import Badge from "@/components/Badge";
import { useMemo } from "react";

export default function Home() {
  const tasks = useTasksStore((s) => s.tasks);
  const leads = useLeadsStore((s) => s.leads);
  const activities = useActivitiesStore((s) => s.activities);

  const todayTasks = useMemo(() => {
    const today = new Date().toISOString().slice(0, 10);
    return tasks.filter(
      (t) => t.status === "pending" && t.dueDate && t.dueDate <= today
    );
  }, [tasks]);

  const stats = useMemo(() => {
    const newLeads = leads.filter((l) => l.status === "new").length;
    const pendingTasks = tasks.filter((t) => t.status === "pending").length;
    return { newLeads, pendingTasks, totalActivities: activities.length };
  }, [leads, tasks, activities]);
  return (
    <div className="grid gap-6">
      <section className="card p-6">
        <h1 className="text-2xl font-semibold">Welcome to the Internal CRM</h1>
        <p className="mt-2 text-[color:var(--muted)]">
          Quickly register sales calls, generate leads, document meeting notes, and view
          team activity. Integrations (email, calls, WhatsApp) will come next.
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link className="btn btn-primary" href="/leads">New Lead</Link>
          <Link className="btn btn-outline" href="/activities">Log Activity</Link>
          <Link className="btn btn-outline" href="/tasks">Add Task</Link>
          <Link className="btn btn-outline" href="/analytics">View Analytics</Link>
        </div>
      </section>

      {/* Today Panel */}
      <section className="card p-6">
        <h2 className="text-xl font-semibold mb-3">Today's Focus</h2>
        <div className="grid gap-4 sm:grid-cols-3 mb-4">
          <div>
            <p className="text-sm" style={{ color: "var(--muted)" }}>New Leads</p>
            <p className="text-2xl font-bold">{stats.newLeads}</p>
          </div>
          <div>
            <p className="text-sm" style={{ color: "var(--muted)" }}>Pending Tasks</p>
            <p className="text-2xl font-bold">{stats.pendingTasks}</p>
          </div>
          <div>
            <p className="text-sm" style={{ color: "var(--muted)" }}>Activities Logged</p>
            <p className="text-2xl font-bold">{stats.totalActivities}</p>
          </div>
        </div>
        {todayTasks.length > 0 && (
          <div>
            <h3 className="font-medium mb-2">Due Today ({todayTasks.length})</h3>
            <div className="space-y-2">
              {todayTasks.slice(0, 5).map((t) => (
                <div key={t.id} className="flex items-center justify-between rounded border p-2" style={{ borderColor: "var(--border)" }}>
                  <span>{t.title}</span>
                  {t.priority === "high" && <Badge text="high" variant="danger" />}
                </div>
              ))}
            </div>
            {todayTasks.length > 5 && (
              <Link href="/tasks" className="mt-2 inline-block text-sm" style={{ color: "var(--brand)" }}>
                View all {todayTasks.length} tasks →
              </Link>
            )}
          </div>
        )}
      </section>

      <section className="grid gap-4 sm:grid-cols-3">
        <div className="card p-4">
          <h2 className="font-medium">Efficiency Tips</h2>
          <ul className="mt-2 list-disc pl-5 text-sm text-[color:var(--muted)]">
            <li>Use quick actions to avoid context switching.</li>
            <li>Log brief notes immediately; enrich later.</li>
            <li>Pin overdue tasks for daily triage.</li>
          </ul>
        </div>
        <div className="card p-4">
          <h2 className="font-medium">Quick Filters</h2>
          <p className="mt-2 text-sm text-[color:var(--muted)]">Use status/source filters on Leads and Activities for faster search.</p>
        </div>
        <div className="card p-4">
          <h2 className="font-medium">Upcoming</h2>
          <p className="mt-2 text-sm text-[color:var(--muted)]">Email & WhatsApp integrations, click-to-call, pipeline board.</p>
        </div>
      </section>
    </div>
  );
}
