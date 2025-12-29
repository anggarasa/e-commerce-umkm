import { index as categoriesIndex } from '@/actions/App/Http/Controllers/Admin/CategoryController';
import {
    homepage as cmsHomepage,
    pages as cmsPages,
} from '@/actions/App/Http/Controllers/Admin/CMSController';
import { index as ordersIndex } from '@/actions/App/Http/Controllers/Admin/OrderController';
import { index as productsIndex } from '@/actions/App/Http/Controllers/Admin/ProductController';
import { index as reportsIndex } from '@/actions/App/Http/Controllers/Admin/ReportController';
import { index as settingsIndex } from '@/actions/App/Http/Controllers/Admin/SettingController';
import { NavFooter } from '@/components/navigation/nav-footer';
import { NavMain } from '@/components/navigation/nav-main';
import { NavUser } from '@/components/navigation/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { dashboard } from '@/routes/admin';
import { type NavItem } from '@/types';
import { Link } from '@inertiajs/react';
import {
    BarChart3,
    BookOpen,
    ClipboardList,
    FileText,
    Folder,
    FolderTree,
    LayoutGrid,
    LayoutTemplate,
    Package,
    Settings,
} from 'lucide-react';
import AppLogo from '../branding/app-logo';

const mainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: dashboard(),
        icon: LayoutGrid,
    },
    {
        title: 'Kategori',
        href: categoriesIndex(),
        icon: FolderTree,
    },
    {
        title: 'Produk',
        href: productsIndex(),
        icon: Package,
    },
    {
        title: 'Pesanan',
        href: ordersIndex(),
        icon: ClipboardList,
    },
    {
        title: 'Laporan',
        href: reportsIndex(),
        icon: BarChart3,
    },
    {
        title: 'CMS',
        href: cmsHomepage(),
        icon: LayoutTemplate,
    },
    {
        title: 'Halaman',
        href: cmsPages(),
        icon: FileText,
    },
    {
        title: 'Konfigurasi',
        href: settingsIndex(),
        icon: Settings,
    },
];

const footerNavItems: NavItem[] = [
    {
        title: 'Repository',
        href: 'https://github.com/laravel/react-starter-kit',
        icon: Folder,
    },
    {
        title: 'Dokumentasi',
        href: 'https://laravel.com/docs/starter-kits#react',
        icon: BookOpen,
    },
];

export function AppSidebar() {
    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader className="px-2">
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton
                            size="lg"
                            asChild
                            className="transition-all duration-200 hover:bg-sidebar-accent/80"
                        >
                            <Link href={dashboard()} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent className="px-2">
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter className="px-2">
                <NavFooter items={footerNavItems} className="mt-auto" />
                <div className="border-t border-sidebar-border/50 pt-2">
                    <NavUser />
                </div>
            </SidebarFooter>
        </Sidebar>
    );
}
