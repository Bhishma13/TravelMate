import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { createTripPost, getTravelerPosts, updateTripPostStatus, enhanceTrip } from '../services/api';
import { useNavigate } from 'react-router-dom';

function MyTripsPage() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [posts, setPosts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    // Form state
    const [destination, setDestination] = useState('');
    const [tripDates, setTripDates] = useState('');
    const [description, setDescription] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [isEnhancing, setIsEnhancing] = useState(false);

    const handleEnhance = async () => {
        if (!description || description.trim().length < 5) {
            setError("Please type a few keywords in the Description box first to use AI.");
            return;
        }
        setIsEnhancing(true);
        setError('');
        try {
            const enhancedText = await enhanceTrip(description);
            setDescription(enhancedText);
        } catch (err) {
            setError(err.message || "Failed to enhance description. Please try again.");
        } finally {
            setIsEnhancing(false);
        }
    };

    useEffect(() => {
        if (!user || user.role !== 'traveler') {
            navigate('/dashboard');
            return;
        }

        fetchPosts();
    }, [user, navigate]);

    const fetchPosts = () => {
        setIsLoading(true);
        getTravelerPosts(user.id)
            .then(data => setPosts(data))
            .catch(err => console.error("Failed to load posts", err))
            .finally(() => setIsLoading(false));
    };

    const handleCreatePost = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError('');

        try {
            await createTripPost({
                travelerId: user.id,
                destination,
                tripDates,
                description
            });
            // Clear form and refresh list
            setDestination('');
            setTripDates('');
            setDescription('');
            fetchPosts();
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to create trip post.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleCancelPost = async (postId) => {
        if (window.confirm('Are you sure you want to cancel this trip post?')) {
            try {
                await updateTripPostStatus(postId, 'CANCELLED');
                fetchPosts(); // Refresh list to show updated status
            } catch (err) {
                console.error("Failed to cancel post", err);
                alert("Could not cancel post.");
            }
        }
    };

    const getStatusStyle = (status) => {
        switch (status) {
            case 'OPEN': return { color: '#ffeb3b', fontWeight: 'bold' };
            case 'IN_PROGRESS': return { color: '#2196F3', fontWeight: 'bold' };
            case 'FULFILLED': return { color: '#4CAF50', fontWeight: 'bold' };
            case 'CANCELLED': return { color: '#f44336', fontWeight: 'bold' };
            default: return { color: '#fff' };
        }
    };

    return (
        <div className="dashboard-container">
            <h1 style={{ marginBottom: '2.5rem', fontSize: '2rem', color: 'var(--primary-color)' }}>My Trip Posts</h1>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '3rem', alignItems: 'start' }}>

                {/* CREATE NEW TRIP FORM */}
                <div className="glass-panel" style={{ padding: '2.5rem' }}>
                    <h2 style={{ marginTop: 0, marginBottom: '2rem', color: '#fff', fontSize: '1.6rem' }}>Post a New Trip</h2>

                    {error && <div style={{ color: 'var(--error-color)', marginBottom: '1.5rem', background: 'rgba(255,82,82,0.1)', padding: '12px', borderRadius: '8px', border: '1px solid rgba(255,82,82,0.3)' }}>{error}</div>}

                    <form onSubmit={handleCreatePost} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        <div className="form-group">
                            <label style={{ color: '#fff' }}>Destination</label>
                            <input
                                type="text"
                                value={destination}
                                onChange={(e) => setDestination(e.target.value)}
                                placeholder="e.g. Kyoto, Japan"
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label style={{ color: '#fff' }}>Dates</label>
                            <input
                                type="text"
                                value={tripDates}
                                onChange={(e) => setTripDates(e.target.value)}
                                placeholder="e.g. Oct 10 - Oct 15, 2026"
                                required
                            />
                        </div>
                        <div className="form-group">
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '0.5rem' }}>
                                <label style={{ color: '#fff', margin: 0 }}>Description / What are you looking for?</label>
                                <button
                                    type="button"
                                    onClick={handleEnhance}
                                    disabled={isEnhancing}
                                    className="btn-accent"
                                    style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem', borderRadius: '50px', background: 'transparent' }}
                                >
                                    {isEnhancing ? '✨ Enhancing...' : '✨ Enhance with AI'}
                                </button>
                            </div>
                            <textarea
                                className="form-textarea"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="e.g. Looking for an energetic local to show me hidden tea houses and historical shrines. I love photography!"
                                required
                                rows="5"
                                style={{ resize: 'vertical' }}
                            />
                        </div>

                        <button type="submit" disabled={isSubmitting} className={`cta-button ${isSubmitting ? '' : 'btn-success'}`} style={{ marginTop: '1rem', opacity: isSubmitting ? 0.7 : 1 }}>
                            {isSubmitting ? 'Posting...' : 'Post Trip to Job Board'}
                        </button>
                    </form>
                </div>

                {/* TRIP HISTORY FEED */}
                <div>
                    <h2 style={{ marginTop: 0, marginBottom: '2rem', fontSize: '1.6rem', color: '#fff' }}>Your Posted Trips</h2>

                    {isLoading ? (
                        <p style={{ color: '#aaa' }}>Loading your trips...</p>
                    ) : posts.length === 0 ? (
                        <div className="glass-panel" style={{ padding: '4rem 2rem', textAlign: 'center', border: '1px dashed var(--surface-border)' }}>
                            <div style={{ fontSize: '4rem', marginBottom: '1.5rem', opacity: 0.5 }}>✈️</div>
                            <p style={{ color: '#fff', fontSize: '1.2rem', marginBottom: '0.5rem' }}>You haven't posted any trips yet.</p>
                            <p style={{ color: '#aaa', fontSize: '1rem' }}>Fill out the form to let guides know where you're going!</p>
                        </div>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                            {posts.map(post => (
                                <div key={post.id} className="card" style={{ padding: '2rem', position: 'relative', overflow: 'hidden' }}>
                                    {/* Status Ribbon/Badge */}
                                    <div style={{ position: 'absolute', top: '20px', right: '20px', padding: '6px 14px', borderRadius: '50px', background: 'rgba(0,0,0,0.4)', fontSize: '0.85rem', border: '1px solid var(--surface-border)', ...getStatusStyle(post.status) }}>
                                        {post.status}
                                    </div>

                                    <h3 style={{ margin: '0 0 0.8rem 0', color: 'var(--primary-color)', fontSize: '1.5rem' }}>📍 {post.destination}</h3>
                                    <p style={{ margin: '0 0 1.5rem 0', color: '#fff', fontWeight: '500', fontSize: '1.1rem' }}>🗓️ {post.tripDates}</p>

                                    <div style={{ background: 'rgba(0,0,0,0.3)', padding: '1.2rem', borderRadius: '12px', fontSize: '0.95rem', lineHeight: '1.6', border: '1px solid rgba(255,255,255,0.05)', color: '#ddd' }}>
                                        "{post.description}"
                                    </div>

                                    {post.status === 'OPEN' && (
                                        <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'flex-end' }}>
                                            <button
                                                onClick={() => handleCancelPost(post.id)}
                                                className="btn-outline-danger"
                                                style={{ padding: '0.5rem 1.2rem', fontSize: '0.9rem', width: 'auto', borderRadius: '50px' }}
                                            >
                                                Cancel Post
                                            </button>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default MyTripsPage;
