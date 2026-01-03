<?php

namespace App\Repositories;

use App\Models\Product;
use Illuminate\Support\Facades\DB;

class ProductRepository
{
    /**
     * Create a new product.
     *
     * @param array $data
     * @return Product
     */
    public function create(array $data): Product
    {
        return DB::transaction(function () use ($data) {
            return Product::create([
                'name' => $data['name'] ?? null,
                'price' => $data['price'] ?? null,
                'stock_quantity' => $data['stock_quantity'] ?? null,
                'low_stock_threshold' => $data['low_stock_threshold'] ?? null,
            ]);
        });
    }

    /**
     * Update an existing product.
     *
     * @param Product $product
     * @param array $data
     *
     * @return Product
     */
    public function update(Product $product, array $data): Product
    {
        return DB::transaction(function () use ($product, $data) {

            $product->update($data);

            return $product->refresh();
        });
    }

    /**
     * Soft delete a product.
     *
     * @param Product $product
     *
     * @return void
     */
    public function delete(Product $product): void
    {
        DB::transaction(function () use ($product) {
            $product->delete();
        });
    }
}
