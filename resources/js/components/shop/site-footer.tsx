export function SiteFooter() {
    return (
        <footer className="border-t">
            <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-8 sm:flex-row sm:items-center sm:justify-between">
                <div className="text-sm text-muted-foreground">
                    © {new Date().getFullYear()} MiniShop
                </div>
                <div className="text-xs text-muted-foreground">
                    Built with Laravel + React + Tailwind
                </div>
            </div>
        </footer>
    );
}
