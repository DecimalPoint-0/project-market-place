import React, { useState, useRef, useEffect } from "react";
import Header from "../partials/Header";
import Toast from "../../plugin/Toast";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { resetPassword, requestPasswordReset } from "../../utils/auth";
import '@fortawesome/fontawesome-free/css/all.css';

function ResetPassword() {
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isResending, setIsResending] = useState(false);
    const [resendCooldown, setResendCooldown] = useState(0);

    const inputRefs = useRef([]);
    const navigate = useNavigate();
    const location = useLocation();
    const email = location.state?.email || '';

    // Redirect if no email provided
    useEffect(() => {
        if (!email) {
            navigate('/forgot-password');
        }
        // Focus first OTP input on mount
        inputRefs.current[0]?.focus();
    }, [email, navigate]);

    const handleOtpChange = (index, value) => {
        // Only allow numbers
        if (!/^\d*$/.test(value)) return;

        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        // Auto focus to next input if value is entered
        if (value && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (index, e) => {
        // Handle backspace to move to previous input
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const validateForm = () => {
        const otpCode = otp.join('');
        if (otpCode.length !== 6) {
            Toast('error', 'Please enter all 6 digits of the reset code');
            return false;
        }
        if (!password || !confirmPassword) {
            Toast('error', 'Please fill in all password fields');
            return false;
        }
        if (password !== confirmPassword) {
            Toast('error', 'Passwords do not match');
            return false;
        }
        if (password.length < 6) {
            Toast('error', 'Password must be at least 6 characters');
            return false;
        }
        return true;
    };

    const handleResetPassword = async (event) => {
        event.preventDefault();

        if (!validateForm()) return;

        setIsLoading(true);
        const otpCode = otp.join('');
        const { error } = await resetPassword(email, otpCode, password, confirmPassword);

        if (error) {
            Toast('error', error?.detail || error?.message || 'Password reset failed');
        } else {
            Toast('success', 'Password reset successfully!');
            setTimeout(() => {
                navigate('/sign-in');
            }, 2000);
        }
        setIsLoading(false);
    };

    const handleResendCode = async () => {
        setIsResending(true);
        const { error } = await requestPasswordReset(email);

        if (error) {
            Toast('error', error?.detail || error?.message || 'Failed to resend reset code');
        } else {
            Toast('success', 'Reset code sent!');
            setOtp(['', '', '', '', '', '']);
            inputRefs.current[0]?.focus();
            // Start cooldown timer
            setResendCooldown(60);
            const timer = setInterval(() => {
                setResendCooldown((prev) => {
                    if (prev <= 1) {
                        clearInterval(timer);
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        }
        setIsResending(false);
    };

    if (!email) {
        return null;
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
                            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center text-red-600 text-3xl mx-auto mb-4">
                                <i className="fas fa-lock"></i>
                            </div>
                            <h1 className="text-3xl font-bold text-slate-900 mb-2">Create New Password</h1>
                            <p className="text-slate-600">
                                Enter the code sent to<br/>
                                <span className="font-semibold text-slate-900">{email}</span>
                            </p>
                        </div>

                        {/* Form */}
                        <form onSubmit={handleResetPassword} className="space-y-5">

                            {/* Reset Code OTP */}
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-4 text-center">
                                    <i className="fas fa-code mr-2 text-red-600"></i>Reset Code
                                </label>
                                <div className="flex gap-2 justify-center mb-4">
                                    {otp.map((digit, index) => (
                                        <input
                                            key={index}
                                            ref={(el) => (inputRefs.current[index] = el)}
                                            type="text"
                                            value={digit}
                                            onChange={(e) => handleOtpChange(index, e.target.value)}
                                            onKeyDown={(e) => handleKeyDown(index, e)}
                                            placeholder="0"
                                            maxLength="1"
                                            className="w-12 h-12 text-center text-2xl font-bold border-2 border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition"
                                        />
                                    ))}
                                </div>
                                <p className="text-xs text-slate-500 text-center mb-4">Enter the 6-digit code from your email</p>
                            </div>

                            {/* New Password */}
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                    <i className="fas fa-lock mr-2 text-red-600"></i>New Password
                                </label>
                                <div className="relative">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="At least 6 characters"
                                        className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition"
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
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                    <i className="fas fa-check-circle mr-2 text-red-600"></i>Confirm Password
                                </label>
                                <div className="relative">
                                    <input
                                        type={showConfirmPassword ? "text" : "password"}
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        placeholder="Re-enter password"
                                        className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition"
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

                            {/* Reset Button */}
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white font-semibold py-3 rounded-lg transition flex items-center justify-center gap-2 mt-6"
                            >
                                {isLoading ? (
                                    <>
                                        <i className="fas fa-spinner fa-spin"></i>
                                        Resetting...
                                    </>
                                ) : (
                                    <>
                                        <i className="fas fa-key"></i>
                                        Reset Password
                                    </>
                                )}
                            </button>
                        </form>

                        {/* Divider */}
                        <div className="my-6 flex items-center gap-4">
                            <div className="flex-1 h-px bg-slate-200"></div>
                            <span className="text-sm text-slate-500">or</span>
                            <div className="flex-1 h-px bg-slate-200"></div>
                        </div>

                        {/* Resend Code */}
                        <div className="text-center space-y-3">
                            <p className="text-sm text-slate-600">
                                Didn't receive the code?
                            </p>
                            <button
                                type="button"
                                onClick={handleResendCode}
                                disabled={isResending || resendCooldown > 0}
                                className="w-full text-red-600 hover:text-red-700 disabled:text-slate-400 font-semibold py-2 transition flex items-center justify-center gap-2"
                            >
                                {isResending ? (
                                    <>
                                        <i className="fas fa-spinner fa-spin"></i>
                                        Sending...
                                    </>
                                ) : resendCooldown > 0 ? (
                                    <>
                                        <i className="fas fa-clock"></i>
                                        Resend in {resendCooldown}s
                                    </>
                                ) : (
                                    <>
                                        <i className="fas fa-redo"></i>
                                        Resend Code
                                    </>
                                )}
                            </button>
                        </div>

                        {/* Back to Login */}
                        <div className="mt-6 text-center">
                            <Link to="/sign-in" className="text-sm text-red-600 hover:text-red-700 font-semibold transition">
                                <i className="fas fa-arrow-left mr-1"></i>Back to Login
                            </Link>
                        </div>

                    </div>
                </div>
            </div>
        </>
    );
}

export default ResetPassword;
