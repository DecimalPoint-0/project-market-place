import React, { useState, useRef, useEffect } from "react";
import Toast from "../plugin/Toast";
import { verifyEmail, resendVerificationEmail } from "../utils/auth";
import '@fortawesome/fontawesome-free/css/all.css';

function EmailVerification({ email, onVerificationSuccess }) {
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [isLoading, setIsLoading] = useState(false);
    const [isResending, setIsResending] = useState(false);
    const [resendCooldown, setResendCooldown] = useState(0);
    const inputRefs = useRef([]);

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

    const handleVerifyEmail = async (event) => {
        event.preventDefault();

        const otpCode = otp.join('');
        if (otpCode.length !== 6) {
            Toast('error', 'Please enter all 6 digits');
            return;
        }

        setIsLoading(true);
        const { error } = await verifyEmail(email, otpCode);

        if (error) {
            Toast('error', error?.detail || error?.message || 'Email verification failed');
        } else {
            Toast('success', 'Email verified successfully!');
            onVerificationSuccess();
        }
        setIsLoading(false);
    };

    const handleResendEmail = async () => {
        setIsResending(true);
        const { error } = await resendVerificationEmail(email);

        if (error) {
            Toast('error', error?.detail || error?.message || 'Failed to resend email');
        } else {
            Toast('success', 'Verification email sent!');
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

    useEffect(() => {
        // Focus first input on mount
        inputRefs.current[0]?.focus();
    }, []);

    return (
        <div className="min-h-[calc(100vh-80px)] bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center px-4 py-8">
            <div className="w-full max-w-md">
                
                {/* Card */}
                <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-8">
                    
                    {/* Logo/Header */}
                    <div className="text-center mb-8">
                        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-3xl mx-auto mb-4">
                            <i className="fas fa-envelope-open-text"></i>
                        </div>
                        <h1 className="text-3xl font-bold text-slate-900 mb-2">Verify Your Email</h1>
                        <p className="text-slate-600">
                            We've sent a verification code to<br/>
                            <span className="font-semibold text-slate-900">{email}</span>
                        </p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleVerifyEmail} className="space-y-5">
                        
                        {/* OTP Boxes */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-4 text-center">
                                <i className="fas fa-code mr-2 text-blue-600"></i>Enter Verification Code
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
                                        className="w-12 h-12 text-center text-2xl font-bold border-2 border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                                    />
                                ))}
                            </div>
                            <p className="text-xs text-slate-500 text-center">Check your email for the 6-digit verification code</p>
                        </div>

                        {/* Verify Button */}
                        <button 
                            type="submit"
                            disabled={isLoading || otp.join('').length !== 6}
                            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-3 rounded-lg transition flex items-center justify-center gap-2 mt-6"
                        >
                            {isLoading ? (
                                <>
                                    <i className="fas fa-spinner fa-spin"></i>
                                    Verifying...
                                </>
                            ) : (
                                <>
                                    <i className="fas fa-check-circle"></i>
                                    Verify Email
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
                            onClick={handleResendEmail}
                            disabled={isResending || resendCooldown > 0}
                            className="w-full text-blue-600 hover:text-blue-700 disabled:text-slate-400 font-semibold py-2 transition flex items-center justify-center gap-2"
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
                                    Resend Verification Code
                                </>
                            )}
                        </button>
                    </div>

                    {/* Info Box */}
                    <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                        <p className="text-xs text-slate-600 text-center">
                            <i className="fas fa-info-circle text-blue-600 mr-2"></i>
                            Check your spam folder if you don't see the email
                        </p>
                    </div>

                </div>
            </div>
        </div>
    );
}

export default EmailVerification;
