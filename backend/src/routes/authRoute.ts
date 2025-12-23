import express from 'express';
import passport from 'passport';
import dotenv from 'dotenv';
import { generateAccessToken, generateRefreshToken } from '../utils/jwt.util';
import { authenticate, AuthRequest } from '../middlewares/authMiddleware';
import User from '../models/User';
import Admin from '../models/Admin';
import bcrypt from 'bcryptjs';

dotenv.config();

const authRouter = express.Router();

authRouter.get(
  '/google',
  passport.authenticate('google', {
    scope: ['profile', 'email'],
    session: false,
  })
);

authRouter.get(
  '/google/callback',
  passport.authenticate('google', {
    failureRedirect: '/login',
    session: false,
  }),
  (req, res) => {
    const user = req.user as any;

    const accessToken = generateAccessToken(user._id, user.email, 'user');
    const refreshToken = generateRefreshToken(user._id);

    res.cookie('refreshToken_user', refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      domain: process.env.COOKIE_DOMAIN,
      path: '/',
      maxAge: Number(process.env.REFRESH_TOKEN_MAX_AGE), // 7 days
    });

    // Redirect to the frontend with token
    res.redirect(`${process.env.GOOGLE_REDIRECT_URL}?token=${accessToken}`);
  }
);

authRouter.get('/me', authenticate, async (req: AuthRequest, res) => {
  try {
    const user = await User.findById(req.user?.id).select('-googleId');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

authRouter.post('/santa/login', async (req, res) => {
  const { password } = req.body;

  try {
    const admin = await Admin.findOne();
    if (!admin) {
      return res.status(404).json({ message: 'Santa not found in database!' });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'The elves don\'t recognize that password!' });
    }

    const accessToken = generateAccessToken((admin._id as any).toString(), 'santa@northpole.com', 'santa');
    res.json({ token: accessToken });
  } catch (error) {
    res.status(500).json({ message: 'Server error during Santa login' });
  }
});

export default authRouter;
