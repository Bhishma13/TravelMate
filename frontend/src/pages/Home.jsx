import React from 'react';
import { Link } from 'react-router-dom';

function Home() {
    return (
        <div className="home-container">
            <div className="hero-content">
                <h1>Welcome to <span className="brand-name">TravelMate</span></h1>
                <p className="subtitle">Connect with expert local guides or find travelers to lead.</p>
                <p className="description">
                    Whether you're exploring the mountains of Himanchal or the beaches of Goa,
                    TravelMate bridges the gap between adventurers and local experts.
                </p>
                <div className="cta-container">
                    <Link to="/signin" className="cta-button">Sign In to Start</Link>
                    <Link to="/signup" className="secondary-link">Create an Account</Link>
                </div>
            </div>
        </div>
    );
}

export default Home;
