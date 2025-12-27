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

authRouter.post('/logout', authController.logout.bind(authController));


export default authRouter;

