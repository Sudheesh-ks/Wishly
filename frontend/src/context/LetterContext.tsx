'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

interface LetterContextType {
    draftText: string;
    setDraftText: (text: string) => void;
    appendGift: (giftName: string) => void;
}

const LetterContext = createContext<LetterContextType | undefined>(undefined);

export function LetterProvider({ children }: { children: ReactNode }) {
    const [draftText, setDraftText] = useState('');

    const appendGift = (giftName: string) => {
        setDraftText((prev) => prev + (prev ? ', ' : '') + giftName);
    };

    return (
        <LetterContext.Provider value={{ draftText, setDraftText, appendGift }}>
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
