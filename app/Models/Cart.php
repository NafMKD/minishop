<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\DB;

class Cart extends Model
{
    use SoftDeletes;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'user_id',
        'status',
        'ordered_at',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'ordered_at' => 'datetime',
        ];
    }

    /**
     * Get the user that owns the cart.
     * 
     * @return BelongsTo<User, Cart>
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the cart items for the cart.
     * 
     * @return HasMany<CartItem, Cart>
     */
    public function items(): HasMany
    {
        return $this->hasMany(CartItem::class);
    }

    /**
     * Get the total price of items in the cart.
     * 
     * @return float
     */
    public function getTotalPriceAttribute(): float
    {
        return (float) $this->items()
            ->join('products', 'cart_items.product_id', '=', 'products.id')
            ->select(DB::raw('SUM(cart_items.quantity * products.price) as total'))
            ->value('total') ?? 0.0;
    }

    /**
     * Get the total number of items in the cart.
     * 
     * @return int
     */
    public function getTotalItemsAttribute(): int
    {
        return (int) $this->items()
            ->sum('quantity') ?? 0;
    }
}
