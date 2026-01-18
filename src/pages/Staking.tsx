import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Wallet, TrendingUp, Zap } from 'lucide-react';

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
            delayChildren: 0.1,
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

const Staking: React.FC = () => {
    const [stakeAmount, setStakeAmount] = useState('');

    // Mock data
    const beamBalance = '10,000';
    const stakedAmount = '5,000';
    // const apy = '12.5%';
    const rewards = '125.50';

    return (
        <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-12"
        >
            {/* Header */}
            <motion.section variants={itemVariants} className="space-y-1">
                <h1 className="font-display text-display-lg text-ink">
                    Stake BEAM
                </h1>
            </motion.section>

            {/* Staking Stats */}
            <motion.section variants={itemVariants}>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="stat-card">
                        <div className="flex items-start justify-between mb-6">
                            <span className="text-label text-ink-faint uppercase">
                                Your BEAM Balance
                            </span>
                            <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-canvas-alt text-ink-muted">
                                <Wallet className="w-5 h-5" />
                            </div>
                        </div>
                        <p className="font-display text-display-lg text-ink">
                            {beamBalance}
                        </p>
                    </div>
                    <div className="stat-card">
                        <div className="flex items-start justify-between mb-6">
                            <span className="text-label text-ink-faint uppercase">
                                Staked BEAM
                            </span>
                            <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-canvas-alt text-ink-muted">
                                <Zap className="w-5 h-5" />
                            </div>
                        </div>
                        <p className="font-display text-display-lg text-ink">
                            {stakedAmount}
                        </p>
                    </div>
                    <div className="stat-card">
                        <div className="flex items-start justify-between mb-6">
                            <span className="text-label text-ink-faint uppercase">
                                Rewards Earned
                            </span>
                            <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-accent-muted text-accent">
                                <TrendingUp className="w-5 h-5" />
                            </div>
                        </div>
                        <p className="font-display text-display-lg text-accent-gradient">
                            {rewards}
                        </p>
                    </div>
                </div>
            </motion.section>

            {/* Staking Form */}
            <motion.section variants={itemVariants}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Stake */}
                    <div className="bg-white rounded-3xl border border-border p-8 space-y-6">
                        <h2 className="font-display text-display-sm text-ink">Stake BEAM</h2>
                        <div className="space-y-2">
                            <label className="text-label text-ink-faint uppercase">
                                Amount to Stake
                            </label>
                            <div className="relative">
                                <input
                                    type="text"
                                    value={stakeAmount}
                                    onChange={(e) => setStakeAmount(e.target.value)}
                                    placeholder="0.00"
                                    className="input-field font-mono pr-20"
                                />
                                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-body-sm text-ink-muted">
                                    BEAM
                                </span>
                            </div>
                        </div>
                        <button className="btn-primary w-full">
                            Stake
                        </button>
                    </div>

                    {/* Unstake */}
                    <div className="bg-white rounded-3xl border border-border p-8 space-y-6">
                        <h2 className="font-display text-display-sm text-ink">Unstake BEAM</h2>
                        <p className="text-body text-ink-muted">
                            You have {stakedAmount} BEAM staked.
                        </p>
                        <button className="btn-secondary w-full">
                            Withdraw All
                        </button>
                    </div>
                </div>
            </motion.section>
        </motion.div>
    );
};

export default Staking;
