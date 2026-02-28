import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Navigate, useNavigate } from 'react-router-dom';
import GuideProfileForm from '../components/GuideProfileForm';
import TravelerProfileForm from '../components/TravelerProfileForm';
import { getGuideProfile, getTravelerProfile } from '../services/api';

function ProfileSetup() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [profileData, setProfileData] = React.useState(null);
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        if (user) {
            const fetchProfile = async () => {
                try {
                    if (user.role === 'guide') {
                        const data = await getGuideProfile(user.id);
                        setProfileData(data);
                    } else {
                        const data = await getTravelerProfile(user.id);
                        setProfileData(data);
                    }
                } catch (err) {
                    console.log("No existing profile found. Creating a new one.");
                } finally {
                    setLoading(false);
                }
            };
            fetchProfile();
        }
    }, [user]);

    if (!user) {
        return <Navigate to="/signin" />;
    }

    if (loading) {
        return <div style={{ color: 'white', textAlign: 'center', marginTop: '50px' }}>Loading...</div>;
    }

    const handleComplete = () => {
        navigate('/dashboard');
    };

    return (
        <div className="auth-container" style={{ padding: '2rem', maxWidth: '800px', margin: 'auto' }}>
            <h2>{user.profileCompleted ? 'Edit Your Profile' : 'Complete Your Profile'}</h2>
            {user.role === 'guide' ? (
                <GuideProfileForm
                    userId={user.id}
                    initialData={profileData}
                    onComplete={handleComplete}
                />
            ) : (
                <TravelerProfileForm
                    userId={user.id}
                    initialData={profileData}
                    onComplete={handleComplete}
                />
            )}
        </div>
    );
}

export default ProfileSetup;
