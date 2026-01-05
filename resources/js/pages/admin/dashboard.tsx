import AppLayout from '@/layouts/app-layout';
import { dashboard as dashboardRoute } from '@/routes/admin';
import type { BreadcrumbItem } from '@/types';
import { Head, usePage } from '@inertiajs/react';

import { ShoppingCart, DollarSign, Package, Users } from 'lucide-react';

import type { DashboardCounts, DashboardProps } from '@/pages/admin/dashboard/lib/types';

import { KpiCard } from '@/pages/admin/dashboard/components/kpi-card';
import { RevenueTrendCard } from '@/pages/admin/dashboard/components/revenue-trend-card';
import { RecentOrdersCard } from '@/pages/admin/dashboard/components/recent-orders-card';
import { money } from '../orders/lib/format';

const breadcrumbs: BreadcrumbItem[] = [
  { title: 'Dashboard', href: dashboardRoute().url },
];

export default function Dashboard() {
  const { props } = usePage<DashboardProps>();

  const counts: DashboardCounts = props.dashboard?.counts ?? {
    orders: 0,
    revenue: 0,
    products: 0,
    customers: 0,
  };

  const ordersByDay = props.dashboard?.ordersByDay ?? [];
  const recentOrders = props.dashboard?.recentOrders ?? [];

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Dashboard" />

      <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
        {/* KPI cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <KpiCard
            title="Total Orders"
            value={counts.orders.toLocaleString()}
            hint="All-time"
            icon={<ShoppingCart className="h-5 w-5 text-muted-foreground" />}
          />
          <KpiCard
            title="Revenue"
            value={money(counts.revenue)}
            hint="All-time"
            icon={<DollarSign className="h-5 w-5 text-muted-foreground" />}
          />
          <KpiCard
            title="Products"
            value={counts.products.toLocaleString()}
            hint="Active catalog"
            icon={<Package className="h-5 w-5 text-muted-foreground" />}
          />
          <KpiCard
            title="Customers"
            value={counts.customers.toLocaleString()}
            hint="Registered users"
            icon={<Users className="h-5 w-5 text-muted-foreground" />}
          />
        </div>

        {/* Charts */}
        <div className="min-h-[420px]">
          <RevenueTrendCard data={ordersByDay} />
        </div>

        {/* Recent orders table */}
        <RecentOrdersCard orders={recentOrders} />
      </div>
    </AppLayout>
  );
}
