import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

type Props = {
    value: string;
    onChange: (v: string) => void;
    onSubmit: () => void;
    onReset: () => void;
};

export function ProductSearchBar({ value, onChange, onSubmit, onReset }: Props) {
    return (
        <div className="flex w-full flex-col gap-3 sm:flex-row sm:items-center">
            <div className="relative w-full sm:max-w-md">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder="Search products..."
                    className="pl-8"
                />
            </div>

            <div className="flex gap-2">
                <Button type="button" variant="secondary" onClick={onSubmit}>
                    Search
                </Button>

                <Button type="button" variant="ghost" onClick={onReset}>
                    Reset
                </Button>
            </div>
        </div>
    );
}
