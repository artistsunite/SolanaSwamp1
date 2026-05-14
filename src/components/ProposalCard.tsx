import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Clock, ThumbsUp, XCircle } from 'lucide-react';
import { Proposal, ProposalStatus } from '../types';
import { cn } from '../lib/utils';

interface ProposalCardProps {
  proposal: Proposal;
}

export const ProposalCard: React.FC<ProposalCardProps> = ({ proposal }) => {
  const percentage = (proposal.yesVotes / proposal.totalVotes) * 100;
  
  const statusConfig = {
    [ProposalStatus.Active]: { icon: Clock, color: 'text-primary', label: 'Voting Open' },
    [ProposalStatus.Passed]: { icon: CheckCircle2, color: 'text-secondary', label: 'Executed' },
    [ProposalStatus.Failed]: { icon: XCircle, color: 'text-red-400', label: 'Rejected' },
  };

  const Config = statusConfig[proposal.status];

  return (
    <div className="bg-surface-container-high border border-outline-variant/30 p-6 flex flex-col gap-6">
      <div className="flex items-start justify-between">
        <div className="flex flex-col gap-1">
          <div className={cn("flex items-center gap-2 text-xs font-mono uppercase tracking-widest font-bold", Config.color)}>
            <Config.icon size={14} />
            {Config.label}
          </div>
          <h4 className="text-xl font-display font-black leading-tight text-on-background">{proposal.title}</h4>
        </div>
        <div className="text-right">
          <p className="text-[10px] font-mono opacity-40 uppercase">Ends in</p>
          <p className="font-mono text-xs font-bold leading-none">24:59:12</p>
        </div>
      </div>

      <p className="text-sm text-on-background/70 leading-relaxed line-clamp-2">
        {proposal.description}
      </p>

      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between font-mono text-xs font-bold">
          <span className="text-secondary uppercase">Yes ({percentage.toFixed(1)}%)</span>
          <span className="opacity-40 uppercase">Goal: 69,420 votes</span>
        </div>
        <div className="h-2 bg-background relative border border-outline-variant/20 overflow-hidden">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${percentage}%` }}
            className="h-full bg-secondary shadow-[0_0_10px_rgba(148,222,45,0.5)]"
          />
        </div>
      </div>

      <div className="flex gap-4">
        <button className="flex-1 bg-secondary text-on-secondary py-3 font-display font-black text-sm uppercase flex items-center justify-center gap-2 hover:bg-secondary-container transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
          <ThumbsUp size={16} />
          Vote Yes
        </button>
        <button className="flex-1 border border-outline-variant/50 text-on-background py-3 font-display font-black text-sm uppercase hover:bg-surface-container transition-colors">
          View Detail
        </button>
      </div>
    </div>
  );
};
