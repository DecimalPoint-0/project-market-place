import React from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebook, faTwitter, faInstagram, faLinkedin } from '@fortawesome/free-brands-svg-icons';
import { faEnvelopeOpen, faPhone, faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons';
import logo from '../../assets/images/logo.png';

function Footer() {
    return (
        <footer className="bg-gradient-primary text-light">
            <div className="container max-w-7xl mx-auto px-8 py-16">
                <div className="grid md:grid-cols-4 gap-8 mb-12">
                    {/* Brand Section */}
                    <div className="flex flex-col space-y-4">
                        <div className="flex items-center gap-3">
                            <img src={logo} className="h-12 w-12 rounded-lg" alt="Project Nexus Logo" /> 
                            <div>
                                <h3 className="font-bold text-xl">Project <span className="text-secondary">Nexus</span></h3>
                                <p className="text-sm text-slate-300">Innovate. Collaborate. Create.</p>
                            </div>
                        </div>
                        <p className="text-slate-300 text-sm leading-relaxed">
                            Your trusted platform for innovative project collaboration. Connect with creators, share knowledge, and bring ideas to life.
                        </p>
                        <div className="flex gap-3 pt-2">
                            <a href="#" className="w-10 h-10 bg-secondary rounded-full flex items-center justify-center text-primary hover:bg-white transition">
                                <FontAwesomeIcon icon={faFacebook} />
                            </a>
                            <a href="#" className="w-10 h-10 bg-secondary rounded-full flex items-center justify-center text-primary hover:bg-white transition">
                                <FontAwesomeIcon icon={faTwitter} />
                            </a>
                            <a href="#" className="w-10 h-10 bg-secondary rounded-full flex items-center justify-center text-primary hover:bg-white transition">
                                <FontAwesomeIcon icon={faInstagram} />
                            </a>
                            <a href="#" className="w-10 h-10 bg-secondary rounded-full flex items-center justify-center text-primary hover:bg-white transition">
                                <FontAwesomeIcon icon={faLinkedin} />
                            </a>
                        </div>
                    </div>

                    {/* Contact Info */}
                    <div className="flex flex-col space-y-6">
                        <h4 className="text-lg font-bold text-secondary">Contact Us</h4>
                        <div className="flex gap-3">
                            <div className="w-10 h-10 rounded-lg bg-secondary bg-opacity-20 flex items-center justify-center flex-shrink-0">
                                <FontAwesomeIcon icon={faEnvelopeOpen} className="text-secondary" />
                            </div>
                            <div className="text-sm">
                                <p className="text-slate-400">Email</p>
                                <a href="mailto:support@codegraphics.com" className="text-light hover:text-secondary transition">support@codegraphics.com</a>
                            </div>
                        </div>
                        <div className="flex gap-3">
                            <div className="w-10 h-10 rounded-lg bg-secondary bg-opacity-20 flex items-center justify-center flex-shrink-0">
                                <FontAwesomeIcon icon={faPhone} className="text-secondary" />
                            </div>
                            <div className="text-sm">
                                <p className="text-slate-400">Phone</p>
                                <a href="tel:09012024759" className="text-light hover:text-secondary transition">+234 (0) 901 202 4759</a>
                            </div>
                        </div>
                        <div className="flex gap-3">
                            <div className="w-10 h-10 rounded-lg bg-secondary bg-opacity-20 flex items-center justify-center flex-shrink-0">
                                <FontAwesomeIcon icon={faMapMarkerAlt} className="text-secondary" />
                            </div>
                            <div className="text-sm">
                                <p className="text-slate-400">Address</p>
                                <p className="text-light">Felele, Lokoja, Kogi State, Nigeria</p>
                            </div>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div className="flex flex-col space-y-4">
                        <h4 className="text-lg font-bold text-secondary">Quick Links</h4>
                        <nav className="flex flex-col space-y-2">
                            <a href="#" className="text-slate-300 hover:text-secondary transition flex items-center gap-2">
                                <i className="fas fa-chevron-right text-xs"></i> About Us
                            </a>
                            <a href="#" className="text-slate-300 hover:text-secondary transition flex items-center gap-2">
                                <i className="fas fa-chevron-right text-xs"></i> Contact Us
                            </a>
                            <a href="#" className="text-slate-300 hover:text-secondary transition flex items-center gap-2">
                                <i className="fas fa-chevron-right text-xs"></i> Privacy Policy
                            </a>
                            <a href="#" className="text-slate-300 hover:text-secondary transition flex items-center gap-2">
                                <i className="fas fa-chevron-right text-xs"></i> Terms & Conditions
                            </a>
                        </nav>
                    </div>

                    {/* Support */}
                    <div className="flex flex-col space-y-4">
                        <h4 className="text-lg font-bold text-secondary">Support</h4>
                        <nav className="flex flex-col space-y-2">
                            <a href="#" className="text-slate-300 hover:text-secondary transition flex items-center gap-2">
                                <i className="fas fa-chevron-right text-xs"></i> Help Center
                            </a>
                            <a href="#" className="text-slate-300 hover:text-secondary transition flex items-center gap-2">
                                <i className="fas fa-chevron-right text-xs"></i> Cookie Policy
                            </a>
                            <a href="#" className="text-slate-300 hover:text-secondary transition flex items-center gap-2">
                                <i className="fas fa-chevron-right text-xs"></i> Booking Policy
                            </a>
                            <a href="#" className="text-slate-300 hover:text-secondary transition flex items-center gap-2">
                                <i className="fas fa-chevron-right text-xs"></i> FAQ
                            </a>
                        </nav>
                    </div>
                </div>

                {/* Divider */}
                <div className="border-t border-slate-700 pt-8">
                    {/* Bottom Content */}
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                        <p className="text-slate-400 text-sm">
                            &copy; 2024 Project Nexuss. All rights reserved.
                        </p>
                        <div className="flex gap-6">
                            <a href="#" className="text-slate-400 hover:text-secondary text-sm transition">Privacy</a>
                            <a href="#" className="text-slate-400 hover:text-secondary text-sm transition">Terms</a>
                            <a href="#" className="text-slate-400 hover:text-secondary text-sm transition">Cookies</a>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}

export default Footer;
