// import express from 'express';
// import passport from 'passport';
// import dotenv from 'dotenv';
// import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from '../utils/jwt.util';
// import { authenticate, AuthRequest } from '../middlewares/authMiddleware';
// import User from '../models/User';
// import Admin from '../models/Admin';
// import bcrypt from 'bcryptjs';

// dotenv.config();

// const authauthRouter = express.authRouter();

// authauthRouter.get(
//   '/google',
//   passport.authenticate('google', {
//     scope: ['profile', 'email'],
//     session: false,
//   })
// );

// authauthRouter.get(
//   '/google/callback',
//   passport.authenticate('google', {
//     failureRedirect: '/login',
//     session: false,
//   }),
//   (req, res) => {
//     const user = req.user as any;

//     const accessToken = generateAccessToken(user._id, user.email, 'user');
//     const refreshToken = generateRefreshToken(user._id);

//     res.cookie('refreshToken_user', refreshToken, {
//       httpOnly: true,
//       secure: false,
//       sameSite: 'lax',
//       domain: process.env.COOKIE_DOMAIN,
//       path: '/',
//       maxAge: Number(process.env.REFRESH_TOKEN_MAX_AGE), // 7 days
//     });

//     // Redirect to the frontend with token
//     res.redirect(`${process.env.GOOGLE_REDIRECT_URL}?token=${accessToken}`);
//   }
// );

// authauthRouter.get('/me', authenticate, async (req: AuthRequest, res) => {
//   try {
//     const role = req.user?.role;

//     if (role === 'santa') {
//       const admin = await Admin.findById(req.user?.id);
//       if (!admin) {
//         return res.status(404).json({ message: 'Santa not found' });
//       }
//       res.json({ _id: admin._id, email: 'santa@northpole.com', role: 'santa', name: 'Santa Claus' });
//     } else {
//       const user = await User.findById(req.user?.id).select('-googleId');
//       if (!user) {
//         return res.status(404).json({ message: 'User not found' });
//       }
//       res.json(user);
//     }
//   } catch (error) {
//     res.status(500).json({ message: 'Server error' });
//   }
// });

// authauthRouter.post('/refresh', async (req, res) => {
//   try {
//     const userRefreshToken = req.cookies.refreshToken_user;
//     const santaRefreshToken = req.cookies.refreshToken_santa;

//     if (!userRefreshToken && !santaRefreshToken) {
//       return res.status(401).json({ message: 'No refresh token provided' });
//     }

//     // Try user refresh token first
//     if (userRefreshToken) {
//       try {
//         const decoded = verifyRefreshToken(userRefreshToken);
//         const user = await User.findById(decoded.id);

//         if (!user) {
//           return res.status(404).json({ message: 'User not found' });
//         }

//         const accessToken = generateAccessToken(user._id.toString(), user.email, 'user');
//         return res.json({ token: accessToken, role: 'user' });
//       } catch (error) {
//         // User refresh token invalid, try santa token if available
//       }
//     }

//     // Try santa refresh token
//     if (santaRefreshToken) {
//       try {
//         const decoded = verifyRefreshToken(santaRefreshToken);
//         const admin = await Admin.findById(decoded.id);

//         if (!admin) {
//           return res.status(404).json({ message: 'Santa not found' });
//         }

//         const accessToken = generateAccessToken(admin._id.toString(), 'santa@northpole.com', 'santa');
//         return res.json({ token: accessToken, role: 'santa' });
//       } catch (error) {
//         return res.status(401).json({ message: 'Invalid refresh token' });
//       }
//     }

//     return res.status(401).json({ message: 'Invalid refresh token' });
//   } catch (error) {
//     res.status(500).json({ message: 'Server error during token refresh' });
//   }
// });

// authauthRouter.post('/santa/login', async (req, res) => {
//   const { password } = req.body;

//   try {
//     const admin = await Admin.findOne();
//     if (!admin) {
//       return res.status(404).json({ message: 'Santa not found in database!' });
//     }

//     const isMatch = await bcrypt.compare(password, admin.password);
//     if (!isMatch) {
//       return res.status(401).json({ message: 'The elves don\'t recognize that password!' });
//     }

//     const accessToken = generateAccessToken((admin._id as any).toString(), 'santa@northpole.com', 'santa');
//     const refreshToken = generateRefreshToken((admin._id as any).toString());

//     res.cookie('refreshToken_santa', refreshToken, {
//       httpOnly: true,
//       secure: false,
//       sameSite: 'lax',
//       domain: process.env.COOKIE_DOMAIN,
//       path: '/',
//       maxAge: Number(process.env.REFRESH_TOKEN_MAX_AGE), // 7 days
//     });

//     res.json({ token: accessToken });
//   } catch (error) {
//     res.status(500).json({ message: 'Server error during Santa login' });
//   }
// });

// export default authauthRouter;

import express from 'express';
import passport from 'passport';
import { authController } from '../dependencyHandlers/auth.dependencies';
import { authenticate } from '../middlewares/authMiddleware';


const authRouter = express.Router();

authRouter.get('/google', passport.authenticate('google', { scope: ['profile', 'email'], session: false }));

authRouter.get(
  '/google/callback',
  passport.authenticate('google', { failureRedirect: '/login', session: false }),
  authController.googleCallback.bind(authController)
);

authRouter.get('/me', authenticate, authController.getProfile.bind(authController));

authRouter.post('/refresh', authController.refreshToken.bind(authController));

authRouter.post('/santa/login', authController.santaLogin.bind(authController));

export default authRouter;

