import { Separator } from '@/components/ui/separator';
import { SiteHeader } from '@/components/shop/site-header';
import { usePage } from '@inertiajs/react';

import type { ActiveCart } from '../welcome';
import type { OrdersPageProps } from './lib/types';

import { OrdersIntro } from './components/orders-intro';
import { OrdersLayout } from './components/orders-layout';
import { OrdersSidebar } from './components/orders-sidebar';
import { OrdersInfiniteList } from './components/orders-infinite-list';
import { EmptyOrdersState } from './components/empty-orders-state';

export default function OrdersPage() {
  const { props } = usePage<OrdersPageProps>();

  const isAuthenticated = !!props.auth.user;
  const isAdmin = !!props.auth.user?.is_admin || null;
  const name = props.auth.user?.name || null;
  const active_cart = props.auth.user?.active_cart
    ? (props.auth.user?.active_cart as ActiveCart).items?.length
    : null;

  const initial = props.orders;

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader
        isAuthenticated={isAuthenticated}
        isAdmin={isAdmin}
        canRegister={true}
        name={name}
        active_cart={active_cart}
      />

      <main className="mx-auto max-w-6xl px-4 py-8">
        <OrdersIntro totalOrders={initial?.total ?? initial?.data?.length ?? 0} />

        <Separator className="mb-6" />

        {!initial || initial.data.length === 0 ? (
          <EmptyOrdersState />
        ) : (
          <OrdersLayout
            list={<OrdersInfiniteList initial={initial} />}
            sidebar={<OrdersSidebar initial={initial} />}
          />
        )}
      </main>
    </div>
  );
}
