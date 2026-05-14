import React from 'react';
import { Link } from 'react-router-dom';
import { Send, Globe, MessageSquare, ShieldCheck, Github } from 'lucide-react';
import { NavItem } from '../types';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-background border-t border-outline-variant/30 py-20">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-20">
          <div className="flex flex-col gap-6">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-12 h-12 bg-secondary rounded-lg flex items-center justify-center">
                <span className="text-on-secondary font-display font-black text-2xl uppercase">P</span>
              </div>
              <span className="font-display font-black text-3xl tracking-tighter italic">PURPLE CROC</span>
            </Link>
            <p className="text-on-background/60 font-medium leading-relaxed italic uppercase">
              The official movement of the swamp. A high-energy degen experience built for the community, by the community.
            </p>
            <div className="flex gap-4">
              {[
                { Icon: Send, href: '#' },
                { Icon: Globe, href: '#' },
                { Icon: MessageSquare, href: '#' },
                { Icon: Github, href: 'https://github.com/artistsunite/Solana-Swamp' }
              ].map(({ Icon, href }, i) => (
                <a 
                  key={i} 
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 bg-surface-container border border-outline-variant/30 flex items-center justify-center hover:bg-primary hover:text-on-primary transition-all text-on-background/60"
                >
                  <Icon size={20} />
                </a>
              ))}
            </div>
          </div>

          <div>
             <h4 className="font-display font-black text-xs uppercase tracking-[0.3em] mb-8 text-primary">Explore</h4>
             <ul className="flex flex-col gap-4">
                <li><Link to={NavItem.Home} className="font-display font-bold text-sm uppercase hover:text-secondary transition-colors italic">The Swamp</Link></li>
                <li><Link to={NavItem.Stats} className="font-display font-bold text-sm uppercase hover:text-secondary transition-colors italic">DEX Data</Link></li>
                <li><Link to={NavItem.NFTs} className="font-display font-bold text-sm uppercase hover:text-secondary transition-colors italic">Gallery</Link></li>
                <li><Link to={NavItem.Community} className="font-display font-bold text-sm uppercase hover:text-secondary transition-colors italic">Governance</Link></li>
             </ul>
          </div>

          <div>
             <h4 className="font-display font-black text-xs uppercase tracking-[0.3em] mb-8 text-secondary">Ecosystem</h4>
             <ul className="flex flex-col gap-4 text-on-background/60">
                <li className="font-display font-bold text-sm uppercase hover:text-on-background cursor-pointer italic transition-colors">Whitepaper</li>
                <li className="font-display font-bold text-sm uppercase hover:text-on-background cursor-pointer italic transition-colors">Documentation</li>
                <li className="font-display font-bold text-sm uppercase hover:text-on-background cursor-pointer italic transition-colors">Audit Report</li>
                <li className="font-display font-bold text-sm uppercase hover:text-on-background cursor-pointer italic transition-colors">Legal Terms</li>
             </ul>
          </div>

          <div className="flex flex-col gap-6">
             <div className="bg-surface-container p-6 border border-outline-variant/30">
                <div className="flex items-center gap-3 mb-4">
                   <ShieldCheck className="text-secondary" />
                   <h5 className="font-display font-black text-xs uppercase tracking-widest">Audited & Verified</h5>
                </div>
                <p className="text-[10px] font-mono opacity-50 uppercase font-black tracking-widest">Full smart contract audit by swamp security labs. No backdoors. No rugs.</p>
             </div>
             <p className="text-[10px] font-mono opacity-30 mt-auto uppercase font-bold tracking-widest text-center md:text-left">
               © 2026 PURPLE CROC MOVEMENT. ALL RIGHTS RECLAIMED.
             </p>
          </div>
        </div>
      </div>
    </footer>
  );
};
