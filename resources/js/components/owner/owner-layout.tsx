import Navbar from "./owner-navbar";
import Sidebar from "./owner-sidebar";

const OwnerLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className="flex flex-col h-screen w-screen overflow-hidden">
            <Navbar />
            <div className="flex-1 flex overflow-hidden">
                <Sidebar />
                <main className="flex-1 overflow-auto p-2 sm:p-4 bg-[#E6F0FA]">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default OwnerLayout;