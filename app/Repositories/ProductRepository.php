<?php

namespace App\Repositories;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\ProductImage;
use Illuminate\Pagination\Paginator;
use Illuminate\Support\Facades\DB;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Facades\Storage;
use Throwable;

class ProductRepository
{
    /**
     * Get all products.
     * 
     * @param int|null $perPage
     * @param array $filters
     * @return Collection|LengthAwarePaginator
     */
    public function all(?int $perPage = null, array $filters = []): Collection|LengthAwarePaginator
    {
        $query = Product::query();

        if (!empty($filters['search'])) {
            $search = $filters['search'];
            $query->where('name', 'like', "%{$search}%");
        }

        $query->orderByDesc('created_at');

        return $perPage ? $query->paginate($perPage) : $query->get();
    }

    /**
     * Get for welcome page
     * 
     */
    public function getForWelcomePage(string $search): Paginator
    {
        $query = Product::with(['images']);

        if (!empty($search)) {
            $query->where('name', 'like', '%' . $search . '%');
        }

        return $query->orderByDesc('id')
            ->simplePaginate(12)
            ->through(function (Product $product) {
                return [
                    'id' => $product->id,
                    'name' => $product->name,
                    'price' => $product->price,
                    'stock_quantity' => $product->stock_quantity,
                    'images' => $product->images->map(function ($image) {
                        return [
                            'id' => $image->id,
                            'url' => Storage::url($image->path),
                        ];
                    })->values(),
                ];
            });
    }

    /**
     * Create a new product.
     *
     * @param array $data
     * @return Product
     */
    public function create(array $data): Product
    {
        DB::beginTransaction();

        $storedPaths = [];

        try {
            $product = Product::create([
                'name' => $data['name'] ?? null,
                'price' => $data['price'] ?? null,
                'stock_quantity' => $data['stock_quantity'] ?? null,
                'low_stock_threshold' => $data['low_stock_threshold'] ?? Controller::_DEFAULT_LOW_STOCK_THRESHOLD,
            ]);

            if (!empty($data['files'])) {
                foreach ($data['files'] as $index => $file) {
                    $path = $file->store("products/{$product->id}", 'public');
                    $storedPaths[] = $path;

                    ProductImage::create([
                        'product_id' => $product->id,
                        'path' => $path,
                        'sort_order' => $index,
                    ]);
                }
            }

            DB::commit();

            return $product;

        } catch (Throwable $e) {
            DB::rollBack();

            foreach ($storedPaths as $path) {
                Storage::disk('public')->delete($path);
            }

            throw $e;
        }
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
        DB::beginTransaction();

        $storedPaths = [];

        try {
            $product->update([
                'name' => $data['name'] ?? $product->name,
                'price' => $data['price'] ?? $product->price,
                'stock_quantity' => $data['stock_quantity'] ?? $product->stock_quantity,
                'low_stock_threshold' => $data['low_stock_threshold'] ?? $product->low_stock_threshold,
            ]);

            if (!empty($data['files'])) {
                foreach ($product->images as $image) {
                    Storage::disk('public')->delete($image->path);
                    $image->delete();
                }

                foreach ($data['files'] as $index => $file) {
                    $path = $file->store("products/{$product->id}", 'public');
                    $storedPaths[] = $path;

                    ProductImage::create([
                        'product_id' => $product->id,
                        'path' => $path,
                        'sort_order' => $index,
                    ]);
                }
            }

            DB::commit();

            return $product;

        } catch (Throwable $e) {
            DB::rollBack();

            foreach ($storedPaths as $path) {
                Storage::disk('public')->delete($path);
            }

            throw $e;
        }
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
            $product->images()->delete();
            $product->delete();
        });
    }
}
