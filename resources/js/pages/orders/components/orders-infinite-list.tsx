import { router } from '@inertiajs/react';
import { useEffect, useRef, useState } from 'react';

import type { Order, Paginated } from '@/pages/orders/lib/types';
import { OrderCard } from './order-card';
import { OrdersLoading } from './orders-loading';
import { OrderDetailsModal } from './order-details-modal';

export function OrdersInfiniteList({ initial }: { initial: Paginated<Order> }) {
  const [orders, setOrders] = useState<Order[]>(initial.data);
  const [nextUrl, setNextUrl] = useState<string | null>(initial.next_page_url ?? null);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(!initial.next_page_url);

  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const fetchedUrlsRef = useRef<Set<string>>(new Set());

  const [selected, setSelected] = useState<Order | null>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOrders(initial.data);
    setNextUrl(initial.next_page_url ?? null);
    setDone(!initial.next_page_url);
    fetchedUrlsRef.current.clear();
  }, [initial.data, initial.next_page_url]);

  useEffect(() => {
    if (!sentinelRef.current) return;

    const el = sentinelRef.current;
    const io = new IntersectionObserver(
      (entries) => {
        const hit = entries.some((e) => e.isIntersecting);
        if (hit) void loadMore();
      },
      { root: null, rootMargin: '800px 0px', threshold: 0 }
    );

    io.observe(el);
    return () => io.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nextUrl, loading, done]);

  const loadMore = async () => {
    if (!nextUrl || loading || done) return;
    if (fetchedUrlsRef.current.has(nextUrl)) return;

    setLoading(true);
    fetchedUrlsRef.current.add(nextUrl);

    router.get(
      nextUrl,
      {},
      {
        preserveScroll: true,
        preserveState: true,
        replace: true,
        only: ['orders'],
        onSuccess: (page) => {
          const incoming = page.props.orders as Paginated<Order> | null;

          if (!incoming) {
            setDone(true);
            setNextUrl(null);
            return;
          }

          setOrders((prev) => {
            const seen = new Set(prev.map((o) => o.id));
            const merged = [...prev];
            for (const o of incoming.data) {
              if (!seen.has(o.id)) merged.push(o);
            }
            return merged;
          });

          const n = incoming.next_page_url ?? null;
          setNextUrl(n);
          setDone(!n);
        },
        onFinish: () => setLoading(false),
      }
    );
  };

  return (
    <>
      <div className="space-y-3">
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

        {loading && <OrdersLoading />}

        {!loading && done && (
          <div className="rounded-lg border bg-card px-4 py-3 text-sm text-muted-foreground">
            You’re all caught up.
          </div>
        )}

        <div ref={sentinelRef} />
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
