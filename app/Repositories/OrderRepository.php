<?php

namespace App\Repositories;

use App\Exceptions\RepositoryException;
use App\Jobs\SendLowStockAlert;
use App\Models\Cart;
use App\Models\CartItem;
use App\Models\Order;
use App\Models\Product;
use App\Models\User;
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
            'items',
            'items.product:id,name',
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
     * Get all orders for a specific user.
     * 
     * @param User $user
     * @return Collection|LengthAwarePaginator
     */
    public function allForUser(User $user): Collection|LengthAwarePaginator
    {
        $orders = Order::query()
            ->where('user_id', $user->id)
            ->with([
                'items:id,order_id,product_id,quantity,unit_price',
                'items.product:id,name,price',
                'items.product.images:id,product_id,path',
            ])
            ->orderByDesc('created_at');

        return $orders->paginate(6);
    }

    /**
     * Create a new order.
     *
     * @param array $data
     * @return Order
     */
    public function create(array $data): Order
    {
        $cartId = $data['cart_id'] ?? null;

        if (!empty($cartId)) {
            $cart = Cart::findOrFail($cartId);

            if (!$cart) throw new RepositoryException('Cart not found.');
        }

        return DB::transaction(function () use ($data, $cartId) {
            $order = Order::create([
                'user_id'       => $data['user_id'] ?? null,
                'cart_id'       => $cartId,
                'total_amount'  => $data['total_amount'] ?? null,
            ]);

            if (!empty($cartId)) {
                $items = CartItem::query()
                    ->with('product')
                    ->where('cart_id', $cartId)
                    ->get();

                foreach ($items as $item) {
                    $this->addItem($order, $item->product, (int) $item->quantity);
                }
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
    public function addItem(Order $order, Product $product, int $quantity): void
    {
        if ($product->stock_quantity < $quantity) {
            throw new RepositoryException('Requested quantity exceeds available stock.');
        }

        $order->items()->create([
            'product_id' => $product->id,
            'quantity'   => $quantity,
            'unit_price' => $product->price,
        ]);

        $before = (int) $product->stock_quantity;

        $product->update([
            'stock_quantity' => $product->stock_quantity - $quantity,
        ]);

        $after = (int) $product->stock_quantity;

        $crossedIntoLow =
            $before > $product->low_stock_threshold &&
            $after <= $product->low_stock_threshold;
        
        $notNotifiedYet = $product->low_stock_notified_at === null;

        if ($crossedIntoLow && $notNotifiedYet) {
            $product->update([
                'low_stock_notified_at' => now(),
            ]);
            SendLowStockAlert::dispatch($product);
        }
    }
}
