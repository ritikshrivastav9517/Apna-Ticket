import User from '../models/userModel.js';
import jwt from 'jsonwebtoken';

// Utility function to generate JWT and set it in a cookie
const generateToken = (res, userId) => {
    const token = jwt.sign({ id: userId }, process.env.JWT_SECRET, {
        expiresIn: '30d', // Token will expire in 30 days
    });

    res.cookie('jwt', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV !== 'development',
        sameSite: 'strict',
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days in milliseconds
    });
};

// @desc    Register a new user
// @route   POST /api/v1/signup
export const signupController = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ success: false, message: 'Please fill all fields.' });
        }

        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ success: false, message: 'User already exists.' });
        }

        const user = await User.create({
            name,
            email,
            password,
        });

        if (user) {
            generateToken(res, user._id);
            res.status(201).json({
                success: true,
                message: 'User registered successfully!',
                data: {
                    _id: user._id,
                    name: user.name,
                    email: user.email,
                },
            });
        } else {
            res.status(400).json({ success: false, message: 'Invalid user data.' });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
};

// @desc    Authenticate user & get token
// @route   POST /api/v1/login
export const loginController = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });

        if (user && (await user.comparePassword(password))) {
            generateToken(res, user._id);
            res.status(200).json({
                success: true,
                message: 'Login successful!',
                data: {
                    _id: user._id,
                    name: user.name,
                    email: user.email,
                },
            });
        } else {
            res.status(401).json({ success: false, message: 'Invalid email or password.' });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
};

// @desc    Logout user / clear cookie
// @route   POST /api/v1/logout
export const logoutController = (req, res) => {
    res.cookie('jwt', '', {
        httpOnly: true,
        expires: new Date(0),
    });
    res.status(200).json({ success: true, message: 'Logged out successfully' });
};

// @desc    Google auth callback
// @route   GET /api/v1/auth/google/callback
export const googleCallbackController = (req, res) => {
    generateToken(res, req.user._id);
    // Frontend ke helper page par redirect karein
    res.redirect('http://localhost:5173/login/success'); 
};

// @desc    Get user profile
// @route   GET /api/v1/me
export const getMeController = async (req, res) => {
    // authMiddleware 'req.user' ko set kar dega
    // req.user mein password pehle se hi hata hua hai
    res.status(200).json({ success: true, data: req.user });
};

// @desc    Forgot password
// @route   POST /api/v1/forgot-password
export const forgotPasswordController = async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        // Reset token generate karein
        const resetToken = crypto.randomBytes(20).toString('hex');

        // Token ko hash karke database mein save karein
        user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
        user.resetPasswordExpire = Date.now() + 10 * 60 * 1000; // 10 minute
        await user.save({ validateBeforeSave: false });

        // Reset password link banayein
        const resetUrl = `${req.protocol}://${req.get('host')}/reset-password/${resetToken}`;

        const message = `You are receiving this email because you (or someone else) has requested the reset of a password. Please make a PUT request to: \n\n ${resetUrl}`;

        // Email bhejein (Nodemailer ka istemal karke)
        // ... email bhejne ka logic yahan aayega ...

        res.status(200).json({ success: true, message: `Email sent to ${user.email}` });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// @desc    Reset password
// @route   PUT /api/v1/reset-password/:token
export const resetPasswordController = async (req, res) => {
    try {
        // Token ko hash karein
        const resetPasswordToken = crypto.createHash('sha256').update(req.params.token).digest('hex');

        const user = await User.findOne({
            resetPasswordToken,
            resetPasswordExpire: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({ success: false, message: 'Invalid or expired token' });
        }

        // Naya password set karein
        user.password = req.body.password;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        await user.save();

        res.status(200).json({ success: true, message: 'Password updated successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};