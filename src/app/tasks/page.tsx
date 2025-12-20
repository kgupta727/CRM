"use client";
import { useTasksStore, TaskPriority, type Task } from "@/store/tasks";
import { useLeadsStore } from "@/store/leads";
import { useState, useMemo } from "react";
import Badge from "@/components/Badge";
import { CheckCircle2, Circle, Clock } from "lucide-react";

const priorities: TaskPriority[] = ["low", "medium", "high"];

export default function TasksPage() {
  const { tasks, addTask, removeTask, completeTask } = useTasksStore();
  const leads = useLeadsStore((s) => s.leads);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [priority, setPriority] = useState<TaskPriority>("medium");
  const [linkedLeadId, setLinkedLeadId] = useState<string | undefined>(undefined);

  const onAdd = () => {
    if (!title.trim()) return;
    addTask({ title, description, dueDate: dueDate || undefined, priority, status: "pending", linkedLeadId });
    setTitle("");
    setDescription("");
    setDueDate("");
    setPriority("medium");
    setLinkedLeadId(undefined);
  };

  const pendingTasks = useMemo(() => tasks.filter((t) => t.status === "pending"), [tasks]);
  const completedTasks = useMemo(() => tasks.filter((t) => t.status === "completed"), [tasks]);

  return (
    <div className="grid gap-6 page">
      <h1 className="text-2xl font-semibold">Tasks & Reminders</h1>
      <div className="card p-4">
        <h2 className="mb-2 font-medium">Add Task</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          <input className="input" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
          <select className="select" value={linkedLeadId ?? ""} onChange={(e) => setLinkedLeadId(e.target.value || undefined)}>
            <option value="">(optional) Link to Lead</option>
            {leads.map((l) => (
              <option key={l.id} value={l.id}>{l.title}</option>
            ))}
          </select>
          <input className="input" type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} placeholder="Due Date" />
          <select className="select" value={priority} onChange={(e) => setPriority(e.target.value as TaskPriority)}>
            {priorities.map((p) => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
          <textarea className="textarea sm:col-span-2" rows={2} placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
        </div>
        <button className="mt-3 btn btn-primary" onClick={onAdd}>Add Task</button>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="card p-4">
          <h2 className="mb-3 font-medium">Pending Tasks ({pendingTasks.length})</h2>
          <div className="space-y-2">
            {pendingTasks.map((t) => (
              <TaskRow key={t.id} task={t} onComplete={() => completeTask(t.id)} onDelete={() => removeTask(t.id)} />
            ))}
            {pendingTasks.length === 0 && <p className="text-sm" style={{ color: "var(--muted)" }}>No pending tasks</p>}
          </div>
        </div>
        <div className="card p-4">
          <h2 className="mb-3 font-medium">Completed Tasks ({completedTasks.length})</h2>
          <div className="space-y-2">
            {completedTasks.map((t) => (
              <TaskRow key={t.id} task={t} onDelete={() => removeTask(t.id)} />
            ))}
            {completedTasks.length === 0 && <p className="text-sm" style={{ color: "var(--muted)" }}>No completed tasks</p>}
          </div>
        </div>
      </div>
    </div>
  );
}

function TaskRow({ task, onComplete, onDelete }: { task: Task; onComplete?: () => void; onDelete: () => void }) {
  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && task.status === "pending";
  return (
    <div className="flex items-start gap-2 rounded border p-2" style={{ borderColor: "var(--border)" }}>
      {onComplete && (
        <button onClick={onComplete} className="mt-1">
          <Circle size={18} style={{ color: "var(--muted)" }} />
        </button>
      )}
      {!onComplete && <CheckCircle2 size={18} style={{ color: "var(--success)" }} className="mt-1" />}
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <span className={task.status === "completed" ? "line-through" : ""}>{task.title}</span>
          {task.priority === "high" && <Badge text="high" variant="danger" />}
          {isOverdue && <Badge text="overdue" variant="danger" />}
        </div>
        {task.description && <p className="text-sm" style={{ color: "var(--muted)" }}>{task.description}</p>}
        {task.dueDate && (
          <p className="flex items-center gap-1 text-xs" style={{ color: "var(--muted)" }}>
            <Clock size={12} /> {new Date(task.dueDate).toLocaleDateString()}
          </p>
        )}
      </div>
      <button className="btn btn-outline px-2 py-1 text-xs" onClick={onDelete}>Delete</button>
    </div>
  );
}
