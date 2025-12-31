import React, { useState, useEffect } from "react";
import '@fortawesome/fontawesome-free/css/all.css';
import Cookies from 'js-cookie';
import Toast from "../../plugin/Toast";
import useAxios from "../../utils/useAxios";
import { Link } from "react-router-dom";
import apiInstance from "../../utils/axios";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import Loader from "../../components/Loader";
import { useAuthStore } from "../../store/auth";


function Home(){

    const accessToken = Cookies.get('access_token');
    const cachedUserData = useAuthStore((state) => state.allUserData);
    
    const [profile, setProfile] = useState({
        name: "",
        contact: "",
        specialization: "",
        monthly_revenue: 0,
        account_balance: 0,
        projects: 0,
        likes: 0
    })

    const [isLoading, setIsLoading] = useState(false);

    const [analytics, setAnalytics] = useState({
        revenue_data: [],
        project_performance: [],
        top_projects: []
    });

    const fetchProfile = async () => {
        try {
            setIsLoading(true)
            const response = await apiInstance.get('user/me',
                { headers: { Authorization: `Bearer ${accessToken}` } }
            )
            setProfile(response.data)
            setIsLoading(false)
        } catch (error) {
            console.log(error)
            setIsLoading(false)
        }
    }

    const fetchAnalytics = async () => {
        try {
            setIsLoading(true)
            const response = await apiInstance.get('user/analytics',
                { headers: { Authorization: `Bearer ${accessToken}` } }
            )
            setAnalytics(response.data)
            setIsLoading(false)
        } catch (error) {
            console.log(error)
            // Fallback mock data for development
            setAnalytics({
                revenue_data: [
                    { month: 'Jan', revenue: 4000 },
                    { month: 'Feb', revenue: 3000 },
                    { month: 'Mar', revenue: 2000 },
                    { month: 'Apr', revenue: 2780 },
                    { month: 'May', revenue: 1890 },
                    { month: 'Jun', revenue: 2390 }
                ],
                project_performance: [
                    { name: 'Project A', views: 2400, downloads: 240 },
                    { name: 'Project B', views: 1398, downloads: 221 },
                    { name: 'Project C', views: 9800, downloads: 229 },
                    { name: 'Project D', views: 3908, downloads: 200 }
                ],
                top_projects: [
                    { id: 1, title: 'UI Design Kit', views: 1250, downloads: 89 },
                    { id: 2, title: 'Web Templates', views: 980, downloads: 65 },
                    { id: 3, title: 'Icon Pack', views: 745, downloads: 52 }
                ]
            })
            setIsLoading(false)
        }
    }

    useEffect(() => {
        // Use cached profile data if available, otherwise fetch
        if (cachedUserData) {
            setProfile(cachedUserData);
        }
        
        // Only fetch analytics on page load
        setIsLoading(true)
        fetchAnalytics().finally(() => setIsLoading(false))
    }, [cachedUserData])

    return (
        <>

            <main className="flex">
                
                {/* Main Content */}
                <div className="w-full pt-6 px-4 md:px-8 pb-8 bg-slate-50 min-h-[calc(100vh-64px)]">
                    <div className="max-w-7xl mx-auto">
                        
                        {/* Welcome Section */}
                        <div className="mb-8">
                            <h1 className="text-3xl md:text-4xl font-bold text-primary mb-2">
                                Welcome back, {profile.name || 'User'} 👋
                            </h1>
                            <p className="text-slate-600">Here's what's happening with Project Nexus today</p>
                        </div>

                        {/* Stats Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                            {/* Total Projects */}
                            <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                                <div className="flex items-center justify-between mb-4">
                                    <div>
                                        <p className="text-slate-600 text-sm font-medium">Total Projects</p>
                                        <h3 className="text-3xl font-bold text-primary mt-2">{profile.projects || 0}</h3>
                                    </div>
                                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600">
                                        <i className="fas fa-project-diagram text-xl"></i>
                                    </div>
                                </div>
                                <p className="text-xs text-slate-500">
                                    <i className="fas fa-arrow-up text-green-600 mr-1"></i> Active projects
                                </p>
                            </div>

                            {/* Wallet Balance */}
                            <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                                <div className="flex items-center justify-between mb-4">
                                    <div>
                                        <p className="text-slate-600 text-sm font-medium">Wallet Balance</p>
                                        <h3 className="text-3xl font-bold text-secondary mt-2">₦{profile.account_balance || 0}</h3>
                                    </div>
                                    <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center text-amber-600">
                                        <i className="fa-solid fa-naira-sign text-xl"></i>
                                    </div>
                                </div>
                                <p className="text-xs text-slate-500">
                                    <i className="fas fa-arrow-up text-green-600 mr-1"></i> Ready for withdrawal
                                </p>
                            </div>

                            {/* Likes */}
                            <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                                <div className="flex items-center justify-between mb-4">
                                    <div>
                                        <p className="text-slate-600 text-sm font-medium">Total Likes</p>
                                        <h3 className="text-3xl font-bold text-red-600 mt-2">{profile.likes || 0}</h3>
                                    </div>
                                    <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center text-red-600">
                                        <i className="fas fa-heart text-xl"></i>
                                    </div>
                                </div>
                                <p className="text-xs text-slate-500">
                                    <i className="fas fa-arrow-up text-green-600 mr-1"></i> User engagement
                                </p>
                            </div>

                            {/* Revenue */}
                            <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                                <div className="flex items-center justify-between mb-4">
                                    <div>
                                        <p className="text-slate-600 text-sm font-medium">Month Revenue</p>
                                        <h3 className="text-3xl font-bold text-green-600 mt-2">₦ {profile?.monthly_revenue || 0}</h3>
                                    </div>
                                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center text-green-600">
                                        <i className="fas fa-chart-line text-xl"></i>
                                    </div>
                                </div>
                                <p className="text-xs text-slate-500">
                                    <i className="fas fa-arrow-up text-green-600 mr-1"></i> Trending up
                                </p>
                            </div>
                        </div>

                        {/* CTA Section */}
                        <div className="bg-gradient-primary text-white rounded-xl p-8 mb-8 overflow-hidden relative">
                            <div className="absolute -right-20 -top-20 w-40 h-40 bg-white opacity-5 rounded-full"></div>
                            <div className="relative z-10">
                                <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                                    <div>
                                        <h2 className="text-2xl md:text-3xl font-bold mb-2">Ready to Maximize Your Earnings?</h2>
                                        <p className="text-slate-200 mb-4">
                                            Upgrade to a premium account to unlock advanced features and reach more customers.
                                        </p>
                                    </div>
                                    <button className="btn px-8 py-3 whitespace-nowrap flex-shrink-0">
                                        Upgrade Now
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Quick Actions */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <Link 
                                to="/dashboard/projects"
                                className="bg-white rounded-xl p-4 text-center hover:shadow-md transition-shadow group"
                            >
                                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 mx-auto mb-3 group-hover:scale-110 transition-transform">
                                    <i className="fas fa-plus text-xl"></i>
                                </div>
                                <h3 className="font-semibold text-primary text-sm">Upload Project</h3>
                                <p className="text-xs text-slate-500 mt-1">Share new materials</p>
                            </Link>

                            <button className="bg-white rounded-xl p-4 text-center hover:shadow-md transition-shadow group">
                                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center text-green-600 mx-auto mb-3 group-hover:scale-110 transition-transform">
                                    <i className="fas fa-chart-bar text-xl"></i>
                                </div>
                                <h3 className="font-semibold text-primary text-sm">Analytics</h3>
                                <p className="text-xs text-slate-500 mt-1">View insights</p>
                            </button>

                            <Link 
                                to="/dashboard/wallet/"
                                className="bg-white rounded-xl p-4 text-center hover:shadow-md transition-shadow group"
                            >
                                <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center text-amber-600 mx-auto mb-3 group-hover:scale-110 transition-transform">
                                    <i className="fas fa-wallet text-xl"></i>
                                </div>
                                <h3 className="font-semibold text-primary text-sm">Withdraw</h3>
                                <p className="text-xs text-slate-500 mt-1">Request payment</p>
                            </Link>

                            <Link 
                                to="/dashboard/profile/"
                                className="bg-white rounded-xl p-4 text-center hover:shadow-md transition-shadow group"
                            >
                                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center text-purple-600 mx-auto mb-3 group-hover:scale-110 transition-transform">
                                    <i className="fas fa-user text-xl"></i>
                                </div>
                                <h3 className="font-semibold text-primary text-sm">Profile</h3>
                                <p className="text-xs text-slate-500 mt-1">Edit details</p>
                            </Link>
                        </div>

                        {/* Analytics Section */}
                        <div className="mt-12">
                            <h2 className="text-2xl font-bold text-primary mb-6">Analytics & Performance</h2>
                            
                            {/* Revenue Trend Chart */}
                            <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 mb-6">
                                <h3 className="text-lg font-semibold text-primary mb-4">
                                    <i className="fas fa-chart-line mr-2 text-blue-600"></i>
                                    Revenue Trend
                                </h3>
                                <div className="w-full h-80">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <LineChart data={analytics.revenue_data}>
                                            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                                            <XAxis dataKey="month" stroke="#64748b" />
                                            <YAxis stroke="#64748b" />
                                            <Tooltip 
                                                contentStyle={{ 
                                                    backgroundColor: '#ffffff', 
                                                    border: '1px solid #e2e8f0',
                                                    borderRadius: '8px'
                                                }}
                                            />
                                            <Legend />
                                            <Line 
                                                type="monotone" 
                                                dataKey="revenue" 
                                                stroke="#3b82f6" 
                                                strokeWidth={2}
                                                dot={{ fill: '#3b82f6', r: 5 }}
                                                activeDot={{ r: 7 }}
                                            />
                                        </LineChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>

                            {/* Project Performance Chart */}
                            <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 mb-6">
                                <h3 className="text-lg font-semibold text-primary mb-4">
                                    <i className="fas fa-bars mr-2 text-green-600"></i>
                                    Project Performance
                                </h3>
                                <div className="w-full h-80">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={analytics.project_performance}>
                                            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                                            <XAxis dataKey="name" stroke="#64748b" />
                                            <YAxis stroke="#64748b" />
                                            <Tooltip 
                                                contentStyle={{ 
                                                    backgroundColor: '#ffffff', 
                                                    border: '1px solid #e2e8f0',
                                                    borderRadius: '8px'
                                                }}
                                            />
                                            <Legend />
                                            <Bar dataKey="views" fill="#3b82f6" radius={[8, 8, 0, 0]} />
                                            <Bar dataKey="downloads" fill="#10b981" radius={[8, 8, 0, 0]} />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>

                            {/* Top Projects */}
                            <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
                                <h3 className="text-lg font-semibold text-primary mb-4">
                                    <i className="fas fa-star mr-2 text-amber-600"></i>
                                    Top Performing Projects
                                </h3>
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead>
                                            <tr className="border-b border-slate-200">
                                                <th className="text-left py-3 px-4 font-semibold text-slate-700">Project Name</th>
                                                <th className="text-left py-3 px-4 font-semibold text-slate-700">Views</th>
                                                <th className="text-left py-3 px-4 font-semibold text-slate-700">Downloads</th>
                                                <th className="text-left py-3 px-4 font-semibold text-slate-700">Conversion Rate</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {analytics.top_projects && analytics.top_projects.map((project, index) => (
                                                <tr key={index} className="border-b border-slate-100 hover:bg-slate-50 transition">
                                                    <td className="py-4 px-4">
                                                        <p className="font-medium text-slate-800">{project.title || project.name}</p>
                                                    </td>
                                                    <td className="py-4 px-4">
                                                        <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                                                            {project.views || 0}
                                                        </span>
                                                    </td>
                                                    <td className="py-4 px-4">
                                                        <span className="inline-block px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                                                            {project.downloads || 0}
                                                        </span>
                                                    </td>
                                                    <td className="py-4 px-4">
                                                        <p className="font-semibold text-slate-800">
                                                            {project.views ? ((project.downloads / project.views) * 100).toFixed(1) : 0}%
                                                        </p>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </>
    );
}

export default Home;