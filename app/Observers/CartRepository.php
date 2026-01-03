<?php

namespace App\Repositories;

use App\Exceptions\RepositoryException;
use App\Http\Controllers\Controller;
use App\Models\Cart;
use App\Models\CartItem;
use App\Models\Product;
use App\Models\User;
use Illuminate\Support\Facades\DB;

class CartRepository
{
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
     * Add an item to the user's active cart (increment if exists).
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

            $newQuantity = ($item?->quantity ?? 0) + $quantity;

            $this->assertWithinStock($product, $newQuantity);

            if ($item) {
                $item->update(['quantity' => $newQuantity]);
            } else {
                CartItem::create([
                    'cart_id' => $cart->id,
                    'product_id' => $product->id,
                    'quantity' => $newQuantity,
                ]);
            }

            return $cart->refresh()->load(['items.product']);
        });
    }


    /**
     * Remove an item from the user's active cart (soft delete cart item).
     *
     * @param User $user
     * @param Product $product
     * @return Cart
     */
    public function removeItem(User $user, Product $product): Cart
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

            return $cart->refresh()->load(['items.product']);
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
}
