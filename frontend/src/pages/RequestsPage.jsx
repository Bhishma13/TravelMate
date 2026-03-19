import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getGuideRequests, updateBookingStatus } from '../services/api';
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

function RequestsPage() {
    const { user } = useAuth();
    const [allRequests, setAllRequests] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [activeTab, setActiveTab] = useState('incoming');
    const [activeChatBooking, setActiveChatBooking] = useState(null);

    // Cancel Modal
    const [cancelTarget, setCancelTarget] = useState(null);
    const [cancelReason, setCancelReason] = useState('');
    const [cancelSubmitting, setCancelSubmitting] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        if (!user || user.role !== 'guide') { navigate('/dashboard'); return; }
        fetchRequests();
    }, [user, navigate]);

    const fetchRequests = async () => {
        setIsLoading(true);
        try {
            const data = await getGuideRequests(user.id);
            setAllRequests(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleStatusUpdate = async (requestId, newStatus) => {
        try {
            await updateBookingStatus(requestId, newStatus);
            fetchRequests();
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
            fetchRequests();
        } catch (err) {
            alert(err.message);
        } finally {
            setCancelSubmitting(false);
        }
    };

    // tripPostId == null → Traveler directly contacted Guide (Incoming Requests)
    // tripPostId != null → Guide sent a Proposal to Traveler's trip post (My Proposals)
    const incomingRequests = allRequests.filter(r => r.tripPostId == null);
    const myProposals = allRequests.filter(r => r.tripPostId != null);
    const displayList = activeTab === 'incoming' ? incomingRequests : myProposals;

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
                <button className={`tab-button ${activeTab === 'incoming' ? 'active' : ''}`} onClick={() => setActiveTab('incoming')}>
                    Traveler Requests
                    {incomingRequests.filter(r => r.status === 'PENDING').length > 0 && (
                        <span style={{ marginLeft: '0.5rem', background: '#ff4444', color: '#fff', borderRadius: '50%', padding: '2px 8px', fontSize: '0.75rem', fontWeight: 'bold' }}>
                            {incomingRequests.filter(r => r.status === 'PENDING').length}
                        </span>
                    )}
                </button>
                <button className={`tab-button ${activeTab === 'proposals' ? 'active' : ''}`} onClick={() => setActiveTab('proposals')}>
                    My Proposals
                </button>
            </div>

            {/* CARDS */}
            <div className="cards-grid">
                {displayList.length === 0 ? (
                    <div className="empty-state" style={{ gridColumn: '1 / -1' }}>
                        <div style={{ fontSize: '4rem', marginBottom: '1rem', opacity: 0.5 }}>{activeTab === 'incoming' ? '📫' : '📤'}</div>
                        <h3 style={{ fontSize: '1.5rem', color: '#fff', marginBottom: '0.5rem' }}>
                            {activeTab === 'incoming' ? 'No incoming requests' : 'No proposals sent yet'}
                        </h3>
                        <p style={{ maxWidth: '400px', margin: '0 auto', lineHeight: '1.6' }}>
                            {activeTab === 'incoming'
                                ? 'When travelers contact you directly, their requests appear here.'
                                : 'Browse the Job Board and send proposals to travelers!'}
                        </p>
                    </div>
                ) : (
                    displayList.map(req => (
                        <div key={req.id} className="card" style={{ display: 'flex', flexDirection: 'column', border: req.status === 'ACCEPTED' ? '1px solid #00E676' : req.status === 'CANCELLED' ? '1px solid #FF5252' : '1px solid var(--surface-border)' }}>
                            <div className="card-content" style={{ flexGrow: 1 }}>
                                <h3 style={{ fontSize: '1.4rem', color: 'var(--primary-color)' }}>👤 {req.travelerName}</h3>
                                <p style={{ fontWeight: '500', margin: '0.8rem 0' }}><span style={{ color: '#aaa' }}>Dates:</span> {req.tripDates}</p>
                                {activeTab === 'incoming' && req.travelerPhone && (
                                    <p style={{ margin: '0.8rem 0' }}><span style={{ color: '#aaa' }}>Phone:</span> {req.travelerPhone}</p>
                                )}
                                <p style={{ margin: '1.2rem 0' }}><span style={{ color: '#aaa' }}>Status:</span><StatusBadge status={req.status} /></p>

                                {req.status === 'ACCEPTED' && (
                                    <div style={{ marginTop: '1rem', padding: '1rem', background: 'rgba(76,175,80,0.1)', borderRadius: '8px' }}>
                                        <p style={{ margin: 0, color: '#4CAF50', fontWeight: 'bold' }}>🎉 You were chosen for this trip!</p>
                                    </div>
                                )}

                                {req.status === 'CANCELLED' && (
                                    <div style={{ marginTop: '1rem', padding: '1rem', background: 'rgba(255,87,34,0.1)', borderRadius: '8px' }}>
                                        <p style={{ margin: 0, color: '#FF5722', fontWeight: 'bold' }}>❌ Booking Cancelled</p>
                                        {req.cancellationReason && (
                                            <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.9rem', fontStyle: 'italic', color: 'rgba(255,255,255,0.7)' }}>
                                                Reason: "{req.cancellationReason}"
                                            </p>
                                        )}
                                    </div>
                                )}

                                {activeTab === 'proposals' && req.status === 'PENDING' && (
                                    <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.5)', marginTop: '0.5rem', fontStyle: 'italic' }}>
                                        Waiting for the traveler to review your proposal...
                                    </p>
                                )}

                                {activeTab === 'proposals' && req.status === 'DECLINED' && (
                                    <p style={{ fontSize: '0.85rem', color: '#F44336', marginTop: '0.5rem', fontStyle: 'italic' }}>
                                        The traveler chose a different guide.
                                    </p>
                                )}
                            </div>

                            <div style={{ padding: '1rem', borderTop: '1px solid rgba(255,255,255,0.1)', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                {/* Chat — on PENDING or ACCEPTED bookings */}
                                {(req.status === 'PENDING' || req.status === 'ACCEPTED') && (
                                    <button className="cta-button btn-warning" style={{ margin: 0, fontSize: '0.9rem' }} onClick={() => setActiveChatBooking(req)}>
                                        Chat with Traveler
                                    </button>
                                )}

                                {/* INCOMING: Accept/Decline — Traveler booked you directly */}
                                {activeTab === 'incoming' && req.status === 'PENDING' && (
                                    <>
                                        <button className="cta-button btn-success" style={{ margin: 0 }} onClick={() => handleStatusUpdate(req.id, 'ACCEPTED')}>
                                            Accept
                                        </button>
                                        <button className="btn-outline-danger" style={{ margin: 0, padding: '14px 24px', borderRadius: '50px', width: '100%', fontSize: '0.9rem' }} onClick={() => handleStatusUpdate(req.id, 'DECLINED')}>
                                            Decline
                                        </button>
                                    </>
                                )}

                                {/* Mark as Completed */}
                                {activeTab === 'incoming' && req.status === 'ACCEPTED' && (
                                    <button className="cta-button" style={{ margin: 0, background: 'linear-gradient(135deg, #2196F3 0%, #1976D2 100%)', color: '#fff', fontSize: '0.9rem' }} onClick={() => handleStatusUpdate(req.id, 'COMPLETED')}>
                                        Mark as Completed
                                    </button>
                                )}

                                {/* CANCEL — available on any ACCEPTED booking */}
                                {req.status === 'ACCEPTED' && (
                                    <button
                                        className="btn-outline-danger"
                                        style={{ margin: 0, fontSize: '0.85rem', padding: '14px 24px', borderRadius: '50px', width: '100%' }}
                                        onClick={() => { setCancelTarget(req); setCancelReason(''); }}
                                    >
                                        Cancel Booking
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
                                You are about to cancel the booking with <strong style={{ color: '#fff' }}>{cancelTarget.travelerName}</strong>.
                                Please provide a reason so they can plan accordingly.
                            </p>
                            <form onSubmit={submitCancellation}>
                                <div className="form-group">
                                    <label style={{ color: '#fff' }}>Reason for Cancellation *</label>
                                    <textarea
                                        value={cancelReason}
                                        onChange={(e) => setCancelReason(e.target.value)}
                                        placeholder="e.g. Schedule conflict, health issue..."
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

            {activeChatBooking && (
                <ChatBox
                    bookingRequestId={activeChatBooking.id}
                    currentUserId={user.id}
                    otherUserId={activeChatBooking.travelerId}
                    otherUserName={activeChatBooking.travelerName}
                    onClose={() => setActiveChatBooking(null)}
                />
            )}
        </div>
    );
}

export default RequestsPage;
