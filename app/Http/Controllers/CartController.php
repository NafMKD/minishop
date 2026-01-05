<?php

namespace App\Http\Controllers;

use App\Models\Cart;
use App\Models\Product;
use App\Repositories\CartRepository;
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

            if (!$cart) {
                return Inertia::render('carts/index', [
                    'cart' => null,
                    'total_price' => 0,
                    'total_items' => 0,
                    'active_cart' => null,
                ]);
            }

            $active_cart =  Auth::user()->activeCart;
            $active_cart->load('items', 'items.product', 'items.product.images');

            return Inertia::render('carts/index', [
                'cart' => $cart,
                'total_price' => $cart ? $cart->total_price : 0,
                'total_items' => $cart ? $cart->total_items : 0,
                'active_cart' => $active_cart,
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
            if (Auth::user()->is_admin) {
                return redirect()->back()->with([
                    'status' => 'error',
                    'message' => 'You must be user to add item to cart.',
                ]);
            }

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
            Log::error('Error adding item to cart: ' . $e->getMessage());
            return redirect()->back()->with([
                'status' => 'error',
                'message' => 'Failed to add item to cart.',
            ]);
        }
    }

    /**
     * Remove item from cart.
     * 
     * @param Request $request
     * @param Product $product
     * @return RedirectResponse|Response
     */
    public function removeItemToCart(Request $request, Product $product): RedirectResponse|Response
    {
        try {
            $this->carts->removeItem(
                user: Auth::user(),
                product: $product,
            );

            return redirect()->back()->with([
                'status' => 'success',
                'message' => 'Item removed from cart successfully.',
            ]);
        } catch (Throwable $e) {
            return redirect()->back()->with([
                'status' => 'error',
                'message' => 'Failed to remove item from cart.',
            ]);
        }
    }

    /**
     * Checkout active cart.
     * 
     * @param Request $request
     * @return RedirectResponse|Response
     * @throws Throwable
     */
    public function checkOutActiveCart(Request $request): RedirectResponse|Response
    {
        try {
            $cart = Auth::user()->activeCart;
            if (!$cart) {
                return redirect()->back()->with([
                    'status' => 'error',
                    'message' => 'No active cart to checkout.',
                ]);
            }

            $order = $this->carts->checkoutCart(
                cart: $cart,
            );

            return redirect()->back()->with([
                'status' => 'success',
                'message' => 'Checkout completed successfully.',
            ]);
        } catch (Throwable $e) {
            return redirect()->back()->with([
                'status' => 'error',
                'message' => 'Failed to checkout cart.',
            ]);
        }
    }
}
