'use client';

import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { fetchGifts, createGift, updateGift, Gift } from '../services/giftService';

interface GiftContextType {
    gifts: Gift[];
    addGift: (gift: Omit<Gift, '_id'>) => Promise<void>;
    updateGiftStock: (id: string, stock: number) => Promise<void>;
    updateGift: (id: string, updates: Partial<Gift>) => Promise<void>;
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

    const updateGiftStockHandler = async (id: string, stock: number) => {
        try {
            const updated = await updateGift(id, { stock });
            setGifts((prev) => prev.map(g => g._id === id ? updated : g));
        } catch (error) {
            console.error("Failed to update gift stock", error);
        }
    };

    const updateGiftHandler = async (id: string, updates: Partial<Gift>) => {
        try {
            const updated = await updateGift(id, updates);
            setGifts((prev) => prev.map(g => g._id === id ? updated : g));
        } catch (error) {
            console.error("Failed to update gift", error);
        }
    };

    return (
        <GiftContext.Provider value={{ gifts, addGift: addGiftHandler, updateGiftStock: updateGiftStockHandler, updateGift: updateGiftHandler }}>
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
