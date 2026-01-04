<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Repositories\OrderRepository;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Http\Request;
use Inertia\Response;
use Inertia\Inertia;

class OrderController extends Controller
{
    use AuthorizesRequests;
    /**
     * BuildingController constructor.
     * 
     * @param  OrderRepository  $orders
     */
    public function __construct(protected OrderRepository $orders)
    {
    }

    /**
     * Display a listing of carts.
     *
     * @param Request $request
     * @return Response
     */
    public function index(Request $request): Response
    {
        $this->authorize('viewAny', Order::class);

        $perPage = $request->query('per_page') ?? self::_DEFAULT_PAGINATION;
        $search = trim((string) $request->query('search', ''));

        $filters = compact('search');

        $orders = $this->orders->all($perPage, $filters);

        return Inertia::render('admin/orders/index', [
            'orders' => $orders,
            'filters' => [
                'search' => $search,
            ],
        ]);
    }
}
