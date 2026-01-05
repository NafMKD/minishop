import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { carts, login, logout, orders, register } from '@/routes';
import { dashboard } from '@/routes/admin';
import { Link } from '@inertiajs/react';
import {
    LayoutDashboard,
    LogOut,
    ShoppingBag,
    ShoppingCart,
    User,
} from 'lucide-react';
import { Avatar, AvatarFallback } from '../ui/avatar';

type Props = {
    isAuthenticated: boolean;
    isAdmin: boolean | null;
    canRegister?: boolean;
    name: string | null;
    active_cart?: number | null;
};

export function SiteHeader({
    isAuthenticated,
    isAdmin,
    canRegister = true,
    name,
    active_cart,
}: Props) {
    const getInitials = (name: string) => {
        if (name.split(' ').length > 1) {
            return name
                .split(' ')
                .map((word) => word[0].toUpperCase())
                .join('');
        } else {
            return name.slice(0, 2).toUpperCase();
        }
    };
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
                ) : isAdmin ? (
                    <div className="flex items-center gap-2">
                        <Button asChild className="gap-2">
                            <Link href={dashboard()}>
                                <LayoutDashboard className="h-4 w-4" />
                                Dashboard
                            </Link>
                        </Button>

                        <div className="hidden h-8 w-[2px] bg-border sm:block" />

                        <Button asChild variant="outline" className="gap-2">
                            <Link href={logout()} method="post" as="button">
                                <LogOut className="h-4 w-4" />
                                Logout
                            </Link>
                        </Button>
                    </div>
                ) : (
                    <div className="flex items-center gap-3">
                        <Button asChild variant="ghost" className="gap-2">
                            <Link href={orders()}>
                                <ShoppingBag className="h-4 w-4" />
                                Orders
                            </Link>
                        </Button>

                        <Button asChild className="relative gap-2">
                            <Link href={carts()} className="flex items-center">
                                <ShoppingCart className="h-4 w-4" />
                                Cart
                                {active_cart && (
                                    <span className="absolute -top-1 -right-2 inline-flex items-center justify-center rounded-full bg-yellow-400 px-1.5 py-0.5 text-xs leading-none font-bold text-black">
                                        {active_cart}
                                    </span>
                                )}
                            </Link>
                        </Button>

                        <div className="hidden h-8 w-[2px] bg-border sm:block" />

                        <DropdownMenu>
                            <DropdownMenuTrigger
                                asChild
                                className="cursor-pointer"
                            >
                                <button className="flex items-center focus:outline-none">
                                    <Avatar className="h-9 w-9">
                                        <AvatarFallback className="font-semibold">
                                            {name ? getInitials(name) : 'TU'}
                                        </AvatarFallback>
                                    </Avatar>
                                </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="start" className="w-40">
                                <DropdownMenuItem asChild>
                                    <Link
                                        href="/settings/profile"
                                        className="flex items-center gap-2"
                                    >
                                        <User className="h-4 w-4" />
                                        Profile
                                    </Link>
                                </DropdownMenuItem>

                                <DropdownMenuSeparator className="h-[2px]" />
                                <DropdownMenuItem asChild>
                                    <Link
                                        href={logout()}
                                        method="post"
                                        as="button"
                                        className="flex items-center gap-2 text-destructive"
                                    >
                                        <LogOut className="h-4 w-4" />
                                        Logout
                                    </Link>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                )}
            </div>
        </header>
    );
}
