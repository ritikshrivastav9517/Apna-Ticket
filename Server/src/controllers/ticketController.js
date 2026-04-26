import Ticket from '../models/ticketPostModel.js';

// @desc    Fetch all tickets with filters and user info
// @route   GET /api/v1/tickets
export const getAllTicketsController = async (req, res) => {
    try {
        // Aaj ki तारीख (raat 12 baje se)
        const today = new Date();
        today.setUTCHours(0, 0, 0, 0);

        // 1. Base query to only get available tickets from today onwards
        const query = { 
            status: "available",
            journeyDate: { $gte: today } // Sirf future ke tickets laayega
        };

        // 2. Add other filters from URL to the query
        if (req.query.travelType) {
            query.travelType = req.query.travelType;
        }
        if (req.query.from) {
            query.from = req.query.from.toUpperCase();
        }
        if (req.query.to) {
            query.to = req.query.to.toUpperCase();
        }
        // Agar user koi specific future date search karta hai, to use handle karein
        if (req.query.journeyDate) {
            const searchDate = new Date(req.query.journeyDate);
            searchDate.setUTCHours(0, 0, 0, 0);

            // Agar search ki gayi date bhi past ki hai, to khali result bhejein
            if (searchDate < today) {
                return res.status(200).json({ success: true, count: 0, data: [] });
            }

            const nextDay = new Date(searchDate);
            nextDay.setUTCDate(searchDate.getUTCDate() + 1);

            query.journeyDate = {
                $gte: searchDate,
                $lt: nextDay,
            };
        }

        // 3. Execute the final query
        const tickets = await Ticket.find(query)
            .populate('postedBy', 'name')
            .sort({ journeyDate: 1 });

        res.status(200).json({
            success: true,
            count: tickets.length,
            data: tickets,
        });
    } catch (error) {
        console.error("Error in getAllTicketsController:", error);
        res.status(500).json({ success: false, message: "Server error." });
    }
};


// @desc    Fetch a single ticket by its ID
// @route   GET /api/v1/tickets/:id
export const getTicketByIdController = async (req, res) => {
    try {
        const ticket = await Ticket.findById(req.params.id).populate('postedBy', 'name');

        if (!ticket) {
            return res.status(404).json({ success: false, message: 'Ticket not found' });
        }

        res.status(200).json({
            success: true,
            data: ticket,
        });
    } catch (error) {
        console.error("Error in getTicketByIdController:", error);
        res.status(500).json({
            success: false,
            message: 'Server Error',
        });
    }
};

// @desc    Update a ticket's status (e.g., to 'sold')
// @route   PATCH /api/v1/tickets/:id/status
export const updateTicketStatusController = async (req, res) => {
    try {
        const ticket = await Ticket.findById(req.params.id);

        if (!ticket) {
            return res.status(404).json({ success: false, message: 'Ticket not found' });
        }

        // Security Check: Sirf ticket post karne wala user hi status badal sakta hai
        if (ticket.postedBy.toString() !== req.user._id.toString()) {
            return res.status(403).json({ success: false, message: 'User not authorized to update this ticket' });
        }

        const newStatus = req.body.status;
        ticket.status = newStatus;

        // Agar status 'sold' hai, to auto-delete timer shuru karein
        if (newStatus === 'sold') {
            ticket.soldAt = new Date();
        } 
        // Agar status wapas 'available' kiya jaata hai, to timer cancel kar dein
        else if (newStatus === 'available') {
            ticket.soldAt = undefined; // 'soldAt' field ko hata dein
        }

        const updatedTicket = await ticket.save();

        res.status(200).json({
            success: true,
            message: 'Ticket status updated successfully!',
            data: updatedTicket,
        });

    } catch (error) {
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

//ticket delete
export const deleteTicketController = async (req, res) => {
    try {
        const ticket = await Ticket.findById(req.params.id);

        if (!ticket) {
            return res.status(404).json({ success: false, message: 'Ticket not found' });
        }

        // Security Check: Sirf ticket post karne wala user hi use delete kar sakta hai
        if (ticket.postedBy.toString() !== req.user._id.toString()) {
            return res.status(403).json({ success: false, message: 'User not authorized to delete this ticket' });
        }

        // Ticket ko database se remove karein
        await ticket.deleteOne();

        res.status(200).json({
            success: true,
            message: 'Ticket deleted successfully!',
        });

    } catch (error) {
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};