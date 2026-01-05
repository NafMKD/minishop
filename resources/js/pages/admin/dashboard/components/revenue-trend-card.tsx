import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { OrdersByDayPoint } from '../lib/types';
import { RevenueLineChart } from './revenue-line-chart';

export function RevenueTrendCard({ data }: { data: OrdersByDayPoint[] }) {
  return (
    <Card className="lg:col-span-4">
      <CardHeader>
        <CardTitle className="text-base">Revenue trend</CardTitle>
        <div className="text-sm text-muted-foreground">
          Last {Math.max(data?.length ?? 0, 0)} days
        </div>
      </CardHeader>
      <CardContent className="h-[320px]">
        <RevenueLineChart data={data} />
      </CardContent>
    </Card>
  );
}
