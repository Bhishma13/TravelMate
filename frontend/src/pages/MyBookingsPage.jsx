import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getTravelerRequests } from '../services/api';
import { useNavigate } from 'react-router-dom';

function MyBookingsPage() {
    const { user } = useAuth();
    const [bookings, setBookings] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        if (!user || user.role !== 'traveler') {
            navigate('/dashboard');
            return;
        }
        fetchBookings();
    }, [user, navigate]);

    const fetchBookings = async () => {
        setIsLoading(true);
        try {
            const data = await getTravelerRequests(user.id);
            setBookings(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) return <div className="dashboard-container"><h2 style={{ textAlign: 'center' }}>Loading Bookings...</h2></div>;

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
                <h1 style={{ margin: 0, fontSize: '1.5rem' }}>My Bookings</h1>
            </header>

            {error && <p style={{ color: 'var(--error-color)', textAlign: 'center' }}>{error}</p>}

            <div className="cards-grid" style={{ marginTop: '2rem' }}>
                {bookings.length === 0 ? (
                    <div className="empty-state" style={{ gridColumn: '1 / -1' }}>
                        <div style={{ fontSize: '4rem', marginBottom: '1rem', opacity: 0.5 }}>✈️</div>
                        <h3 style={{ fontSize: '1.5rem', color: '#fff', marginBottom: '0.5rem' }}>No bookings found</h3>
                        <p style={{ maxWidth: '400px', margin: '0 auto', lineHeight: '1.6' }}>You haven't requested any guides yet. Go back to the Dashboard to find your perfect TravelMate!</p>
                    </div>
                ) : (
                    bookings.map(book => (
                        <div key={book.id} className="card" style={{ border: book.status === 'ACCEPTED' ? '1px solid #4CAF50' : 'none' }}>
                            <div className="card-content">
                                <h3 style={{ color: book.status === 'ACCEPTED' ? '#4CAF50' : '#fff' }}>Guide: {book.travelerName}</h3>
                                <p><strong>Dates Requested:</strong> {book.tripDates}</p>
                                <p><strong>Status:</strong>
                                    <span style={{
                                        marginLeft: '0.5rem',
                                        padding: '0.2rem 0.5rem',
                                        borderRadius: '4px',
                                        background: book.status === 'ACCEPTED' ? 'rgba(76, 175, 80, 0.2)' : book.status === 'DECLINED' ? 'rgba(244, 67, 54, 0.2)' : 'rgba(255, 179, 0, 0.2)',
                                        color: book.status === 'ACCEPTED' ? '#4CAF50' : book.status === 'DECLINED' ? '#F44336' : '#ffb300'
                                    }}>
                                        {book.status}
                                    </span>
                                </p>

                                {book.status === 'ACCEPTED' && (
                                    <div style={{ marginTop: '1rem', padding: '1rem', background: 'rgba(255,255,255,0.05)', borderRadius: '8px' }}>
                                        <p style={{ margin: 0, color: '#4CAF50', fontWeight: 'bold' }}>🎉 Request Accepted!</p>
                                        <p style={{ margin: '0.5rem 0 0 0' }}>Call your guide to finalize details:</p>
                                        <p style={{ fontSize: '1.2rem', margin: '0.5rem 0 0 0', letterSpacing: '1px' }}>📞 {book.travelerPhone}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

export default MyBookingsPage;
