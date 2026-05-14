import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, Zap, Flame, Crown, Filter, ChevronRight } from 'lucide-react';
import { cn } from '../lib/utils';

const nfts = [
  { id: 1, name: "Neon Sludge #001", rarity: "Legendary", price: "2.5 SOL", image: "https://images.unsplash.com/photo-1634986666676-ec8fd927c23d?auto=format&fit=crop&q=80&w=400" },
  { id: 2, name: "Toxic Fang #042", rarity: "Epic", price: "1.2 SOL", image: "https://images.unsplash.com/photo-1635322966219-b75ed372eb01?auto=format&fit=crop&q=80&w=400" },
  { id: 3, name: "Glow Gator #113", rarity: "Rare", price: "0.8 SOL", image: "https://images.unsplash.com/photo-1635323069151-57434190c1f4?auto=format&fit=crop&q=80&w=400" },
  { id: 4, name: "Swamp King #999", rarity: "Mythic", price: "10.0 SOL", image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=400" },
  { id: 5, name: "Mud Runner #012", rarity: "Common", price: "0.3 SOL", image: "https://images.unsplash.com/photo-1635323069357-1943c2c1248a?auto=format&fit=crop&q=80&w=400" },
  { id: 6, name: "Acid Belly #088", rarity: "Epic", price: "1.5 SOL", image: "https://images.unsplash.com/photo-1635323069503-4613cbe76fba?auto=format&fit=crop&q=80&w=400" },
];

export const NFTs: React.FC = () => {
  const [filter, setFilter] = useState('All');

  const categories = ['All', 'Mythic', 'Legendary', 'Epic', 'Rare', 'Common'];

  return (
    <div className="min-h-screen pt-32 pb-20 px-4">
      <div className="container mx-auto">
        <header className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-16">
          <div className="flex flex-col gap-4">
             <div className="flex items-center gap-2 text-primary font-mono text-sm uppercase tracking-[0.3em] font-bold">
               <Crown size={18} />
               The Sludge Series
             </div>
             <h1 className="text-6xl md:text-8xl font-display font-black tracking-tighter uppercase leading-[0.85]">SUPREME<br />COLLECTION</h1>
             <p className="max-w-xl text-on-background/60 font-medium leading-relaxed">
               1,111 unique crocodiles genetically modified with neon sludge. Owning a croc gives you exclusive access to the Swamp DAO and hidden staking multipliers.
             </p>
          </div>
          <div className="bg-surface-container border border-outline-variant/30 p-8 md:p-10 flex flex-col gap-4 glow-purple relative overflow-hidden">
             <div className="absolute top-0 right-0 p-4 opacity-10">
               <Shield size={120} className="text-primary" />
             </div>
             <div className="relative z-10">
                <span className="text-[10px] font-mono text-primary uppercase font-bold tracking-[0.2em]">Mint Status</span>
                <div className="flex items-end gap-2 my-2">
                   <h3 className="text-5xl font-display font-black leading-none italic">842</h3>
                   <span className="text-2xl font-display font-black opacity-30 italic">/ 1,111</span>
                </div>
                <div className="h-4 bg-background border border-outline-variant/30 p-1 mb-8 overflow-hidden rounded-full">
                   <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: '75%' }}
                    className="h-full bg-primary rounded-full shadow-[0_0_15px_rgba(221,183,255,0.6)]" 
                   />
                </div>
                <button className="w-full bg-secondary text-on-secondary py-5 font-display font-black text-2xl uppercase italic glow-green hover:scale-105 transition-transform">
                   MINT NOW
                </button>
                <p className="text-center mt-4 font-mono text-xs opacity-50 uppercase tracking-widest font-bold">Price: 2.50 SOL</p>
             </div>
          </div>
        </header>

        {/* Filter Bar */}
        <div className="flex flex-wrap items-center gap-4 mb-12">
           <div className="flex items-center gap-2 text-on-background/60 font-mono text-xs uppercase font-bold tracking-widest mr-4">
              <Filter size={14} /> Filter:
           </div>
           {categories.map((cat) => (
             <button
               key={cat}
               onClick={() => setFilter(cat)}
               className={cn(
                 "px-6 py-2 font-display font-bold text-xs uppercase tracking-widest transition-all border",
                 filter === cat 
                   ? "bg-primary text-on-primary border-primary" 
                   : "bg-surface-container border-outline-variant/30 hover:border-primary/50"
               )}
             >
               {cat}
             </button>
           ))}
        </div>

        {/* NFT Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
           {nfts.filter(n => filter === 'All' || n.rarity === filter).map((nft) => (
             <motion.div
               key={nft.id}
               initial={{ opacity: 0, y: 20 }}
               whileInView={{ opacity: 1, y: 0 }}
               viewport={{ once: true }}
               whileHover={{ y: -10 }}
               className="bg-surface-container border border-outline-variant/30 group overflow-hidden"
             >
                <div className="aspect-square relative overflow-hidden">
                   <img src={nft.image} alt={nft.name} className="w-full h-full object-cover grayscale-[50%] group-hover:grayscale-0 transition-all duration-700 group-hover:scale-110" />
                   <div className="absolute top-4 left-4">
                      <span className={cn(
                        "px-3 py-1 text-[10px] font-display font-black uppercase tracking-widest shadow-xl border",
                        nft.rarity === 'Legendary' ? "bg-primary text-on-primary border-primary" : 
                        nft.rarity === 'Epic' ? "bg-secondary text-on-secondary border-secondary" :
                        nft.rarity === 'Mythic' ? "bg-background text-primary border-primary" :
                        "bg-surface-container text-on-background border-outline-variant"
                      )}>
                        {nft.rarity}
                      </span>
                   </div>
                   <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6">
                      <button className="w-full bg-primary text-on-primary py-3 font-display font-black text-sm uppercase flex items-center justify-center gap-2">
                        Buy NFT <ChevronRight size={16} />
                      </button>
                   </div>
                </div>
                <div className="p-6 border-t border-outline-variant/30">
                   <div className="flex items-center justify-between mb-2">
                      <h4 className="text-xl font-display font-black tracking-tight text-on-background">{nft.name}</h4>
                      <div className="text-secondary font-mono text-sm font-bold">{nft.price}</div>
                   </div>
                   <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1 text-[10px] font-mono text-on-background/40 uppercase font-bold">
                        <Zap size={10} className="text-primary fill-primary" /> Multiplier: x2.5
                      </div>
                      <div className="flex items-center gap-1 text-[10px] font-mono text-on-background/40 uppercase font-bold">
                        <Flame size={10} className="text-secondary fill-secondary" /> Staking: Yes
                      </div>
                   </div>
                </div>
             </motion.div>
           ))}
        </div>
      </div>
    </div>
  );
};
