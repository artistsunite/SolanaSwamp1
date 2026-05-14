import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  TrendingUp, 
  BarChart3, 
  PieChart, 
  Activity, 
  ArrowUpRight, 
  ArrowDownRight,
  RefreshCw,
  Flame,
  Zap,
  Globe
} from 'lucide-react';
import { StatCard } from '../components/StatCard';
import { cn } from '../lib/utils';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar
} from 'recharts';
import { statsService } from '../services/statsService';
import { TokenStats } from '../types';

const chartData = [
  { name: '12:00', price: 0.00038, vol: 120 },
  { name: '13:00', price: 0.00041, vol: 150 },
  { name: '14:00', price: 0.00039, vol: 80 },
  { name: '15:00', price: 0.00042, vol: 200 },
  { name: '16:00', price: 0.00045, vol: 240 },
  { name: '17:00', price: 0.00042, vol: 180 },
  { name: '18:00', price: 0.00048, vol: 320 },
];

export const Stats: React.FC = () => {
  const [stats, setStats] = useState<TokenStats | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchAllStats = async () => {
    setLoading(true);
    const data = await statsService.getCombinedStats();
    if (data) setStats(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchAllStats();
    
    // Auto-refresh every 60 seconds
    const interval = setInterval(fetchAllStats, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen pt-32 pb-20 px-4">
      <div className="container mx-auto">
        <header className="mb-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2 text-secondary font-mono text-sm uppercase tracking-widest font-bold">
                <Activity size={16} />
                Live Network Data
              </div>
              <h1 className="text-5xl md:text-7xl font-display font-black tracking-tighter uppercase leading-none">SWAMP ALPHA</h1>
            </div>
            <div className="flex items-center gap-4">
               <button 
                 onClick={fetchAllStats}
                 disabled={loading}
                 className="bg-surface-container border border-outline-variant/30 p-4 hover:bg-surface-container-high transition-colors text-on-background/60 disabled:opacity-50"
               >
                 <RefreshCw size={20} className={cn(loading && "animate-spin")} />
               </button>
               <div className="bg-secondary/10 border border-secondary/30 px-6 py-4 flex flex-col items-end">
                 <span className="text-[10px] font-mono text-secondary uppercase font-bold tracking-widest">Live Price</span>
                 <span className="text-2xl font-display font-black text-secondary leading-none">
                   ${stats?.price ? stats.price.toFixed(stats.price < 0.0001 ? 10 : 6) : "0.0000000000"}
                 </span>
               </div>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          <div className="lg:col-span-2 flex flex-col gap-8">
            {/* Main Chart */}
            <div className="bg-surface-container border border-outline-variant/30 p-8 shadow-2xl relative overflow-hidden group">
               <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-4">
                    <h2 className="text-2xl font-display font-black uppercase tracking-tight">Price Performance</h2>
                    <div className="text-secondary bg-secondary/10 px-2 py-0.5 rounded font-mono text-xs font-bold">+15.4%</div>
                  </div>
                  <div className="flex gap-2">
                    {['1H', '4H', '1D', '1W', 'ALL'].map(t => (
                      <button key={t} className="px-3 py-1 font-mono text-xs border border-outline-variant/30 hover:bg-primary hover:text-on-primary transition-all">
                        {t}
                      </button>
                    ))}
                  </div>
               </div>
               <div className="h-[400px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData}>
                    <defs>
                      <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#94de2d" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#94de2d" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#2a2a2a" />
                    <XAxis dataKey="name" stroke="#666" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="#666" fontSize={12} tickLine={false} axisLine={false} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#201f1f', border: '1px solid #4d4354', color: '#e5e2e1' }}
                      itemStyle={{ color: '#94de2d' }}
                    />
                    <Area type="monotone" dataKey="price" stroke="#94de2d" strokeWidth={3} fillOpacity={1} fill="url(#colorPrice)" />
                  </AreaChart>
                </ResponsiveContainer>
               </div>
            </div>

            {/* Sub Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               <div className="bg-surface-container border border-outline-variant/30 p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <Zap className="text-primary" />
                    <h3 className="text-xl font-display font-black uppercase">Volume Activity</h3>
                  </div>
                  <div className="h-[200px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={chartData}>
                        <Bar dataKey="vol" fill="#ddb7ff" radius={[4, 4, 0, 0]} />
                        <Tooltip 
                          contentStyle={{ backgroundColor: '#201f1f', border: '1px solid #4d4354' }}
                          cursor={{ fill: 'rgba(221, 183, 255, 0.1)' }}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
               </div>

               <div className="bg-surface-container border border-outline-variant/30 p-8 flex flex-col gap-6">
                  <div className="flex items-center gap-3">
                    <PieChart className="text-primary" />
                    <h3 className="text-xl font-display font-black uppercase">Market Health</h3>
                  </div>
                  <div className="space-y-4">
                     {[
                       { label: 'Buy Pressure', value: '78%', color: 'bg-secondary' },
                       { label: 'Holder Growth', value: '12%', color: 'bg-primary' },
                       { label: 'Burn Velocity', value: '45%', color: 'bg-tertiary' }
                     ].map((s, i) => (
                       <div key={i} className="space-y-2">
                          <div className="flex justify-between text-xs font-mono font-bold uppercase tracking-widest">
                            <span className="opacity-60">{s.label}</span>
                            <span>{s.value}</span>
                          </div>
                          <div className="h-1.5 bg-background overflow-hidden px-0.5 py-0.5">
                            <motion.div 
                              initial={{ width: 0 }}
                              animate={{ width: s.value }}
                              className={cn("h-full", s.color)}
                            />
                          </div>
                       </div>
                     ))}
                  </div>
               </div>
            </div>
          </div>

          <div className="flex flex-col gap-8">
            {/* Grid of cards */}
            <StatCard 
              label="Market Cap" 
              value={stats ? stats.marketCap >= 1000000 ? `$${(stats.marketCap / 1000000).toFixed(2)}M` : `$${(stats.marketCap / 1000).toFixed(1)}K` : "$..."} 
              icon={Globe} 
              trend="4.2" 
              isPositive={true} 
            />
            <StatCard 
              label="Holders" 
              value={stats ? stats.holders.toLocaleString() : "..."} 
              icon={BarChart3} 
            />
            <StatCard 
              label="Liquidity" 
              value={stats ? `$${(stats.liquidity / 1000).toFixed(1)}K` : "$..."} 
              icon={Activity} 
              trend="2.4"
              isPositive={true}
            />
            <StatCard 
              label="Total Burned" 
              value={stats ? `${(stats.burnedToken / 1000000000).toFixed(1)}B` : "..."} 
              icon={Flame} 
              trend="1.1" 
              isPositive={true} 
              className="border-primary/30" 
            />
            
            {/* Recent Swaps List */}
            <div className="bg-surface-container border border-outline-variant/30 flex flex-col overflow-hidden">
               <div className="p-6 border-b border-outline-variant/30 bg-surface-container-high/50">
                  <h3 className="font-display font-black uppercase text-lg">Recent Swamp Activity</h3>
               </div>
               <div className="divide-y divide-outline-variant/30">
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div key={i} className="p-4 flex items-center justify-between hover:bg-surface-container-high transition-colors">
                      <div className="flex items-center gap-3">
                        <div className={cn("w-2 h-2 rounded-full", i % 2 === 0 ? "bg-secondary" : "bg-red-400")} />
                        <div>
                           <p className="font-mono text-xs font-bold leading-none">{i % 2 === 0 ? "BUY" : "SELL"}</p>
                           <p className="font-mono text-[10px] opacity-40">0x...42069</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-mono text-xs font-bold">{ (Math.random() * 5).toFixed(2) } SOL</p>
                        <p className={cn("font-mono text-[10px] font-bold", i % 2 === 0 ? "text-secondary" : "text-red-400")}>
                          {i % 2 === 0 ? <ArrowUpRight size={10} className="inline mr-1" /> : <ArrowDownRight size={10} className="inline mr-1" />}
                          PROFIT
                        </p>
                      </div>
                    </div>
                  ))}
               </div>
               <a 
                 href="https://dexscreener.com/solana/56RCsF1zhwn7wJWd7dHDZu7yiCNGVyaMF8kTZYSBpump"
                 target="_blank"
                 rel="noopener noreferrer"
                 className="p-4 text-center font-display font-black uppercase text-xs text-primary hover:bg-primary/10 transition-all border-t border-outline-variant/30"
               >
                 View DexScreener
               </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
