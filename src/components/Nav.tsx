"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/", label: "Home" },
  { href: "/leads", label: "Leads" },
  { href: "/activities", label: "Activities" },
  { href: "/analytics", label: "Analytics" },
];

export default function Nav() {
  const pathname = usePathname();
  return (
    <nav className="flex gap-4 items-center py-3">
      <span className="font-bold text-xl">CRM</span>
      <ul className="flex gap-3">
        {links.map((l) => (
          <li key={l.href}>
            <Link
              className={
                "px-3 py-1 rounded hover:bg-gray-100 " +
                (pathname === l.href ? "bg-gray-200" : "")
              }
              href={l.href}
            >
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
