import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import '@fortawesome/fontawesome-free/css/all.css';

function LeftNavBar(){
    const [collapsed, setCollapsed] = useState(false);

    const navItems = [
        { to: "/dashboard/", label: "Home", icon: "fa-home" },
        { to: "/dashboard/projects", label: "Projects", icon: "fa-project-diagram" },
        { to: "/dashboard/wallet/", label: "Wallet", icon: "fa-wallet" },
        { to: "/dashboard/transactions/", label: "Transactions", icon: "fa-history" },
        { to: "/dashboard/profile/", label: "Profile", icon: "fa-user" },
    ];

    return (
        <nav className={`fixed left-0 top-16 h-[calc(100vh-64px)] bg-white border-r border-slate-200 shadow-sm transition-all duration-300 ${
            collapsed ? "w-20" : "w-64"
        } hidden md:flex flex-col overflow-y-auto z-30`}>
            {/* Collapse Button */}
            <button
                onClick={() => setCollapsed(!collapsed)}
                className="p-4 text-slate-600 hover:text-primary transition"
            >
                <i className={`fas fa-chevron-${collapsed ? 'right' : 'left'}`}></i>
            </button>

            {/* Navigation Items */}
            <ul className="flex flex-col gap-2 px-3">
                {navItems.map((item) => (
                    <li key={item.to}>
                        <NavLink
                            to={item.to}
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
    );
}

export default LeftNavBar;


