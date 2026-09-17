"use client";

import { useEffect, useState } from "react";
import StatCard from "@/components/StatCard";
import PageHeading from "@/components/PageHeading";
import AppointmentsByDepartmentChart from "@/components/AppointmentsByDepartmentChart";
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
      <PageHeading title="Dashboard" subtitle="A quick overview of hospital activity, pulled live from PostgreSQL." />

      {error && (
        <div className="chart-page mb-6 border-vital/30 bg-vital-soft p-4 text-sm text-vital">{error}</div>
      )}

      <div className="grid grid-cols-2 gap-4 sm:gap-4 lg:grid-cols-4">
        <StatCard label="Total patients" value={stats?.totalPatients ?? "—"} accent="chart" />
        <StatCard label="Total doctors" value={stats?.totalDoctors ?? "—"} accent="mend" />
        <StatCard label="Total appointments" value={stats?.totalAppointments ?? "—"} accent="watch" />
        <StatCard label="Today's visits" value={stats?.todaysAppointments ?? "—"} accent="vital" />
      </div>

      <div className="mt-6">
        <AppointmentsByDepartmentChart />
      </div>
    </div>
  );
}
