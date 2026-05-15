import React, { useState, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { Sparkles, RotateCcw, Zap, RefreshCw } from 'lucide-react';
import { cn } from '../lib/utils';

const SYMBOLS = [
  { image: '/images/gallery/photo_3.jpg', value: 200, label: 'PRIME CROC' },
  { image: '/images/gallery/photo_4.jpg', value: 150, label: 'GOLD SLUDGE' },
  { image: '/images/gallery/photo_6.jpg', value: 100, label: 'MUD KING' },
  { image: '/images/gallery/photo_8.jpg', value: 80, label: 'GATOR ELITE' },
  { image: '/images/gallery/photo_9.jpg', value: 60, label: 'NEON CROC' },
  { image: '/images/gallery/photo_11.jpg', value: 50, label: 'SWAMP GUARD' },
  // Common Tier
  { image: '/images/gallery/photo_12.jpg', value: 20, label: 'LILY PAD' },
  { image: '/images/gallery/photo_14.jpg', value: 15, label: 'MOSS' },
  { image: '/images/gallery/photo_15.jpg', value: 10, label: 'REED' },
  { image: '/images/gallery/photo_16.jpg', value: 8, label: 'ROCK' },
  { image: '/images/gallery/photo_17.jpg', value: 5, label: 'PLANKTON' },
  { image: '/images/gallery/photo_18.jpg', value: 4, label: 'MUD' },
  { image: '/images/gallery/photo_19.jpg', value: 2, label: 'BUBBLES' },
];

const REEL_COUNT = 3;

interface ReelProps {
  prevIndex: number;
  finalIndex: number;
  isSpinning: boolean;
  delay: number;
}

const Reel: React.FC<ReelProps> = ({ prevIndex, finalIndex, isSpinning, delay }) => {
  const duration = 5 + delay;
  const itemHeight = 144;
  const speed = 1200; // pixels per second
  
  // Calculate items needed to maintain speed over duration
  const itemCount = useMemo(() => {
    return Math.floor((speed * duration) / itemHeight);
  }, [duration]);

  // Generate random intermediate symbols but keep the start and end stable
  const reelItems = useMemo(() => {
    const items = [SYMBOLS[prevIndex]]; // Start with previous result
    for (let i = 0; i < itemCount - 2; i++) {
        items.push(SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)]);
    }
    items.push(SYMBOLS[finalIndex]); // End with new result
    return items;
  }, [finalIndex, isSpinning && finalIndex !== prevIndex, itemCount, prevIndex]);

  return (
    <div className="w-24 h-36 bg-surface-container-high border-2 border-outline-variant/30 relative overflow-hidden flex flex-col shadow-inner">
      <motion.div
        className="flex flex-col"
        initial={{ y: 0 }}
        animate={isSpinning ? { y: -(reelItems.length - 1) * itemHeight } : { y: 0 }}
        transition={{
          duration: duration,
          ease: [0.45, 0.05, 0.55, 0.95],
          delay: delay * 0.4
        }}
      >
        {isSpinning ? (
          reelItems.map((symbol, idx) => (
            <div key={idx} className="w-24 h-36 flex-shrink-0 flex items-center justify-center p-2">
              <img 
                src={symbol.image} 
                alt="slot" 
                className={cn(
                  "w-full h-full object-cover rounded-sm shadow-md",
                  idx > 0 && idx < reelItems.length - 1 && "blur-[3px]" 
                )} 
              />
            </div>
          ))
        ) : (
          <div className="w-24 h-36 flex-shrink-0 flex items-center justify-center p-2">
            <motion.img 
              initial={false}
              src={SYMBOLS[finalIndex].image} 
              alt="slot" 
              className="w-full h-full object-cover rounded-sm shadow-md" 
            />
          </div>
        )}
      </motion.div>
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/60 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-r from-white/5 via-transparent to-black/10 pointer-events-none" />
    </div>
  );
};

export const SlotMachine: React.FC = () => {
  const [reels, setReels] = useState<number[]>([0, 1, 2]);
  const [prevReels, setPrevReels] = useState<number[]>([0, 1, 2]);
  const [isSpinning, setIsSpinning] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [balance, setBalance] = useState(1000);
  const [lastWin, setLastWin] = useState(0);

  const getRandomSymbolIndex = useCallback(() => {
    // Uniform probability distribution
    return Math.floor(Math.random() * SYMBOLS.length);
  }, []);

  const spin = async () => {
    if (isSpinning || balance < 10) return;

    setPrevReels([...reels]);
    const newReels = [getRandomSymbolIndex(), getRandomSymbolIndex(), getRandomSymbolIndex()];
    setReels(newReels); // Set target reels immediately
    
    setIsSpinning(true);
    setResult(null);
    setBalance(prev => prev - 10);
    setLastWin(0);

    // Total animation timeout matching the longest reel duration
    setTimeout(() => {
      setIsSpinning(false);
      checkWin(newReels);
    }, 6500); 
  };

  const checkWin = (reelsRes: number[]) => {
    const [a, b, c] = reelsRes;
    
    // Win only if all 3 match
    if (a === b && b === c) {
      const winAmount = SYMBOLS[a].value * 50;
      handleWin(winAmount, `MEGA JACKPOT! 3x ${SYMBOLS[a].label}`);
    } else {
      setResult('TRY AGAIN');
    }
  };

  const handleWin = (amount: number, message: string) => {
    setBalance(prev => prev + amount);
    setLastWin(amount);
    setResult(message);
    
    confetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#94de2d', '#ddb7ff', '#ffffff']
    });
  };

  return (
    <div className="bg-surface-container border-4 border-outline-variant/30 p-8 shadow-[0_0_50px_rgba(148,222,45,0.1)] relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-secondary to-transparent opacity-50" />
      
      <div className="flex flex-col items-center gap-8 relative z-10">
        <div className="text-center">
          <h2 className="text-4xl font-display font-black italic tracking-tighter uppercase text-secondary flex items-center justify-center gap-3">
            <Zap className="fill-secondary" size={32} />
            SWAMP SLOTS
            <Zap className="fill-secondary" size={32} />
          </h2>
          <p className="font-mono text-[10px] text-on-background/40 uppercase tracking-[0.3em] mt-2 font-bold">
            Spin for Sludge & Glory
          </p>
        </div>

        <div className="flex gap-4 w-full max-w-sm">
          <div className="flex-1 bg-background/50 border border-outline-variant/30 px-6 py-3 flex flex-col items-center">
            <span className="text-[10px] font-mono text-on-background/40 uppercase font-bold">Balance</span>
            <span className="text-xl font-display font-black text-primary">${balance}</span>
          </div>
          <div className="flex-1 bg-background/50 border border-outline-variant/30 px-6 py-3 flex flex-col items-center">
            <span className="text-[10px] font-mono text-on-background/40 uppercase font-bold">Last Win</span>
            <span className={cn("text-xl font-display font-black transition-colors", lastWin > 0 ? "text-secondary" : "text-on-background/20")}>
              +${lastWin}
            </span>
          </div>
        </div>

        <div className="flex gap-4 p-6 bg-background/80 border-8 border-outline-variant/20 rounded-xl shadow-inner">
          {reels.map((symbolIdx, i) => (
            <Reel 
              key={i} 
              prevIndex={prevReels[i]}
              finalIndex={symbolIdx} 
              isSpinning={isSpinning} 
              delay={i * 0.4} 
            />
          ))}
        </div>

        <div className="h-8 flex items-center justify-center">
          <AnimatePresence mode="wait">
            {result && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className={cn(
                  "font-display font-black text-xl uppercase italic tracking-tighter",
                  lastWin > 0 ? "text-secondary" : "text-red-400"
                )}
              >
                {result}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="flex gap-4 w-full max-w-sm">
          <button
            onClick={() => {
              setBalance(1000);
              setLastWin(0);
              setResult(null);
            }}
            className="p-4 bg-surface-container border border-outline-variant/30 hover:bg-surface-container-high transition-colors"
          >
            <RotateCcw size={24} className="text-on-background/60" />
          </button>
          <button
            onClick={spin}
            disabled={isSpinning || balance < 10}
            className={cn(
              "flex-1 py-5 font-display font-black text-2xl uppercase italic tracking-tighter transition-all flex items-center justify-center gap-3",
              isSpinning || balance < 10
                ? "bg-outline-variant/20 text-on-background/20 cursor-not-allowed"
                : "bg-secondary text-on-secondary glow-green hover:scale-[1.02] active:scale-[0.98]"
            )}
          >
            {isSpinning ? (
              <RefreshCw className="animate-spin" size={28} />
            ) : (
              <>
                <Sparkles size={24} />
                SPIN (10)
                <Sparkles size={24} />
              </>
            )}
          </button>
        </div>

        <div className="grid grid-cols-5 gap-4 w-full mt-4">
          {SYMBOLS.map((s, i) => (
            <div key={i} className="flex flex-col items-center gap-1 opacity-40 hover:opacity-100 transition-opacity">
              <img src={s.image} alt={s.label} className="w-8 h-8 object-cover rounded" />
              <span className="font-mono text-[8px] font-bold text-secondary">x{s.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

