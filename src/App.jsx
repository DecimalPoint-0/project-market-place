import './App.css'
import { Route, Routes, BrowserRouter } from "react-router-dom";
import MainWrapper from "./layouts/MainWrapper";
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


function App() {

  return (
    <BrowserRouter>
      <MainWrapper>  
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Index />} />
          <Route path="/about-us/" element={<About />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/categories/:id" element={<Projects />} />
          <Route path="/projects/:id" element={<ProjectDetails />} />
          
          {/* Public Auth Routes - Redirect to dashboard if already logged in */}
          <Route 
            path="/sign-up" 
            element={
              <PublicRoute>
                <SignUp />
              </PublicRoute>
            } 
          />
          <Route 
            path="/sign-in" 
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            } 
          />
          <Route 
            path="/forgot-password" 
            element={
              <PublicRoute>
                <ForgotPassword />
              </PublicRoute>
            } 
          />
          <Route 
            path="/reset-password" 
            element={
              <PublicRoute>
                <ResetPassword />
              </PublicRoute>
            } 
          />
          
          {/* Private Dashboard Routes - Require authentication */}
          <Route 
            path="/dashboard/" 
            element={
              <PrivateRoute>
                <Home />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/dashboard/about-us/" 
            element={
              <PrivateRoute>
                <About />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/dashboard/profile/" 
            element={
              <PrivateRoute>
                <Profile />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/dashboard/projects/" 
            element={
              <PrivateRoute>
                <AddProjects />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/dashboard/wallet/" 
            element={
              <PrivateRoute>
                <Wallet />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/dashboard/transactions/" 
            element={
              <PrivateRoute>
                <Transactions />
              </PrivateRoute>
            } 
          />
        </Routes>
      </MainWrapper>
    </BrowserRouter>
  )
}

export default App
