import { Link, router } from '@inertiajs/react';
import {
    BarChart3,
    Box,
    ChevronDown,
    ChevronRight,
    ClipboardList,
    History,
    LayoutDashboard,
    LogOut,
    Menu,
    Truck,
    User,
    Users,
    X,
} from 'lucide-react';
import { FC, useEffect, useState } from 'react';
import { AiFillProduct } from 'react-icons/ai';
import { MdOutlineFactory } from 'react-icons/md';
import { RiBarChart2Fill } from 'react-icons/ri';
import { TbCashRegister } from 'react-icons/tb';

export interface SidebarItemProps {
    icon: React.ReactNode;
    label: string;
    href?: string;
    active?: boolean;
    collapsed?: boolean;
    onClick?: () => void;
    badge?: string;
}

const SidebarItem: FC<SidebarItemProps> = ({ icon, label, href, active, collapsed, onClick, badge }) => {
    const baseClass = `group relative flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200 ${
        active
            ? 'bg-gradient-to-r from-blue-400 to-blue-300 text-black shadow-lg shadow-blue-500/25'
            : 'text-black hover:bg-gray-700/50 hover:text-black'
    }`;

    const content = (
        <>
            <div className={`flex-shrink-0 ${active ? 'text-black' : 'text-black group-hover:text-black'}`}>{icon}</div>
            {!collapsed && (
                <div className="flex flex-1 items-center justify-between">
                    <span className="truncate">{label}</span>
                    {badge && <span className="ml-2 rounded-full bg-red-500 px-2 py-1 text-xs text-black">{badge}</span>}
                </div>
            )}
            {active && !collapsed && <div className="absolute top-1/2 right-0 h-8 w-1 -translate-y-1/2 rounded-full bg-white"></div>}
        </>
    );

    if (onClick) {
        return (
            <button onClick={onClick} className={baseClass} type="button">
                {content}
            </button>
        );
    }

    return (
        <Link href={href!} className={baseClass}>
            {content}
        </Link>
    );
};

interface SidebarGroupProps {
    icon: React.ReactNode;
    title: string;
    children: React.ReactNode;
    collapsed?: boolean;
}

const SidebarGroup: FC<SidebarGroupProps> = ({ icon, title, children, collapsed }) => {
    const [expanded, setExpanded] = useState(true);

    if (collapsed) {
        return (
            <div className="group relative py-2 cursor-pointer">
                <div className="mb-2 flex w-full items-center justify-center text-black transition-colors hover:text-black">
                    <div className="rounded-lg p-2 hover:bg-gray-700/50">{icon}</div>
                </div>
                <div className="space-y-1">{children}</div>

                {/* Tooltip for collapsed state */}
                <div className="pointer-events-none absolute top-0 left-full z-50 ml-2 rounded-lg bg-gray-900 px-3 py-2 whitespace-nowrap text-black opacity-0 shadow-xl transition-opacity duration-200 group-hover:opacity-100">
                    {title}
                </div>
            </div>
        );
    }

    return (
        <div className="mb-4">
            <button
                onClick={() => setExpanded(!expanded)}
                className="mb-2 flex w-full items-center justify-between rounded-lg px-4 py-2 text-sm font-semibold text-black transition-all duration-200 hover:bg-gray-700/50 hover:text-black cursor-pointer"
            >
                <div className="flex items-center gap-3">
                    <div className="text-black">{icon}</div>
                    <span className="truncate">{title}</span>
                </div>
                <ChevronDown size={16} className={`transition-transform duration-200 ${expanded ? 'rotate-0' : '-rotate-90'}`} />
            </button>
            <div className={`space-y-1 pl-4 transition-all duration-200 ${!expanded ? 'max-h-0 overflow-hidden opacity-0' : 'max-h-96 opacity-100'}`}>
                {children}
            </div>
        </div>
    );
};

const Sidebar: FC = () => {
    const currentPath = window.location.pathname;
    const [collapsed, setCollapsed] = useState(false);
    const [showMobileSidebar, setShowMobileSidebar] = useState(false);

    // Handle responsive behavior
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 768) {
                setCollapsed(false);
            }
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const toggleSidebar = () => {
        setCollapsed(!collapsed);
    };

    const toggleMobileSidebar = () => {
        setShowMobileSidebar(!showMobileSidebar);
    };

    const sidebarContent = (
        <div className="space-y-2">
            <div className="mb-6">
                <Link
                    href="/owner-dashboard"
                    className={`flex items-center ${collapsed ? 'justify-center' : 'gap-3'} rounded-xl px-4 py-3 text-sm font-semibold transition-all duration-200 ${
                        currentPath === '/owner-dashboard'
                            ? 'bg-gradient-to-r from-blue-400 to-blue-300 text-black shadow-lg shadow-blue-500/25'
                            : 'text-black hover:bg-gray-700/50 hover:text-black'
                    }`}
                >
                    <LayoutDashboard size={20} />
                    {!collapsed && <span className="truncate">Dashboard</span>}
                </Link>
            </div>

            <SidebarGroup title="Kelola Produk" icon={<AiFillProduct size={20} />} collapsed={collapsed}>
                <SidebarItem
                    icon={<Box size={18} />}
                    label="Produk"
                    href="/owner-produk"
                    active={currentPath.startsWith('/owner-produk')}
                    collapsed={collapsed}
                    // badge="12"
                />
                <SidebarItem
                    icon={<Truck size={18} />}
                    label="Supplier"
                    href="/owner-supplier"
                    active={currentPath.startsWith('/owner-supplier')}
                    collapsed={collapsed}
                />
                <SidebarItem
                    icon={<MdOutlineFactory size={18} />}
                    label="Pembelian Supply"
                    href="/owner-pembelian-supply"
                    active={currentPath.startsWith('/owner-pembelian-supply')}
                    collapsed={collapsed}
                />
            </SidebarGroup>

            <SidebarGroup title="Pengguna" icon={<Users size={20} />} collapsed={collapsed}>
                <SidebarItem
                    icon={<User size={18} />}
                    label="Pelanggan"
                    href="/owner-daftar-pelanggan"
                    active={currentPath === '/owner-daftar-pelanggan'}
                    collapsed={collapsed}
                    // badge="5"
                />
                <SidebarItem
                    icon={<TbCashRegister size={18} />}
                    label="Kasir"
                    href="/owner-daftar-kasir"
                    active={currentPath.startsWith('/owner-daftar-kasir')}
                    collapsed={collapsed}
                />
                <SidebarItem
                    icon={<History size={18} />}
                    label="Riwayat Kasir"
                    href="/owner-riwayat-kasir"
                    active={currentPath === '/owner-riwayat-kasir'}
                    collapsed={collapsed}
                />
            </SidebarGroup>

            <SidebarGroup title="Penjualan" icon={<RiBarChart2Fill size={20} />} collapsed={collapsed}>
                <SidebarItem
                    icon={<ClipboardList size={18} />}
                    label="Riwayat Transaksi"
                    href="/owner-riwayat-transaksi"
                    active={currentPath === '/owner-riwayat-transaksi'}
                    collapsed={collapsed}
                />
                <SidebarItem
                    icon={<BarChart3 size={18} />}
                    label="Laporan Penjualan"
                    href="/owner-laporan-penjualan"
                    active={currentPath === '/owner-laporan-penjualan'}
                    collapsed={collapsed}
                />
            </SidebarGroup>
        </div>
    );

    // Desktop sidebar
    const desktopSidebar = (
        <div
            className={`bg-white hidden h-screen flex-col md:flex ${collapsed ? 'w-20' : 'w-72'} border-r border-gray-200 `}
        >
            {/* Header
            <div className="flex items-center justify-between p-4 border-b border-gray-700/50">
                {!collapsed && (
                    <div className="flex items-center space-x-3">
                        <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                            <span className="text-black font-bold text-lg">A</span>
                        </div>
                        <div>
                            <h2 className="text-black font-bold text-lg">Admin Panel</h2>
                            <p className="text-black text-xs">Management System</p>
                        </div>
                    </div>
                )}
                <button
                    onClick={toggleSidebar}
                    className="p-2 text-black hover:text-black hover:bg-gray-700/50 rounded-lg transition-colors"
                >
                    {collapsed ? <ChevronRight size={20} /> : <ChevronRight className="rotate-180" size={20} />}
                </button>
            </div> */}

            {/* Navigation */}
            {/* <button onClick={toggleSidebar} className="rounded-lg p-2 text-black transition-colors hover:bg-gray-700/50 hover:text-black">
                {collapsed ? <ChevronRight size={20} /> : <ChevronRight className="rotate-180" size={20} />}
            </button> */}
            <div className="scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-transparent flex-1 p-4 ">{sidebarContent}</div>

            {/* Footer */}
            <div className="border-t border-gray-700/50 p-4">
                <SidebarItem icon={<LogOut size={20} />} label="Logout" onClick={() => router.post('/logout')} collapsed={collapsed} />
            </div>
        </div>
    );

    // Mobile sidebar toggle button (floating action button)
    const mobileSidebarToggle = (
        <button
            onClick={toggleMobileSidebar}
            className="fixed right-6 bottom-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-white text-black shadow-2xl transition-all duration-200 hover:scale-110 hover:shadow-blue-500/25 md:hidden cursor-pointer"
        >
            <Menu size={24} />
        </button>
    );

    // Mobile sidebar (slide-in from left)
    const mobileSidebar = (
        <div
            className={`fixed inset-0 z-40 transition-opacity duration-300 md:hidden ${showMobileSidebar ? 'opacity-100' : 'pointer-events-none opacity-0'}`}
        >
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={toggleMobileSidebar} />

            {/* Sidebar */}
            <div
                className={`relative flex h-full w-80 max-w-[85vw] flex-col bg-white shadow-2xl transition-transform duration-300 ${showMobileSidebar ? 'translate-x-0' : '-translate-x-full'}`}
            >
                {/* Header */}
                <div className="flex items-center justify-between border-b border-gray-700/50 p-4">
                    <div className="flex items-center space-x-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white">
                            <span className="text-lg font-bold text-black">A</span>
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-black">Admin Panel</h2>
                            <p className="text-xs text-black">Management System</p>
                        </div>
                    </div>
                    <button
                        onClick={toggleMobileSidebar}
                        className="rounded-lg p-2 text-black transition-colors hover:bg-gray-700/50 hover:text-black"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Navigation */}
                <div className="scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-transparent flex-1 overflow-y-auto p-4">{sidebarContent}</div>

                {/* Footer */}
                <div className="border-t border-gray-700/50 p-4">
                    <SidebarItem
                        icon={<LogOut size={20} />}
                        label="Logout"
                        onClick={() => {
                            toggleMobileSidebar();
                            router.post('/logout');
                        }}
                    />
                </div>
            </div>
        </div>
    );

    return (
        <>
            {desktopSidebar}
            {mobileSidebarToggle}
            {mobileSidebar}
        </>
    );
};

export default Sidebar;
