import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { AppState } from './types';
import { INTRO_LINES, LETTER_CONTENT, AMBIENT_MUSIC_URL } from './constants';
import { MusicToggle } from './components/MusicToggle';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>(AppState.LOCKED);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Background particle positions (memoized to prevent re-renders)
  const particles = useMemo(() => 
    Array.from({ length: 30 }).map(() => ({
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
      size: Math.random() * 3 + 1,
      duration: Math.random() * 10 + 10,
    })), []);

  useEffect(() => {
    audioRef.current = new Audio(AMBIENT_MUSIC_URL);
    audioRef.current.loop = true;
    audioRef.current.volume = 0.4;
    
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.muted = isMuted;
    }
  }, [isMuted]);

  const handleReveal = () => {
    setAppState(AppState.INTRO);
    if (audioRef.current) {
      audioRef.current.play().catch(e => console.warn("Audio play blocked or failed", e));
    }
  };

  const onIntroComplete = useCallback(() => {
    setAppState(AppState.LETTER);
  }, []);

  const handleGiftClick = () => {
    setAppState(AppState.GIFT);
    const end = Date.now() + 4 * 1000;
    const colors = ['#d4af37', '#ffffff', '#ffd700', '#fdfcf0'];

    (function frame() {
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0, y: 0.6 },
        colors: colors
      });
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 0.6 },
        colors: colors
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    }());
  };

  return (
    <div className={`min-h-screen font-sans text-white transition-colors duration-[3000ms] ease-in-out relative overflow-hidden ${
      appState === AppState.GIFT ? 'bg-[#1a140a]' : 'bg-[#0a0a0a]'
    }`}>
      {/* Cinematic Background Particles */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        {particles.map((p, i) => (
          <motion.div
            key={i}
            className="absolute bg-white rounded-full opacity-20"
            style={{ top: p.top, left: p.left, width: `${p.size}px`, height: `${p.size}px` }}
            animate={{
              y: [0, -40, 0],
              opacity: [0.1, 0.4, 0.1],
            }}
            transition={{
              duration: p.duration,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      <MusicToggle isMuted={isMuted} onToggle={() => setIsMuted(!isMuted)} />

      <AnimatePresence mode="wait">
        {appState === AppState.LOCKED && (
          <motion.div
            key="locked"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.1, filter: 'blur(10px)' }}
            transition={{ duration: 1.5 }}
            className="relative z-10 h-screen flex flex-col items-center justify-center gap-12 px-4 text-center"
          >
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 2 }}
              className="space-y-2"
            >
              <h1 className="text-xl md:text-2xl font-serif tracking-[0.4em] text-white/40 uppercase">
                Tap to Reveal
              </h1>
              <div className="w-24 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent mx-auto mt-4" />
            </motion.div>

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleReveal}
              className="relative w-28 h-28 rounded-full flex items-center justify-center group outline-none"
            >
              <motion.div 
                animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                className="absolute inset-0 rounded-full bg-white/5 blur-xl group-hover:bg-white/10"
              />
              <motion.div 
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute inset-2 rounded-full border border-white/20 group-hover:border-white/40"
              />
              <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-white/10 to-white/30 backdrop-blur-sm border border-white/40 shadow-[0_0_30px_rgba(255,255,255,0.2)] flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-white/80 shadow-[0_0_10px_white]" />
              </div>
            </motion.button>
          </motion.div>
        )}

        {appState === AppState.INTRO && (
          <IntroSequence onComplete={onIntroComplete} />
        )}

        {(appState === AppState.LETTER || appState === AppState.GIFT) && (
          <motion.div
            key="main-content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="relative z-10 max-w-3xl mx-auto px-8 py-24 md:py-32 flex flex-col items-center"
          >
            {LETTER_CONTENT.map((paragraph, index) => (
              <LetterParagraphView 
                key={index} 
                content={paragraph} 
              />
            ))}

            <div className="mt-24 mb-32 flex flex-col items-center gap-12 w-full">
              {appState === AppState.LETTER ? (
                <motion.button
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  whileHover={{ scale: 1.05, boxShadow: '0 0 40px rgba(255,255,255,0.1)' }}
                  onClick={handleGiftClick}
                  className="px-12 py-5 rounded-full border border-white/20 bg-white/5 text-lg font-serif tracking-[0.2em] hover:bg-white/10 hover:border-white/40 transition-all duration-700 backdrop-blur-md"
                >
                  OPEN YOUR GIFT
                </motion.button>
              ) : (
                <GiftMessage />
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const IntroSequence: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showMainTitle, setShowMainTitle] = useState(false);

  useEffect(() => {
    if (currentIndex < INTRO_LINES.length) {
      const timer = setTimeout(() => {
        setCurrentIndex(prev => prev + 1);
      }, 2800);
      return () => clearTimeout(timer);
    } else {
      const timer = setTimeout(() => {
        setShowMainTitle(true);
      }, 1200);
      return () => clearTimeout(timer);
    }
  }, [currentIndex]);

  useEffect(() => {
    if (showMainTitle) {
      const timer = setTimeout(() => {
        onComplete();
      }, 4500);
      return () => clearTimeout(timer);
    }
  }, [showMainTitle, onComplete]);

  return (
    <motion.div className="relative z-10 h-screen flex flex-col items-center justify-center p-8 overflow-hidden">
      <AnimatePresence mode="wait">
        {!showMainTitle ? (
          <motion.div key="intro-text" className="space-y-6 text-center">
            {INTRO_LINES.slice(0, currentIndex + 1).map((line, idx) => (
              <motion.p
                key={idx}
                initial={{ opacity: 0, y: 20, filter: 'blur(5px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                className="text-xl md:text-2xl font-light text-white/70 tracking-wide font-serif italic"
                transition={{ duration: 2, ease: "easeOut" }}
              >
                {line}
              </motion.p>
            ))}
          </motion.div>
        ) : (
          <motion.div
            key="main-greeting"
            initial={{ opacity: 0, scale: 0.95, filter: 'blur(10px)' }}
            animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
            transition={{ duration: 2.5 }}
            className="text-center"
          >
            <h2 className="text-6xl md:text-8xl font-serif text-white mb-6 drop-shadow-[0_0_20px_rgba(255,255,255,0.4)]">
              Hey Klara ✨
            </h2>
            <motion.p 
              animate={{ opacity: [0.3, 0.6, 0.3] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-white/30 tracking-[0.5em] font-light text-sm"
            >
              SCROLL TO READ
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const LetterParagraphView: React.FC<{ content: { text: string; isHighlight?: boolean } }> = ({ content }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10% 0px -10% 0px" }}
      transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
      className={`mb-16 text-center w-full px-4 ${content.isHighlight ? 'my-24' : ''}`}
    >
      <p className={`
        ${content.isHighlight 
          ? 'text-4xl md:text-6xl font-serif text-white tracking-tight italic leading-tight drop-shadow-[0_0_10px_rgba(255,255,255,0.2)]' 
          : 'text-lg md:text-2xl font-sans text-white/60 leading-relaxed font-light'
        }
      `}>
        {content.text}
      </p>
    </motion.div>
  );
};

const GiftMessage: React.FC = () => {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 3 }}
      className="text-center space-y-32 w-full pt-12"
    >
      <div className="space-y-12">
        <motion.p 
          initial={{ y: 20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 2 }}
          className="text-2xl md:text-3xl font-serif italic text-white/80 leading-relaxed max-w-2xl mx-auto"
        >
          “I’ll keep praying for you.<br/>
          Quietly. Consistently.<br/>
          Until everything you deserve starts choosing you.”
        </motion.p>
        <motion.p 
          initial={{ scale: 0.8, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 1, duration: 1.5 }}
          className="text-4xl md:text-5xl font-serif text-[#d4af37] drop-shadow-[0_0_15px_rgba(212,175,55,0.4)]"
        >
          Until you win.
        </motion.p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 2, duration: 2.5 }}
        className="pt-24 border-t border-white/5"
      >
        <h3 className="text-5xl md:text-7xl font-serif text-white tracking-widest mb-4">
          Happy Birthday, Klara 🌟
        </h3>
        <p className="text-white/30 tracking-[0.8em] text-xs font-light uppercase">You are and always will be enough</p>
      </motion.div>
    </motion.div>
  );
};

export default App;