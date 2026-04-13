import React from 'react';
import { useLocation, useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getFullImageUrl } from '../services/api';

function GuideProfileDetail() {
    const { state } = useLocation();
    const navigate = useNavigate();
    const { user } = useAuth();

    if (!user) {
        return <Navigate to="/signin" />;
    }

    const guide = state?.guide;

    if (!guide) {
        return <Navigate to="/dashboard" />;
    }

    const handleContactGuide = () => {
        if (!user.profileCompleted) {
            alert("Please complete your profile before sending requests!");
            navigate('/profile');
        } else {
            navigate(`/book/${guide.id}`, { state: { guideName: guide.name } });
        }
    };

    return (
        <div className="dashboard-container" style={{ maxWidth: '900px', margin: '0 auto', padding: '2.5rem' }}>
            <button
                onClick={() => navigate('/dashboard')}
                style={{ background: 'transparent', color: 'var(--text-secondary)', border: 'none', padding: 0, marginBottom: '2rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', width: 'auto', boxShadow: 'none' }}
            >
                ← Back to Dashboard
            </button>

            <div className="glass-panel" style={{ overflow: 'hidden' }}>
                <div style={{ position: 'relative', width: '100%', height: '250px', backgroundColor: '#e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{ position: 'absolute', width: '100%', height: '100%', backgroundColor: 'var(--primary-light)', opacity: 0.6 }}></div>
                    <span style={{ fontSize: '8rem', zIndex: 1, textShadow: '0 4px 15px rgba(0,0,0,0.1)' }}>📍</span>
                    <h1 style={{ margin: 0, fontSize: '2.5rem', color: 'var(--text-main)', zIndex: 2, padding: '0 2rem', textAlign: 'center', fontWeight: '800' }}>
                        Local Guide in {guide.location}
                    </h1>
                </div>

                <div style={{ padding: '3rem 2rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', marginBottom: '2rem', paddingBottom: '2rem', borderBottom: '1px solid var(--surface-border)' }}>
                        <img
                            src={getFullImageUrl(guide.image) || `https://api.dicebear.com/7.x/avataaars/svg?seed=${guide.name}`}
                            alt={guide.name}
                            style={{ width: '120px', height: '120px', borderRadius: '50%', objectFit: 'cover', border: '4px solid var(--primary-color)' }}
                        />
                        <div style={{ flexGrow: 1 }}>
                            <h2 style={{ margin: '0 0 0.5rem 0', color: 'var(--primary-color)', fontSize: '2rem' }}>{guide.name}</h2>
                            <p style={{ margin: '0.5rem 0', fontSize: '1.1rem', color: 'var(--text-secondary)' }}>
                                <strong>Experience:</strong> {guide.experience}
                            </p>
                            <p style={{ margin: '0.5rem 0', fontSize: '1.2rem', color: '#ffb300', fontWeight: 'bold' }}>
                                ⭐ {guide.rating} Rating
                            </p>
                        </div>
                    </div>

                    <div style={{ marginBottom: '3rem' }}>
                        <h3 style={{ margin: '0 0 1rem 0', color: 'var(--text-main)', fontSize: '1.5rem' }}>About Me</h3>
                        <p style={{ fontSize: '1.1rem', lineHeight: '1.8', color: 'var(--text-secondary)', whiteSpace: 'pre-wrap' }}>
                            {guide.about}
                        </p>
                    </div>

                    <div style={{ textAlign: 'center' }}>
                        <button
                            className="cta-button"
                            style={{ padding: '1rem 3rem', fontSize: '1.1rem', borderRadius: '50px' }}
                            onClick={handleContactGuide}
                        >
                            Contact Guide
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default GuideProfileDetail;
