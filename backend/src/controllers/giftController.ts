import { Request, Response } from 'express';
import Gift from '../models/Gift';

export const getGifts = async (req: Request, res: Response) => {
    try {
        const gifts = await Gift.find();
        res.status(200).json(gifts);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching gifts', error });
    }
};

export const addGift = async (req: Request, res: Response) => {
    try {
        const { title, image, stock } = req.body;
        const newGift = new Gift({ title, image, stock });
        await newGift.save();
        res.status(201).json(newGift);
    } catch (error) {
        res.status(500).json({ message: 'Error adding gift', error });
    }
};
