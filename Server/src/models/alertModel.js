import mongoose from 'mongoose';

const alertSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    from: {
        type: String,
        required: true,
        trim: true,
    },
    to: {
        type: String,
        required: true,
        trim: true,
    },
    travelType: {
        type: String,
        required: true,
        enum: ['bus', 'train'],
    },
}, { timestamps: true });

// Ek user ek hi route ke liye baar-baar alert na bana sake, iske liye compound index
alertSchema.index({ user: 1, from: 1, to: 1, travelType: 1 }, { unique: true });

const Alert = mongoose.model('Alert', alertSchema);

export default Alert;
