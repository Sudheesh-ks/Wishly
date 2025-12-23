import { Request, Response } from 'express';
import Letter from '../models/Letter';

export const getLetters = async (req: Request, res: Response) => {
    try {
        const letters = await Letter.find();
        res.status(200).json(letters);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching letters', error });
    }
};

export const createLetter = async (req: Request, res: Response) => {
    try {
        const { childName, location, wishList, content } = req.body;
        const newLetter = new Letter({ childName, location, wishList, content });
        await newLetter.save();
        res.status(201).json(newLetter);
    } catch (error) {
        res.status(500).json({ message: 'Error creating letter', error });
    }
};

export const updateLetterStatus = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        const updatedLetter = await Letter.findByIdAndUpdate(id, { status }, { new: true });
        res.status(200).json(updatedLetter);
    } catch (error) {
        res.status(500).json({ message: 'Error updating letter status', error });
    }
}
