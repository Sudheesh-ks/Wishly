import { Request, Response } from 'express';

export interface ILetterController {
    getLetters(req: Request, res: Response): Promise<void>;
    createLetter(req: Request, res: Response): Promise<void>;
    updateLetterStatus(req: Request, res: Response): Promise<void>;
    togglePackedStatus(req: Request, res: Response): Promise<void>;
}