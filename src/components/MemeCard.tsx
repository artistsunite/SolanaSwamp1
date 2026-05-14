import React from 'react';
import { motion } from 'framer-motion';
import { Heart, MessageCircle, Share2, Zap } from 'lucide-react';
import { Meme } from '../types';

interface MemeCardProps {
  meme: Meme;
}

export const MemeCard: React.FC<MemeCardProps> = ({ meme }) => {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="bg-surface-container border border-outline-variant/30 overflow-hidden group"
    >
      <div className="aspect-square relative overflow-hidden">
        <img 
          src={meme.imageUrl} 
          alt="Swamp Meme" 
          className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
          <div className="flex items-center gap-4 text-on-background/80">
            <button className="hover:text-secondary flex items-center gap-1">
              <Heart size={18} />
              <span className="text-xs font-mono">69</span>
            </button>
            <button className="hover:text-primary flex items-center gap-1">
              <Zap size={18} />
              <span className="text-xs font-mono">Tip</span>
            </button>
          </div>
        </div>
      </div>
      <div className="p-4 flex items-center justify-between border-t border-outline-variant/30">
        <div>
          <p className="text-xs font-mono opacity-50 uppercase tracking-tighter">Uploaded by</p>
          <p className="font-display font-bold text-secondary tracking-tight">@{meme.author}</p>
        </div>
        <div className="bg-primary/10 border border-primary/20 px-2 py-1 flex items-center gap-1">
          <Zap size={14} className="text-primary fill-primary" />
          <span className="text-xs font-mono text-primary font-bold">{meme.tips} SOL</span>
        </div>
      </div>
    </motion.div>
  );
};
