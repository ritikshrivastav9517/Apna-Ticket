import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { X, Trash2, Ticket, ShoppingCart, ChevronDown, ChevronUp, Train, Bus } from 'lucide-react';

// Helper function to extract station code
const getStationCode = (stationString) => {
    if (!stationString || !stationString.includes('(')) return stationString;
    const match = stationString.match(/\(([^)]+)\)/);
    return match ? match[1] : stationString;
};

// Chhota ticket item component
const ProfileTicketItem = ({ ticket, type, onDelete }) => (
    <div className="bg-white/10 p-3 rounded-lg flex justify-between items-center">
        <div>
            <p className="font-bold text-white">
                {ticket.travelType === 'train' ? getStationCode(ticket.from) : ticket.from} → {ticket.travelType === 'train' ? getStationCode(ticket.to) : ticket.to}
            </p>
            <p className="text-xs text-white/70">{new Date(ticket.journeyDate).toLocaleDateString('en-GB')}</p>
        </div>
        <button onClick={() => onDelete(ticket._id, type)} className="p-2 text-red-400 hover:bg-red-500 hover:text-white rounded-full">
            <Trash2 size={16} />
        </button>
    </div>
);

const ProfileSidebar = ({ isOpen, onClose }) => {
    const { userInfo } = useAuth();
    const [postedTickets, setPostedTickets] = useState([]);
    const [bookedTickets, setBookedTickets] = useState([]);
    const [activeDropdown, setActiveDropdown] = useState(null); // 'posted-bus', 'posted-train', 'booked'

    useEffect(() => {
        if (isOpen) {
            const fetchProfileData = async () => {
                try {
                    const [postedRes, bookedRes] = await Promise.all([
                        axios.get('/api/v1/profile/my-posted-tickets', { withCredentials: true }),
                        axios.get('/api/v1/profile/my-booked-tickets', { withCredentials: true })
                    ]);
                    setPostedTickets(postedRes.data.data);
                    setBookedTickets(bookedRes.data.data);
                } catch (error) {
                    console.error("Failed to fetch profile data", error);
                }
            };
            fetchProfileData();
        }
    }, [isOpen]);

    const handleDelete = async (id, type) => {
        const url = type === 'sell' ? `/api/v1/tickets/${id}` : `/api/v1/profile/bookings/${id}`;
        if (window.confirm("Are you sure you want to delete this?")) {
            try {
                await axios.delete(url, { withCredentials: true });
                if (type === 'sell') {
                    setPostedTickets(postedTickets.filter(t => t._id !== id));
                } else {
                    setBookedTickets(bookedTickets.filter(b => b._id !== id));
                }
            } catch (error) {
                alert("Failed to delete.");
            }
        }
    };

    const postedTrainTickets = postedTickets.filter(t => t.travelType === 'train');
    const postedBusTickets = postedTickets.filter(t => t.travelType === 'bus');

    return (
        <>
            <div onClick={onClose} className={`fixed inset-0 bg-black/40 z-50 transition-opacity ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}></div>
            <div className={`fixed top-0 right-0 h-full w-full max-w-md bg-gradient-to-b from-slate-800 to-slate-900 text-white shadow-2xl z-50 transform transition-transform duration-300 ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
                <div className="p-6 flex flex-col h-full">
                    {/* Header */}
                    <div className="flex justify-between items-center border-b border-white/20 pb-4">
                        <h2 className="text-2xl font-bold">My Profile</h2>
                        <button onClick={onClose} className="p-2 rounded-full hover:bg-white/20"><X /></button>
                    </div>
                    
                    <div className="text-center py-6">
                        <h3 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-500">{userInfo?.name}</h3>
                    </div>

                    <div className="flex-grow overflow-y-auto space-y-4 pr-2">
                        {/* Sell Section */}
                        <div className="bg-white/5 p-4 rounded-xl">
                            <h4 className="font-bold text-lg mb-3 flex items-center gap-2"><Ticket /> My Posted Tickets ({postedTickets.length})</h4>
                            {/* Train Tickets Dropdown */}
                            <div className="bg-black/20 rounded-lg">
                                <button onClick={() => setActiveDropdown(activeDropdown === 'posted-train' ? null : 'posted-train')} className="w-full flex justify-between items-center p-3 font-semibold">
                                    <span className="flex items-center gap-2"><Train size={18} /> Train Tickets ({postedTrainTickets.length})</span>
                                    {activeDropdown === 'posted-train' ? <ChevronUp /> : <ChevronDown />}
                                </button>
                                {activeDropdown === 'posted-train' && (
                                    <div className="p-3 border-t border-white/10 space-y-2">
                                        {postedTrainTickets.map(ticket => <ProfileTicketItem key={ticket._id} ticket={ticket} type="sell" onDelete={handleDelete} />)}
                                    </div>
                                )}
                            </div>
                            {/* Bus Tickets Dropdown */}
                            <div className="bg-black/20 rounded-lg mt-2">
                                <button onClick={() => setActiveDropdown(activeDropdown === 'posted-bus' ? null : 'posted-bus')} className="w-full flex justify-between items-center p-3 font-semibold">
                                    <span className="flex items-center gap-2"><Bus size={18} /> Bus Tickets ({postedBusTickets.length})</span>
                                    {activeDropdown === 'posted-bus' ? <ChevronUp /> : <ChevronDown />}
                                </button>
                                {activeDropdown === 'posted-bus' && (
                                    <div className="p-3 border-t border-white/10 space-y-2">
                                        {postedBusTickets.map(ticket => <ProfileTicketItem key={ticket._id} ticket={ticket} type="sell" onDelete={handleDelete} />)}
                                    </div>
                                )}
                            </div>
                        </div>
                        {/* Buy Section */}
                        <div className="bg-white/5 p-4 rounded-xl">
                             <h4 className="font-bold text-lg mb-3 flex items-center gap-2"><ShoppingCart /> My Booked Tickets ({bookedTickets.length})</h4>
                             <div className="space-y-2">
                                 {bookedTickets.map(booking => <ProfileTicketItem key={booking._id} ticket={booking.ticketId} type="buy" onDelete={handleDelete} />)}
                             </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ProfileSidebar;
