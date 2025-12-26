import { Request, Response } from 'express';
import { ILetterService } from '../../services/interface/ILetterService';

export class LetterController {
  constructor(private readonly _letterService: ILetterService) {}

  async getLetters(req: Request, res: Response): Promise<void> {
    try {
      const result = await this._letterService.getLetters(req.query);
      res.status(200).json(result);
    } catch (error: any) {
      console.error('getLetters error:', error);
      res.status(500).json({ message: error.message });
    }
  }

  async createLetter(req: Request, res: Response): Promise<void> {
    try {
      const letter = await this._letterService.createLetter(req.body);
      res.status(201).json(letter);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  async updateLetterStatus(req: Request, res: Response): Promise<void> {
    try {
      const letter = await this._letterService.updateLetterStatus(
        req.params.id,
        req.body.status
      );
      res.status(200).json(letter);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  async togglePackedStatus(req: Request, res: Response): Promise<void> {
    try {
      const letter = await this._letterService.togglePackedStatus(
        req.params.id,
        req.body.isPacked
      );
      res.status(200).json(letter);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }
}
