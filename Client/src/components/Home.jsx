import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Train, Bus, Trash2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

// --- Import your static assets and components ---
import HomeLogo1 from "../assets/HomeLogo1.png";
import TravelOptions from './TravelOptions';

// Helper function to extract station code from a string like "Gorakhpur (GKP)"
const getStationCode = (stationString) => {
    if (!stationString || !stationString.includes('(')) return stationString;
    const match = stationString.match(/\(([^)]+)\)/);
    return match ? match[1] : stationString;
};

// --- Simple Ticket Item Component ---
const HomeTicketItem = ({ ticket, onDelete }) => {
    const navigate = useNavigate();
    const { userInfo } = useAuth();
    const formattedDate = new Date(ticket.journeyDate).toLocaleDateString('en-GB');
    const isOwner = userInfo && userInfo._id === ticket.postedBy?._id;

    const handleDetailsClick = () => {
        if (ticket.travelType === 'bus') {
            navigate('/bus-tickets', { state: { scrollToId: ticket._id } });
        } else if (ticket.travelType === 'train') {
            navigate('/train-tickets', { state: { scrollToId: ticket._id } });
        }
    };

    const handleDeleteClick = async () => {
        if (!userInfo) {
            alert("Please log in to delete a ticket.");
            navigate('/login');
            return;
        }
        if (!isOwner) {
            alert("You can only delete tickets that you have posted.");
            return;
        }
        if (window.confirm("Are you sure you want to delete this ticket permanently?")) {
            try {
                await axios.delete(`/api/v1/tickets/${ticket._id}`, { withCredentials: true });
                onDelete(ticket._id);
                alert("Ticket deleted successfully!");
            } catch (error) {
                alert("Failed to delete ticket. You may not be authorized.");
                console.error("Delete error:", error);
            }
        }
    };

    return (
        <div className="relative bg-white p-4 pl-6 rounded-lg shadow-md border border-gray-200">
            <button 
                onClick={handleDeleteClick} 
                title="Delete Ticket" 
                className={`absolute top-3 right-3 p-2 rounded-full transition-colors ${isOwner ? 'text-red-500 hover:bg-red-100' : 'text-gray-300 cursor-not-allowed'}`}
            >
                <Trash2 size={18} />
            </button>
            <div className={`absolute top-2 left-[-5px] bg-white px-2 py-0.5 border-t border-b border-r rounded-r-md ${ticket.travelType === 'bus' ? 'border-blue-300' : 'border-teal-300'}`}>
                <span className={`font-bold text-xs ${ticket.travelType === 'bus' ? 'text-blue-600' : 'text-teal-600'}`}>
                    {ticket.travelType.toUpperCase()}
                </span>
            </div>
            <div className="flex items-center justify-between pt-4 pr-8">
                <div className="flex items-center gap-2">
                    {/* YAHAN BADLAV KIYA GAYA HAI */}
                    <span className="bg-lime-100 text-lime-800 font-semibold px-3 py-1 rounded-md">
                        {ticket.travelType === 'train' ? getStationCode(ticket.from) : ticket.from}
                    </span>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-gray-400">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                    </svg>
                    {/* YAHAN BADLAV KIYA GAYA HAI */}
                    <span className="bg-lime-100 text-lime-800 font-semibold px-3 py-1 rounded-md">
                        {ticket.travelType === 'train' ? getStationCode(ticket.to) : ticket.to}
                    </span>
                </div>
                <div className="flex items-center gap-4">
                    <span className="bg-cyan-100 text-cyan-800 font-semibold px-4 py-1 rounded-full text-sm">{formattedDate}</span>
                    <button 
                        onClick={handleDetailsClick}
                        className="bg-blue-500 text-white font-bold px-4 py-2 rounded-md hover:bg-blue-600 transition-colors text-sm"
                    >
                        TICKET DETAILS
                    </button>
                </div>
            </div>
        </div>
    );
};

// --- Ticket Section Component ---
const TicketSection = ({ title, tickets, iconType, onDelete }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const ticketsPerPage = 5;
    const indexOfLastTicket = currentPage * ticketsPerPage;
    const indexOfFirstTicket = indexOfLastTicket - ticketsPerPage;
    const currentTickets = tickets.slice(indexOfFirstTicket, indexOfLastTicket);
    const totalPages = Math.ceil(tickets.length / ticketsPerPage);

    const handleNext = () => {
        if (currentPage < totalPages) setCurrentPage(currentPage + 1);
    };

    const handlePrev = () => {
        if (currentPage > 1) setCurrentPage(currentPage - 1);
    };

    if (tickets.length === 0) return null;

    return (
        <div className="space-y-4">
            <div className="flex justify-center items-center gap-3 bg-red-500 text-white p-3 rounded-lg">
                {iconType === 'train' ? <Train size={24} /> : <Bus size={24} />}
                <h3 className="text-2xl font-bold">{title}</h3>
            </div>
            <div className="space-y-3">
                {currentTickets.map(ticket => (
                    <HomeTicketItem key={ticket._id} ticket={ticket} onDelete={onDelete} />
                ))}
            </div>
            {totalPages > 1 && (
                <div className="flex justify-end items-center gap-4 pt-2">
                    <button onClick={handlePrev} disabled={currentPage === 1} className="px-4 py-2 font-semibold text-sm text-gray-700 bg-white border border-gray-300 rounded-md disabled:opacity-50">
                        Previous
                    </button>
                    <span className="text-sm text-gray-600">Page {currentPage} of {totalPages}</span>
                    <button onClick={handleNext} disabled={currentPage === totalPages} className="px-4 py-2 font-semibold text-sm text-gray-700 bg-white border border-gray-300 rounded-md disabled:opacity-50">
                        Next
                    </button>
                </div>
            )}
        </div>
    );
};


// --- Main Home Component ---
const Home = () => {
    const [busTickets, setBusTickets] = useState([]);
    const [trainTickets, setTrainTickets] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTickets = async () => {
            try {
                const { data } = await axios.get('/api/v1/tickets');
                setBusTickets(data.data.filter(t => t.travelType === 'bus'));
                setTrainTickets(data.data.filter(t => t.travelType === 'train'));
            } catch (error) {
                console.error("Failed to fetch tickets:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchTickets();
    }, []);

    const handleTicketDelete = (deletedTicketId) => {
        setBusTickets(currentTickets => currentTickets.filter(ticket => ticket._id !== deletedTicketId));
        setTrainTickets(currentTickets => currentTickets.filter(ticket => ticket._id !== deletedTicketId));
    };

    return (
        <>
            <style>
                {`
                    @keyframes marquee {
                        0% { transform: translateX(-100%); }
                        100% { transform: translateX(100%); }
                    }
                    .animate-marquee {
                        animation: marquee 15s linear infinite;
                    }
                `}
            </style>
            <div className="flex flex-col gap-y-12"> 
                
                <div
                    className="relative w-full h-64 md:h-80 rounded-xl bg-cover bg-center"
                    style={{ backgroundImage: `url(${HomeLogo1})` }}
                >
                    <div className="absolute inset-0 bg-black/40 rounded-xl p-6 flex flex-col justify-between">
                        <p 
                            className="font-bold italic text-xl text-white" 
                            style={{ textShadow: '1px 1px 4px rgba(0,0,0,0.7)' }}
                        >
                            Ticket nahi, fikar nahi
                        </p>
                        <div className="text-center">
                            <h1 
                                className="text-5xl md:text-7xl font-extrabold text-black-500"
                                style={{ textShadow: '2px 2px 8px rgba(0,0,0,0.5)' }}
                            >
                                Apna Ticket
                            </h1>
                            <p 
                                className="text-gray-200 text-lg md:text-xl mt-2 font-semibold"
                                style={{ textShadow: '1px 1px 4px rgba(0,0,0,0.7)' }}
                            >
                                Your Ultimate Platform for Buying & Selling Tickets
                            </p>
                        </div>
                        <p 
                            className="font-bold italic text-xl self-end text-white" 
                            style={{ textShadow: '1px 1px 4px rgba(0,0,0,0.7)' }}
                        >
                            Apna ticket, rahe befikar
                        </p>
                    </div>
                </div>

                <div className="bg-gray-50 p-6 rounded-lg">
                    <div className="flex justify-center mb-8">
                        <div className="w-full max-w-lg bg-sky-500 py-3 rounded-lg shadow-lg overflow-hidden">
                            <h2 className="text-3xl font-bold text-center text-white uppercase tracking-widest whitespace-nowrap animate-marquee">
                                Recently Posted Tickets
                            </h2>
                        </div>
                    </div>
                    
                    {loading ? (
                        <p className="text-center">Loading tickets...</p>
                    ) : (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-10 gap-y-8">
                            <TicketSection title="Train Tickets" tickets={trainTickets} iconType="train" onDelete={handleTicketDelete} />
                            <TicketSection title="Bus Tickets" tickets={busTickets} iconType="bus" onDelete={handleTicketDelete} />
                        </div>
                    )}
                </div>
                
                <TravelOptions /> 
            </div>
        </>
    );
};

export default Home;
