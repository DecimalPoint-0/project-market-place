import React, { useState, useContext } from "react";
import { NavLink } from "react-router-dom";
import '@fortawesome/fontawesome-free/css/all.css';
import { SidebarContext } from "../../context/SidebarContext";

function LeftNavBar(){
    const [collapsed, setCollapsed] = useState(false);
    const { sidebarOpen, setSidebarOpen } = useContext(SidebarContext);

    const navItems = [
        { to: "/dashboard/", label: "Home", icon: "fa-home" },
        { to: "/dashboard/projects", label: "Projects", icon: "fa-project-diagram" },
        { to: "/dashboard/wallet/", label: "Wallet", icon: "fa-wallet" },
        { to: "/dashboard/transactions/", label: "Transactions", icon: "fa-history" },
        { to: "/dashboard/profile/", label: "Profile", icon: "fa-user" },
    ];

    return (
        <>
            {/* Mobile Overlay */}
            {sidebarOpen && (
                <div 
                    className="fixed inset-0 bg-black/50 md:hidden z-20"
                    onClick={() => setSidebarOpen(false)}
                ></div>
            )}

            {/* Sidebar */}
            <nav className={`fixed left-0 top-16 h-[calc(100vh-64px)] bg-white border-r border-slate-200 shadow-sm transition-all duration-300 ${
                collapsed ? "w-20" : "w-64"
            } flex flex-col overflow-y-auto z-30 ${
                sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
            } md:translate-x-0`}>
                {/* Collapse Button */}
                <button
                    onClick={() => setCollapsed(!collapsed)}
                    className="p-4 text-slate-600 hover:text-primary transition hidden md:block"
                >
                    <i className={`fas fa-chevron-${collapsed ? 'right' : 'left'}`}></i>
                </button>

                {/* Close Button for Mobile */}
                <button
                    onClick={() => setSidebarOpen(false)}
                    className="p-4 text-slate-600 hover:text-primary transition md:hidden"
                >
                    <i className="fas fa-times text-xl"></i>
                </button>

                {/* Navigation Items */}
                <ul className="flex flex-col gap-2 px-3">
                    {navItems.map((item) => (
                        <li key={item.to}>
                            <NavLink
                                to={item.to}
                                onClick={() => setSidebarOpen(false)}
                                className={({ isActive }) => `
                                    flex items-center gap-3 px-4 py-3 rounded-lg transition-all
                                    ${isActive 
                                        ? 'bg-gradient-primary text-white shadow-md' 
                                        : 'text-slate-600 hover:bg-slate-50'
                                    }
                                `}
                            >
                                <i className={`fas ${item.icon} text-lg flex-shrink-0`}></i>
                                {!collapsed && <span className="font-medium">{item.label}</span>}
                            </NavLink>
                        </li>
                    ))}
                </ul>

                {/* Footer Info */}
                {!collapsed && (
                    <div className="mt-auto p-4 border-t border-slate-200">
                        <div className="bg-slate-50 rounded-lg p-3 text-center">
                            <p className="text-xs text-slate-600 mb-2">Need Help?</p>
                            <button className="text-sm font-semibold text-secondary hover:text-secondary-dark transition">
                                <i className="fas fa-headset mr-1"></i> Contact Support
                            </button>
                        </div>
                    </div>
                )}
            </nav>
        </>
    );
}

export default LeftNavBar;


