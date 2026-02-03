import { BrowserRouter as Router } from 'react-router-dom';
import AppRoutes from './AppRoutes';

import { RainbowKitProvider } from '@rainbow-me/rainbowkit';
import '@rainbow-me/rainbowkit/styles.css';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiProvider, useChainId } from 'wagmi';
import { config } from './config';
import { useBlockchainStore } from './lib/store/blockchain-store';
import { useLaunchpadPresaleStore } from './lib/store/launchpad-presale-store';
import { useEffect, useRef } from 'react';
import { Toaster } from 'sonner';

const queryClient = new QueryClient();

// Clears zustand caches when the user switches chains
function ChainCacheReset() {
  const chainId = useChainId();
  const prevChainId = useRef(chainId);
  const clearBlockchain = useBlockchainStore((s) => s.clearCache);
  const clearPresale = useLaunchpadPresaleStore((s) => s.clearCache);

  useEffect(() => {
    if (prevChainId.current !== chainId) {
      clearBlockchain();
      clearPresale();
      prevChainId.current = chainId;
    }
  }, [chainId, clearBlockchain, clearPresale]);

  return null;
}

function App() {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
          <ChainCacheReset />
          <Toaster
            position="bottom-right"
            toastOptions={{
              style: {
                fontFamily: '"DM Sans", system-ui, sans-serif',
              },
            }}
          />
          <Router>
            <AppRoutes />
          </Router>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}

export default App;
