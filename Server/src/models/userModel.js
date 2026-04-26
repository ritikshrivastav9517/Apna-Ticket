import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please provide your name."],
        trim: true,
    },
    email: {
        type: String,
        required: [true, "Please provide your email."],
        unique: true,
        lowercase: true,
        trim: true,
    },
    password: {
        type: String,
        required: [true, "Please provide a password."],
        minlength: [6, "Password must be at least 6 characters long."],
    },
    resetPasswordToken: String,
    
    resetPasswordExpire: Date,
}, { timestamps: true });

// Password hashing middleware: Hashes the password before saving the document
userSchema.pre('save', async function(next) {
    // Only run this function if the password was actually modified
    if (!this.isModified('password')) {
        return next();
    }
    // Hash the password
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// Method to compare entered password with the hashed password
userSchema.methods.comparePassword = async function(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);

export default User;