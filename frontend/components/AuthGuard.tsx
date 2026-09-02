"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

// Wraps protected pages. Checks for a token on mount; if there isn't
// one, it redirects to /login before rendering any protected content.
export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.replace("/login");
    } else {
      setChecked(true);
    }
  }, [router]);

  // Avoid flashing protected content before the check finishes
  if (!checked) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center text-sm text-ink/40">
        Checking session...
      </div>
    );
  }

  return <>{children}</>;
}
