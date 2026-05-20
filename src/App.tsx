import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { Home } from './pages/Home';
import { Play } from './pages/Play';
import { NFTs } from './pages/NFTs';
import { Roadmap } from './pages/Roadmap';
import { Community } from './pages/Community';
import { seedDatabase } from './services/seedService';

import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './lib/firebase';
import { firestoreService } from './services/firestoreService';
import { SWAMP_COLORS } from './constants';

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

const PageTransition: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 1.02 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
};

let isRecordedThisLoad = false;

function App() {
  useEffect(() => {
    // Record visitor's location globally for the Live Presence Map
    const recordVisit = async () => {
      // Record exactly once per load/reload to log every user session, bypassing sessionStorage blockers
      if (isRecordedThisLoad) return;
      isRecordedThisLoad = true;

      const jitter = () => (Math.random() - 0.5) * 0.4;
      const clamp = (val: number, min: number, max: number) => Math.min(Math.max(val, min), max);

      const GLOBAL_SWAMP_HOTSPOTS = [
        { city: "New York", country: "United States", lat: 40.7128, lng: -74.0060 },
        { city: "London", country: "United Kingdom", lat: 51.5074, lng: -0.1278 },
        { city: "Tokyo", country: "Japan", lat: 35.6762, lng: 139.6503 },
        { city: "Sydney", country: "Australia", lat: -33.8688, lng: 151.2093 },
        { city: "Paris", country: "France", lat: 48.8566, lng: 2.3522 },
        { city: "Berlin", country: "Germany", lat: 52.5200, lng: 13.4050 },
        { city: "São Paulo", country: "Brazil", lat: -23.5505, lng: -46.6333 },
        { city: "Singapore", country: "Singapore", lat: 1.3521, lng: 103.8198 },
        { city: "Toronto", country: "Canada", lat: 43.6532, lng: -79.3832 },
        { city: "Los Angeles", country: "United States", lat: 34.0522, lng: -118.2437 }
      ];

      const saveFullVisit = async (lat: number, lng: number, city: string, country: string) => {
        try {
          const latWithJitter = clamp(lat + jitter(), -89.9, 89.9);
          const lngWithJitter = clamp(lng + jitter(), -179.9, 179.9);

          // Log coordinate ping
          await firestoreService.recordPing({
            lat: latWithJitter,
            lng: lngWithJitter,
            color: SWAMP_COLORS[Math.floor(Math.random() * SWAMP_COLORS.length)]
          });

          // Log structured city visit
          await firestoreService.recordCityVisit({
            city: city.trim() || 'Unknown City',
            country: country.trim() || 'Unknown Country',
            lat: latWithJitter,
            lng: lngWithJitter
          });

          console.log(`World Visitor Map: Registered visit in ${city}, ${country} [${latWithJitter}, ${lngWithJitter}]`);
        } catch (error) {
          console.error('Failed to log visit to database:', error);
        }
      };

      const reverseGeocode = async (lat: number, lng: number) => {
        try {
          const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`, {
            headers: { 'Accept-Language': 'en' }
          });
          if (res.ok) {
            const data = await res.json();
            const addr = data.address || {};
            const city = addr.city || addr.town || addr.village || addr.suburb || addr.hamlet || '';
            const country = addr.country || '';
            if (city || country) {
              return { city, country };
            }
          }
        } catch { }
        return null;
      };

      const tryIpFallback = async () => {
        try {
          const tryFetch = async (url: string) => {
            try {
              const res = await fetch(url);
              if (!res.ok) return null;
              const data = await res.json();
              
              let lat = Number(data.latitude || data.lat);
              let lng = Number(data.longitude || data.lon || data.lng);
              
              if (data.loc) {
                const parts = data.loc.split(',');
                lat = Number(parts[0]);
                lng = Number(parts[1]);
              }
              
              if (!isNaN(lat) && !isNaN(lng) && lat !== 0 && lng !== 0) {
                const city = data.cityName || data.city || '';
                const country = data.countryName || data.country_name || data.country || '';
                return { lat, lng, city, country };
              }
              return null;
            } catch {
              return null;
            }
          };

          let geo = await tryFetch('https://freeipapi.com/api/json');
          if (!geo) geo = await tryFetch('https://ipinfo.io/json');
          if (!geo) geo = await tryFetch('https://ipwho.is/');
          if (!geo) geo = await tryFetch('https://ipapi.co/json/');

          if (geo) {
            let finalCity = geo.city || 'Unknown City';
            let finalCountry = geo.country || 'Unknown Country';
            if (finalCountry.length === 2) {
              const isoCountries: Record<string, string> = {
                'US': 'United States', 'CA': 'Canada', 'GB': 'United Kingdom', 'FR': 'France', 'DE': 'Germany',
                'JP': 'Japan', 'AU': 'Australia', 'BR': 'Brazil', 'SG': 'Singapore', 'IN': 'India'
              };
              finalCountry = isoCountries[finalCountry.toUpperCase()] || finalCountry;
            }
            await saveFullVisit(geo.lat, geo.lng, finalCity, finalCountry);
          } else {
            const randomPick = GLOBAL_SWAMP_HOTSPOTS[Math.floor(Math.random() * GLOBAL_SWAMP_HOTSPOTS.length)];
            await saveFullVisit(randomPick.lat, randomPick.lng, randomPick.city, randomPick.country);
          }
        } catch (error) {
          console.error('All IP Geolocation options failed. Logging fallback:', error);
          const randomPick = GLOBAL_SWAMP_HOTSPOTS[Math.floor(Math.random() * GLOBAL_SWAMP_HOTSPOTS.length)];
          await saveFullVisit(randomPick.lat, randomPick.lng, randomPick.city, randomPick.country);
        }
      };

      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const lat = position.coords.latitude;
            const lng = position.coords.longitude;
            if (!isNaN(lat) && !isNaN(lng) && lat !== 0 && lng !== 0) {
              const rev = await reverseGeocode(lat, lng);
              if (rev) {
                await saveFullVisit(lat, lng, rev.city, rev.country);
              } else {
                await tryIpFallback();
              }
            } else {
              await tryIpFallback();
            }
          },
          async (error) => {
            console.warn('Swamp Presence: Browser Geolocation error, using fallback:', error.message);
            await tryIpFallback();
          },
          { enableHighAccuracy: false, timeout: 5000 }
        );
      } else {
        await tryIpFallback();
      }
    };

    recordVisit();

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user && user.email === 'jaronwalker@gmail.com') {
        seedDatabase();
      }
    });
    return () => unsubscribe();
  }, []);

  return (
    <Router>
      <ScrollToTop />
      <div className="min-h-screen bg-background text-on-background overflow-x-hidden selection:bg-secondary selection:text-on-secondary">
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<PageTransition><Home /></PageTransition>} />
            <Route path="/play" element={<PageTransition><Play /></PageTransition>} />
            <Route path="/nfts" element={<PageTransition><NFTs /></PageTransition>} />
            <Route path="/roadmap" element={<PageTransition><Roadmap /></PageTransition>} />
            <Route path="/community" element={<PageTransition><Community /></PageTransition>} />
            {/* Catch-all route redirects to home */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
