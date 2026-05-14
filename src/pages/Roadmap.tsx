import React from 'react';
import { motion } from 'motion/react';
import { Flag, Rocket, CheckCircle2, Shield, Zap, TrendingUp, Globe } from 'lucide-react';
import { cn } from '../lib/utils';

const roadmapSteps = [
  {
    phase: "Phase 1: The Emergence",
    title: "Swamp Genesis",
    description: "Launch of the token, burning of liquidity, and community formation. Establishing the core dApp infrastructure.",
    completed: true,
    icon: Rocket,
    milestones: ["Token Launch on Dex", "Contract Verified", "Marketing Kickoff", "Discord & Twitter Setup"]
  },
  {
    phase: "Phase 2: Toxic Growth",
    title: "NFT Integration",
    description: "Minting of the 1,111 Sludge Crocs. Implementation of NFT rarity and initial holder rewards.",
    completed: true,
    icon: Zap,
    milestones: ["Whitelist Mint", "Public Mint", "Secondary Market Listing", "Rarity Tools Live"]
  },
  {
    phase: "Phase 3: Deep Waters",
    title: "DAO Governance",
    description: "Handing over the keys to the community. Proposals live for marketing and ecosystem expansion.",
    completed: false,
    icon: Shield,
    milestones: ["Governance Portal Live", "First Proposal Cycle", "Community Grants", "Swap Partnerships"]
  },
  {
    phase: "Phase 4: Global Domination",
    title: "The Great Flood",
    description: "CEX listings, cross-chain bridges, and the launch of the Swamp Metaverse experience.",
    completed: false,
    icon: Globe,
    milestones: ["Top 5 CEX Listings", "Cross-chain Bridge", "Mobile dApp Release", "Physical Merch Drop"]
  }
];

export const Roadmap: React.FC = () => {
  return (
    <div className="min-h-screen pt-32 pb-20 px-4">
      <div className="container mx-auto">
        <header className="mb-24 text-center">
           <div className="flex flex-col items-center gap-4">
              <div className="flex items-center gap-2 text-primary font-mono text-sm uppercase tracking-[0.4em] font-bold">
                <Flag size={18} />
                Strategic Path
              </div>
              <h1 className="text-6xl md:text-9xl font-display font-black tracking-tighter uppercase leading-[0.85] italic">THE MASTER<br />PLAN</h1>
           </div>
        </header>

        <div className="max-w-4xl mx-auto relative">
           {/* Timeline line */}
           <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-1 bg-outline-variant/20 -translate-x-1/2 hidden md:block" />
           
           <div className="flex flex-col gap-24">
              {roadmapSteps.map((step, i) => (
                <motion.div 
                   key={i}
                   initial={{ opacity: 0, y: 50 }}
                   whileInView={{ opacity: 1, y: 0 }}
                   transition={{ duration: 0.6, delay: i * 0.1 }}
                   viewport={{ once: true }}
                   className={cn(
                     "relative flex flex-col md:flex-row items-center gap-12",
                     i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                   )}
                >
                  {/* Step Point */}
                  <div className="absolute left-8 md:left-1/2 top-0 md:top-12 w-12 h-12 bg-background border-4 border-outline-variant/50 rounded-full -translate-x-1/2 flex items-center justify-center z-10">
                     <div className={cn(
                        "w-4 h-4 rounded-full",
                        step.completed ? "bg-secondary shadow-[0_0_10px_#94de2d]" : "bg-outline-variant"
                     )} />
                  </div>

                  {/* Content */}
                  <div className="flex-1 w-full pl-16 md:pl-0">
                     <div className={cn(
                        "bg-surface-container border border-outline-variant/30 p-8 relative overflow-hidden group",
                        step.completed ? "border-secondary/30" : "border-outline-variant/10"
                     )}>
                        {step.completed && (
                          <div className="absolute top-0 right-0 p-4 transform translate-x-4 -translate-y-4">
                             <CheckCircle2 size={120} className="text-secondary opacity-10" />
                          </div>
                        )}
                        
                        <div className="relative z-10">
                           <div className="flex items-center gap-3 mb-4">
                              <div className={cn(
                                "w-10 h-10 flex items-center justify-center text-on-primary",
                                step.completed ? "bg-secondary text-on-secondary" : "bg-primary text-on-primary"
                              )}>
                                 <step.icon size={20} />
                              </div>
                              <span className="text-xs font-mono font-black uppercase tracking-widest leading-none text-primary">{step.phase}</span>
                           </div>

                           <h3 className="text-3xl font-display font-black uppercase mb-4 tracking-tight">{step.title}</h3>
                           <p className="text-on-background/60 font-medium mb-8 leading-relaxed italic">
                             "{step.description}"
                           </p>

                           <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
                              {step.milestones.map((m, j) => (
                                <div key={j} className="flex items-center gap-2 font-bold uppercase tracking-widest">
                                   <div className={cn("w-2 h-2", step.completed ? "bg-secondary" : "bg-outline-variant")} />
                                   {m}
                                </div>
                              ))}
                           </div>
                        </div>
                     </div>
                  </div>

                  {/* Spacer for alternate layout */}
                  <div className="flex-1 hidden md:block" />
                </motion.div>
              ))}
           </div>
        </div>

        {/* Future Vision */}
        <section className="mt-40 text-center max-w-2xl mx-auto border-t-4 border-primary pt-20">
           <TrendingUp size={48} className="text-primary mx-auto mb-8 animate-bounce" />
           <h2 className="text-4xl font-display font-black uppercase tracking-tighter mb-6 underline decoration-secondary">THE UNKNOWN DEPTHS</h2>
           <p className="text-on-background/60 font-display font-bold text-lg leading-relaxed italic uppercase">
             Our vision extends beyond what can be charted. The swamp is ever-evolving, absorbing everything in its path. 
             Stay alert. Stay hungry. Stay toxic.
           </p>
        </section>
      </div>
    </div>
  );
};
