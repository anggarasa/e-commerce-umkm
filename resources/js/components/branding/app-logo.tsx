export default function AppLogo() {
    return (
        <>
            <div className="flex aspect-square size-8 items-center justify-center">
                <img
                    src="/assets/logo/logo-fav.png"
                    alt="Logo"
                    className="size-7 object-contain"
                />
            </div>
            <div className="ml-1 grid flex-1 text-left text-sm">
                <span className="mb-0.5 truncate font-display leading-tight font-semibold">
                    GarraCommerce
                </span>
            </div>
        </>
    );
}
