<?php

namespace App\Policies;

use App\Http\Controllers\Controller;
use App\Models\Cart;
use App\Models\User;

class CartPolicy
{
    /**
     * Only the owner can view the cart.
     *
     * @param User $user
     * @param Cart $cart
     * @return bool
     */
    public function view(User $user, Cart $cart): bool
    {
        return $cart->user_id === $user->id;
    }

    /**
     * Only the owner can update the cart.
     *
     * @param User $user
     * @param Cart $cart
     * @return bool
     */
    public function update(User $user, Cart $cart): bool
    {
        return $cart->user_id === $user->id && $cart->status === Controller::_CART_STATUSES[0];
    }

    /**
     * Only the owner can delete the cart.
     *
     * @param User $user
     * @param Cart $cart
     * @return bool
     */
    public function delete(User $user, Cart $cart): bool
    {
        return $cart->user_id === $user->id && $cart->status === Controller::_CART_STATUSES[0];
    }
}
