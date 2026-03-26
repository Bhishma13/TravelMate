import React, { useState } from 'react';
import { updateTravelerProfile, uploadImage } from '../services/api';
import { useAuth } from '../context/AuthContext';

function TravelerProfileForm({ userId, initialData, onComplete }) {
    const { updateUser } = useAuth();
    const [formData, setFormData] = useState({
        location: initialData?.location || '',
        imageUrl: initialData?.imageUrl || '',
    });
    const [imageFile, setImageFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setImageFile(e.target.files[0]);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            let finalImageUrl = formData.imageUrl;
            if (imageFile) {
                finalImageUrl = await uploadImage(imageFile);
            }
            await updateTravelerProfile({ userId, ...formData, imageUrl: finalImageUrl });
            if (updateUser) {
                updateUser({ profileCompleted: true });
            }
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
            <p style={{ color: 'rgba(255,255,255,0.7)', marginBottom: '2rem', lineHeight: '1.6' }}>
                Just tell us where you're based! You can post your specific trips (destination, dates, what you need) from the <strong>Post a Trip</strong> page on the Dashboard.
            </p>
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
                <label>Profile Picture (Optional)</label>
                {formData.imageUrl && !imageFile && (
                    <img src={formData.imageUrl} alt="Profile" style={{ width: '80px', height: '80px', borderRadius: '50%', marginBottom: '1rem', objectFit: 'cover' }} />
                )}
                {imageFile && (
                    <p style={{ fontSize: '0.85rem', color: '#4caf50', marginBottom: '0.5rem' }}>Selected: {imageFile.name}</p>
                )}
                <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                />
            </div>

            <button type="submit" className="cta-button" disabled={loading} style={{ width: '100%' }}>
                {loading ? 'Saving...' : 'Save Profile'}
            </button>
        </form>
    );
}

export default TravelerProfileForm;
