<?php

namespace App\Jobs;

use App\Mail\DailySalesReportMail;
use App\Models\Order;
use App\Models\OrderItem;
use Carbon\Carbon;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Support\Facades\Mail;

class SendDailySalesReport implements ShouldQueue
{
    use Queueable;

    /**
     * Create a new job instance.
     */
    public function __construct(public ?string $date = null)
    {
        //
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        $day = $this->date
            ? Carbon::parse($this->date)->startOfDay()
            : now()->startOfDay();

        $start = $day->copy();
        $end = $day->copy()->endOfDay();

        $ordersCount = Order::whereBetween('created_at', [$start, $end])->count();

        $items = OrderItem::query()
            ->join('orders', 'orders.id', '=', 'order_items.order_id')
            ->whereBetween('orders.created_at', [$start, $end])
            ->join('products', 'products.id', '=', 'order_items.product_id')
            ->selectRaw(
                'order_items.product_id, products.name as product_name, 
            SUM(order_items.quantity) as qty_sold, 
            SUM(order_items.quantity * order_items.unit_price) as gross'
            )
            ->groupBy('order_items.product_id', 'products.name')
            ->orderByDesc('qty_sold')
            ->get();

        $itemsSold = $items->sum('qty_sold');
        $grossRevenue = $items->sum('gross');

        $rows = $items->map(fn($r) => [
            'product_id' => (int) $r->product_id,
            'product_name' => $r->product_name,
            'qty_sold' => (int) $r->qty_sold,
            'gross' => number_format((float) $r->gross, 2),
        ])->all();

        $summary = [
            'orders_count' => $ordersCount,
            'items_sold' => (int) $itemsSold,
            'gross_revenue' => number_format((float) $grossRevenue, 2),
        ];

        $dateLabel = $day->format('Y-m-d');

        Mail::to(config('shop.admin_email'))
            ->send(new DailySalesReportMail($dateLabel, $rows, $summary));
    }
}
