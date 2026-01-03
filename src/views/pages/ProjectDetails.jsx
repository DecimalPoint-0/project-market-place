import React, { useState, useEffect } from "react";
import Header from "../partials/Header";
import Footer from "../partials/Footer";
import { Link, useParams } from "react-router-dom";
import { Button } from "@material-tailwind/react";
import apiInstance from "../../utils/axios";
import mammoth from "mammoth";
import Toast from "../../plugin/Toast"
import Cookies from 'js-cookie';
import useUserData from '../../plugin/useUserData'
import Loader from "../../components/Loader";

function ProjectDetails() {

    const [project, setProject] = useState([]);
    const [tableContent, setTableContent] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [pageLoading, setPageLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [email, setEmail] = useState("");
    const [relatedProjects, setRelatedProjects] = useState([]);
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [paymentEmail, setPaymentEmail] = useState("");
    const [paymentUrl, setPaymentUrl] = useState("");
    const userData = useUserData();

    // Load Paystack script
    useEffect(() => {
        const script = document.createElement('script');
        script.src = 'https://js.paystack.co/v1/inline.js';
        document.body.appendChild(script);
        return () => {
            document.body.removeChild(script);
        };
    }, []);

    const initiatePayment = async (e) => {
        e.preventDefault();
        try {
            setIsLoading(true);
            const formData = new FormData();
            const userEmail = userData?.email || email;
            
            if (!userEmail) {
                Toast("error", "Email is required.");
                setIsLoading(false);
                return;
            }
            
            setPaymentEmail(userEmail);
            formData.append("email", userEmail);
            
            const response = await apiInstance.post(`projects/${project.id}/initiatepayment`, formData,
                { headers: { "Content-Type": "multipart/form-data"}}
            );
            
            // Get authorization URL from response
            const authUrl = response.data.data.authorization_url;
            
            if (authUrl) {
                setPaymentUrl(authUrl);
                Toast("success", "Opening Paystack payment page...");
            } else {
                throw new Error("No authorization URL received");
            }
            
        } catch (error) {
            console.error("Payment error:", error);
            Toast("error", "Unable to initiate payment. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const param = useParams();

    const fetchProject = async () => {
        try {
            setPageLoading(true);
            const response = await apiInstance.get(`projects/${param.id}`);
            setProject(response.data);
    
            // if (response.data.table_of_content) {
            //     const fileResponse = await apiInstance.get(response.data.table_of_content, {
            //         responseType: "arraybuffer",
            //     });
    
            //     mammoth.convertToHtml({ arrayBuffer: fileResponse.data })
            //         .then((result) => {
            //             setTableContent(result.value);
            //         })
            //         .catch((error) => {
            //             console.error("Error extracting text from DOCX:", error);
            //     });
            // }

            // Fetch related projects (same level)
            try {
                const relatedResponse = await apiInstance.get(`projects?level=${response.data.level}&exclude=${param.id}`);
                setRelatedProjects(relatedResponse.data.results?.slice(0, 5) || []);
            } catch (err) {
                console.log(err);
            }
        } catch (error) {
            console.error("Error fetching project:", error);
            Toast("error", "Failed to load project details");
        } finally {
            setPageLoading(false);
        }
    };

    useEffect(() => {
        fetchProject()
    }, [param.id])

    if (pageLoading) {
        return <Loader />;
    }

    return (
        <>
            {/* Payment Modal */}
            {showPaymentModal && !paymentUrl && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-auto p-6 md:p-8">
                        <h2 className="text-xl md:text-2xl font-bold text-primary mb-4">
                            <i className="fas fa-credit-card mr-2"></i>Complete Payment
                        </h2>
                        <form onSubmit={initiatePayment} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                    Email Address
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    placeholder="Enter your email"
                                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                                    value={userData?.email || paymentEmail}
                                    onChange={(e) => setPaymentEmail(e.target.value)}
                                    required
                                    disabled={!!userData?.email}
                                />
                            </div>
                            <div className="bg-slate-50 p-4 rounded-lg">
                                <p className="text-slate-600 text-sm mb-1">Amount to Pay</p>
                                <p className="text-2xl md:text-3xl font-bold text-primary">₦{project?.price?.toLocaleString() || '0'}</p>
                            </div>
                            <div className="flex flex-col sm:flex-row gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowPaymentModal(false);
                                        setPaymentUrl("");
                                    }}
                                    className="flex-1 px-4 py-3 border border-slate-300 text-slate-700 font-semibold rounded-lg hover:bg-slate-50 transition text-sm md:text-base"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="flex-1 px-4 py-3 bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white font-semibold rounded-lg transition flex items-center justify-center gap-2 text-sm md:text-base"
                                >
                                    {isLoading ? (
                                        <>
                                            <i className="fas fa-spinner fa-spin"></i> Processing...
                                        </>
                                    ) : (
                                        <>
                                            <i className="fas fa-lock"></i> Pay Securely
                                        </>
                                    )}
                                </button>
                            </div>
                            <p className="text-xs text-slate-500 text-center">
                                <i className="fas fa-lock mr-1"></i>Secure payment powered by Paystack
                            </p>
                        </form>
                    </div>
                </div>
            )}

            {/* Paystack Checkout Modal */}
            {paymentUrl && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl h-[90vh] flex flex-col mx-4 overflow-hidden">
                        <div className="flex items-center justify-between p-4 border-b border-slate-200">
                            <h2 className="text-lg font-bold text-primary">
                                <i className="fas fa-credit-card mr-2"></i>Complete Payment
                            </h2>
                            <button
                                onClick={() => {
                                    setPaymentUrl("");
                                    setShowPaymentModal(false);
                                }}
                                className="text-slate-500 hover:text-slate-700 text-2xl leading-none"
                            >
                                ×
                            </button>
                        </div>
                        <iframe
                            src={paymentUrl}
                            title="Paystack Payment"
                            className="flex-1 w-full border-0"
                        />
                        <div className="border-t border-slate-200 p-4 bg-slate-50 flex gap-3">
                            <button
                                onClick={() => {
                                    setPaymentUrl("");
                                    setShowPaymentModal(false);
                                }}
                                className="flex-1 px-4 py-3 border border-slate-300 text-slate-700 font-semibold rounded-lg hover:bg-white transition"
                            >
                                <i className="fas fa-times mr-2"></i>Cancel
                            </button>
                            <button
                                onClick={() => {
                                    setShowSuccessModal(true);
                                    setPaymentUrl("");
                                    setShowPaymentModal(false);
                                }}
                                className="flex-1 px-4 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition flex items-center justify-center gap-2"
                            >
                                <i className="fas fa-check"></i> Payment Complete
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Success Modal */}
            {showSuccessModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-auto p-6 md:p-8 text-center">
                        <div className="mb-6">
                            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                                <i className="fas fa-check text-3xl text-green-600"></i>
                            </div>
                        </div>
                        <h2 className="text-2xl md:text-3xl font-bold text-slate-800 mb-3">
                            Thank You!
                        </h2>
                        <p className="text-slate-600 text-base md:text-lg mb-2">
                            Your payment has been received successfully
                        </p>
                        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 my-6 rounded text-left">
                            <p className="text-slate-700 text-sm">
                                <i className="fas fa-info-circle text-blue-600 mr-2"></i>
                                We are processing your request. The project file will be sent to <strong>{paymentEmail}</strong> shortly.
                            </p>
                        </div>
                        <p className="text-slate-600 text-xs md:text-sm mb-6">
                            Please check your email (including spam folder) for your download link and receipt.
                        </p>
                        <button
                            onClick={() => {
                                setShowSuccessModal(false);
                                setPaymentUrl("");
                                setShowPaymentModal(false);
                                window.location.href = '/dashboard/';
                            }}
                            className="w-full px-4 py-3 bg-primary text-white font-semibold rounded-lg hover:bg-primary/90 transition flex items-center justify-center gap-2 text-sm md:text-base"
                        >
                            <i className="fas fa-home"></i> Back to Dashboard
                        </button>
                    </div>
                </div>
            )}

            <Header />
            
            {/* Hero Section with Project Cover */}
            <section className="bg-gradient-to-r from-primary to-primary/80 text-white py-8 md:py-12 px-4 md:px-8">
                <div className="container max-w-7xl mx-auto">
                    <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 items-start">
                        {/* Project Icon */}
                        <div className="w-20 h-20 md:w-24 md:h-24 bg-white/20 rounded-xl flex items-center justify-center text-4xl md:text-5xl flex-shrink-0">
                            <i className="fas fa-file-pdf"></i>
                        </div>
                        
                        {/* Project Header Info */}
                        <div className="flex-1 min-w-0">
                            <div className="mb-2">
                                <span className="inline-block px-3 py-1 bg-white/20 rounded-full text-xs md:text-sm font-semibold mb-3">
                                    <i className="fas fa-layer-group mr-2"></i>{project?.level}
                                </span>
                                <span className="ml-2 inline-block px-3 py-1 bg-white/20 rounded-full text-xs md:text-sm font-semibold mb-3">
                                    <i className="fas fa-check mr-2"></i>{project?.status}
                                </span>
                            </div>
                            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-3 leading-tight">{project?.title}</h1>
                            <p className="text-white/80 text-sm md:text-lg mb-4">by <strong>{project?.author_name}</strong></p>
                            <div className="flex flex-wrap gap-4 text-xs md:text-sm">
                                <span><i className="fas fa-eye mr-2"></i>{project?.views || 0} Views</span>
                                <span><i className="fas fa-heart text-red-300 mr-2"></i>{project?.like || 0} Likes</span>
                                <span><i className="fas fa-thumbs-down text-red-300 mr-2"></i>{project?.dislikes || 0} Dislikes</span>
                                <span><i className="fas fa-folder mr-2"></i>{project?.category}</span>
                            </div>
                        </div>

                        {/* Quick Purchase Card */}
                        <div className="bg-white text-slate-800 rounded-xl p-6 w-full sm:w-80 flex-shrink-0 shadow-lg">
                            <p className="text-slate-600 text-sm mb-2">Project Price</p>
                            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-6">₦{project?.price?.toLocaleString() || '0'}</h2>
                            <div className="space-y-3">
                                {!userData && (
                                    <input
                                        type="email"
                                        name="email"
                                        placeholder="Enter your email"
                                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                )}
                                <button
                                    type="button"
                                    onClick={() => {
                                        if (!userData && !email) {
                                            Toast("error", "Please enter your email");
                                            return;
                                        }
                                        setPaymentEmail(userData?.email || email);
                                        setShowPaymentModal(true);
                                    }}
                                    className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg transition flex items-center justify-center gap-2 text-sm md:text-base"
                                >
                                    <i className="fas fa-shopping-cart"></i> Purchase Now
                                </button>
                            </div>
                            <p className="text-xs text-slate-500 mt-3 text-center">
                                <i className="fas fa-lock mr-1"></i>Secure payment powered by Paystack
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Main Content */}
            <section className="py-8 md:py-12 px-4 md:px-8 bg-slate-50">
                <div className="container max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
                        
                        {/* Main Content Area */}
                        <div className="lg:col-span-2 space-y-6">
                            
                            {/* Project Specs */}
                            <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-4 md:p-6">
                                <h2 className="text-xl md:text-2xl font-bold text-primary mb-6">
                                    <i className="fas fa-info-circle mr-2"></i>Project Specifications
                                </h2>
                                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                                    <div className="text-center p-3 md:p-4 bg-slate-50 rounded-lg">
                                        <i className="fas fa-file text-2xl md:text-3xl text-primary mb-2"></i>
                                        <p className="text-slate-600 text-xs md:text-sm mb-1">Format</p>
                                        <p className="font-semibold text-slate-800 text-xs md:text-sm">PDF</p>
                                    </div>
                                    <div className="text-center p-3 md:p-4 bg-slate-50 rounded-lg">
                                        <i className="fas fa-graduation-cap text-2xl md:text-3xl text-primary mb-2"></i>
                                        <p className="text-slate-600 text-xs md:text-sm mb-1">Level</p>
                                        <p className="font-semibold text-slate-800 text-xs md:text-sm">{project?.level}</p>
                                    </div>
                                    <div className="text-center p-3 md:p-4 bg-slate-50 rounded-lg">
                                        <i className="fas fa-list text-2xl md:text-3xl text-primary mb-2"></i>
                                        <p className="text-slate-600 text-xs md:text-sm mb-1">Category</p>
                                        <p className="font-semibold text-slate-800 text-xs md:text-sm truncate">{project?.category}</p>
                                    </div>
                                    <div className="text-center p-3 md:p-4 bg-slate-50 rounded-lg">
                                        <i className="fas fa-check-circle text-2xl md:text-3xl text-green-600 mb-2"></i>
                                        <p className="text-slate-600 text-xs md:text-sm mb-1">Status</p>
                                        <p className="font-semibold text-slate-800 text-xs md:text-sm">{project?.status}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Project Description */}
                            <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-4 md:p-6">
                                <h2 className="text-xl md:text-2xl font-bold text-primary mb-4">
                                    <i className="fas fa-file-alt mr-2"></i>Project Description
                                </h2>
                                <p className="text-slate-700 text-sm md:text-base leading-relaxed whitespace-pre-line mb-6">
                                    {project?.description}
                                </p>
                            </div>

                            {/* Content Preview */}
                            {tableContent && (
                                <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-4 md:p-6">
                                    <h2 className="text-xl md:text-2xl font-bold text-primary mb-6">
                                        <i className="fas fa-list-check mr-2"></i>Table of Contents Preview
                                    </h2>
                                    <div
                                        className="max-h-96 overflow-y-auto p-4 md:p-6 bg-white border-2 border-slate-200 rounded-lg text-sm md:text-base"
                                        style={{
                                            whiteSpace: "pre-wrap",
                                            wordWrap: "break-word",
                                            fontFamily: "'Times New Roman', Times, serif",
                                            lineHeight: "1.6",
                                            color: "#1f2937",
                                            letterSpacing: "0.3px"
                                        }}
                                        dangerouslySetInnerHTML={{__html: tableContent}}
                                    />
                                    <p className="text-slate-600 text-sm mt-4">
                                        <i className="fas fa-lock mr-2 text-amber-600"></i>
                                        Full content available after purchase
                                    </p>
                                </div>
                            )}

                            {/* Author Info */}
                            <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-4 md:p-6">
                                <h2 className="text-xl md:text-2xl font-bold text-primary mb-6">
                                    <i className="fas fa-user-circle mr-2"></i>About the Author
                                </h2>
                                <div className="flex flex-col sm:flex-row gap-4 items-start">
                                    <div className="w-14 h-14 md:w-16 md:h-16 bg-gradient-primary rounded-full flex items-center justify-center text-white text-2xl md:text-3xl flex-shrink-0">
                                        <i className="fas fa-user"></i>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-bold text-base md:text-lg text-slate-800 mb-2">{project?.author_name}</h3>
                                        <p className="text-slate-600 text-sm md:text-base mb-3">Verified contributor with multiple high-quality projects on the platform.</p>
                                        <div className="flex flex-wrap gap-3 text-xs md:text-sm">
                                            <span className="flex items-center gap-1 text-slate-600">
                                                <i className="fas fa-check-circle text-green-600"></i> Verified Author
                                            </span>
                                            <span className="flex items-center gap-1 text-slate-600">
                                                <i className="fas fa-star text-amber-500"></i> Top Rated
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>

                        {/* Sidebar */}
                        <div className="space-y-6">
                            
                            {/* Quick Stats */}
                            <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-4 md:p-6">
                                <h3 className="font-bold text-base md:text-lg text-primary mb-4">
                                    <i className="fas fa-chart-bar mr-2"></i>Project Stats
                                </h3>
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center pb-4 border-b border-slate-200">
                                        <span className="text-slate-600 text-sm md:text-base">Total Views</span>
                                        <span className="font-bold text-slate-800 text-sm md:text-base">{project?.views || 0}</span>
                                    </div>
                                    <div className="flex justify-between items-center pb-4 border-b border-slate-200">
                                        <span className="text-slate-600 text-sm md:text-base">Total Likes</span>
                                        <span className="font-bold text-slate-800 text-sm md:text-base">{project?.like || 0}</span>
                                    </div>
                                    <div className="flex justify-between items-center pb-4 border-b border-slate-200">
                                        <span className="text-slate-600 text-sm md:text-base">Total Dislikes</span>
                                        <span className="font-bold text-slate-800 text-sm md:text-base">{project?.dislikes || 0}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-slate-600 text-sm md:text-base">Rating</span>
                                        <span className="flex gap-1">
                                            {[...Array(5)].map((_, i) => (
                                                <i key={i} className="fas fa-star text-amber-400 text-xs md:text-sm"></i>
                                            ))}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Related Projects */}
                            {relatedProjects.length > 0 && (
                                <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-4 md:p-6">
                                    <h3 className="font-bold text-base md:text-lg text-primary mb-4">
                                        <i className="fas fa-link mr-2"></i>Related Projects
                                    </h3>
                                    <div className="space-y-3">
                                        {relatedProjects.map((project) => (
                                            <Link
                                                key={project.id}
                                                to={`/projects/${project.id}`}
                                                className="block p-3 bg-slate-50 rounded-lg border border-slate-200 text-slate-700 text-xs md:text-sm font-medium truncate hover:bg-slate-100 transition"
                                            >
                                                <i className="fas fa-bookmark text-primary mr-2"></i>
                                                {project.title}
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Share Project */}
                            <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-4 md:p-6">
                                <h3 className="font-bold text-base md:text-lg text-primary mb-4">
                                    <i className="fas fa-share-alt mr-2"></i>Share Project
                                </h3>
                                <div className="flex gap-2">
                                    <button className="flex-1 py-2 bg-blue-600 text-white rounded-lg text-xs md:text-sm font-semibold hover:bg-blue-700 transition">
                                        <i className="fab fa-facebook mr-1"></i>Facebook
                                    </button>
                                    <button className="flex-1 py-2 bg-blue-400 text-white rounded-lg text-xs md:text-sm font-semibold hover:bg-blue-500 transition">
                                        <i className="fab fa-twitter mr-1"></i>Twitter
                                    </button>
                                    <button className="flex-1 py-2 bg-red-600 text-white rounded-lg text-xs md:text-sm font-semibold hover:bg-red-700 transition">
                                        <i className="fas fa-envelope mr-1"></i>Email
                                    </button>
                                </div>
                            </div>

                        </div>

                    </div>
                </div>
            </section>

            <Footer />
        </>
    );

}

export default ProjectDetails;