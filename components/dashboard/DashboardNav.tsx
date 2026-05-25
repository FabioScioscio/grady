"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type NavProps = { userName?: string | null };

const navItems = [
  {
    href: "/dashboard",
    label: "Home",
    exact: true,
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
        <polyline points="9 22 9 12 15 12 15 22" />
      </svg>
    ),
  },
  {
    href: "/dashboard/voti",
    label: "Voti",
    exact: false,
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
        <path d="M3 3v18h18" /><path d="M7 16l4-4 4 4 4-8" />
      </svg>
    ),
  },
  {
    href: "/dashboard/calendario",
    label: "Calendario",
    exact: false,
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
        <rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
      </svg>
    ),
  },
  {
    href: "/dashboard/simulatore",
    label: "Simulatore",
    exact: false,
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
        <circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="6" /><circle cx="12" cy="12" r="2" />
      </svg>
    ),
  },
  {
    href: "/dashboard/profilo",
    label: "Profilo",
    exact: false,
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
      </svg>
    ),
  },
];

function getInitials(name: string | null | undefined): string {
  if (!name) return "G";
  return name.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2);
}

export function Sidebar({ userName }: NavProps) {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex flex-col w-64 min-h-screen bg-white border-r border-gray-100 fixed top-0 left-0">
      {/* Logo */}
      <div className="px-6 py-6 border-b border-gray-50">
        <Link href="/dashboard" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-grady-blue rounded-lg flex items-center justify-center">
            <span className="text-white font-extrabold text-sm">G</span>
          </div>
          <span className="text-xl font-extrabold text-grady-blue tracking-tight">Grady</span>
        </Link>
      </div>

      {/* Nav items */}
      <nav className="flex flex-col gap-1 px-3 py-4 flex-1">
        {navItems.map((item) => {
          const isActive = item.exact ? pathname === item.href : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold transition-all ${
                isActive
                  ? "bg-grady-blue text-white shadow-sm shadow-grady-blue/30"
                  : "text-gray-500 hover:bg-gray-50 hover:text-grady-night"
              }`}
            >
              {item.icon}
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* User footer */}
      <div className="px-4 py-4 border-t border-gray-50">
        <Link href="/dashboard/profilo" className="flex items-center gap-3 px-3 py-2 rounded-2xl hover:bg-gray-50 transition">
          <div className="w-9 h-9 bg-grady-blue rounded-full flex items-center justify-center shrink-0">
            <span className="text-white font-bold text-sm">{getInitials(userName)}</span>
          </div>
          <div className="min-w-0">
            <p className="text-sm font-bold text-grady-night truncate">{userName ?? "Il mio profilo"}</p>
            <p className="text-xs text-gray-400">Vedi profilo</p>
          </div>
        </Link>
      </div>
    </aside>
  );
}

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur border-t border-gray-100 flex items-center justify-around px-1 py-2 z-50">
      {navItems.map((item) => {
        const isActive = item.exact ? pathname === item.href : pathname.startsWith(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-2xl transition-all ${
              isActive
                ? "text-grady-blue"
                : "text-gray-400 hover:text-gray-600"
            }`}
          >
            <div className={`p-1 rounded-xl transition-all ${isActive ? "bg-grady-blue/10" : ""}`}>
              {item.icon}
            </div>
            <span className="text-[9px] font-bold">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
