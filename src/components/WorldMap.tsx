import React, { useState, useEffect, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, 
  Activity, 
  Globe, 
  Compass, 
  Clock, 
  Navigation, 
  Radio, 
  Loader2,
  TrendingUp,
  Award,
  CircleDot,
  Server,
  MapPin
} from 'lucide-react';
import { firestoreService } from '../services/firestoreService';
import { CityVisit } from '../types';
import { SWAMP_COLORS } from '../constants';

// Seeding/Mock Hotspots when fresh DB is empty
const SEED_HOTSPOTS = [
  { city: "New York", country: "United States", lat: 40.7128, lng: -74.0060, count: 18 },
  { city: "London", country: "United Kingdom", lat: 51.5074, lng: -0.1278, count: 12 },
  { city: "Tokyo", country: "Japan", lat: 35.6762, lng: 139.6503, count: 24 },
  { city: "Paris", country: "France", lat: 48.8566, lng: 2.3522, count: 9 },
  { city: "Sydney", country: "Australia", lat: -33.8688, lng: 151.2093, count: 7 },
  { city: "Singapore", country: "Singapore", lat: 1.3521, lng: 103.8198, count: 15 },
  { city: "São Paulo", country: "Brazil", lat: -23.5505, lng: -46.6333, count: 5 },
  { city: "Berlin", country: "Germany", lat: 52.5200, lng: 13.4050, count: 10 },
  { city: "Cape Town", country: "South Africa", lat: -33.9249, lng: 18.4241, count: 4 },
  { city: "Reykjavik", country: "Iceland", lat: 64.1466, lng: -21.9426, count: 3 }
];

// Helper to recenter/zoom map interactively
function RecenterMap({ center, zoom }: { center: [number, number]; zoom: number }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, zoom, { animate: true, duration: 1.2 });
  }, [center, zoom, map]);
  return null;
}

export const WorldMap: React.FC = () => {
  const [visits, setVisits] = useState<CityVisit[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSignaling, setIsSignaling] = useState(false);
  const [signalStatus, setSignalStatus] = useState('');
  const [mapCenter, setMapCenter] = useState<[number, number]>([20, 0]);
  const [mapZoom, setMapZoom] = useState<number>(2);
  const [selectedCityKey, setSelectedCityKey] = useState<string | null>(null);

  useEffect(() => {
    // Subscribe to Firestore visits
    const unsubscribe = firestoreService.subscribeToCityVisits((incomingVisits) => {
      setVisits(incomingVisits);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Compute Aggregations by City
  const aggregatedCities = useMemo(() => {
    const map: Record<string, {
      key: string;
      city: string;
      country: string;
      lat: number;
      lng: number;
      totalVisits: number;
      lastVisitTime: Date;
    }> = {};

    visits.forEach((v) => {
      const cleanCity = v.city ? v.city.trim() : 'Unknown City';
      const cleanCountry = v.country ? v.country.trim() : 'Unknown Country';
      const key = `${cleanCity.toLowerCase()}_${cleanCountry.toLowerCase()}`;
      const createdAtDate = v.createdAt instanceof Date ? v.createdAt : new Date(v.createdAt);

      if (!map[key]) {
        map[key] = {
          key,
          city: cleanCity,
          country: cleanCountry,
          lat: v.lat,
          lng: v.lng,
          totalVisits: 0,
          lastVisitTime: createdAtDate
        };
      }

      map[key].totalVisits += 1;
      if (createdAtDate > map[key].lastVisitTime) {
        map[key].lastVisitTime = createdAtDate;
        map[key].lat = v.lat; // prioritize the latest logged location coordinates for the city cluster
        map[key].lng = v.lng;
      }
    });

    return Object.values(map);
  }, [visits]);

  // Handle Seeding if MongoDB/Firestore is entirely empty on search completion
  useEffect(() => {
    if (!loading && visits.length === 0) {
      const seedMockData = async () => {
        console.log("Seeding initial mock city visits to empty database collection...");
        for (const item of SEED_HOTSPOTS) {
          // Add multiples to seed aggregation weights
          for (let i = 0; i < item.count; i++) {
            // Apply a very slight coordinate jitter within city bounds to keep things organic
            const jitterLat = item.lat + (Math.random() - 0.5) * 0.08;
            const jitterLng = item.lng + (Math.random() - 0.5) * 0.08;
            await firestoreService.recordCityVisit({
              city: item.city,
              country: item.country,
              lat: jitterLat,
              lng: jitterLng
            });
          }
        }
      };
      seedMockData().catch(err => console.error("Auto seeding of city visits failed:", err));
    }
  }, [loading, visits]);

  // Transmit current user's location manually
  const transmitBeacon = async () => {
    if (isSignaling) return;
    setIsSignaling(true);
    setSignalStatus('Finding coordinates...');

    const saveBeacon = async (lat: number, lng: number, city: string, country: string) => {
      try {
        setSignalStatus('Broadcasting signal...');
        const finalCity = city.trim() || 'Swamp Lodge';
        const finalCountry = country.trim() || 'Swamp Nation';

        await firestoreService.recordCityVisit({
          city: finalCity,
          country: finalCountry,
          lat,
          lng
        });

        // Trigger existing coordinate ping logic as well
        await firestoreService.recordPing({
          lat,
          lng,
          color: SWAMP_COLORS[Math.floor(Math.random() * SWAMP_COLORS.length)]
        });

        setSignalStatus('Beacon uploaded!');
        setTimeout(() => {
          setIsSignaling(false);
          setSignalStatus('');
        }, 1200);
      } catch (err) {
        console.error('Manual transmitter failed:', err);
        setSignalStatus('Failed');
        setTimeout(() => setIsSignaling(false), 1500);
      }
    };

    const tryIPLookupForBeacon = async () => {
      setSignalStatus('Acquiring IP geo arrays...');
      try {
        const res = await fetch('https://freeipapi.com/api/json');
        if (res.ok) {
          const data = await res.json();
          const lat = Number(data.latitude || 0);
          const lng = Number(data.longitude || 0);
          if (lat !== 0 && lng !== 0) {
            await saveBeacon(lat, lng, data.cityName || 'Sanctuary Node', data.countryName || 'Global Swamp');
            return;
          }
        }
        // Fallback to London
        await saveBeacon(51.5074, -0.1278, 'London', 'United Kingdom');
      } catch {
        await saveBeacon(51.5074, -0.1278, 'London', 'United Kingdom');
      }
    };

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          const lat = pos.coords.latitude;
          const lng = pos.coords.longitude;
          try {
            setSignalStatus('Reverse geocoding...');
            const geoRes = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&accept-language=en`);
            if (geoRes.ok) {
              const geoData = await geoRes.json();
              const addr = geoData.address || {};
              const city = addr.city || addr.town || addr.village || addr.suburb || 'Local Node';
              const country = addr.country || 'Swamp Country';
              await saveBeacon(lat, lng, city, country);
            } else {
              await saveBeacon(lat, lng, 'Local Node', 'Global Swamp');
            }
          } catch {
            await saveBeacon(lat, lng, 'Local Node', 'Global Swamp');
          }
        },
        async () => {
          await tryIPLookupForBeacon();
        },
        { enableHighAccuracy: false, timeout: 5000 }
      );
    } else {
      await tryIPLookupForBeacon();
    }
  };

  // Compute Stats For Display Cards
  const stats = useMemo(() => {
    const totalVisitsCount = visits.length;
    const totalUniqueCities = aggregatedCities.length;

    let highestVisitsCity = { city: '--', visits: 0 };
    aggregatedCities.forEach(c => {
      if (c.totalVisits > highestVisitsCity.visits) {
        highestVisitsCity = { city: c.city, visits: c.totalVisits };
      }
    });

    // Recent activity indicator
    const activeWithinLastHour = visits.filter(v => {
      const date = v.createdAt instanceof Date ? v.createdAt : new Date(v.createdAt);
      return (Date.now() - date.getTime()) < 3600000;
    }).length;

    return {
      totalVisitsCount,
      totalUniqueCities,
      highestVisitsCity,
      activeWithinLastHour
    };
  }, [visits, aggregatedCities]);

  // Focus andrec-enter selected city
  const focusOnCity = (lat: number, lng: number, key: string) => {
    setMapCenter([lat, lng]);
    setMapZoom(5);
    setSelectedCityKey(key);
  };

  return (
    <div className="bg-surface-container/25 border border-outline-variant/10 rounded-3xl overflow-hidden p-6 md:p-8 flex flex-col gap-6 backdrop-blur-xl">
      
      {/* Dynamic Header Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pb-6 border-b border-outline-variant/10">
        <div className="bg-background/40 p-4 border border-outline-variant/5 rounded-xl flex items-center gap-3.5">
          <div className="p-2.5 bg-primary/10 rounded-lg text-primary">
            <Users size={20} />
          </div>
          <div>
            <div className="text-[10px] font-mono uppercase tracking-wider text-on-background/40">Total Site Visits</div>
            <div className="text-xl font-display font-black text-primary leading-none mt-1">
              {stats.totalVisitsCount > 0 ? stats.totalVisitsCount : <Loader2 size={16} className="animate-spin" />}
            </div>
          </div>
        </div>

        <div className="bg-background/40 p-4 border border-outline-variant/5 rounded-xl flex items-center gap-3.5">
          <div className="p-2.5 bg-secondary/10 rounded-lg text-secondary">
            <Globe size={20} />
          </div>
          <div>
            <div className="text-[10px] font-mono uppercase tracking-wider text-on-background/40">Registered Cities</div>
            <div className="text-xl font-display font-black text-secondary leading-none mt-1">
              {stats.totalUniqueCities > 0 ? stats.totalUniqueCities : <Loader2 size={16} className="animate-spin" />}
            </div>
          </div>
        </div>

        <div className="bg-background/40 p-4 border border-outline-variant/5 rounded-xl flex items-center gap-3.5 col-span-1">
          <div className="p-2.5 bg-tertiary/10 rounded-lg text-tertiary">
            <Award size={20} />
          </div>
          <div className="overflow-hidden">
            <div className="text-[10px] font-mono uppercase tracking-wider text-on-background/40">Swamp HQ City</div>
            <div className="text-sm font-display font-black text-on-background leading-none mt-1.5 truncate max-w-[130px]">
              {stats.highestVisitsCity.city}
            </div>
          </div>
        </div>

        <div className="bg-background/40 p-4 border border-outline-variant/5 rounded-xl flex items-center gap-3.5">
          <div className="p-2.5 bg-orange-400/10 rounded-lg text-orange-400">
            <Activity className="animate-pulse" size={20} />
          </div>
          <div>
            <div className="text-[10px] font-mono uppercase tracking-wider text-on-background/40">Hourly Active Pings</div>
            <div className="text-sm font-display font-black text-orange-400 leading-none mt-1.5 flex items-center gap-1">
              <span>{stats.activeWithinLastHour} Nodes</span>
              <span className="w-1.5 h-1.5 rounded-full bg-orange-400 animate-ping" />
            </div>
          </div>
        </div>
      </div>

      {/* Main Interactive Map & Feed row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Interactive Map view - Grid Span 8 */}
        <div className="lg:col-span-8 flex flex-col gap-3 relative z-10">
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-2">
              <CircleDot className="text-secondary animate-pulse" size={16} />
              <h3 className="font-display font-black uppercase text-sm tracking-wide text-on-background">
                Sub-Geographical Grid
              </h3>
            </div>
            <span className="text-[9px] font-mono uppercase tracking-wider py-1 px-2.5 bg-black/40 border border-outline-variant/10 rounded-full text-white/50 flex items-center gap-1.5">
              <Server size={10} className="text-secondary" /> Tile Source: OpenStreetMap Dark
            </span>
          </div>

          <div className="w-full h-[480px] rounded-2xl overflow-hidden border border-outline-variant/15 shadow-[0_15px_30px_rgba(0,0,0,0.6)] relative bg-black/80">
            <MapContainer 
              center={mapCenter} 
              zoom={mapZoom} 
              className="w-full h-full"
              zoomControl={true}
              scrollWheelZoom={true}
              attributionControl={false}
            >
              <RecenterMap center={mapCenter} zoom={mapZoom} />
              
              <TileLayer
                url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
              />

              {aggregatedCities.map((city) => {
                // Determine marker diameter & color based on density weights
                const weight = Math.min(1 + Math.log2(city.totalVisits) * 1.5, 8); // scale from 1 to 8 weight multiplier
                const size = Math.round(12 + weight * 3); // between 15px and 44px
                const ringSize = size * 2.2;
                
                // Color gets progressively brighter/lighter the more visits
                let markerColor = '#94de2d'; // default swamp green
                if (city.totalVisits > 15) {
                  markerColor = '#ddb7ff'; // primary purple for top hubs
                } else if (city.totalVisits > 5) {
                  markerColor = '#96d5a3'; // mint green for mid hubs
                }

                // Custom glowing leaflet SVG icon
                const customIcon = L.divIcon({
                  html: `
                    <div style="position: relative; width: ${size}px; height: ${size}px; transform: translate(-33%, -33%);">
                      <!-- Sonar Pulse Ring -->
                      <div class="animate-ping" style="
                        position: absolute;
                        inset: -${size * 0.5}px;
                        border-radius: 50%;
                        background: ${markerColor};
                        opacity: 0.12;
                        pointer-events: none;
                      "></div>
                      <!-- Glow Aura -->
                      <div style="
                        position: absolute;
                        inset: -2px;
                        border-radius: 50%;
                        background: ${markerColor};
                        filter: blur(4px);
                        opacity: 0.55;
                      "></div>
                      <!-- Sharp Solid Core -->
                      <div style="
                        position: absolute;
                        inset: 0px;
                        border-radius: 50%;
                        background: ${markerColor};
                        border: 2px solid #ffffff;
                        box-shadow: 0 4px 12px rgba(0,0,0,0.8);
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        color: #000;
                        font-family: inherit;
                        font-size: 8px;
                        font-weight: 900;
                      ">
                        ${city.totalVisits > 3 ? city.totalVisits : ''}
                      </div>
                    </div>
                  `,
                  className: 'custom-visit-marker-icon',
                  iconSize: [size, size],
                  iconAnchor: [Math.round(size / 2), Math.round(size / 2)],
                  popupAnchor: [0, -Math.round(size / 2)]
                });

                return (
                  <Marker 
                    key={city.key} 
                    position={[city.lat, city.lng]} 
                    icon={customIcon}
                    eventHandlers={{
                      click: () => focusOnCity(city.lat, city.lng, city.key)
                    }}
                  >
                    <Popup minWidth={220}>
                      <div className="p-3 bg-neutral-950 text-white rounded-lg border border-primary/20 shadow-xl font-sans select-none">
                        <div className="flex items-center justify-between border-b border-white/10 pb-1.5 mb-2">
                          <div className="flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: markerColor }} />
                            <span className="font-display font-black uppercase text-[10px] tracking-wider text-primary">
                              Marsland Node
                            </span>
                          </div>
                          <span className="text-[8px] font-mono bg-white/10 py-0.5 px-1.5 rounded-full text-white/70">
                            {city.totalVisits} {city.totalVisits === 1 ? 'Visit' : 'Visits'}
                          </span>
                        </div>
                        
                        <div className="text-sm font-black font-display text-white uppercase leading-none mb-0.5">
                          {city.city}
                        </div>
                        <div className="text-[10px] font-mono text-white/50 uppercase flex items-center gap-1">
                          <Globe size={10} className="text-secondary" /> {city.country}
                        </div>

                        <div className="mt-3 grid grid-cols-2 gap-2 border-t border-white/5 pt-2 text-[9px]">
                          <div>
                            <div className="text-[7px] font-mono text-white/40 uppercase">Metrics Weight</div>
                            <div className="text-[10px] font-display font-black text-secondary leading-none mt-1">
                              {city.totalVisits > 15 ? 'Critical Alpha' : city.totalVisits > 5 ? 'Beta High' : 'Baseline'}
                            </div>
                          </div>
                          <div>
                            <div className="text-[7px] font-mono text-white/40 uppercase">Co-ordinates</div>
                            <div className="font-mono text-white/70 leading-none mt-1">
                              {city.lat.toFixed(2)}N, {city.lng.toFixed(2)}E
                            </div>
                          </div>
                        </div>

                        <div className="text-[7px] font-mono text-white/30 mt-3 flex items-center gap-1 border-t border-white/5 pt-1.5 uppercase">
                          <Clock size={8} /> LAST VISITED: {city.lastVisitTime.toLocaleString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                        </div>
                      </div>
                    </Popup>
                  </Marker>
                );
              })}
            </MapContainer>
          </div>
        </div>

        {/* Right Live Signal List View - Grid Span 4 */}
        <div className="lg:col-span-4 flex flex-col gap-4">
          
          {/* Signal Broadcaster Beacon */}
          <div className="bg-surface-container-high/65 border border-outline-variant/15 p-5 rounded-2xl flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <Navigation className="text-primary animate-bounce-slow" size={18} />
              <h3 className="font-display font-black uppercase text-xs tracking-wide">Swamp Transmitter</h3>
            </div>
            <p className="text-[10px] font-mono text-on-background/60 leading-relaxed uppercase">
              Broadcast your city coordinate arrays to the live world map and claim your swamp sector membership!
            </p>
            
            <button 
              disabled={isSignaling}
              onClick={transmitBeacon}
              className={`w-full py-3.5 px-4 font-display font-black text-xs uppercase tracking-widest italic rounded-xl flex items-center justify-center gap-2 transition-all ${
                isSignaling 
                  ? 'bg-primary/20 text-primary border border-primary/20 cursor-not-allowed'
                  : 'bg-primary text-on-primary hover:bg-primary-hover hover:scale-[1.02] shadow-[0_0_15px_rgba(221,183,255,0.25)]'
              }`}
            >
              {isSignaling ? (
                <>
                  <Loader2 className="animate-spin" size={14} />
                  <span>{signalStatus}</span>
                </>
              ) : (
                <>
                  <Radio size={14} className="animate-pulse" />
                  <span>BEACON SOURCE TRANSMIT</span>
                </>
              )}
            </button>
          </div>

          {/* Dwellers activity logs feed terminal */}
          <div className="bg-surface-container-high/35 border border-outline-variant/10 rounded-2xl flex flex-col h-[345px] overflow-hidden">
            <div className="p-4 border-b border-outline-variant/10 flex items-center justify-between">
              <h3 className="font-display font-black uppercase text-[10px] tracking-wider text-on-background/70 flex items-center gap-2">
                <Compass size={14} className="text-secondary" />
                Live Marsh Coordinates
              </h3>
              <span className="text-[8px] font-mono bg-secondary/15 text-secondary px-2.5 py-0.5 rounded-full uppercase font-bold animate-pulse">
                Auto Sync
              </span>
            </div>

            <div className="p-2 overflow-y-auto flex-1 flex flex-col gap-1.5 custom-scrollbar bg-black/10">
              {loading ? (
                <div className="flex flex-col items-center justify-center h-full text-center p-4">
                  <Loader2 className="animate-spin text-primary mb-2" size={20} />
                  <span className="text-[9px] font-mono uppercase text-on-background/30">Syncing with swamp servers...</span>
                </div>
              ) : visits.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center p-4">
                  <span className="text-[9px] font-mono uppercase text-on-background/30">Initial setup active...</span>
                </div>
              ) : (
                aggregatedCities
                  .sort((a, b) => b.lastVisitTime.getTime() - a.lastVisitTime.getTime())
                  .slice(0, 15)
                  .map((city) => {
                    const isSelected = selectedCityKey === city.key;
                    
                    return (
                      <button
                        key={city.key}
                        onClick={() => focusOnCity(city.lat, city.lng, city.key)}
                        className={`w-full text-left p-2.5 rounded-xl border transition-all flex items-center justify-between ${
                          isSelected 
                            ? 'bg-secondary/10 border-secondary/35 shadow-md' 
                            : 'bg-black/25 hover:bg-black/40 border-transparent hover:border-outline-variant/10'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 overflow-hidden">
                          <div className="w-2.5 h-2.5 rounded-full shrink-0 shadow-sm relative">
                            <span 
                              className="absolute inset-0 rounded-full"
                              style={{ 
                                backgroundColor: city.totalVisits > 15 ? '#ddb7ff' : city.totalVisits > 5 ? '#96d5a3' : '#94de2d',
                                boxShadow: `0 0 6px ${city.totalVisits > 15 ? '#ddb7ff' : city.totalVisits > 5 ? '#96d5a3' : '#94de2d'}`
                              }} 
                            />
                          </div>
                          <div className="overflow-hidden">
                            <div className="font-display font-black uppercase text-[10px] leading-tight text-white">
                              {city.city}
                            </div>
                            <div className="text-[8px] font-mono text-on-background/50 truncate uppercase mt-0.5">
                              {city.country}
                            </div>
                          </div>
                        </div>

                        <div className="text-right shrink-0">
                          <div className="text-[9px] font-display font-black text-secondary uppercase">
                            {city.totalVisits} {city.totalVisits === 1 ? 'VISIT' : 'VISITS'}
                          </div>
                          <div className="text-[7px] font-mono text-white/30 uppercase mt-0.5">
                            {city.lastVisitTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </div>
                        </div>
                      </button>
                    );
                  })
              )}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
