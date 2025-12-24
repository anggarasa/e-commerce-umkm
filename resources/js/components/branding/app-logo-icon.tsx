import { SharedData } from '@/types';
import { usePage } from '@inertiajs/react';
import { ImgHTMLAttributes } from 'react';

export default function AppLogoIcon(
    props: ImgHTMLAttributes<HTMLImageElement>,
) {
    const { settings } = usePage<SharedData>().props;
    const logoUrl = settings?.store_logo || '/assets/logo/logo-fav.png';
    const storeName = settings?.store_name || 'Logo Icon';

    return <img src={logoUrl} alt={storeName} {...props} />;
}
