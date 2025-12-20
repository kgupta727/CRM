"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/", label: "Home" },
  { href: "/leads", label: "Leads" },
  { href: "/activities", label: "Activities" },
  { href: "/tasks", label: "Tasks" },
  { href: "/analytics", label: "Analytics" },
];

export default function Nav() {
  const pathname = usePathname();
  return (
    <nav className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <span className="font-semibold">{links.find(l => l.href === pathname)?.label || "CRM"}</span>
      </div>
      <div className="flex items-center gap-2">
        {links.map((l) => (
          <Link
            key={l.href}
            className={
              "rounded px-3 py-2 text-sm transition-colors " +
              (pathname === l.href
                ? "bg-[color:var(--brand)] text-white"
                : "hover:bg-[color:color-mix(in oklab, var(--brand) 8%, transparent)]")
            }
            href={l.href}
          >
            {l.label}
          </Link>
        ))}
      </div>
    </nav>
  );
}
