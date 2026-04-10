import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Home() {
    const navigate = useNavigate();

    const handleSearch = (e) => {
        e.preventDefault();
        navigate('/signup');
    };

    return (
        <div className="home-container" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>

            {/* NAVBAR */}
            <nav style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: '1.2rem 4rem', borderBottom: '1px solid #e2e8f0',
                position: 'sticky', top: 0,
                background: 'rgba(248,250,252,0.85)',
                backdropFilter: 'blur(12px)', zIndex: 100
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
                    <span className="brand-name" style={{
                        fontSize: '1.6rem', fontWeight: '800', letterSpacing: '-1px',
                        color: '#0f172a'
                    }}>
                        Travel<span style={{ color: '#0d9488' }}>Mate</span>
                    </span>
                </div>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <Link to="/signin" style={{ color: '#475569', textDecoration: 'none', fontWeight: 500, fontSize: '0.95rem', padding: '0.5rem 1rem' }}>Log In</Link>
                    <Link to="/signup" style={{
                        padding: '0.55rem 1.3rem', fontSize: '0.9rem', borderRadius: '8px',
                        background: '#0f172a', color: '#fff', fontWeight: 600, textDecoration: 'none',
                        transition: 'background 0.2s'
                    }}>Get Started</Link>
                </div>
            </nav>

            {/* HERO */}
            <div style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                padding: '6rem 4rem 4rem 4rem', maxWidth: '900px', margin: '0 auto', width: '100%',
                textAlign: 'center'
            }}>
                {/* Badge */}
                <div style={{
                    display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
                    padding: '0.4rem 1rem', borderRadius: '50px',
                    border: '1px solid #e2e8f0', background: '#fff',
                    fontSize: '0.82rem', fontWeight: 600, color: '#475569',
                    marginBottom: '2rem', letterSpacing: '0.5px'
                }}>
                    ✈️ CONNECT WITH LOCAL EXPERTS · FREE TO JOIN
                </div>

                <h1 style={{
                    fontSize: '4.2rem', fontWeight: '800', lineHeight: '1.1',
                    marginBottom: '1.5rem', letterSpacing: '-2px', color: '#0f172a'
                }}>
                    How travel<br />
                    <span style={{ color: '#0d9488' }}>should work.</span>
                </h1>

                <p style={{ color: '#64748b', fontSize: '1.15rem', lineHeight: '1.7', marginBottom: '3rem', maxWidth: '600px' }}>
                    Forget generic tours. Connect directly with expert local guides for authentic experiences, or find travelers who need your expertise.
                </p>

                {/* Search Bar */}
                <form onSubmit={handleSearch} style={{
                    display: 'flex', background: '#fff', border: '1.5px solid #e2e8f0',
                    borderRadius: '12px', padding: '0.4rem', maxWidth: '580px', width: '100%',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
                }}>
                    <div style={{ padding: '0.7rem 1rem', color: '#94a3b8' }}>🔍</div>
                    <input
                        type="text"
                        placeholder="Destination, activity, or guide expertise..."
                        style={{
                            flex: 1, background: 'transparent', border: 'none', color: '#0f172a',
                            fontSize: '0.97rem', outline: 'none', fontFamily: 'inherit'
                        }}
                    />
                    <button type="submit" style={{
                        margin: 0, padding: '0.7rem 1.8rem', borderRadius: '8px',
                        fontSize: '0.9rem', width: 'auto', background: '#0f172a', color: '#fff'
                    }}>
                        Search
                    </button>
                </form>

                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '2.5rem', color: '#94a3b8' }}>
                    <span style={{ fontSize: '0.82rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px' }}>Trusted by travelers in</span>
                    <div style={{ display: 'flex', gap: '1.2rem', fontWeight: 600, fontSize: '1rem', color: '#475569' }}>
                        <span>🇮🇳 India</span>
                        <span>🇯🇵 Japan</span>
                        <span>🇮🇹 Italy</span>
                    </div>
                </div>
            </div>

            {/* GUIDE CARDS PREVIEW */}
            <div style={{ padding: '2rem 4rem 5rem 4rem', maxWidth: '1100px', margin: '0 auto', width: '100%' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
                    {[
                        { name: 'Trekking Guide', rating: '4.9', reviews: 120, desc: '"Expert in high-altitude treks. Knows the hidden trails of the Himalayas safely."', color: '#0d9488' },
                        { name: 'Culinary Expert', rating: '5.0', reviews: 85, desc: '"I run the best street food tours in Old Delhi. You will eat like a local."', color: '#6366f1' },
                        { name: 'Heritage Walker', rating: '4.8', reviews: 64, desc: '"Uncover 500 years of history in Jaipur\'s old city in just one afternoon."', color: '#f59e0b' },
                    ].map((guide) => (
                        <div key={guide.name} className="glass-panel" style={{ padding: '1.8rem' }}>
                            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '1rem' }}>
                                <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: guide.color, flexShrink: 0 }}></div>
                                <div>
                                    <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 700, color: '#0f172a' }}>{guide.name}</h3>
                                    <p style={{ margin: 0, color: '#64748b', fontSize: '0.85rem' }}>★ {guide.rating} ({guide.reviews} reviews)</p>
                                </div>
                            </div>
                            <p style={{ color: '#475569', margin: 0, fontSize: '0.95rem', lineHeight: '1.6' }}>{guide.desc}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* CATEGORY PILLS */}
            <div style={{ padding: '0 4rem 5rem 4rem', maxWidth: '1100px', margin: '0 auto', width: '100%' }}>
                <h2 style={{ fontSize: '1.8rem', marginBottom: '1.5rem', color: '#0f172a' }}>Browse by <span style={{ color: '#0d9488' }}>category</span></h2>
                <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                    {['Historical & Culture', 'Culinary & Food', 'Adventure & Outdoors', 'Photography Tours', 'City Walks', 'Nightlife', 'Wellness Retreats', 'Wildlife Safaris'].map(cat => (
                        <div key={cat} style={{
                            padding: '0.65rem 1.4rem', background: '#fff', border: '1.5px solid #e2e8f0',
                            borderRadius: '50px', fontSize: '0.92rem', cursor: 'pointer',
                            transition: 'all 0.2s', color: '#475569', fontWeight: 500
                        }} className="category-pill">
                            {cat}
                        </div>
                    ))}
                </div>
            </div>

            {/* FOR TRAVELERS / FOR GUIDES */}
            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) minmax(0,1fr)', gap: '1.5rem', padding: '0 4rem 6rem 4rem', maxWidth: '1100px', margin: '0 auto', width: '100%' }}>
                <div className="glass-panel" style={{ padding: '3rem', position: 'relative', overflow: 'hidden', display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                    <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '4px', background: '#0d9488' }}></div>
                    <h4 style={{ color: '#0d9488', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.8rem', fontSize: '0.8rem' }}>For Travelers</h4>
                    <h2 style={{ fontSize: '2rem', marginBottom: '1.2rem', lineHeight: '1.25', color: '#0f172a' }}>Find the perfect guide<br />for your journey.</h2>
                    <ul style={{ color: '#64748b', fontSize: '1rem', lineHeight: '1.9', paddingLeft: '1.2rem', marginBottom: '2rem' }}>
                        <li>Post a trip request to the Job Board.</li>
                        <li>Receive proposals from verified local experts.</li>
                        <li>Chat, negotiate, and book seamlessly.</li>
                    </ul>
                    <Link to="/signup" style={{
                        display: 'inline-block', padding: '0.7rem 1.6rem',
                        borderRadius: '8px', border: '1.5px solid #0d9488',
                        color: '#0d9488', fontWeight: 600, fontSize: '0.9rem',
                        textDecoration: 'none', transition: 'all 0.2s', marginTop: 'auto'
                    }}>Create Traveler Account →</Link>
                </div>

                <div className="glass-panel" style={{ padding: '3rem', position: 'relative', overflow: 'hidden', display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                    <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '4px', background: '#6366f1' }}></div>
                    <h4 style={{ color: '#6366f1', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.8rem', fontSize: '0.8rem' }}>For Local Guides</h4>
                    <h2 style={{ fontSize: '2rem', marginBottom: '1.2rem', lineHeight: '1.25', color: '#0f172a' }}>Turn your local knowledge<br />into a business.</h2>
                    <ul style={{ color: '#64748b', fontSize: '1rem', lineHeight: '1.9', paddingLeft: '1.2rem', marginBottom: '2rem' }}>
                        <li>Find travelers heading to your city.</li>
                        <li>Send automated or customized proposals.</li>
                        <li>Get reviews and build your reputation.</li>
                    </ul>
                    <Link to="/signup" style={{
                        display: 'inline-block', padding: '0.7rem 1.6rem',
                        borderRadius: '8px', border: '1.5px solid #6366f1',
                        color: '#6366f1', fontWeight: 600, fontSize: '0.9rem',
                        textDecoration: 'none', transition: 'all 0.2s', marginTop: 'auto'
                    }}>Apply as a Guide →</Link>
                </div>
            </div>

            {/* FOOTER */}
            <footer style={{
                marginTop: 'auto', padding: '2.5rem 4rem',
                borderTop: '1px solid #e2e8f0', display: 'flex',
                justifyContent: 'space-between', color: '#94a3b8', fontSize: '0.88rem',
                background: '#fff'
            }}>
                <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
                    <span style={{ fontWeight: 700, color: '#0f172a' }}>Travel<span style={{ color: '#0d9488' }}>Mate</span></span>
                    <span>© 2026 TravelMate Platform Inc.</span>
                    <Link to="/why-travelmate" style={{ color: '#0d9488', fontWeight: 600 }}>Why TravelMate</Link>
                    <span style={{ cursor: 'pointer' }}>Terms</span>
                    <span style={{ cursor: 'pointer' }}>Privacy</span>
                </div>
                <div>
                    Made by <a href="https://www.linkedin.com/in/bhishma-padhayay-9541ab254/" target="_blank" rel="noopener noreferrer" style={{ color: '#0f172a', fontWeight: 700 }}>Bhishma Padhayay</a>
                </div>
            </footer>
        </div>
    );
}

export default Home;
