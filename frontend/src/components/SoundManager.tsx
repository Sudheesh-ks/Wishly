"use client";
import {
  useState,
  useEffect,
  createContext,
  useContext,
  useCallback,
} from "react";
import useSound from "use-sound";

const SOUND_URLS = {
  backgroundLoop: "/music/christmas-bg.mp3",
};

interface SoundContextType {
  isPlaying: boolean;
  toggleMusic: () => void;
}

const SoundContext = createContext<SoundContextType>({
  isPlaying: false,
  toggleMusic: () => {},
});

export const useSoundManager = () => useContext(SoundContext);

export const SoundProvider = ({ children }: { children: React.ReactNode }) => {
  const [isPlaying, setIsPlaying] = useState(false);

  const [playBg, { stop: stopBg, sound }] = useSound(
    SOUND_URLS.backgroundLoop,
    {
      loop: true,
      volume: 0.3,
      format: ["mp3"],
      onload: () => console.log("Music loaded successfully"),
      onloaderror: (id: any, err: any) =>
        console.error("Music load error:", err),
    }
  );

  const toggleMusic = useCallback(() => {
    if (isPlaying) {
      stopBg();
      console.log("Music stopped");
    } else {
      playBg();
      console.log("Music started");
    }
    setIsPlaying(!isPlaying);
  }, [isPlaying, playBg, stopBg]);

  return (
    <SoundContext.Provider value={{ isPlaying, toggleMusic }}>
      {children}
    </SoundContext.Provider>
  );
};
