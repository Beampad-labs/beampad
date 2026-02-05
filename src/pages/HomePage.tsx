import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useConnectModal } from '@rainbow-me/rainbowkit';
import { useAccount } from 'wagmi';
import { useLaunchpadPresales } from '@/lib/hooks/useLaunchpadPresales';
import CountUp from '@/components/ui/CountUp';
import {
  Rocket,
  Wallet,
  Search,
  Users,
  TrendingUp,
  ArrowRight,
  Zap,
  Clock,
  CheckCircle2,
  Gem,
  Star,
  Shield,
  Coins,
} from 'lucide-react';
import { formatUnits } from 'viem';

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

const HomePage: React.FC = () => {
  const { openConnectModal } = useConnectModal();
  const { isConnected } = useAccount();
  const { presales, isLoading } = useLaunchpadPresales('all');

  const livePresales = presales.filter((p) => p.status === 'live');
  const upcomingPresales = presales.filter((p) => p.status === 'upcoming');
  const featuredPresales = [...livePresales, ...upcomingPresales].slice(0, 3);

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-20"
    >
      {/* Hero Section */}
      <motion.section variants={itemVariants} className="text-center pt-8 md:pt-16">
        <div className="max-w-4xl mx-auto space-y-6">
          <h1 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-ink leading-tight">
            Community-Driven Launches on{' '}
            <span className="text-accent-gradient no-glow">Beam</span>
          </h1>
          <p className="text-base sm:text-lg text-ink-muted max-w-2xl mx-auto">
            BeamPad is the premier launchpad for the Beam ecosystem. Discover promising projects,
            participate in fair launches, and build the future of decentralized gaming and DeFi.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link to="/presales" className="btn-primary inline-flex items-center gap-2">
              <Rocket className="w-4 h-4" />
              Explore IDOs
            </Link>
            {!isConnected && (
              <button
                onClick={openConnectModal}
                className="btn-secondary inline-flex items-center gap-2"
              >
                <Wallet className="w-4 h-4" />
                Connect Wallet
              </button>
            )}
          </div>
        </div>
      </motion.section>

      {/* Stats Section */}
      <motion.section variants={itemVariants}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="stat-card text-center">
            <div className="w-12 h-12 rounded-2xl bg-accent-muted text-accent mx-auto flex items-center justify-center mb-4">
              <TrendingUp className="w-6 h-6" />
            </div>
            <p className="font-display text-display-md text-ink">
              <CountUp to={2.4} durationMs={1400} decimals={1} prefix="$" suffix="M+" />
            </p>
            <p className="text-body text-ink-muted mt-1">Total Raised</p>
          </div>
          <div className="stat-card text-center">
            <div className="w-12 h-12 rounded-2xl bg-accent-muted text-accent mx-auto flex items-center justify-center mb-4">
              <Rocket className="w-6 h-6" />
            </div>
            <p className="font-display text-display-md text-ink">
              <CountUp to={12} durationMs={1200} />
            </p>
            <p className="text-body text-ink-muted mt-1">Projects Launched</p>
          </div>
          <div className="stat-card text-center">
            <div className="w-12 h-12 rounded-2xl bg-accent-muted text-accent mx-auto flex items-center justify-center mb-4">
              <Users className="w-6 h-6" />
            </div>
            <p className="font-display text-display-md text-ink">
              <CountUp to={3200} durationMs={1600} suffix="+" />
            </p>
            <p className="text-body text-ink-muted mt-1">Active Participants</p>
          </div>
        </div>
      </motion.section>

      {/* Featured Presales */}
      <motion.section variants={itemVariants} className="space-y-8">
        <div className="flex items-end justify-between">
          <div className="space-y-2">
            <p className="text-label text-ink-faint uppercase tracking-wider">Featured</p>
            <h2 className="font-display text-display-md text-ink">Live &amp; Upcoming IDOs</h2>
          </div>
          <Link to="/presales" className="btn-ghost inline-flex items-center gap-1">
            View All <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="glass-card rounded-3xl p-6 animate-pulse">
                <div className="h-6 bg-ink/5 rounded-xl w-2/3 mb-4" />
                <div className="h-4 bg-ink/5 rounded-xl w-1/2 mb-6" />
                <div className="h-3 bg-ink/5 rounded-full w-full mb-3" />
                <div className="h-4 bg-ink/5 rounded-xl w-1/3" />
              </div>
            ))}
          </div>
        ) : featuredPresales.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredPresales.map((presale, index) => (
              <motion.div key={presale.address} variants={itemVariants} custom={index}>
                <Link to={`/presales/${presale.address}`}>
                  <div className="project-card rounded-3xl p-6 space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="font-display text-display-sm text-ink">
                        {presale.saleTokenSymbol || 'Unknown Token'}
                      </h3>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
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
                        <span className="text-ink font-medium">{presale.progress}%</span>
                      </div>
                      <div className="w-full h-2 bg-ink/5 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-accent rounded-full transition-all duration-500"
                          style={{ width: `${presale.progress}%` }}
                        />
                      </div>
                      <div className="flex justify-between text-body-sm text-ink-muted">
                        <span>
                          {presale.totalRaised
                            ? formatUnits(presale.totalRaised, presale.paymentTokenDecimals ?? 18)
                            : '0'}{' '}
                          {presale.paymentTokenSymbol || ''}
                        </span>
                        <span>
                          {presale.hardCap
                            ? formatUnits(presale.hardCap, presale.paymentTokenDecimals ?? 18)
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { name: 'Coming Soon', desc: 'Exciting new projects are on the way.', icon: Rocket },
              { name: 'Stay Tuned', desc: 'Follow us for the latest launch announcements.', icon: Clock },
              { name: 'Get Ready', desc: 'Connect your wallet and prepare to participate.', icon: Zap },
            ].map((item, index) => (
              <motion.div key={index} variants={itemVariants} custom={index}>
                <div className="glass-card rounded-3xl p-6 space-y-4 text-center">
                  <div className="w-12 h-12 rounded-2xl bg-accent-muted text-accent mx-auto flex items-center justify-center">
                    <item.icon className="w-6 h-6" />
                  </div>
                  <h3 className="font-display text-display-sm text-ink">{item.name}</h3>
                  <p className="text-body-sm text-ink-muted">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </motion.section>

      {/* How it Works */}
      <motion.section variants={itemVariants} className="space-y-12">
        <div className="text-center">
          <h2 className="font-display text-display-md text-ink">How It Works</h2>
          <p className="text-body-lg text-ink-muted max-w-2xl mx-auto mt-4">
            Participating in BeamPad is simple and straightforward.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              step: 1,
              title: 'Connect Wallet',
              description: 'Link your wallet to access the BeamPad platform and all its features.',
              icon: Wallet,
            },
            {
              step: 2,
              title: 'Explore Projects',
              description:
                'Browse live and upcoming IDOs. Review project details, tokenomics, and team information.',
              icon: Search,
            },
            {
              step: 3,
              title: 'Participate & Build',
              description:
                'Contribute to presales you believe in and claim your tokens when the sale finalizes.',
              icon: CheckCircle2,
            },
          ].map((item, index) => (
            <motion.div key={index} variants={itemVariants} custom={index}>
              <div className="text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-accent-muted text-accent mx-auto flex items-center justify-center">
                  <item.icon className="w-7 h-7" />
                </div>
                <h3 className="font-display text-display-sm text-ink">{item.title}</h3>
                <p className="text-body text-ink-muted">{item.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* CTA Banner */}
      <motion.section variants={itemVariants}>
        <div className="relative overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-canvas-alt via-canvas to-canvas-alt p-8 md:p-12">
          {/* Animated Floating Icons */}
          {[
            { Icon: Rocket, x: '10%', y: '15%', delay: 0, duration: 18, size: 20 },
            { Icon: Gem, x: '75%', y: '20%', delay: 2, duration: 22, size: 16 },
            { Icon: Zap, x: '85%', y: '65%', delay: 4, duration: 16, size: 18 },
            { Icon: Star, x: '20%', y: '70%', delay: 1, duration: 20, size: 14 },
            { Icon: Shield, x: '50%', y: '10%', delay: 3, duration: 24, size: 15 },
            { Icon: Coins, x: '60%', y: '75%', delay: 5, duration: 19, size: 17 },
          ].map(({ Icon, x, y, delay, duration, size }, i) => (
            <motion.div
              key={i}
              className="absolute pointer-events-none"
              style={{ left: x, top: y }}
              animate={{
                y: [0, -12, 0, 8, 0],
                x: [0, 6, 0, -6, 0],
                rotate: [0, 8, 0, -8, 0],
                scale: [1, 1.08, 1, 0.95, 1],
              }}
              transition={{
                duration,
                repeat: Infinity,
                delay,
                ease: 'easeInOut',
              }}
            >
              <div
                className="rounded-xl flex items-center justify-center"
                style={{
                  width: size + 20,
                  height: size + 20,
                  background: 'rgba(139, 92, 246, 0.08)',
                  backdropFilter: 'blur(8px)',
                  WebkitBackdropFilter: 'blur(8px)',
                  border: '1px solid rgba(139, 92, 246, 0.12)',
                  boxShadow: '0 4px 16px rgba(139, 92, 246, 0.06), inset 0 1px 1px rgba(255,255,255,0.05)',
                }}
              >
                <Icon style={{ width: size, height: size }} className="text-accent/40" />
              </div>
            </motion.div>
          ))}

          {/* Gradient Accent */}
          <div
            className="absolute top-0 right-0 w-1/2 h-full opacity-30"
            style={{
              background:
                'radial-gradient(ellipse at top right, rgba(139, 92, 246, 0.35), transparent 70%)',
            }}
          />
          <div
            className="absolute bottom-0 left-0 w-1/3 h-1/2 opacity-20"
            style={{
              background:
                'radial-gradient(ellipse at bottom left, rgba(249, 115, 22, 0.25), transparent 70%)',
            }}
          />

          <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-4 max-w-xl">
              <h3 className="font-display text-display-md text-ink">
                Stake BeamPad to unlock
                <br />
                <span className="text-[#34D399]">exclusive allocations</span>
              </h3>
              <p className="text-body text-ink-muted">
                Higher tier levels unlock guaranteed allocations and priority access to the most
                anticipated launches on BeamPad.
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
