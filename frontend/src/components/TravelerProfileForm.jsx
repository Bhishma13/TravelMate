import React, { useState } from 'react';
import { updateTravelerProfile } from '../services/api';

function TravelerProfileForm({ userId, initialData, onComplete }) {
    const [formData, setFormData] = useState({
        location: initialData?.location || '',
        requesting: initialData?.requesting || '',
        date: initialData?.date || '',
        budget: initialData?.budget || ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            await updateTravelerProfile({ userId, ...formData });
            if (onComplete) onComplete();
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="auth-form" style={{ maxWidth: '600px', margin: '0 auto' }}>
            <h2>Complete Traveler Profile</h2>
            {error && <p className="error-text">{error}</p>}

            <div className="form-group">
                <label>Current Location or Base City</label>
                <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    placeholder="e.g., Delhi, Mumbai, New York"
                    required
                />
            </div>

            <div className="form-group">
                <label>What kind of trip are you requesting?</label>
                <input
                    type="text"
                    name="requesting"
                    value={formData.requesting}
                    onChange={handleChange}
                    placeholder="e.g., Delhi Historical Tour"
                    required
                />
            </div>

            <div className="form-group">
                <label>Preferred Travel Date</label>
                <input
                    type="text"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    placeholder="e.g., Oct 2024 or Flexible"
                    required
                />
            </div>

            <div className="form-group">
                <label>Estimated Budget</label>
                <input
                    type="text"
                    name="budget"
                    value={formData.budget}
                    onChange={handleChange}
                    placeholder="e.g., $500 or ₹10000"
                    required
                />
            </div>

            <button type="submit" className="cta-button" disabled={loading} style={{ width: '100%' }}>
                {loading ? 'Saving...' : 'Save Profile'}
            </button>
        </form>
    );
}

export default TravelerProfileForm;
