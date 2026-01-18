export interface Project {
  id: string;
  name: string;
  symbol: string;
  status: 'Live' | 'Upcoming' | 'Ended';
  description: string;
  targetRaise: string;
  raised: string;
  raisePercentage: number;
  participants: number;
  minAllocation: string;
  maxAllocation: string;
  tokenPrice: string;
  vesting: string;
  startDate: string;
  endDate: string;
  chain: string;
  links: {
    website: string;
    twitter: string;
    whitepaper: string;
  };
}

export const projects: Project[] = [
  {
    id: '1',
    name: 'Nexus Protocol',
    symbol: 'NXS',
    status: 'Live',
    description: 'Nexus Protocol is a cross-chain liquidity aggregation platform that enables seamless DeFi interoperability across multiple blockchain networks. Our mission is to break down barriers between ecosystems and create a unified liquidity layer for the entire Web3 space.',
    targetRaise: '$750,000',
    raised: '$562,500',
    raisePercentage: 75,
    participants: 1847,
    minAllocation: '$100',
    maxAllocation: '$5,000',
    tokenPrice: '$0.025',
    vesting: '25% TGE, 75% over 6 months',
    startDate: 'Jan 15, 2026',
    endDate: 'Jan 22, 2026',
    chain: 'Beam',
    links: {
      website: '#',
      twitter: '#',
      whitepaper: '#',
    },
  },
  {
    id: '2',
    name: 'Aether Finance',
    symbol: 'AETH',
    status: 'Upcoming',
    description: 'Aether Finance is a decentralized lending protocol that offers flash loans and fixed-rate lending. It aims to provide a more stable and predictable lending environment for DeFi users.',
    targetRaise: '$1,200,000',
    raised: '$150,000',
    raisePercentage: 12.5,
    participants: 432,
    minAllocation: '$250',
    maxAllocation: '$10,000',
    tokenPrice: '$0.10',
    vesting: '10% TGE, 90% over 12 months linear',
    startDate: 'Jan 25, 2026',
    endDate: 'Feb 5, 2026',
    chain: 'Beam',
    links: {
      website: '#',
      twitter: '#',
      whitepaper: '#',
    },
  },
  {
    id: '3',
    name: 'Quantum Vault',
    symbol: 'QVT',
    status: 'Ended',
    description: 'Quantum Vault is a yield farming aggregator that uses quantum-inspired algorithms to optimize yield strategies across multiple DeFi protocols.',
    targetRaise: '$500,000',
    raised: '$500,000',
    raisePercentage: 100,
    participants: 3102,
    minAllocation: '$50',
    maxAllocation: '$2,000',
    tokenPrice: '$0.05',
    vesting: '50% TGE, 50% over 3 months',
    startDate: 'Jan 1, 2026',
    endDate: 'Jan 7, 2026',
    chain: 'Beam',
    links: {
      website: '#',
      twitter: '#',
      whitepaper: '#',
    },
  },
];
