import React, { Suspense, lazy } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useConnectModal } from '@rainbow-me/rainbowkit';
import { useAccount } from 'wagmi';
import {
  ArrowRight,
  CheckCircle2,
  Clock,
  Rocket,
  Search,
  TrendingUp,
  Wallet,
  Zap,
  type LucideIcon,
} from 'lucide-react';
import CountUp from '@/components/ui/CountUp';
import { useLaunchpadPresales } from '@/lib/hooks/useLaunchpadPresales';
import { useMainnetHomepageStats } from '@/lib/hooks/useMainnetHomepageStats';
import { formatPresaleAmount } from '@/lib/utils/presale';

const HeroBackgroundScene = lazy(() => import('@/components/animated/HeroBackgroundScene'));

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.05,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 18 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.42,
      ease: [0.16, 1, 0.3, 1] as const,
    },
  },
};

type StatCard = {
  label: string;
  value: number;
  durationMs: number;
  icon: LucideIcon;
  decimals?: number;
  prefix?: string;
  suffix?: string;
};

const emptyStateCards = [
  { name: 'Coming Soon', desc: 'Fresh launches are being lined up for Beam mainnet.', icon: Rocket },
  { name: 'Stay Tuned', desc: 'Follow BeamPad for launch alerts and presale windows.', icon: Clock },
  { name: 'Get Ready', desc: 'Connect your wallet, review the docs, and prepare to participate.', icon: Zap },
] as const;

const howItWorks = [
  {
    title: 'Connect Wallet',
    description: 'Link your wallet to access BeamPad and switch into launch mode quickly.',
    icon: Wallet,
  },
  {
    title: 'Review Launches',
    description: 'Browse live and upcoming drops, then verify project details before joining.',
    icon: Search,
  },
  {
    title: 'Participate Faster',
    description: 'Enter launches, track allocations, and use BeamPad tooling from one place.',
    icon: CheckCircle2,
  },
] as const;

const HomePage: React.FC = () => {
  const { openConnectModal } = useConnectModal();
  const { isConnected } = useAccount();
  const { presales, isLoading } = useLaunchpadPresales('all');
  const mainnetStats = useMainnetHomepageStats();
  const reduceMotion = useReducedMotion();

  const livePresales = presales.filter((presale) => presale.status === 'live');
  const upcomingPresales = presales.filter((presale) => presale.status === 'upcoming');
  const featuredPresales = [...livePresales, ...upcomingPresales].slice(0, 3);
  const hoverLift = reduceMotion ? undefined : { y: -6, scale: 1.01 };
  const statCards: StatCard[] = [
    {
      label: 'Total Raised',
      value: mainnetStats.totalRaised,
      durationMs: 1400,
      decimals: mainnetStats.totalRaisedDecimals,
      suffix: mainnetStats.totalRaisedSuffix,
      icon: TrendingUp,
    },
    {
      label: 'Projects Launched',
      value: mainnetStats.projectsLaunched,
      durationMs: 1200,
      icon: Rocket,
    },
    {
      label: 'Active Presales',
      value: mainnetStats.activePresales,
      durationMs: 1200,
      icon: Zap,
    },
  ];

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-16 md:space-y-20"
    >
      <motion.section
        variants={itemVariants}
        className="relative overflow-hidden rounded-[2rem] border border-border bg-canvas-alt/60"
      >
        <Suspense fallback={<div className="absolute inset-0 bg-canvas-alt/70" />}>
          <HeroBackgroundScene
            animate={!reduceMotion}
            className="absolute inset-0 h-full w-full opacity-90"
          />
        </Suspense>
        <div
          className="absolute inset-0 hero-accent-overlay"
          style={{
            background:
              'radial-gradient(ellipse at top, rgb(var(--color-accent) / 0.16), transparent 54%), radial-gradient(ellipse at bottom, rgba(249, 115, 22, 0.07), transparent 48%)',
          }}
        />
        <div
          className="absolute inset-0 opacity-[0.08]"
          style={{
            backgroundImage:
              'linear-gradient(to right, rgb(var(--color-ink) / 0.08) 1px, transparent 1px), linear-gradient(to bottom, rgb(var(--color-ink) / 0.06) 1px, transparent 1px)',
            backgroundSize: '34px 34px',
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(180deg, rgb(var(--color-canvas) / 0.06) 0%, rgb(var(--color-canvas) / 0.18) 46%, rgb(var(--color-canvas) / 0.58) 100%)',
          }}
        />
        <div className="pointer-events-none absolute inset-[14px] rounded-[1.45rem] border border-border/30" />

        <div className="relative mx-auto max-w-4xl px-6 py-16 text-center sm:px-8 sm:py-16 lg:px-10 lg:py-20">
          <div className="space-y-6">
            <h1 className="font-display text-4xl leading-tight text-ink sm:text-5xl lg:text-6xl">
              Launch on
              {' '}
              <span className="text-accent-gradient no-glow">Beam</span>
              {' '}
              for builders.
            </h1>
            <p className="mx-auto max-w-2xl text-base text-ink-muted sm:text-lg">
              BeamPad brings launches, NFT drops, token locking, and multisend into one fast execution surface so communities can move without friction.
            </p>
            <div className="flex flex-col items-center justify-center gap-4 pt-4 sm:flex-row">
              <Link to="/presales" className="btn-primary">
                Explore Launchpad
              </Link>
              {isConnected && (
                <Link to="/tools" className="btn-secondary">
                  Start Building
                </Link>
              )}
              {!isConnected && (
                <button
                  onClick={openConnectModal}
                  className="btn-ghost rounded-full border border-border bg-canvas/60 px-6 py-3 text-ink"
                >
                  Connect Wallet
                </button>
              )}
            </div>
          </div>
        </div>
      </motion.section>

      <motion.section variants={itemVariants}>
        <div className="grid gap-6 md:grid-cols-3">
          {statCards.map((stat) => (
            <motion.div
              key={stat.label}
              whileHover={hoverLift}
              transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="stat-card text-center"
            >
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-accent-muted text-accent">
                <stat.icon className="h-6 w-6" />
              </div>
              <p className="font-display text-display-md text-ink">
                {mainnetStats.isLoading ? (
                  <span className="inline-block h-10 w-24 animate-pulse rounded-xl bg-ink/5 align-middle" />
                ) : (
                  <CountUp
                    to={stat.value}
                    durationMs={stat.durationMs}
                    decimals={stat.decimals}
                    prefix={stat.prefix}
                    suffix={stat.suffix}
                  />
                )}
              </p>
              <p className="mt-1 text-body text-ink-muted">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </motion.section>

      <motion.section variants={itemVariants} className="space-y-8">
        <div className="flex items-end justify-between gap-4">
          <div className="space-y-2">
            <p className="text-label uppercase tracking-wider text-ink-faint">Featured</p>
            <h2 className="font-display text-display-md text-ink">Live &amp; Upcoming Launches</h2>
          </div>
          <Link to="/presales" className="btn-ghost inline-flex items-center gap-1">
            View All <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {isLoading ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((index) => (
              <div key={index} className="rounded-3xl border border-border bg-canvas-alt p-6 animate-pulse">
                <div className="mb-4 h-6 w-2/3 rounded-xl bg-ink/5" />
                <div className="mb-6 h-4 w-1/2 rounded-xl bg-ink/5" />
                <div className="mb-3 h-3 w-full rounded-full bg-ink/5" />
                <div className="h-4 w-1/3 rounded-xl bg-ink/5" />
              </div>
            ))}
          </div>
        ) : featuredPresales.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {featuredPresales.map((presale) => (
              <motion.div
                key={presale.address}
                variants={itemVariants}
                whileHover={hoverLift}
                transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
              >
                <Link to={`/presales/${presale.address}`}>
                  <div className="project-card rounded-3xl p-6 space-y-4">
                    <div className="flex items-center justify-between gap-4">
                      <h3 className="font-display text-display-sm text-ink">
                        {presale.saleTokenSymbol || 'Unknown Token'}
                      </h3>
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-[0.6875rem] leading-none font-semibold ${
                          presale.status === 'live'
                            ? 'bg-status-live-bg text-status-live'
                            : 'bg-status-upcoming-bg text-status-upcoming'
                        }`}
                      >
                        {presale.status === 'live' ? 'Live' : 'Upcoming'}
                      </span>
                    </div>
                    <p className="text-body-sm text-ink-muted">
                      {presale.saleTokenName || 'Token Sale'}
                    </p>
                    <div className="space-y-2">
                      <div className="flex justify-between text-body-sm">
                        <span className="text-ink-muted">Progress</span>
                        <span className="font-medium text-ink">{presale.progress}%</span>
                      </div>
                      <div className="h-2 overflow-hidden rounded-full bg-ink/5">
                        <motion.div
                          className="h-full rounded-full bg-accent"
                          initial={reduceMotion ? false : { width: 0 }}
                          animate={{ width: `${presale.progress}%` }}
                          transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
                        />
                      </div>
                      <div className="flex justify-between text-body-sm text-ink-muted">
                        <span>
                          {presale.totalRaised
                            ? formatPresaleAmount(presale.totalRaised, presale.paymentTokenDecimals ?? 18)
                            : '0'}{' '}
                          {presale.paymentTokenSymbol || ''}
                        </span>
                        <span>
                          {presale.hardCap
                            ? formatPresaleAmount(presale.hardCap, presale.paymentTokenDecimals ?? 18)
                            : '0'}{' '}
                          {presale.paymentTokenSymbol || ''}
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {emptyStateCards.map((item) => (
              <motion.div
                key={item.name}
                variants={itemVariants}
                whileHover={hoverLift}
                transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
              >
                <div className="glass-card rounded-3xl p-6 space-y-4 text-center">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-accent-muted text-accent">
                    <item.icon className="h-6 w-6" />
                  </div>
                  <h3 className="font-display text-display-sm text-ink">{item.name}</h3>
                  <p className="text-body-sm text-ink-muted">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </motion.section>

      <motion.section variants={itemVariants} className="space-y-10">
        <div className="text-center">
          <h2 className="font-display text-display-md text-ink">How It Works</h2>
          <p className="mx-auto mt-4 max-w-2xl text-body-lg text-ink-muted">
            BeamPad keeps the launch flow tight so users can go from wallet connection to participation quickly.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {howItWorks.map((item, index) => (
            <motion.div
              key={item.title}
              variants={itemVariants}
              whileHover={hoverLift}
              transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="rounded-[1.75rem] border border-border bg-canvas-alt/80 p-6 text-center"
            >
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-accent-muted text-accent">
                <item.icon className="h-6 w-6" />
              </div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-ink-faint">
                Step 0{index + 1}
              </p>
              <h3 className="mt-3 font-display text-display-sm text-ink">{item.title}</h3>
              <p className="mt-3 text-body text-ink-muted">{item.description}</p>
            </motion.div>
          ))}
        </div>
      </motion.section>

      <motion.section variants={itemVariants}>
        <div className="relative overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-canvas-alt via-canvas to-canvas-alt p-8 md:p-12">
          <div
            className="absolute inset-0 opacity-70"
            style={{
              background:
                'radial-gradient(ellipse at top right, rgba(139, 155, 249, 0.12), transparent 48%), radial-gradient(ellipse at bottom left, rgba(249, 115, 22, 0.08), transparent 45%)',
            }}
          />
          <motion.div
            className="absolute -left-1/3 top-0 h-full w-2/3 bg-gradient-to-r from-transparent via-white/[0.06] to-transparent"
            style={{ transform: 'skewX(-28deg)' }}
            animate={reduceMotion ? undefined : { x: ['-10%', '165%'] }}
            transition={{
              duration: 6.8,
              repeat: Infinity,
              repeatDelay: 1.2,
              ease: 'linear',
            }}
          />
          <motion.div
            className="absolute right-6 top-6 h-32 w-32 rounded-full bg-accent/10 blur-3xl"
            animate={reduceMotion ? undefined : { x: [0, -12, 0], y: [0, 10, 0], opacity: [0.35, 0.55, 0.35] }}
            transition={{ duration: 7.5, repeat: Infinity, ease: 'easeInOut' }}
          />
          <div className="absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />

          <div className="relative flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
            <div className="max-w-xl space-y-4">
              <h3 className="font-display text-display-md text-ink">
                Stake BeamPad to unlock
                <br />
                <span className="text-accent-gradient no-glow">exclusive allocations</span>
              </h3>
              <p className="text-body text-ink-muted">
                Higher tier levels unlock guaranteed allocations and priority access to the most anticipated launches on BeamPad.
              </p>
            </div>
            <Link to="/staking" className="btn-primary">
              Start Staking
            </Link>
          </div>
        </div>
      </motion.section>
    </motion.div>
  );
};

export default HomePage;
