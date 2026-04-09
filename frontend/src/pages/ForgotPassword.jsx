import React, { useState } from 'react';
import { Link } from 'react-router-dom';

function ForgotPassword() {
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState(''); // 'success' | 'error' | ''
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setStatus('');

        try {
            const res = await fetch('http://localhost:8081/api/auth/forgot-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            });

            const data = await res.json();
            if (res.ok) {
                setStatus('success');
                setMessage(data.message);
            } else {
                setStatus('error');
                setMessage(data || 'Something went wrong. Please try again.');
            }
        } catch {
            setStatus('error');
            setMessage('Could not connect to the server. Please try again.');
        } finally {
            setLoading(false);
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
                    <h2>Forgot Password</h2>
                    <p style={{ color: '#888', fontSize: '0.95rem', marginBottom: '1.5rem' }}>
                        Enter your registered email and we'll send you a reset link.
                    </p>

                    {status === 'success' ? (
                        <div style={{ color: '#4caf50', background: 'rgba(76,175,80,0.1)', padding: '1rem', borderRadius: '8px', border: '1px solid rgba(76,175,80,0.3)', marginBottom: '1.5rem' }}>
                            ✅ {message}
                        </div>
                    ) : status === 'error' ? (
                        <div style={{ color: 'var(--error-color)', background: 'rgba(255,82,82,0.1)', padding: '0.8rem', borderRadius: '8px', border: '1px solid rgba(255,82,82,0.3)', marginBottom: '1.5rem' }}>
                            {message}
                        </div>
                    ) : null}

                    {status !== 'success' && (
                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label>Email Address</label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    placeholder="you@example.com"
                                />
                            </div>
                            <button type="submit" style={{ marginTop: '1.5rem' }} disabled={loading}>
                                {loading ? 'Sending...' : 'Send Reset Link'}
                            </button>
                        </form>
                    )}

                    <p style={{ marginTop: '2rem', color: '#888', fontSize: '0.95rem' }}>
                        Remember your password? <Link to="/signin">Sign In</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default ForgotPassword;
