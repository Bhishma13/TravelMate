import React from 'react';
import { Link } from 'react-router-dom';

function Home() {
    return (
        <div className="home-container" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div className="hero-content" style={{ background: 'transparent', border: 'none', padding: '0', maxWidth: '900px' }}>
                <h1 style={{ fontSize: '5rem', fontWeight: '900', letterSpacing: '-2px', marginBottom: '1.5rem', lineHeight: '1.1' }}>
                    Welcome to <br />
                    <span className="brand-name" style={{ color: '#fff', textShadow: '0 0 40px rgba(255,255,255,0.2)' }}>TravelMate</span>
                </h1>
                <p className="subtitle" style={{ color: '#A0A0A0', fontSize: '1.8rem', fontWeight: '400', marginBottom: '2.5rem' }}>
                    Connect with expert local guides.<br />Find travelers to lead.
                </p>
                <div style={{ height: '1px', width: '80px', background: '#333', margin: '0 auto 2.5rem auto' }}></div>
                <p className="description" style={{ color: '#777', fontSize: '1.2rem', maxWidth: '600px', margin: '0 auto 3.5rem auto', lineHeight: '1.8' }}>
                    Whether you're exploring the mountains of Himachal or the beaches of Goa,
                    TravelMate bridges the gap between adventurers and local experts seamlessly.
                </p>
                <div className="cta-container" style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center' }}>
                    <Link to="/signin" className="cta-button" style={{ padding: '1rem 3rem', fontSize: '1.2rem' }}>Sign In</Link>
                    <Link to="/signup" className="secondary-link" style={{ padding: '0.9rem 2.9rem', fontSize: '1.2rem', color: '#fff', borderColor: '#444' }}>Create Account</Link>
                </div>
            </div>

            {/* Footer */}
            <div style={{ position: 'absolute', bottom: '2rem', width: '100%', textAlign: 'center' }}>
                <p style={{ color: '#777', fontSize: '0.9rem', margin: 0 }}>
                    Made by <a href="https://www.linkedin.com/in/bhishma-padhayay-9541ab254/" target="_blank" rel="noopener noreferrer" style={{ color: '#fff', textDecoration: 'none', fontWeight: 'bold' }}>Bhishma Padhayay</a>
                </p>
            </div>
        </div>
    );
}

export default Home;
