import type { ActiveCart } from '@/pages/welcome';

export type AuthUser = {
  name: string;
  is_admin?: boolean;
  active_cart?: ActiveCart;
  email: string;
  email_verified_at: string;
};

export type OrderItem = {
  id: number;
  quantity: number;
  unit_price: number | string;
  product: {
    id: number;
    name: string;
    image_url?: string | null;
    slug?: string | null;
  };
};

export type Order = {
  id: number;
  number?: string | null;
  created_at?: string | null;
  total_amount: number | string;
  items: OrderItem[];
};

export type Paginated<T> = {
  data: T[];
  next_page_url?: string | null;
  total?: number;
  per_page?: number;
  current_page?: number;
};

export type OrdersPageProps = {
  auth: { user?: AuthUser | null };
  orders: Paginated<Order> | null;
};