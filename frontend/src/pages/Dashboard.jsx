import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Navigate, useNavigate } from 'react-router-dom';
import { useNotifications } from '../hooks/useNotifications';
import { getGuideProfile, getTravelerProfile, getUsersByRole, getGuideReviews, getOpenBoardPosts, createBookingRequest, getFullImageUrl } from '../services/api';

function Dashboard() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [showProfileView, setShowProfileView] = React.useState(false);
    const [guideProfile, setGuideProfile] = React.useState(null);
    const [guideReviews, setGuideReviews] = React.useState([]);
    const [travelerProfile, setTravelerProfile] = React.useState(null);
    const [dataToShow, setDataToShow] = React.useState([]);
    const [currentPage, setCurrentPage] = React.useState(0);
    const [totalPages, setTotalPages] = React.useState(0);
    const [searchTerm, setSearchTerm] = React.useState('');
    const [activeSearch, setActiveSearch] = React.useState('');
    const [isLoading, setIsLoading] = React.useState(true);
    const { pending: notifCount } = useNotifications(); // poll backend every 30s

    // Fetch profile data when opening the profile view
    // Fetch profile data when opening the profile view
    React.useEffect(() => {
        if (showProfileView && user) {
            if (user.role === 'guide') {
                getGuideProfile(user.id)
                    .then(data => {
                        setGuideProfile(data);
                        return getGuideReviews(user.id);
                    })
                    .then(reviews => setGuideReviews(reviews))
                    .catch(err => console.error("Failed to load profile or reviews", err));
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
            if (user.role === 'guide') {
                getOpenBoardPosts()
                    .then(data => {
                        let filteredData = data;
                        if (activeSearch) {
                            filteredData = data.filter(post => post.destination.toLowerCase().includes(activeSearch.toLowerCase()));
                        }
                        setDataToShow(filteredData);
                        setTotalPages(1); // No pagination for job board yet
                    })
                    .catch(err => console.error(`Failed to load open board posts`, err))
                    .finally(() => setIsLoading(false));
            } else {
                getUsersByRole('guide', currentPage, 10, activeSearch)
                    .then(data => {
                        const validGuides = data.content.filter(g => g.location && g.location !== 'Not provided');
                        setDataToShow(validGuides);
                        setTotalPages(data.totalPages);
                    })
                    .catch(err => console.error(`Failed to load guides`, err))
                    .finally(() => setIsLoading(false));
            }
        }
    }, [user, currentPage, activeSearch]);

    const handleSendProposal = async (post) => {
        if (window.confirm(`Send a proposal to guide the trip to ${post.destination}?`)) {
            try {
                await createBookingRequest({
                    travelerId: post.travelerId,
                    guideId: user.id,
                    tripDates: post.tripDates,
                    tripPostId: post.id
                });
                alert("Proposal sent successfully! You can view it in your Booking Requests.");
                setDataToShow(prev => prev.filter(p => p.id !== post.id));
            } catch (err) {
                alert(err.message || "Failed to send proposal.");
            }
        }
    };

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        setCurrentPage(0); // Reset to first page
        setActiveSearch(searchTerm); // Trigger fetch
    };

    if (!user) {
        return <Navigate to="/signin" />;
    }

    const isGuide = user.role === 'guide';
    const title = isGuide ? 'Global Job Board (Open Trips)' : 'Available Guides';

    return (
        <div className="dashboard-container">
            <header className="dashboard-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '2rem', flexWrap: 'wrap' }}>
                <div className="header-left" style={{ flexShrink: 0 }}>
                    <h1 style={{ margin: 0, fontSize: '1.6rem', color: 'var(--primary-color)' }}>Welcome, {user.name}</h1>
                </div>

                <div className="header-center" style={{ flexGrow: 1, maxWidth: '500px' }}>
                    <form onSubmit={handleSearchSubmit} style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', width: '100%' }}>
                        <input
                            type="text"
                            placeholder={isGuide ? "Search travelers... e.g. Delhi" : "Search guides... e.g. Delhi"}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            style={{ padding: '0.7rem 1.2rem', borderRadius: '50px', border: '1px solid var(--surface-border)', width: '100%', fontSize: '0.95rem', outline: 'none', background: 'rgba(0,0,0,0.3)', color: 'white', transition: 'all 0.3s ease' }}
                            onFocus={(e) => e.target.style.borderColor = 'var(--primary-color)'}
                            onBlur={(e) => e.target.style.borderColor = 'var(--surface-border)'}
                        />
                        <button type="submit" className="cta-button" style={{ margin: 0, padding: '0.7rem 1.4rem', fontSize: '0.95rem', width: 'max-content', minWidth: '100px', borderRadius: '50px' }}>Search</button>
                    </form>
                </div>

                <div className="header-right" style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
                    {isGuide ? (
                        // Badge wrapper for Guide's booking button
                        <div style={{ position: 'relative', display: 'inline-block' }}>
                            <button
                                onClick={() => navigate('/requests')}
                                className="cta-button outline"
                                style={{ margin: 0, fontSize: '0.95rem', padding: '0.6rem 1.2rem', borderRadius: '50px', cursor: 'pointer', whiteSpace: 'nowrap' }}
                            >
                                Booking Requests
                            </button>
                            {notifCount > 0 && (
                                <span style={{
                                    position: 'absolute', top: '-8px', right: '-8px',
                                    background: 'var(--accent-color)', color: '#fff',
                                    borderRadius: '50%', width: '22px', height: '22px',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    fontSize: '0.75rem', fontWeight: 'bold', pointerEvents: 'none',
                                    boxShadow: '0 0 10px rgba(255, 64, 129, 0.5)'
                                }}>
                                    {notifCount > 9 ? '9+' : notifCount}
                                </span>
                            )}
                        </div>
                    ) : (
                        <>
                            <button
                                onClick={() => navigate('/my-trips')}
                                className="cta-button"
                                style={{ margin: 0, fontSize: '0.95rem', padding: '0.6rem 1.2rem', whiteSpace: 'nowrap' }}
                            >
                                Post a Trip
                            </button>
                            {/* Badge wrapper for Traveler's active bookings button */}
                            <div style={{ position: 'relative', display: 'inline-block' }}>
                                <button
                                    onClick={() => navigate('/my-bookings')}
                                    className="cta-button outline"
                                    style={{ margin: 0, fontSize: '0.95rem', padding: '0.6rem 1.2rem', borderRadius: '50px', cursor: 'pointer', whiteSpace: 'nowrap' }}
                                >
                                    Active Bookings
                                </button>
                                {notifCount > 0 && (
                                    <span style={{
                                        position: 'absolute', top: '-8px', right: '-8px',
                                        background: 'var(--accent-color)', color: '#fff',
                                        borderRadius: '50%', width: '22px', height: '22px',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        fontSize: '0.75rem', fontWeight: 'bold', pointerEvents: 'none',
                                        boxShadow: '0 0 10px rgba(255, 64, 129, 0.5)'
                                    }}>
                                        {notifCount > 9 ? '9+' : notifCount}
                                    </span>
                                )}
                            </div>
                        </>
                    )}

                    {!user.profileCompleted ? (
                        <button
                            onClick={() => navigate('/profile')}
                            className="cta-button outline"
                            style={{ margin: 0, fontSize: '0.95rem', padding: '0.6rem 1.2rem', whiteSpace: 'nowrap' }}
                        >
                            Complete Profile
                        </button>
                    ) : (
                        <button
                            onClick={() => setShowProfileView(!showProfileView)}
                            className="cta-button outline"
                            style={{ margin: 0, fontSize: '0.95rem', padding: '0.6rem 1.2rem', whiteSpace: 'nowrap', borderColor: '#4FC3F7', color: '#4FC3F7' }}
                        >
                            {showProfileView ? 'Close Profile' : 'User Profile'}
                        </button>
                    )}
                    <button onClick={logout} className="cta-button outline" style={{ margin: 0, padding: '0.6rem 1.2rem', borderRadius: '50px', fontSize: '0.95rem', cursor: 'pointer', borderColor: '#FF5252', color: '#FF5252', whiteSpace: 'nowrap' }}>Logout</button>
                </div>
            </header>

            {/* User Profile View Modal/Section */}
            {showProfileView && (isGuide ? guideProfile : travelerProfile) && (
                <div className="glass-panel" style={{
                    padding: '2.5rem',
                    marginBottom: '2rem',
                    textAlign: 'left'
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
                                src={getFullImageUrl(isGuide ? guideProfile.imageUrl : travelerProfile.imageUrl) || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`}
                                alt="Profile"
                                style={{ width: '150px', height: '150px', borderRadius: '50%', border: '4px solid var(--primary-color)', boxShadow: '0 0 20px rgba(0, 229, 255, 0.2)', objectFit: 'cover' }}
                            />
                        </div>
                        <div>
                            {isGuide ? (
                                <>
                                    <p><strong>Location:</strong> {guideProfile.location}</p>
                                    <p><strong>Experience:</strong> {guideProfile.experience}</p>
                                    <p><strong>About:</strong> {guideProfile.about}</p>
                                    <p><strong>Rating:</strong> ⭐ {guideProfile.rating} / 5.0</p>

                                    {guideReviews.length > 0 && (
                                        <div style={{ marginTop: '2rem', paddingTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.2)' }}>
                                            <h3 style={{ marginBottom: '1rem' }}>Reviews</h3>
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                                {guideReviews.map(r => (
                                                    <div key={r.id} style={{ background: 'rgba(255,255,255,0.05)', padding: '1rem', borderRadius: '8px' }}>
                                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                                            <strong>{r.travelerName}</strong>
                                                            <span style={{ color: '#ffb300' }}>{'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}</span>
                                                        </div>
                                                        <p style={{ margin: 0, fontStyle: 'italic', fontSize: '0.9rem' }}>"{r.comment}"</p>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
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
                        <div key={item.id} className="card" style={{ maxWidth: '340px', margin: '0 auto', width: '100%' }}>
                            {isGuide ? (
                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '0.5rem' }}>
                                    <img src={getFullImageUrl(item.travelerImage) || `https://api.dicebear.com/7.x/avataaars/svg?seed=${item.travelerName || 'Traveler'}`} alt={item.travelerName || 'Traveler'} className="avatar" />
                                    <div style={{ fontSize: '1.5rem', textAlign: 'center', marginTop: '-15px', background: 'var(--surface-color)', borderRadius: '50%', padding: '0 5px', zIndex: 2 }}>🌍</div>
                                </div>
                            ) : (
                                <img src={getFullImageUrl(item.image) || `https://api.dicebear.com/7.x/avataaars/svg?seed=${item.name}`} alt={item.name} className="avatar" />
                            )}
                            <div className="card-content">
                                {isGuide ? (
                                    <>
                                        <h3>📍 {item.destination}</h3>
                                        <p style={{ color: 'var(--primary-color)', fontWeight: 'bold', fontSize: '1.1rem' }}>🗓️ {item.tripDates}</p>
                                        <div style={{ background: 'rgba(0,0,0,0.3)', padding: '1rem', borderRadius: '12px', fontSize: '0.95rem', marginBottom: '1.5rem', fontStyle: 'italic', lineHeight: '1.5', border: '1px solid var(--surface-border)' }}>
                                            "{item.description}"
                                        </div>

                                        <button
                                            className="cta-button outline"
                                            style={{ marginTop: 'auto', borderRadius: '12px' }}
                                            onClick={() => {
                                                if (!user.profileCompleted) {
                                                    alert("Please complete your profile before sending proposals!");
                                                    navigate('/profile');
                                                } else {
                                                    handleSendProposal(item);
                                                }
                                            }}
                                        >
                                            Send Proposal
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <h3 style={{ fontSize: '1.4rem', color: 'var(--primary-color)' }}>{item.name}</h3>
                                        <p><strong>Location:</strong> {item.location}</p>
                                        <p><strong>Experience:</strong> {item.experience}</p>
                                        <p><strong>Rating:</strong> ⭐ {item.rating}</p>
                                        <p className="about" style={{ color: '#ccc', fontStyle: 'italic', marginBottom: '1.5rem' }}>"{item.about}"</p>

                                        <button
                                            className="cta-button outline"
                                            style={{ marginTop: 'auto', borderRadius: '12px' }}
                                            onClick={() => {
                                                if (!user.profileCompleted) {
                                                    alert("Please complete your profile before sending requests!");
                                                    navigate('/profile');
                                                } else {
                                                    navigate(`/book/${item.id}`, { state: { guideName: item.name } });
                                                }
                                            }}
                                        >
                                            Contact Guide
                                        </button>
                                    </>
                                )}
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
