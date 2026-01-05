<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\Product;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Inertia\Response;
use Carbon\Carbon;

class DashboardController extends Controller
{
    /**
     * Display the admin dashboard with key metrics.
     * 
     * @return Response
     */
    public function index(Request $request): Response
    {
        $dashboard = Cache::remember('admin.dashboard', now()->addMinutes(5), function () {

            $counts = [
                'orders' => Order::count(),
                'revenue' => (float) Order::sum('total_amount'),
                'products' => Product::count(),
                'customers' => User::where('is_admin', false)->count(),
            ];

            $ordersByDay = Order::query()
                ->where('created_at', '>=', now()->subDays(14))
                ->selectRaw('
                    DATE(created_at) as date,
                    COUNT(*) as orders,
                    SUM(total_amount) as revenue
                ')
                ->groupByRaw('DATE(created_at)')
                ->orderBy('date')
                ->get()
                ->map(fn($r) => [
                    'date' => Carbon::createFromFormat('Y-m-d', $r->date)->format('M j'),
                    'orders' => (int) $r->orders,
                    'revenue' => (float) $r->revenue,
                ]);

            $recentOrders = Order::query()
                ->select('id', 'user_id', 'total_amount', 'created_at')
                ->with('user:id,name')
                ->latest()
                ->limit(10)
                ->get()
                ->map(fn($o) => [
                    'id' => $o->id,
                    'customer_name' => $o->user?->name,
                    'total_amount' => (float) $o->total_amount,
                    'created_at' => $o->created_at->toISOString(),
                ]);

            return compact('counts', 'ordersByDay', 'recentOrders');
        });

        return inertia('admin/dashboard', [
            'dashboard' => $dashboard,
        ]);
    }
}
