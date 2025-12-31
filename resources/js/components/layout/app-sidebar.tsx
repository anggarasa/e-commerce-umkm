import { index as categoriesIndex } from '@/actions/App/Http/Controllers/Admin/CategoryController';
import {
    aboutUs as cmsAboutUs,
    homepage as cmsHomepage,
    privacyPolicy as cmsPrivacyPolicy,
    termsOfService as cmsTermsOfService,
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
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem,
} from '@/components/ui/sidebar';
import { resolveUrl } from '@/lib/utils';
import { dashboard } from '@/routes/admin';
import { type NavItem } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from '@radix-ui/react-collapsible';
import {
    BarChart3,
    BookOpen,
    ChevronRight,
    ClipboardList,
    Folder,
    FolderTree,
    Home,
    LayoutGrid,
    LayoutTemplate,
    Package,
    ScrollText,
    Settings,
    Users,
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
        title: 'Konfigurasi',
        href: settingsIndex(),
        icon: Settings,
    },
];

const cmsSubItems = [
    {
        title: 'Homepage',
        href: cmsHomepage(),
        icon: Home,
    },
    {
        title: 'Tentang Kami',
        href: cmsAboutUs(),
        icon: Users,
    },
    {
        title: 'Kebijakan Privasi',
        href: cmsPrivacyPolicy(),
        icon: BookOpen,
    },
    {
        title: 'Syarat & Ketentuan',
        href: cmsTermsOfService(),
        icon: ScrollText,
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
    const page = usePage();
    const isCmsActive = page.url.startsWith('/admin/cms');

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

                {/* CMS Section with Submenu */}
                <SidebarMenu className="mt-1">
                    <Collapsible
                        asChild
                        defaultOpen={isCmsActive}
                        className="group/collapsible"
                    >
                        <SidebarMenuItem>
                            <CollapsibleTrigger asChild>
                                <SidebarMenuButton
                                    tooltip={{ children: 'CMS' }}
                                    isActive={isCmsActive}
                                    className="transition-all duration-200"
                                >
                                    <LayoutTemplate className="size-5" />
                                    <span className="font-medium">CMS</span>
                                    <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                                </SidebarMenuButton>
                            </CollapsibleTrigger>
                            <CollapsibleContent>
                                <SidebarMenuSub>
                                    {cmsSubItems.map((item) => {
                                        const isActive = page.url.startsWith(
                                            resolveUrl(item.href),
                                        );
                                        return (
                                            <SidebarMenuSubItem
                                                key={item.title}
                                            >
                                                <SidebarMenuSubButton
                                                    asChild
                                                    isActive={isActive}
                                                >
                                                    <Link
                                                        href={item.href}
                                                        prefetch
                                                    >
                                                        <item.icon className="size-4" />
                                                        <span>
                                                            {item.title}
                                                        </span>
                                                    </Link>
                                                </SidebarMenuSubButton>
                                            </SidebarMenuSubItem>
                                        );
                                    })}
                                </SidebarMenuSub>
                            </CollapsibleContent>
                        </SidebarMenuItem>
                    </Collapsible>
                </SidebarMenu>
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
