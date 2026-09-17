"use client";

import { useEffect, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { getAppointmentsByDepartment } from "@/services/api";
import { DepartmentAppointmentCount } from "@/types";

export default function AppointmentsByDepartmentChart() {
  const [data, setData] = useState<DepartmentAppointmentCount[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAppointmentsByDepartment()
      .then(setData)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="chart-page bg-white">
      <div className="chart-page-header">
        <div>
          <h2 className="font-sans text-base font-semibold text-ink">Appointments by Department</h2>
          <p className="mt-1 text-sm text-ink-soft">Total appointments handled by each department.</p>
        </div>
      </div>

      <div className="h-72 p-5">
        {loading ? (
          <div className="flex h-full items-center justify-center text-sm text-ink-soft">Loading chart...</div>
        ) : data.length === 0 ? (
          <div className="flex h-full items-center justify-center text-sm text-ink-soft">No appointment data yet.</div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 4, right: 8, left: -16, bottom: 0 }}>
              <CartesianGrid vertical={false} stroke="#C7D2CE" />
              <XAxis
                dataKey="department"
                tick={{ fontSize: 12, fill: "#17242B", fillOpacity: 0.6, fontFamily: "var(--font-plex-mono)" }}
                axisLine={{ stroke: "#C7D2CE" }}
                tickLine={false}
              />
              <YAxis
                allowDecimals={false}
                tick={{ fontSize: 12, fill: "#17242B", fillOpacity: 0.6, fontFamily: "var(--font-plex-mono)" }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                cursor={{ fill: "#E4EDF2" }}
                contentStyle={{
                  borderRadius: 3,
                  border: "1px solid #C7D2CE",
                  fontSize: 13,
                  fontFamily: "var(--font-plex-sans)",
                  boxShadow: "none",
                }}
              />
              <Bar dataKey="total" name="Appointments" fill="#2B5F82" radius={[2, 2, 0, 0]} maxBarSize={48} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
