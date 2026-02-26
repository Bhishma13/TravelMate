import React, { createContext, useState, useContext } from 'react';
import { loginUser, registerUser } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    const login = async (credentials) => {
        try {
            const data = await loginUser(credentials);
            setUser(data.user);
            return data;
        } catch (error) {
            console.error("Login error:", error);
            throw error;
        }
    };

    const register = async (userData) => {
        try {
            const data = await registerUser(userData);
            setUser(data.user);
            return data;
        } catch (error) {
            console.error("Registration error:", error);
            throw error;
        }
    };

    const logout = () => {
        setUser(null);
    };

    const updateUser = (userData) => {
        setUser(prev => ({ ...prev, ...userData }));
    };

    return (
        <AuthContext.Provider value={{ user, login, register, logout, updateUser }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
