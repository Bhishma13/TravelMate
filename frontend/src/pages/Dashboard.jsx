import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';

import GuideProfileForm from '../components/GuideProfileForm';
import TravelerProfileForm from '../components/TravelerProfileForm';

import { getGuideProfile, getTravelerProfile, getUsersByRole } from '../services/api';

function Dashboard() {
    const { user, logout } = useAuth();
    const [showProfileForm, setShowProfileForm] = React.useState(false);
    const [showProfileView, setShowProfileView] = React.useState(false);
    const [guideProfile, setGuideProfile] = React.useState(null);
    const [travelerProfile, setTravelerProfile] = React.useState(null);
    const [dataToShow, setDataToShow] = React.useState([]);
    const [currentPage, setCurrentPage] = React.useState(0);
    const [totalPages, setTotalPages] = React.useState(0);
    const [searchTerm, setSearchTerm] = React.useState('');
    const [activeSearch, setActiveSearch] = React.useState('');

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
            const roleToFetch = user.role === 'guide' ? 'traveler' : 'guide';
            getUsersByRole(roleToFetch, currentPage, 10, activeSearch) // Size 10
                .then(data => {
                    setDataToShow(data.content);
                    setTotalPages(data.totalPages);
                })
                .catch(err => console.error(`Failed to load ${roleToFetch}s`, err));
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
            <header className="dashboard-header">
                <div className="header-left">
                    <h1>Welcome, {user.name} ({user.role})</h1>
                </div>

                <div className="header-right" style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    {(!user.profileCompleted ? (
                        <button
                            onClick={() => setShowProfileForm(!showProfileForm)}
                            className="cta-button"
                            style={{ margin: 0, fontSize: '0.9rem', padding: '0.5rem 1rem' }}
                        >
                            {showProfileForm ? 'Close Form' : 'Complete Profile'}
                        </button>
                    ) : (
                        showProfileForm ? (
                            <button
                                onClick={() => {
                                    setShowProfileForm(false);
                                    setShowProfileView(true);
                                }}
                                className="cta-button"
                                style={{ margin: 0, fontSize: '0.9rem', padding: '0.5rem 1rem', background: '#e0e0e0', color: '#333' }}
                            >
                                Cancel Edit
                            </button>
                        ) : (
                            <button
                                onClick={() => setShowProfileView(!showProfileView)}
                                className="cta-button"
                                style={{ margin: 0, fontSize: '0.9rem', padding: '0.5rem 1rem', background: 'linear-gradient(90deg, var(--primary-color), #4FC3F7)' }}
                            >
                                {showProfileView ? 'Close Profile' : 'User Profile'}
                            </button>
                        )
                    ))}
                    <button onClick={logout} className="logout-btn" style={{ margin: 0 }}>Logout</button>
                </div>
            </header>

            {/* Profile Creation Form */}
            {showProfileForm && (
                <div style={{ marginBottom: '2rem' }}>
                    {isGuide ? (
                        <GuideProfileForm
                            userId={user.id}
                            initialData={guideProfile}
                            onComplete={() => {
                                setShowProfileForm(false);
                                setShowProfileView(true);
                            }}
                        />
                    ) : (
                        <TravelerProfileForm
                            userId={user.id}
                            initialData={travelerProfile}
                            onComplete={() => {
                                setShowProfileForm(false);
                                setShowProfileView(true);
                            }}
                        />
                    )}
                </div>
            )}

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
                                setShowProfileForm(true);
                            }}
                            style={{ fontSize: '0.8rem', padding: '0.3rem 0.8rem', background: '#FFFFFF', color: 'var(--primary-color)', border: '1px solid var(--primary-color)' }}
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

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h2>{title}</h2>
                <form onSubmit={handleSearchSubmit} style={{ display: 'flex', gap: '0.5rem' }}>
                    <input
                        type="text"
                        placeholder={isGuide ? "Search travelers by location... e.g. Delhi" : "Search guides by location... e.g. Delhi"}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{ padding: '0.5rem', borderRadius: '5px', border: '1px solid #ccc', minWidth: '250px' }}
                    />
                    <button type="submit" className="cta-button" style={{ margin: 0, padding: '0.5rem 1rem' }}>Search</button>
                </form>
            </div>

            <div className="cards-grid">
                {dataToShow.map((item) => (
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

                            <button className="connect-btn">
                                {isGuide ? 'Offer to Guide' : 'Contact Guide'}
                            </button>
                        </div>
                    </div>
                ))}
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
