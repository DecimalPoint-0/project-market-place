import React, { useState, useEffect } from "react";
import '@fortawesome/fontawesome-free/css/all.css';
import logo from '../../assets/images/logo.png';
import Cookies from 'js-cookie';
import apiInstance from "../../utils/axios";
import { Link } from "react-router-dom";

function AdminNavBar(){

    const accessToken = Cookies.get('access_token');
    const [notification, setNotification] = useState(false);
    const [profile, setProfile] = useState({ name: "" });

    const fetchNotification = async () => {
        try {
            const response = await apiInstance.get('user/notifications', 
                { headers: { Authorization: `Bearer ${accessToken}` } }
            )
            setNotification(response.data)
        } catch (error) {
            console.log(error)
        }
    }

    const fetchProfile = async () => {
        try {
            const response = await apiInstance.get('user/me',
                { headers: { Authorization: `Bearer ${accessToken}` } }
            )
            setProfile(response.data)
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        fetchNotification();
        fetchProfile();
    }, [])

    const handleLogout = () => {
        Cookies.remove('access_token');
        window.location.href = '/sign-in/';
    }

    return (
        <nav className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-sm">
            <div className="flex items-center justify-between px-6 py-4 max-w-full">
                {/* Logo */}
                <Link to="/dashboard/" className="flex items-center gap-3 group">
                    <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center text-white">
                        <img src={logo} alt="Logo" className="w-6 h-6" />
                    </div>
                    <div className="hidden sm:flex flex-col">
                        <span className="font-bold text-primary">Project Nexuss</span>
                        <span className="text-xs text-slate-500">Dashboard</span>
                    </div>
                </Link>

                {/* Center Search */}
                <div className="hidden md:flex flex-1 mx-8">
                    <div className="flex items-center w-full max-w-md">
                        <input 
                            type="text" 
                            placeholder="Search..." 
                            className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary text-sm"
                        />
                        <button className="ml-2 text-slate-400 hover:text-primary transition">
                            <i className="fas fa-search"></i>
                        </button>
                    </div>
                </div>

                {/* Right Actions */}
                <div className="flex items-center gap-4">
                    {/* Notifications */}
                    <button className="relative p-2 text-slate-600 hover:text-primary hover:bg-slate-100 rounded-lg transition">
                        <i className="fas fa-bell text-lg"></i>
                        {notification && (
                            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                        )}
                    </button>

                    {/* Messages */}
                    <button className="relative p-2 text-slate-600 hover:text-primary hover:bg-slate-100 rounded-lg transition">
                        <i className="fas fa-envelope text-lg"></i>
                    </button>

                    {/* Profile Dropdown */}
                    <div className="flex items-center gap-3 pl-4 border-l border-slate-200">
                        <div className="hidden sm:flex flex-col text-right">
                            <p className="text-sm font-semibold text-primary">{profile.name || "User"}</p>
                            <p className="text-xs text-slate-500">Researcher</p>
                        </div>
                        <div className="w-10 h-10 bg-gradient-to-br from-secondary to-amber-400 rounded-full flex items-center justify-center text-white font-bold">
                            {profile.name?.charAt(0).toUpperCase() || "U"}
                        </div>
                    </div>

                    {/* Logout */}
                    <button
                        onClick={handleLogout}
                        className="p-2 text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                        title="Logout"
                    >
                        <i className="fas fa-sign-out-alt"></i>
                    </button>
                </div>
            </div>
        </nav>
    );
}

export default AdminNavBar;
