import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import {
  useAccount,
  useChainId,
  useReadContract,
  useWaitForTransactionReceipt,
  useWriteContract,
} from 'wagmi';
import { isAddress, parseUnits, type Address } from 'viem';
import { erc20Abi, PresaleFactory, getContractAddresses, getNativeTokenLabel } from '@/config';
import { useWhitelistedCreator } from '@/lib/hooks/useWhitelistedCreator';
import {
  calculatePresaleRate,
  calculatePresaleSaleAmount,
  formatPresaleAmount,
  formatPresaleRateLabel,
} from '@/lib/utils/presale';
import { readTokenPrefill } from '@/lib/utils/token-prefill';
import {
  Rocket,
  Loader2,
  CheckCircle2,
  AlertTriangle,
  ShieldAlert,
  ToggleLeft,
  ToggleRight,
  ExternalLink,
  Info,
} from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';

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

function safeParseUnits(value: string, decimals: number): bigint | null {
  if (!value.trim()) {
    return 0n;
  }

  try {
    return parseUnits(value, decimals);
  } catch {
    return null;
  }
}

const CreatePresalePage: React.FC = () => {
  const { address: userAddress, isConnected } = useAccount();
  const chainId = useChainId();
  const contracts = getContractAddresses(chainId);
  const nativeTokenSymbol = getNativeTokenLabel(chainId);
  const [searchParams] = useSearchParams();
  const tokenPrefill = readTokenPrefill(searchParams);

  const { isWhitelisted, isLoading: isCheckingWhitelist } = useWhitelistedCreator(userAddress);

  const [saleToken, setSaleToken] = useState(tokenPrefill.address ?? '');
  const [paymentToken, setPaymentToken] = useState('');
  const [useNativeToken, setUseNativeToken] = useState(true);
  const [hardCap, setHardCap] = useState('');
  const [softCap, setSoftCap] = useState('');
  const [minContribution, setMinContribution] = useState('');
  const [maxContribution, setMaxContribution] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [saleAmount, setSaleAmount] = useState('');
  const [requiresWhitelist, setRequiresWhitelist] = useState(false);

  useEffect(() => {
    setSaleToken(tokenPrefill.address ?? '');
  }, [tokenPrefill.address]);

  const selectedSaleTokenAddress = isAddress(saleToken) ? saleToken as Address : undefined;
  const selectedPaymentTokenAddress =
    !useNativeToken && isAddress(paymentToken) ? paymentToken as Address : undefined;

  const { data: saleTokenSymbolResult } = useReadContract({
    abi: erc20Abi,
    address: selectedSaleTokenAddress,
    functionName: 'symbol',
    query: {
      enabled: Boolean(selectedSaleTokenAddress),
    },
  });

  const { data: saleTokenNameResult } = useReadContract({
    abi: erc20Abi,
    address: selectedSaleTokenAddress,
    functionName: 'name',
    query: {
      enabled: Boolean(selectedSaleTokenAddress),
    },
  });

  const { data: saleTokenDecimalsResult } = useReadContract({
    abi: erc20Abi,
    address: selectedSaleTokenAddress,
    functionName: 'decimals',
    query: {
      enabled: Boolean(selectedSaleTokenAddress),
    },
  });

  const isPrefilledSaleToken = tokenPrefill.address?.toLowerCase() === saleToken.toLowerCase();
  const fallbackSaleTokenSymbol = isPrefilledSaleToken ? tokenPrefill.symbol : undefined;
  const fallbackSaleTokenName = isPrefilledSaleToken ? tokenPrefill.name : undefined;
  const fallbackSaleTokenDecimals = isPrefilledSaleToken ? tokenPrefill.decimals : undefined;

  const resolvedSaleTokenDecimals =
    saleTokenDecimalsResult !== undefined
      ? Number(saleTokenDecimalsResult as number | bigint)
      : fallbackSaleTokenDecimals;
  const saleTokenSymbol = (saleTokenSymbolResult as string | undefined) ?? fallbackSaleTokenSymbol ?? '';
  const saleTokenName = (saleTokenNameResult as string | undefined) ?? fallbackSaleTokenName ?? '';
  const saleTokenDecimals = resolvedSaleTokenDecimals ?? 18;
  const hasResolvedSaleTokenDecimals = resolvedSaleTokenDecimals !== undefined;

  const { data: paymentTokenSymbolResult } = useReadContract({
    abi: erc20Abi,
    address: selectedPaymentTokenAddress,
    functionName: 'symbol',
    query: {
      enabled: Boolean(selectedPaymentTokenAddress),
    },
  });

  const { data: paymentTokenNameResult } = useReadContract({
    abi: erc20Abi,
    address: selectedPaymentTokenAddress,
    functionName: 'name',
    query: {
      enabled: Boolean(selectedPaymentTokenAddress),
    },
  });

  const { data: paymentTokenDecimalsResult } = useReadContract({
    abi: erc20Abi,
    address: selectedPaymentTokenAddress,
    functionName: 'decimals',
    query: {
      enabled: Boolean(selectedPaymentTokenAddress),
    },
  });

  const resolvedPaymentTokenDecimals = useNativeToken
    ? 18
    : paymentTokenDecimalsResult !== undefined
    ? Number(paymentTokenDecimalsResult as number | bigint)
    : undefined;
  const paymentTokenSymbol = useNativeToken
    ? nativeTokenSymbol
    : (paymentTokenSymbolResult as string | undefined) ?? '';
  const paymentTokenName = useNativeToken
    ? 'Native Token'
    : (paymentTokenNameResult as string | undefined) ?? '';
  const paymentTokenDecimals = resolvedPaymentTokenDecimals ?? 18;
  const hasResolvedPaymentTokenDecimals = resolvedPaymentTokenDecimals !== undefined;
  const saleTokenLabel = saleTokenSymbol || 'sale token';
  const paymentTokenLabel = paymentTokenSymbol || 'payment token';

  const parsedSaleAmount = useMemo(
    () => safeParseUnits(saleAmount, saleTokenDecimals),
    [saleAmount, saleTokenDecimals]
  );
  const parsedHardCap = useMemo(
    () => safeParseUnits(hardCap, paymentTokenDecimals),
    [hardCap, paymentTokenDecimals]
  );
  const parsedSoftCap = useMemo(
    () => safeParseUnits(softCap, paymentTokenDecimals),
    [softCap, paymentTokenDecimals]
  );
  const parsedMinContribution = useMemo(
    () => safeParseUnits(minContribution, paymentTokenDecimals),
    [minContribution, paymentTokenDecimals]
  );
  const parsedMaxContribution = useMemo(
    () => safeParseUnits(maxContribution, paymentTokenDecimals),
    [maxContribution, paymentTokenDecimals]
  );

  const calculatedRate = useMemo(() => {
    if (parsedSaleAmount === null || parsedHardCap === null || parsedHardCap <= 0n) {
      return 0n;
    }

    return calculatePresaleRate(parsedSaleAmount, parsedHardCap);
  }, [parsedHardCap, parsedSaleAmount]);

  const calculatedSaleAmountAtHardCap = useMemo(() => {
    if (parsedHardCap === null) {
      return 0n;
    }

    return calculatePresaleSaleAmount(parsedHardCap, calculatedRate);
  }, [calculatedRate, parsedHardCap]);

  const capConfigurationInvalid = Boolean(
    parsedSoftCap !== null &&
      parsedHardCap !== null &&
      parsedHardCap > 0n &&
      parsedSoftCap > parsedHardCap
  );

  const contributionConfigurationInvalid = Boolean(
    parsedMinContribution !== null &&
      parsedMaxContribution !== null &&
      parsedMinContribution > 0n &&
      parsedMaxContribution > 0n &&
      parsedMinContribution > parsedMaxContribution
  );

  const ratePreview =
    calculatedRate > 0n
      ? formatPresaleRateLabel({
          rate: calculatedRate,
          saleTokenSymbol: saleTokenLabel,
          paymentTokenSymbol: paymentTokenLabel,
          saleTokenDecimals,
          paymentTokenDecimals,
        })
      : '';

  const rateRoundsSaleAmount = Boolean(
    parsedSaleAmount !== null &&
      parsedSaleAmount > 0n &&
      calculatedSaleAmountAtHardCap > 0n &&
      parsedSaleAmount !== calculatedSaleAmountAtHardCap
  );
  const hasInvalidNumericInput = Boolean(
    (saleAmount && parsedSaleAmount === null) ||
      (hardCap && parsedHardCap === null) ||
      (softCap && parsedSoftCap === null) ||
      (minContribution && parsedMinContribution === null) ||
      (maxContribution && parsedMaxContribution === null)
  );
  const hasInvalidSchedule = Boolean(
    startDate &&
      endDate &&
      (!Number.isFinite(new Date(startDate).getTime()) ||
        !Number.isFinite(new Date(endDate).getTime()) ||
        new Date(endDate).getTime() <= new Date(startDate).getTime())
  );

  const {
    data: hash,
    writeContract,
    isPending,
    error: writeError,
    reset,
  } = useWriteContract();

  const {
    isLoading: isConfirming,
    isSuccess,
    data: receipt,
  } = useWaitForTransactionReceipt({ hash });

  const createdPresaleAddress = useMemo(() => {
    if (!isSuccess || !receipt?.logs) return null;
    for (const log of receipt.logs) {
      if (log.topics.length >= 3) {
        const addr = `0x${log.topics[2]?.slice(26)}`;
        if (addr && addr.length === 42) return addr;
      }
    }
    return null;
  }, [isSuccess, receipt]);

  const handleSubmit = () => {
    if (!userAddress || !isConnected) return;
    if (!selectedSaleTokenAddress) return;
    if (!useNativeToken && !selectedPaymentTokenAddress) return;
    if (!saleAmount || !hardCap || !softCap || !minContribution || !maxContribution || !startDate || !endDate) return;
    if (!hasResolvedSaleTokenDecimals || !hasResolvedPaymentTokenDecimals) return;

    const startMs = new Date(startDate).getTime();
    const endMs = new Date(endDate).getTime();
    if (Number.isNaN(startMs) || Number.isNaN(endMs) || endMs <= startMs) return;

    if (
      parsedHardCap === null ||
      parsedSoftCap === null ||
      parsedMinContribution === null ||
      parsedMaxContribution === null ||
      parsedSaleAmount === null
    ) {
      return;
    }

    if (
      parsedHardCap <= 0n ||
      parsedSoftCap <= 0n ||
      parsedMinContribution <= 0n ||
      parsedMaxContribution <= 0n ||
      parsedSaleAmount <= 0n
    ) {
      return;
    }

    if (capConfigurationInvalid || contributionConfigurationInvalid || calculatedRate <= 0n) return;

    const startTimestamp = BigInt(Math.floor(startMs / 1000));
    const endTimestamp = BigInt(Math.floor(endMs / 1000));

    const paymentAddr = useNativeToken
      ? '0x0000000000000000000000000000000000000000' as Address
      : selectedPaymentTokenAddress as Address;

    writeContract({
      abi: PresaleFactory,
      address: contracts.presaleFactory,
      functionName: 'createPresale',
      args: [
        {
          saleToken: selectedSaleTokenAddress,
          paymentToken: paymentAddr,
          config: {
            startTime: startTimestamp,
            endTime: endTimestamp,
            rate: calculatedRate,
            softCap: parsedSoftCap,
            hardCap: parsedHardCap,
            minContribution: parsedMinContribution,
            maxContribution: parsedMaxContribution,
          },
          owner: userAddress as Address,
          requiresWhitelist,
        },
      ],
    });
  };

  // Not whitelisted
  if (isConnected && !isCheckingWhitelist && isWhitelisted === false) {
    return (
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-2xl mx-auto space-y-8"
      >
        <motion.section variants={itemVariants} className="space-y-2">
          <h1 className="font-display text-display-lg text-ink">Create Presale</h1>
        </motion.section>
        <motion.div
          variants={itemVariants}
          className="glass-card rounded-3xl p-8 text-center space-y-6"
        >
          <div className="w-16 h-16 rounded-full bg-amber-100 text-amber-600 mx-auto flex items-center justify-center">
            <ShieldAlert className="w-8 h-8" />
          </div>
          <div className="space-y-2">
            <h2 className="font-display text-display-md text-ink">Not Whitelisted</h2>
            <p className="text-body text-ink-muted max-w-md mx-auto">
              Your wallet is not whitelisted to create presales. Please contact the BeamPad team
              to request creator access.
            </p>
          </div>
          <Link to="/presales" className="btn-secondary inline-flex items-center gap-2">
            Browse Presales
          </Link>
        </motion.div>
      </motion.div>
    );
  }

  // Success
  if (isSuccess && createdPresaleAddress) {
    return (
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-2xl mx-auto space-y-8"
      >
        <motion.div
          variants={itemVariants}
          className="glass-card rounded-3xl p-8 text-center space-y-6"
        >
          <div className="w-16 h-16 rounded-full bg-green-100 text-green-600 mx-auto flex items-center justify-center">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <div className="space-y-2">
            <h2 className="font-display text-display-md text-ink">Presale Created!</h2>
            <p className="text-body text-ink-muted">
              Your presale has been deployed. Remember to deposit sale tokens before it starts.
            </p>
          </div>
          <div className="bg-ink/[0.03] rounded-2xl p-4">
            <p className="text-body-sm text-ink-muted mb-1">Presale Address</p>
            <code className="text-body font-mono text-ink break-all">
              {createdPresaleAddress}
            </code>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              to={`/presales/${createdPresaleAddress}`}
              className="btn-primary inline-flex items-center gap-2"
            >
              View Presale <ExternalLink className="w-4 h-4" />
            </Link>
            <button
              onClick={() => {
                reset();
              }}
              className="btn-secondary"
            >
              Create Another
            </button>
          </div>
        </motion.div>
      </motion.div>
    );
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="max-w-3xl mx-auto space-y-8"
    >
      {/* Header */}
      <motion.section variants={itemVariants} className="space-y-2">
        <h1 className="font-display text-display-lg text-ink">Create Presale</h1>
        <p className="text-body-lg text-ink-muted">
          Launch your token sale on BeamPad. Configure your presale parameters below.
        </p>
      </motion.section>

      {isCheckingWhitelist && (
        <motion.div variants={itemVariants} className="flex items-center gap-2 text-ink-muted">
          <Loader2 className="w-4 h-4 animate-spin" />
          <span className="text-body-sm">Checking whitelist status...</span>
        </motion.div>
      )}

      {/* Form */}
      <motion.section variants={itemVariants} className="glass-card rounded-3xl p-6 space-y-6">
        <h2 className="font-display text-display-sm text-ink">Token Configuration</h2>

        {saleToken && (
          <div className="rounded-2xl border border-border bg-canvas-alt/70 p-4 space-y-2">
            <p className="text-body-sm font-medium text-ink">Selected Token</p>
            <div className="flex flex-wrap items-center gap-2 text-body-sm">
              {saleTokenSymbol && (
                <span className="rounded-full bg-accent/10 px-3 py-1 text-xs font-semibold text-accent">
                  {saleTokenSymbol}
                </span>
              )}
              {saleTokenName && <span className="text-ink">{saleTokenName}</span>}
              {hasResolvedSaleTokenDecimals && (
                <span className="text-ink-muted">{saleTokenDecimals} decimals</span>
              )}
            </div>
            <code className="block break-all text-body-sm font-mono text-ink-muted">
              {saleToken}
            </code>
          </div>
        )}

        {!useNativeToken && paymentToken && (
          <div className="rounded-2xl border border-border bg-canvas-alt/70 p-4 space-y-2">
            <p className="text-body-sm font-medium text-ink">Payment Token</p>
            <div className="flex flex-wrap items-center gap-2 text-body-sm">
              {paymentTokenSymbol && (
                <span className="rounded-full bg-accent/10 px-3 py-1 text-xs font-semibold text-accent">
                  {paymentTokenSymbol}
                </span>
              )}
              {paymentTokenName && <span className="text-ink">{paymentTokenName}</span>}
              {hasResolvedPaymentTokenDecimals && (
                <span className="text-ink-muted">{paymentTokenDecimals} decimals</span>
              )}
            </div>
            <code className="block break-all text-body-sm font-mono text-ink-muted">
              {paymentToken}
            </code>
          </div>
        )}

        <div className="space-y-1.5">
          <label className="text-body-sm text-ink-muted font-medium">Sale Token Address</label>
          <input
            type="text"
            value={saleToken}
            onChange={(e) => setSaleToken(e.target.value)}
            placeholder="0x..."
            className="input-field w-full font-mono text-sm"
          />
        </div>

        {/* Native Token Toggle */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-body-sm text-ink-muted font-medium">Payment Token</label>
            <button
              onClick={() => setUseNativeToken(!useNativeToken)}
              className="inline-flex items-center gap-2 text-body-sm text-accent"
            >
              {useNativeToken ? (
                <ToggleRight className="w-5 h-5" />
              ) : (
                <ToggleLeft className="w-5 h-5" />
              )}
              {useNativeToken ? 'Native Token' : 'ERC20'}
            </button>
          </div>
          {!useNativeToken && (
            <input
              type="text"
              value={paymentToken}
              onChange={(e) => setPaymentToken(e.target.value)}
              placeholder="Payment token address (0x...)"
              className="input-field w-full font-mono text-sm"
            />
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-body-sm text-ink-muted font-medium">
              Hard Cap (max {paymentTokenLabel} to raise)
            </label>
            <input
              type="text"
              value={hardCap}
              onChange={(e) => setHardCap(e.target.value)}
              placeholder="e.g. 100"
              className="input-field w-full"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-body-sm text-ink-muted font-medium">
              Soft Cap (min {paymentTokenLabel} to raise)
            </label>
            <input
              type="text"
              value={softCap}
              onChange={(e) => setSoftCap(e.target.value)}
              placeholder="e.g. 50"
              className="input-field w-full"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-body-sm text-ink-muted font-medium">
              Min Contribution ({paymentTokenLabel})
            </label>
            <input
              type="text"
              value={minContribution}
              onChange={(e) => setMinContribution(e.target.value)}
              placeholder="e.g. 0.1"
              className="input-field w-full"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-body-sm text-ink-muted font-medium">
              Max Contribution ({paymentTokenLabel})
            </label>
            <input
              type="text"
              value={maxContribution}
              onChange={(e) => setMaxContribution(e.target.value)}
              placeholder="e.g. 10"
              className="input-field w-full"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-body-sm text-ink-muted font-medium">Start Date &amp; Time</label>
            <input
              type="datetime-local"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="input-field w-full"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-body-sm text-ink-muted font-medium">End Date &amp; Time</label>
            <input
              type="datetime-local"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="input-field w-full"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-body-sm text-ink-muted font-medium">
            Sale Amount ({saleTokenLabel} offered)
          </label>
          <input
            type="text"
            value={saleAmount}
            onChange={(e) => setSaleAmount(e.target.value)}
            placeholder="e.g. 1000000"
            className="input-field w-full"
          />
        </div>

        {ratePreview && (
          <div className="rounded-2xl border border-accent/20 bg-accent/5 p-4">
            <div className="flex items-start gap-2 text-sm">
              <Info className="w-4 h-4 flex-shrink-0 mt-0.5 text-accent" />
              <div className="space-y-1 text-ink">
                <p>
                  <strong>Rate:</strong> {ratePreview}
                </p>
                <p className="text-ink-muted">
                  Hard cap and soft cap are raise targets in {paymentTokenLabel}, not sale token amounts.
                </p>
                <p className="text-ink-muted">
                  At hard cap, buyers receive{' '}
                  <strong>
                    {formatPresaleAmount(calculatedSaleAmountAtHardCap, saleTokenDecimals)} {saleTokenLabel}
                  </strong>
                  .
                </p>
                {rateRoundsSaleAmount && (
                  <p className="text-amber-700">
                    The contract stores rate with two decimals of precision, so the exact sell amount at hard cap
                    resolves to {formatPresaleAmount(calculatedSaleAmountAtHardCap, saleTokenDecimals)}{' '}
                    {saleTokenLabel}.
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {capConfigurationInvalid && (
          <div className="flex items-start gap-2 p-3 rounded-xl bg-red-50 text-red-700 text-sm">
            <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <p>Soft cap cannot be greater than hard cap.</p>
          </div>
        )}

        {contributionConfigurationInvalid && (
          <div className="flex items-start gap-2 p-3 rounded-xl bg-red-50 text-red-700 text-sm">
            <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <p>Min contribution cannot be greater than max contribution.</p>
          </div>
        )}

        {hasInvalidNumericInput && (
          <div className="flex items-start gap-2 p-3 rounded-xl bg-red-50 text-red-700 text-sm">
            <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <p>One or more numeric fields are invalid for the selected token decimals.</p>
          </div>
        )}

        {hasInvalidSchedule && (
          <div className="flex items-start gap-2 p-3 rounded-xl bg-red-50 text-red-700 text-sm">
            <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <p>End time must be later than start time.</p>
          </div>
        )}

        {!useNativeToken && paymentToken && !selectedPaymentTokenAddress && (
          <div className="flex items-start gap-2 p-3 rounded-xl bg-red-50 text-red-700 text-sm">
            <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <p>Enter a valid ERC20 payment token address.</p>
          </div>
        )}

        {selectedSaleTokenAddress && !hasResolvedSaleTokenDecimals && (
          <div className="flex items-start gap-2 p-3 rounded-xl bg-amber-50 text-amber-700 text-sm">
            <Loader2 className="w-4 h-4 flex-shrink-0 mt-0.5 animate-spin" />
            <p>Loading sale token metadata...</p>
          </div>
        )}

        {!useNativeToken && selectedPaymentTokenAddress && !hasResolvedPaymentTokenDecimals && (
          <div className="flex items-start gap-2 p-3 rounded-xl bg-amber-50 text-amber-700 text-sm">
            <Loader2 className="w-4 h-4 flex-shrink-0 mt-0.5 animate-spin" />
            <p>Loading payment token metadata...</p>
          </div>
        )}

        {/* Whitelist Toggle */}
        <div className="flex items-center justify-between p-4 rounded-2xl bg-ink/[0.02]">
          <div>
            <p className="text-body font-medium text-ink">Require Whitelist</p>
            <p className="text-body-sm text-ink-muted">
              Only whitelisted addresses can participate.
            </p>
          </div>
          <button
            onClick={() => setRequiresWhitelist(!requiresWhitelist)}
            className="text-accent"
          >
            {requiresWhitelist ? (
              <ToggleRight className="w-8 h-8" />
            ) : (
              <ToggleLeft className="w-8 h-8 text-ink-muted" />
            )}
          </button>
        </div>

        {/* Error */}
        {writeError && (
          <div className="flex items-start gap-2 p-3 rounded-xl bg-red-50 text-red-700 text-sm">
            <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <p>{writeError.message?.slice(0, 200) || 'Transaction failed'}</p>
          </div>
        )}

        {/* Submit */}
        <button
          onClick={handleSubmit}
          disabled={
            isPending ||
            isConfirming ||
            !isConnected ||
            !saleToken ||
            !selectedSaleTokenAddress ||
            !hasResolvedSaleTokenDecimals ||
            !hardCap ||
            !softCap ||
            !minContribution ||
            !maxContribution ||
            !startDate ||
            !endDate ||
            !saleAmount ||
            (!useNativeToken && (!paymentToken || !selectedPaymentTokenAddress || !hasResolvedPaymentTokenDecimals)) ||
            capConfigurationInvalid ||
            contributionConfigurationInvalid ||
            hasInvalidNumericInput ||
            hasInvalidSchedule ||
            calculatedRate <= 0n
          }
          className="btn-primary w-full"
        >
          {isPending || isConfirming ? (
            <span className="inline-flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              {isConfirming ? 'Confirming...' : 'Creating Presale...'}
            </span>
          ) : !isConnected ? (
            'Connect Wallet First'
          ) : (
            <span className="inline-flex items-center gap-2">
              <Rocket className="w-4 h-4" />
              Create Presale
            </span>
          )}
        </button>
      </motion.section>
    </motion.div>
  );
};

export default CreatePresalePage;
