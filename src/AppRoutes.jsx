import { Route, Routes, useLocation } from "react-router-dom";
import PrivateRoute from "./layouts/PrivateRoute";
import PublicRoute from "./layouts/PublicRoute";
import Index from './views/core/Index';
import About from './views/pages/About';
import Projects from './views/pages/Projects';
import ProjectDetails from './views/pages/ProjectDetails';
import Home from './views/dashboard/Home';
import Profile from './views/dashboard/Profile';
import Wallet from './views/dashboard/Wallet';
import Transactions from './views/dashboard/Transactions';
import AddProjects from './views/dashboard/AddProjects';
import SignUp from './views/auth/SignUp';
import Login from './views/auth/Login';
import ForgotPassword from './views/auth/ForgotPassword';
import ResetPassword from './views/auth/ResetPassword';
import AdminNavBar from './views/dashboard/AdminNavBar';
import LeftNavBar from './views/dashboard/LeftNavBar';
import { useAuthStore } from './store/auth';
import { useUserRefresh } from './plugin/useUserRefresh';

// Component to conditionally render dashboard layout
function DashboardLayout({ children }) {
    return (
        <div className="flex">
            <LeftNavBar />
            <div className="flex-1 md:ml-64">
                {children}
            </div>
        </div>
    );
}

function AppRoutes() {
    const location = useLocation();
    const isLoggedIn = useAuthStore((state) => state.isLoggedIn());
    
    // Use user refresh hook to manage 30-minute refresh interval
    useUserRefresh();

    // Check if current route is a dashboard route
    const isDashboardRoute = location.pathname.startsWith('/dashboard');

    return (
        <>
            {/* Show header and nav only on dashboard routes when logged in */}
            {isDashboardRoute && isLoggedIn && <AdminNavBar />}
            
            {isDashboardRoute && isLoggedIn ? (
                <DashboardLayout>
                    <Routes>
                        {/* Private Dashboard Routes */}
                        <Route path="/dashboard" element={<PrivateRoute><Home /></PrivateRoute>} />
                        <Route path="/dashboard/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
                        <Route path="/dashboard/projects" element={<PrivateRoute><AddProjects /></PrivateRoute>} />
                        <Route path="/dashboard/wallet" element={<PrivateRoute><Wallet /></PrivateRoute>} />
                        <Route path="/dashboard/transactions" element={<PrivateRoute><Transactions /></PrivateRoute>} />
                    </Routes>
                </DashboardLayout>
            ) : (
                <Routes>
                    {/* Public Routes */}
                    <Route path="/" element={<Index />} />
                    <Route path="/about-us/" element={<About />} />
                    <Route path="/projects" element={<Projects />} />
                    <Route path="/categories/:id" element={<Projects />} />
                    <Route path="/projects/:id" element={<ProjectDetails />} />
                    
                    {/* Public Auth Routes */}
                    <Route path="/sign-up" element={<PublicRoute><SignUp /></PublicRoute>} />
                    <Route path="/sign-in" element={<PublicRoute><Login /></PublicRoute>} />
                    <Route path="/forgot-password" element={<PublicRoute><ForgotPassword /></PublicRoute>} />
                    <Route path="/reset-password" element={<PublicRoute><ResetPassword /></PublicRoute>} />
                </Routes>
            )}
        </>
    );
}

export default AppRoutes;
