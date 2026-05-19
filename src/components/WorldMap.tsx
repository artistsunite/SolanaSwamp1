import React, { useState, useEffect } from 'react';
import { 
  ComposableMap, 
  Geographies, 
  Geography, 
  Marker 
} from 'react-simple-maps';
import { motion, AnimatePresence } from 'framer-motion';
import { firestoreService } from '../services/firestoreService';
import { Ping } from '../types';

const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

const COLORS = [
  '#94DE2D', // Swamp Green
  '#BB86FC', // Purple
  '#03DAC6', // Teal
  '#CF6679', // Pinkish
  '#FFD700', // Gold
];

export const WorldMap: React.FC = () => {
  const [pings, setPings] = useState<Ping[]>([]);
  const [recentPingIds, setRecentPingIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    // Record visitor's location
    const recordVisit = async () => {
      // Check if we've already pinged this session to avoid spamming on re-mounts
      if (sessionStorage.getItem('swamp_pinged')) return;

      try {
        const response = await fetch('https://ipapi.co/json/');
        const data = await response.json();
        
        if (data.latitude && data.longitude) {
          await firestoreService.recordPing({
            lat: data.latitude,
            lng: data.longitude,
            color: COLORS[Math.floor(Math.random() * COLORS.length)]
          });
          sessionStorage.setItem('swamp_pinged', 'true');
        } else {
           throw new Error('Incomplete geo data');
        }
      } catch (error) {
        console.warn('IP Geo failed, falling back to random swamp entry:', error);
        // Fallback for privacy-conscious users or local dev
        await firestoreService.recordPing({
          lat: Math.random() * 120 - 60,
          lng: Math.random() * 300 - 150,
          color: COLORS[Math.floor(Math.random() * COLORS.length)]
        });
        sessionStorage.setItem('swamp_pinged', 'true');
      }
    };

    recordVisit();

    // Subscribe to pings from Firestore
    const unsubscribe = firestoreService.subscribeToPings((incomingPings) => {
      setPings(incomingPings);
      
      // Track recently added pings for pulse animation
      const now = Date.now();
      const news: string[] = [];
      incomingPings.forEach(p => {
        const time = p.createdAt instanceof Date ? p.createdAt.getTime() : new Date(p.createdAt).getTime();
        if (now - time < 10000) { // Ping is less than 10 seconds old
           news.push(p.id);
        }
      });
      
      if (news.length > 0) {
        setRecentPingIds(new Set(news));
        setTimeout(() => {
          setRecentPingIds(prev => {
            const next = new Set(prev);
            news.forEach(id => next.delete(id));
            return next;
          });
        }, 10000);
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="w-full aspect-[2/1] relative bg-surface-container/50 border border-outline-variant/20 rounded-2xl overflow-hidden shadow-inner min-h-[300px]">
      <div className="absolute top-4 left-6 z-20 flex items-center gap-2">
         <div className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
         <span className="text-[10px] font-mono text-secondary uppercase font-bold tracking-widest">Live Presence Data</span>
      </div>
      
      <ComposableMap
        projection="geoEqualEarth"
        projectionConfig={{
          scale: 160
        }}
        className="w-full h-full opacity-80"
      >
        <Geographies geography={geoUrl}>
          {({ geographies }) =>
            geographies.map((geo) => (
              <Geography
                key={geo.rsmKey}
                geography={geo}
                fill="#141414"
                stroke="#2a2a2a"
                strokeWidth={0.5}
                style={{
                  default: { outline: "none" },
                  hover: { outline: "none", fill: "#1e1e1e" },
                  pressed: { outline: "none" },
                }}
              />
            ))
          }
        </Geographies>
        
        <AnimatePresence>
          {pings.map((ping) => (
            <Marker key={ping.id} coordinates={[ping.lng, ping.lat]}>
              {recentPingIds.has(ping.id) && (
                <motion.circle
                  initial={{ r: 0, opacity: 0 }}
                  animate={{ r: [0, 12], opacity: [0.6, 0] }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeOut",
                  }}
                  fill={ping.color}
                  className="pointer-events-none"
                />
              )}
              <motion.circle
                initial={{ r: 0, opacity: 0 }}
                animate={{ r: recentPingIds.has(ping.id) ? 3.5 : 2, opacity: 1 }}
                fill={ping.color}
                className="shadow-sm"
              />
            </Marker>
          ))}
        </AnimatePresence>
      </ComposableMap>
      
      {/* Overlay for "Scanning" feel */}
      <div className="absolute inset-0 bg-gradient-to-t from-background/40 via-transparent to-background/40 pointer-events-none" />
    </div>
  );
};
