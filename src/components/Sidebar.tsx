"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, ListChecks, PhoneCall, LineChart, CheckSquare } from "lucide-react";
import ThemeToggle from "./ThemeToggle";

const items = [
  { href: "/", label: "Home", icon: Home },
  { href: "/leads", label: "Leads", icon: ListChecks },
  { href: "/activities", label: "Activities", icon: PhoneCall },
  { href: "/tasks", label: "Tasks", icon: CheckSquare },
  { href: "/analytics", label: "Analytics", icon: LineChart },
];

export default function Sidebar() {
  const pathname = usePathname();
  return (
    <aside className="flex h-screen w-64 flex-col border-r" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
      <div className="flex items-center gap-2 px-4 py-4">
        <div className="h-8 w-8 rounded-lg" style={{ background: "var(--brand)" }} />
        <span className="font-semibold">CRM</span>
      </div>
      <nav className="flex-1 px-2">
        {items.map(({ href, label, icon: Icon }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={
                "flex items-center gap-2 rounded-lg px-3 py-2 transition-colors " +
                (active
                  ? "bg-[color:var(--brand)] text-white"
                  : "hover:bg-[color:color-mix(in oklab, var(--brand) 8%, transparent)]")
              }
            >
              <Icon size={18} />
              <span>{label}</span>
            </Link>
          );
        })}
      </nav>
      <div className="px-4 py-4">
        <ThemeToggle />
      </div>
    </aside>
  );
}
