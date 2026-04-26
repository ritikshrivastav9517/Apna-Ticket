import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios'; // axios ko import karein
import { FaFacebookF, FaInstagram, FaTwitter, FaYoutube } from 'react-icons/fa';
import { FiPhone, FiMail, FiMapPin, FiX } from 'react-icons/fi';

const Footer = () => {
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [formType, setFormType] = useState('');
    const [message, setMessage] = useState(''); // Textarea ke liye state
    const [loading, setLoading] = useState(false); // Loading state

    const handleOpenForm = (type) => {
        setFormType(type);
        setIsFormOpen(true);
    };

    const handleCloseForm = () => {
        setIsFormOpen(false);
        setMessage(''); // Form band hone par message clear karein
    };
    
    const handleFormSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            // Backend API ko call karein
            const { data } = await axios.post(
                '/api/v1/feedback', 
                { formType, message },
                { withCredentials: true } // Taaki login user ki info bhi jaaye
            );
            alert(data.message);
            handleCloseForm();
        } catch (error) {
            alert(error.response?.data?.message || 'Submission failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <footer className="bg-slate-900 text-gray-300 relative">
            {/* CSS for the blinking animation */}
            <style>
                {`
                    @keyframes blink {
                        50% { opacity: 0.5; }
                    }
                    .animate-blink {
                        animation: blink 1.5s linear infinite;
                    }
                `}
            </style>

            <div className="container mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 py-12 px-8">
                
                {/* Column 1: About */}
                <div className="space-y-4">
                    <h2 className="text-2xl font-bold text-white">Apna Ticket</h2>
                    <p className="text-sm">
                        Your trusted platform for discovering, buying, and selling bus and train tickets across India.
                    </p>
                    <div className="flex space-x-4">
                        <a href="#" className="p-2 bg-slate-700 rounded-full hover:bg-purple-600"><FaFacebookF /></a>
                        <a href="#" className="p-2 bg-slate-700 rounded-full hover:bg-purple-600"><FaInstagram /></a>
                        <a href="#" className="p-2 bg-slate-700 rounded-full hover:bg-purple-600"><FaTwitter /></a>
                        <a href="#" className="p-2 bg-slate-700 rounded-full hover:bg-purple-600"><FaYoutube /></a>
                    </div>
                </div>

                {/* Column 2: Quick Links */}
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-white">Quick Links</h3>
                    <ul className="space-y-2 text-sm">
                        <li><Link to="/bus-tickets" className="hover:text-white">Bus Tickets</Link></li>
                        <li><Link to="/train-tickets" className="hover:text-white">Train Tickets</Link></li>
                        <li><Link to="/post-ticket" className="hover:text-white">Post a Ticket</Link></li>
                        <li><Link to="/login" className="hover:text-white">Login</Link></li>
                    </ul>
                </div>

                {/* Column 3: Contact Info */}
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-white">Contact Info</h3>
                    <ul className="space-y-3 text-sm">
                        <li className="flex items-center gap-3"><FiPhone className="text-purple-400" /><span>+91 8127376886</span></li>
                        <li className="flex items-center gap-3"><FiMail className="text-purple-400" /><span>apnaticket32@gmail.com</span></li>
                        <li className="flex items-center gap-3"><FiMapPin className="text-purple-400" /><span>Ghaziabad, UP, India</span></li>
                    </ul>
                </div>

                {/* Column 4: Feedback & Issue Report */}
                <div className="space-y-6">
                    {/* Feedback Button */}
                    <div className="bg-white/10 p-4 rounded-lg text-center">
                        <h3 className="font-semibold text-white">Feedback Form</h3>
                        <button onClick={() => handleOpenForm('Feedback')} className="mt-2 bg-purple-600 text-white px-5 py-2 rounded-md font-bold hover:bg-purple-700 animate-blink">
                            Click
                        </button>
                    </div>
                    {/* Issue Button */}
                    <div className="bg-white/10 p-4 rounded-lg text-center">
                        <h3 className="font-semibold text-white">ISSUE REPORT</h3>
                        <button onClick={() => handleOpenForm('Issue')} className="mt-2 bg-purple-600 text-white px-5 py-2 rounded-md font-bold hover:bg-purple-700 animate-blink">
                            Click
                        </button>
                    </div>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="border-t border-slate-800">
                <div className="container mx-auto py-4 px-8 flex justify-between items-center text-sm">
                    <p>&copy; 2025 Apna Ticket. All rights reserved.</p>
                    <div className="flex space-x-6">
                        <Link to="/privacy-policy" className="hover:text-white">Privacy Policy</Link>
                        <Link to="/terms-of-service" className="hover:text-white">Terms of Service</Link>
                    </div>
                </div>
            </div>

            {/* --- FORM MODAL --- */}
            {isFormOpen && (
                <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
                    <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md relative text-gray-800">
                        <button onClick={handleCloseForm} className="absolute top-4 right-4 text-gray-400 hover:text-gray-800">
                            <FiX size={24} />
                        </button>
                        <h2 className="text-2xl font-bold text-center mb-4">{formType} Form</h2>
                        <form onSubmit={handleFormSubmit}>
                            <textarea
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                placeholder="Write here..."
                                required
                                className="w-full h-32 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                            ></textarea>
                            <button 
                                type="submit" 
                                className="mt-4 w-full bg-purple-600 text-white font-bold py-3 rounded-lg hover:bg-purple-700 disabled:bg-purple-400"
                                disabled={loading}
                            >
                                {loading ? 'Submitting...' : 'Submit'}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </footer>
    );
};

export default Footer;
