import { Card, CardHeader, CardTitle } from '@/components/ui/card';

export function KpiCard({
  title,
  value,
  hint,
  icon,
}: {
  title: string;
  value: string;
  hint?: string;
  icon: React.ReactNode;
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between gap-2">
        <div className="space-y-1">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            {title}
          </CardTitle>
          <div className="text-2xl font-semibold tracking-tight">{value}</div>
          {hint ? (
            <div className="text-xs text-muted-foreground">{hint}</div>
          ) : null}
        </div>

        <div className="rounded-md border bg-card p-2">{icon}</div>
      </CardHeader>
    </Card>
  );
}
