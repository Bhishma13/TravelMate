import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function SignIn() {
    const [role, setRole] = useState('traveler');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const location = useLocation();
    const [message, setMessage] = useState(location.state?.message || '');
    const { login, user } = useAuth();

    useEffect(() => {
        if (user) {
            navigate('/dashboard');
        }
    }, [user, navigate]);

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
                <div className="auth-container">
                    <h2>Sign In</h2>
                    {message && <p style={{ color: '#059669', background: '#ecfdf5', padding: '0.8rem', borderRadius: '8px', border: '1px solid #a7f3d0', marginBottom: '1.5rem', fontSize: '0.9rem' }}>{message}</p>}
                    {error && <p style={{ color: '#dc2626', background: '#fef2f2', padding: '0.8rem', borderRadius: '8px', border: '1px solid #fecaca', marginBottom: '1.5rem', fontSize: '0.9rem' }}>{error}</p>}

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
                            <div style={{ textAlign: 'right', marginTop: '0.5rem' }}>
                                <Link to="/forgot-password" style={{ fontSize: '0.88rem', color: 'var(--primary-color)', textDecoration: 'none' }}>
                                    Forgot Password?
                                </Link>
                            </div>
                        </div>

                        <button type="submit" style={{ marginTop: '1.5rem' }}>Sign In</button>
                    </form>

                    <p style={{ marginTop: '2rem', color: '#64748b', fontSize: '0.9rem' }}>
                        Don't have an account? <Link to="/signup" style={{ color: '#0d9488', fontWeight: 600 }}>Sign Up</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default SignIn;
