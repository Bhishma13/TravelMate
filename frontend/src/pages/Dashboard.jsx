import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Navigate, useNavigate } from 'react-router-dom';

import { getGuideProfile, getTravelerProfile, getUsersByRole, getGuideRequests } from '../services/api';

function Dashboard() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [showProfileView, setShowProfileView] = React.useState(false);
    const [guideProfile, setGuideProfile] = React.useState(null);
    const [travelerProfile, setTravelerProfile] = React.useState(null);
    const [dataToShow, setDataToShow] = React.useState([]);
    const [currentPage, setCurrentPage] = React.useState(0);
    const [totalPages, setTotalPages] = React.useState(0);
    const [searchTerm, setSearchTerm] = React.useState('');
    const [activeSearch, setActiveSearch] = React.useState('');
    const [isLoading, setIsLoading] = React.useState(true);

    // Fetch profile data when opening the profile view
    // Fetch profile data when opening the profile view
    React.useEffect(() => {
        if (showProfileView && user) {
            if (user.role === 'guide') {
                getGuideProfile(user.id)
                    .then(data => setGuideProfile(data))
                    .catch(err => console.error("Failed to load profile", err));
            } else {
                getTravelerProfile(user.id)
                    .then(data => setTravelerProfile(data))
                    .catch(err => console.error("Failed to load traveler profile", err));
            }
        }
    }, [showProfileView, user]);

    React.useEffect(() => {
        if (user) {
            setIsLoading(true);
            const roleToFetch = user.role === 'guide' ? 'traveler' : 'guide';
            getUsersByRole(roleToFetch, currentPage, 10, activeSearch) // Size 10
                .then(data => {
                    setDataToShow(data.content);
                    setTotalPages(data.totalPages);
                })
                .catch(err => console.error(`Failed to load ${roleToFetch}s`, err))
                .finally(() => setIsLoading(false));
        }
    }, [user, currentPage, activeSearch]);

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        setCurrentPage(0); // Reset to first page
        setActiveSearch(searchTerm); // Trigger fetch
    };

    if (!user) {
        return <Navigate to="/signin" />;
    }

    const isGuide = user.role === 'guide';
    const title = isGuide ? 'Travelers Looking for Guides' : 'Available Guides';

    return (
        <div className="dashboard-container">
            <header className="dashboard-header" style={{ display: 'grid', gridTemplateColumns: 'minmax(200px, 1fr) auto minmax(200px, 1fr)', alignItems: 'center', gap: '1rem' }}>
                <div className="header-left" style={{ textAlign: 'left' }}>
                    <h1 style={{ margin: 0, fontSize: '1.5rem', whiteSpace: 'nowrap' }}>Welcome, {user.name}</h1>
                </div>

                <div className="header-center" style={{ display: 'flex', justifyContent: 'center' }}>
                    <form onSubmit={handleSearchSubmit} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', width: '350px' }}>
                        <input
                            type="text"
                            placeholder={isGuide ? "Search travelers... e.g. Delhi" : "Search guides... e.g. Delhi"}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            style={{ padding: '0.6rem 1.2rem', borderRadius: '25px', border: '1px solid rgba(255,255,255,0.2)', width: '100%', fontSize: '0.9rem', outline: 'none', background: 'rgba(0,0,0,0.2)', color: 'white' }}
                        />
                        <button type="submit" className="cta-button" style={{ margin: 0, padding: '0.5rem 1.2rem', fontSize: '0.9rem', width: 'max-content', minWidth: '100px', borderRadius: '25px' }}>Search</button>
                    </form>
                </div>

                <div className="header-right" style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', alignItems: 'center' }}>
                    {isGuide ? (
                        <button
                            onClick={() => navigate('/requests')}
                            className="cta-button"
                            style={{ margin: 0, fontSize: '0.9rem', padding: '0.5rem 1rem', background: '#ffb300', color: '#000' }}
                        >
                            Booking Requests
                        </button>
                    ) : (
                        <button
                            onClick={() => navigate('/my-bookings')}
                            className="cta-button"
                            style={{ margin: 0, fontSize: '0.9rem', padding: '0.5rem 1rem', background: '#4CAF50' }}
                        >
                            My Bookings
                        </button>
                    )}

                    {!user.profileCompleted ? (
                        <button
                            onClick={() => navigate('/profile')}
                            className="cta-button"
                            style={{ margin: 0, fontSize: '0.9rem', padding: '0.5rem 1rem' }}
                        >
                            Complete Profile
                        </button>
                    ) : (
                        <button
                            onClick={() => setShowProfileView(!showProfileView)}
                            className="cta-button"
                            style={{ margin: 0, fontSize: '0.9rem', padding: '0.5rem 1rem', background: 'linear-gradient(90deg, var(--primary-color), #4FC3F7)' }}
                        >
                            {showProfileView ? 'Close Profile' : 'User Profile'}
                        </button>
                    )}
                    <button onClick={logout} className="logout-btn" style={{ margin: 0 }}>Logout</button>
                </div>
            </header>

            {/* User Profile View Modal/Section */}
            {showProfileView && (isGuide ? guideProfile : travelerProfile) && (
                <div className="profile-view-modal" style={{
                    background: 'rgba(255,255,255,0.1)',
                    backdropFilter: 'blur(10px)',
                    padding: '2rem',
                    borderRadius: '15px',
                    marginBottom: '2rem',
                    textAlign: 'left',
                    border: '1px solid rgba(255,255,255,0.2)'
                }}>
                    <h2 style={{ marginTop: 0, color: 'var(--primary-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        Your Profile
                        <button
                            onClick={() => {
                                setShowProfileView(false);
                                navigate('/profile');
                            }}
                            style={{ fontSize: '0.8rem', padding: '0.3rem 0.8rem', background: '#FFFFFF', color: '#000000', border: '1px solid #000000', cursor: 'pointer', fontWeight: 'bold' }}
                        >
                            Edit Profile
                        </button>
                    </h2>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '2rem', alignItems: 'start' }}>
                        <div style={{ textAlign: 'center' }}>
                            <img
                                src={(isGuide ? guideProfile.imageUrl : travelerProfile.imageUrl) || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`}
                                alt="Profile"
                                style={{ width: '150px', height: '150px', borderRadius: '50%', border: '4px solid var(--primary-color)' }}
                            />
                        </div>
                        <div>
                            {isGuide ? (
                                <>
                                    <p><strong>Location:</strong> {guideProfile.location}</p>
                                    <p><strong>Experience:</strong> {guideProfile.experience}</p>
                                    <p><strong>About:</strong> {guideProfile.about}</p>
                                    <p><strong>Rating:</strong> ⭐ {guideProfile.rating} / 5.0</p>
                                </>
                            ) : (
                                <>
                                    <p><strong>Location:</strong> {travelerProfile.location}</p>
                                    <p><strong>Requesting:</strong> {travelerProfile.requesting}</p>
                                    <p><strong>Dates:</strong> {travelerProfile.date}</p>
                                    <p><strong>Budget:</strong> {travelerProfile.budget}</p>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* User Profile View Modal/Section */}

            <h2 style={{ textAlign: 'left', marginBottom: '1.5rem' }}>{title}</h2>

            <div className="cards-grid">
                {isLoading ? (
                    // Render 6 skeleton cards while waiting for data
                    Array.from({ length: 6 }).map((_, index) => (
                        <div key={index} className="skeleton-card"></div>
                    ))
                ) : dataToShow.length === 0 ? (
                    // Beautiful Empty State Design
                    <div className="empty-state">
                        <div style={{ fontSize: '4rem', marginBottom: '1rem', opacity: 0.5 }}>🏜️</div>
                        <h3 style={{ fontSize: '1.5rem', color: '#fff', marginBottom: '0.5rem' }}>No profiles found</h3>
                        <p style={{ maxWidth: '400px', margin: '0 auto 2rem auto', lineHeight: '1.6' }}>
                            We couldn't find anyone matching "{activeSearch}". Try adjusting your location or checking back later.
                        </p>
                        <button
                            className="cta-button"
                            style={{ width: 'max-content', padding: '0.6rem 1.5rem', background: 'transparent', border: '1px solid #fff', color: '#fff' }}
                            onClick={() => {
                                setSearchTerm('');
                                setActiveSearch('');
                            }}
                        >
                            Clear Search
                        </button>
                    </div>
                ) : (
                    dataToShow.map((item) => (
                        <div key={item.id} className="card">
                            <img src={item.image} alt={item.name} className="avatar" />
                            <div className="card-content">
                                <h3>{item.name}</h3>
                                <p><strong>Location:</strong> {item.location}</p>

                                {isGuide ? (
                                    <>
                                        <p><strong>Requesting:</strong> {item.requesting}</p>
                                        <p><strong>Date:</strong> {item.date}</p>
                                        <p><strong>Budget:</strong> {item.budget}</p>
                                    </>
                                ) : (
                                    <>
                                        <p><strong>Experience:</strong> {item.experience}</p>
                                        <p><strong>Rating:</strong> ⭐ {item.rating}</p>
                                        <p className="about">"{item.about}"</p>
                                    </>
                                )}

                                <button
                                    className="connect-btn"
                                    onClick={() => {
                                        if (!user.profileCompleted) {
                                            alert("Please complete your profile before sending requests!");
                                            navigate('/profile');
                                        } else {
                                            navigate(`/book/${item.id}`, { state: { guideName: item.name } });
                                        }
                                    }}
                                >
                                    {isGuide ? 'Offer to Guide' : 'Contact Guide'}
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {totalPages > 1 && (
                <div className="pagination-controls" style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginTop: '2rem' }}>
                    <button
                        onClick={() => setCurrentPage(prev => Math.max(0, prev - 1))}
                        disabled={currentPage === 0}
                        className="cta-button"
                        style={{ margin: 0, padding: '0.5rem 1rem', background: currentPage === 0 ? '#cccccc' : '' }}
                    >
                        Previous
                    </button>
                    <span style={{ display: 'flex', alignItems: 'center', fontWeight: 'bold' }}>
                        Page {currentPage + 1} of {totalPages}
                    </span>
                    <button
                        onClick={() => setCurrentPage(prev => Math.min(totalPages - 1, prev + 1))}
                        disabled={currentPage >= totalPages - 1}
                        className="cta-button"
                        style={{ margin: 0, padding: '0.5rem 1rem', background: currentPage >= totalPages - 1 ? '#cccccc' : '' }}
                    >
                        Next
                    </button>
                </div>
            )}
        </div>
    );
}

export default Dashboard;
