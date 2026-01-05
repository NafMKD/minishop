<?php

namespace App\Http\Controllers;

use App\Repositories\OrderRepository;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use Inertia\Response;
use Throwable;

class OrderController extends Controller
{
    use AuthorizesRequests;

    /**
     * BuildingController constructor.
     * 
     * @param  OrderRepository $orderRepository
     */
    public function __construct(protected OrderRepository $orderRepository)
    {
    }

    /**
     * Get orders for the authenticated user.
     * 
     * @param Request $request
     * @return Response|RedirectResponse
     */
    public function index(Request $request): Response|RedirectResponse
    {
        try {
            $user = Auth::user();
            $orders = $this->orderRepository->allForUser($user);

            return Inertia::render('orders/index', [
                'orders' => $orders,
            ]);
        } catch (Throwable $e) {
            Log::error("Failed to get orders for user: " . $e->getMessage());
            return redirect()->back()->with([
                'status' => 'error',
                'message' => 'An unexpected error occurred.',
            ]);
        }
    }
}
