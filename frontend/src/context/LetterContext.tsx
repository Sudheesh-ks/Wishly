'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

import { Gift } from '../services/giftService';

interface LetterContextType {
    draftText: string;
    setDraftText: (text: string) => void;
    appendGift: (gift: Gift) => void;
    selectedGift: Gift | null;
    setSelectedGift: (gift: Gift | null) => void;
}

const LetterContext = createContext<LetterContextType | undefined>(undefined);

export function LetterProvider({ children }: { children: ReactNode }) {
    const [draftText, setDraftText] = useState('');
    const [selectedGift, setSelectedGift] = useState<Gift | null>(null);

    const appendGift = (gift: Gift) => {
        setSelectedGift(gift);
    };

    return (
        <LetterContext.Provider value={{ draftText, setDraftText, appendGift, selectedGift, setSelectedGift }}>
            {children}
        </LetterContext.Provider>
    );
}

export function useLetter() {
    const context = useContext(LetterContext);
    if (context === undefined) {
        throw new Error('useLetter must be used within a LetterProvider');
    }
    return context;
}
