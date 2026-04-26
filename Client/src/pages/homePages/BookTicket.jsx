import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { User, Mail, Smartphone, MapPin, Building } from 'lucide-react';
import { indianStates } from '../../data/indianStates'; // Nayi data file import karein

const BookTicket = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        mobile: '',
        state: '',
        city: '',
    });
    const [cities, setCities] = useState([]); // Cities ke liye state
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const location = useLocation();
    
    const ticketId = location.state?.ticketId;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });

        // Agar state badalta hai, to city ki list update karein
        if (name === 'state') {
            const selectedState = indianStates.find(s => s.name === value);
            setCities(selectedState ? selectedState.cities : []);
            // City ko reset karein
            setFormData(prev => ({ ...prev, city: '' }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!ticketId) {
            setError("Could not find the ticket to book. Please go back and try again.");
            return;
        }
        setLoading(true);
        setError('');
        try {
            await axios.post('/api/v1/book-ticket', { ...formData, ticketId });
            setLoading(false);
            alert('Your booking request has been submitted successfully!');
            navigate('/');
        } catch (err) {
            setLoading(false);
            setError(err.response?.data?.message || 'Something went wrong.');
        }
    };
    
    const backgroundImageUrl = 'https://images.unsplash.com/photo-1533105079780-52b9be482077?q=80&w=1974&auto-format&fit=crop';

    return (
        // YAHAN BADLAV KIYA GAYA HAI: items-center ko items-start kiya gaya hai aur padding di gayi hai
        <div 
            className="min-h-screen flex items-start justify-center p-4 pt-20 bg-cover bg-center"
            style={{ backgroundImage: `url(${backgroundImageUrl})` }}
        >
            <div className="absolute inset-0 bg-black/40"></div>
            <div className="relative w-full max-w-2xl mx-auto p-8 bg-white rounded-2xl shadow-2xl space-y-6">
                
                <div className="text-center">
                    <h1 className="text-4xl font-bold text-gray-800 tracking-tight">
                        <span role="img" aria-label="train-emoji" className="mr-3">🚆</span>
                        Confirm Your Journey
                        <span role="img" aria-label="bus-emoji" className="ml-3">🚌</span>
                    </h1>
                    <p className="text-gray-500 mt-2">Final step to lock in your travel plans!</p>
                </div>

                {error && <p className="text-center text-red-600 bg-red-100 p-3 rounded-lg">{error}</p>}

                <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Name, Email, Mobile inputs */}
                    <div className="relative">
                        <User className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <input type="text" name="name" value={formData.name} onChange={handleChange} required className="w-full pl-11 pr-4 py-3 bg-gray-100 text-gray-800 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500" placeholder="Full Name" disabled={loading} />
                    </div>
                    <div className="relative">
                        <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <input type="email" name="email" value={formData.email} onChange={handleChange} required className="w-full pl-11 pr-4 py-3 bg-gray-100 text-gray-800 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500" placeholder="Email Address" disabled={loading} />
                    </div>
                    <div className="relative">
                        <Smartphone className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <input type="tel" name="mobile" value={formData.mobile} onChange={handleChange} required className="w-full pl-11 pr-4 py-3 bg-gray-100 text-gray-800 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500" placeholder="Mobile Number" disabled={loading} />
                    </div>
                    
                    {/* --- State and City Dropdowns --- */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div className="relative">
                            <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 z-10" size={20} />
                            <select name="state" value={formData.state} onChange={handleChange} required className="w-full pl-11 pr-10 py-3 bg-gray-100 text-gray-800 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500 appearance-none">
                                <option value="" disabled>Select State</option>
                                {indianStates.map(state => (
                                    <option key={state.name} value={state.name}>{state.name}</option>
                                ))}
                            </select>
                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-400">
                                <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 3a.75.75 0 01.53.22l3.5 3.5a.75.75 0 01-1.06 1.06L10 4.81 6.53 8.28a.75.75 0 01-1.06-1.06l3.5-3.5A.75.75 0 0110 3zm-3.72 9.53a.75.75 0 011.06 0L10 15.19l2.47-2.47a.75.75 0 111.06 1.06l-3.5 3.5a.75.75 0 01-1.06 0l-3.5-3.5a.75.75 0 010-1.06z" clipRule="evenodd" /></svg>
                            </div>
                        </div>
                        <div className="relative">
                            <Building className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 z-10" size={20} />
                            <select name="city" value={formData.city} onChange={handleChange} required className="w-full pl-11 pr-10 py-3 bg-gray-100 text-gray-800 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500 appearance-none" disabled={!formData.state}>
                                <option value="" disabled>Select City</option>
                                {cities.map(city => (
                                    <option key={city} value={city}>{city}</option>
                                ))}
                            </select>
                             <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-400">
                                <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 3a.75.75 0 01.53.22l3.5 3.5a.75.75 0 01-1.06 1.06L10 4.81 6.53 8.28a.75.75 0 01-1.06-1.06l3.5-3.5A.75.75 0 0110 3zm-3.72 9.53a.75.75 0 011.06 0L10 15.19l2.47-2.47a.75.75 0 111.06 1.06l-3.5 3.5a.75.75 0 01-1.06 0l-3.5-3.5a.75.75 0 010-1.06z" clipRule="evenodd" /></svg>
                            </div>
                        </div>
                    </div>
                    
                    {/* --- Submit Button --- */}
                    <div>
                        <button type="submit" className="w-full px-4 py-3.5 font-bold text-lg text-white bg-gradient-to-r from-purple-600 to-indigo-600 rounded-lg hover:from-purple-700 hover:to-indigo-700" disabled={loading}>
                            {loading ? 'Submitting...' : 'Confirm & Book Now'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default BookTicket;
