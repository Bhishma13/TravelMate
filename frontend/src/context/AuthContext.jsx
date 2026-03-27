import React, { createContext, useState, useContext, useEffect } from 'react';
import { loginUser, registerUser } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        const savedUser = localStorage.getItem('user');
        return savedUser ? JSON.parse(savedUser) : null;
    });

    const [token, setToken] = useState(() => {
        return localStorage.getItem('token') || null;
    });

    // Sync state changes back to localStorage
    useEffect(() => {
        if (token) localStorage.setItem('token', token);
        else localStorage.removeItem('token');
    }, [token]);

    useEffect(() => {
        if (user) localStorage.setItem('user', JSON.stringify(user));
        else localStorage.removeItem('user');
    }, [user]);

    const login = async (credentials) => {
        try {
            const data = await loginUser(credentials);
            if (data.token) setToken(data.token);
            if (data.user) setUser(data.user);
            return data;
        } catch (error) {
            console.error("Login error:", error);
            throw error;
        }
    };

    const register = async (userData) => {
        try {
            const data = await registerUser(userData);
            // We usually let them login manually after registering,
            // but if desired, we can capture the token here too.
            return data;
        } catch (error) {
            console.error("Registration error:", error);
            throw error;
        }
    };

    const logout = () => {
        setUser(null);
        setToken(null);
    };

    const updateUser = (userData) => {
        setUser(prev => ({ ...prev, ...userData }));
    };

    return (
        <AuthContext.Provider value={{ user, token, login, register, logout, updateUser }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
