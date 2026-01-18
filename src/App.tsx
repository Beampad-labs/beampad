import { BrowserRouter as Router } from 'react-router-dom';
import AppRoutes from './AppRoutes';

import { getDefaultConfig, RainbowKitProvider } from '@rainbow-me/rainbowkit';
import '@rainbow-me/rainbowkit/styles.css';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiProvider } from 'wagmi';
import { beam, beamTestnet } from 'wagmi/chains';

const config = getDefaultConfig({
  appName: 'BeamPad',
  projectId: 'YOUR_PROJECT_ID',
  chains: [beam, beamTestnet],
  ssr: true, // If your dApp uses server side rendering (SSR)
});

const queryClient = new QueryClient();

function App() {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
          <Router>
            <AppRoutes />
          </Router>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}

export default App;
