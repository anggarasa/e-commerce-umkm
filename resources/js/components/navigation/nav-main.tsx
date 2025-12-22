import {
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { resolveUrl } from '@/lib/utils';
import { type NavItem } from '@/types';
import { Link, usePage } from '@inertiajs/react';

export function NavMain({ items = [] }: { items: NavItem[] }) {
    const page = usePage();
    return (
        <SidebarGroup className="px-0 py-2">
            <SidebarGroupLabel className="text-xs font-semibold tracking-wider text-sidebar-foreground/50 uppercase">
                Menu Utama
            </SidebarGroupLabel>
            <SidebarMenu className="mt-2 space-y-1">
                {items.map((item) => {
                    const isActive = page.url.startsWith(resolveUrl(item.href));
                    return (
                        <SidebarMenuItem key={item.title}>
                            <SidebarMenuButton
                                asChild
                                isActive={isActive}
                                tooltip={{ children: item.title }}
                                className="transition-all duration-200"
                            >
                                <Link href={item.href} prefetch>
                                    {item.icon && (
                                        <item.icon
                                            className={`size-5 ${isActive ? 'text-sidebar-primary-foreground' : ''}`}
                                        />
                                    )}
                                    <span className="font-medium">
                                        {item.title}
                                    </span>
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    );
                })}
            </SidebarMenu>
        </SidebarGroup>
    );
}
