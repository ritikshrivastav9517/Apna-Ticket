import mongoose from 'mongoose';

const postedTicketSchema = new mongoose.Schema({
    travelType: {
        type: String,
        required: [true, 'Please specify the travel type (bus or train).'],
        enum: ['bus', 'train'],
    },
    from: {
        type: String,
        required: [true, 'The "From" location is required.'],
        trim: true
    },
    to: {
        type: String,
        required: [true, 'The "To" location is required.'],
        trim: true
    },
    journeyDate: {
        type: Date,
        required: [true, 'The date of journey is required.']
    },
    vehicleNumber: {
        type: String,
        required: [true, 'The vehicle (bus/train) number is required.'],
        trim: true
    },
    timing: {
        type: String,
        required: [true, 'The travel timing is required.']
    },
    seatType: {
        type: String,
        required: [true, 'Please specify the seat type.'],
    },
    price: {
        type: Number,
        required: [true, 'Please set a selling price.'],
        min: [0, 'Price cannot be negative.']
    },
    email: {
        type: String,
        required: [true, 'Email is required.'],
        match: [/^\S+@\S+\.\S+$/, 'Please use a valid email address.'],
    },
    mobile: {
        type: String,
        required: [true, 'Mobile number is required.'],
        match: [/^\d{10}$/, 'Please use a valid 10-digit mobile number.'],
    },
    postedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    status: {
        type: String,
        enum: ['available', 'sold', 'expired'],
        default: 'available'
    },
    // Naya field jo auto-delete timer shuru karega
    soldAt: {
        type: Date,
    }
}, {
    timestamps: true
});

// TTL Index: Is line se MongoDB apne aap 'soldAt' field ke 3 ghante baad document delete kar dega
// 10800 seconds = 3 hours
postedTicketSchema.index({ "soldAt": 1 }, { expireAfterSeconds: 10800 });

const PostedTicket = mongoose.model('PostedTicket', postedTicketSchema);

export default PostedTicket;
