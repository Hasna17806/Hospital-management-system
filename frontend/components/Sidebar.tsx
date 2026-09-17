"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { AuthUser } from "@/types";

const NAV_ITEMS = [
  { href: "/", label: "Dashboard", icon: "grid" },
  { href: "/patients", label: "Patients", icon: "user" },
  { href: "/doctors", label: "Doctors", icon: "stethoscope" },
  { href: "/appointments", label: "Appointments", icon: "calendar" },
];

function Icon({ name }: { name: string }) {
  const common = "h-[18px] w-[18px]";
  switch (name) {
    case "grid":
      return (
        <svg viewBox="0 0 24 24" fill="none" className={common}>
          <rect x="3" y="3" width="8" height="8" rx="1" stroke="currentColor" strokeWidth="1.6" />
          <rect x="13" y="3" width="8" height="8" rx="1" stroke="currentColor" strokeWidth="1.6" />
          <rect x="3" y="13" width="8" height="8" rx="1" stroke="currentColor" strokeWidth="1.6" />
          <rect x="13" y="13" width="8" height="8" rx="1" stroke="currentColor" strokeWidth="1.6" />
        </svg>
      );
    case "user":
      return (
        <svg viewBox="0 0 24 24" fill="none" className={common}>
          <circle cx="12" cy="8" r="3.5" stroke="currentColor" strokeWidth="1.6" />
          <path d="M4.5 20c1.4-3.6 4.4-5.5 7.5-5.5s6.1 1.9 7.5 5.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
      );
    case "stethoscope":
      return (
        <svg viewBox="0 0 24 24" fill="none" className={common}>
          <path d="M6 4v6a4 4 0 0 0 8 0V4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          <path d="M6 4H4.5M14 4h1.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          <path d="M18 11v2a6 6 0 0 1-12 0v-2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          <circle cx="19" cy="10" r="1.8" stroke="currentColor" strokeWidth="1.6" />
        </svg>
      );
    case "calendar":
      return (
        <svg viewBox="0 0 24 24" fill="none" className={common}>
          <rect x="3.5" y="5" width="17" height="15" rx="1" stroke="currentColor" strokeWidth="1.6" />
          <path d="M3.5 9.5h17M8 3v4M16 3v4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
      );
    default:
      return null;
  }
}

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) setUser(JSON.parse(stored));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/login");
  };

  return (
    <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col bg-ink text-paper lg:flex">
      {/* Signature mark: the heartbeat trace, quiet everywhere else,
          shown once here at full size as the app's identity. */}
      <div className="flex items-center gap-3 px-6 py-7">
        <svg viewBox="0 0 48 24" className="h-6 w-12 text-chart" fill="none">
          <path
            d="M0 12h9l3-8 5 20 4-16 3 12h8l3-6 3 6h10"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <div>
          <p className="font-sans text-[15px] font-semibold leading-none tracking-tight">Meridian</p>
          <p className="mt-1 text-[11px] text-paper/40">Hospital System</p>
        </div>
      </div>

      <nav className="mt-2 flex-1 space-y-1 pl-3">
        {NAV_ITEMS.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`relative flex items-center gap-3 rounded-l-[3px] py-2.5 pl-3.5 pr-3 text-sm transition-colors duration-150 ${
                active ? "bg-paper text-ink font-medium" : "text-paper/60 hover:bg-white/5 hover:text-paper"
              }`}
            >
              {/* Folder-tab effect: active item bleeds into the page
                  canvas, like a tab sticking out of a chart folder. */}
              {active && <span className="absolute -right-px inset-y-0 w-2 bg-paper" />}
              <span className={active ? "text-chart" : "text-paper/45"}>
                <Icon name={item.icon} />
              </span>
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="px-6 py-6">
        {user && (
          <div className="mb-3 flex items-center justify-between border-t border-dashed border-white/15 pt-4">
            <div>
              <p className="text-xs font-medium text-paper/80">{user.name}</p>
              <p className="font-mono text-[10px] uppercase text-paper/40">{user.role}</p>
            </div>
            <button
              onClick={handleLogout}
              className="rounded-[2px] px-2 py-1 text-[11px] text-paper/50 transition-colors hover:bg-white/10 hover:text-paper"
            >
              Log out
            </button>
          </div>
        )}
        <p className="text-[11px] text-paper/35">Built for learning PostgreSQL &amp; full-stack development.</p>
      </div>
    </aside>
  );
}
