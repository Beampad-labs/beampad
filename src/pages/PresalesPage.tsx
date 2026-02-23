import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  useLaunchpadPresales,
  type LaunchpadPresaleFilter,
} from '@/lib/hooks/useLaunchpadPresales';
import { formatUnits } from 'viem';
import {
  Clock,
  CheckCircle2,
  XCircle,
  Loader2,
  Search,
} from 'lucide-react';

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

type TabFilter = 'all' | 'live' | 'upcoming' | 'ended';

const tabs: { label: string; value: TabFilter }[] = [
  { label: 'All', value: 'all' },
  { label: 'Live', value: 'live' },
  { label: 'Upcoming', value: 'upcoming' },
  { label: 'Ended', value: 'ended' },
];

function getStatusBadge(status: string) {
  switch (status) {
    case 'live':
      return (
        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">
          <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
          Live
        </span>
      );
    case 'upcoming':
      return (
        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-700">
          <Clock className="w-3 h-3" />
          Upcoming
        </span>
      );
    case 'ended':
    case 'finalized':
      return (
        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-600">
          <CheckCircle2 className="w-3 h-3" />
          Ended
        </span>
      );
    case 'cancelled':
      return (
        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-600">
          <XCircle className="w-3 h-3" />
          Cancelled
        </span>
      );
    default:
      return null;
  }
}

function formatTimeRemaining(endTime: bigint | undefined): string {
  if (!endTime) return '--';
  const now = BigInt(Math.floor(Date.now() / 1000));
  if (endTime <= now) return 'Ended';

  const diff = Number(endTime - now);
  const days = Math.floor(diff / 86400);
  const hours = Math.floor((diff % 86400) / 3600);
  const minutes = Math.floor((diff % 3600) / 60);

  if (days > 0) return `${days}d ${hours}h remaining`;
  if (hours > 0) return `${hours}h ${minutes}m remaining`;
  return `${minutes}m remaining`;
}

const PresalesPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabFilter>('all');

  const filterMap: Record<TabFilter, LaunchpadPresaleFilter> = {
    all: 'all',
    live: 'live',
    upcoming: 'upcoming',
    ended: 'ended',
  };

  const { presales, isLoading } = useLaunchpadPresales(filterMap[activeTab]);

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8"
    >
      {/* Header */}
      <motion.section variants={itemVariants} className="space-y-2">
        <h1 className="font-display text-display-lg text-ink">Launchpad</h1>
        <p className="text-body-lg text-ink-muted">
          Discover and participate in the latest token launches on Beam.
        </p>
      </motion.section>

      {/* Filter Tabs */}
      <motion.section variants={itemVariants}>
        <div className="flex items-center gap-2 flex-wrap">
          {tabs.map((tab) => (
            <button
              key={tab.value}
              onClick={() => setActiveTab(tab.value)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                activeTab === tab.value
                  ? 'bg-accent text-accent-foreground shadow-sm'
                  : 'bg-ink/5 text-ink-muted hover:bg-ink/10'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </motion.section>

      {/* Presale Grid */}
      <motion.section variants={itemVariants}>
        {isLoading && presales.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 space-y-4">
            <Loader2 className="w-8 h-8 text-accent animate-spin" />
            <p className="text-body text-ink-muted">Loading presales...</p>
          </div>
        ) : presales.length === 0 ? (
          <div className="glass-card rounded-3xl p-12 text-center space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-accent-muted text-accent mx-auto flex items-center justify-center">
              <Search className="w-8 h-8" />
            </div>
            <h3 className="font-display text-display-sm text-ink">No Presales Found</h3>
            <p className="text-body text-ink-muted max-w-md mx-auto">
              {activeTab === 'all'
                ? 'There are no presales yet. Check back soon for exciting new launches.'
                : `No ${activeTab} presales at the moment. Try a different filter.`}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {presales.map((presale, index) => (
              <motion.div key={presale.address} variants={itemVariants} custom={index}>
                <Link to={`/presales/${presale.address}`}>
                  <div className="project-card rounded-3xl p-6 space-y-4 h-full">
                    {/* Header */}
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <h3 className="font-display text-display-sm text-ink">
                          {presale.saleTokenSymbol || 'Unknown'}
                        </h3>
                        <p className="text-body-sm text-ink-muted">
                          {presale.saleTokenName || 'Token Sale'}
                        </p>
                      </div>
                      {getStatusBadge(presale.status)}
                    </div>

                    {/* Progress */}
                    <div className="space-y-2">
                      <div className="flex justify-between text-body-sm">
                        <span className="text-ink-muted">Progress</span>
                        <span className="text-ink font-medium">{presale.progress}%</span>
                      </div>
                      <div className="w-full h-2.5 bg-ink/5 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-accent rounded-full transition-all duration-500"
                          style={{ width: `${presale.progress}%` }}
                        />
                      </div>
                    </div>

                    {/* Raised / Hard Cap */}
                    <div className="flex justify-between text-body-sm">
                      <div>
                        <p className="text-ink-muted">Raised</p>
                        <p className="text-ink font-medium">
                          {presale.totalRaised
                            ? formatUnits(presale.totalRaised, presale.paymentTokenDecimals ?? 18)
                            : '0'}{' '}
                          {presale.paymentTokenSymbol || ''}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-ink-muted">Hard Cap</p>
                        <p className="text-ink font-medium">
                          {presale.hardCap
                            ? formatUnits(presale.hardCap, presale.paymentTokenDecimals ?? 18)
                            : '0'}{' '}
                          {presale.paymentTokenSymbol || ''}
                        </p>
                      </div>
                    </div>

                    {/* Time Remaining */}
                    <div className="pt-2 border-t border-ink/5">
                      <div className="flex items-center gap-2 text-body-sm text-ink-muted">
                        <Clock className="w-3.5 h-3.5" />
                        <span>
                          {presale.status === 'upcoming'
                            ? presale.startTime
                              ? `Starts ${new Date(Number(presale.startTime) * 1000).toLocaleDateString()}`
                              : 'Start date TBD'
                            : formatTimeRemaining(presale.endTime)}
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </motion.section>
    </motion.div>
  );
};

export default PresalesPage;
