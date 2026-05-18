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
  spinCount: number;
}

const Reel: React.FC<ReelProps> = ({ prevIndex, finalIndex, isSpinning, delay, spinCount }) => {
  const itemHeight = 216;
  const duration = 5 + delay;
  
  // Create the reel strip: [Old Image, ...Random, New Image]
  const reelItems = useMemo(() => {
    const items = [SYMBOLS[prevIndex]];
    // Stable random seed for the intermediates during a single spin
    for (let i = 0; i < 40; i++) {
      items.push(SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)]);
    }
    items.push(SYMBOLS[finalIndex]);
    return items;
  }, [prevIndex, finalIndex, spinCount]);

  return (
    <div className="w-36 h-[216px] bg-surface-container-high border-2 border-outline-variant/30 relative overflow-hidden flex flex-col shadow-inner">
      <motion.div
        key={spinCount}
        className="flex flex-col"
        initial={{ y: 0 }}
        animate={{ y: -(reelItems.length - 1) * itemHeight }}
        transition={spinCount > 0 ? {
          duration: duration,
          ease: [0.45, 0.05, 0.55, 0.95],
          delay: delay * 0.4
        } : { duration: 0 }}
      >
        {reelItems.map((symbol, idx) => (
          <div key={idx} className="w-36 h-[216px] flex-shrink-0 flex items-center justify-center p-3">
            <img 
              src={symbol.image} 
              alt="slot" 
              className={cn(
                "w-full h-full object-cover rounded shadow-md",
                isSpinning && idx > 0 && idx < reelItems.length - 1 && "blur-[4px]"
              )} 
            />
          </div>
        ))}
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
  const [spinCount, setSpinCount] = useState(0);
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
    
    setSpinCount(prev => prev + 1);
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
    <div className="bg-surface-container border-4 border-outline-variant/30 p-12 shadow-[0_0_80px_rgba(148,222,45,0.15)] relative overflow-hidden flex flex-col items-center gap-10">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-secondary to-transparent opacity-50" />
      
      <div className="flex gap-6 p-9 bg-background/80 border-8 border-outline-variant/20 rounded-2xl shadow-inner relative z-10">
        {reels.map((symbolIdx, i) => (
          <Reel 
            key={i} 
            prevIndex={prevReels[i]}
            finalIndex={symbolIdx} 
            isSpinning={isSpinning} 
            delay={i * 0.4} 
            spinCount={spinCount}
          />
        ))}
      </div>

      <div className="w-full max-w-xl relative z-10">
        <button
          onClick={spin}
          disabled={isSpinning || balance < 10}
          className={cn(
            "w-full py-7 font-display font-black text-4xl uppercase italic tracking-tighter transition-all flex items-center justify-center gap-4",
            isSpinning || balance < 10
              ? "bg-outline-variant/20 text-on-background/20 cursor-not-allowed"
              : "bg-secondary text-on-secondary glow-green hover:scale-[1.02] active:scale-[0.98]"
          )}
        >
          {isSpinning ? (
            <RefreshCw className="animate-spin" size={42} />
          ) : (
            <>
              <Sparkles size={36} />
              SPIN
              <Sparkles size={36} />
            </>
          )}
        </button>
      </div>
    </div>
  );
};

