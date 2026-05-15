import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Share2, Wallet, LogOut, User as UserIcon } from 'lucide-react';
import { NavItem } from '../types';
import { cn } from '../lib/utils';
import { auth } from '../lib/firebase';
import { signInWithPopup, GoogleAuthProvider, signOut, onAuthStateChanged, User } from 'firebase/auth';

export const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    const unsubscribe = onAuthStateChanged(auth, (u) => setUser(u));
    return () => {
      window.removeEventListener('scroll', handleScroll);
      unsubscribe();
    };
  }, []);

  const handleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error('Login Error:', error);
    }
  };

  const handleLogout = () => signOut(auth);

  const navLinks = [
    { name: 'Swamp', path: NavItem.Home },
    { name: 'Play', path: NavItem.Stats },
    { name: 'NFTs', path: NavItem.NFTs },
    { name: 'Roadmap', path: NavItem.Roadmap },
    { name: 'Community', path: NavItem.Community },
  ];

  return (
    <nav className={cn(
      "fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b",
      scrolled ? "bg-background/80 backdrop-blur-md py-3 border-outline-variant/30" : "bg-transparent py-5 border-transparent"
    )}>
      <div className="container mx-auto px-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-10 h-10 bg-secondary rounded-lg flex items-center justify-center transform group-hover:rotate-12 transition-transform">
             <span className="text-on-secondary font-display font-black text-xl">P</span>
          </div>
          <span className="font-display font-black text-2xl tracking-tighter neon-text-purple">PURPLE CROC</span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={cn(
                "font-display font-bold uppercase tracking-widest text-sm transition-colors hover:text-secondary",
                location.pathname === link.path ? "text-secondary" : "text-on-background/70"
              )}
            >
              {link.name}
            </Link>
          ))}
          
          {user ? (
            <div className="flex items-center gap-4">
               <div className="flex items-center gap-2 bg-surface-container border border-outline-variant/30 px-4 py-2">
                  {user.photoURL ? (
                    <img src={user.photoURL} alt={user.displayName || ''} className="w-6 h-6 rounded-full" />
                  ) : (
                    <UserIcon size={18} className="text-secondary" />
                  )}
                  <span className="font-mono text-xs font-bold uppercase truncate max-w-[100px]">
                    {user.displayName?.split(' ')[0] || 'Degen'}
                  </span>
               </div>
               <button 
                 onClick={handleLogout}
                 className="text-on-background/60 hover:text-red-400 transition-colors"
                 title="Logout"
               >
                 <LogOut size={20} />
               </button>
            </div>
          ) : (
            <button 
              onClick={handleLogin}
              className="bg-secondary text-on-secondary px-6 py-2.5 rounded-none font-display font-black text-sm uppercase flex items-center gap-2 hover:bg-secondary-container transition-colors glow-green"
            >
              <Wallet size={18} />
              Connect
            </button>
          )}
        </div>

        {/* Mobile Toggle */}
        <button className="md:hidden text-on-background" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-full left-0 right-0 bg-surface-container border-b border-outline-variant/30 md:hidden flex flex-col p-6 gap-6"
          >
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className={cn(
                  "font-display font-black text-2xl uppercase tracking-widest",
                  location.pathname === link.path ? "text-secondary" : "text-on-background/70"
                )}
              >
                {link.name}
              </Link>
            ))}
            
            {user ? (
               <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-3 p-4 bg-background border border-outline-variant/30">
                    {user.photoURL && <img src={user.photoURL} alt="" className="w-10 h-10 rounded-full" />}
                    <div>
                      <p className="font-display font-black uppercase leading-none">{user.displayName}</p>
                      <p className="font-mono text-[10px] opacity-40 mt-1">{user.email}</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => { handleLogout(); setIsOpen(false); }}
                    className="w-full py-4 border border-red-400/30 text-red-400 font-display font-black uppercase text-xl"
                  >
                    Logout
                  </button>
               </div>
            ) : (
              <button 
                onClick={() => { handleLogin(); setIsOpen(false); }}
                className="bg-secondary text-on-secondary w-full py-4 rounded-none font-display font-black text-xl uppercase flex items-center justify-center gap-2 glow-green"
              >
                <Wallet size={24} />
                Connect Wallet
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};
