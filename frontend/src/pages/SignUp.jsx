import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function SignUp() {
    const [role, setRole] = useState('traveler');
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        password: '',
        adhaar: '',
    });
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { register } = useAuth();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        // Validations
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            setError('Please enter a valid email address.');
            return;
        }

        const phoneRegex = /^\d{10}$/;
        if (!phoneRegex.test(formData.phone)) {
            setError('Phone number must be exactly 10 digits.');
            return;
        }

        if (role === 'guide') {
            const adhaarRegex = /^\d{12}$/;
            if (!adhaarRegex.test(formData.adhaar)) {
                setError('Aadhaar number must be exactly 12 digits.');
                return;
            }
        }

        try {
            await register({ role, ...formData });
            navigate('/dashboard');
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="auth-container">
            <h2>Sign Up</h2>
            {error && <p className="error-message" style={{ color: 'var(--error-color)' }}>{error}</p>}
            <div className="role-selection">
                <label>
                    <input
                        type="radio"
                        value="traveler"
                        checked={role === 'traveler'}
                        onChange={(e) => setRole(e.target.value)}
                    />
                    Traveler
                </label>
                <label>
                    <input
                        type="radio"
                        value="guide"
                        checked={role === 'guide'}
                        onChange={(e) => setRole(e.target.value)}
                    />
                    Guide
                </label>
            </div>

            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Name:</label>
                    <input type="text" name="name" value={formData.name} onChange={handleChange} required />
                </div>
                <div className="form-group">
                    <label>Email:</label>
                    <input type="email" name="email" value={formData.email} onChange={handleChange} required />
                </div>
                <div className="form-group">
                    <label>Phone:</label>
                    <input type="tel" name="phone" value={formData.phone} onChange={handleChange} required />
                </div>
                <div className="form-group">
                    <label>Password:</label>
                    <input type="password" name="password" value={formData.password} onChange={handleChange} required />
                </div>

                {role === 'guide' && (
                    <div className="form-group">
                        <label>Adhaar Number:</label>
                        <input type="text" name="adhaar" value={formData.adhaar} onChange={handleChange} required />
                    </div>
                )}

                <button type="submit">Sign Up</button>
            </form>
            <p>
                Already have an account? <Link to="/signin">Sign In</Link>
            </p>
        </div>
    );
}

export default SignUp;
