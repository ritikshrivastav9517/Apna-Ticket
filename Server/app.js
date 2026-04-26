import express from 'express';
import dbConnect from './src/config/dbConnection.js';
import route from './src/routes/route.js';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import passport from 'passport'; // Passport ko import karein
import './src/config/passport-setup.js'; // Apni passport config file ko import karein

dotenv.config();

const port = process.env.PORT || 3000;
const app = express();

// Middlewares
app.use(cors({
    origin: '*', 
    //origin: 'http://localhost:5173', 
    credentials: true,
}));
app.use(express.json());
app.use(cookieParser());

// Passport Middleware ko initialize karein
app.use(passport.initialize());

// Routes
app.use('/api/v1', route);

const startServer = async () => {
    try {
        await dbConnect();
        app.listen(port, () => {
            console.log(`Server is running on port ${port}`);
        });
    } catch (error) {
        console.error("Error starting server:", error.message);
        process.exit(1);
    }
};

startServer();