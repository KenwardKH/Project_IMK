import { CgProfile } from "react-icons/cg";
import { Menu } from "lucide-react";
import { useState } from "react";

const Navbar = () => {
    const [showMobileMenu, setShowMobileMenu] = useState(false);

    const toggleMobileMenu = () => {
        setShowMobileMenu(!showMobileMenu);
    };

    return (
        <nav className="relative flex justify-between items-center bg-[#7DC9F5] text-black py-2 px-4 shadow-md">
            <div className="flex items-center">
                <img src="/images/logo.png" alt="logo" className="h-8 sm:h-10 md:h-12" />
            </div>
            
            {/* Desktop profile section */}
            <section className="hidden md:flex items-center gap-2">
                <CgProfile className="size-8 md:size-10 lg:size-12" />
                <a href="" className="text-lg md:text-xl lg:text-3xl font-medium hover:underline">Admin</a>
            </section>
            
            {/* Mobile menu button */}
            <button className="md:hidden p-2" onClick={toggleMobileMenu}>
                <Menu className="size-6" />
            </button>
            
            {/* Mobile menu */}
            {showMobileMenu && (
                <div className="absolute top-full right-0 bg-[#7DC9F5] w-full md:w-auto z-50 shadow-lg">
                    <div className="p-4 flex items-center justify-center gap-2">
                        <CgProfile className="size-8" />
                        <a href="" className="text-xl font-medium hover:underline">Admin</a>
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;