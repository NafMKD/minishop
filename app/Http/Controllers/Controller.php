<?php

namespace App\Http\Controllers;

abstract class Controller
{
    public const _CART_STATUSES = [
        'active',
        'ordered',
        'deleted'
    ];
}
