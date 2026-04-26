import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, Tag, Armchair, Train, Bus, IndianRupee, User, CheckCircle, RefreshCw } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import axios from 'axios';

const TicketItem = React.forwardRef(({ ticket, onStatusChange, showOwnerControls = false }, ref) => {
    const navigate = useNavigate();
    const { userInfo } = useAuth();

    const handleStatusUpdate = async (newStatus) => {
        const confirmText = newStatus === 'sold' 
            ? "Are you sure you want to mark this ticket as sold?" 
            : "Are you sure you want to make this ticket available again?";
        
        if (!window.confirm(confirmText)) return;

        try {
            await axios.patch(`/api/v1/tickets/${ticket._id}/status`, { status: newStatus }, { withCredentials: true });
            if(onStatusChange) onStatusChange(ticket._id, newStatus);
        } catch (error) {
            alert("An error occurred.");
        }
    };
    
    const handleBookClick = () => {
        if (userInfo) {
            // YAHAN BADLAV KIYA GAYA HAI
            // ticketId ko state ke zariye booking page par bhejein
            navigate('/book-ticket', { state: { ticketId: ticket._id } });
        } else {
            alert('Please log in to book a ticket.');
            navigate('/login');
        }
    };
    
    const getFirstName = (name) => name ? name.split(' ')[0] : 'User';
    const formattedDate = new Date(ticket.journeyDate).toLocaleDateString('en-GB');
    const formatTime = (time24) => {
        if (!time24) return '';
        const [h, m] = time24.split(':');
        return `${(h % 12) || 12}:${m} ${h >= 12 ? 'PM' : 'AM'}`;
    };

    const isOwner = userInfo && userInfo._id === ticket.postedBy?._id;

    return (
        <div ref={ref} className={`relative bg-gradient-to-r from-purple-500 to-indigo-500 p-1 rounded-2xl shadow-lg mb-6 transition-opacity duration-500 ${ticket.status === 'sold' && showOwnerControls ? 'opacity-60' : ''}`}>
            {ticket.status === 'sold' && showOwnerControls && (
                <div className="absolute top-4 right-4 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full z-10 flex items-center gap-1">
                    <CheckCircle size={14} />
                    SOLD
                </div>
            )}
            <div className="bg-white rounded-xl p-5">
                <div className="flex justify-between items-start">
                    <div>
                        <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-semibold ${ticket.travelType === 'train' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}`}>
                            {ticket.travelType === 'train' ? <Train size={16} /> : <Bus size={16} />}
                            {ticket.travelType.toUpperCase()}
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-gray-500 mt-2">
                            <User size={12} />
                            <span>Posted by {getFirstName(ticket.postedBy?.name)}</span>
                        </div>
                    </div>
                    <div className="text-right">
                        <p className="text-gray-500 text-sm">Price</p>
                        <p className="text-3xl font-bold text-gray-900 flex items-center">
                            <IndianRupee size={22} className="mr-0.5" />{ticket.price}
                        </p>
                    </div>
                </div>
                <div className="flex items-center justify-between my-5">
                    <div className="text-left">
                        <p className="font-bold text-2xl text-gray-800">{ticket.from}</p>
                        <p className="text-sm text-gray-500">From</p>
                    </div>
                    <div className="text-center">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-purple-400">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                        </svg>
                    </div>
                    <div className="text-right">
                        <p className="font-bold text-2xl text-gray-800">{ticket.to}</p>
                        <p className="text-sm text-gray-500">To</p>
                    </div>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg flex justify-around items-center text-center">
                    <div className="text-gray-700">
                        <p className="font-bold text-lg">{formattedDate}</p>
                        <p className="text-xs">Date</p>
                    </div>
                     <div className="border-l h-8 border-gray-200"></div>
                    <div className="text-gray-700">
                        <p className="font-bold text-lg">{formatTime(ticket.timing)}</p>
                        <p className="text-xs">Time</p>
                    </div>
                    <div className="border-l h-8 border-gray-200"></div>
                    <div className="text-gray-700">
                        <p className="font-bold text-lg">{ticket.vehicleNumber}</p>
                        <p className="text-xs">{ticket.travelType === 'bus' ? 'Bus No.' : 'Train No.'}</p>
                    </div>
                     <div className="border-l h-8 border-gray-200"></div>
                    <div className="text-gray-700">
                        <p className="font-bold text-lg uppercase">{ticket.seatType}</p>
                        <p className="text-xs">Seat Type</p>
                    </div>
                </div>
                
                {isOwner && showOwnerControls ? (
                    ticket.status === 'available' ? (
                        <button onClick={() => handleStatusUpdate('sold')} className="mt-6 w-full bg-green-600 text-white font-bold py-3 rounded-lg hover:bg-green-700">Mark as Sold</button>
                    ) : (
                        <button onClick={() => handleStatusUpdate('available')} className="mt-6 w-full bg-yellow-500 text-white font-bold py-3 rounded-lg hover:bg-yellow-600 flex items-center justify-center gap-2">
                            <RefreshCw size={16} /> Mark as Available
                        </button>
                    )
                ) : (
                    <button onClick={handleBookClick} disabled={ticket.status === 'sold'} className="mt-6 w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold py-3 rounded-lg hover:from-purple-700 hover:to-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed">
                        {ticket.status === 'sold' ? 'Ticket Sold' : 'BOOK TICKET'}
                    </button>
                )}
            </div>
        </div>
    );
});

export default TicketItem;
