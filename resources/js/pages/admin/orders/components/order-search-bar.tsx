import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

type Props = {
    value: string;
    onChange: (v: string) => void;
    onSubmit: () => void;
    onReset: () => void;
};

export function OrderSearchBar({ value, onChange, onSubmit, onReset }: Props) {
    return (
        <div className="flex w-full flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative w-full sm:max-w-md">
                <Search className="absolute top-2.5 left-2 h-4 w-4 text-muted-foreground" />
                <Input
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder="Search by order ID, user name, or email..."
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
