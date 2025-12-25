import React from 'react';
import Logo from '../assets/images/logo.png';
import './Loader.css';

function Loader() {
    return (
        <div className="loader-overlay">
            <div className="loader-container">
                <img src={Logo} alt="Loading" className="loader-logo" />
                <div className="loader-text">Loading...</div>
            </div>
        </div>
    );
}

export default Loader;
