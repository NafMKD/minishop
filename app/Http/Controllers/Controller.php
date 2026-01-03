<?php

namespace App\Http\Controllers;

abstract class Controller
{
    public static const _CART_STATUSES = [
        'active',
        'ordered',
        'deleted'
    ];
}
