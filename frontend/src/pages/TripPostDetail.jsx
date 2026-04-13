import React, { useState } from 'react';
import { useLocation, useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getFullImageUrl, createBookingRequest } from '../services/api';

function TripPostDetail() {
    const { state } = useLocation();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);

    if (!user) {
        return <Navigate to="/signin" />;
    }

    const post = state?.post;

    if (!post) {
        return <Navigate to="/dashboard" />;
    }

    const handleSendProposal = async () => {
        if (!user.profileCompleted) {
            alert("Please complete your profile before sending proposals!");
            navigate('/profile');
            return;
        }

        if (window.confirm(`Send a proposal to guide the trip to ${post.destination}?`)) {
            setLoading(true);
            try {
                await createBookingRequest({
                    travelerId: post.travelerId,
                    guideId: user.id,
                    tripDates: post.tripDates,
                    tripPostId: post.id
                });
                alert("Proposal sent successfully! You can view it in your Booking Requests.");
                navigate('/dashboard'); // Go back to dashboard after success
            } catch (err) {
                alert(err.message || "Failed to send proposal.");
            } finally {
                setLoading(false);
            }
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
                    <span style={{ fontSize: '8rem', zIndex: 1, textShadow: '0 4px 15px rgba(0,0,0,0.1)' }}>🌍</span>
                    <h1 style={{ margin: 0, fontSize: '2.5rem', color: 'var(--text-main)', zIndex: 2, padding: '0 2rem', textAlign: 'center', fontWeight: '800' }}>
                        Trip to {post.destination}
                    </h1>
                </div>

                <div style={{ padding: '3rem 2rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '2rem', paddingBottom: '2rem', borderBottom: '1px solid var(--surface-border)' }}>
                        <img
                            src={getFullImageUrl(post.travelerImage) || `https://api.dicebear.com/7.x/avataaars/svg?seed=${post.travelerName || 'Traveler'}`}
                            alt={post.travelerName || 'Traveler'}
                            style={{ width: '90px', height: '90px', borderRadius: '50%', objectFit: 'cover', border: '4px solid var(--primary-color)' }}
                        />
                        <div>
                            <h2 style={{ margin: '0 0 0.5rem 0', color: 'var(--primary-color)' }}>{post.travelerName || 'Traveler'}</h2>
                            <p style={{ margin: 0, fontSize: '1.1rem', color: 'var(--text-secondary)' }}>
                                <strong>Dates:</strong> 🗓️ {post.tripDates}
                            </p>
                        </div>
                    </div>

                    <div style={{ marginBottom: '3rem' }}>
                        <h3 style={{ margin: '0 0 1rem 0', color: 'var(--text-main)' }}>Description</h3>
                        <p style={{ fontSize: '1.1rem', lineHeight: '1.8', color: 'var(--text-secondary)', whiteSpace: 'pre-wrap' }}>
                            {post.description}
                        </p>
                    </div>

                    <div style={{ textAlign: 'center' }}>
                        <button
                            className="cta-button"
                            style={{ padding: '1rem 3rem', fontSize: '1.1rem', borderRadius: '50px' }}
                            onClick={handleSendProposal}
                            disabled={loading || user.role !== 'guide'}
                        >
                            {loading ? 'Sending Proposal...' : 'Send Proposal'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default TripPostDetail;
