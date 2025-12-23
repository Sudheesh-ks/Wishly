'use client';

import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { fetchGifts, createGift, Gift } from '../services/giftService';

interface GiftContextType {
    gifts: Gift[];
    addGift: (gift: Omit<Gift, '_id'>) => Promise<void>;
}

const GiftContext = createContext<GiftContextType | undefined>(undefined);

export function GiftProvider({ children }: { children: ReactNode }) {
    const [gifts, setGifts] = useState<Gift[]>([]);

    useEffect(() => {
        loadGifts();
    }, []);

    const loadGifts = async () => {
        try {
            const data = await fetchGifts();
            setGifts(data);
        } catch (error) {
            console.error("Failed to load gifts", error);
        }
    };

    const addGiftHandler = async (newGift: Omit<Gift, '_id'>) => {
        try {
            const savedGift = await createGift(newGift as Gift);
            setGifts((prev) => [...prev, savedGift]);
        } catch (error) {
            console.error("Failed to add gift", error);
        }
    };

    return (
        <GiftContext.Provider value={{ gifts, addGift: addGiftHandler }}>
            {children}
        </GiftContext.Provider>
    );
}

export function useGift() {
    const context = useContext(GiftContext);
    if (context === undefined) {
        throw new Error('useGift must be used within a GiftProvider');
    }
    return context;
}
