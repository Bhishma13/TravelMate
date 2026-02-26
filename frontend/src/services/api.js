const API_URL = 'http://localhost:8080/api/auth';

export const registerUser = async (userData) => {
    const response = await fetch(`${API_URL}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
    });
    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Registration failed');
    }
    return response.json();
};

export const loginUser = async (credentials) => {
    const response = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
    });
    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Login failed');
    }
    return response.json();
};

const BASE_URL = 'http://localhost:8080/api';

export const updateProfile = async (profileData) => {
    const response = await fetch(`${BASE_URL}/profile/guide`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profileData),
    });
    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Profile update failed');
    }
    return response.json();
};


export const getUsersByRole = async (role, page = 0, size = 10, location = '') => {
    let url = `${BASE_URL}/users?role=${role}&page=${page}&size=${size}`;
    if (location && location.trim() !== '') {
        url += `&location=${encodeURIComponent(location)}`;
    }
    const response = await fetch(url);
    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Failed to fetch users');
    }
    return response.json();
};

export const getGuideProfile = async (userId) => {
    const response = await fetch(`${BASE_URL}/profile/guide/${userId}`);
    if (!response.ok) {
        if (response.status === 404) return null; // Handle profile not found gracefully
        const errorText = await response.text();
        throw new Error(errorText || 'Failed to fetch profile');
    }
    return response.json();
};

export const updateTravelerProfile = async (profileData) => {
    const response = await fetch(`${BASE_URL}/profile/traveler`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profileData),
    });
    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Profile update failed');
    }
    return response.json();
};

export const getTravelerProfile = async (userId) => {
    const response = await fetch(`${BASE_URL}/profile/traveler/${userId}`);
    if (!response.ok) {
        if (response.status === 404) return null; // Handle profile not found gracefully
        const errorText = await response.text();
        throw new Error(errorText || 'Failed to fetch profile');
    }
    return response.json();
};
