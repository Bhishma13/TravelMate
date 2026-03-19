import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Home() {
    const navigate = useNavigate();

    const handleSearch = (e) => {
        e.preventDefault();
        navigate('/signup'); // Direct to signup for now as a CTA
    };

    return (
        <div className="home-container" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>

            {/* 1. UPWORK-STYLE NAVBAR */}
            <nav style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: '1.5rem 4rem', borderBottom: '1px solid rgba(255,255,255,0.05)',
                position: 'sticky', top: 0, background: 'rgba(10, 10, 10, 0.8)',
                backdropFilter: 'blur(10px)', zIndex: 100
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
                    <span className="brand-name" style={{
                        fontSize: '1.8rem', fontWeight: '800', letterSpacing: '-1px',
                        background: 'linear-gradient(135deg, var(--primary-color) 0%, #00ffcc 100%)',
                        WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                    }}>
                        TravelMate
                    </span>
                    <div style={{ display: 'flex', gap: '2rem', color: '#ccc', fontWeight: 500, fontSize: '0.95rem' }} className="nav-links">
                        {/* Links removed as per request */}
                    </div>
                </div>
                <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                    <Link to="/signin" style={{ color: '#fff', textDecoration: 'none', fontWeight: 500, fontSize: '0.95rem' }}>Log In</Link>
                    <Link to="/signup" className="cta-button" style={{ padding: '0.6rem 1.2rem', fontSize: '0.9rem', borderRadius: '50px' }}>Sign Up</Link>
                </div>
            </nav>

            {/* 2. SPLIT HERO SECTION */}
            <div style={{
                display: 'grid', gridTemplateColumns: 'minmax(0, 1.2fr) minmax(0, 1fr)', gap: '4rem',
                padding: '5rem 4rem', alignItems: 'center', maxWidth: '1400px', margin: '0 auto', width: '100%'
            }}>
                {/* Left: Text & Search */}
                <div>
                    <h1 style={{ fontSize: '4.5rem', fontWeight: '800', lineHeight: '1.1', marginBottom: '1.5rem', letterSpacing: '-1.5px' }}>
                        How travel<br />
                        <span style={{ color: 'var(--primary-color)' }}>should work</span>
                    </h1>
                    <p style={{ color: '#aaa', fontSize: '1.2rem', lineHeight: '1.6', marginBottom: '2.5rem', maxWidth: '90%' }}>
                        Forget generic tours. Connect directly with expert local guides for authentic experiences, or find travelers who need your expertise.
                    </p>

                    {/* Upwork-style Search Bar */}
                    <form onSubmit={handleSearch} style={{ display: 'flex', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '50px', padding: '0.4rem', maxWidth: '600px' }}>
                        <div style={{ padding: '0.8rem 1.2rem', color: '#888' }}>🔍</div>
                        <input
                            type="text"
                            placeholder="Destination, activity, or guide expertise..."
                            style={{ flex: 1, background: 'transparent', border: 'none', color: '#fff', fontSize: '1rem', outline: 'none' }}
                        />
                        <button type="submit" className="cta-button" style={{ margin: 0, padding: '0.8rem 2rem', borderRadius: '50px', fontSize: '1rem' }}>
                            Search
                        </button>
                    </form>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '3rem', opacity: 0.6 }}>
                        <span style={{ fontSize: '0.85rem', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px' }}>Trusted By Travelers In</span>
                        <div style={{ display: 'flex', gap: '1.5rem', fontWeight: 'bold', fontSize: '1.2rem' }}>
                            <span>🇮🇳 India</span>
                            <span>🇯🇵 Japan</span>
                            <span>🇮🇹 Italy</span>
                        </div>
                    </div>
                </div>

                {/* Right: Graphic / Abstract Glass Cards */}
                <div style={{ position: 'relative', height: '500px', width: '100%' }}>
                    <div className="glass-panel" style={{ position: 'absolute', top: '10%', right: '0%', width: '85%', padding: '2rem', transform: 'rotate(2deg)', zIndex: 2, boxShadow: '0 20px 40px rgba(0,0,0,0.5)' }}>
                        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '1rem' }}>
                            <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'linear-gradient(45deg, #FF5252, #FF1744)' }}></div>
                            <div>
                                <h3 style={{ margin: 0, fontSize: '1.3rem' }}>Trekking Guide</h3>
                                <p style={{ margin: 0, color: '#aaa', fontSize: '0.9rem' }}>★ 4.9 (120 reviews)</p>
                            </div>
                        </div>
                        <p style={{ color: '#ccc', margin: 0, fontSize: '1.05rem', lineHeight: '1.6' }}>"Expert in high-altitude treks. Knows the hidden trails of the Himalayas safely."</p>
                    </div>

                    <div className="glass-panel" style={{ position: 'absolute', top: '45%', left: '0%', width: '80%', padding: '2rem', transform: 'rotate(-3deg)', zIndex: 1, background: 'rgba(0, 229, 255, 0.05)', borderColor: 'rgba(0, 229, 255, 0.2)', boxShadow: '0 20px 40px rgba(0,0,0,0.5)' }}>
                        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '1rem' }}>
                            <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'linear-gradient(45deg, #00E676, #00C853)' }}></div>
                            <div>
                                <h3 style={{ margin: 0, fontSize: '1.3rem' }}>Culinary Expert</h3>
                                <p style={{ margin: 0, color: '#aaa', fontSize: '0.9rem' }}>★ 5.0 (85 reviews)</p>
                            </div>
                        </div>
                        <p style={{ color: '#ccc', margin: 0, fontSize: '1.05rem', lineHeight: '1.6' }}>"I run the best street food tours in Old Delhi. You will eat like a local."</p>
                    </div>
                </div>
            </div>

            {/* 3. CATEGORY PILLS */}
            <div style={{ padding: '2rem 4rem 5rem 4rem', maxWidth: '1400px', margin: '0 auto', width: '100%' }}>
                <h2 style={{ fontSize: '2rem', marginBottom: '2.5rem' }}>Browse by <span style={{ color: 'var(--primary-color)' }}>category</span></h2>
                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                    {['Historical & Culture', 'Culinary & Food', 'Adventure & Outdoors', 'Photography Tours', 'City Walks', 'Nightlife', 'Wellness Retreats', 'Wildlife Safaris'].map(cat => (
                        <div key={cat} style={{
                            padding: '1rem 2rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
                            borderRadius: '50px', fontSize: '1.1rem', cursor: 'pointer', transition: 'all 0.2s'
                        }} className="category-pill">
                            {cat}
                        </div>
                    ))}
                </div>
            </div>

            {/* 4. SPLIT AUDIENCE SECTION (For Travelers vs For Guides) */}
            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)', gap: '3rem', padding: '0 4rem 6rem 4rem', maxWidth: '1400px', margin: '0 auto', width: '100%' }}>
                <div className="glass-panel" style={{ padding: '3.5rem', position: 'relative', overflow: 'hidden', display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                    <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '5px', background: 'var(--primary-color)' }}></div>
                    <h4 style={{ color: 'var(--primary-color)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '1rem' }}>For Travelers</h4>
                    <h2 style={{ fontSize: '2.5rem', marginBottom: '1.5rem', lineHeight: '1.2' }}>Find the perfect guide<br />for your journey.</h2>
                    <ul style={{ color: '#aaa', fontSize: '1.1rem', lineHeight: '1.8', paddingLeft: '1.5rem', marginBottom: '2.5rem' }}>
                        <li>Post a trip request to the Job Board.</li>
                        <li>Receive proposals from verified local experts.</li>
                        <li>Chat, negotiate, and book seamlessly.</li>
                    </ul>
                    <Link to="/signup" className="cta-button outline" style={{ display: 'inline-block', borderRadius: '50px', marginTop: 'auto' }}>Create Traveler Account</Link>
                </div>

                <div className="glass-panel" style={{ padding: '3.5rem', position: 'relative', overflow: 'hidden', display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                    <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '5px', background: '#00E676' }}></div>
                    <h4 style={{ color: '#00E676', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '1rem' }}>For Local Guides</h4>
                    <h2 style={{ fontSize: '2.5rem', marginBottom: '1.5rem', lineHeight: '1.2' }}>Turn your local knowledge<br />into a business.</h2>
                    <ul style={{ color: '#aaa', fontSize: '1.1rem', lineHeight: '1.8', paddingLeft: '1.5rem', marginBottom: '2.5rem' }}>
                        <li>Find travelers heading to your city.</li>
                        <li>Send automated or customized proposals.</li>
                        <li>Get reviews and build your reputation.</li>
                    </ul>
                    <Link to="/signup" className="cta-button outline" style={{ display: 'inline-block', borderRadius: '50px', borderColor: '#00E676', color: '#00E676', marginTop: 'auto' }}>Apply as a Guide</Link>
                </div>
            </div>

            {/* Footer */}
            <footer style={{ marginTop: 'auto', padding: '3rem 4rem', borderTop: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', color: '#777', fontSize: '0.9rem' }}>
                <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
                    <span>© 2026 TravelMate Platform Inc.</span>
                    <Link to="/why-travelmate" style={{
                        textDecoration: 'none',
                        fontWeight: '800',
                        fontSize: '1rem',
                        letterSpacing: '1px',
                        background: 'linear-gradient(90deg, #00ffcc, #00A6FF)',
                        backgroundSize: '200% auto',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        textShadow: '0 0 20px rgba(0, 229, 255, 0.5)'
                    }}>✨ Why TravelMate</Link>
                    <span style={{ cursor: 'pointer' }}>Terms of Service</span>
                    <span style={{ cursor: 'pointer' }}>Privacy Policy</span>
                </div>
                <div>
                    Made by <a href="https://www.linkedin.com/in/bhishma-padhayay-9541ab254/" target="_blank" rel="noopener noreferrer" style={{ color: '#fff', textDecoration: 'none', fontWeight: 'bold' }}>Bhishma Padhayay</a>
                </div>
            </footer>
        </div>
    );
}

export default Home;
