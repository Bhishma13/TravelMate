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
            <div style={{ padding: '1.5rem 4rem', width: '100%', position: 'absolute', top: 0, left: 0, borderBottom: '1px solid #e2e8f0', background: 'rgba(248,250,252,0.9)', backdropFilter: 'blur(10px)', boxSizing: 'border-box' }}>
                <Link to="/" style={{ fontSize: '1.4rem', fontWeight: '800', letterSpacing: '-0.5px', color: '#0f172a', textDecoration: 'none' }}>
                    Travel<span style={{ color: '#0d9488' }}>Mate</span>
                </Link>
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flex: 1, padding: '2rem', marginTop: '5rem' }}>
                <div className="auth-container">
                    <h2>Forgot Password</h2>
                    <p style={{ color: '#64748b', fontSize: '0.92rem', marginBottom: '1.5rem' }}>
                        Enter your registered email and we'll send you a reset link.
                    </p>

                    {status === 'success' ? (
                        <div style={{ color: '#059669', background: '#ecfdf5', padding: '1rem', borderRadius: '8px', border: '1px solid #a7f3d0', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
                            ✅ {message}
                        </div>
                    ) : status === 'error' ? (
                        <div style={{ color: '#dc2626', background: '#fef2f2', padding: '0.8rem', borderRadius: '8px', border: '1px solid #fecaca', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
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

                    <p style={{ marginTop: '2rem', color: '#64748b', fontSize: '0.9rem' }}>
                        Remember your password? <Link to="/signin" style={{ color: '#0d9488', fontWeight: 600 }}>Sign In</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default ForgotPassword;
