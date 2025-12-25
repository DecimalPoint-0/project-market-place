import React, { useState } from "react";
import { Link } from "react-router-dom";
import logo from '../../assets/images/logo.png';

function Header() {

    const NavLinks = () => {
        return (
            <>
                <li className="navitem"><Link className="active" to='/dashboard/'>Home</Link></li>
                <li className="navitem"><Link to='/projects/' >Projects</Link></li>
                <li className="navitem"><Link to="/about-us/" >About Us</Link></li>
                <li className="navitem"><Link to="/sign-in/">Sign in</Link></li>
                <li className="navitem">
                    <Link to="/sign-up/" className="btn px-4 py-2 text-sm">Sign Up</Link>
                </li>
            </>
        )
    }

    const [ isOpen, setIsOpen ] = useState(false)

    const toggleNavbar = () => {
        setIsOpen(!isOpen);
    }

    return (
        <>
            <header className="navbar">
                <div className="flex justify-between items-center p-4 container mx-auto max-w-7xl">
                    <Link to="/" className="flex justify-between items-center space-x-3 group">
                        <div className="relative">
                            <img className="logo" src={logo} alt="Project Nexuss" />
                            <div className="absolute inset-0 bg-secondary rounded-full opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                        </div>
                        <div className="brandname">Code <span className="text-secondary">Graphics</span></div>
                    </Link>

                    <ul className="desktop-nav">
                        <NavLinks />
                    </ul>

                    <button className="md:hidden text-light" onClick={toggleNavbar}>
                        {isOpen ? 
                            <>
                                <div className="grid justify-center gap-2">
                                    <span className="h-1 w-8 bg-light rotate-45 translate-y-3 transition-transform"></span>
                                    <span className="h-1 w-8 rounded-full bg-light scale-x-0 transition-transform"></span>
                                    <span className="h-1 w-8 rounded-full bg-light -rotate-45 -translate-y-3 transition-transform"></span>
                                </div>
                            </> 
                            : 
                            <>
                                <div className="grid justify-center gap-2">
                                    <span className="h-1 w-8 bg-light transition-transform"></span>
                                    <span className="h-1 w-8 rounded-full bg-light transition-transform"></span>
                                    <span className="h-1 w-8 rounded-full bg-light transition-transform"></span>
                                </div>
                            </>}
                    </button>
                </div>

            </header>
            {isOpen && (
                <ul className="mobile-nav animate-slideUp">
                    <NavLinks />
                </ul>
            )}
        </>
    ); 
}

export default Header;
