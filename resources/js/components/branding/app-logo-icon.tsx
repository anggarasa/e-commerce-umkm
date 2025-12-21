import { ImgHTMLAttributes } from 'react';

export default function AppLogoIcon(
    props: ImgHTMLAttributes<HTMLImageElement>,
) {
    return <img src="/assets/logo/logo-fav.png" alt="Logo Icon" {...props} />;
}
