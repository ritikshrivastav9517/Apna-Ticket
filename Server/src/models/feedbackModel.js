import mongoose from 'mongoose';

const feedbackSchema = new mongoose.Schema({
    formType: {
        type: String,
        required: true,
        enum: ['Feedback', 'Issue'], // Sirf in do values ko accept karega
    },
    message: {
        type: String,
        required: [true, 'Message is required.'],
        trim: true,
    },
    // Optional: Agar user login hai, to uski ID save kar sakte hain
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }
}, { timestamps: true });

const Feedback = mongoose.model('Feedback', feedbackSchema);

export default Feedback;
