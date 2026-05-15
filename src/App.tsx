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

function App() {
  useEffect(() => {
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
