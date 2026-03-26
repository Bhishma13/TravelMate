const API_URL = 'http://localhost:8081/api/auth';

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

const BASE_URL = 'http://localhost:8081/api';

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

export const createBookingRequest = async (bookingData) => {
    const response = await fetch(`${BASE_URL}/bookings/request`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookingData),
    });
    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Failed to send booking request');
    }
    return response.json();
};

export const getGuideRequests = async (guideId) => {
    const response = await fetch(`${BASE_URL}/bookings/guide/${guideId}`);
    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Failed to fetch guide requests');
    }
    return response.json();
};

export const getTravelerRequests = async (travelerId) => {
    const response = await fetch(`${BASE_URL}/bookings/traveler/${travelerId}`);
    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Failed to fetch traveler bookgings');
    }
    return response.json();
};

export const updateBookingStatus = async (requestId, status, cancellationReason = null) => {
    const payload = { status };
    if (cancellationReason) payload.cancellationReason = cancellationReason;
    const response = await fetch(`${BASE_URL}/bookings/request/${requestId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    });
    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Failed to update status');
    }
    return response.json();
};

export const createReview = async (reviewData) => {
    const response = await fetch(`${BASE_URL}/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reviewData)
    });
    if (!response.ok) {
        let errorText = 'Failed to submit review';
        try {
            const errJson = await response.json();
            if (errJson.error) errorText = errJson.error;
        } catch (e) {
            errorText = await response.text();
        }
        throw new Error(errorText);
    }
    return response.json();
};

export const getGuideReviews = async (guideId) => {
    const response = await fetch(`${BASE_URL}/reviews/guide/${guideId}`);
    if (!response.ok) {
        let errorText = 'Failed to fetch reviews';
        try {
            const errJson = await response.json();
            if (errJson.error) errorText = errJson.error;
        } catch (e) {
            errorText = await response.text();
        }
        throw new Error(errorText);
    }
    return response.json();
};

export const getChatHistory = async (bookingRequestId, userId) => {
    const response = await fetch(`${BASE_URL}/messages/${bookingRequestId}?userId=${userId}`);
    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Failed to fetch chat history');
    }
    return response.json();
};

export const createTripPost = async (postData) => {
    const response = await fetch(`${BASE_URL}/posts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(postData)
    });
    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Failed to create trip post');
    }
    return response.json();
};

export const getTravelerPosts = async (travelerId) => {
    const response = await fetch(`${BASE_URL}/posts/traveler/${travelerId}`);
    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Failed to fetch traveler posts');
    }
    return response.json();
};

export const getOpenBoardPosts = async () => {
    const response = await fetch(`${BASE_URL}/posts/board`);
    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Failed to fetch open board posts');
    }
    return response.json();
};

export const updateTripPostStatus = async (postId, status) => {
    const response = await fetch(`${BASE_URL}/posts/${postId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
    });
    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Failed to update post status');
    }
    return response.json();
};

export const enhanceProfile = async (text) => {
    const response = await fetch(`${BASE_URL}/ai/enhance-profile`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text })
    });
    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.error || 'Failed to enhance profile with AI');
    }
    return data.enhancedText;
};

export const enhanceTrip = async (text) => {
    const response = await fetch(`${BASE_URL}/ai/enhance-trip`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text })
    });
    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.error || 'Failed to enhance trip description with AI');
    }
    return data.enhancedText;
};

export const uploadImage = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await fetch(`${BASE_URL}/upload`, {
        method: 'POST',
        body: formData
    });
    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.error || 'Failed to upload image');
    }
    return data.imageUrl;
};
