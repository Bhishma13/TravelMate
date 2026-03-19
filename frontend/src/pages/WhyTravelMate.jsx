import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';

function WhyTravelMate() {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="home-container" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>

            {/* NAVBAR */}
            <nav style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: '1.5rem 4rem', borderBottom: '1px solid rgba(255,255,255,0.05)',
                position: 'sticky', top: 0, background: 'rgba(10, 10, 10, 0.8)',
                backdropFilter: 'blur(10px)', zIndex: 100
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
                    <Link to="/" className="brand-name" style={{
                        fontSize: '1.8rem', fontWeight: '800', letterSpacing: '-1px',
                        background: 'linear-gradient(135deg, var(--primary-color) 0%, #00ffcc 100%)',
                        WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                        textDecoration: 'none'
                    }}>
                        TravelMate
                    </Link>
                </div>
                <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                    <Link to="/signin" style={{ color: '#fff', textDecoration: 'none', fontWeight: 500, fontSize: '0.95rem' }}>Log In</Link>
                    <Link to="/signup" className="cta-button" style={{ padding: '0.6rem 1.2rem', fontSize: '0.9rem', borderRadius: '50px' }}>Sign Up</Link>
                </div>
            </nav>

            {/* HERO CONTENT */}
            <div style={{ maxWidth: '1000px', margin: '6rem auto', padding: '0 2rem', textAlign: 'center' }}>
                <h4 style={{ color: 'var(--primary-color)', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '1rem', fontWeight: 600 }}>The TravelMate Vision</h4>
                <h1 style={{ fontSize: '4.5rem', fontWeight: '800', lineHeight: '1.1', marginBottom: '2rem', letterSpacing: '-1.5px' }}>
                    Bridging the gap between <br />
                    <span style={{ color: '#00ccff' }}>travelers</span> and <span style={{ color: '#00E676' }}>locals</span>.
                </h1>
                <p style={{ color: '#aaa', fontSize: '1.3rem', lineHeight: '1.8', maxWidth: '800px', margin: '0 auto 4rem auto' }}>
                    We believe the best experiences aren't found in generic guidebooks or mass-market tour packages.
                    They are found through authentic human connections. TravelMate is a decentralized marketplace designed to empower
                    local experts to build independent businesses, while giving travelers unforgettable, bespoke adventures.
                </p>

                {/* 3 PILLARS */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', textAlign: 'left', marginTop: '4rem' }}>

                    <div className="glass-panel" style={{ padding: '3rem 2.5rem', borderTop: '4px solid var(--primary-color)' }}>
                        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🤝</div>
                        <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: '#fff' }}>Direct Connection</h3>
                        <p style={{ color: '#999', lineHeight: '1.6' }}>
                            No middlemen, no hidden agency fees. We connect you directly with the people who know their city best. You chat, negotiate, and plan exactly what you want.
                        </p>
                    </div>

                    <div className="glass-panel" style={{ padding: '3rem 2.5rem', borderTop: '4px solid #00ccff' }}>
                        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>💎</div>
                        <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: '#fff' }}>Authentic Experiences</h3>
                        <p style={{ color: '#999', lineHeight: '1.6' }}>
                            Whether it's a hidden street food stall in Delhi or an underground art show in Berlin, our guides take you where the tourist buses simply can't go.
                        </p>
                    </div>

                    <div className="glass-panel" style={{ padding: '3rem 2.5rem', borderTop: '4px solid #00E676' }}>
                        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🌱</div>
                        <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: '#fff' }}>Local Empowerment</h3>
                        <p style={{ color: '#999', lineHeight: '1.6' }}>
                            We provide local passionate individuals with the tools to become entrepreneurs. They set their own rates, manage their schedules, and keep what they earn.
                        </p>
                    </div>

                </div>

                <div style={{ marginTop: '6rem', marginBottom: '4rem' }}>
                    <h2 style={{ fontSize: '2.5rem', marginBottom: '2rem' }}>Ready to experience travel differently?</h2>
                    <div style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center' }}>
                        <Link to="/signup?role=TRAVELER" className="cta-button" style={{ padding: '1rem 2.5rem', borderRadius: '50px', fontSize: '1.1rem' }}>I want to travel</Link>
                        <Link to="/signup?role=GUIDE" className="cta-button outline" style={{ padding: '1rem 2.5rem', borderRadius: '50px', fontSize: '1.1rem', borderColor: '#00E676', color: '#00E676' }}>I want to guide</Link>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <footer style={{ marginTop: 'auto', padding: '3rem 4rem', borderTop: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', color: '#777', fontSize: '0.9rem' }}>
                <div style={{ display: 'flex', gap: '2rem' }}>
                    <span>© 2026 TravelMate Platform Inc.</span>
                    <Link to="/" style={{ color: '#777', textDecoration: 'none' }}>Home</Link>
                </div>
                <div>
                    Made by <a href="https://www.linkedin.com/in/bhishma-padhayay-9541ab254/" target="_blank" rel="noopener noreferrer" style={{ color: '#fff', textDecoration: 'none', fontWeight: 'bold' }}>Bhishma Padhayay</a>
                </div>
            </footer>
        </div>
    );
}

export default WhyTravelMate;
