import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useParams, Link } from 'react-router-dom';
import {
  useAccount,
  useChainId,
  useWriteContract,
  useWaitForTransactionReceipt,
} from 'wagmi';
import { type Address, formatUnits, parseUnits } from 'viem';
import { useLaunchpadPresale } from '@/lib/hooks/useLaunchpadPresales';
import { usePresaleOwnerActions } from '@/lib/hooks/usePresaleActions';
import { PresaleContract, erc20Abi, getExplorerUrl } from '@/config';
import {
  ArrowLeft,
  Loader2,
  CheckCircle2,
  AlertTriangle,
  Shield,
  Upload,
  Ban,
  Coins,
  Users,
  ExternalLink,
  Settings,
  ShieldAlert,
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

function getStatusLabel(status: string) {
  switch (status) {
    case 'live':
      return { text: 'Live', color: 'bg-green-100 text-green-700' };
    case 'upcoming':
      return { text: 'Upcoming', color: 'bg-amber-100 text-amber-700' };
    case 'ended':
    case 'finalized':
      return { text: 'Finalized', color: 'bg-slate-100 text-slate-600' };
    case 'cancelled':
      return { text: 'Cancelled', color: 'bg-red-100 text-red-600' };
    default:
      return { text: status, color: 'bg-slate-100 text-slate-600' };
  }
}

const ManagePresalePage: React.FC = () => {
  const { address: presaleAddr } = useParams<{ address: string }>();
  const presaleAddress = presaleAddr as Address | undefined;
  const { address: userAddress, isConnected } = useAccount();
  const chainId = useChainId();
  const explorerUrl = getExplorerUrl(chainId);

  const { presale, isLoading, refetch } = useLaunchpadPresale(presaleAddress);

  const {
    depositSaleTokens,
    finalize,
    cancelPresale,
    withdrawProceeds,
    withdrawUnusedTokens,
    isPending: isOwnerPending,
    isConfirming: isOwnerConfirming,
    isSuccess: isOwnerSuccess,
    error: ownerError,
  } = usePresaleOwnerActions();

  // Whitelist management
  const {
    data: whitelistHash,
    writeContract: whitelistWrite,
    isPending: isWhitelistPending,
    error: whitelistError,
  } = useWriteContract();

  const {
    isLoading: isWhitelistConfirming,
    isSuccess: isWhitelistSuccess,
  } = useWaitForTransactionReceipt({ hash: whitelistHash });

  // Deposit approval
  const {
    data: approveHash,
    writeContract: approveWrite,
    isPending: isApprovePending,
  } = useWriteContract();

  const {
    isLoading: isApproveConfirming,
    isSuccess: isApproveSuccess,
  } = useWaitForTransactionReceipt({ hash: approveHash });

  const [depositAmount, setDepositAmount] = useState('');
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [whitelistAddresses, setWhitelistAddresses] = useState('');
  const [whitelistAction, setWhitelistAction] = useState<'add' | 'remove'>('add');
  const [lastAction, setLastAction] = useState('');

  useEffect(() => {
    if (isOwnerSuccess) {
      refetch();
      setLastAction('Action completed successfully.');
      setTimeout(() => setLastAction(''), 5000);
    }
  }, [isOwnerSuccess, refetch]);

  useEffect(() => {
    if (isWhitelistSuccess) {
      setWhitelistAddresses('');
      setLastAction('Whitelist updated successfully.');
      setTimeout(() => setLastAction(''), 5000);
    }
  }, [isWhitelistSuccess]);

  const isOwner =
    isConnected &&
    userAddress &&
    presale?.owner &&
    userAddress.toLowerCase() === presale.owner.toLowerCase();

  const paymentDecimals = presale?.paymentTokenDecimals ?? 18;
  const saleDecimals = presale?.saleTokenDecimals ?? 18;

  const handleApproveDeposit = () => {
    if (!presale?.saleToken || !depositAmount || !presaleAddress) return;
    const parsed = parseUnits(depositAmount, saleDecimals);
    approveWrite({
      abi: erc20Abi,
      address: presale.saleToken,
      functionName: 'approve',
      args: [presaleAddress, parsed],
    });
  };

  const handleDeposit = () => {
    if (!presaleAddress || !depositAmount) return;
    const parsed = parseUnits(depositAmount, saleDecimals);
    depositSaleTokens(presaleAddress, parsed);
  };

  const handleFinalize = () => {
    if (!presaleAddress) return;
    finalize(presaleAddress);
  };

  const handleCancel = () => {
    if (!presaleAddress) return;
    cancelPresale(presaleAddress);
  };

  const handleWithdrawProceeds = () => {
    if (!presaleAddress) return;
    const amount = withdrawAmount
      ? parseUnits(withdrawAmount, paymentDecimals)
      : 0n;
    withdrawProceeds(presaleAddress, amount);
  };

  const handleWithdrawUnused = () => {
    if (!presaleAddress) return;
    withdrawUnusedTokens(presaleAddress, 0n);
  };

  const handleWhitelist = () => {
    if (!presaleAddress || !whitelistAddresses.trim()) return;

    const addresses = whitelistAddresses
      .split('\n')
      .map((line) => line.trim())
      .filter((line) => line.startsWith('0x') && line.length === 42) as Address[];

    if (addresses.length === 0) return;

    const functionName = whitelistAction === 'add' ? 'addToWhitelist' : 'removeFromWhitelist';

    whitelistWrite({
      abi: PresaleContract,
      address: presaleAddress,
      functionName,
      args: [addresses],
    });
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-32 space-y-4">
        <Loader2 className="w-8 h-8 text-accent animate-spin" />
        <p className="text-body text-ink-muted">Loading presale data...</p>
      </div>
    );
  }

  if (!presale) {
    return (
      <div className="max-w-2xl mx-auto glass-card rounded-3xl p-8 text-center space-y-4">
        <AlertTriangle className="w-8 h-8 text-amber-500 mx-auto" />
        <h2 className="font-display text-display-md text-ink">Presale Not Found</h2>
        <p className="text-body text-ink-muted">
          Could not find a presale at the specified address.
        </p>
        <Link to="/presales" className="btn-primary inline-block">
          Back to Presales
        </Link>
      </div>
    );
  }

  if (!isOwner) {
    return (
      <div className="max-w-2xl mx-auto glass-card rounded-3xl p-8 text-center space-y-4">
        <ShieldAlert className="w-8 h-8 text-amber-500 mx-auto" />
        <h2 className="font-display text-display-md text-ink">Access Denied</h2>
        <p className="text-body text-ink-muted">
          Only the presale owner can access management controls.
        </p>
        <Link
          to={`/presales/${presaleAddress}`}
          className="btn-primary inline-flex items-center gap-2"
        >
          View Presale
        </Link>
      </div>
    );
  }

  const statusInfo = getStatusLabel(presale.status);

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="max-w-4xl mx-auto space-y-8"
    >
      {/* Back Link */}
      <motion.div variants={itemVariants}>
        <Link
          to={`/presales/${presaleAddress}`}
          className="inline-flex items-center gap-2 text-body text-ink-muted hover:text-ink transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Presale
        </Link>
      </motion.div>

      {/* Header */}
      <motion.section variants={itemVariants} className="space-y-2">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-accent-muted text-accent flex items-center justify-center">
              <Settings className="w-5 h-5" />
            </div>
            <h1 className="font-display text-display-lg text-ink">
              Manage Presale
            </h1>
          </div>
          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusInfo.color}`}>
            {statusInfo.text}
          </span>
        </div>
        <p className="text-body text-ink-muted">
          {presale.saleTokenName || presale.saleTokenSymbol || 'Token'} Presale &mdash;{' '}
          <a
            href={`${explorerUrl}/address/${presaleAddress}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-accent hover:underline inline-flex items-center gap-1"
          >
            {presaleAddress?.slice(0, 8)}...{presaleAddress?.slice(-6)}
            <ExternalLink className="w-3 h-3" />
          </a>
        </p>
      </motion.section>

      {/* Status & Progress */}
      <motion.section variants={itemVariants} className="glass-card rounded-3xl p-6 space-y-4">
        <h2 className="font-display text-display-sm text-ink flex items-center gap-2">
          <Coins className="w-5 h-5 text-accent" />
          Sale Status
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="stat-card">
            <p className="text-body-sm text-ink-muted">Total Raised</p>
            <p className="font-display text-display-sm text-ink">
              {formatUnits(presale.totalRaised ?? 0n, paymentDecimals)}{' '}
              {presale.paymentTokenSymbol || ''}
            </p>
          </div>
          <div className="stat-card">
            <p className="text-body-sm text-ink-muted">Hard Cap</p>
            <p className="font-display text-display-sm text-ink">
              {formatUnits(presale.hardCap ?? 0n, paymentDecimals)}{' '}
              {presale.paymentTokenSymbol || ''}
            </p>
          </div>
          <div className="stat-card">
            <p className="text-body-sm text-ink-muted">Tokens Deposited</p>
            <p className="font-display text-display-sm text-ink">
              {formatUnits(presale.totalTokensDeposited ?? 0n, saleDecimals)}{' '}
              {presale.saleTokenSymbol || ''}
            </p>
          </div>
        </div>
        <div className="space-y-2">
          <div className="flex justify-between text-body-sm">
            <span className="text-ink-muted">Progress</span>
            <span className="text-ink font-medium">{presale.progress}%</span>
          </div>
          <div className="w-full h-3 bg-ink/5 rounded-full overflow-hidden">
            <div
              className="h-full bg-accent rounded-full transition-all duration-500"
              style={{ width: `${presale.progress}%` }}
            />
          </div>
        </div>
      </motion.section>

      {/* Deposit Sale Tokens */}
      <motion.section variants={itemVariants} className="glass-card rounded-3xl p-6 space-y-4">
        <h2 className="font-display text-display-sm text-ink flex items-center gap-2">
          <Upload className="w-5 h-5 text-accent" />
          Deposit Sale Tokens
        </h2>
        <p className="text-body-sm text-ink-muted">
          Deposit {presale.saleTokenSymbol || 'sale'} tokens into the presale contract so
          participants can claim after finalization.
        </p>
        <div className="flex gap-3">
          <input
            type="text"
            value={depositAmount}
            onChange={(e) => setDepositAmount(e.target.value)}
            placeholder="Amount to deposit"
            className="input-field flex-1"
          />
          <button
            onClick={handleApproveDeposit}
            disabled={isApprovePending || isApproveConfirming || !depositAmount}
            className="btn-secondary"
          >
            {isApprovePending || isApproveConfirming ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : isApproveSuccess ? (
              <CheckCircle2 className="w-4 h-4 text-green-600" />
            ) : (
              'Approve'
            )}
          </button>
          <button
            onClick={handleDeposit}
            disabled={isOwnerPending || isOwnerConfirming || !depositAmount}
            className="btn-primary"
          >
            {isOwnerPending || isOwnerConfirming ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              'Deposit'
            )}
          </button>
        </div>
      </motion.section>

      {/* Finalize / Cancel / Withdraw */}
      <motion.section variants={itemVariants} className="glass-card rounded-3xl p-6 space-y-4">
        <h2 className="font-display text-display-sm text-ink flex items-center gap-2">
          <Shield className="w-5 h-5 text-accent" />
          Presale Actions
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button
            onClick={handleFinalize}
            disabled={isOwnerPending || isOwnerConfirming}
            className="btn-primary h-auto py-4 flex flex-col items-center gap-1"
          >
            <CheckCircle2 className="w-5 h-5" />
            <span className="font-medium">Finalize Presale</span>
            <span className="text-xs opacity-70">Enable claims for participants</span>
          </button>
          <button
            onClick={handleCancel}
            disabled={isOwnerPending || isOwnerConfirming}
            className="btn-secondary h-auto py-4 flex flex-col items-center gap-1 border-red-200 text-red-600 hover:bg-red-50"
          >
            <Ban className="w-5 h-5" />
            <span className="font-medium">Cancel Presale</span>
            <span className="text-xs opacity-70">Enable refunds for participants</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-ink/5">
          <div className="space-y-3">
            <p className="text-body-sm font-medium text-ink">Withdraw Proceeds</p>
            <div className="flex gap-2">
              <input
                type="text"
                value={withdrawAmount}
                onChange={(e) => setWithdrawAmount(e.target.value)}
                placeholder="Amount (0 = all)"
                className="input-field flex-1"
              />
              <button
                onClick={handleWithdrawProceeds}
                disabled={isOwnerPending || isOwnerConfirming}
                className="btn-secondary"
              >
                Withdraw
              </button>
            </div>
          </div>
          <div className="space-y-3">
            <p className="text-body-sm font-medium text-ink">Withdraw Unused Tokens</p>
            <button
              onClick={handleWithdrawUnused}
              disabled={isOwnerPending || isOwnerConfirming}
              className="btn-secondary w-full"
            >
              Withdraw Unused Sale Tokens
            </button>
          </div>
        </div>
      </motion.section>

      {/* Whitelist Management */}
      {presale.requiresWhitelist && (
        <motion.section variants={itemVariants} className="glass-card rounded-3xl p-6 space-y-4">
          <h2 className="font-display text-display-sm text-ink flex items-center gap-2">
            <Users className="w-5 h-5 text-accent" />
            Whitelist Management
          </h2>

          <div className="flex gap-2">
            <button
              onClick={() => setWhitelistAction('add')}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                whitelistAction === 'add'
                  ? 'bg-accent text-white'
                  : 'bg-ink/5 text-ink-muted hover:bg-ink/10'
              }`}
            >
              Add to Whitelist
            </button>
            <button
              onClick={() => setWhitelistAction('remove')}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                whitelistAction === 'remove'
                  ? 'bg-red-500 text-white'
                  : 'bg-ink/5 text-ink-muted hover:bg-ink/10'
              }`}
            >
              Remove from Whitelist
            </button>
          </div>

          <textarea
            value={whitelistAddresses}
            onChange={(e) => setWhitelistAddresses(e.target.value)}
            placeholder="Enter addresses, one per line:&#10;0x1234...&#10;0x5678..."
            rows={5}
            className="input-field w-full font-mono text-sm resize-y"
          />

          {whitelistError && (
            <div className="flex items-start gap-2 p-3 rounded-xl bg-red-50 text-red-700 text-sm">
              <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <p>{whitelistError.message?.slice(0, 200) || 'Transaction failed'}</p>
            </div>
          )}

          <button
            onClick={handleWhitelist}
            disabled={isWhitelistPending || isWhitelistConfirming || !whitelistAddresses.trim()}
            className={`${
              whitelistAction === 'add' ? 'btn-primary' : 'btn-secondary text-red-600 border-red-200 hover:bg-red-50'
            } w-full`}
          >
            {isWhitelistPending || isWhitelistConfirming ? (
              <span className="inline-flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                Processing...
              </span>
            ) : whitelistAction === 'add' ? (
              'Add Addresses'
            ) : (
              'Remove Addresses'
            )}
          </button>
        </motion.section>
      )}

      {/* Success / Error Messages */}
      {lastAction && (
        <motion.div
          variants={itemVariants}
          className="flex items-center gap-2 p-3 rounded-xl bg-green-50 text-green-700 text-sm"
        >
          <CheckCircle2 className="w-4 h-4" />
          <span>{lastAction}</span>
        </motion.div>
      )}

      {ownerError && (
        <motion.div
          variants={itemVariants}
          className="flex items-start gap-2 p-3 rounded-xl bg-red-50 text-red-700 text-sm"
        >
          <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
          <p>{ownerError.message?.slice(0, 200) || 'Action failed'}</p>
        </motion.div>
      )}
    </motion.div>
  );
};

export default ManagePresalePage;
