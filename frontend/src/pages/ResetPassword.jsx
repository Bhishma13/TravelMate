import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';

function ResetPassword() {
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token');
    const navigate = useNavigate();

    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (newPassword.length < 6) {
            setError('Password must be at least 6 characters.');
            return;
        }

        if (newPassword !== confirmPassword) {
            setError('Passwords do not match.');
            return;
        }

        setLoading(true);
        try {
            const res = await fetch('http://localhost:8081/api/auth/reset-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token, newPassword }),
            });

            const data = await res.json();
            if (res.ok) {
                navigate('/signin', { state: { message: '✅ Password updated! Please sign in with your new password.' } });
            } else {
                setError(typeof data === 'string' ? data : data.message || 'Something went wrong.');
            }
        } catch {
            setError('Could not connect to the server. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (!token) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
                <div className="auth-container">
                    <h2>Invalid Link</h2>
                    <p style={{ color: '#888' }}>This reset link is invalid or has already been used.</p>
                    <Link to="/forgot-password" style={{ color: 'var(--primary-color)' }}>Request a new reset link</Link>
                </div>
            </div>
        );
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', position: 'relative' }}>
            <div style={{ padding: '1.5rem 4rem', width: '100%', position: 'absolute', top: 0, left: 0, borderBottom: '1px solid #e2e8f0', background: 'rgba(248,250,252,0.9)', backdropFilter: 'blur(10px)', boxSizing: 'border-box' }}>
                <Link to="/" style={{ fontSize: '1.4rem', fontWeight: '800', letterSpacing: '-0.5px', color: '#0f172a', textDecoration: 'none' }}>
                    Travel<span style={{ color: '#0d9488' }}>Mate</span>
                </Link>
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flex: 1, padding: '2rem', marginTop: '5rem' }}>
                <div className="auth-container">
                    <h2>Set New Password</h2>
                    <p style={{ color: '#64748b', fontSize: '0.92rem', marginBottom: '1.5rem' }}>
                        Choose a strong new password for your account.
                    </p>

                    {error && (
                        <div style={{ color: '#dc2626', background: '#fef2f2', padding: '0.8rem', borderRadius: '8px', border: '1px solid #fecaca', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label>New Password</label>
                            <input
                                type="password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                required
                                placeholder="Min. 6 characters"
                            />
                        </div>

                        <div className="form-group">
                            <label>Confirm New Password</label>
                            <input
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                                placeholder="••••••••"
                            />
                        </div>

                        <button type="submit" style={{ marginTop: '1.5rem' }} disabled={loading}>
                            {loading ? 'Updating...' : 'Update Password'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default ResetPassword;
