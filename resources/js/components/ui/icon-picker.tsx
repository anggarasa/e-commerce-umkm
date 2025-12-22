import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import {
    Apple,
    Baby,
    Backpack,
    Bath,
    Bed,
    Beef,
    Bike,
    Book,
    Briefcase,
    Camera,
    Car,
    Carrot,
    Cat,
    Cloud,
    Coffee,
    Cookie,
    Crown,
    CupSoda,
    Dog,
    Dumbbell,
    Film,
    Fish,
    Flame,
    Flower2,
    Footprints,
    Gamepad2,
    Gem,
    Gift,
    Glasses,
    Hammer,
    Headphones,
    HeartPulse,
    Home,
    Lamp,
    Laptop,
    type LucideIcon,
    Monitor,
    Moon,
    Music,
    Package,
    Palette,
    Pill,
    Pizza,
    Plane,
    Scissors,
    Shirt,
    ShoppingBag,
    Smartphone,
    Sofa,
    Speaker,
    Sparkles,
    Star,
    Sun,
    Tablet,
    Trees,
    Trophy,
    Tv,
    Umbrella,
    Utensils,
    Watch,
    Wrench,
    Zap,
} from 'lucide-react';
import { useMemo, useState } from 'react';

// Map of icon names to their components
const ICON_MAP: Record<string, LucideIcon> = {
    laptop: Laptop,
    smartphone: Smartphone,
    tablet: Tablet,
    monitor: Monitor,
    headphones: Headphones,
    speaker: Speaker,
    camera: Camera,
    tv: Tv,
    'gamepad-2': Gamepad2,
    watch: Watch,
    shirt: Shirt,
    footprints: Footprints,
    glasses: Glasses,
    gem: Gem,
    crown: Crown,
    backpack: Backpack,
    briefcase: Briefcase,
    'shopping-bag': ShoppingBag,
    gift: Gift,
    package: Package,
    home: Home,
    sofa: Sofa,
    lamp: Lamp,
    bed: Bed,
    bath: Bath,
    utensils: Utensils,
    'cup-soda': CupSoda,
    coffee: Coffee,
    pizza: Pizza,
    cookie: Cookie,
    apple: Apple,
    carrot: Carrot,
    beef: Beef,
    fish: Fish,
    'heart-pulse': HeartPulse,
    pill: Pill,
    baby: Baby,
    dog: Dog,
    cat: Cat,
    car: Car,
    bike: Bike,
    plane: Plane,
    book: Book,
    music: Music,
    film: Film,
    palette: Palette,
    scissors: Scissors,
    wrench: Wrench,
    hammer: Hammer,
    'flower-2': Flower2,
    trees: Trees,
    dumbbell: Dumbbell,
    trophy: Trophy,
    star: Star,
    sparkles: Sparkles,
    zap: Zap,
    flame: Flame,
    sun: Sun,
    moon: Moon,
    cloud: Cloud,
    umbrella: Umbrella,
};

const CATEGORY_ICONS = Object.keys(ICON_MAP);

interface IconPickerProps {
    value?: string | null;
    onChange: (icon: string) => void;
    className?: string;
}

// Pre-built icon button component to avoid creating during render
function IconButton({
    iconName,
    isSelected,
    onSelect,
}: {
    iconName: string;
    isSelected: boolean;
    onSelect: () => void;
}) {
    const Icon = ICON_MAP[iconName];
    if (!Icon) return null;

    return (
        <Button
            variant={isSelected ? 'default' : 'outline'}
            size="icon"
            className="size-10"
            onClick={onSelect}
            title={iconName}
        >
            <Icon className="size-4" />
        </Button>
    );
}

// Display icon component
function DisplayIcon({ iconName, className }: { iconName: string; className?: string }) {
    const Icon = ICON_MAP[iconName];
    if (!Icon) return null;
    return <Icon className={className} />;
}

export function IconPicker({ value, onChange, className }: IconPickerProps) {
    const [open, setOpen] = useState(false);
    const [search, setSearch] = useState('');

    const filteredIcons = useMemo(
        () => CATEGORY_ICONS.filter((icon) => icon.toLowerCase().includes(search.toLowerCase())),
        [search],
    );

    const handleSelect = (icon: string) => {
        onChange(icon);
        setOpen(false);
        setSearch('');
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" className={cn('h-10 w-full justify-start gap-2', className)}>
                    {value ? (
                        <>
                            <DisplayIcon iconName={value} className="size-4" />
                            <span className="text-muted-foreground">{value}</span>
                        </>
                    ) : (
                        <span className="text-muted-foreground">Pilih ikon...</span>
                    )}
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle>Pilih Ikon Kategori</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                    <Input placeholder="Cari ikon..." value={search} onChange={(e) => setSearch(e.target.value)} />
                    <div className="grid max-h-64 grid-cols-6 gap-2 overflow-y-auto">
                        {filteredIcons.map((icon) => (
                            <IconButton
                                key={icon}
                                iconName={icon}
                                isSelected={value === icon}
                                onSelect={() => handleSelect(icon)}
                            />
                        ))}
                    </div>
                    {filteredIcons.length === 0 && (
                        <p className="text-muted-foreground py-4 text-center text-sm">Tidak ada ikon ditemukan</p>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}

// Export for use in other components
export { ICON_MAP, DisplayIcon };
