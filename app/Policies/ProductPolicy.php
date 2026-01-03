<?php

namespace App\Policies;

use App\Models\Product;
use App\Models\User;

class ProductPolicy
{
    /**
     * All view any products.
     *
     * @param User $user
     * @return bool
     */
    public function viewAny(User $user): bool
    {
        return true;
    }

    /**
     * All view the product.
     *
     * @param User $user
     * @param Product $product
     * @return bool
     */
    public function view(User $user, Product $product): bool
    {
        return true;
    }

    /**
     *  Only admin can create products.
     *
     * @param User $user
     * @return bool
     */
    public function create(User $user): bool
    {
        return (bool) $user->is_admin;
    }

    /**
     *  Only admin can can update the product.
     *
     * @param User $user
     * @param Product $product
     * @return bool
     */
    public function update(User $user, Product $product): bool
    {
        return (bool) $user->is_admin;
    }

    /**
     * Only admin can delete the product.
     *
     * @param User $user
     * @param Product $product
     * @return bool
     */
    public function delete(User $user, Product $product): bool
    {
        return (bool) $user->is_admin;
    }

    /**
     *  Only admin can the product.
     *
     * @param User $user
     * @param Product $product
     * @return bool
     */
    public function restore(User $user, Product $product): bool
    {
        return (bool) $user->is_admin;
    }

    /**
     * Only admin can delete the produt
     *
     * @param User $user
     * @param Product $product
     * @return bool
     */
    public function forceDelete(User $user, Product $product): bool
    {
        return (bool) $user->is_admin;
    }
}
