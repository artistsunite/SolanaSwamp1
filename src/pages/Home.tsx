import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Flame, Layers, ShieldCheck, Zap, TrendingUp, Users, Globe } from 'lucide-react';
import { Link } from 'react-router-dom';
import { StatCard } from '../components/StatCard';
import { HeroGallery } from '../components/HeroGallery';
import { NavItem, TokenStats } from '../types';
import { getSetting } from '../services/settingsService';
import { statsService } from '../services/statsService';

export const Home: React.FC = () => {
  const [heroImages, setHeroImages] = useState<string[]>(['/images/hero_croc.png']);
  const [stats, setStats] = useState<TokenStats | null>(null);

  useEffect(() => {
    async function loadData() {
      const setting = await getSetting('hero_image');
      if (setting) {
        try {
          // Check if it's a JSON array
          if (setting.startsWith('[') && setting.endsWith(']')) {
            setHeroImages(JSON.parse(setting));
          } else {
            setHeroImages([setting]);
          }
        } catch {
          setHeroImages([setting]);
        }
      }
      
      const s = await statsService.getCombinedStats();
      if (s) setStats(s);
    }
    loadData();
  }, []);

  return (
    <div className="flex flex-col w-full">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center pt-20 overflow-hidden">
        <div className="swamp-texture absolute inset-0 z-0" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/20 rounded-full blur-[120px] z-0 animate-pulse" />
        
        <div className="container mx-auto px-4 relative z-10 flex flex-col md:flex-row items-center gap-12">
          <div className="flex-1 text-center md:text-left">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-6xl md:text-8xl lg:text-9xl font-display font-black tracking-tighter leading-[0.85] mb-6 neon-text-purple italic">
                STAY SNAPPY.
              </h1>
              <p className="text-xl md:text-2xl text-on-background/70 font-display font-bold max-w-xl mb-10 uppercase tracking-tight">
                The official movement of the swamp. A high-energy degen experience with NFTs, DAO, and real-time corruption stats.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                <a 
                  href="https://pump.fun/coin/56RCsF1zhwn7wJWd7dHDZu7yiCNGVyaMF8kTZYSBpump" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="bg-secondary text-on-secondary px-10 py-5 font-display font-black text-xl uppercase italic transform hover:scale-105 transition-transform flex items-center justify-center gap-2 glow-green"
                >
                  Buy $CROC
                  <ArrowRight size={24} />
                </a>
                <Link to={NavItem.NFTs} className="border-4 border-primary text-primary px-10 py-5 font-display font-black text-xl uppercase italic hover:bg-primary/10 transition-colors flex items-center justify-center glow-purple">
                  Browse NFTs
                </Link>
              </div>
            </motion.div>
          </div>
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.8, rotate: 10 }}
            animate={{ opacity: 1, scale: 1, rotate: -5 }}
            transition={{ duration: 1.2, delay: 0.2 }}
            className="flex-1 relative"
          >
            <HeroGallery images={heroImages} />
            
            {/* Floating Cards */}
            <motion.div 
              animate={{ y: [0, -20, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -top-10 -right-10 bg-surface-container border border-outline-variant p-4 hidden lg:block glow-purple z-20"
            >
              <div className="flex flex-col gap-1">
                <span className="text-[10px] font-mono opacity-50 uppercase">Corruption Level</span>
                <span className="text-2xl font-display font-black text-primary">Over 9000!</span>
              </div>
            </motion.div>
            
            <motion.div 
              animate={{ y: [0, 20, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -bottom-10 -left-10 bg-surface-container border border-outline-variant p-4 hidden lg:block glow-green z-20"
            >
              <div className="flex flex-col gap-1">
                <span className="text-[10px] font-mono opacity-50 uppercase">Current Holders</span>
                <span className="text-2xl font-display font-black text-secondary">
                  {stats ? stats.holders.toLocaleString() : "69,420"}
                </span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Stats Quick View */}
      <section className="bg-surface-container-low border-y border-outline-variant/30 py-20 relative overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard 
              label="Token Price" 
              value={stats ? `$${stats.price.toFixed(stats.price < 0.0001 ? 10 : 6)}` : "$0.000420"} 
              icon={TrendingUp} 
              trend="12.5" 
              isPositive={true} 
            />
            <StatCard 
              label="Market Cap" 
              value={stats ? stats.marketCap >= 1000000 ? `$${(stats.marketCap / 1000000).toFixed(2)}M` : `$${(stats.marketCap / 1000).toFixed(1)}K` : "$6.9M"} 
              icon={Globe} 
              trend="4.2" 
              isPositive={true} 
            />
            <StatCard 
              label="Holders" 
              value={stats ? stats.holders.toLocaleString() : "12.4K"} 
              icon={Users} 
              trend="2.1" 
              isPositive={true} 
            />
            <StatCard 
              label="Liquidity" 
              value={stats ? `$${(stats.liquidity / 1000).toFixed(1)}K` : "$1.2M"} 
              icon={ShieldCheck} 
              trend="0" 
              isPositive={true} 
            />
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 relative">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-4">
            <div className="flex flex-col gap-2">
              <span className="text-secondary font-mono text-sm uppercase tracking-[0.3em] font-bold">The Ecosystem</span>
              <h2 className="text-5xl md:text-7xl font-display font-black leading-tight tracking-tighter uppercase">WHY THE SWAMP?</h2>
            </div>
            <p className="max-w-md text-on-background/60 font-medium">
              We aren't just another meme. We're a self-sustaining ecosystem designed for maximum degen survival.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { icon: Flame, title: "Burn Engine", desc: "Every transaction fuels a permanent burn of $CROC tokens, driving scarcity through the roof." },
              { icon: Layers, title: "NFT Utility", desc: "Holders of Purple Croc NFTs earn passive rewards and exclusive voting power in the DAO." },
              { icon: ShieldCheck, title: "Locked LP", desc: "Liquidity is locked forever in the depths of the swamp. Rug-pulls are extinct here." },
              { icon: Zap, title: "Hyper DAO", desc: "Vote on marketing, new features, and swap partnerships using your governance tokens." },
              { icon: TrendingUp, title: "Staking Pools", desc: "Stake your tokens and NFTs to earn $CROCPACK rewards every single block." },
              { icon: ArrowRight, title: "Future X", desc: "Something bigger is lurking in the murky waters. Coming 2026." }
            ].map((feature, i) => (
              <motion.div 
                key={i}
                whileHover={{ y: -10 }}
                className="p-8 bg-surface-container border border-outline-variant/30 hover:border-primary/50 transition-colors"
              >
                <div className="w-14 h-14 bg-primary/10 flex items-center justify-center text-primary mb-6 border border-primary/20">
                  <feature.icon size={28} />
                </div>
                <h3 className="text-2xl font-display font-black mb-4 uppercase tracking-tighter text-on-background">{feature.title}</h3>
                <p className="text-on-background/60 leading-relaxed font-sans">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-24 px-4">
        <div className="container mx-auto rounded-3xl bg-primary overflow-hidden relative glow-purple">
           <div className="absolute inset-0 swamp-texture opacity-30 mix-blend-overlay" />
           <div className="relative z-10 p-12 md:p-24 flex flex-col items-center text-center gap-8">
              <h2 className="text-5xl md:text-8xl font-display font-black text-on-primary tracking-tighter uppercase leading-[0.85]">
                READY TO JOIN<br />THE MOVEMENT?
              </h2>
              <p className="text-on-primary/70 font-display font-bold text-xl md:text-2xl max-w-2xl uppercase">
                Grab your gear, secure your tokens, and become a part of the most ruthless community on the chain.
              </p>
              <div className="flex flex-col sm:flex-row gap-6 mt-4">
                 <a 
                   href="https://pump.fun/coin/56RCsF1zhwn7wJWd7dHDZu7yiCNGVyaMF8kTZYSBpump" 
                   target="_blank" 
                   rel="noopener noreferrer" 
                   className="bg-on-primary text-primary px-12 py-5 font-display font-black text-2xl uppercase italic hover:bg-background transition-colors shadow-2xl flex items-center justify-center"
                 >
                    SWAP NOW
                 </a>
                 <button className="border-4 border-on-primary text-on-primary px-12 py-5 font-display font-black text-2xl uppercase italic hover:bg-on-primary hover:text-primary transition-all">
                    JOIN DISCORD
                 </button>
              </div>
           </div>
        </div>
      </section>
    </div>
  );
};
