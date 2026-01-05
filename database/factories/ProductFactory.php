<?php

namespace Database\Factories;

use App\Models\Product;
use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\ProductImage;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Product>
 */
class ProductFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $stock = $this->faker->numberBetween(0, 100);
        return [
            'name' => $this->faker->words(3, true),
            'price' => $this->faker->randomFloat(2, 5, 500),
            'stock_quantity' => $stock,
            'low_stock_threshold' => 10,
            'low_stock_notified_at' => null,
        ];
    }

    public function configure()
    {
        return $this->afterCreating(function (Product $product) {
            ProductImage::factory()->count(3)->create([
                'product_id' => $product->id,
            ]);
        });
    }
}
