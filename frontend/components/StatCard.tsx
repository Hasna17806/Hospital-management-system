interface StatCardProps {
  label: string;
  value: number | string;
  accent?: "chart" | "watch" | "mend" | "vital";
}

const ACCENT_MAP = {
  chart: "bg-chart",
  watch: "bg-watch",
  mend: "bg-mend",
  vital: "bg-vital",
};

export default function StatCard({ label, value, accent = "chart" }: StatCardProps) {
  return (
    <div className="chart-page-hover p-5">
      <div className="flex items-center gap-2">
        <span className={`h-2 w-2 ${ACCENT_MAP[accent]}`} />
        <p className="text-xs text-ink-soft">{label}</p>
      </div>
      <p className="mt-3 font-mono text-3xl font-semibold tabular-nums text-ink">{value}</p>
    </div>
  );
}
