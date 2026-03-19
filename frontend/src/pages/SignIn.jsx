import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function SignIn() {
    const [role, setRole] = useState('traveler');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setError('Please enter a valid email address.');
            return;
        }

        try {
            await login({ email, password }); // Backend will return role
            navigate('/dashboard');
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', position: 'relative' }}>
            <div style={{ padding: '2rem 4rem', width: '100%', position: 'absolute', top: 0, left: 0 }}>
                <Link to="/" className="brand-name" style={{
                    fontSize: '1.8rem', fontWeight: '800', letterSpacing: '-1px',
                    background: 'linear-gradient(135deg, var(--primary-color) 0%, #00ffcc 100%)',
                    WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                    textDecoration: 'none'
                }}>
                    TravelMate
                </Link>
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flex: 1, padding: '2rem', marginTop: '2rem' }}>
                <div className="auth-container">
                    <h2>Sign In</h2>
                    {error && <p className="error-message" style={{ color: 'var(--error-color)', background: 'rgba(255,82,82,0.1)', padding: '0.8rem', borderRadius: '8px', border: '1px solid rgba(255,82,82,0.3)' }}>{error}</p>}

                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label>I am a:</label>
                            <select value={role} onChange={(e) => setRole(e.target.value)}>
                                <option value="traveler">Traveler</option>
                                <option value="guide">Guide</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label>Email Address</label>
                            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="you@example.com" />
                        </div>

                        <div className="form-group">
                            <label>Password</label>
                            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required placeholder="••••••••" />
                        </div>

                        <button type="submit" style={{ marginTop: '1.5rem' }}>Sign In</button>
                    </form>

                    <p style={{ marginTop: '2.5rem', color: '#888', fontSize: '0.95rem' }}>
                        Don't have an account? <Link to="/signup">Sign Up</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default SignIn;
