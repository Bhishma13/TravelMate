import React, { useState } from 'react';
import { updateProfile, enhanceProfile, uploadImage } from '../services/api';

import { useAuth } from '../context/AuthContext';

function GuideProfileForm({ userId, onComplete, initialData }) {
    const { updateUser } = useAuth();
    const [formData, setFormData] = useState({
        location: initialData?.location || '',
        experience: initialData?.experience || '',
        about: initialData?.about || '',
        imageUrl: initialData?.imageUrl || '',
    });
    const [imageFile, setImageFile] = useState(null);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [isEnhancing, setIsEnhancing] = useState(false);

    const handleEnhance = async () => {
        if (!formData.about || formData.about.trim().length < 5) {
            setError("Please type a few keywords in the 'About You' box first to use AI.");
            return;
        }
        setIsEnhancing(true);
        setError('');
        try {
            const enhancedText = await enhanceProfile(formData.about);
            setFormData(prev => ({ ...prev, about: enhancedText }));
        } catch (err) {
            setError(err.message || "Failed to enhance profile. Please try again.");
        } finally {
            setIsEnhancing(false);
        }
    };

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
        setError('');
        try {
            let finalImageUrl = formData.imageUrl;
            if (imageFile) {
                finalImageUrl = await uploadImage(imageFile);
            }
            await updateProfile({ userId, ...formData, imageUrl: finalImageUrl });
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
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '0.5rem' }}>
                        <label style={{ margin: 0 }}>About You:</label>
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
                        name="about"
                        value={formData.about}
                        onChange={handleChange}
                        placeholder="Describe your expertise and what makes you a great guide..."
                        rows="4"
                        className="form-textarea"
                        required
                    />
                </div>

                <div className="form-group">
                    <label>Profile Picture (Optional):</label>
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

                <button type="submit" disabled={loading}>
                    {loading ? 'Saving...' : (initialData ? 'Update Profile' : 'Save Profile')}
                </button>
            </form>
        </div>
    );
}

export default GuideProfileForm;
