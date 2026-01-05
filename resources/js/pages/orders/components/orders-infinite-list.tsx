import { router } from '@inertiajs/react';
import { useMemo, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

import type { Order, Paginated } from '@/pages/orders/lib/types';
import { OrderCard } from './order-card';
import { OrderDetailsModal } from './order-details-modal';
import { Button } from '@/components/ui/button';

function PaginationControls({
  prevUrl,
  nextUrl,
  loading,
  onPrev,
  onNext,
  pageLabel,
}: {
  prevUrl: string | null;
  nextUrl: string | null;
  loading: boolean;
  onPrev: () => void;
  onNext: () => void;
  pageLabel?: string | null;
}) {
  return (
    <div className="flex items-center justify-between gap-3">
      <Button type="button" variant="outline" disabled={!prevUrl || loading} onClick={onPrev}>
        <ChevronLeft className="mr-2 h-4 w-4" />
        Previous
      </Button>

      {pageLabel ? <div className="text-sm text-muted-foreground">{pageLabel}</div> : <div />}

      <Button type="button" variant="outline" disabled={!nextUrl || loading} onClick={onNext}>
        Next
        <ChevronRight className="ml-2 h-4 w-4" />
      </Button>
    </div>
  );
}

export function OrdersInfiniteList({ initial }: { initial: Paginated<Order> }) {
  // initialize once from initial
  const [orders, setOrders] = useState<Order[]>(() => initial.data);
  const [nextUrl, setNextUrl] = useState<string | null>(() => initial.next_page_url ?? null);
  const [prevUrl, setPrevUrl] = useState<string | null>(() => initial.prev_page_url ?? null);

  const [loading, setLoading] = useState(false);

  const [selected, setSelected] = useState<Order | null>(null);
  const [open, setOpen] = useState(false);

  const listTopRef = useRef<HTMLDivElement | null>(null);

  const pageLabel = useMemo(() => {
    const p = initial.current_page;
    const last = initial.last_page;
    return p && last ? `Page ${p} of ${last}` : null;
  }, [initial.current_page, initial.last_page]);

  const go = (url: string | null) => {
    if (!url || loading) return;

    setLoading(true);

    router.get(
      url,
      {},
      {
        preserveScroll: true,
        preserveState: true,
        replace: true,
        only: ['orders'],
        onSuccess: (page) => {
          const incoming = page.props.orders as Paginated<Order> | undefined;
          if (!incoming) return;

          setOrders(incoming.data);
          setNextUrl(incoming.next_page_url ?? null);
          setPrevUrl(incoming.prev_page_url ?? null);

          listTopRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        },
        onFinish: () => setLoading(false),
      }
    );
  };

  return (
    <>
      <div ref={listTopRef} className="space-y-3">
        {orders.map((order) => (
          <OrderCard
            key={order.id}
            order={order}
            onView={(o) => {
              setSelected(o);
              setOpen(true);
            }}
          />
        ))}

        <PaginationControls
          prevUrl={prevUrl}
          nextUrl={nextUrl}
          loading={loading}
          onPrev={() => go(prevUrl)}
          onNext={() => go(nextUrl)}
          pageLabel={pageLabel}
        />
      </div>

      <OrderDetailsModal
        open={open}
        onOpenChange={(v) => {
          setOpen(v);
          if (!v) setSelected(null);
        }}
        order={selected}
      />
    </>
  );
}
