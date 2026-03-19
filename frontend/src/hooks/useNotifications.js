import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';

const BASE_URL = 'http://localhost:8080/api';

/**
 * Polls the backend every 30 seconds for pending notification counts.
 * Returns { pending: number } — the count of items needing the user's attention.
 *   - Traveler: PENDING Guide proposals on their trip posts
 *   - Guide:    PENDING Traveler direct requests
 */
export function useNotifications() {
    const { user } = useAuth();
    const [pending, setPending] = useState(0);

    const fetchCount = useCallback(async () => {
        if (!user) return;
        try {
            const res = await fetch(`${BASE_URL}/notifications/count?userId=${user.id}&role=${user.role}`);
            if (res.ok) {
                const data = await res.json();
                setPending(data.pending || 0);
            }
        } catch {
            // Silently fail — don't disrupt the user's session
        }
    }, [user]);

    useEffect(() => {
        fetchCount(); // Fetch immediately on mount / user change

        const interval = setInterval(fetchCount, 30000); // Poll every 30 seconds
        return () => clearInterval(interval); // Cleanup on unmount
    }, [fetchCount]);

    return { pending, refresh: fetchCount };
}
