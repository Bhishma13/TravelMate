import React, { useState } from 'react';
import { updateProfile } from '../services/api';

import { useAuth } from '../context/AuthContext';

function GuideProfileForm({ userId, onComplete, initialData }) {
    const { updateUser } = useAuth();
    const [formData, setFormData] = useState({
        location: initialData?.location || '',
        experience: initialData?.experience || '',
        about: initialData?.about || '',
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            await updateProfile({ userId, ...formData });
            if (updateUser) {
                updateUser({ profileCompleted: true });
            }
            onComplete();
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container profile-form-container">
            <h2>{initialData ? 'Edit Your Profile' : 'Complete Your Profile'}</h2>
            <p>Tell travelers a bit more about yourself to get started.</p>
            {error && <p className="error-message" style={{ color: 'var(--error-color)' }}>{error}</p>}

            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Location (where do you guide?):</label>
                    <input
                        type="text"
                        name="location"
                        value={formData.location}
                        onChange={handleChange}
                        placeholder="e.g. Manali, Goa, Jaipur"
                        required
                    />
                </div>

                <div className="form-group">
                    <label>Experience:</label>
                    <input
                        type="text"
                        name="experience"
                        value={formData.experience}
                        onChange={handleChange}
                        placeholder="e.g. 5 years, Certified Trekking Guide"
                        required
                    />
                </div>

                <div className="form-group">
                    <label>About You:</label>
                    <textarea
                        name="about"
                        value={formData.about}
                        onChange={handleChange}
                        placeholder="Describe your expertise and what makes you a great guide..."
                        rows="4"
                        className="form-textarea"
                        required
                    />
                </div>

                <button type="submit" disabled={loading}>
                    {loading ? 'Saving...' : (initialData ? 'Update Profile' : 'Save Profile')}
                </button>
            </form>
        </div>
    );
}

export default GuideProfileForm;
