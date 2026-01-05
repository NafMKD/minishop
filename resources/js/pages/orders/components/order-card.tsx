import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

import type { Order } from '@/pages/orders/lib/types';
import { formatDate, money } from '../lib/format';

export function OrderCard({
    order,
    onView,
}: {
    order: Order;
    onView: (order: Order) => void;
}) {
    return (
        <Card className="overflow-hidden">
            <CardContent className="pt-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                            <div className="truncate text-sm font-medium">
                                Order{' '}
                                {order.number
                                    ? `#${order.number}`
                                    : `#${order.id}`}
                            </div>
                            <Badge variant="default">Approved</Badge>
                        </div>

                        <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
                            <span>
                                Placed:{' '}
                                <span className="font-medium text-foreground">
                                    {formatDate(order.created_at) || '—'}
                                </span>
                            </span>
                            <span>
                                Total:{' '}
                                <span className="font-medium text-foreground">
                                    {money(order.total_amount)}
                                </span>
                            </span>
                            <span>
                                Items:{' '}
                                <span className="font-medium text-foreground">
                                    {order.items?.length ?? 0}
                                </span>
                            </span>
                        </div>
                    </div>

                    <div className="flex shrink-0 gap-2">
                        <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => onView(order)}
                        >
                            View
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
