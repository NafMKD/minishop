<?php

namespace App\Repositories;

use App\Exceptions\RepositoryException;
use App\Models\Cart;
use App\Models\CartItem;
use App\Models\Order;
use App\Models\Product;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\DB;

class OrderRepository
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
        $query = Order::with([
            'user:id,name,email',
            'items'
        ]);

        if (!empty($filters['status'])) {
            $status = $filters['status'];
            $query->where('status', $status);
        }

        if (!empty($filters['search'])) {
            $search = $filters['search'];
            $$query->where(function (Builder $q) use ($search) {
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
     * Create a new order.
     *
     * @param array $data
     * @return Order
     */
    public function create(array $data): Order
    {
        if ($data['cart_id']) {
            $cart = Cart::findOrFail($data['cart_id'])->get();

            if (!$cart) {
                throw new RepositoryException('Cart not found.');
            }
        }

        return DB::transaction(function () use ($data) {
            $order = Order::create([
                'user_id' => $data['user_id'] ?? null,
                'cart_id' => $data['cart_id'] ?? null,
                'total_amount' => $data['total_amount'] ?? null,
            ]);

            if ($data['cart_id']) {
                $items = CartItem::query()
                    ->where('cart_id', $data['cart_id'])
                    ->get();

                $order->items()->createMany($items->map(
                    function ($item) use ($order) {
                        return $this->addItem($order, $item->product, $item->quantity);
                    }
                ));
            }

            return $order->refresh()->load(['items.product']);
        });
    }

    /**
     * Update an existing order.
     *
     * @param Order $order
     * @param array $data
     *
     * @return Order
     */
    public function update(Order $order, array $data): Order
    {
        return DB::transaction(function () use ($order, $data) {
            $order->update($data);

            return $order->refresh();
        });
    }

    /**
     * Soft delete an order.
     *
     * @param Order $order
     *
     * @return void
     */
    public function delete(Order $order): void
    {
        DB::transaction(function () use ($order) {
            $order->delete();
        });
    }

    /**
     * Add an item to the order.
     *
     * @param Order $order
     * @param Product $product
     * @param int $quantity
     *
     * @return Order
     */
    public function addItem(Order $order, Product $product, int $quantity): Order
    {
        return DB::transaction(function () use ($order, $product, $quantity) {
            $order->items()->create([
                'product_id' => $product->id,
                'quantity' => $quantity,
            ]);

            return $order->refresh();
        });
    }
}
