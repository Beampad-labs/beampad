import React from 'react';
import Header from './Header';
import Footer from './Footer';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="relative flex flex-col min-h-screen bg-canvas">
      {/* Subtle noise texture overlay */}
      <div className="noise-overlay" />

      {/* Subtle gradient accent at top */}
      <div
        className="fixed top-0 left-0 right-0 h-[500px] pointer-events-none opacity-40"
        style={{
          background: 'radial-gradient(ellipse 80% 50% at 50% -20%, rgba(79, 70, 229, 0.08), transparent)',
        }}
      />

      <Header />

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
