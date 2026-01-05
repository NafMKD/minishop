# Simple E-commerce Shopping Cart (Laravel + React)

This project is a small e-commerce shopping cart system built with Laravel (backend) and React (Inertia) using the Laravel React Starter Kit UI (shadcn) and Tailwind CSS. It includes an admin dashboard for managing products, monitoring carts, and viewing orders, and a user-facing storefront with cart and checkout.

## Features

### Unauthenticated users

* Browse the storefront product list
* Search products
* Authentication entry points (Login / Register) from the header

### Authenticated users

* Persistent cart stored in the database (no session/local storage cart)
* Add products to cart
* Update cart item quantities (validated against stock)
* Remove items from cart
* Checkout:

  * Cart is marked as ordered
  * Order record is created from cart items
* View personal orders (list + details view)

### Admin users

* Admin dashboard (under `/admin`)
* Product management:

  * List products with search and pagination
  * Create products (with 1–5 images upload)
  * Update product details and images
  * Soft-delete products
* Cart monitoring:

  * List carts with search by cart owner name and status (active / ordered / deleted) with pagination
  * View cart details in a modal
* Orders monitoring:

  * List orders with search by order owner and pagination
  * View order details

## Key requirements implemented

* Each cart is associated with the authenticated user.
* All cart actions (add/update/remove/checkout) persist to the database and are retrieved by authenticated user.
* Low stock notification:

  * When cart actions reduce product stock near the configured threshold, a Laravel Job/Queue sends an email to a dummy admin user.
  * Implemented as event-driven logic on checkout rather than a periodic scan.
* Daily sales report:

  * Scheduled job runs every evening (6pm) and emails a summary of products sold that day to the dummy admin user.

## System design / architecture

* Policy + Repository pattern:

  * Request flow: View → Controller → Policy → Repository
  * Policies enforce authorization (including `is_admin` gates for admin-only operations).
  * Repositories contain create/update/delete logic and helper methods (no “view” methods).
  * Repository operations use database transactions.
* Soft deletes:

  * Products, carts, cart items, orders (and related entities) use soft deletes.
* Cart lifecycle:

  * Cart statuses are used instead of hard deletion:

    * `active` for current working cart
    * `ordered` after checkout
    * `deleted` when user removes it (soft delete + status update where applicable)
  * Enforced in repository logic: only one non-deleted active cart per user.
* Audit logging:

  * Implemented via model observers (not handled inside repositories).
  * Captures key create/update/delete events for traceability.

## Frontend implementation details

* Uses Laravel React Starter Kit (Inertia + React) with shadcn UI components and Tailwind.
* Admin UI:

  * Search + pagination tables for products/carts/orders.
  * Modals for create/edit and detail views.
  * API calls separated.
  * UI split into reusable components.
  * Controlled inputs; validation via zod on the client.
* Storefront UI:

  * Lightweight public pages (not using dashboard layout).
  * Product list with search + pagination.

## Performance optimizations and caching

* Product listing:

  * Returns only fields required by the UI.
  * Loads only the first image for product cards.
* Admin Dashboard:

  * Used caching, since Dashboard metrics do not need real-time accuracy. 
    > Reduces ~7 DB queries → 0 queries for 5 minutes.
* Admin tables:

  * Paginated queries with search filtering.
  * Eager loading limited to required relations/columns.
* Background processing:

  * Low-stock and daily report tasks run asynchronously via queue/scheduler.


## Tech stack

* Backend: Laravel
* Frontend: React (Inertia)
* UI: shadcn + Tailwind CSS
* Database: MySQL 
* Queue: Laravel queue (database)
* Scheduler: Laravel scheduler 
* Version control: Git/GitHub

## Local setup

### Requirements

* PHP 8.2+
* Composer
* Node.js 18+
* A database (MySQL/PostgreSQL)

### Installation

1. Clone the repository and install dependencies:

   * `composer install`
   * `npm install`

2. Environment:

   * Copy `.env.example` to `.env`
   * Set `APP_URL`
   * Configure `DB_*` settings
   * Configure mail settings (for dummy admin emails)
   * Configure queue driver (`QUEUE_CONNECTION=database` recommended locally)

3. App key + migrations:

   * `php artisan key:generate`
   * `php artisan migrate`

4. Storage link (for product images):

   * `php artisan storage:link`

5. Run the app:

   * `composer run dev`

### Queue worker (for low stock emails)

Run one of the following:

* `php artisan queue:work`

### Scheduler (for daily sales report)

For local development you can run:

* `php artisan schedule:work`


### Dummy admin user

Create a dummy admin user:

* `php artisan db:seed --class=AdminUserSeeder`
> Don't forget to set `ADMIN_EMAIL` in `.env` to the target recipient for low-stock and daily report emails.

## Notes

* The cart is database-backed per user and not stored in session/local storage.
* All destructive actions are soft deletes to preserve history and enable reporting.
* Queue + scheduler must be running to observe low-stock notifications and daily report emails.
