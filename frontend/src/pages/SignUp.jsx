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
            navigate('/signin', { state: { message: 'Registration successful! Please sign in.' } });
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', position: 'relative' }}>
            <div style={{ padding: '1.5rem 4rem', width: '100%', position: 'absolute', top: 0, left: 0, borderBottom: '1px solid #e2e8f0', background: 'rgba(248,250,252,0.9)', backdropFilter: 'blur(10px)', boxSizing: 'border-box' }}>
                <Link to="/" style={{ fontSize: '1.4rem', fontWeight: '800', letterSpacing: '-0.5px', color: '#0f172a', textDecoration: 'none' }}>
                    Travel<span style={{ color: '#0d9488' }}>Mate</span>
                </Link>
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flex: 1, padding: '2rem', marginTop: '5rem' }}>
                <div className="auth-container" style={{ maxWidth: '600px' }}>
                    <h2>Create Account</h2>
                    {error && <p style={{ color: '#dc2626', background: '#fef2f2', padding: '0.8rem', borderRadius: '8px', border: '1px solid #fecaca', marginBottom: '1.5rem', fontSize: '0.9rem' }}>{error}</p>}

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
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 1.5rem' }}>
                            <div className="form-group">
                                <label>Full Name</label>
                                <input type="text" name="name" value={formData.name} onChange={handleChange} required placeholder="John Doe" />
                            </div>
                            <div className="form-group">
                                <label>Email Address</label>
                                <input type="email" name="email" value={formData.email} onChange={handleChange} required placeholder="you@example.com" />
                            </div>
                            <div className="form-group">
                                <label>Phone Number</label>
                                <input type="tel" name="phone" value={formData.phone} onChange={handleChange} required placeholder="10-digit number" />
                            </div>
                            <div className="form-group">
                                <label>Password</label>
                                <input type="password" name="password" value={formData.password} onChange={handleChange} required placeholder="••••••••" />
                            </div>
                        </div>

                        {role === 'guide' && (
                            <div className="form-group" style={{ marginTop: '0.5rem' }}>
                                <label>Aadhaar Number (Guides Only)</label>
                                <input type="text" name="adhaar" value={formData.adhaar} onChange={handleChange} required placeholder="12-digit ID" />
                            </div>
                        )}

                        <button type="submit" style={{ marginTop: '1.5rem' }}>Create Account</button>
                    </form>

                    <p style={{ marginTop: '2rem', color: '#64748b', fontSize: '0.9rem' }}>
                        Already have an account? <Link to="/signin" style={{ color: '#0d9488', fontWeight: 600 }}>Sign In</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default SignUp;
