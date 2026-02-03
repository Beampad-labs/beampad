import ProjectCard from '@/components/ProjectCard';
import { motion } from 'framer-motion';
import React from 'react';

const projects = [
  {
    id: '1',
    name: 'Nexus Protocol',
    logo: '/beampad-logo.jpg',
    status: 'Live' as const,
    raisePercentage: 75,
    description: 'Cross-chain liquidity aggregation protocol enabling seamless DeFi interoperability.',
    tokenSymbol: 'NXS',
    targetRaise: '$750,000',
  },
  {
    id: '2',
    name: 'Quantum Vault',
    logo: '/beampad-logo.jpg',
    status: 'Upcoming' as const,
    raisePercentage: 0,
    description: 'Next-generation yield optimization with quantum-resistant security architecture.',
    tokenSymbol: 'QVT',
    targetRaise: '$1,200,000',
  },
  {
    id: '3',
    name: 'Aether Finance',
    logo: '/beampad-logo.jpg',
    status: 'Closed' as const,
    raisePercentage: 100,
    description: 'Decentralized derivatives trading platform with advanced risk management.',
    tokenSymbol: 'AETH',
    targetRaise: '$500,000',
  },
];

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

const LandingPage: React.FC = () => {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-16"
    >
      {/* Hero Section */}
      <motion.section variants={itemVariants} className="text-center">
        <h1 className="font-display text-display-xl text-ink">
          The Future of Community-Driven Launches
        </h1>
        <p className="text-body-lg text-ink-muted max-w-3xl mx-auto mt-4">
          BeamPad is a next-generation launchpad and suite of onchain tools designed to empower communities and builders in the Beam ecosystem.
        </p>
      </motion.section>

      {/* How it Works Section */}
      <motion.section variants={itemVariants} className="space-y-12">
        <div className="text-center">
          <h2 className="font-display text-display-md text-ink">Get Started in Minutes</h2>
          <p className="text-body-lg text-ink-muted max-w-2xl mx-auto mt-4">
            Joining the BeamPad ecosystem is simple. Here's how you can get started.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div className="space-y-4">
            <div className="w-16 h-16 rounded-full bg-accent-muted text-accent mx-auto flex items-center justify-center">
              <span className="font-display text-display-sm">1</span>
            </div>
            <h3 className="font-display text-display-sm text-ink">Connect Your Wallet</h3>
            <p className="text-body text-ink-muted">
              Connect your wallet to BeamPad to get started.
            </p>
          </div>
          <div className="space-y-4">
            <div className="w-16 h-16 rounded-full bg-accent-muted text-accent mx-auto flex items-center justify-center">
              <span className="font-display text-display-sm">2</span>
            </div>
            <h3 className="font-display text-display-sm text-ink">Explore Projects</h3>
            <p className="text-body text-ink-muted">
              Browse upcoming IDOs and find the next big thing.
            </p>
          </div>
          <div className="space-y-4">
            <div className="w-16 h-16 rounded-full bg-accent-muted text-accent mx-auto flex items-center justify-center">
              <span className="font-display text-display-sm">3</span>
            </div>
            <h3 className="font-display text-display-sm text-ink">Participate & Build</h3>
            <p className="text-body text-ink-muted">
              Participate in IDOs, stake your tokens, or build your own project with our tools.
            </p>
          </div>
        </div>
      </motion.section>

      {/* Projects Section */}
      <motion.section variants={itemVariants} className="space-y-8">
        <div className="flex items-end justify-between">
          <div className="space-y-2">
            <p className="text-label text-ink-faint uppercase tracking-wider">
              Active Raises
            </p>
            <h2 className="font-display text-display-md text-ink">
              Upcoming IDOs
            </h2>
          </div>
          <button className="btn-ghost">
            View All
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project, index) => (
            <motion.div
              key={project.id}
              variants={itemVariants}
              custom={index}
            >
              <ProjectCard {...project} />
            </motion.div>
          ))}
        </div>
      </motion.section>



      {/* Featured Banner */}
      <motion.section variants={itemVariants}>
        <div className="relative overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-canvas-alt via-canvas to-canvas-alt p-8 md:p-12">
          {/* Background Pattern */}
          <div
            className="absolute inset-0 opacity-15"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}
          />

          {/* Gradient Accent */}
          <div
            className="absolute top-0 right-0 w-1/2 h-full opacity-30"
            style={{
              background:
                'radial-gradient(ellipse at top right, rgba(139, 155, 249, 0.35), transparent 70%)',
            }}
          />

          <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-4 max-w-xl">
              <h3 className="font-display text-display-md text-ink">
                Stake BEAM to unlock
                <br />
                <span className="text-accent-gradient">exclusive allocations</span>
              </h3>
              <p className="text-body text-ink-muted">
                Higher tier levels unlock guaranteed allocations and priority
                access to the most anticipated launches.
              </p>
            </div>
            <button className="btn-primary">
              Start Staking
            </button>
          </div>
        </div>
      </motion.section>
    </motion.div>
  );
};

export default LandingPage;
