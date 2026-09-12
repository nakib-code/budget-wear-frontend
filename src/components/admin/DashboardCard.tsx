interface DashboardCardProps {
  title: string;
  value: number;
  description: string;
}

export default function DashboardCard({
  title,
  value,
  description,
}: DashboardCardProps) {
  return (
    <div className="rounded-2xl border border-border bg-white p-5 shadow-sm transition hover:shadow-md sm:p-6">
      <p className="text-sm font-semibold text-muted">
        {title}
      </p>

      <p className="mt-3 text-3xl font-extrabold tracking-tight text-foreground">
        {value}
      </p>

      <p className="mt-1 text-xs text-muted">
        {description}
      </p>
    </div>
  );
}