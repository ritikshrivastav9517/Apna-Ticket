import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Train, Bus, MapPin, Calendar, Clock, Ticket, Coins, ArrowRight, Mail, Smartphone } from 'lucide-react';
import { indianCities } from '../../data/indianCities';
import { indianTrainStations } from '../../data/indianTrainStations';
import AutocompleteInput from "../../components/AutocompleteInput";

const PostTicket = () => {
    const [formData, setFormData] = useState({
        travelType: "bus",
        from: "",
        to: "",
        journeyDate: "",
        vehicleNumber: "",
        timing: "",
        seatType: "seater",
        price: "",
        email: "",
        mobile: "",
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => {
            const newData = { ...prevData, [name]: value };
            if (name === "travelType") {
                newData.seatType = value === "bus" ? "seater" : "sleeper";
            }
            return newData;
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            await axios.post("/api/v1/postTicket", formData, { withCredentials: true });
            setLoading(false);
            // --- YAHAN BADLAV KIYA GAYA HAI ---
            alert("Ticket posted successfully! \n\nIMPORTANT: When your ticket is sold, please go to the Bus/Train tickets page and mark it as 'Sold' to avoid further inquiries.");
            navigate("/");
        } catch (err) {
            setLoading(false);
            if (err.response?.status === 401) {
                alert("You must be logged in to post a ticket.");
                navigate("/login");
            } else {
                setError(err.response?.data?.message || "Failed to post ticket.");
            }
        }
    };

    const today = new Date().toISOString().split('T')[0];
    const formattedStations = indianTrainStations.map(s => `${s.name} (${s.code})`);

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-slate-100">
            <div className="w-full max-w-4xl mx-auto p-8 bg-white rounded-2xl shadow-xl space-y-8">
                
                <div className="text-center">
                    <h1 className="text-4xl font-bold text-gray-900">Sell Your Unused Ticket</h1>
                    <p className="text-gray-600 mt-2">Help a fellow traveler and get some of your money back!</p>
                </div>

                {error && <p className="text-center text-red-600 bg-red-100 p-3 rounded-lg">{error}</p>}

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* --- Travel Type --- */}
                    <div className="grid grid-cols-2 gap-4">
                        <label className={`flex flex-col items-center justify-center p-4 border-2 rounded-lg cursor-pointer transition-all ${formData.travelType === 'bus' ? 'border-purple-600 bg-purple-50 shadow-md' : 'border-gray-200 bg-gray-50'}`}>
                            <input type="radio" name="travelType" value="bus" checked={formData.travelType === 'bus'} onChange={handleChange} className="sr-only" />
                            <Bus size={32} className={`mb-2 ${formData.travelType === 'bus' ? 'text-purple-600' : 'text-gray-400'}`} />
                            <span className={`font-semibold ${formData.travelType === 'bus' ? 'text-purple-700' : 'text-gray-600'}`}>Bus Ticket</span>
                        </label>
                        <label className={`flex flex-col items-center justify-center p-4 border-2 rounded-lg cursor-pointer transition-all ${formData.travelType === 'train' ? 'border-purple-600 bg-purple-50 shadow-md' : 'border-gray-200 bg-gray-50'}`}>
                            <input type="radio" name="travelType" value="train" checked={formData.travelType === 'train'} onChange={handleChange} className="sr-only" />
                            <Train size={32} className={`mb-2 ${formData.travelType === 'train' ? 'text-purple-600' : 'text-gray-400'}`} />
                            <span className={`font-semibold ${formData.travelType === 'train' ? 'text-purple-700' : 'text-gray-600'}`}>Train Ticket</span>
                        </label>
                    </div>

                    {/* --- From / To --- */}
                    <div className="flex items-center gap-4">
                        <div className="relative flex-1">
                            <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 z-10" size={20} />
                            <AutocompleteInput
                                name="from"
                                value={formData.from}
                                onChange={handleChange}
                                placeholder="From"
                                data={formData.travelType === 'bus' ? indianCities : formattedStations}
                                disabled={loading}
                            />
                        </div>
                        <ArrowRight className="text-purple-500" />
                        <div className="relative flex-1">
                            <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 z-10" size={20} />
                            <AutocompleteInput
                                name="to"
                                value={formData.to}
                                onChange={handleChange}
                                placeholder="To"
                                data={formData.travelType === 'bus' ? indianCities : formattedStations}
                                disabled={loading}
                            />
                        </div>
                    </div>

                    {/* --- Journey Details --- */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div className="relative">
                            <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                            <input 
                                type="date" 
                                name="journeyDate" 
                                value={formData.journeyDate} 
                                onChange={handleChange} 
                                required 
                                min={today}
                                className="w-full pl-11 pr-4 py-3 bg-gray-100 rounded-lg border-gray-200 focus:ring-2 focus:ring-purple-500" 
                                disabled={loading} 
                            />
                        </div>
                        <div className="relative">
                            <Clock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                            <input type="time" name="timing" value={formData.timing} onChange={handleChange} required className="w-full pl-11 pr-4 py-3 bg-gray-100 rounded-lg border-gray-200 focus:ring-2 focus:ring-purple-500" disabled={loading} />
                        </div>
                    </div>

                    {/* --- Contact Details --- */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div className="relative">
                            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                            <input type="email" name="email" value={formData.email} onChange={handleChange} required className="w-full pl-11 pr-4 py-3 bg-gray-100 rounded-lg" placeholder="Contact Email" disabled={loading} />
                        </div>
                        <div className="relative">
                            <Smartphone className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                            <input type="tel" name="mobile" value={formData.mobile} onChange={handleChange} required maxLength="10" pattern="\d{10}" className="w-full pl-11 pr-4 py-3 bg-gray-100 rounded-lg" placeholder="Contact Mobile (10 digits)" disabled={loading} />
                        </div>
                    </div>

                    {/* --- Ticket Specifics --- */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div className="relative">
                            <Ticket className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                            <input 
                                type={formData.travelType === 'train' ? 'text' : 'text'}
                                inputMode={formData.travelType === 'train' ? 'numeric' : 'text'}
                                pattern={formData.travelType === 'train' ? '[0-9]*' : undefined}
                                name="vehicleNumber" 
                                value={formData.vehicleNumber} 
                                onChange={handleChange} 
                                required 
                                className="w-full pl-11 pr-4 py-3 bg-gray-100 rounded-lg border-gray-200 focus:ring-2 focus:ring-purple-500" 
                                placeholder={formData.travelType === 'bus' ? 'Bus Number' : 'Train Number'} 
                                disabled={loading} 
                            />
                        </div>
                        <div className="relative">
                            <select name="seatType" value={formData.seatType} onChange={handleChange} required className="w-full pl-4 pr-4 py-3 bg-gray-100 rounded-lg border-gray-200 focus:ring-2 focus:ring-purple-500" disabled={loading}>
                                {formData.travelType === 'bus' ? (
                                    <>
                                        <option value="seater">Seater</option>
                                        <option value="sleeper">Sleeper</option>
                                    </>
                                ) : (
                                    <>
                                        <option value="sleeper">Sleeper</option>
                                        <option value="3ac">3AC</option>
                                        <option value="2ac">2AC</option>
                                        <option value="1ac">1AC</option>
                                    </>
                                )}
                            </select>
                        </div>
                    </div>
                    
                    {/* --- Price --- */}
                    <div className="relative">
                        <Coins className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <input type="number" name="price" value={formData.price} onChange={handleChange} required className="w-full pl-11 pr-4 py-3 bg-gray-100 rounded-lg border-gray-200 focus:ring-2 focus:ring-purple-500" placeholder="Selling Price (₹)" disabled={loading} />
                    </div>

                    {/* --- Submit Button --- */}
                    <div>
                        <button type="submit" className="w-full px-4 py-4 font-bold text-lg text-white bg-gradient-to-r from-purple-600 to-indigo-600 rounded-lg hover:from-purple-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-300 transform hover:scale-105 disabled:opacity-70 disabled:scale-100" disabled={loading}>
                            {loading ? 'Posting Ticket...' : 'Post My Ticket'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default PostTicket;
