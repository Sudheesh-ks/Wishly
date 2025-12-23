import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import './config/passport'; // Initialize passport
import { connectDB } from './config/mongodb';
import authRouter from './routes/authRoute';
import giftRouter from './routes/giftRoute';
import letterRouter from './routes/letterRoute';
import passport from 'passport';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to Database
connectDB();

// Middleware
app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
app.use(express.json());

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