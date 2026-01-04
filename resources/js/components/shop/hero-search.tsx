import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

type Props = {
    search: string;
    onChangeSearch: (v: string) => void;
    onSearch: () => void;
    onReset: () => void;
};

export function HeroSearch({
    search,
    onChangeSearch,
    onSearch,
    onReset,
}: Props) {
    return (
        <section className="mx-auto max-w-6xl px-4 pt-10">
            <div className="relative overflow-hidden rounded-3xl border bg-gradient-to-b from-muted/40 to-background p-6 sm:p-10">
                <div className="max-w-2xl">
                    <div className="inline-flex items-center gap-2 rounded-full border bg-background px-3 py-1 text-xs text-muted-foreground">
                        <span className="h-2 w-2 rounded-full bg-green-500" />
                        Fresh products • Smooth checkout
                    </div>

                    <h1 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">
                        Discover products you'll actually want.
                    </h1>

                    <p className="mt-2 text-sm text-muted-foreground sm:text-base">
                        Browse a curated set of items, add to cart, and checkout
                        in seconds.
                    </p>

                    <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
                        <div className="flex w-full max-w-xl items-center gap-2 rounded-2xl border bg-background p-2">
                            <Input
                                value={search}
                                onChange={(e) => onChangeSearch(e.target.value)}
                                placeholder="Search products..."
                                className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') onSearch();
                                }}
                            />
                            <Button onClick={onSearch} className="rounded-xl">
                                Search
                            </Button>
                        </div>

                        <Button
                            variant="ghost"
                            onClick={onReset}
                            className="justify-start sm:justify-center"
                        >
                            Reset
                        </Button>
                    </div>
                </div>

                <div className="pointer-events-none absolute -top-24 -right-24 h-64 w-64 rounded-full bg-primary/10 blur-3xl" />
                <div className="pointer-events-none absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-primary/10 blur-3xl" />
            </div>
        </section>
    );
}
