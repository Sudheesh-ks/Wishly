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
        const newGift = new Gift({ title, image, stock: stock || 0 });
        await newGift.save();
        res.status(201).json(newGift);
    } catch (error) {
        res.status(500).json({ message: 'Error adding gift', error });
    }
};

export const updateGift = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { title, image, stock } = req.body;
        const updatedGift = await Gift.findByIdAndUpdate(
            id,
            { title, image, stock },
            { new: true }
        );
        if (!updatedGift) return res.status(404).json({ message: 'Gift not found' });
        res.status(200).json(updatedGift);
    } catch (error) {
        res.status(500).json({ message: 'Error updating gift', error });
    }
};
