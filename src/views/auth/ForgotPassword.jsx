import React, { useState } from "react";
import Header from "../partials/Header";
import Toast from "../../plugin/Toast";
import { Link, useNavigate } from "react-router-dom";
import { requestPasswordReset } from "../../utils/auth";
import '@fortawesome/fontawesome-free/css/all.css';

function ForgotPassword() {
    const [email, setEmail] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [showSuccessMessage, setShowSuccessMessage] = useState(false);

    const navigate = useNavigate();

    const handleRequestReset = async (event) => {
        event.preventDefault();

        if (!email.trim()) {
            Toast('error', 'Please enter your email address');
            return;
        }

        setIsLoading(true);
        const { error } = await requestPasswordReset(email);

        if (error) {
            Toast('error', error?.detail || error?.message || 'Failed to send reset email');
        } else {
            setShowSuccessMessage(true);
            // Redirect to reset password page after 2 seconds
            setTimeout(() => {
                navigate('/reset-password', { state: { email } });
            }, 2000);
        }
        setIsLoading(false);
    };

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
                                <i className="fas fa-key"></i>
                            </div>
                            <h1 className="text-3xl font-bold text-slate-900 mb-2">Reset Password</h1>
                            <p className="text-slate-600">Enter your email to receive a password reset code</p>
                        </div>

                        {/* Success Message */}
                        {showSuccessMessage && (
                            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                                <div className="flex items-start gap-3">
                                    <i className="fas fa-check-circle text-green-600 text-lg mt-0.5"></i>
                                    <div>
                                        <h4 className="font-semibold text-green-900 mb-1">Email Sent!</h4>
                                        <p className="text-sm text-green-800">
                                            Check your email for the password reset code.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Form */}
                        <form onSubmit={handleRequestReset} className="space-y-5">

                            {/* Email */}
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                    <i className="fas fa-envelope mr-2 text-red-600"></i>Email Address
                                </label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="you@example.com"
                                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition"
                                    disabled={showSuccessMessage}
                                />
                                <p className="text-xs text-slate-500 mt-1">We'll send you a code to reset your password</p>
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={isLoading || showSuccessMessage}
                                className="w-full bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white font-semibold py-3 rounded-lg transition flex items-center justify-center gap-2 mt-6"
                            >
                                {isLoading ? (
                                    <>
                                        <i className="fas fa-spinner fa-spin"></i>
                                        Sending...
                                    </>
                                ) : (
                                    <>
                                        <i className="fas fa-paper-plane"></i>
                                        Send Reset Code
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

                        {/* Back to Login Link */}
                        <div className="text-center">
                            <p className="text-slate-600 mb-3">
                                Remember your password?
                                <Link to="/sign-in" className="ml-1 text-red-600 hover:text-red-700 font-semibold transition">
                                    Sign In
                                </Link>
                            </p>
                            <p className="text-slate-600">
                                Don't have an account?
                                <Link to="/sign-up" className="ml-1 text-red-600 hover:text-red-700 font-semibold transition">
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

export default ForgotPassword;
