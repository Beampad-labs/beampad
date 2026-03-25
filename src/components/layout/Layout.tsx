import React from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';

type LayoutProps = {
  children: React.ReactNode;
  themeMode: 'dark' | 'light';
  onToggleTheme: () => void;
};

const Layout: React.FC<LayoutProps> = ({ children, themeMode, onToggleTheme }) => {
  const location = useLocation();
  const reduceMotion = useReducedMotion();

  return (
    <div className="relative flex flex-col min-h-screen bg-canvas">
      {/* Subtle noise texture overlay */}
      <div className="noise-overlay" />

      {/* Subtle gradient accent at top */}
      <div
        className="fixed top-0 left-0 right-0 h-[520px] pointer-events-none opacity-50"
        style={{
          background: 'var(--layout-top-glow)',
        }}
      />

      <Header themeMode={themeMode} onToggleTheme={onToggleTheme} />

      <main className="relative flex-grow">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12 lg:py-16">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={reduceMotion ? { opacity: 1 } : { opacity: 0, y: 14 }}
              animate={reduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
              exit={reduceMotion ? { opacity: 1 } : { opacity: 0, y: -10 }}
              transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Layout;
