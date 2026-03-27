import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { useParams, Link } from 'react-router-dom';
import { useAccount, useChainId } from 'wagmi';
import { type Address, parseUnits } from 'viem';
import { toast } from 'sonner';
import {
  useLaunchpadPresale,
  useUserPresaleContribution,
} from '@/lib/hooks/useLaunchpadPresales';
import { useLaunchpadPresaleStore } from '@/lib/store/launchpad-presale-store';
import {
  usePresaleContribute,
  usePresaleClaimTokens,
  usePresaleClaimRefund,
  usePresaleOwnerActions,
} from '@/lib/hooks/usePresaleActions';
import { usePresaleApproval } from '@/lib/hooks/usePresaleApproval';
import { getExplorerUrl } from '@/config';
import {
  calculatePresaleSaleAmount,
  formatPresaleAmount,
  formatPresaleRateLabel,
} from '@/lib/utils/presale';
import { getFriendlyTxErrorMessage } from '@/lib/utils/tx-errors';
import {
  ArrowLeft,
  Clock,
  CheckCircle2,
  XCircle,
  Loader2,
  ExternalLink,
  Coins,
  Users,
  Calendar,
  TrendingUp,
  Wallet,
  AlertTriangle,
  Shield,
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

function getStatusBadge(status: string) {
  switch (status) {
    case 'live':
      return (
        <span className="inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold bg-green-100 text-green-700">
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          Live
        </span>
      );
    case 'upcoming':
      return (
        <span className="inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold bg-amber-100 text-amber-700">
          <Clock className="w-3.5 h-3.5" />
          Upcoming
        </span>
      );
    case 'ended':
    case 'finalized':
      return (
        <span className="inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold bg-slate-100 text-slate-600">
          <CheckCircle2 className="w-3.5 h-3.5" />
          Finalized
        </span>
      );
    case 'cancelled':
      return (
        <span className="inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold bg-red-100 text-red-600">
          <XCircle className="w-3.5 h-3.5" />
          Cancelled
        </span>
      );
    default:
      return null;
  }
}

const PresaleDetailPage: React.FC = () => {
  const { address: presaleAddr } = useParams<{ address: string }>();
  const presaleAddress = presaleAddr as Address | undefined;
  const { address: userAddress, isConnected } = useAccount();
  const chainId = useChainId();
  const explorerUrl = getExplorerUrl(chainId);

  const { presale, isLoading, refetch } = useLaunchpadPresale(presaleAddress);
  const getPresaleStatus = useLaunchpadPresaleStore((state) => state.getPresaleStatus);
  const { contribution, purchasedTokens } = useUserPresaleContribution(
    presaleAddress,
    userAddress
  );

  const [contributeAmount, setContributeAmount] = useState('');

  const paymentDecimals = presale?.paymentTokenDecimals ?? 18;
  const saleDecimals = presale?.saleTokenDecimals ?? 18;
  const paymentSymbol = presale?.paymentTokenSymbol || 'payment token';
  const saleTokenSymbol = presale?.saleTokenSymbol || 'sale token';
  const parsedAmount = useMemo(() => {
    try {
      return contributeAmount ? parseUnits(contributeAmount, paymentDecimals) : 0n;
    } catch {
      return 0n;
    }
  }, [contributeAmount, paymentDecimals]);

  const {
    needsApproval,
    approve,
    isApproving,
  } = usePresaleApproval({
    presaleAddress: presaleAddress || ('0x0' as Address),
    paymentToken: {
      address: (presale?.paymentToken || '0x0') as Address,
      decimals: paymentDecimals,
    },
    amount: parsedAmount,
    isPaymentETH: presale?.isPaymentETH ?? true,
  });

  const {
    contribute,
    isPending: isContributing,
    isConfirming: isContributeConfirming,
    isSuccess: isContributeSuccess,
    error: contributeError,
    reset: resetContribute,
    invalidateOnSuccess: invalidateContribute,
  } = usePresaleContribute();

  const {
    claimTokens,
    isPending: isClaiming,
    isConfirming: isClaimConfirming,
  } = usePresaleClaimTokens();

  const {
    claimRefund,
    isPending: isRefunding,
    isConfirming: isRefundConfirming,
  } = usePresaleClaimRefund();

  const {
    finalize,
    enableClaims,
    cancelPresale,
    withdrawProceeds,
    withdrawUnusedTokens,
    isPending: isOwnerActionPending,
    isConfirming: isOwnerActionConfirming,
    isSuccess: isOwnerActionSuccess,
    error: ownerActionError,
    reset: resetOwnerActions,
    invalidateOnSuccess: invalidateOwnerAction,
  } = usePresaleOwnerActions();

  const [activeOwnerAction, setActiveOwnerAction] = useState<
    'finalize' | 'enableClaims' | 'cancel' | 'withdrawProceeds' | 'withdrawUnusedTokens' | null
  >(null);
  const [lockedLifecycleActions, setLockedLifecycleActions] = useState({
    finalize: false,
    enableClaims: false,
    cancel: false,
  });

  useEffect(() => {
    if (isContributeSuccess && presaleAddress) {
      invalidateContribute(presaleAddress);
      setContributeAmount('');
      refetch();
    }
  }, [isContributeSuccess, presaleAddress, invalidateContribute, refetch]);

  useEffect(() => {
    if (!ownerActionError) return;
    toast.error(getFriendlyTxErrorMessage(ownerActionError, 'Owner action'));
    setActiveOwnerAction(null);
    resetOwnerActions();
  }, [ownerActionError, resetOwnerActions]);

  useEffect(() => {
    if (!isOwnerActionSuccess || !activeOwnerAction || !presaleAddress) return;

    const messages: Record<string, string> = {
      finalize: 'Sale finalized.',
      enableClaims: 'Claims enabled.',
      cancel: 'Sale cancelled.',
      withdrawProceeds: 'Proceeds withdrawn.',
      withdrawUnusedTokens: 'Unused sale tokens withdrawn.',
    };
    toast.success(messages[activeOwnerAction] || 'Action complete.');

    if (activeOwnerAction === 'finalize' || activeOwnerAction === 'enableClaims' || activeOwnerAction === 'cancel') {
      setLockedLifecycleActions((prev) => ({ ...prev, [activeOwnerAction]: true }));
    }

    invalidateOwnerAction(presaleAddress);
    refetch();
    setActiveOwnerAction(null);
    resetOwnerActions();
  }, [
    activeOwnerAction,
    invalidateOwnerAction,
    isOwnerActionSuccess,
    presaleAddress,
    refetch,
    resetOwnerActions,
  ]);

  const isOwner =
    isConnected &&
    userAddress &&
    presale?.owner &&
    userAddress.toLowerCase() === presale.owner.toLowerCase();

  const presaleStatus = presale ? getPresaleStatus(presale) : 'upcoming';
  const progress = useMemo(() => {
    if (!presale?.hardCap || presale.hardCap === 0n) return 0;
    return Number((presale.totalRaised * 100n) / presale.hardCap);
  }, [presale?.hardCap, presale?.totalRaised]);

  const saleAmount = useMemo(() => {
    if (!presale) return 0n;
    return calculatePresaleSaleAmount(presale.hardCap ?? 0n, presale.rate ?? 0n);
  }, [presale]);

  const rateLabel = useMemo(() => {
    if (!presale?.rate) return '--';
    return formatPresaleRateLabel({
      rate: presale.rate,
      saleTokenSymbol,
      paymentTokenSymbol: paymentSymbol,
      saleTokenDecimals: saleDecimals,
      paymentTokenDecimals: paymentDecimals,
    });
  }, [paymentDecimals, paymentSymbol, presale?.rate, saleDecimals, saleTokenSymbol]);

  const hasInvalidCapConfiguration = Boolean(
    presale?.hardCap &&
      presale.hardCap > 0n &&
      presale.softCap &&
      presale.softCap > presale.hardCap
  );
  const ownerActionBusy = isOwnerActionPending || isOwnerActionConfirming;
  const saleFinalized = Boolean(presale?.successfulFinalization);
  const claimsLive = Boolean(presale?.claimEnabled);
  const saleCancelled = Boolean(presale?.refundsEnabled);
  const canFinalize = !saleFinalized && !claimsLive && !saleCancelled && !lockedLifecycleActions.finalize;
  const canEnableClaims =
    saleFinalized && !claimsLive && !saleCancelled && !lockedLifecycleActions.enableClaims;
  const canCancel = !saleFinalized && !claimsLive && !saleCancelled && !lockedLifecycleActions.cancel;
  const canWithdrawProceeds = claimsLive;
  const canWithdrawUnusedTokens = Boolean(
    (presale?.totalTokensDeposited ?? 0n) > (presale?.committedTokens ?? 0n)
  );

  const handleContribute = () => {
    if (!presaleAddress || parsedAmount === 0n) return;
    contribute({
      presaleAddress,
      amount: parsedAmount,
      isPaymentETH: presale?.isPaymentETH ?? true,
    });
  };

  const runOwnerAction = (
    action: 'finalize' | 'enableClaims' | 'cancel' | 'withdrawProceeds' | 'withdrawUnusedTokens',
    callback: (address: Address) => void
  ) => {
    if (!presaleAddress || ownerActionBusy) return;
    setActiveOwnerAction(action);
    callback(presaleAddress);
  };

  if (isLoading || !presale) {
    return (
      <div className="flex flex-col items-center justify-center py-32 space-y-4">
        <Loader2 className="w-8 h-8 text-accent animate-spin" />
        <p className="text-body text-ink-muted">Loading presale details...</p>
      </div>
    );
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8"
    >
      {/* Back Link */}
      <motion.div variants={itemVariants}>
        <Link
          to="/presales"
          className="inline-flex items-center gap-2 text-body text-ink-muted hover:text-ink transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Presales
        </Link>
      </motion.div>

      {/* Header */}
      <motion.section variants={itemVariants} className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="flex-1 space-y-1">
            <h1 className="font-display text-display-lg text-ink">
              {presale.saleTokenName || presale.saleTokenSymbol || 'Token Sale'}
            </h1>
            <p className="text-body text-ink-muted">
              {presale.saleTokenSymbol || 'Unknown'} Presale
            </p>
          </div>
          <div className="flex items-center gap-2">
            {isOwner && (
              <Link
                to={`/presales/manage/${presaleAddress}`}
                className="btn-secondary text-sm"
              >
                Manage Presale
              </Link>
            )}
            {getStatusBadge(presaleStatus)}
          </div>
        </div>
        {presale.requiresWhitelist && (
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-amber-50 text-amber-700 text-sm">
            <Shield className="w-4 h-4" />
            Whitelisted participants only
          </div>
        )}
      </motion.section>

      {hasInvalidCapConfiguration && (
        <motion.div
          variants={itemVariants}
          className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
        >
          This presale is misconfigured on-chain: the soft cap is greater than the hard cap, so it
          cannot finalize successfully without an admin-side config update.
        </motion.div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Progress Section */}
          <motion.div variants={itemVariants} className="glass-card rounded-3xl p-6 space-y-4">
            <h2 className="font-display text-display-sm text-ink">Sale Progress</h2>
            <div className="space-y-3">
              <div className="flex justify-between text-body">
                <span className="text-ink-muted">Raised</span>
                <span className="text-ink font-medium">
                  {formatPresaleAmount(presale.totalRaised ?? 0n, paymentDecimals)}{' '}
                  {paymentSymbol} /{' '}
                  {formatPresaleAmount(presale.hardCap ?? 0n, paymentDecimals)}{' '}
                  {paymentSymbol}
                </span>
              </div>
              <div className="w-full h-4 bg-ink/5 rounded-full overflow-hidden">
                <div
                  className="h-full bg-accent rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(progress, 100)}%` }}
                />
              </div>
              <div className="flex justify-between text-body-sm text-ink-muted">
                <span>{Math.min(progress, 100)}% filled</span>
                <span>
                  Soft Cap:{' '}
                  {formatPresaleAmount(presale.softCap ?? 0n, paymentDecimals)}{' '}
                  {paymentSymbol}
                </span>
              </div>
            </div>
          </motion.div>

          {/* Info Grid */}
          <motion.div variants={itemVariants} className="glass-card rounded-3xl p-6 space-y-4">
            <h2 className="font-display text-display-sm text-ink">Sale Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                {
                  label: 'Sale Token',
                  value: presale.saleTokenSymbol || 'Unknown',
                  icon: Coins,
                  sub: presale.saleToken ? `${presale.saleToken.slice(0, 6)}...${presale.saleToken.slice(-4)}` : '',
                },
                {
                  label: 'Payment Token',
                  value: presale.isPaymentETH
                    ? 'Native Token'
                    : paymentSymbol || 'Unknown',
                  icon: Coins,
                  sub: presale.isPaymentETH
                    ? paymentSymbol
                    : presale.paymentToken
                    ? `${presale.paymentToken.slice(0, 6)}...${presale.paymentToken.slice(-4)}`
                    : '',
                },
                {
                  label: 'Exchange Rate',
                  value: rateLabel,
                  icon: TrendingUp,
                },
                {
                  label: 'Tokens For Sale',
                  value: `${formatPresaleAmount(saleAmount, saleDecimals)} ${saleTokenSymbol}`,
                  icon: Coins,
                },
                {
                  label: 'Hard Cap',
                  value: `${formatPresaleAmount(presale.hardCap ?? 0n, paymentDecimals)} ${paymentSymbol}`,
                  icon: Coins,
                },
                {
                  label: 'Soft Cap',
                  value: `${formatPresaleAmount(presale.softCap ?? 0n, paymentDecimals)} ${paymentSymbol}`,
                  icon: Coins,
                },
                {
                  label: 'Min Contribution',
                  value: `${formatPresaleAmount(presale.minContribution ?? 0n, paymentDecimals)} ${paymentSymbol}`,
                  icon: Wallet,
                },
                {
                  label: 'Max Contribution',
                  value: `${formatPresaleAmount(presale.maxContribution ?? 0n, paymentDecimals)} ${paymentSymbol}`,
                  icon: Wallet,
                },
                {
                  label: 'Start Time',
                  value: presale.startTime
                    ? new Date(Number(presale.startTime) * 1000).toLocaleString()
                    : '--',
                  icon: Calendar,
                },
                {
                  label: 'End Time',
                  value: presale.endTime
                    ? new Date(Number(presale.endTime) * 1000).toLocaleString()
                    : '--',
                  icon: Calendar,
                },
              ].map((item, idx) => (
                <div key={idx} className="flex items-start gap-3 p-3 rounded-2xl bg-ink/[0.02]">
                  <div className="w-8 h-8 rounded-xl bg-accent-muted text-accent flex items-center justify-center flex-shrink-0">
                    <item.icon className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-body-sm text-ink-muted">{item.label}</p>
                    <p className="text-body font-medium text-ink truncate">{item.value}</p>
                    {item.sub && (
                      <p className="text-body-sm text-ink-faint truncate">{item.sub}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Explorer Link */}
            {presaleAddress && (
              <a
                href={`${explorerUrl}/address/${presaleAddress}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-body-sm text-accent hover:underline"
              >
                View on Explorer <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
          </motion.div>

          {/* Owner Section */}
          {isOwner && (
            <motion.div
              variants={itemVariants}
              className="glass-card rounded-3xl p-6 space-y-5"
            >
              <h2 className="font-display text-display-sm text-ink">Sale Actions</h2>

              <div className="grid gap-3 md:grid-cols-2">
                <button
                  onClick={() => runOwnerAction('finalize', finalize)}
                  disabled={ownerActionBusy || !canFinalize}
                  className="btn-primary w-full disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {canFinalize ? 'Finalize Sale' : saleCancelled ? 'Sale Cancelled' : 'Finalized'}
                </button>

                <button
                  onClick={() => runOwnerAction('enableClaims', enableClaims)}
                  disabled={ownerActionBusy || !canEnableClaims}
                  className="btn-secondary w-full disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {claimsLive ? 'Claims Enabled' : 'Enable Claims'}
                </button>

                <button
                  onClick={() => runOwnerAction('cancel', cancelPresale)}
                  disabled={ownerActionBusy || !canCancel}
                  className="btn-secondary w-full text-status-error border-status-error hover:bg-status-error/10 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {saleCancelled ? 'Sale Cancelled' : 'Cancel Sale'}
                </button>

                <button
                  onClick={() => runOwnerAction('withdrawProceeds', withdrawProceeds)}
                  disabled={ownerActionBusy || !canWithdrawProceeds}
                  className="btn-secondary w-full disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  Withdraw Proceeds
                </button>

                <button
                  onClick={() => runOwnerAction('withdrawUnusedTokens', withdrawUnusedTokens)}
                  disabled={ownerActionBusy || !canWithdrawUnusedTokens}
                  className="btn-secondary w-full md:col-span-2 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  Withdraw Unused Sale Tokens
                </button>
              </div>
            </motion.div>
          )}
        </div>

        {/* Right Column: Participation */}
        <div className="space-y-6">
          {/* User Contribution Info */}
          {isConnected && (
            <motion.div variants={itemVariants} className="glass-card rounded-3xl p-6 space-y-3">
              <h3 className="font-display text-display-sm text-ink">Your Participation</h3>
              <div className="space-y-2">
                <div className="flex justify-between text-body-sm">
                  <span className="text-ink-muted">Contributed</span>
                  <span className="text-ink font-medium">
                    {formatPresaleAmount(contribution, paymentDecimals)}{' '}
                    {paymentSymbol}
                  </span>
                </div>
                <div className="flex justify-between text-body-sm">
                  <span className="text-ink-muted">Tokens to Receive</span>
                  <span className="text-ink font-medium">
                    {formatPresaleAmount(purchasedTokens, presale.saleTokenDecimals ?? 18)}{' '}
                    {saleTokenSymbol}
                  </span>
                </div>
              </div>
            </motion.div>
          )}

          {/* Contribute Form */}
          {presaleStatus === 'live' && isConnected && (
            <motion.div variants={itemVariants} className="glass-card rounded-3xl p-6 space-y-4">
              <h3 className="font-display text-display-sm text-ink">Contribute</h3>
              <div className="space-y-3">
                <div>
                  <label className="text-body-sm text-ink-muted font-medium mb-1 block">
                    Amount ({presale.paymentTokenSymbol || 'Token'})
                  </label>
                  <input
                    type="text"
                    value={contributeAmount}
                    onChange={(e) => {
                      resetContribute();
                      setContributeAmount(e.target.value);
                    }}
                    placeholder="0.0"
                    className="input-field w-full"
                  />
                </div>
                <div className="text-body-sm text-ink-muted space-y-1">
                  <p>
                    Min: {formatPresaleAmount(presale.minContribution ?? 0n, paymentDecimals)}{' '}
                    {paymentSymbol}
                  </p>
                  <p>
                    Max: {formatPresaleAmount(presale.maxContribution ?? 0n, paymentDecimals)}{' '}
                    {paymentSymbol}
                  </p>
                </div>

                {contributeError && (
                  <div className="flex items-start gap-2 p-3 rounded-xl bg-red-50 text-red-700 text-sm">
                    <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                    <p>{contributeError.message?.slice(0, 200) || 'Transaction failed'}</p>
                  </div>
                )}

                {needsApproval && !presale.isPaymentETH ? (
                  <button
                    onClick={approve}
                    disabled={isApproving}
                    className="btn-primary w-full"
                  >
                    {isApproving ? (
                      <span className="inline-flex items-center gap-2">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Approving...
                      </span>
                    ) : (
                      'Approve Token'
                    )}
                  </button>
                ) : (
                  <button
                    onClick={handleContribute}
                    disabled={
                      isContributing ||
                      isContributeConfirming ||
                      parsedAmount === 0n
                    }
                    className="btn-primary w-full"
                  >
                    {isContributing || isContributeConfirming ? (
                      <span className="inline-flex items-center gap-2">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        {isContributeConfirming ? 'Confirming...' : 'Contributing...'}
                      </span>
                    ) : (
                      'Contribute'
                    )}
                  </button>
                )}
              </div>
            </motion.div>
          )}

          {/* Claim / Refund */}
          {isConnected && contribution > 0n && (
            <motion.div variants={itemVariants} className="glass-card rounded-3xl p-6 space-y-4">
              <h3 className="font-display text-display-sm text-ink">Actions</h3>
              <div className="space-y-3">
                {presale.claimEnabled && (
                  <button
                    onClick={() => presaleAddress && claimTokens(presaleAddress)}
                    disabled={isClaiming || isClaimConfirming}
                    className="btn-primary w-full"
                  >
                    {isClaiming || isClaimConfirming ? (
                      <span className="inline-flex items-center gap-2">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Claiming...
                      </span>
                    ) : (
                      'Claim Tokens'
                    )}
                  </button>
                )}
                {presale.refundsEnabled && (
                  <button
                    onClick={() => presaleAddress && claimRefund(presaleAddress)}
                    disabled={isRefunding || isRefundConfirming}
                    className="btn-secondary w-full"
                  >
                    {isRefunding || isRefundConfirming ? (
                      <span className="inline-flex items-center gap-2">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Processing...
                      </span>
                    ) : (
                      'Claim Refund'
                    )}
                  </button>
                )}
              </div>
            </motion.div>
          )}

          {/* Connect Wallet CTA */}
          {!isConnected && (
            <motion.div
              variants={itemVariants}
              className="glass-card rounded-3xl p-6 text-center space-y-3"
            >
              <Users className="w-8 h-8 text-accent mx-auto" />
              <p className="text-body text-ink-muted">
                Connect your wallet to participate in this presale.
              </p>
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default PresaleDetailPage;
