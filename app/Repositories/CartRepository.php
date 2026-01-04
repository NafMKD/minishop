<?php

namespace App\Repositories;

use App\Exceptions\RepositoryException;
use App\Http\Controllers\Controller;
use App\Models\Cart;
use App\Models\CartItem;
use App\Models\Order;
use App\Models\Product;
use App\Models\User;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\DB;

class CartRepository
{
    /**
     * Get all carts.
     * 
     * @param int|null $perPage
     * @param array $filters
     * @return Collection|LengthAwarePaginator
     */
    public function all(?int $perPage = null, array $filters = []): Collection|LengthAwarePaginator
    {
        $query = Cart::with([
            'user:id,name,email',
            'items',
            'items.product:id,name,price',
        ]);

        if (!empty($filters['status'])) {
            $status = $filters['status'];
            $query->where('status', $status);
        }

        if (!empty($filters['search'])) {
            $search = $filters['search'];
            $query->where(function (Builder $q) use ($search) {
                if (ctype_digit($search)) {
                    $q->orWhere('id', (int) $search);
                }

                $q->orWhereHas('user', function (Builder $uq) use ($search) {
                    $uq->where('name', 'like', '%' . $search . '%')
                        ->orWhere('email', 'like', '%' . $search . '%');
                });
            });
        }

        $query->orderByDesc('created_at');

        return $perPage ? $query->paginate($perPage) : $query->get();
    }

    /**
     * Create a new cart.
     *
     * @param array $data
     * @return Cart
     */
    public function create(array $data): Cart
    {
        return DB::transaction(function () use ($data) {
            return Cart::create([
                'user_id' => $data['user_id'] ?? null,
                'status' => $data['status'] ?? Controller::_CART_STATUSES[0],
                'ordered_at' => $data['ordered_at'] ?? null,
            ]);
        });
    }

    /**
     * Update an existing cart.
     *
     * @param Cart $cart
     * @param array $data
     *
     * @return Cart
     */
    public function update(Cart $cart, array $data): Cart
    {
        return DB::transaction(function () use ($cart, $data) {
            $cart->update($data);

            return $cart->refresh();
        });
    }

    /**
     * Soft delete a cart.
     *
     * @param Cart $cart
     *
     * @return void
     */
    public function delete(Cart $cart): void
    {
        DB::transaction(function () use ($cart) {
            $cart->update([
                'status' => Controller::_CART_STATUSES[2]
            ]);

            $cart->delete();
        });
    }

    /**
     * Get or create the user's active cart (enforced in repository).
     *
     * @param User $user
     * @return Cart
     */
    public function getOrCreateActive(User $user): Cart
    {
        return DB::transaction(function () use ($user) {
            $cart = Cart::query()
                ->where('user_id', $user->id)
                ->where('status', Controller::_CART_STATUSES[0])
                ->lockForUpdate()
                ->first();

            if ($cart) {
                return $cart;
            }

            return $this->create([
                'user_id' => $user->id,
                'status' => Controller::_CART_STATUSES[0],
            ]);
        });
    }

    /**
     * Mark a cart as ordered.
     *
     * @param Cart $cart
     * @return Cart
     */
    public function markAsOrdered(Cart $cart): Cart
    {
        return DB::transaction(function () use ($cart) {
            $cart->update([
                'status' => Controller::_CART_STATUSES[1],
                'ordered_at' => now(),
            ]);

            return $cart->refresh();
        });
    }

    /**
     * Add an item to the user's active cart (update if exists).
     *
     * @param User $user
     * @param Product $product
     * @param int $quantity
     * @return Cart
     */
    public function addItem(User $user, Product $product, int $quantity = 1): Cart
    {
        if ($quantity < 1) {
            throw new RepositoryException('Quantity must be at least 1.');
        }

        return DB::transaction(function () use ($user, $product, $quantity) {
            $cart = $this->getOrCreateActive($user);

            $item = CartItem::query()
                ->where('cart_id', $cart->id)
                ->where('product_id', $product->id)
                ->lockForUpdate()
                ->first();

            $this->assertWithinStock($product, $quantity);

            if ($item) {
                $item->update(['quantity' => $quantity]);
            } else {
                CartItem::create([
                    'cart_id' => $cart->id,
                    'product_id' => $product->id,
                    'quantity' => $quantity,
                ]);
            }

            return $cart->refresh()->load(['items','items.product', 'items.product.images']);
        });
    }


    /**
     * Remove an item from the user's active cart (soft delete cart item).
     *
     * @param User $user
     * @param Product $product
     * @return bool
     */
    public function removeItem(User $user, Product $product): bool
    {
        return DB::transaction(function () use ($user, $product) {
            $cart = $this->getOrCreateActive($user);

            $item = CartItem::query()
                ->where('cart_id', $cart->id)
                ->where('product_id', $product->id)
                ->lockForUpdate()
                ->first();

            if ($item) {
                $item->delete();
            }

            if (!$cart->items()->exists()) {
                $this->delete($cart);
            }

            return true;
        });
    }

    /**
     * Assert that the requested quantity does not exceed available stock.
     *
     * @param Product $product
     * @param int $requestedQuantity
     * @return void
     */
    protected function assertWithinStock(Product $product, int $requestedQuantity): void
    {
        if ($requestedQuantity > $product->stock_quantity) {
            throw new RepositoryException('Requested quantity exceeds available stock.');
        }
    }

    /**
     * Checkout active cart.
     * 
     * @param Cart $cart
     * @return Order
     */
    public function checkoutCart(Cart $cart): Order
    {
        if ($cart->status !== Controller::_CART_STATUSES[0]) {
            throw new RepositoryException('Only active carts can be checked out.');
        }

        if ($cart->items->isEmpty()) {
            throw new RepositoryException('Cannot checkout an empty cart.');
        }

        $orderRepository = new OrderRepository();

        return DB::transaction(function () use ($orderRepository, $cart) {
            $this->markAsOrdered($cart);

            $data = [
                'user_id' => $cart->user_id,
                'cart_id' => $cart->id,
                'total_amount' => $cart->items->sum(function (CartItem $item) {
                    return $item->quantity * $item->product->price;
                }),
            ];

            $order = $orderRepository->create($data);

            return $order;
        });
    }
}
