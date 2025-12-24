import { Request, Response } from 'express';
import Letter from '../models/Letter';
import Gift from '../models/Gift';
import mongoose from 'mongoose';
import { analyzeLetterContent } from '../services/aiService';

export const getLetters = async (req: Request, res: Response) => {
    try {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const search = (req.query.search as string) || '';
        const sortBy = (req.query.sortBy as string) || 'createdAt';
        const sortOrder = (req.query.sortOrder as string) === 'asc' ? 1 : -1;
        const status = (req.query.status as string) || '';

        const skip = (page - 1) * limit;

        const pipeline: any[] = [
            {
                $addFields: {
                    giftId: {
                        $cond: {
                            if: { $and: [{ $ne: ['$giftId', null] }, { $ne: ['$giftId', ''] }] },
                            then: { $toObjectId: '$giftId' },
                            else: null
                        }
                    }
                }
            },
            {
                $lookup: {
                    from: 'gifts',
                    localField: 'giftId',
                    foreignField: '_id',
                    as: 'gift'
                }
            },
            {
                $unwind: {
                    path: '$gift',
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $match: status ? {
                    childName: { $regex: search, $options: 'i' },
                    status: status
                } : {
                    childName: { $regex: search, $options: 'i' }
                }
            }
        ];

        // For popularity sorting, we need to count letters per gift
        if (sortBy === 'popularity') {
            pipeline.push(
                {
                    $lookup: {
                        from: 'letters',
                        let: { gid: '$giftId' },
                        pipeline: [
                            { $match: { $expr: { $eq: ['$giftId', '$$gid'] } } },
                            { $count: 'count' }
                        ],
                        as: 'popularityInfo'
                    }
                },
                {
                    $addFields: {
                        popularity: { $ifNull: [{ $arrayElemAt: ['$popularityInfo.count', 0] }, 0] }
                    }
                }
            );
            pipeline.push({ $sort: { popularity: sortOrder, createdAt: -1 } });
        } else {
            pipeline.push({ $sort: { [sortBy]: sortOrder } });
        }

        const countPipeline = [...pipeline];
        const lettersPipeline = [...pipeline, { $skip: skip }, { $limit: limit }];

        const [letters, totalCountResult] = await Promise.all([
            Letter.aggregate(lettersPipeline),
            Letter.aggregate([...countPipeline, { $count: 'total' }])
        ]);

        const total = totalCountResult.length > 0 ? totalCountResult[0].total : 0;

        res.status(200).json({
            letters,
            pagination: {
                total,
                page,
                limit,
                pages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        console.error('Error fetching letters:', error);
        res.status(500).json({ message: 'Error fetching letters', error });
    }
};

export const createLetter = async (req: Request, res: Response) => {
    try {
        const { childName, location, wishList, content, giftId } = req.body;

        // Stock handling
        if (giftId && mongoose.isValidObjectId(giftId)) {
            const gift = await Gift.findById(giftId);
            if (!gift) return res.status(404).json({ message: 'Gift not found' });
            if (gift.stock <= 0) return res.status(400).json({ message: 'Gift is out of stock' });

            // Decrement stock
            gift.stock -= 1;
            await gift.save();
        }

        // AI Analysis
        const status = await analyzeLetterContent(content || wishList.join(", "));

        const newLetter = new Letter({
            childName,
            location,
            wishList,
            content,
            status,
            giftId: (giftId && mongoose.isValidObjectId(giftId)) ? new mongoose.Types.ObjectId(giftId) : undefined
        });
        await newLetter.save();
        res.status(201).json(newLetter);
    } catch (error) {
        console.error('Error creating letter:', error);
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
};

export const togglePackedStatus = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { isPacked } = req.body;
        const updatedLetter = await Letter.findByIdAndUpdate(id, { isPacked }, { new: true });
        res.status(200).json(updatedLetter);
    } catch (error) {
        res.status(500).json({ message: 'Error updating packed status', error });
    }
};
