import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext'; 
import { FcGoogle } from 'react-icons/fc'; // Google Icon

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();
    const { login } = useAuth(); 

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const { data } = await axios.post('/api/v1/login', { email, password }, { withCredentials: true });
            setLoading(false);
            login(data.data); 
            alert('Login successful!');
            navigate('/');
        } catch (err) {
            setLoading(false);
            setError(err.response?.data?.message || 'Something went wrong!');
        }
    };

    const handleGoogleLogin = () => {
            window.location.href = "http://13.48.135.13:3000/api/v1/auth/google";
    };

    return (
        <div className="flex justify-center items-center py-10 bg-gray-50">
            <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-xl">
                <h1 className="text-3xl font-bold text-center text-gray-800">
                    Login to Your Account
                </h1>

                {error && <p className="text-center text-red-500 bg-red-100 p-2 rounded-md">{error}</p>}
                
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label
                            htmlFor="email"
                            className="text-sm font-semibold text-gray-600 block"
                        >
                            Email Address
                        </label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600"
                            placeholder="you@example.com"
                            disabled={loading}
                        />
                    </div>
                    <div>
                        <div className="flex justify-between items-center">
                            <label
                                htmlFor="password"
                                className="text-sm font-semibold text-gray-600 block"
                            >
                                Password
                            </label>
                        
                        </div>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600"
                            placeholder="********"
                            disabled={loading}
                        />
                    </div>
                    <div>
                          <Link to="/forgot-password" className="text-sm font-semibold text-purple-600 hover:underline">
                                Forgot Password?
                            </Link>
                    </div>
                    <div>
                        
                        <button
                            type="submit"
                            className="w-full px-4 py-2 font-bold text-white bg-purple-600 rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:ring-opacity-50 transition-colors disabled:bg-purple-400"
                            disabled={loading}
                        >
                            {loading ? 'Logging in...' : 'Login'}
                        </button>
                    </div>
                </form>

                <div className="flex items-center">
                    <div className="flex-grow bg-gray-200 h-px"></div>
                    <span className="mx-4 text-sm font-semibold text-gray-400">OR</span>
                    <div className="flex-grow bg-gray-200 h-px"></div>
                </div>

                <div>
                    <button
                        onClick={handleGoogleLogin}
                        className="w-full flex items-center justify-center gap-3 px-4 py-2 font-semibold text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400 transition-colors"
                    >
                        <FcGoogle size={24} />
                        Sign in with Google
                    </button>
                </div>

                <p className="text-sm text-center text-gray-600">
                    Don't have an account?{" "}
                    <Link to="/signup" className="font-semibold text-purple-600 hover:underline">
                        Sign Up
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Login;
