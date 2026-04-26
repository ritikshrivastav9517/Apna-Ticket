import Booking from '../models/bookingModel.js';
import Ticket from '../models/ticketPostModel.js';
import nodemailer from 'nodemailer';
import axios from 'axios';
import { URLSearchParams } from 'url'; // Isko import karna zaroori hai

// --- Nodemailer Setup ---
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

// @desc    Create a new booking and notify the seller
// @route   POST /api/v1/book-ticket
export const createBookingController = async (req, res) => {
    try {
        const { name, email, mobile, state, city, ticketId } = req.body;

        // 1. Validation
        if (!name || !email || !mobile || !state || !city || !ticketId) {
            return res.status(400).json({ success: false, message: 'Please fill all fields and provide a ticket ID.' });
        }

        // 2. Ticket dhoondhein jise book kiya jaa raha hai
        const ticketToBook = await Ticket.findById(ticketId);
        if (!ticketToBook) {
            return res.status(404).json({ success: false, message: 'Ticket not found.' });
        }

        // 3. Booking data save karein
        await Booking.create({ name, email, mobile, state, city, ticketId,
             bookedBy: req.user._id
         });

        // --- 4. Seller ko Notifications Bhejein ---
        const sellerEmail = ticketToBook.email;
        const sellerMobile = ticketToBook.mobile;
        const messageToSeller = `Hi! New booking request for your ticket from ${ticketToBook.from} to ${ticketToBook.to}. Buyer: ${name}, Mobile: ${mobile}. Contact them soon! - ApnaTicket`;

        // Email Bhejein
        try {
            await transporter.sendMail({
                from: `"Apna Ticket" <${process.env.EMAIL_USER}>`,
                to: sellerEmail,
                subject: 'New Booking Request for Your Ticket!',
                text: messageToSeller,
            });
        } catch (emailError) {
            console.error("Failed to send email:", emailError);
        }

        // --- NAYA SMS LOGIC (Textlocal) ---
        try {
            const params = new URLSearchParams();
            params.append('apikey', process.env.TEXTLOCAL_API_KEY);
            params.append('numbers', `91${sellerMobile}`); // Country code ke saath number
            params.append('message', messageToSeller);
            params.append('sender', 'APNTKT'); // Sender ID (Textlocal par set karna padega)

            await axios.post('https://api.textlocal.in/send/', params);
        } catch (smsError) {
            console.error("Failed to send SMS:", smsError.response ? smsError.response.data : smsError.message);
        }

        res.status(201).json({
            success: true,
            message: 'Booking request sent successfully! The ticket owner will contact you soon.',
        });

    } catch (error) {
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};


