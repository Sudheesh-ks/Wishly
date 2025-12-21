'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

export interface Gift {
    id: number;
    title: string;
    image: string;
}

interface GiftContextType {
    gifts: Gift[];
    addGift: (gift: Omit<Gift, 'id'>) => void;
}

const INITIAL_GIFTS: Gift[] = [
    { id: 1, title: 'Toy Train', image: 'https://images.unsplash.com/photo-1542652184-04147ec06ec3?auto=format&fit=crop&w=400&q=80' },
    { id: 2, title: 'Teddy Bear', image: 'https://images.unsplash.com/photo-1556012018-50c5c0da73bf?auto=format&fit=crop&w=400&q=80' },
    { id: 3, title: 'Code Blocks', image: 'https://images.unsplash.com/photo-1628254747642-18b1c1b92313?auto=format&fit=crop&w=400&q=80' },
    { id: 4, title: 'Rocket Ship', image: 'https://images.unsplash.com/photo-1517420704952-d9f39e95ce43?auto=format&fit=crop&w=400&q=80' },
];

const GiftContext = createContext<GiftContextType | undefined>(undefined);

export function GiftProvider({ children }: { children: ReactNode }) {
    const [gifts, setGifts] = useState<Gift[]>(INITIAL_GIFTS);

    const addGift = (newGift: Omit<Gift, 'id'>) => {
        const giftWithId = { ...newGift, id: Date.now() };
        setGifts((prev) => [giftWithId, ...prev]);
    };

    return (
        <GiftContext.Provider value={{ gifts, addGift }}>
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
