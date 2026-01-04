import { Button } from '@/components/ui/button';
import { login, logout, register } from '@/routes';
// import {
//     cart as cartRoute,
//     orders as ordersRoute,
//     profile as profileRoute,
// } from '@/routes/user';
import { Link } from '@inertiajs/react';
import { LogOut, ShoppingBag, ShoppingCart, User } from 'lucide-react';

type Props = {
    isAuthenticated: boolean;
    canRegister?: boolean;
};

export function SiteHeader({ isAuthenticated, canRegister = true }: Props) {
    return (
        <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur">
            <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
                <Link href="/" className="flex items-center gap-2">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl border bg-muted">
                        <ShoppingBag className="h-4 w-4" />
                    </div>
                    <div className="leading-tight">
                        <div className="text-sm font-semibold">MiniShop</div>
                        <div className="text-xs text-muted-foreground">
                            simple & clean
                        </div>
                    </div>
                </Link>

                {!isAuthenticated ? (
                    <div className="flex items-center gap-2">
                        <Button asChild variant="ghost">
                            <Link href={login()}>Login</Link>
                        </Button>

                        {canRegister ? (
                            <Button asChild>
                                <Link href={register()}>Register</Link>
                            </Button>
                        ) : null}
                    </div>
                ) : (
                    <div className="flex items-center gap-2">
                        <Button asChild variant="ghost" className="gap-2">
                            <Link href="#">
                                <User className="h-4 w-4" />
                                Profile
                            </Link>
                        </Button>

                        <Button asChild variant="ghost" className="gap-2">
                            <Link href="#">
                                <ShoppingBag className="h-4 w-4" />
                                Orders
                            </Link>
                        </Button>

                        <Button asChild className="gap-2">
                            <Link href="#">
                                <ShoppingCart className="h-4 w-4" />
                                Cart
                            </Link>
                        </Button>

                        <Button asChild variant="outline" className="gap-2">
                            <Link href={logout()} method="post" as="button">
                                <LogOut className="h-4 w-4" />
                                Logout
                            </Link>
                        </Button>
                    </div>
                )}
            </div>
        </header>
    );
}
