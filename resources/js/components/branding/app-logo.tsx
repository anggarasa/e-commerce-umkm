import { SharedData } from '@/types';
import { usePage } from '@inertiajs/react';

export default function AppLogo() {
    const { settings } = usePage<SharedData>().props;
    const storeName = settings?.store_name || 'GarraCommerce';

    return (
        <>
            <div className="flex aspect-square size-8 items-center justify-center">
                <img
                    src="/assets/logo/logo-fav.png"
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
