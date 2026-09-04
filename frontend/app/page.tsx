"use client";

import { useEffect, useState } from "react";
import StatCard from "@/components/StatCard";
import { getDashboardStats } from "@/services/api";
import { DashboardStats } from "@/types";

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    getDashboardStats()
      .then(setStats)
      .catch(() => setError("Could not load dashboard stats. Is the backend running?"));
  }, []);

  return (
    <div>
      <header className="mb-8">
        <h1 className="font-display text-2xl font-semibold text-ink">Dashboard</h1>
        <p className="mt-1 text-sm text-ink/55">A quick overview of hospital activity, pulled live from PostgreSQL.</p>
      </header>

      {error && (
        <div className="surface mb-6 border-coral/30 bg-coral/5 p-4 text-sm text-coral">{error}</div>
      )}

      <div className="grid grid-cols-2 gap-4 sm:gap-4 lg:grid-cols-4">
        <StatCard label="Total Patients" value={stats?.totalPatients ?? "—"} accent="teal" />
        <StatCard label="Total Doctors" value={stats?.totalDoctors ?? "—"} accent="leaf" />
        <StatCard label="Total Appointments" value={stats?.totalAppointments ?? "—"} accent="amber" />
        <StatCard label="Today's Visits" value={stats?.todaysAppointments ?? "—"} accent="coral" />
      </div>

      <div className="surface mt-6 p-6">
        <h2 className="font-display text-base font-semibold text-ink">About this project</h2>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-ink/60">
          This is a small Hospital Management System built to practice PostgreSQL and full-stack
          development. Every number above comes from a live SQL query — nothing is hardcoded.
          Use the sidebar to manage patients, doctors, and appointments.
        </p>
      </div>
    </div>
  );
}
