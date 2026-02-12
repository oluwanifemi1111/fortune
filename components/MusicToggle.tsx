
import React from 'react';
import { Volume2, VolumeX } from 'lucide-react';

interface MusicToggleProps {
  isMuted: boolean;
  onToggle: () => void;
}

export const MusicToggle: React.FC<MusicToggleProps> = ({ isMuted, onToggle }) => {
  return (
    <button
      onClick={onToggle}
      className="fixed top-6 right-6 z-50 p-3 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 transition-all duration-300"
      aria-label={isMuted ? "Unmute music" : "Mute music"}
    >
      {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
    </button>
  );
};
