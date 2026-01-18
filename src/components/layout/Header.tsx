import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { motion, AnimatePresence } from 'framer-motion';
import { useAccount } from 'wagmi';

const Header: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const { isConnected } = useAccount();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = isConnected
    ? [
        { path: '/dashboard', label: 'Dashboard' },
        { path: '/tools', label: 'Tools' },
        { path: '/staking', label: 'Staking' },
      ]
    : [];

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className={`sticky top-0 z-50 transition-all duration-500 ease-expo-out ${
        scrolled
          ? 'py-4 bg-canvas/80 backdrop-blur-xl border-b border-border'
          : 'py-6 bg-transparent'
      }`}
    >
      <nav className="max-w-7xl mx-auto px-6 lg:px-8 flex justify-between items-center">
        {/* Logo */}
        <Link to={isConnected ? '/dashboard' : '/'} className="group flex items-center gap-3">
          <div className="relative w-10 h-10 flex items-center justify-center">
            {/* Geometric logo mark */}
            <svg
              viewBox="0 0 40 40"
              fill="none"
              className="w-full h-full transition-transform duration-500 ease-expo-out group-hover:scale-110"
            >
              <rect
                x="4"
                y="4"
                width="32"
                height="32"
                rx="8"
                className="fill-ink"
              />
              <path
                d="M14 26L20 14L26 26H14Z"
                className="fill-canvas"
                strokeLinejoin="round"
              />
              <circle cx="20" cy="22" r="2" className="fill-accent" />
            </svg>
          </div>
          <span className="font-display text-display-sm text-ink">
            BeamPad
          </span>
        </Link>

        {/* Navigation */}
        <div className="hidden md:flex items-center gap-1">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className="relative px-4 py-2 text-body-sm font-medium transition-colors duration-300"
            >
              <span
                className={`relative z-10 ${
                  location.pathname === item.path
                    ? 'text-ink'
                    : 'text-ink-muted hover:text-ink'
                }`}
              >
                {item.label}
              </span>
              <AnimatePresence>
                {location.pathname === item.path && (
                  <motion.div
                    layoutId="nav-indicator"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                    className="absolute inset-0 bg-canvas-alt rounded-lg"
                  />
                )}
              </AnimatePresence>
            </Link>
          ))}
        </div>

        {/* Connect Button */}
        <div className="flex items-center gap-4">
          <ConnectButton.Custom>
            {({
              account,
              chain,
              openAccountModal,
              openChainModal,
              openConnectModal,
              mounted,
            }) => {
              const ready = mounted;
              const connected = ready && account && chain;

              return (
                <div
                  {...(!ready && {
                    'aria-hidden': true,
                    style: {
                      opacity: 0,
                      pointerEvents: 'none',
                      userSelect: 'none',
                    },
                  })}
                >
                  {(() => {
                    if (!connected) {
                      return (
                        <button
                          onClick={openConnectModal}
                          className="btn-primary"
                        >
                          Connect
                        </button>
                      );
                    }

                    if (chain.unsupported) {
                      return (
                        <button
                          onClick={openChainModal}
                          className="btn-secondary text-status-error border-status-error"
                        >
                          Wrong network
                        </button>
                      );
                    }

                    return (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={openChainModal}
                          className="btn-ghost flex items-center gap-2"
                        >
                          {chain.hasIcon && chain.iconUrl && (
                            <img
                              alt={chain.name ?? 'Chain icon'}
                              src={chain.iconUrl}
                              className="w-4 h-4 rounded-full"
                            />
                          )}
                        </button>

                        <button
                          onClick={openAccountModal}
                          className="btn-secondary"
                        >
                          <span className="font-mono text-body-sm">
                            {account.displayName}
                          </span>
                        </button>
                      </div>
                    );
                  })()}
                </div>
              );
            }}
          </ConnectButton.Custom>
        </div>
      </nav>
    </motion.header>
  );
};

export default Header;