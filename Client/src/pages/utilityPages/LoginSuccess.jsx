import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

const LoginSuccess = () => {
    const navigate = useNavigate();
    const { login } = useAuth();

    useEffect(() => {
        const fetchUser = async () => {
            try {
                // Naye 'me' endpoint se user data fetch karein
                const { data } = await axios.get('/api/v1/me', { withCredentials: true });
                if (data.success) {
                    // Global state ko update karein
                    login(data.data);
                    // Home page par bhej dein
                    navigate('/');
                }
            } catch (error) {
                console.error("Failed to fetch user after Google login", error);
                navigate('/login'); // Fail hone par login page par bhej dein
            }
        };

        fetchUser();
    }, [login, navigate]);

    return (
        <div className="flex justify-center items-center h-screen">
            <p className="text-xl">Logging you in...</p>
        </div>
    );
};

export default LoginSuccess;
