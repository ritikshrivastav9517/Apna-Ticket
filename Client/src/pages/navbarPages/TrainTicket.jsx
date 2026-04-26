import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import TicketItem from '../../components/TicketItem';
import AutocompleteInput from '../../components/AutocompleteInput'; // Autocomplete component import karein
import { indianTrainStations } from '../../data/indianTrainStations'; // Station data import karein

const TrainTicket = () => {
    // Search form ke liye state
    const [from, setFrom] = useState('');
    const [to, setTo] = useState('');
    const [date, setDate] = useState('');

    // Ticket results aur loading ke liye state
    const [trainTickets, setTrainTickets] = useState([]);
    const [loading, setLoading] = useState(true);

    // Pagination ke liye state
    const [currentPage, setCurrentPage] = useState(1);
    const ticketsPerPage = 5;

    // Scrolling ke liye hooks
    const location = useLocation();
    const ticketRefs = useRef({});

    // Station data ko format karein
    const formattedStations = indianTrainStations.map(s => `${s.name} (${s.code})`);

    // Tickets fetch karne ke liye function
    const fetchTrainTickets = async (searchParams) => {
        setLoading(true);
        try {
            const params = new URLSearchParams({ travelType: 'train', ...searchParams });
            for (const [key, value] of params.entries()) {
                if (!value) {
                    params.delete(key);
                }
            }
            const url = `/api/v1/tickets?${params.toString()}`;
            const { data } = await axios.get(url);
            setTrainTickets(data.data);
            setCurrentPage(1);
        } catch (error) {
            console.error("Failed to fetch train tickets:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTrainTickets({});
    }, []);

    useEffect(() => {
        const scrollToId = location.state?.scrollToId;
        if (scrollToId && ticketRefs.current[scrollToId]) {
            setTimeout(() => {
                ticketRefs.current[scrollToId].scrollIntoView({
                    behavior: 'smooth',
                    block: 'center',
                });
            }, 100);
        }
    }, [trainTickets, location.state]);

    const handleSearch = (e) => {
        e.preventDefault();
        fetchTrainTickets({ from, to, journeyDate: date });
    };

    const handleStatusChange = (ticketId, newStatus) => {
        setTrainTickets(currentTickets => 
            currentTickets.map(t => 
                t._id === ticketId ? { ...t, status: newStatus } : t
            )
        );
    };

    // Pagination Logic
    const indexOfLastTicket = currentPage * ticketsPerPage;
    const indexOfFirstTicket = indexOfLastTicket - ticketsPerPage;
    const currentTickets = trainTickets.slice(indexOfFirstTicket, indexOfLastTicket);
    const totalPages = Math.ceil(trainTickets.length / ticketsPerPage);

    const handleNext = () => {
        if (currentPage < totalPages) setCurrentPage(currentPage + 1);
    };

    const handlePrev = () => {
        if (currentPage > 1) setCurrentPage(currentPage - 1);
    };

    return (
        <div className="w-full max-w-5xl mx-auto py-10">
            <h1 className="text-4xl font-bold text-center text-gray-800">Search for Train Tickets</h1>

            {/* Search Form */}
            <div className="mt-8 p-6 bg-white rounded-xl shadow-lg">
                <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                    <div className="md:col-span-1">
                        <label htmlFor="from" className="text-sm font-semibold text-gray-600 block">FROM</label>
                        <AutocompleteInput name="from" value={from} onChange={(e) => setFrom(e.target.value)} placeholder="New Delhi (NDLS)" data={formattedStations} />
                    </div>
                    <div className="md:col-span-1">
                        <label htmlFor="to" className="text-sm font-semibold text-gray-600 block">TO</label>
                        <AutocompleteInput name="to" value={to} onChange={(e) => setTo(e.target.value)} placeholder="Mumbai Central (MMCT)" data={formattedStations} />
                    </div>
                    <div className="md:col-span-1">
                        <label htmlFor="date" className="text-sm font-semibold text-gray-600 block">DATE</label>
                        <input type="date" id="date" value={date} onChange={(e) => setDate(e.target.value)} className="w-full px-4 py-2 mt-1 border rounded-md" />
                    </div>
                    <div className="md:col-span-1">
                        <button type="submit" className="w-full px-4 py-2 font-bold text-white bg-gray-800 rounded-md hover:bg-gray-900">
                            Search Trains
                        </button>
                    </div>
                </form>
            </div>

            {/* Dynamic Search Results */}
            <div className="mt-10">
                {loading ? (
                    <p className="text-center text-gray-500">Searching for train tickets...</p>
                ) : (
                    <div>
                        {currentTickets.length > 0 ? (
                            currentTickets.map(ticket => (
                                <TicketItem 
                                    key={ticket._id} 
                                    ticket={ticket} 
                                    ref={el => ticketRefs.current[ticket._id] = el}
                                    showOwnerControls={true}
                                    onStatusChange={handleStatusChange}
                                />
                            ))
                        ) : (
                            <p className="text-center text-gray-500">No matching train tickets found.</p>
                        )}
                    </div>
                )}
            </div>

            {/* Pagination Buttons */}
            {totalPages > 1 && (
                <div className="flex justify-center items-center gap-4 mt-8">
                    <button onClick={handlePrev} disabled={currentPage === 1} className="px-4 py-2 font-semibold text-gray-700 bg-white border border-gray-300 rounded-md disabled:opacity-50">
                        Previous
                    </button>
                    <span className="text-gray-600">
                        Page {currentPage} of {totalPages}
                    </span>
                    <button onClick={handleNext} disabled={currentPage === totalPages} className="px-4 py-2 font-semibold text-gray-700 bg-white border border-gray-300 rounded-md disabled:opacity-50">
                        Next
                    </button>
                </div>
            )}
        </div>
    );
};

export default TrainTicket;
