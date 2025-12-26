import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import './config/passport'; // Initialize passport
import { connectDB } from './config/mongodb';
import authRouter from './routes/auth.routes';
import giftRouter from './routes/gift.routes';
import letterRouter from './routes/letter.routes';
import passport from 'passport';

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to Database
connectDB();

// Middleware
app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
app.use(express.json());
app.use(cookieParser());

app.use(passport.initialize());

// Routes
app.get('/', (req, res) => {
    res.send("API IS WORKING...");
});

app.use('/auth', authRouter);
app.use('/api/gifts', giftRouter);
app.use('/api/letters', letterRouter);

app.listen(PORT, () => {
    console.log(`Server started successfully at ${PORT}`)
})