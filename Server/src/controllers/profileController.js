import Ticket from '../models/ticketPostModel.js';
import Booking from '../models/bookingModel.js';

// @desc    Fetch tickets posted by the logged-in user
// @route   GET /api/v1/profile/my-posted-tickets
export const getMyPostedTickets = async (req, res) => {
    try {
        const tickets = await Ticket.find({ postedBy: req.user._id }).sort({ createdAt: -1 });
        res.status(200).json({ success: true, data: tickets });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// @desc    Fetch tickets booked by the logged-in user
// @route   GET /api/v1/profile/my-booked-tickets
export const getMyBookedTickets = async (req, res) => {
    try {
        // 'ticketId' ko populate karein taaki ticket ki poori details milein
        const bookings = await Booking.find({ bookedBy: req.user._id })
            .populate('ticketId')
            .sort({ createdAt: -1 });
        res.status(200).json({ success: true, data: bookings });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// @desc    Delete a booking made by the user
// @route   DELETE /api/v1/profile/bookings/:id
export const deleteMyBooking = async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id);
        if (!booking) {
            return res.status(404).json({ success: false, message: 'Booking not found' });
        }
        // Security check
        if (booking.bookedBy.toString() !== req.user._id.toString()) {
            return res.status(403).json({ success: false, message: 'Not authorized' });
        }
        await booking.deleteOne();
        res.status(200).json({ success: true, message: 'Booking deleted' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};
