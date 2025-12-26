import { Request, Response } from 'express';

export interface IAuthController {
    googleCallback(req: Request, res: Response): Promise<void>;
    getProfile(req: any, res: Response): Promise<void>;
    refreshToken(req: Request, res: Response): Promise<void>;
    santaLogin(req: Request, res: Response): Promise<void>;
}