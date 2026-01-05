export type DashboardCounts = {
  orders: number;
  revenue: number;
  products: number;
  customers: number;
};

export type OrdersByDayPoint = {
  date: string;
  orders: number;
  revenue: number;
};

export type RecentOrder = {
  id: number;
  customer_name?: string | null;
  status: string;
  total_amount: number;
  created_at: string;
};

export type DashboardProps = {
  dashboard?: {
    counts: DashboardCounts;
    ordersByDay: OrdersByDayPoint[];
    recentOrders: RecentOrder[];
  };
};
