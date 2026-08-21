interface StatCardProps {
  label: string;
  value: number | string;
  accent?: "teal" | "amber" | "leaf" | "coral";
}

const ACCENT_MAP = {
  teal: "text-teal bg-teal-light",
  amber: "text-amber bg-amber/10",
  leaf: "text-leaf bg-leaf/10",
  coral: "text-coral bg-coral/10",
};

export default function StatCard({ label, value, accent = "teal" }: StatCardProps) {
  return (
    <div className="surface-interactive p-5">
      <div className={`inline-flex h-9 w-9 items-center justify-center rounded-lg ${ACCENT_MAP[accent]}`}>
        <span className="h-2 w-2 rounded-full bg-current" />
      </div>
      <p className="mt-4 font-display text-3xl font-semibold text-ink">{value}</p>
      <p className="mt-1 text-sm text-ink/55">{label}</p>
    </div>
  );
}
