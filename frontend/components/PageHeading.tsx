"use client";

interface PageHeadingProps {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}

// The one signature moment used across the app: a heartbeat trace that
// draws itself in once, under the page title. Respects reduced-motion.
export default function PageHeading({ title, subtitle, action }: PageHeadingProps) {
  return (
    <header className="mb-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-sans text-2xl font-semibold tracking-tight text-ink">{title}</h1>
          {subtitle && <p className="mt-1 text-sm text-ink-soft">{subtitle}</p>}
        </div>
        {action}
      </div>

      <svg viewBox="0 0 400 20" className="mt-3 h-3 w-40 text-chart motion-reduce:[&_path]:[stroke-dasharray:none]" fill="none">
        <path
          d="M0 10h70l10-8 12 16 10-16 8 16 10-8h50l8-6 8 12 8-12h216"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
          pathLength={100}
          className="heartbeat-draw"
        />
      </svg>
    </header>
  );
}
