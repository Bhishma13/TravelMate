import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getGuideRequests, updateBookingStatus } from '../services/api';
import { useNavigate } from 'react-router-dom';

function RequestsPage() {
    const { user } = useAuth();
    const [requests, setRequests] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        if (!user || user.role !== 'guide') {
            navigate('/dashboard');
            return;
        }

        fetchRequests();
    }, [user, navigate]);

    const fetchRequests = async () => {
        setIsLoading(true);
        try {
            const data = await getGuideRequests(user.id);
            setRequests(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleStatusUpdate = async (requestId, newStatus) => {
        try {
            await updateBookingStatus(requestId, newStatus);
            // Refresh the list to reflect the new status
            fetchRequests();
        } catch (err) {
            alert(err.message);
        }
    };

    if (isLoading) return <div className="dashboard-container"><h2 style={{ textAlign: 'center' }}>Loading Requests...</h2></div>;

    return (
        <div className="dashboard-container">
            <header className="dashboard-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <button
                    onClick={() => navigate('/dashboard')}
                    style={{
                        background: 'rgba(255,255,255,0.1)',
                        border: '1px solid rgba(255,255,255,0.2)',
                        color: '#fff',
                        padding: '0.4rem 0.8rem',
                        borderRadius: '20px',
                        fontSize: '0.8rem',
                        cursor: 'pointer',
                        width: 'max-content'
                    }}
                >
                    &larr; Back to Dashboard
                </button>
                <h1 style={{ margin: 0, fontSize: '1.5rem' }}>Traveler Requests</h1>
            </header>

            {error && <p style={{ color: 'var(--error-color)', textAlign: 'center' }}>{error}</p>}

            <div className="cards-grid" style={{ marginTop: '2rem' }}>
                {requests.length === 0 ? (
                    <div className="empty-state" style={{ gridColumn: '1 / -1' }}>
                        <div style={{ fontSize: '4rem', marginBottom: '1rem', opacity: 0.5 }}>📫</div>
                        <h3 style={{ fontSize: '1.5rem', color: '#fff', marginBottom: '0.5rem' }}>No direct requests yet</h3>
                        <p style={{ maxWidth: '400px', margin: '0 auto', lineHeight: '1.6' }}>When travelers request your services, they will appear here.</p>
                    </div>
                ) : (
                    requests.map(req => (
                        <div key={req.id} className="card" style={{ border: req.status === 'PENDING' ? '1px solid #ffb300' : 'none', display: 'flex', flexDirection: 'column' }}>
                            <div className="card-content" style={{ flexGrow: 1 }}>
                                <h3 style={{ color: req.status === 'PENDING' ? '#ffb300' : '#fff' }}>{req.travelerName}</h3>
                                <p><strong>Dates Requested:</strong> {req.tripDates}</p>
                                <p><strong>Contact Phone:</strong> {req.travelerPhone}</p>
                                <p><strong>Current Status:</strong>
                                    <span style={{
                                        marginLeft: '0.5rem',
                                        padding: '0.2rem 0.5rem',
                                        borderRadius: '4px',
                                        background: req.status === 'ACCEPTED' ? 'rgba(76, 175, 80, 0.2)' : req.status === 'DECLINED' ? 'rgba(244, 67, 54, 0.2)' : 'rgba(255, 179, 0, 0.2)',
                                        color: req.status === 'ACCEPTED' ? '#4CAF50' : req.status === 'DECLINED' ? '#F44336' : '#ffb300'
                                    }}>
                                        {req.status}
                                    </span>
                                </p>
                            </div>

                            {req.status === 'PENDING' && (
                                <div style={{ display: 'flex', gap: '0.5rem', padding: '1rem', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                                    <button
                                        className="cta-button"
                                        style={{ margin: 0, flex: 1, background: '#4CAF50' }}
                                        onClick={() => handleStatusUpdate(req.id, 'ACCEPTED')}
                                    >
                                        Accept
                                    </button>
                                    <button
                                        className="cta-button"
                                        style={{ margin: 0, flex: 1, background: 'transparent', border: '1px solid #F44336', color: '#F44336' }}
                                        onClick={() => handleStatusUpdate(req.id, 'DECLINED')}
                                    >
                                        Decline
                                    </button>
                                </div>
                            )}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

export default RequestsPage;
