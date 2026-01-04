<?php

namespace App\Http\Controllers;

use App\Repositories\ProductRepository;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Laravel\Fortify\Features;

class WelcomeController extends Controller
{
    use AuthorizesRequests;
    /**
     * BuildingController constructor.
     * 
     * @param  ProductRepository  $products
     */
    public function __construct(protected ProductRepository $products)
    {
    }

    /**
     * Display the shop landing page with products list.
     *
     * @param Request $request
     * @return Response
     */
    public function index(Request $request): Response
    {
        $search = trim((string) $request->query('search', ''));

        $products = $this->products->getForWelcomePage($search);

        return Inertia::render('welcome', [
            'canRegister' => Features::enabled(Features::registration()),
            'products' => $products,
            'filters' => [
                'search' => $search,
            ],
        ]);
    }

}
