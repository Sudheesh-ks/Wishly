'use client';
import { useState, useEffect, createContext, useContext, useCallback } from 'react';
import useSound from 'use-sound';

// Note: Using placeholders for sounds. User should replace these URLs.
const SOUND_URLS = {
    backgroundLoop: 'https://assets.mixkit.co/music/preview/mixkit-christmas-magic-2895.mp3', // Example placeholder
    jingle: 'https://assets.mixkit.co/sfx/preview/mixkit-christmas-sleigh-bells-jingle-1447.mp3',
    poof: 'https://assets.mixkit.co/sfx/preview/mixkit-magic-wand-sparkle-3067.mp3'
};

interface SoundContextType {
    isPlaying: boolean;
    toggleMusic: () => void;
    playJingle: () => void;
    playPoof: () => void;
}

const SoundContext = createContext<SoundContextType>({
    isPlaying: false,
    toggleMusic: () => { },
    playJingle: () => { },
    playPoof: () => { },
});

export const useSoundManager = () => useContext(SoundContext);

export const SoundProvider = ({ children }: { children: React.ReactNode }) => {
    const [isPlaying, setIsPlaying] = useState(false);

    const [playBg, { stop: stopBg }] = useSound(SOUND_URLS.backgroundLoop, {
        loop: true,
        volume: 0.3,
        onload: () => console.log('Music loaded')
    });

    const [playJingle] = useSound(SOUND_URLS.jingle, { volume: 0.5 });
    const [playPoof] = useSound(SOUND_URLS.poof, { volume: 0.5 });

    const toggleMusic = useCallback(() => {
        if (isPlaying) {
            stopBg();
        } else {
            playBg();
        }
        setIsPlaying(!isPlaying);
    }, [isPlaying, playBg, stopBg]);

    // Optionally auto-play on interaction if needed, but browsers block auto-play.
    // We'll rely on user toggle.

    return (
        <SoundContext.Provider value={{ isPlaying, toggleMusic, playJingle, playPoof }}>
            {children}
        </SoundContext.Provider>
    );
};
