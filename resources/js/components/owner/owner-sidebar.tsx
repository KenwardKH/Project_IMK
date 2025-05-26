import { Link, router } from '@inertiajs/react';
import { BarChart3, Box, ChevronRight, ClipboardList, History, LayoutDashboard, LogOut, Menu, Truck, User, Users } from 'lucide-react';
import { FC, useState } from 'react';
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
}

const SidebarItem: FC<SidebarItemProps> = ({ icon, label, href, active, collapsed, onClick }) => {
    const baseClass = `block w-full flex items-center gap-3 rounded-md px-4 py-2 transition hover:bg-[#4A90E2] ${
        active ? 'bg-blue-700 text-white' : 'text-white'
    }`;

    if (onClick) {
        return (
            <button onClick={onClick} className={baseClass} type="button">
                <div className="flex-shrink-0">{icon}</div>
                {!collapsed && <span className="truncate">{label}</span>}
            </button>
        );
    }

    return (
        <Link href={href!} className={baseClass}>
            <div className="flex-shrink-0">{icon}</div>
            {!collapsed && <span className="truncate">{label}</span>}
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
            <div className="py-2">
                <div className="mb-1 flex w-full items-center justify-center text-white">{icon}</div>
                <div className="space-y-1">{children}</div>
            </div>
        );
    }

    return (
        <div>
            <button
                onClick={() => setExpanded(!expanded)}
                className="mb-1 flex w-full items-center justify-between text-sm font-semibold text-white transition hover:text-gray-200 md:text-base lg:text-xl"
            >
                <div className="flex items-center gap-3">
                    {icon}
                    <span className="truncate">{title}</span>
                </div>
                <ChevronRight size={16} className={`transition-transform ${expanded ? 'rotate-90' : ''}`} />
            </button>
            <div className={`space-y-1 pl-4 ${!expanded ? 'hidden' : ''}`}>{children}</div>
        </div>
    );
};

const Sidebar: FC = () => {
    const currentPath = window.location.pathname;
    const [collapsed, setCollapsed] = useState(false);
    const [showMobileSidebar, setShowMobileSidebar] = useState(false);

    const toggleSidebar = () => {
        setCollapsed(!collapsed);
    };

    const toggleMobileSidebar = () => {
        setShowMobileSidebar(!showMobileSidebar);
    };

    const sidebarContent = (
        <>
            <Link
                href="/owner-dashboard"
                className={`flex items-center ${collapsed ? 'justify-center' : 'gap-3'} text-md rounded-md px-4 py-2 font-semibold transition hover:bg-[#4A90E2] md:text-lg lg:text-xl ${
                    currentPath === '/owner-dashboard' ? 'bg-blue-700 text-white' : 'text-white'
                }`}
            >
                <LayoutDashboard size={20} />
                {!collapsed && <span className="truncate">Dashboard</span>}
            </Link>

            <SidebarGroup title="Kelola Produk" icon={<AiFillProduct size={20} />} collapsed={collapsed}>
                <SidebarItem
                    icon={<Box size={20} />}
                    label="Produk"
                    href="/owner-produk"
                    active={currentPath.startsWith('/owner-produk')}
                    collapsed={collapsed}
                />
                <SidebarItem
                    icon={<Truck size={20} />}
                    label="Supplier"
                    href="/owner-supplier"
                    active={currentPath.startsWith('/owner-supplier')}
                    collapsed={collapsed}
                />
                <SidebarItem
                    icon={<MdOutlineFactory size={20} />}
                    label="Pembelian Supply"
                    href="/owner-pembelian-supply"
                    active={currentPath.startsWith('/owner-pembelian-supply')}
                    collapsed={collapsed}
                />
            </SidebarGroup>

            <SidebarGroup title="Pengguna" icon={<Users size={20} />} collapsed={collapsed}>
                <SidebarItem
                    icon={<User size={20} />}
                    label="Pelanggan"
                    href="/owner-daftar-pelanggan"
                    active={currentPath === '/owner-daftar-pelanggan'}
                    collapsed={collapsed}
                />
                <SidebarItem
                    icon={<TbCashRegister size={20} />}
                    label="Kasir"
                    href="/owner-daftar-kasir"
                    active={currentPath.startsWith('/owner-daftar-kasir')}
                    collapsed={collapsed}
                />
                <SidebarItem
                    icon={<History size={20} />}
                    label="Riwayat Kasir"
                    href="/owner-riwayat-kasir"
                    active={currentPath === '/owner-riwayat-kasir'}
                    collapsed={collapsed}
                />
            </SidebarGroup>

            <SidebarGroup title="Penjualan" icon={<RiBarChart2Fill size={20} />} collapsed={collapsed}>
                <SidebarItem
                    icon={<ClipboardList size={20} />}
                    label="Riwayat Transaksi"
                    href="/owner-riwayat-transaksi"
                    active={currentPath === '/owner-riwayat-transaksi'}
                    collapsed={collapsed}
                />
                <SidebarItem
                    icon={<BarChart3 size={20} />}
                    label="Laporan Penjualan"
                    href="/owner-laporan-penjualan"
                    active={currentPath === '/owner-laporan-penjualan'}
                    collapsed={collapsed}
                />
            </SidebarGroup>

            <div className="border-t border-blue-700 pt-4">
                <SidebarItem
                    icon={<LogOut size={20} />}
                    label="Logout"
                    onClick={() => router.post(route('logout'))}
                    active={currentPath === '/logout'}
                    collapsed={collapsed}
                />
            </div>
        </>
    );

    // Only shown on desktop
    const desktopSidebar = (
        <div className={`hidden h-full md:block ${collapsed ? 'w-16' : 'w-1/6'} bg-blue-900 p-4 text-white transition-all duration-300 ease-in-out`}>
            <div className="mb-4 flex justify-end md:hidden">
                <button onClick={toggleSidebar} className="rounded p-1 text-white">
                    {collapsed ? <ChevronRight size={24} /> : <ChevronRight className="rotate-180" size={24} />}
                </button>
            </div>
            <div className="space-y-4">{sidebarContent}</div>
        </div>
    );

    // Mobile sidebar toggle button
    const mobileSidebarToggle = (
        <button onClick={toggleMobileSidebar} className="fixed right-4 bottom-4 z-50 rounded-full bg-blue-700 p-3 text-white shadow-lg md:hidden">
            <Menu size={24} />
        </button>
    );

    // Mobile sidebar (shown when toggled)
    const mobileSidebar = showMobileSidebar && (
        <div className="bg-opacity-50 fixed inset-0 z-40 flex bg-gray-900 md:hidden">
            <div className="h-full w-64 overflow-y-auto bg-blue-900 p-4 text-white">
                <div className="mb-4 flex justify-end">
                    <button onClick={toggleMobileSidebar} className="rounded p-1 text-white">
                        <ChevronRight className="rotate-180" size={24} />
                    </button>
                </div>
                <div className="space-y-6">{sidebarContent}</div>
            </div>
            <div className="flex-1" onClick={toggleMobileSidebar}></div>
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
