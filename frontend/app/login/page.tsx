"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import * as api from "@/services/api";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const { token, user } = await api.login(email, password);
      // Store the token so every future request can prove who we are.
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      router.push("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-canvas px-4">
      <div className="surface w-full max-w-sm p-8">
        <div className="mb-6 flex items-center gap-3">
          <svg viewBox="0 0 48 24" className="h-6 w-12 text-teal" fill="none">
            <path
              d="M0 12h9l3-8 5 20 4-16 3 12h8l3-6 3 6h10"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <div>
            <p className="font-display text-base font-semibold leading-none text-ink">Meridian</p>
            <p className="mt-1 text-[11px] uppercase tracking-wider text-ink/40">Hospital System</p>
          </div>
        </div>

        <h1 className="font-display text-xl font-semibold text-ink">Sign in</h1>
        <p className="mt-1 text-sm text-ink/55">Staff login to access the dashboard.</p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-3.5">
          {error && <p className="text-sm text-coral">{error}</p>}
          <input
            className="input-field"
            type="email"
            placeholder="Email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            className="input-field"
            type="password"
            placeholder="Password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit" disabled={loading} className="btn-primary w-full justify-center disabled:opacity-60">
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>
      </div>
    </div>
  );
}
