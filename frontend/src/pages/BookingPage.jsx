import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Navigate, useNavigate, useParams, useLocation } from 'react-router-dom';
import { createBookingRequest, getTravelerRequests } from '../services/api';

function BookingPage() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const { guideId } = useParams();
    const location = useLocation();

    // The guide's name/data passed from the Dashboard so we don't need a DB lookup here
    const guideName = location.state?.guideName || "this guide";

    const [tripDates, setTripDates] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [existingBooking, setExistingBooking] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (user && user.role === 'traveler') {
            getTravelerRequests(user.id)
                .then(requests => {
                    const active = requests.find(r => r.guideId === parseInt(guideId, 10) && (r.status === 'PENDING' || r.status === 'ACCEPTED'));
                    if (active) {
                        setExistingBooking(active);
                    }
                })
                .catch(err => console.error("Failed to fetch traveler's bookings", err))
                .finally(() => setIsLoading(false));
        } else {
            setIsLoading(false);
        }
    }, [user, guideId]);

    if (!user || user.role !== 'traveler') {
        return <Navigate to="/dashboard" />;
    }

    if (isLoading) {
        return <div className="auth-container" style={{ textAlign: 'center', marginTop: '5rem' }}><h2>Loading...</h2></div>;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!tripDates.trim()) {
            setError("Please enter your trip dates.");
            return;
        }

        setIsSubmitting(true);
        try {
            await createBookingRequest({
                travelerId: user.id,
                guideId: parseInt(guideId, 10),
                tripDates: tripDates
            });
            // Show a quick success alert and bounce back to Dashboard
            alert(`Booking Request sent to ${guideName}!`);
            navigate('/dashboard');
        } catch (err) {
            setError(err.message || 'Failed to send request. Please try again.');
            setIsSubmitting(false);
        }
    };

    return (
        <div className="auth-container" style={{ textAlign: 'center', position: 'relative', marginTop: '10vh' }}>
            <button
                onClick={() => navigate('/dashboard')}
                className="cta-button outline"
                style={{
                    position: 'absolute',
                    top: '1.5rem',
                    right: '1.5rem',
                    padding: '0.4rem 1rem',
                    borderRadius: '50px',
                    fontSize: '0.85rem',
                    cursor: 'pointer',
                    width: 'max-content',
                    borderColor: 'var(--surface-border)',
                    color: '#ccc'
                }}
            >
                ✕ Close
            </button>
            <h2 style={{ marginTop: '1rem', color: 'var(--primary-color)' }}>Contact Guide</h2>
            <p style={{ color: '#ccc', marginBottom: '2.5rem', fontSize: '1.1rem' }}>
                You are requesting to book <strong style={{ color: '#fff' }}>{guideName}</strong>.
            </p>

            {error && <div style={{ color: 'var(--error-color)', marginBottom: '1.5rem', background: 'rgba(255,82,82,0.1)', padding: '12px', borderRadius: '8px', border: '1px solid rgba(255,82,82,0.3)' }}>{error}</div>}

            {existingBooking ? (
                <div style={{ background: 'rgba(0,0,0,0.3)', padding: '2rem', borderRadius: '15px', marginBottom: '1rem', border: '1px solid var(--surface-border)' }}>
                    <p style={{ margin: '0 0 1rem 0', color: '#ffb300', fontSize: '1.2rem', fontWeight: 'bold' }}>You already have an active request!</p>
                    <p style={{ margin: '0.5rem 0', color: '#ddd' }}>Dates: {existingBooking.tripDates}</p>
                    <p style={{ margin: '1rem 0' }}>
                        <span style={{
                            padding: '0.4rem 1rem',
                            borderRadius: '50px',
                            background: existingBooking.status === 'ACCEPTED' ? 'rgba(0, 230, 118, 0.15)' : 'rgba(255, 179, 0, 0.15)',
                            color: existingBooking.status === 'ACCEPTED' ? '#00E676' : '#ffb300',
                            fontSize: '0.9rem',
                            fontWeight: 'bold',
                            border: `1px solid ${existingBooking.status === 'ACCEPTED' ? '#00E676' : '#ffb300'}`
                        }}>
                            Status: {existingBooking.status}
                        </span>
                    </p>
                    <button
                        onClick={() => navigate('/my-bookings')}
                        className="cta-button"
                        style={{ marginTop: '2rem' }}
                    >
                        View My Bookings
                    </button>
                </div>
            ) : (
                <form onSubmit={handleSubmit} style={{ textAlign: 'left' }}>
                    <div className="form-group">
                        <label style={{ color: '#fff' }}>When is your trip?</label>
                        <input
                            type="text"
                            placeholder="e.g. Dec 1st - Dec 5th"
                            value={tripDates}
                            onChange={(e) => setTripDates(e.target.value)}
                            required
                        />
                    </div>

                    <button type="submit" disabled={isSubmitting} className="cta-button" style={{ marginTop: '1.5rem' }}>
                        {isSubmitting ? 'Sending Request...' : 'Send Request 🚀'}
                    </button>
                </form>
            )}
        </div>
    );
}

export default BookingPage;
