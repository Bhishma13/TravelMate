import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';

const BASE_URL = `${import.meta.env.VITE_API_URL || 'http://localhost:8081'}/api`;


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
            
        }
    }, [user]);

    useEffect(() => {
        fetchCount(); 

        const interval = setInterval(fetchCount, 30000); 
        return () => clearInterval(interval); 
    }, [fetchCount]);

    return { pending, refresh: fetchCount };
}
