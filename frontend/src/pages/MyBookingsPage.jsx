import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getTravelerRequests, updateBookingStatus, createReview } from '../services/api';
import { useNavigate } from 'react-router-dom';
import ChatBox from '../components/ChatBox';

const StatusBadge = ({ status }) => {
    const colors = {
        ACCEPTED: { bg: 'rgba(76,175,80,0.2)', text: '#4CAF50' },
        DECLINED: { bg: 'rgba(244,67,54,0.2)', text: '#F44336' },
        COMPLETED: { bg: 'rgba(33,150,243,0.2)', text: '#2196F3' },
        REVIEWED: { bg: 'rgba(156,39,176,0.2)', text: '#9C27B0' },
        CANCELLED: { bg: 'rgba(255,87,34,0.2)', text: '#FF5722' },
        PENDING: { bg: 'rgba(255,179,0,0.2)', text: '#ffb300' },
    };
    const c = colors[status] || colors.PENDING;
    return (
        <span style={{ marginLeft: '0.5rem', padding: '0.2rem 0.6rem', borderRadius: '4px', background: c.bg, color: c.text, fontWeight: 'bold', fontSize: '0.85rem' }}>
            {status}
        </span>
    );
};

function MyBookingsPage() {
    const { user } = useAuth();
    const [allBookings, setAllBookings] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [activeTab, setActiveTab] = useState('proposals');
    const [activeChatBooking, setActiveChatBooking] = useState(null);

    // Review Modal
    const [isReviewOpen, setIsReviewOpen] = useState(false);
    const [reviewTrip, setReviewTrip] = useState(null);
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState('');
    const [reviewSubmitting, setReviewSubmitting] = useState(false);

    // Cancel Modal
    const [cancelTarget, setCancelTarget] = useState(null);
    const [cancelReason, setCancelReason] = useState('');
    const [cancelSubmitting, setCancelSubmitting] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        if (!user || user.role !== 'traveler') { navigate('/dashboard'); return; }
        fetchBookings();
    }, [user, navigate]);

    const fetchBookings = async () => {
        setIsLoading(true);
        try {
            const data = await getTravelerRequests(user.id);
            setAllBookings(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleStatusUpdate = async (requestId, newStatus) => {
        try {
            await updateBookingStatus(requestId, newStatus);
            fetchBookings();
        } catch (err) {
            alert(err.message);
        }
    };

    const submitCancellation = async (e) => {
        e.preventDefault();
        if (!cancelTarget) return;
        if (!cancelReason.trim()) { alert('Please provide a reason for cancellation.'); return; }
        setCancelSubmitting(true);
        try {
            await updateBookingStatus(cancelTarget.id, 'CANCELLED', cancelReason.trim());
            setCancelTarget(null);
            setCancelReason('');
            fetchBookings();
        } catch (err) {
            alert(err.message);
        } finally {
            setCancelSubmitting(false);
        }
    };

    const handleOpenReview = (book) => {
        setReviewTrip(book); setRating(5); setComment(''); setIsReviewOpen(true);
    };

    const submitReview = async (e) => {
        e.preventDefault();
        if (!reviewTrip) return;
        setReviewSubmitting(true);
        try {
            await createReview({ bookingRequestId: reviewTrip.id, travelerId: user.id, guideId: reviewTrip.guideId, rating, comment });
            setIsReviewOpen(false); setReviewTrip(null); fetchBookings();
        } catch (err) { alert(err.message); }
        finally { setReviewSubmitting(false); }
    };

    // tripPostId != null → Guide's proposal to Traveler's trip post (Incoming Proposals tab)
    // tripPostId == null → Traveler directly contacted a Guide (My Requests tab)
    const incomingProposals = allBookings.filter(b => b.tripPostId != null);
    const myRequests = allBookings.filter(b => b.tripPostId == null);
    const displayList = activeTab === 'proposals' ? incomingProposals : myRequests;

    const tabStyle = (tab) => ({}); // Obsolete now, replaced by classNames

    if (isLoading) return <div className="dashboard-container"><h2 style={{ textAlign: 'center' }}>Loading...</h2></div>;

    return (
        <div className="dashboard-container">
            <header className="dashboard-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <button onClick={() => navigate('/dashboard')} className="cta-button outline" style={{ padding: '0.4rem 1rem', borderRadius: '50px', fontSize: '0.85rem', cursor: 'pointer', width: 'max-content' }}>
                    ← Back to Dashboard
                </button>
                <h1 style={{ margin: 0, fontSize: '1.6rem', color: 'var(--primary-color)' }}>My Bookings</h1>
            </header>

            {error && <p style={{ color: 'var(--error-color)', textAlign: 'center' }}>{error}</p>}

            {/* TABS */}
            <div className="tabs-container">
                <button className={`tab-button ${activeTab === 'proposals' ? 'active' : ''}`} onClick={() => setActiveTab('proposals')}>
                    Guide Proposals
                    {incomingProposals.filter(b => b.status === 'PENDING').length > 0 && (
                        <span style={{ marginLeft: '0.5rem', background: '#ff4444', color: '#fff', borderRadius: '50%', padding: '2px 8px', fontSize: '0.75rem', fontWeight: 'bold' }}>
                            {incomingProposals.filter(b => b.status === 'PENDING').length}
                        </span>
                    )}
                </button>
                <button className={`tab-button ${activeTab === 'myRequests' ? 'active' : ''}`} onClick={() => setActiveTab('myRequests')}>
                    My Requests
                </button>
            </div>

            {/* CONTENT */}
            <div className="cards-grid">
                {displayList.length === 0 ? (
                    <div className="empty-state" style={{ gridColumn: '1 / -1' }}>
                        <div style={{ fontSize: '4rem', marginBottom: '1rem', opacity: 0.5 }}>{activeTab === 'proposals' ? '📩' : '✈️'}</div>
                        <h3 style={{ fontSize: '1.5rem', color: '#fff', marginBottom: '0.5rem' }}>
                            {activeTab === 'proposals' ? 'No proposals yet' : 'No requests sent yet'}
                        </h3>
                        <p style={{ maxWidth: '400px', margin: '0 auto', lineHeight: '1.6' }}>
                            {activeTab === 'proposals'
                                ? 'Post a trip and guides will start proposing to you!'
                                : 'Guides you directly contacted will appear here.'}
                        </p>
                    </div>
                ) : (
                    displayList.map(book => (
                        <div key={book.id} className="card" style={{ display: 'flex', flexDirection: 'column', border: book.status === 'ACCEPTED' ? '1px solid #00E676' : book.status === 'CANCELLED' ? '1px solid #FF5252' : '1px solid var(--surface-border)' }}>
                            <div className="card-content" style={{ flexGrow: 1 }}>
                                <h3 style={{ fontSize: '1.4rem', color: 'var(--primary-color)' }}>👤 {book.travelerName}</h3>
                                <p style={{ fontWeight: '500', margin: '0.8rem 0' }}><span style={{ color: '#aaa' }}>Dates:</span> {book.tripDates}</p>
                                <p style={{ margin: '1.2rem 0' }}><span style={{ color: '#aaa' }}>Status:</span><StatusBadge status={book.status} /></p>

                                {book.status === 'ACCEPTED' && (
                                    <div style={{ marginTop: '1rem', padding: '1rem', background: 'rgba(76,175,80,0.1)', borderRadius: '8px' }}>
                                        <p style={{ margin: 0, color: '#4CAF50', fontWeight: 'bold' }}>🎉 Guide Chosen! Your trip is confirmed.</p>
                                        <p style={{ margin: '0.5rem 0 0 0' }}>Contact: 📞 {book.travelerPhone}</p>
                                    </div>
                                )}

                                {book.status === 'CANCELLED' && (
                                    <div style={{ marginTop: '1rem', padding: '1rem', background: 'rgba(255,87,34,0.1)', borderRadius: '8px' }}>
                                        <p style={{ margin: 0, color: '#FF5722', fontWeight: 'bold' }}>❌ Booking Cancelled</p>
                                        {book.cancellationReason && (
                                            <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.9rem', fontStyle: 'italic', color: 'rgba(255,255,255,0.7)' }}>Reason: "{book.cancellationReason}"</p>
                                        )}
                                    </div>
                                )}

                                {book.status === 'COMPLETED' && (
                                    <div style={{ marginTop: '1rem', padding: '1rem', background: 'rgba(33,150,243,0.1)', borderRadius: '8px', textAlign: 'center' }}>
                                        <p style={{ margin: '0 0 1rem 0', color: '#2196F3', fontWeight: 'bold' }}>Trip Completed!</p>
                                        <button onClick={() => handleOpenReview(book)} className="cta-button btn-secondary" style={{ margin: 0, width: '100%', fontSize: '0.9rem' }}>
                                            Leave a Review
                                        </button>
                                    </div>
                                )}
                            </div>

                            <div style={{ padding: '1rem', borderTop: '1px solid rgba(255,255,255,0.1)', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                {/* Chat available for PENDING proposals and ACCEPTED bookings */}
                                {(book.status === 'PENDING' || book.status === 'ACCEPTED') && activeTab === 'proposals' && (
                                    <button className="cta-button btn-warning" style={{ margin: 0, fontSize: '0.9rem' }} onClick={() => setActiveChatBooking(book)}>
                                        Chat with this Guide
                                    </button>
                                )}

                                {/* Chat for My Requests (Traveler contacted Guide) - only when ACCEPTED */}
                                {book.status === 'ACCEPTED' && activeTab === 'myRequests' && (
                                    <button className="cta-button btn-warning" style={{ margin: 0, fontSize: '0.9rem' }} onClick={() => setActiveChatBooking(book)}>
                                        Chat
                                    </button>
                                )}

                                {/* CANCEL — available on any ACCEPTED booking */}
                                {book.status === 'ACCEPTED' && (
                                    <button
                                        className="btn-outline-danger"
                                        style={{ margin: 0, fontSize: '0.85rem', width: '100%', borderRadius: '50px', padding: '14px 24px' }}
                                        onClick={() => { setCancelTarget(book); setCancelReason(''); }}
                                    >
                                        Cancel Booking
                                    </button>
                                )}

                                {/* CHOOSE THIS GUIDE — only for PENDING proposals in the Incoming tab */}
                                {activeTab === 'proposals' && book.status === 'PENDING' && (
                                    <button
                                        className="cta-button btn-success"
                                        style={{ margin: 0, fontSize: '0.9rem', fontWeight: 'bold' }}
                                        onClick={() => {
                                            if (window.confirm(`Choose ${book.travelerName} as your guide? This will decline all other proposals for this trip.`)) {
                                                handleStatusUpdate(book.id, 'ACCEPTED');
                                            }
                                        }}
                                    >
                                        Choose This Guide
                                    </button>
                                )}

                                {/* Decline a proposal you don't want */}
                                {activeTab === 'proposals' && book.status === 'PENDING' && (
                                    <button
                                        className="btn-outline-danger"
                                        style={{ margin: 0, fontSize: '0.85rem', width: '100%', borderRadius: '50px', padding: '14px 24px' }}
                                        onClick={() => handleStatusUpdate(book.id, 'DECLINED')}
                                    >
                                        Decline
                                    </button>
                                )}
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Cancel Booking Modal */}
            {cancelTarget && (
                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(5px)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000, padding: '1rem' }}>
                    <div className="glass-panel" style={{ maxWidth: '440px', width: '100%', border: '1px solid var(--error-color)' }}>
                        <div className="card-content" style={{ padding: '2rem' }}>
                            <h2 style={{ marginTop: 0, color: 'var(--error-color)', fontSize: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <span>⚠️</span> Cancel Booking
                            </h2>
                            <p style={{ color: '#ccc', lineHeight: '1.5', marginTop: '1rem', marginBottom: '1.5rem' }}>
                                You are about to cancel your booking with <strong style={{ color: '#fff' }}>{cancelTarget.travelerName}</strong>.
                                Please let them know why so they can plan accordingly.
                            </p>
                            <form onSubmit={submitCancellation}>
                                <div className="form-group">
                                    <label style={{ color: '#fff' }}>Reason for Cancellation *</label>
                                    <textarea
                                        value={cancelReason}
                                        onChange={(e) => setCancelReason(e.target.value)}
                                        placeholder="e.g. Change of travel plans, health issue..."
                                        rows="4"
                                        required
                                        style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(0,0,0,0.3)', color: 'white', resize: 'vertical' }}
                                    />
                                </div>
                                <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
                                    <button type="submit" className={`cta-button ${cancelSubmitting ? '' : 'btn-danger'}`} style={{ margin: 0, flex: 1 }} disabled={cancelSubmitting}>
                                        {cancelSubmitting ? 'Cancelling...' : 'Confirm'}
                                    </button>
                                    <button type="button" onClick={() => setCancelTarget(null)} className="cta-button outline" style={{ margin: 0, flex: 1 }}>
                                        Keep Booking
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {/* Review Modal */}
            {isReviewOpen && (
                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(5px)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000, padding: '1rem' }}>
                    <div className="glass-panel" style={{ maxWidth: '440px', width: '100%', border: '1px solid var(--primary-color)' }}>
                        <div className="card-content" style={{ padding: '2rem' }}>
                            <h2 style={{ marginTop: 0, color: 'var(--primary-color)', fontSize: '1.5rem', marginBottom: '0.5rem' }}>Review your Trip</h2>
                            <p style={{ color: '#ccc' }}>Guide: <strong style={{ color: '#fff' }}>{reviewTrip?.travelerName}</strong></p>

                            <form onSubmit={submitReview}>
                                <div className="form-group" style={{ textAlign: 'center', margin: '2.5rem 0' }}>
                                    {[1, 2, 3, 4, 5].map(star => (
                                        <span key={star} onClick={() => setRating(star)} style={{ fontSize: '2.5rem', cursor: 'pointer', color: star <= rating ? '#FFD700' : 'rgba(255,255,255,0.2)', margin: '0 8px', transition: 'color 0.2s' }}>★</span>
                                    ))}
                                </div>
                                <div className="form-group">
                                    <label style={{ color: '#fff' }}>Comments (Optional)</label>
                                    <textarea
                                        value={comment}
                                        onChange={(e) => setComment(e.target.value)}
                                        placeholder="How was your experience?"
                                        rows="4"
                                        style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(0,0,0,0.3)', color: 'white', resize: 'vertical', marginTop: '0.5rem' }}
                                    />
                                </div>
                                <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
                                    <button type="submit" className={`cta-button ${reviewSubmitting ? '' : 'btn-success'}`} style={{ margin: 0, flex: 1 }} disabled={reviewSubmitting}>
                                        {reviewSubmitting ? 'Submitting...' : 'Submit Review'}
                                    </button>
                                    <button type="button" onClick={() => setIsReviewOpen(false)} className="cta-button outline" style={{ margin: 0, flex: 1 }}>
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {activeChatBooking && (
                <ChatBox
                    bookingRequestId={activeChatBooking.id}
                    currentUserId={user.id}
                    otherUserId={activeChatBooking.guideId}
                    otherUserName={activeChatBooking.travelerName}
                    onClose={() => setActiveChatBooking(null)}
                />
            )}
        </div>
    );
}

export default MyBookingsPage;
