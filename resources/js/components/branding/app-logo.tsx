import { SharedData } from '@/types';
import { usePage } from '@inertiajs/react';

export default function AppLogo() {
    const { settings } = usePage<SharedData>().props;
    const logoUrl = settings?.store_logo || '/assets/logo/logo-fav.png';
    const storeName = settings?.store_name || 'GarraCommerce';

    return (
        <>
            <div className="flex aspect-square size-8 items-center justify-center">
                <img
                    src={logoUrl}
                    alt={storeName}
                    className="size-7 object-contain"
                />
            </div>
            <div className="ml-1 grid flex-1 text-left text-sm">
                <span className="mb-0.5 truncate font-display leading-tight font-semibold">
                    {storeName}
                </span>
            </div>
        </>
    );
}
