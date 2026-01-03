import { Button } from '@/components/ui/button';

export type PaginationLink = {
    url: string | null;
    label: string;
    active: boolean;
};

type Props = {
    links: PaginationLink[];
    onNavigate: (url: string) => void;
};

export function ProductPagination({ links, onNavigate }: Props) {
    if (!links?.length) return null;

    return (
        <div className="flex flex-wrap gap-1">
            {links.map((link, idx) => {
                const label = link.label
                    .replace(/&laquo;/g, '«')
                    .replace(/&raquo;/g, '»')
                    .replace(/&#039;/g, "'");

                return (
                    <Button
                        key={idx}
                        variant={link.active ? 'default' : 'outline'}
                        size="sm"
                        disabled={!link.url}
                        onClick={() => link.url && onNavigate(link.url)}
                    >
                        <span dangerouslySetInnerHTML={{ __html: label }} />
                    </Button>
                );
            })}
        </div>
    );
}
