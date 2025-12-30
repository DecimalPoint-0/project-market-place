import React, { useState } from "react";
import Header from "../partials/Header";
import Toast from "../../plugin/Toast"
import { Link, useNavigate } from "react-router-dom";
import { register } from "../../utils/auth"
import EmailVerification from "../../components/EmailVerification";
import '@fortawesome/fontawesome-free/css/all.css';

function SignUp(){

    const [bioData, setBioData] = useState({
        'email': '',
        'name': '',
        'password': '',
        'password2': '',
        'contact': ''
    })

    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [showVerification, setShowVerification] = useState(false);
    const [registeredEmail, setRegisteredEmail] = useState('');

    const navigate = useNavigate()

    const handleBioDataChange = (event) => {
        setBioData({
            ...bioData,
            [event.target.name]: event.target.value,
        });
    }

    const validateForm = () => {
        if (!bioData.name || !bioData.email || !bioData.password || !bioData.password2 || !bioData.contact) {
            Toast('error', 'Please fill in all fields')
            return false
        }
        if (bioData.password !== bioData.password2) {
            Toast('error', 'Passwords do not match')
            return false
        }
        if (bioData.password.length < 6) {
            Toast('error', 'Password must be at least 6 characters')
            return false
        }
        return true
    }

    const handleBioDataRegister = async (event) => {
        event.preventDefault();
        
        if (!validateForm()) return
        
        setIsLoading(true);
        const {error} = await register(bioData.email, bioData.name, bioData.password, bioData.password2, bioData.contact);

        if (error){
            Toast('error', error?.data?.detail || error?.detail || 'Registration failed')
        }else{
            Toast('success', 'Account created! Please verify your email.')
            setRegisteredEmail(bioData.email);
            setShowVerification(true);
        }
        setIsLoading(false);
    }

    const handleVerificationSuccess = () => {
        Toast('success', 'Email verified! You can now log in.');
        setTimeout(() => {
            navigate("/sign-in");
        }, 2000);
    }

    const handleSocialSignup = (provider) => {
        Toast('info', `${provider} sign up coming soon!`)
    }

    return (
        <>
            <Header />

            {showVerification ? (
                <EmailVerification 
                    email={registeredEmail}
                    onVerificationSuccess={handleVerificationSuccess}
                />
            ) : (
                <div className="min-h-[calc(100vh-80px)] bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center px-4 py-8">
                <div className="w-full max-w-2xl">
                    
                    {/* Card */}
                    <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-8">
                        
                        {/* Logo/Header */}
                        <div className="text-center mb-8">
                            <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center text-white text-3xl mx-auto mb-4">
                                <i className="fas fa-user-plus"></i>
                            </div>
                            <h1 className="text-3xl font-bold text-primary mb-2">Join Our Community</h1>
                            <p className="text-slate-600">Create an account to start sharing your expertise</p>
                        </div>

                        {/* Form */}
                        <form onSubmit={handleBioDataRegister} className="space-y-4">
                            
                            {/* Two Column Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                
                                {/* Full Name */}
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">
                                        <i className="fas fa-user mr-2 text-primary"></i>Full Name
                                    </label>
                                    <input 
                                        type="text" 
                                        name="name" 
                                        value={bioData.name} 
                                        onChange={handleBioDataChange}
                                        placeholder="John Doe"
                                        className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition"
                                    />
                                </div>

                                {/* Email */}
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">
                                        <i className="fas fa-envelope mr-2 text-primary"></i>Email Address
                                    </label>
                                    <input 
                                        type="email" 
                                        name="email" 
                                        value={bioData.email} 
                                        onChange={handleBioDataChange}
                                        placeholder="you@example.com"
                                        className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition"
                                    />
                                </div>

                                {/* Phone Number */}
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">
                                        <i className="fas fa-phone mr-2 text-primary"></i>Phone Number
                                    </label>
                                    <input 
                                        type="tel" 
                                        name="contact" 
                                        value={bioData.contact} 
                                        onChange={handleBioDataChange}
                                        placeholder="+234 901 234 5678"
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
                                            value={bioData.password} 
                                            onChange={handleBioDataChange}
                                            placeholder="At least 6 characters"
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

                                {/* Confirm Password */}
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-slate-700 mb-2">
                                        <i className="fas fa-check-circle mr-2 text-primary"></i>Confirm Password
                                    </label>
                                    <div className="relative">
                                        <input 
                                            type={showConfirmPassword ? "text" : "password"} 
                                            name="password2" 
                                            value={bioData.password2} 
                                            onChange={handleBioDataChange}
                                            placeholder="Re-enter password"
                                            className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                            className="absolute right-3 top-3.5 text-slate-500 hover:text-slate-700"
                                        >
                                            <i className={`fas fa-eye${showConfirmPassword ? '-slash' : ''}`}></i>
                                        </button>
                                    </div>
                                </div>

                            </div>

                            {/* Terms */}
                            <div className="flex items-start gap-2 pt-2">
                                <input type="checkbox" className="w-4 h-4 rounded border-slate-300 mt-1" />
                                <label className="text-sm text-slate-600">
                                    I agree to the 
                                    <a href="#" className="text-primary hover:text-primary/80 font-medium mx-1">Terms & Conditions</a>
                                    and 
                                    <a href="#" className="text-primary hover:text-primary/80 font-medium mx-1">Privacy Policy</a>
                                </label>
                            </div>

                            {/* Sign Up Button */}
                            <button 
                                type="submit"
                                disabled={isLoading}
                                className="w-full bg-primary hover:bg-primary/90 disabled:bg-primary/50 text-white font-semibold py-3 rounded-lg transition flex items-center justify-center gap-2 mt-6"
                            >
                                {isLoading ? (
                                    <>
                                        <i className="fas fa-spinner fa-spin"></i>
                                        Creating Account...
                                    </>
                                ) : (
                                    <>
                                        <i className="fas fa-user-plus"></i>
                                        Create Account
                                    </>
                                )}
                            </button>
                        </form>

                        {/* Divider */}
                        <div className="my-6 flex items-center gap-4">
                            <div className="flex-1 h-px bg-slate-200"></div>
                            <span className="text-sm text-slate-500">Or sign up with</span>
                            <div className="flex-1 h-px bg-slate-200"></div>
                        </div>

                        {/* Social Buttons */}
                        <div className="grid grid-cols-3 gap-3 mb-6">
                            <button 
                                type="button"
                                onClick={() => handleSocialSignup('Google')}
                                className="flex items-center justify-center gap-2 py-2.5 border border-slate-300 rounded-lg hover:bg-slate-50 transition"
                            >
                                <i className="fab fa-google text-red-600 text-lg"></i>
                                <span className="text-xs font-medium text-slate-700 hidden sm:inline">Google</span>
                            </button>
                            <button 
                                type="button"
                                onClick={() => handleSocialSignup('Facebook')}
                                className="flex items-center justify-center gap-2 py-2.5 border border-slate-300 rounded-lg hover:bg-slate-50 transition"
                            >
                                <i className="fab fa-facebook text-blue-600 text-lg"></i>
                                <span className="text-xs font-medium text-slate-700 hidden sm:inline">Facebook</span>
                            </button>
                            <button 
                                type="button"
                                onClick={() => handleSocialSignup('Twitter')}
                                className="flex items-center justify-center gap-2 py-2.5 border border-slate-300 rounded-lg hover:bg-slate-50 transition"
                            >
                                <i className="fab fa-twitter text-blue-400 text-lg"></i>
                                <span className="text-xs font-medium text-slate-700 hidden sm:inline">Twitter</span>
                            </button>
                        </div>

                        {/* Sign In Link */}
                        <div className="text-center">
                            <p className="text-slate-600">
                                Already have an account? 
                                <Link to="/sign-in" className="ml-1 text-primary hover:text-primary/80 font-semibold transition">
                                    Sign In
                                </Link>
                            </p>
                        </div>

                    </div>
                </div>
                </div>
            )}
        </>
    );
}

export default SignUp;

