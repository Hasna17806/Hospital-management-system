"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
  { href: "/", label: "Dashboard" },
  { href: "/patients", label: "Patients" },
  { href: "/doctors", label: "Doctors" },
  { href: "/appointments", label: "Appointments" },
];

export default function MobileNav() {
  const pathname = usePathname();

  return (
    <div className="sticky top-0 z-20 flex items-center gap-1 overflow-x-auto border-b border-line bg-white/90 px-3 py-3 backdrop-blur lg:hidden">
      {NAV_ITEMS.map((item) => {
        const active = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`whitespace-nowrap rounded-full px-3.5 py-1.5 text-sm transition-colors ${
              active ? "bg-teal text-white" : "text-ink/60 hover:bg-teal-light"
            }`}
          >
            {item.label}
          </Link>
        );
      })}
    </div>
  );
}
