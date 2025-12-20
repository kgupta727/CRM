import { create } from "zustand";
import { persist } from "zustand/middleware";

export type TaskStatus = "pending" | "completed" | "snoozed";
export type TaskPriority = "low" | "medium" | "high";

export interface Task {
  id: string;
  title: string;
  description?: string;
  dueDate?: string; // ISO
  priority: TaskPriority;
  status: TaskStatus;
  linkedLeadId?: string;
  linkedActivityId?: string;
  createdAt: string;
}

interface TasksState {
  tasks: Task[];
  addTask: (task: Omit<Task, "id" | "createdAt">) => void;
  updateTask: (id: string, patch: Partial<Task>) => void;
  removeTask: (id: string) => void;
  completeTask: (id: string) => void;
  snoozeTask: (id: string, until: string) => void;
  clear: () => void;
}

export const useTasksStore = create<TasksState>()(
  persist(
    (set) => ({
      tasks: [],
      addTask: (task) =>
        set((state) => ({
          tasks: [
            {
              id: crypto.randomUUID(),
              createdAt: new Date().toISOString(),
              ...task,
            },
            ...state.tasks,
          ],
        })),
      updateTask: (id, patch) =>
        set((state) => ({
          tasks: state.tasks.map((t) => (t.id === id ? { ...t, ...patch } : t)),
        })),
      removeTask: (id) => set((state) => ({ tasks: state.tasks.filter((t) => t.id !== id) })),
      completeTask: (id) =>
        set((state) => ({
          tasks: state.tasks.map((t) => (t.id === id ? { ...t, status: "completed" as const } : t)),
        })),
      snoozeTask: (id, until) =>
        set((state) => ({
          tasks: state.tasks.map((t) => (t.id === id ? { ...t, status: "snoozed" as const, dueDate: until } : t)),
        })),
      clear: () => set({ tasks: [] }),
    }),
    { name: "crm-tasks" }
  )
);
