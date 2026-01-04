<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Cart;
use App\Repositories\CartRepository;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use Inertia\Response;

class CartController extends Controller
{
    use AuthorizesRequests;
    /**
     * BuildingController constructor.
     * 
     * @param  CartRepository  $carts
     */
    public function __construct(protected CartRepository $carts)
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
        $this->authorize('viewAny', Cart::class);

        $perPage = $request->query('per_page') ?? self::_DEFAULT_PAGINATION;
        $search = trim((string) $request->query('search', ''));
        $status = trim((string) $request->query('status'));

        $filters = compact('search', 'status');

        $carts = $this->carts->all($perPage, $filters);

        return Inertia::render('admin/carts/index', [
            'carts' => $carts,
            'filters' => [
                'search' => $search,
                'status' => $status,
            ],
        ]);
    }
}
