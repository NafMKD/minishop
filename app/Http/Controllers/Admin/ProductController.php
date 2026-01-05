<?php

namespace App\Http\Controllers\Admin;

use App\Exceptions\RepositoryException;
use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Repositories\ProductRepository;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ProductController extends Controller
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
     * Display a listing of products.
     *
     * @param Request $request
     * @return Response
     */
    public function index(Request $request): Response
    {
        try {
            $this->authorize('viewAny', Product::class);

            $perPage = $request->query('per_page') ?? self::_DEFAULT_PAGINATION;
            $search = trim((string) $request->query('search', ''));

            $filters = compact('search');

            $products = $this->products->all($perPage, $filters);


            return Inertia::render('admin/products/index', [
                'products' => $products,
                'filters' => [
                    'search' => $search,
                ],
            ]);
        } catch (AuthorizationException $e) {
            return Inertia::render('errors/403', [
                'message' => $e->getMessage(),
            ]);
        }

    }

    /**
     * Store a newly created product.
     * 
     * @param Request $request
     * @return RedirectResponse|Response
     */
    public function store(Request $request): RedirectResponse|Response
    {
        try {
            $this->authorize('create', Product::class);

            $data = $request->validate([
                'name' => 'required|string|max:255',
                'price' => 'required|numeric',
                'stock_quantity' => 'required|numeric',
                'low_stock_threshold' => 'nullable|numeric',
                'images' => ['required', 'array', 'min:1', 'max:5'],
                'images.*' => ['required', 'image', 'max:' . self::_DEFAULT_FILE_SIZE],
            ]);

            $data['files'] = $request->file('images', []);

            $this->products->create($data);

            return redirect()->back()->with([
                'status' => 'success',
                'message' => 'Product created successfully',
            ]);
        } catch (RepositoryException $e) {
            return redirect()->back()->with([
                'status' => 'error',
                'message' => $e->getMessage(),
            ]);
        } catch (AuthorizationException $e) {
            return Inertia::render('errors/403', [
                'message' => $e->getMessage(),
            ]);
        }
    }

    /**
     * Update the specified product.
     *
     * @param Request $request
     * @param Product $product
     * @return RedirectResponse|Response
     */
    public function update(Request $request, Product $product): RedirectResponse|Response
    {
        try {
            $this->authorize('update', $product);

            $data = $request->validate([
                'name' => 'required|string|max:255',
                'price' => 'required|numeric',
                'stock_quantity' => 'required|numeric',
                'low_stock_threshold' => 'nullable|numeric',
                'images' => ['sometimes', 'nullable', 'array', 'min:1', 'max:5'],
                'images.*' => ['required_with:images', 'image', 'max' . self::_DEFAULT_FILE_SIZE],
            ]);

            $this->products->update($product, $data);

            return redirect()->back()->with([
                'status' => 'success',
                'message' => 'Product updated successfully',
            ]);
        } catch (RepositoryException $e) {
            return redirect()->back()->with([
                'status' => 'error',
                'message' => $e->getMessage(),
            ]);
        } catch (AuthorizationException $e) {
            return Inertia::render('errors/403', [
                'message' => $e->getMessage(),
            ]);
        }
    }

    /**
     * Delete the specified product.
     * 
     * @param Product $product
     * @return RedirectResponse|Response
     */
    public function destroy(Product $product): RedirectResponse|Response
    {
        try {
            $this->authorize('delete', $product);

            $this->products->delete($product);

            return redirect()->back()->with([
                'status' => 'success',
                'message' => 'Product deleted successfully',
            ]);
        } catch (RepositoryException $e) {
            return redirect()->back()->with([
                'status' => 'error',
                'message' => $e->getMessage(),
            ]);
        } catch (AuthorizationException $e) {
            return Inertia::render('errors/403', [
                'message' => $e->getMessage(),
            ]);
        }
    }
}
