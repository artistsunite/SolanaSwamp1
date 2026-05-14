import React from 'react';
import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';
import { cn } from '../lib/utils';

interface StatCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  trend?: string;
  isPositive?: boolean;
  className?: string;
}

export const StatCard: React.FC<StatCardProps> = ({ label, value, icon: Icon, trend, isPositive, className }) => {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      className={cn(
        "bg-surface-container p-6 border border-outline-variant/30 relative overflow-hidden group",
        className
      )}
    >
      <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
        <Icon size={80} className="text-primary" />
      </div>
      
      <div className="relative z-10">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 rounded bg-primary/10 flex items-center justify-center text-primary">
            <Icon size={18} />
          </div>
          <span className="text-on-background/60 text-xs font-mono uppercase tracking-widest leading-none">{label}</span>
        </div>
        
        <div className="flex flex-col gap-1">
          <h3 className="text-3xl font-display font-black text-on-background">{value}</h3>
          {trend && (
            <div className={cn(
              "text-xs font-mono font-bold",
              isPositive ? "text-secondary" : "text-red-400"
            )}>
              {isPositive ? "+" : ""}{trend}%
            </div>
          )}
        </div>
      </div>
      
      <div className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-primary/50 to-transparent transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
    </motion.div>
  );
};
