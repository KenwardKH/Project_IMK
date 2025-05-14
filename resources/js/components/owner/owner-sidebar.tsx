import { BarChart3, Box, ChevronRight, ClipboardList, LayoutDashboard, LogOut, Truck, User, Users } from 'lucide-react';
import { FC, useState } from 'react';
import { AiFillProduct } from 'react-icons/ai';
import { RiBarChart2Fill } from 'react-icons/ri';
import { TbCashRegister } from 'react-icons/tb';
import { MdOutlineFactory } from "react-icons/md";
import { Menu } from 'lucide-react';

interface SidebarItemProps {
    icon: React.ReactNode;
    label: string;
    href: string;
    active: boolean;
    collapsed?: boolean;
}

const SidebarItem: FC<SidebarItemProps> = ({ icon, label, href, active, collapsed }) => (
    <a
        href={href}
        className={`flex items-center gap-3 rounded-md px-4 py-2 transition hover:bg-[#4A90E2] ${
            active ? 'bg-blue-700 text-white' : 'text-white'
        }`}
    >
        <div className="flex-shrink-0">{icon}</div>
        {!collapsed && <span className="truncate">{label}</span>}
    </a>
);

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
                <div className="mb-1 flex w-full items-center justify-center text-white">
                    {icon}
                </div>
                <div className="space-y-1">{children}</div>
            </div>
        );
    }

    return (
        <div>
            <button
                onClick={() => setExpanded(!expanded)}
                className="mb-1 flex w-full items-center justify-between text-sm md:text-base lg:text-xl font-semibold text-white transition hover:text-gray-200"
            >
                <div className='flex items-center gap-3'>
                    {icon}
                    <span className="truncate">{title}</span>
                </div>
                <ChevronRight
                    size={16}
                    className={`transition-transform ${expanded ? 'rotate-90' : ''}`}
                />
            </button>
            <div className={`space-y-1 pl-4 ${!expanded ? 'hidden' : ''}`}>
                {children}
            </div>
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
            <a
                href={'/owner-dashboard'}
                className={`flex items-center ${collapsed ? 'justify-center' : 'gap-3'} rounded-md px-4 py-2 text-md md:text-lg lg:text-xl font-semibold transition hover:bg-[#4A90E2] ${
                    currentPath === '/owner-dashboard' ? 'bg-blue-700 text-white' : 'text-white'
                }`}
            >
                <LayoutDashboard size={20} />
                {!collapsed && <span className="truncate">Dashboard</span>}
            </a>

            <SidebarGroup title="Manajemen Produk" icon={<AiFillProduct size={20} />} collapsed={collapsed}>
                <SidebarItem icon={<Box size={20} />} label="Produk" href="/produk" active={currentPath === '/produk'} collapsed={collapsed} />
                <SidebarItem icon={<Truck size={20} />} label="Supplier" href="/supplier" active={currentPath === '/supplier'} collapsed={collapsed} />
                <SidebarItem
                    icon={<MdOutlineFactory size={20} />}
                    label="Pembelian Supply"
                    href="/pembelian-supply"
                    active={currentPath === '/pembelian-supply'}
                    collapsed={collapsed}
                />
            </SidebarGroup>

            <SidebarGroup title="Pengguna" icon={<Users size={20} />} collapsed={collapsed}>
                <SidebarItem icon={<User size={20} />} label="Pelanggan" href="/pelanggan" active={currentPath === '/pelanggan'} collapsed={collapsed} />
                <SidebarItem icon={<TbCashRegister size={20} />} label="Kasir" href="/kasir" active={currentPath === '/kasir'} collapsed={collapsed} />
            </SidebarGroup>

            <SidebarGroup title="Penjualan" icon={<RiBarChart2Fill size={20} />} collapsed={collapsed}>
                <SidebarItem
                    icon={<ClipboardList size={20} />}
                    label="Jumlah Transaksi"
                    href="/jumlah-transaksi"
                    active={currentPath === '/jumlah-transaksi'}
                    collapsed={collapsed}
                />
                <SidebarItem
                    icon={<BarChart3 size={20} />}
                    label="Laporan Penjualan"
                    href="/laporan-penjualan"
                    active={currentPath === '/laporan-penjualan'}
                    collapsed={collapsed}
                />
            </SidebarGroup>

            <div className="border-t border-blue-700 pt-4">
                <SidebarItem icon={<LogOut size={20} />} label="Logout" href="/logout" active={currentPath === '/logout'} collapsed={collapsed} />
            </div>
        </>
    );

    // Only shown on desktop
    const desktopSidebar = (
        <div 
            className={`hidden md:block h-full ${
                collapsed ? 'w-16' : 'w-1/6'
            } transition-all duration-300 ease-in-out bg-blue-900 p-4 text-white`}
        >
            <div className="flex justify-end mb-4 md:hidden">
                <button onClick={toggleSidebar} className="text-white p-1 rounded">
                    {collapsed ? <ChevronRight size={24} /> : <ChevronRight className="rotate-180" size={24} />}
                </button>
            </div>
            <div className="space-y-6">
                {sidebarContent}
            </div>
        </div>
    );

    // Mobile sidebar toggle button
    const mobileSidebarToggle = (
        <button 
            onClick={toggleMobileSidebar}
            className="md:hidden fixed z-50 bottom-4 right-4 bg-blue-700 text-white p-3 rounded-full shadow-lg"
        >
            <Menu size={24} />
        </button>
    );

    // Mobile sidebar (shown when toggled)
    const mobileSidebar = showMobileSidebar && (
        <div className="md:hidden fixed inset-0 z-40 bg-gray-900 bg-opacity-50 flex">
            <div className="w-64 h-full bg-blue-900 p-4 text-white overflow-y-auto">
                <div className="flex justify-end mb-4">
                    <button onClick={toggleMobileSidebar} className="text-white p-1 rounded">
                        <ChevronRight className="rotate-180" size={24} />
                    </button>
                </div>
                <div className="space-y-6">
                    {sidebarContent}
                </div>
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