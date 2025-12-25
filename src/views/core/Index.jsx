import React, { useState, useEffect } from "react";
import Header from "../partials/Header";
import Footer from "../partials/Footer";
import { Link } from "react-router-dom";
import '@fortawesome/fontawesome-free/css/all.css';
import apiInstance from "../../utils/axios";
import Toast from "../../plugin/Toast";

function Index() {

    const [categories, setCategories] = useState([])
    const [faqs, setFaqs] = useState([])
    const [categoryPagination, setCategoryPagination] = useState({ next: null, previous: null });
    const [faqsPagination, setFaqsPagination] = useState({ next: null, previous: null });
    const [loading, setLoading] = useState(false);

    const fetchData = async (categoryUrl = "/categories", faqsUrl = "/faqs") => {
        setLoading(true);
        try {
            const [categoryResponse, faqsResponse] = await Promise.all([
                apiInstance.get(categoryUrl),
                apiInstance.get(faqsUrl),
            ]);

            setCategories(categoryResponse.data.results || categoryResponse.data);
            setCategoryPagination({
                next: categoryResponse.data.next,
                previous: categoryResponse.data.previous,
            });

            setFaqs(faqsResponse.data.results || faqsResponse.data);
            setFaqsPagination({
                next: faqsResponse.data.next,
                previous: faqsResponse.data.previous,
            });
        } catch (error) {
            console.log(error);
            Toast("error", error.response?.data?.message || "An error occurred");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData()
    }, [])

    return (
        <>
            <Header />

            {/* Hero Section */}
            <section className="hero min-h-screen flex items-center justify-center relative overflow-hidden bg-gradient-to-br from-slate-50 via-white to-slate-50">
                <div className="absolute inset-0 opacity-5">
                    <div className="absolute top-20 left-10 w-96 h-96 bg-primary rounded-full mix-blend-multiply filter blur-3xl"></div>
                    <div className="absolute bottom-20 right-10 w-96 h-96 bg-slate-400 rounded-full mix-blend-multiply filter blur-3xl"></div>
                </div>

                <div className="hero-content container max-w-6xl mx-auto px-8 text-center z-10 animate-slideUp">
                    <h1 className="text-5xl md:text-6xl font-bold text-light mb-6 leading-tight">
                        Access Premium <span className="text-secondary">Project Materials</span>
                    </h1>
                    <p className="text-xl text-slate-200 mb-8 max-w-3xl mx-auto">
                        Elevate your academic projects with professionally curated research materials. Connect with expert researchers and get your thesis topics solved.
                    </p>
                    <div className="flex flex-col md:flex-row gap-4 justify-center">
                        <Link to="/sign-up/" className="btn px-8 py-4 text-lg">Get Started Now</Link>
                        <a href="#categories" className="btn-outline px-8 py-4 text-lg">Explore Categories</a>
                    </div>
                </div>
            </section>

            {/* Main Content */}
            <section className="py-24 px-4 md:px-8 bg-white">
                <div className="container max-w-7xl mx-auto">
                    
                    {/* Categories Section */}
                    <div id="categories" className="mb-32">
                        <div className="text-center mb-16">
                            <h2 className="text-4xl md:text-5xl font-bold text-primary mb-4">
                                Browse Categories
                            </h2>
                            <p className="text-slate-600 text-lg max-w-2xl mx-auto">
                                Explore project materials across multiple disciplines and find exactly what you need
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-12">
                            {categories?.map((cat) => (
                                <Link 
                                    key={cat?.id}
                                    to={`/categories/${cat?.id}`}
                                    className="bg-white border border-slate-200 rounded-xl p-8"
                                >
                                    <div className="flex items-start justify-between mb-6">
                                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center text-primary">
                                            <i className="fas fa-folder"></i>
                                        </div>
                                        <span className="bg-blue-100 text-primary px-3 py-1 rounded-full text-sm font-semibold">
                                            {cat?.project_count ?? 0}
                                        </span>
                                    </div>
                                    <h3 className="text-xl font-bold text-primary mb-3">
                                        {cat?.title}
                                    </h3>
                                    <p className="text-slate-600 mb-6">
                                        {cat?.project_count ?? 0} Projects Available
                                    </p>
                                    <div className="flex items-center text-primary font-semibold">
                                        <span>View All</span>
                                        <i className="fas fa-arrow-right ml-2"></i>
                                    </div>
                                </Link>
                            ))}
                        </div>

                        {/* Pagination */}
                        {(categoryPagination.previous || categoryPagination.next) && (
                            <div className="flex justify-center gap-4">
                                <button
                                    onClick={() => fetchData(categoryPagination.previous, "/faqs")}
                                    disabled={!categoryPagination.previous}
                                    className="px-6 py-2 border border-slate-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <i className="fas fa-chevron-left mr-2"></i> Previous
                                </button>
                                <button
                                    onClick={() => fetchData(categoryPagination.next, "/faqs")}
                                    disabled={!categoryPagination.next}
                                    className="px-6 py-2 border border-slate-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Next <i className="fas fa-chevron-right ml-2"></i>
                                </button>
                            </div>
                        )}
                    </div>

                    {/* How It Works Section */}
                    <div className="mb-32 py-16">
                        <div className="text-center mb-16">
                            <h2 className="text-4xl md:text-5xl font-bold text-primary mb-4">
                                How It Works
                            </h2>
                            <p className="text-slate-600 text-lg max-w-2xl mx-auto">
                                Simple steps to get started with our platform
                            </p>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                            {[
                                { num: 1, title: "Browse Topics", desc: "Explore our extensive collection of project materials" },
                                { num: 2, title: "Get Approved", desc: "Submit your choice to your supervisor for approval" },
                                { num: 3, title: "Purchase", desc: "Secure payment and instant access to materials" },
                                { num: 4, title: "Succeed", desc: "Complete your project with confidence" }
                            ].map((step) => (
                                <div key={step.num} className="text-center">
                                    <div className="w-16 h-16 bg-blue-100 text-primary rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6">
                                        {step.num}
                                    </div>
                                    <h3 className="font-bold text-primary text-lg mb-3">{step.title}</h3>
                                    <p className="text-slate-600 leading-relaxed">{step.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* For Researchers Section */}
                    <div className="mb-32 bg-gradient-primary text-white rounded-2xl p-16">
                        <div className="grid md:grid-cols-2 gap-16 items-center">
                            <div>
                                <h2 className="text-4xl md:text-5xl font-bold mb-6">Earn with Your Expertise</h2>
                                <p className="text-lg mb-10 text-slate-100 leading-relaxed">
                                    Turn your research into income. Share your materials and earn commissions every time they're purchased.
                                </p>
                                <div className="space-y-4 mb-10">
                                    <div className="flex gap-3 items-start">
                                        <i className="fas fa-check text-blue-200 text-xl mt-1"></i>
                                        <span className="text-lg">Register for free</span>
                                    </div>
                                    <div className="flex gap-3 items-start">
                                        <i className="fas fa-check text-blue-200 text-xl mt-1"></i>
                                        <span className="text-lg">Get verified by our team</span>
                                    </div>
                                    <div className="flex gap-3 items-start">
                                        <i className="fas fa-check text-blue-200 text-xl mt-1"></i>
                                        <span className="text-lg">Upload your materials</span>
                                    </div>
                                    <div className="flex gap-3 items-start">
                                        <i className="fas fa-check text-blue-200 text-xl mt-1"></i>
                                        <span className="text-lg">Earn lifetime commissions</span>
                                    </div>
                                </div>
                                <Link to="/sign-up/" className="inline-block bg-white text-primary px-8 py-3 rounded-lg font-semibold">
                                    Start Earning
                                </Link>
                            </div>
                            <div className="text-center">
                                <div className="w-48 h-48 bg-white/10 rounded-full flex items-center justify-center mx-auto">
                                    <i className="fas fa-money-bill-wave text-7xl opacity-20"></i>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* FAQs Section */}
                    <div className="mb-32">
                        <div className="text-center mb-16">
                            <h2 className="text-4xl md:text-5xl font-bold text-primary mb-4">
                                Frequently Asked Questions
                            </h2>
                            <p className="text-slate-600 text-lg max-w-2xl mx-auto">
                                Find answers to common questions about our platform
                            </p>
                        </div>

                        <div className="space-y-4 mb-12">
                            {faqs?.map((f, idx) => (
                                <div key={idx} className="bg-white border border-slate-200 rounded-xl p-8">
                                    <div className="flex gap-4">
                                        <div className="flex-shrink-0">
                                            <i className="fas fa-question-circle text-primary text-2xl"></i>
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="font-bold text-primary text-lg mb-2">
                                                {f?.question}
                                            </h3>
                                            <p className="text-slate-600 leading-relaxed">
                                                {f?.answer}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* FAQ Pagination */}
                        {(faqsPagination.previous || faqsPagination.next) && (
                            <div className="flex justify-center gap-4">
                                <button
                                    onClick={() => fetchData("/categories", faqsPagination.previous)}
                                    disabled={!faqsPagination.previous}
                                    className="px-6 py-2 border border-slate-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <i className="fas fa-chevron-left mr-2"></i> Previous
                                </button>
                                <button
                                    onClick={() => fetchData("/categories", faqsPagination.next)}
                                    disabled={!faqsPagination.next}
                                    className="px-6 py-2 border border-slate-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Next <i className="fas fa-chevron-right ml-2"></i>
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Hire a Writer Section */}
                    <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-2xl overflow-hidden p-12 md:p-16">
                        <div className="grid md:grid-cols-2 gap-12 items-center">
                            <div>
                                <h2 className="text-4xl md:text-5xl font-bold mb-6">
                                    Need Custom Work?
                                </h2>
                                <p className="text-lg text-slate-200 mb-8 leading-relaxed">
                                    Can't find what you're looking for? Connect with our network of professional writers to create custom content tailored to your specific needs.
                                </p>
                                <button className="bg-white text-slate-900 px-8 py-3 rounded-lg font-semibold hover:shadow-lg transition">
                                    <i className="fas fa-pen-fancy mr-2"></i>Hire a Writer
                                </button>
                            </div>
                            <div className="text-center">
                                <div className="inline-block bg-white/10 rounded-2xl p-12">
                                    <i className="fas fa-file-alt text-6xl text-white/30"></i>
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

export default Index;