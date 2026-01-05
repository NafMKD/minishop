import { Head, usePage } from '@inertiajs/react';

import AppearanceTabs from '@/components/appearance-tabs';
import HeadingSmall from '@/components/heading-small';
import { type BreadcrumbItem } from '@/types';

import { SiteHeader } from '@/components/shop/site-header';
import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings/layout';
import { edit as editAppearance } from '@/routes/appearance';
import { Separator } from '@radix-ui/react-separator';
import { AuthUser } from '../orders/lib/types';
import { ActiveCart } from '../welcome';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Appearance settings',
        href: editAppearance().url,
    },
];

export type ProfilePageProps = {
    auth: { user?: AuthUser | null };
};

export default function Appearance() {
    const { props } = usePage<ProfilePageProps>();
    const user = props.auth.user!;
    const active_cart = props.auth.user?.active_cart
        ? (props.auth.user?.active_cart as ActiveCart).items?.length
        : null;

    if (user.is_admin) {
        return (
            <AppLayout breadcrumbs={breadcrumbs}>
                <Head title="Appearance settings" />

                <SettingsLayout>
                    <div className="space-y-6">
                        <HeadingSmall
                            title="Appearance settings"
                            description="Update your account's appearance settings"
                        />
                        <AppearanceTabs />
                    </div>
                </SettingsLayout>
            </AppLayout>
        );
    }

    return (
        <div className="min-h-screen bg-background">
            <SiteHeader
                isAuthenticated={true}
                isAdmin={false}
                canRegister={true}
                name={user.name}
                active_cart={active_cart || 0}
            />

            <main className="mx-auto max-w-6xl px-4 py-8">
                <Separator className="mb-6" />
                <Head title="Appearance settings" />

                <SettingsLayout is_user={true}>
                    <div className="space-y-6">
                        <HeadingSmall
                            title="Appearance settings"
                            description="Update your account's appearance settings"
                        />
                        <AppearanceTabs />
                    </div>
                </SettingsLayout>
            </main>
        </div>
    );
}
