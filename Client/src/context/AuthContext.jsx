import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext(null);

// AuthProvider ko default export banayein
export default function AuthProvider({ children }) {
    const [userInfo, setUserInfo] = useState(null);

    useEffect(() => {
        const storedUserInfo = localStorage.getItem('userInfo');
        if (storedUserInfo) {
            setUserInfo(JSON.parse(storedUserInfo));
        }
    }, []);

    const login = (userData) => {
        localStorage.setItem('userInfo', JSON.stringify(userData));
        setUserInfo(userData);
    };

    const logout = async () => {
        try {
            await axios.post('/api/v1/logout');
            localStorage.removeItem('userInfo');
            setUserInfo(null);
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    return (
        <AuthContext.Provider value={{ userInfo, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

// useAuth hook ko named export hi rehne dein
export const useAuth = () => {
    return useContext(AuthContext);
};