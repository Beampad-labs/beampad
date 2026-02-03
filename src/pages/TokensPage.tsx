import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useAccount, useChainId, useReadContracts } from 'wagmi';
import { Copy, ExternalLink, Package } from 'lucide-react';
import { erc20Abi, getExplorerUrl } from '@/config';
import { useUserTokens } from '@/lib/hooks/useUserTokens';
import { toast } from 'sonner';

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

const TokensPage: React.FC = () => {
  const { isConnected } = useAccount();
  const chainId = useChainId();
  const explorerUrl = getExplorerUrl(chainId);
  const { tokens: createdTokens, isLoading } = useUserTokens();

  const tokenMetaQueries = useMemo(() => {
    if (createdTokens.length === 0) return [];
    return createdTokens.flatMap((token) => [
      { abi: erc20Abi, address: token, functionName: 'symbol' },
      { abi: erc20Abi, address: token, functionName: 'name' },
      { abi: erc20Abi, address: token, functionName: 'decimals' },
    ] as const);
  }, [createdTokens]);

  const { data: tokenMetaResults } = useReadContracts({
    contracts: tokenMetaQueries,
    query: {
      enabled: tokenMetaQueries.length > 0,
    },
  });

  const tokenList = useMemo(() => {
    if (createdTokens.length === 0) return [];
    return createdTokens.map((token, index) => {
      const symbol = tokenMetaResults?.[index * 3]?.result as string | undefined;
      const name = tokenMetaResults?.[index * 3 + 1]?.result as string | undefined;
      const decimals = tokenMetaResults?.[index * 3 + 2]?.result as number | bigint | undefined;
      const decimalsValue = typeof decimals === 'number' ? decimals : Number(decimals ?? 18);

      return {
        address: token,
        symbol: symbol ?? 'TOKEN',
        name: name ?? 'Token',
        decimals: decimalsValue,
      };
    });
  }, [createdTokens, tokenMetaResults]);

  const handleCopy = (value: string) => {
    navigator.clipboard.writeText(value);
    toast.success('Copied to clipboard.');
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-10"
    >
      <motion.section variants={itemVariants} className="space-y-2">
        <h1 className="font-display text-display-lg text-ink">Token Management</h1>
        <p className="text-body-lg text-ink-muted">
          Manage tokens you have created on BeamPad.
        </p>
      </motion.section>

      {!isConnected ? (
        <motion.div variants={itemVariants} className="glass-card rounded-3xl p-8 text-center">
          <p className="text-body text-ink-muted">Connect your wallet to view created tokens.</p>
        </motion.div>
      ) : isLoading ? (
        <motion.div variants={itemVariants} className="glass-card rounded-3xl p-8 text-center">
          <p className="text-body text-ink-muted">Loading tokens…</p>
        </motion.div>
      ) : tokenList.length === 0 ? (
        <motion.div variants={itemVariants} className="glass-card rounded-3xl p-8 text-center space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-accent-muted text-accent mx-auto flex items-center justify-center">
            <Package className="w-6 h-6" />
          </div>
          <p className="text-body text-ink-muted">No created tokens yet.</p>
          <Link to="/create/token" className="btn-secondary inline-flex">
            Create Token
          </Link>
        </motion.div>
      ) : (
        <motion.section variants={itemVariants} className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {tokenList.map((token) => (
              <div key={token.address} className="glass-card rounded-3xl p-6 space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-display text-display-sm text-ink">{token.symbol}</p>
                    <p className="text-body-sm text-ink-muted">{token.name}</p>
                  </div>
                  <button
                    onClick={() => handleCopy(token.address)}
                    className="p-2 rounded-xl bg-canvas text-ink-muted hover:text-ink transition-colors"
                    aria-label="Copy token address"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                </div>
                <code className="text-body-sm font-mono text-ink-muted break-all">
                  {token.address}
                </code>
                <div className="flex flex-wrap gap-3">
                  <a
                    href={`${explorerUrl}/address/${token.address}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-secondary inline-flex items-center gap-2"
                  >
                    Explorer <ExternalLink className="w-4 h-4" />
                  </a>
                  <Link to="/create/presale" className="btn-secondary">Launch Presale</Link>
                  <Link to="/tools/airdrop" className="btn-secondary">Airdrop</Link>
                  <Link to="/tools/token-locker" className="btn-secondary">Lock</Link>
                </div>
              </div>
            ))}
          </div>
        </motion.section>
      )}
    </motion.div>
  );
};

export default TokensPage;
