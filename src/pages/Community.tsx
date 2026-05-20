import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Plus, 
  Search, 
  MessageSquare, 
  ThumbsUp, 
  ThumbsDown,
  ExternalLink,
  ShieldAlert,
  Zap,
  Globe,
  Image as ImageIcon
} from 'lucide-react';
import { MemeCard } from '../components/MemeCard';
import { ProposalCard } from '../components/ProposalCard';
import { ProposalStatus, Proposal, Meme, Ping } from '../types';
import { firestoreService } from '../services/firestoreService';

const mockProposals: Proposal[] = [
  {
    id: '1',
    title: 'Burn 5% of Liquidity Pool',
    description: 'A proposal to permanently burn 5% of the existing liquidity pool to increase token scarcity and reward long-term holders.',
    status: ProposalStatus.Active,
    endsAt: new Date(Date.now() + 86400000).toISOString(),
    yesVotes: 45200,
    totalVotes: 69420
  },
  {
    id: '2',
    title: 'New Branding: Gator Green',
    description: 'Updating the primary theme colors to Gator Green across all platforms including the web dApp and mobile interface.',
    status: ProposalStatus.Passed,
    endsAt: new Date(Date.now() - 86400000).toISOString(),
    yesVotes: 120000,
    totalVotes: 140000
  }
];

const mockMemes: Meme[] = [
  { id: '1', imageUrl: '/images/gallery/photo_3.jpg', author: 'CrocLord420', tips: 4.5, createdAt: new Date().toISOString() },
  { id: '2', imageUrl: '/images/gallery/photo_4.jpg', author: 'MudMaster', tips: 12.0, createdAt: new Date().toISOString() },
  { id: '3', imageUrl: '/images/gallery/photo_6.jpg', author: 'SludgeQueen', tips: 0.8, createdAt: new Date().toISOString() },
  { id: '4', imageUrl: '/images/gallery/photo_8.jpg', author: 'NeonGator', tips: 2.1, createdAt: new Date().toISOString() },
];

import { WorldMap } from '../components/WorldMap';

export const Community: React.FC = () => {
  const [proposals, setProposals] = useState<Proposal[]>(mockProposals);
  const [memes, setMemes] = useState<Meme[]>(mockMemes);
  const [pings, setPings] = useState<Ping[]>([]);

  useEffect(() => {
    const unsubProposals = firestoreService.subscribeToProposals((data) => {
      if (data.length > 0) setProposals(data);
    });
    
    const unsubMemes = firestoreService.subscribeToMemes((data) => {
      if (data.length > 0) setMemes(data);
    });

    const unsubPings = firestoreService.subscribeToPings((data) => {
      setPings(data);
    });

    return () => {
      unsubProposals();
      unsubMemes();
      unsubPings();
    };
  }, []);

  return (
    <div className="min-h-screen pt-32 pb-20 px-4">
      <div className="container mx-auto">


        <div className="mb-16">
          <WorldMap />
        </div>


        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* DAO Section */}
          <div className="lg:col-span-7 flex flex-col gap-12">
             <div className="flex items-center justify-between bg-surface-container p-8 border-l-8 border-primary">
                <div>
                   <h2 className="text-3xl font-display font-black uppercase tracking-tight mb-2">Governance Hub</h2>
                   <p className="text-on-background/60 font-medium text-sm">Your vote shapes the future of the swamp.</p>
                </div>
                <button className="bg-primary text-on-primary p-4 hover:scale-110 transition-transform glow-purple">
                   <Plus size={24} />
                </button>
             </div>

             <div className="flex flex-col gap-6">
                <div className="flex items-center justify-between">
                   <div className="flex gap-4">
                      {['All', 'Active', 'History'].map(tab => (
                        <button key={tab} className="font-display font-black text-xs uppercase tracking-[0.2em] opacity-40 hover:opacity-100 transition-opacity">
                          {tab}
                        </button>
                      ))}
                   </div>
                   <div className="relative">
                      <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-on-background/40" />
                      <input 
                        type="text" 
                        placeholder="SEARCH PROPOSALS" 
                        className="bg-surface-container border border-outline-variant/30 pl-10 pr-4 py-2 text-[10px] font-mono focus:outline-none focus:border-primary w-48" 
                      />
                   </div>
                </div>

                <div className="flex flex-col gap-4">
                   {proposals.map(proposal => (
                     <ProposalCard key={proposal.id} proposal={proposal} />
                   ))}
                </div>
             </div>
          </div>

          {/* Social / Meme Section */}
          <div className="lg:col-span-5 flex flex-col gap-12">
             <div className="bg-surface-container border border-outline-variant/30 flex flex-col">
                <div className="p-8 border-b border-outline-variant/30 flex items-center justify-between">
                   <div className="flex items-center gap-3">
                      <ImageIcon className="text-secondary" />
                      <h3 className="text-2xl font-display font-black uppercase">Meme Treasury</h3>
                   </div>
                   <button className="bg-secondary text-on-secondary px-4 py-2 font-display font-black text-xs uppercase glow-green italic">
                     SUBMIT
                   </button>
                </div>
                
                <div className="p-8">
                   <div className="grid grid-cols-2 gap-4">
                      {memes.map(meme => (
                        <MemeCard key={meme.id} meme={meme} />
                      ))}
                   </div>
                   <button className="w-full mt-8 border border-outline-variant/50 py-4 font-display font-black text-xs uppercase hover:bg-surface-container transition-colors tracking-[0.2em]">
                      Explore Full Gallery
                   </button>
                </div>
             </div>

             {/* Discord/Twitter Links */}
             <div className="flex flex-col gap-4">
                <a href="#" className="bg-[#5865F2] p-8 flex items-center justify-between group hover:scale-[1.02] transition-transform">
                   <div className="flex items-center gap-4">
                      <MessageSquare size={32} className="text-white" />
                      <div>
                         <h4 className="text-xl font-display font-black uppercase text-white leading-none">JOIN DISCORD</h4>
                         <p className="text-white/70 font-mono text-[10px] mt-1 font-bold">12,402 SWAMP DWELLERS ONLINE</p>
                      </div>
                   </div>
                   <ExternalLink size={20} className="text-white opacity-40 group-hover:opacity-100 transition-opacity" />
                </a>

                <a href="#" className="bg-[#1DA1F2] p-8 flex items-center justify-between group hover:scale-[1.02] transition-transform">
                   <div className="flex items-center gap-4">
                      <Globe size={32} className="text-white" />
                      <div>
                         <h4 className="text-xl font-display font-black uppercase text-white leading-none">FOLLOW TWITTER</h4>
                         <p className="text-white/70 font-mono text-[10px] mt-1 font-bold">@PURPLECROC_SWAMP</p>
                      </div>
                   </div>
                   <ExternalLink size={20} className="text-white opacity-40 group-hover:opacity-100 transition-opacity" />
                </a>
             </div>

             <div className="bg-surface-container-high border border-red-400/20 p-8 flex items-start gap-4">
                <ShieldAlert className="text-red-400 shrink-0" size={32} />
                <div>
                   <p className="text-red-400 font-display font-black text-lg uppercase tracking-tight">Security Alert</p>
                   <p className="text-on-background/60 text-xs font-medium leading-relaxed mt-2 uppercase tracking-wide">
                      NEVER share your private keys or seed phrases. No team member will ever DM you for wallet access.
                   </p>
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};
