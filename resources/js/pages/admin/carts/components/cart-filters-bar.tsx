import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Search } from 'lucide-react';

type Props = {
    search: string;
    status: string;
    onChangeSearch: (v: string) => void;
    onChangeStatus: (v: string) => void;
    onSubmit: () => void;
    onReset: () => void;
};

export function CartFiltersBar({
    search,
    status,
    onChangeSearch,
    onChangeStatus,
    onSubmit,
    onReset,
}: Props) {
    return (
        <div className="flex w-full flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex w-full flex-col gap-3 sm:flex-row sm:items-center">
                <div className="relative w-full sm:max-w-md">
                    <Search className="absolute top-2.5 left-2 h-4 w-4 text-muted-foreground" />
                    <Input
                        value={search}
                        onChange={(e) => onChangeSearch(e.target.value)}
                        placeholder="Search by cart ID, user name, or email..."
                        className="pl-8"
                    />
                </div>

                <div className="w-full sm:w-[220px]">
                    <Select value={status} onValueChange={onChangeStatus}>
                        <SelectTrigger>
                            <SelectValue placeholder="Filter by status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All</SelectItem>
                            <SelectItem value="active">Active</SelectItem>
                            <SelectItem value="ordered">Ordered</SelectItem>
                            <SelectItem value="deleted">Deleted</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <div className="flex gap-2">
                <Button type="button" variant="secondary" onClick={onSubmit}>
                    Apply
                </Button>

                <Button type="button" variant="ghost" onClick={onReset}>
                    Reset
                </Button>
            </div>
        </div>
    );
}
