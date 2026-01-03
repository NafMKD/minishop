<?php

namespace App\Policies;

use App\Models\Order;
use App\Models\User;

class OrderPolicy
{
    /**
     * All can view any orders.
     *
     * @param User $user
     * @return bool
     */
    public function viewAny(User $user): bool
    {
        return true;
    }

    /**
     * Only the owner can view the order.
     *
     * @param User $user
     * @param Order $order
     * @return bool
     */
    public function view(User $user, Order $order): bool
    {
        return $order->user_id === $user->id;
    }

    /**
     * Only admin can delete the order.
     *
     * @param User $user
     * @param Order $order
     * @return bool
     */
    public function delete(User $user, Order $order): bool
    {
        return (bool) $user->is_admin;
    }

    /**
     * Only admin can restore the order.
     *
     * @param User $user
     * @param Order $order
     * @return bool
     */
    public function restore(User $user, Order $order): bool
    {
        return (bool) $user->is_admin;
    }

    /**
     * Only admin can delete the order permanently.
     *
     * @param User $user
     * @param Order $order
     * @return bool
     */
    public function forceDelete(User $user, Order $order): bool
    {
        return (bool) $user->is_admin;
    }
}
