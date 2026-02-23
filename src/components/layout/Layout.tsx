import React from 'react';
import Header from './Header';
import Footer from './Footer';

type LayoutProps = {
  children: React.ReactNode;
  themeMode: 'dark' | 'light';
  onToggleTheme: () => void;
};

const Layout: React.FC<LayoutProps> = ({ children, themeMode, onToggleTheme }) => {
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
          {children}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Layout;
