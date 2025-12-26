import { Request, Response } from 'express';
import { IAuthService } from '../../services/interface/IAuthService';
import { IAuthController } from '../interface/IAuthController';

export class AuthController implements IAuthController {
  constructor(private readonly _authService: IAuthService) {}

  async googleCallback(req: Request, res: Response): Promise<void> {
    const { accessToken, refreshToken } = await this._authService.handleGoogleLogin(req.user as any);
    res.cookie('refreshToken_user', refreshToken, { httpOnly: true, path: '/' });
    res.redirect(`${process.env.GOOGLE_REDIRECT_URL}?token=${accessToken}`);
  }

  async getProfile(req: any, res: Response): Promise<void> {
    const profile = await this._authService.getProfile(req.user);
    res.json(profile);
  }

  async refreshToken(req: Request, res: Response): Promise<void> {
    const result = await this._authService.refresh(req.cookies);
    res.json(result);
  }

  async santaLogin(req: Request, res: Response): Promise<void> {
    const result = await this._authService.santaLogin(req.body.password);
    res.cookie('refreshToken_santa', result.refreshToken, { httpOnly: true, path: '/' });
    res.json({ token: result.accessToken });
  }
}
