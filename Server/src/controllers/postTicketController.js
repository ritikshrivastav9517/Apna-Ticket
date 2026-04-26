import Ticket from '../models/ticketPostModel.js';
import Alert from '../models/alertModel.js'; // Alert model import karein
import nodemailer from 'nodemailer'; // Nodemailer import karein

// --- Nodemailer Setup ---
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

// Helper function to send notification emails
const sendTicketAlertEmail = async (userEmail, ticket) => {
    const message = `
        Hi there!
        A new ticket has been posted for a route you are watching:
        From: ${ticket.from}
        To: ${ticket.to}
        Date: ${new Date(ticket.journeyDate).toLocaleDateString('en-GB')}
        Price: ₹${ticket.price}
        Check it out now on Apna Ticket!
    `;
    try {
        await transporter.sendMail({
            from: `"Apna Ticket Alerts" <${process.env.EMAIL_USER}>`,
            to: userEmail,
            subject: `New Ticket Alert: ${ticket.from} to ${ticket.to}`,
            text: message,
        });
    } catch (error) {
        console.error(`Failed to send alert email to ${userEmail}:`, error);
    }
};


export const postTicketController = async (req, res) => {
    try {
        // Form se saara data lein
        const {
            travelType, from, to, journeyDate, vehicleNumber, 
            timing, seatType, price, email, mobile
        } = req.body;

        // Logged-in user ki ID lein
        const postedBy = req.user._id; 

        // Naya ticket object banayein
        const newTicketData = {
            travelType, from, to, journeyDate, vehicleNumber,
            timing, seatType, price, email, mobile, postedBy
        };
        
        const ticket = new Ticket(newTicketData);
        await ticket.save(); // Ticket ko database mein save karein

        // --- NAYA NOTIFICATION LOGIC ---
        // Ticket save hone ke baad, matching alerts dhoondhein
        const alerts = await Alert.find({
            from: ticket.from,
            to: ticket.to,
            travelType: ticket.travelType,
        }).populate('user', 'email'); // User ka email bhi fetch karein

        // Sabhi subscribed users ko email bhejein
        if (alerts.length > 0) {
            alerts.forEach(alert => {
                // Ticket post karne waale ko khud notification na bhejein
                if (alert.user._id.toString() !== ticket.postedBy.toString()) {
                    sendTicketAlertEmail(alert.user.email, ticket);
                }
            });
        }
        // --- LOGIC END ---

        res.status(201).json({
            success: true,
            message: "Ticket posted successfully!",
            data: ticket
        });

    } catch (error) {
        // Mongoose validation error ko handle karein
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(val => val.message);
            return res.status(400).json({ success: false, message: messages.join(', ') });
        }
        console.error("Error in posting ticket:", error);
        res.status(500).json({
            success: false,
            message: "Server error. Please try again later.",
        });
    }
};
