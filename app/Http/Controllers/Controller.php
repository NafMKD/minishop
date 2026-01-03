<?php

namespace App\Http\Controllers;

abstract class Controller
{
    public const _CART_STATUSES = [
        'active',
        'ordered',
        'deleted'
    ];
    public const _DEFAULT_PAGINATION = 10;
    public const _DEFAULT_FILE_SIZE = 5120;
    public const _DEFAULT_LOW_STOCK_THRESHOLD = 0;
}
