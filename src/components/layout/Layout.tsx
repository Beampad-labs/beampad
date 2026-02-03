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
        className="fixed top-0 left-0 right-0 h-[520px] pointer-events-none opacity-50"
        style={{
          background:
            'radial-gradient(ellipse 80% 55% at 50% -20%, rgba(139, 155, 249, 0.08), transparent 60%), radial-gradient(ellipse 70% 50% at 15% -10%, rgba(139, 183, 249, 0.07), transparent 62%), radial-gradient(ellipse 70% 50% at 85% -10%, rgba(143, 220, 196, 0.06), transparent 62%), radial-gradient(ellipse 60% 45% at 50% -30%, rgba(243, 222, 176, 0.06), transparent 65%)',
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
