import React, { useState, useEffect } from "react";
import Header from "../partials/Header";
import Toast from "../../plugin/Toast"
import { Link, useNavigate } from "react-router-dom";
import { login, resendVerificationEmail } from "../../utils/auth"
import '@fortawesome/fontawesome-free/css/all.css';

function Login(){

    const [loginData, setloginData] = useState({
        'email': '',
        'password': ''
    })

    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [unverifiedEmail, setUnverifiedEmail] = useState('');
    const [showVerificationPrompt, setShowVerificationPrompt] = useState(false);
    const [isResending, setIsResending] = useState(false);

    const navigate = useNavigate()

    const handleloginDataChange = (event) => {
        setloginData({
            ...loginData,
            [event.target.name]: event.target.value,
        });
    }

    const handleResendVerification = async () => {
        setIsResending(true);
        const { error } = await resendVerificationEmail(unverifiedEmail);
        
        if (error) {
            Toast('error', error?.detail || error?.message || 'Failed to resend verification email');
        }
        setIsResending(false);
    };

    const handleLogin = async (event) => {
        event.preventDefault();
        
        if (!loginData.email || !loginData.password) {
            Toast('error', 'Please fill in all fields')
            return
        }
        
        setIsLoading(true);
        const {error} = await login(loginData.email, loginData.password);

        if (error){
            const errorDetail = error?.data?.detail || error?.detail || 'Login failed';
            
            // Check if error is due to unverified email
            if (errorDetail.includes('verified') || errorDetail.includes('Verify')) {
                setUnverifiedEmail(loginData.email);
                setShowVerificationPrompt(true);
                Toast('error', 'Please verify your email first');
            } else {
                Toast('error', errorDetail);
            }
        }else{
            navigate("/dashboard/");
        }
        setIsLoading(false);
    }

    const handleSocialLogin = (provider) => {
        Toast('info', `${provider} login coming soon!`)
    }

    return (
        <>
            <Header />

            <div className="min-h-[calc(100vh-80px)] bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center px-4 py-8">
                <div className="w-full max-w-md">
                    
                    {/* Card */}
                    <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-8">
                        
                        {/* Logo/Header */}
                        <div className="text-center mb-8">
                            <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center text-white text-3xl mx-auto mb-4">
                                <i className="fas fa-sign-in-alt"></i>
                            </div>
                            <h1 className="text-3xl font-bold text-primary mb-2">Welcome Back</h1>
                            <p className="text-slate-600">Sign in to your account to continue</p>
                        </div>

                        {/* Unverified Email Alert */}
                        {showVerificationPrompt && (
                            <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                                <div className="flex items-start gap-3">
                                    <i className="fas fa-exclamation-triangle text-amber-600 text-lg mt-0.5"></i>
                                    <div className="flex-1">
                                        <h4 className="font-semibold text-amber-900 mb-1">Email Not Verified</h4>
                                        <p className="text-sm text-amber-800 mb-3">
                                            Your email address hasn't been verified yet. Please verify it to log in.
                                        </p>
                                        <button
                                            type="button"
                                            onClick={handleResendVerification}
                                            disabled={isResending}
                                            className="text-sm bg-amber-600 hover:bg-amber-700 disabled:bg-amber-400 text-white px-3 py-1 rounded transition font-medium"
                                        >
                                            {isResending ? (
                                                <>
                                                    <i className="fas fa-spinner fa-spin mr-1"></i>
                                                    Sending...
                                                </>
                                            ) : (
                                                <>
                                                    <i className="fas fa-envelope mr-1"></i>
                                                    Resend Verification Email
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Form */}
                        <form onSubmit={handleLogin} className="space-y-5">
                            
                            {/* Email */}
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                    <i className="fas fa-envelope mr-2 text-primary"></i>Email Address
                                </label>
                                <input 
                                    type="email" 
                                    name="email" 
                                    value={loginData.email} 
                                    onChange={handleloginDataChange}
                                    placeholder="you@example.com"
                                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition"
                                />
                            </div>

                            {/* Password */}
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                    <i className="fas fa-lock mr-2 text-primary"></i>Password
                                </label>
                                <div className="relative">
                                    <input 
                                        type={showPassword ? "text" : "password"} 
                                        name="password" 
                                        value={loginData.password} 
                                        onChange={handleloginDataChange}
                                        placeholder="Enter your password"
                                        className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-3.5 text-slate-500 hover:text-slate-700"
                                    >
                                        <i className={`fas fa-eye${showPassword ? '-slash' : ''}`}></i>
                                    </button>
                                </div>
                            </div>

                            {/* Remember & Forgot */}
                            <div className="flex items-center justify-between">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input type="checkbox" className="w-4 h-4 rounded border-slate-300" />
                                    <span className="text-sm text-slate-600">Remember me</span>
                                </label>
                                <Link to="/forgot-password" className="text-sm text-primary hover:text-primary/80 font-medium transition">Forgot password?</Link>
                            </div>

                            {/* Login Button */}
                            <button 
                                type="submit"
                                disabled={isLoading}
                                className="w-full bg-primary hover:bg-primary/90 disabled:bg-primary/50 text-white font-semibold py-3 rounded-lg transition flex items-center justify-center gap-2"
                            >
                                {isLoading ? (
                                    <>
                                        <i className="fas fa-spinner fa-spin"></i>
                                        Signing in...
                                    </>
                                ) : (
                                    <>
                                        <i className="fas fa-sign-in-alt"></i>
                                        Sign In
                                    </>
                                )}
                            </button>
                        </form>

                        {/* Divider */}
                        <div className="my-6 flex items-center gap-4">
                            <div className="flex-1 h-px bg-slate-200"></div>
                            <span className="text-sm text-slate-500">Or continue with</span>
                            <div className="flex-1 h-px bg-slate-200"></div>
                        </div>

                        {/* Social Buttons */}
                        <div className="grid grid-cols-3 gap-3 mb-6">
                            <button 
                                type="button"
                                onClick={() => handleSocialLogin('Google')}
                                className="flex items-center justify-center gap-2 py-2.5 border border-slate-300 rounded-lg hover:bg-slate-50 transition"
                            >
                                <i className="fab fa-google text-red-600 text-lg"></i>
                                <span className="text-xs font-medium text-slate-700 hidden sm:inline">Google</span>
                            </button>
                            <button 
                                type="button"
                                onClick={() => handleSocialLogin('Facebook')}
                                className="flex items-center justify-center gap-2 py-2.5 border border-slate-300 rounded-lg hover:bg-slate-50 transition"
                            >
                                <i className="fab fa-facebook text-blue-600 text-lg"></i>
                                <span className="text-xs font-medium text-slate-700 hidden sm:inline">Facebook</span>
                            </button>
                            <button 
                                type="button"
                                onClick={() => handleSocialLogin('Twitter')}
                                className="flex items-center justify-center gap-2 py-2.5 border border-slate-300 rounded-lg hover:bg-slate-50 transition"
                            >
                                <i className="fab fa-twitter text-blue-400 text-lg"></i>
                                <span className="text-xs font-medium text-slate-700 hidden sm:inline">Twitter</span>
                            </button>
                        </div>

                        {/* Sign Up Link */}
                        <div className="text-center">
                            <p className="text-slate-600">
                                Don't have an account? 
                                <Link to="/sign-up" className="ml-1 text-primary hover:text-primary/80 font-semibold transition">
                                    Sign Up
                                </Link>
                            </p>
                        </div>

                    </div>
                </div>
            </div>
        </>
    );
}

export default Login;

