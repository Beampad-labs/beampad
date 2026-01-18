import { Badge } from '@/components/ui/badge';
import { generateNameFromAddress } from '@/lib/utils';
import { motion } from 'framer-motion';
import { Lock, Package, Plus, TrendingUp, Wallet } from 'lucide-react';
import React from 'react';
import { Link } from 'react-router-dom';
import { useAccount } from 'wagmi';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.16, 1, 0.3, 1] as const,
    },
  },
};

// Mock portfolio data
const allocations = [
  {
    id: '1',
    project: 'Nexus Protocol',
    symbol: 'NXS',
    invested: '$2,500',
    tokens: '100,000',
    currentValue: '$3,750',
    roi: '+50%',
    status: 'Vesting',
    claimable: '25,000',
  },
  {
    id: '2',
    project: 'Aether Finance',
    symbol: 'AETH',
    invested: '$1,000',
    tokens: '50,000',
    currentValue: '$1,200',
    roi: '+20%',
    status: 'Claimable',
    claimable: '50,000',
  },
  {
    id: '3',
    project: 'Quantum Vault',
    symbol: 'QVT',
    invested: '$500',
    tokens: '25,000',
    currentValue: '$500',
    roi: '0%',
    status: 'Pending',
    claimable: '0',
  },
];

const stats = [
  {
    label: 'Total Invested',
    value: '$4,000',
    icon: Wallet,
  },
  {
    label: 'Current Value',
    value: '$5,450',
    icon: TrendingUp,
    accent: true,
  },
];

const ConnectWalletPlaceholder: React.FC<{ message: string }> = ({ message }) => (
  <div className="flex flex-col items-center justify-center text-center py-12 bg-white rounded-3xl border border-border">
    <div className="w-16 h-16 rounded-full bg-canvas-alt flex items-center justify-center mb-4">
      <Wallet className="w-6 h-6 text-ink-muted" />
    </div>
    <h3 className="font-display text-display-sm text-ink mb-2">Connect Your Wallet</h3>
    <p className="text-body text-ink-muted max-w-xs">{message}</p>
  </div>
);

const Dashboard: React.FC = () => {
  const { address, isConnected } = useAccount();

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-12"
    >
      {/* Hero Section */}
      <motion.section variants={itemVariants} className="space-y-2">
        <h1 className="font-display text-display-xl text-ink">
          {address ? (
            <>
              <span className="text-ink-muted">Welcome back, </span>
              <span className="text-accent-gradient">
                {generateNameFromAddress(address)}
              </span>
            </>
          ) : (
            <>
              <span className="text-ink-muted">Hello, </span>
              <span className="text-accent-gradient">Guest</span>
            </>
          )}
        </h1>
      </motion.section>

      <div className="grid grid-cols-1 lg:grid-cols-3 lg:gap-12 gap-y-12">
        {/* === Left Column: Sidebar === */}
        <div className="lg:col-span-1 space-y-12">
          {/* Stats */}
          <motion.section variants={itemVariants} className="space-y-6">
            <h2 className="font-display text-display-md text-ink">Overview</h2>
            {isConnected ? (
              <div className="space-y-4">
                {stats.map((stat) => (
                  <div key={stat.label} className="stat-card p-5">
                    <div className="flex items-start justify-between mb-4">
                      <span className="text-label text-ink-faint uppercase">{stat.label}</span>
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${stat.accent ? 'bg-accent-muted text-accent' : 'bg-canvas-alt text-ink-muted'}`}>
                        <stat.icon className="w-4 h-4" />
                      </div>
                    </div>
                    <p className={`font-display text-display-md ${stat.accent ? 'text-accent-gradient' : 'text-ink'}`}>{stat.value}</p>
                  </div>
                ))}
              </div>
            ) : (
              <ConnectWalletPlaceholder message="Connect your wallet to see your portfolio overview and performance." />
            )}
          </motion.section>
        </div>

        {/* === Right Column: Main Content === */}
        <div className="lg:col-span-2 space-y-12">
          {/* Allocations Table */}
          <motion.section variants={itemVariants} className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-display-md text-ink">
                Your Allocations
              </h2>
            </div>

            {isConnected ? (
              <div className="bg-white rounded-3xl border border-border overflow-hidden">
                {/* Table Header */}
                <div className="hidden md:grid grid-cols-12 gap-6 px-6 py-4 border-b border-border bg-canvas-alt/50">
                  <span className="text-label text-ink-faint uppercase col-span-3">Project</span>
                  <span className="text-label text-ink-faint uppercase text-right col-span-2">Invested</span>
                  <span className="text-label text-ink-faint uppercase text-right col-span-2">Tokens</span>
                  <span className="text-label text-ink-faint uppercase text-right col-span-2">Value</span>
                  <span className="text-label text-ink-faint uppercase text-right col-span-1">ROI</span>
                  <span className="text-label text-ink-faint uppercase text-right col-span-2">Status</span>
                </div>
                {/* Table Body */}
                <div className="divide-y divide-border">
                  {allocations.map((allocation) => (
                    <Link key={allocation.id} to={`/project/${allocation.id}`} className="grid grid-cols-1 md:grid-cols-12 gap-6 px-6 py-5 hover:bg-canvas-alt/30 transition-colors duration-300 group items-center">
                      <div className="col-span-3 flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-canvas-alt border border-border flex items-center justify-center flex-shrink-0">
                          <img src={`https://api.dicebear.com/9.x/identicon/svg?seed=${allocation.project}`} alt={allocation.project} className="w-6 h-6" />
                        </div>
                        <div>
                          <p className="text-body font-medium text-ink group-hover:text-accent transition-colors duration-300">{allocation.project}</p>
                          <p className="text-body-sm text-ink-muted font-mono">{allocation.symbol}</p>
                        </div>
                      </div>
                      <p className="hidden md:block font-mono text-body text-ink text-right col-span-2">{allocation.invested}</p>
                      <p className="hidden md:block font-mono text-body text-ink text-right col-span-2">{allocation.tokens}</p>
                      <p className="hidden md:block font-mono text-body text-ink text-right col-span-2">{allocation.currentValue}</p>
                      <p className={`hidden md:block font-mono text-body text-right col-span-1 ${allocation.roi.startsWith('+') ? 'text-status-live' : 'text-ink'}`}>{allocation.roi}</p>
                      <div className="col-span-2 flex items-center justify-end gap-3">
                        <Badge variant={allocation.status === 'Claimable' ? 'live' : allocation.status === 'Vesting' ? 'upcoming' : 'default'}>{allocation.status}</Badge>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            ) : (
              <ConnectWalletPlaceholder message="Connect your wallet to view your investment allocations and track your portfolio." />
            )}
          </motion.section>
        </div>
      </div>

      {/* My Creations */}
      <motion.section variants={itemVariants} className="space-y-6">
        <h2 className="font-display text-display-md text-ink">My Creations</h2>
        {isConnected ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Created Tokens */}
            <div className="bg-white rounded-2xl border border-border p-5 text-center flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-canvas-alt flex items-center justify-center mb-3"><Package className="w-5 h-5 text-ink-muted" /></div>
              <h3 className="font-display text-body text-ink mb-1">Created Tokens</h3>
              <p className="text-body-sm text-ink-muted mb-4">You haven't created any tokens yet.</p>
              <Link to="/tools" className="btn-secondary btn-sm">Create Token</Link>
            </div>
            {/* Created Presales */}
            <div className="bg-white rounded-2xl border border-border p-5 text-center flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-canvas-alt flex items-center justify-center mb-3"><Plus className="w-5 h-5 text-ink-muted" /></div>
              <h3 className="font-display text-body text-ink mb-1">Created Presales</h3>
              <p className="text-body-sm text-ink-muted mb-4">You haven't created any presales yet.</p>
              <Link to="/tools" className="btn-secondary btn-sm">Create Presale</Link>
            </div>
            {/* Token Locks */}
            <div className="bg-white rounded-2xl border border-border p-5 text-center flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-canvas-alt flex items-center justify-center mb-3"><Lock className="w-5 h-5 text-ink-muted" /></div>
              <h3 className="font-display text-body text-ink mb-1">Token Locks</h3>
              <p className="text-body-sm text-ink-muted mb-4">You haven't locked any tokens yet.</p>
              <Link to="/tools" className="btn-secondary btn-sm">Create Lock</Link>
            </div>
          </div>
        ) : (
          <ConnectWalletPlaceholder message="Connect your wallet to manage your created tokens, presales, and locks." />
        )}
      </motion.section>
    </motion.div>
  );
};

export default Dashboard;