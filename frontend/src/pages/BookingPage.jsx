import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Navigate, useNavigate, useParams, useLocation } from 'react-router-dom';
import { createBookingRequest } from '../services/api';

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

    if (!user || user.role !== 'traveler') {
        return <Navigate to="/dashboard" />;
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
        <div className="auth-container" style={{ textAlign: 'center', position: 'relative' }}>
            <button
                onClick={() => navigate('/dashboard')}
                style={{
                    position: 'absolute',
                    top: '1rem',
                    right: '1rem',
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
                Back to Dashboard
            </button>
            <h2 style={{ marginTop: '2rem' }}>Contact Guide</h2>
            <p style={{ color: '#ccc', marginBottom: '2rem' }}>
                You are requesting to book <strong>{guideName}</strong>.
            </p>

            {error && <div style={{ color: 'var(--error-color)', marginBottom: '1rem' }}>{error}</div>}

            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>When is your trip?</label>
                    <input
                        type="text"
                        placeholder="e.g. Dec 1st - Dec 5th"
                        value={tripDates}
                        onChange={(e) => setTripDates(e.target.value)}
                        required
                    />
                </div>

                <button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? 'Sending Request...' : 'Send Request'}
                </button>
            </form>
        </div>
    );
}

export default BookingPage;
