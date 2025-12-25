import React from "react";
import Header from "../partials/Header";
import Footer from "../partials/Footer";
import { Link } from "react-router-dom";
import '@fortawesome/fontawesome-free/css/all.css';

function About() {

    const team = [
        {
            name: "Zubairu Abduljelil",
            role: "Software Engineer",
            bio: "Passionate about building scalable solutions and creating seamless user experiences.",
            icon: "fa-code"
        },
        {
            name: "Yusuf Abdulmalik",
            role: "Software Engineer",
            bio: "Full-stack developer focused on modern web technologies and clean architecture.",
            icon: "fa-laptop"
        }
    ];

    return (
        <>
            <Header />

            {/* Hero Section */}
            <section className="min-h-screen bg-gradient-to-br from-slate-50 to-white flex items-center justify-center px-4 py-12">
                <div className="max-w-6xl mx-auto w-full">
                    <div className="grid md:grid-cols-2 gap-12 lg:gap-16 items-center">
                        <div>
                            <h1 className="text-5xl md:text-6xl font-bold text-primary mb-6 leading-tight">
                                About Our Platform
                            </h1>
                            <p className="text-lg text-slate-600 mb-8 leading-relaxed">
                                We're revolutionizing how students and researchers access quality academic materials. Our mission is to connect scholars with expertly curated project materials and professional resources.
                            </p>
                            <div className="flex gap-4">
                                <Link to="/sign-nup" className="btn px-8 py-3 font-semibold">
                                    Join Us Today
                                </Link>
                                <a href="#mission" className="px-8 py-3 border-2 border-primary text-primary rounded-lg font-semibold hover:bg-primary hover:text-white transition">
                                    Learn More
                                </a>
                            </div>
                        </div>
                        <div className="flex justify-center">
                            <div className="w-80 h-80 bg-gradient-primary rounded-2xl flex items-center justify-center text-white">
                                <i className="fas fa-book-open text-8xl opacity-20"></i>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Mission & Vision Section */}
            <section id="mission" className="py-24 px-4 md:px-8 bg-white">
                <div className="max-w-7xl mx-auto">
                    <div className="grid md:grid-cols-2 gap-12 lg:gap-16">
                        {/* Mission */}
                        <div className="bg-gradient-to-br from-slate-50 to-white rounded-2xl p-12 border border-slate-200">
                            <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600 text-2xl mb-6">
                                <i className="fas fa-target"></i>
                            </div>
                            <h2 className="text-3xl font-bold text-primary mb-6">Our Mission</h2>
                            <p className="text-slate-600 mb-6 leading-relaxed text-lg">
                                To empower students and researchers by providing access to high-quality academic materials, expert guidance, and a vibrant community of scholars working towards excellence.
                            </p>
                            <ul className="space-y-3">
                                <li className="flex gap-3 items-start">
                                    <i className="fas fa-check text-primary text-xl mt-0.5"></i>
                                    <span className="text-slate-600">Provide affordable access to premium materials</span>
                                </li>
                                <li className="flex gap-3 items-start">
                                    <i className="fas fa-check text-primary text-xl mt-0.5"></i>
                                    <span className="text-slate-600">Support academic excellence and innovation</span>
                                </li>
                                <li className="flex gap-3 items-start">
                                    <i className="fas fa-check text-primary text-xl mt-0.5"></i>
                                    <span className="text-slate-600">Build a trusted platform for innovative projects</span>
                                </li>
                            </ul>
                        </div>

                        {/* Vision */}
                        <div className="bg-gradient-to-br from-slate-50 to-white rounded-2xl p-12 border border-slate-200">
                            <div className="w-14 h-14 bg-green-100 rounded-xl flex items-center justify-center text-green-600 text-2xl mb-6">
                                <i className="fas fa-eye"></i>
                            </div>
                            <h2 className="text-3xl font-bold text-primary mb-6">Our Vision</h2>
                            <p className="text-slate-600 mb-6 leading-relaxed text-lg">
                                To become the world's leading platform connecting academic excellence with opportunity, where every student has access to quality materials and every researcher can monetize their expertise.
                            </p>
                            <ul className="space-y-3">
                                <li className="flex gap-3 items-start">
                                    <i className="fas fa-check text-primary text-xl mt-0.5"></i>
                                    <span className="text-slate-600">Global accessibility to academic resources</span>
                                </li>
                                <li className="flex gap-3 items-start">
                                    <i className="fas fa-check text-primary text-xl mt-0.5"></i>
                                    <span className="text-slate-600">Empowering researchers worldwide</span>
                                </li>
                                <li className="flex gap-3 items-start">
                                    <i className="fas fa-check text-primary text-xl mt-0.5"></i>
                                    <span className="text-slate-600">Creating sustainable income opportunities</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            {/* Team Section */}
            <section className="py-24 px-4 md:px-8 bg-slate-50">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-5xl font-bold text-primary mb-4">Our Team</h2>
                        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                            Passionate individuals dedicated to transforming academic excellence
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-12">
                        {team.map((member, idx) => (
                            <div key={idx} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-200 hover:shadow-lg transition">
                                <div className="bg-gradient-primary h-32 flex items-end justify-center pb-8">
                                    <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center text-primary text-4xl border-4 border-white">
                                        <i className={`fas ${member.icon}`}></i>
                                    </div>
                                </div>
                                <div className="p-8 pt-6 text-center">
                                    <h3 className="text-2xl font-bold text-primary mb-1">{member.name}</h3>
                                    <p className="text-primary font-semibold mb-4">{member.role}</p>
                                    <p className="text-slate-600 leading-relaxed mb-6">{member.bio}</p>
                                    <div className="flex justify-center gap-3">
                                        <a href="#" className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center hover:bg-blue-600 hover:text-white transition">
                                            <i className="fab fa-facebook"></i>
                                        </a>
                                        <a href="#" className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center hover:bg-blue-600 hover:text-white transition">
                                            <i className="fab fa-twitter"></i>
                                        </a>
                                        <a href="#" className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center hover:bg-blue-600 hover:text-white transition">
                                            <i className="fab fa-linkedin"></i>
                                        </a>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Values Section */}
            <section className="py-24 px-4 md:px-8 bg-white">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-5xl font-bold text-primary mb-4">Our Core Values</h2>
                        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                            Guiding principles that shape everything we do
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            { icon: "fa-heart", title: "Integrity", desc: "We believe in honest, transparent dealings with all our users and stakeholders." },
                            { icon: "fa-handshake", title: "Trust", desc: "Building reliable relationships through consistent delivery and quality standards." },
                            { icon: "fa-bolt", title: "Excellence", desc: "Continuously striving for the highest standards in everything we do." },
                            { icon: "fa-users", title: "Community", desc: "Fostering a collaborative environment where everyone can thrive." },
                            { icon: "fa-lightbulb", title: "Innovation", desc: "Embracing new ideas and technologies to improve our platform." },
                            { icon: "fa-shield-alt", title: "Security", desc: "Protecting user data and privacy with industry-leading standards." }
                        ].map((value, idx) => (
                            <div key={idx} className="text-center p-8 rounded-2xl bg-slate-50 border border-slate-200 hover:border-primary hover:shadow-lg transition">
                                <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-3xl mx-auto mb-4">
                                    <i className={`fas ${value.icon}`}></i>
                                </div>
                                <h3 className="text-xl font-bold text-primary mb-3">{value.title}</h3>
                                <p className="text-slate-600 leading-relaxed">{value.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Contact Section */}
            <section className="py-24 px-4 md:px-8 bg-gradient-to-br from-slate-50 to-white">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-5xl font-bold text-primary mb-4">Get In Touch</h2>
                        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                            Have questions? We'd love to hear from you. Send us a message anytime.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-12">
                        {/* Contact Form */}
                        <form className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200">
                            <div className="mb-6">
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                    <i className="fas fa-user mr-2 text-primary"></i>Full Name
                                </label>
                                <input 
                                    type="text" 
                                    placeholder="Your name"
                                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition"
                                />
                            </div>
                            
                            <div className="mb-6">
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                    <i className="fas fa-envelope mr-2 text-primary"></i>Email Address
                                </label>
                                <input 
                                    type="email" 
                                    placeholder="your@email.com"
                                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition"
                                />
                            </div>

                            <div className="mb-6">
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                    <i className="fas fa-heading mr-2 text-primary"></i>Subject
                                </label>
                                <input 
                                    type="text" 
                                    placeholder="What's this about?"
                                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition"
                                />
                            </div>

                            <div className="mb-6">
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                    <i className="fas fa-message mr-2 text-primary"></i>Message
                                </label>
                                <textarea 
                                    placeholder="Your message..."
                                    rows="5"
                                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition resize-none"
                                ></textarea>
                            </div>

                            <button type="submit" className="w-full bg-primary hover:bg-primary/90 text-white font-semibold py-3 rounded-lg transition">
                                <i className="fas fa-paper-plane mr-2"></i>Send Message
                            </button>
                        </form>

                        {/* Contact Info */}
                        <div className="space-y-8">
                            <div className="bg-white rounded-2xl p-8 border border-slate-200">
                                <div className="flex gap-4 items-start">
                                    <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center flex-shrink-0 text-xl">
                                        <i className="fas fa-map-marker-alt"></i>
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-primary mb-2">Location</h3>
                                        <p className="text-slate-600">Ondo State, Nigeria</p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white rounded-2xl p-8 border border-slate-200">
                                <div className="flex gap-4 items-start">
                                    <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center flex-shrink-0 text-xl">
                                        <i className="fas fa-envelope"></i>
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-primary mb-2">Email</h3>
                                        <p className="text-slate-600">support@projectnexus.com</p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white rounded-2xl p-8 border border-slate-200">
                                <div className="flex gap-4 items-start">
                                    <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center flex-shrink-0 text-xl">
                                        <i className="fas fa-phone"></i>
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-primary mb-2">Phone</h3>
                                        <p className="text-slate-600">+234 (0) 901 234 5678</p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-gradient-primary text-white rounded-2xl p-8">
                                <h3 className="font-bold mb-4 text-lg">Follow Us</h3>
                                <div className="flex gap-3">
                                    <a href="#" className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center text-lg hover:bg-white/30 transition">
                                        <i className="fab fa-facebook"></i>
                                    </a>
                                    <a href="#" className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center text-lg hover:bg-white/30 transition">
                                        <i className="fab fa-twitter"></i>
                                    </a>
                                    <a href="#" className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center text-lg hover:bg-white/30 transition">
                                        <i className="fab fa-linkedin"></i>
                                    </a>
                                    <a href="#" className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center text-lg hover:bg-white/30 transition">
                                        <i className="fab fa-instagram"></i>
                                    </a>
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

export default About;
