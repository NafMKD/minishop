<?php

namespace App\Http\Controllers;

use App\Models\Cart;
use App\Models\Product;
use App\Models\User;
use App\Repositories\CartRepository;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use Inertia\Response;
use Throwable;

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
     * Get the active cart for the authenticated user.
     * 
     * @param Request $request
     * @return Response|RedirectResponse
     */
    public function getUserActiveCart(Request $request): Response|RedirectResponse
    {
        try {
            $user = Auth::user();
            $cart = $user->activeCart;
            

            if ($cart) $cart->load('items', 'items.product', 'items.product.images');

            return Inertia::render('carts/index', [
                'cart' => $cart,
                'total_price' => $cart ? $cart->total_price : 0,
                'total_items' => $cart ? $cart->total_items : 0,
                'active_cart' => Auth::user() ? (Auth::user()->activeCart ? true : false) : null,
            ]);
            
        }  catch (Throwable $e) {
            return redirect()->back()->with([
                'status' => 'error',
                'message' => 'An unexpected error occurred.',
            ]);
        }
    }

    /**
     * Add item to cart (create if not exists).
     * 
     * @param Request $request
     * @param Product $product
     * @return RedirectResponse|Response
     */
    public function addItemToCart(Request $request, Product $product): RedirectResponse|Response
    {
        try {
            $data = $request->validate([
                'quantity' => 'required|integer|min:1',
            ]);

            $this->carts->addItem(
                user: Auth::user(),
                product: $product,
                quantity: (int) $data['quantity'],
            );

            return redirect()->back()->with([
                'status' => 'success',
                'message' => 'Item added to cart successfully.',
            ]);
        } catch (Throwable $e) {
            return redirect()->back()->with([
                'status' => 'error',
                'message' => 'Failed to add item to cart.',
            ]);
        }
    }
}
