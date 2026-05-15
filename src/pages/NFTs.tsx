import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, Zap, Flame, Crown, Filter, ChevronRight } from 'lucide-react';
import { cn } from '../lib/utils';

const nftImages = [
  "photo_3.jpg",
  "photo_4.jpg",
  "photo_6.jpg",
  "photo_8.jpg",
  "photo_9.jpg",
  "photo_11.jpg",
  "photo_12.jpg",
  "photo_14.jpg",
  "photo_15.jpg",
  "photo_16.jpg",
  "photo_17.jpg",
  "photo_18.jpg",
  "photo_19.jpg"
];

const rarities = ["Common", "Rare", "Epic", "Legendary", "Mythic"];

const nfts = nftImages.map((img, index) => ({
  id: index + 1,
  name: `Purple Croc #${(index + 1).toString().padStart(3, '0')}`,
  rarity: rarities[Math.floor(Math.random() * rarities.length)],
  price: `${(Math.random() * 2 + 0.5).toFixed(1)} SOL`,
  image: `/images/gallery/${img}`
}));

export const NFTs: React.FC = () => {
  return (
    <div className="min-h-screen pt-32 pb-20 px-4">
      <div className="container mx-auto">
        <header className="mb-12">
          <div className="flex flex-col gap-4">
             <div className="flex items-center gap-2 text-primary font-mono text-sm uppercase tracking-[0.3em] font-bold">
               <Crown size={18} />
               The Purple Croc
             </div>
             <h1 className="text-6xl md:text-8xl font-display font-black tracking-tighter uppercase leading-[0.85]">SUPREME<br />COLLECTION</h1>
             <p className="max-w-xl text-on-background/60 font-medium leading-relaxed">
               1,111 unique crocodiles genetically modified with neon sludge. Owning a croc gives you exclusive access to the Swamp DAO and hidden staking multipliers.
             </p>
          </div>
        </header>


        {/* NFT Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-8">
           {nfts.map((nft) => (
             <motion.div
               key={nft.id}
               initial={{ opacity: 0, scale: 0.95 }}
               whileInView={{ opacity: 1, scale: 1 }}
               viewport={{ once: true }}
               whileHover={{ scale: 1.05 }}
               className="bg-surface-container border border-outline-variant/30 group overflow-hidden aspect-square rounded-lg shadow-lg"
             >
                <img 
                  src={nft.image} 
                  alt={nft.name} 
                  className="w-full h-full object-cover" 
                />
             </motion.div>
           ))}
        </div>
      </div>
    </div>
  );
};
