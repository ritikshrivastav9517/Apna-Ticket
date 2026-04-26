import Feedback from '../models/feedbackModel.js';
import nodemailer from 'nodemailer'; // Nodemailer ko import karein

// --- Nodemailer Setup ---
// Yah wahi setup hai jo humne booking notifications ke liye istemal kiya tha
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

// @desc    Create a new feedback or issue report and notify owner
// @route   POST /api/v1/feedback
export const createFeedbackController = async (req, res) => {
    try {
        const { formType, message } = req.body;

        if (!formType || !message) {
            return res.status(400).json({ success: false, message: 'Message cannot be empty.' });
        }

        const userId = req.user ? req.user._id : null;
        const userName = req.user ? req.user.name : 'An anonymous user';
        const userEmail = req.user ? req.user.email : 'Not provided';

        // 1. Data ko database mein save karein
        await Feedback.create({
            formType,
            message,
            user: userId,
        });

        // --- 2. Website Owner ko Email Notification Bhejein ---
        const mailToOwner = {
            from: `"Apna Ticket Notification" <${process.env.EMAIL_USER}>`,
            to: process.env.EMAIL_USER, // Aapke apne email par
            subject: `New ${formType} Received from ${userName}!`,
            html: `
                <h3>You have received a new ${formType} report.</h3>
                <p><strong>From:</strong> ${userName} (${userEmail})</p>
                <p><strong>Message:</strong></p>
                <p>${message}</p>
            `
        };

        try {
            await transporter.sendMail(mailToOwner);
        } catch (emailError) {
            console.error("Failed to send notification email to owner:", emailError);
            // Email fail hone par bhi user ko success response bhejein
        }

        res.status(201).json({
            success: true,
            message: `${formType} submitted successfully! Thank you.`,
        });

    } catch (error) {
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};
