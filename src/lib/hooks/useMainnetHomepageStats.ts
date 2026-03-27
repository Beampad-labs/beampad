import { useMemo } from 'react';
import { formatUnits, type Address } from 'viem';
import { useReadContract, useReadContracts } from 'wagmi';
import { beam } from 'wagmi/chains';
import {
  CONTRACT_ADDRESSES,
  LaunchpadPresaleContract,
  PresaleFactoryContract,
  getNativeTokenLabel,
} from '@/config';

const HOMEPAGE_STATS_CHAIN_ID = beam.id;
const HOMEPAGE_STATS_REFRESH_INTERVAL = 30_000;
const PRESALE_FIELDS_PER_ENTRY = 7;

type MainnetPresaleStatus = 'upcoming' | 'live' | 'ended' | 'finalized' | 'cancelled';

function resolvePresaleStatus(
  now: bigint,
  startTime: bigint,
  endTime: bigint,
  claimEnabled: boolean,
  successfulFinalization: boolean,
  refundsEnabled: boolean
): MainnetPresaleStatus {
  if (refundsEnabled) return 'cancelled';
  if (claimEnabled) return 'finalized';
  if (successfulFinalization) return 'ended';
  if (now < startTime) return 'upcoming';
  if (now > endTime) return 'ended';
  return 'live';
}

export function useMainnetHomepageStats() {
  const presaleFactory = CONTRACT_ADDRESSES[HOMEPAGE_STATS_CHAIN_ID].presaleFactory;
  const nativeTokenLabel = getNativeTokenLabel(HOMEPAGE_STATS_CHAIN_ID);

  const { data: totalPresales, isLoading: isLoadingTotalPresales } = useReadContract({
    address: presaleFactory,
    abi: PresaleFactoryContract,
    functionName: 'totalPresales',
    chainId: HOMEPAGE_STATS_CHAIN_ID,
    query: {
      enabled: Boolean(presaleFactory),
      refetchInterval: HOMEPAGE_STATS_REFRESH_INTERVAL,
      refetchOnWindowFocus: true,
      refetchOnReconnect: true,
    },
  });

  const addressQueries = useMemo(() => {
    if (!totalPresales || totalPresales === 0n) return [];

    return Array.from({ length: Number(totalPresales) }, (_, index) => ({
      address: presaleFactory,
      abi: PresaleFactoryContract,
      functionName: 'allPresales',
      args: [BigInt(index)],
      chainId: HOMEPAGE_STATS_CHAIN_ID,
    } as const));
  }, [presaleFactory, totalPresales]);

  const { data: addressResults, isLoading: isLoadingPresaleAddresses } = useReadContracts({
    contracts: addressQueries,
    query: {
      enabled: addressQueries.length > 0,
      refetchInterval: HOMEPAGE_STATS_REFRESH_INTERVAL,
      refetchOnWindowFocus: true,
      refetchOnReconnect: true,
    },
  });

  const presaleAddresses = useMemo(() => {
    if (!addressResults) return [];

    return addressResults
      .map((result) => (result.status === 'success' ? (result.result as Address) : undefined))
      .filter((address): address is Address => Boolean(address));
  }, [addressResults]);

  const presaleStatQueries = useMemo(() => {
    if (presaleAddresses.length === 0) return [];

    return presaleAddresses.flatMap((address) => [
      {
        address,
        abi: LaunchpadPresaleContract,
        functionName: 'isPaymentETH',
        chainId: HOMEPAGE_STATS_CHAIN_ID,
      },
      {
        address,
        abi: LaunchpadPresaleContract,
        functionName: 'totalRaised',
        chainId: HOMEPAGE_STATS_CHAIN_ID,
      },
      {
        address,
        abi: LaunchpadPresaleContract,
        functionName: 'startTime',
        chainId: HOMEPAGE_STATS_CHAIN_ID,
      },
      {
        address,
        abi: LaunchpadPresaleContract,
        functionName: 'endTime',
        chainId: HOMEPAGE_STATS_CHAIN_ID,
      },
      {
        address,
        abi: LaunchpadPresaleContract,
        functionName: 'claimEnabled',
        chainId: HOMEPAGE_STATS_CHAIN_ID,
      },
      {
        address,
        abi: LaunchpadPresaleContract,
        functionName: 'successfulFinalization',
        chainId: HOMEPAGE_STATS_CHAIN_ID,
      },
      {
        address,
        abi: LaunchpadPresaleContract,
        functionName: 'refundsEnabled',
        chainId: HOMEPAGE_STATS_CHAIN_ID,
      },
    ] as const);
  }, [presaleAddresses]);

  const { data: presaleStatResults, isLoading: isLoadingPresaleStats } = useReadContracts({
    contracts: presaleStatQueries,
    query: {
      enabled: presaleStatQueries.length > 0,
      refetchInterval: HOMEPAGE_STATS_REFRESH_INTERVAL,
      refetchOnWindowFocus: true,
      refetchOnReconnect: true,
    },
  });

  const stats = useMemo(() => {
    const projectsLaunched = Number(totalPresales ?? 0n);

    if (!presaleStatResults || presaleAddresses.length === 0) {
      return {
        totalRaised: 0,
        totalRaisedDecimals: 0,
        totalRaisedSuffix: ` ${nativeTokenLabel}`,
        projectsLaunched,
        activePresales: 0,
      };
    }

    const now = BigInt(Math.floor(Date.now() / 1000));
    let totalRaised = 0n;
    let activePresales = 0;

    for (let index = 0; index < presaleAddresses.length; index += 1) {
      const baseIndex = index * PRESALE_FIELDS_PER_ENTRY;
      const isPaymentETHResult = presaleStatResults[baseIndex];
      const totalRaisedResult = presaleStatResults[baseIndex + 1];
      const startTimeResult = presaleStatResults[baseIndex + 2];
      const endTimeResult = presaleStatResults[baseIndex + 3];
      const claimEnabledResult = presaleStatResults[baseIndex + 4];
      const successfulFinalizationResult = presaleStatResults[baseIndex + 5];
      const refundsEnabledResult = presaleStatResults[baseIndex + 6];

      if (
        isPaymentETHResult?.status !== 'success' ||
        totalRaisedResult?.status !== 'success' ||
        startTimeResult?.status !== 'success' ||
        endTimeResult?.status !== 'success' ||
        claimEnabledResult?.status !== 'success' ||
        successfulFinalizationResult?.status !== 'success' ||
        refundsEnabledResult?.status !== 'success'
      ) {
        continue;
      }

      const isPaymentETH = isPaymentETHResult.result as boolean;
      const raisedValue = totalRaisedResult.result as bigint;
      const startTime = startTimeResult.result as bigint;
      const endTime = endTimeResult.result as bigint;
      const claimEnabled = claimEnabledResult.result as boolean;
      const successfulFinalization = successfulFinalizationResult.result as boolean;
      const refundsEnabled = refundsEnabledResult.result as boolean;

      const status = resolvePresaleStatus(
        now,
        startTime,
        endTime,
        claimEnabled,
        successfulFinalization,
        refundsEnabled
      );

      if (status === 'live' || status === 'upcoming') {
        activePresales += 1;
      }

      if (status !== 'cancelled' && isPaymentETH) {
        totalRaised += raisedValue;
      }
    }

    const totalRaisedNumber = Number(formatUnits(totalRaised, 18));
    const totalRaisedDecimals =
      totalRaisedNumber === 0 ? 0 : totalRaisedNumber < 1 ? 2 : totalRaisedNumber < 10 ? 1 : 0;

    return {
      totalRaised: totalRaisedNumber,
      totalRaisedDecimals,
      totalRaisedSuffix: ` ${nativeTokenLabel}`,
      projectsLaunched,
      activePresales,
    };
  }, [nativeTokenLabel, presaleAddresses.length, presaleStatResults, totalPresales]);

  return {
    ...stats,
    isLoading:
      isLoadingTotalPresales ||
      isLoadingPresaleAddresses ||
      (presaleAddresses.length > 0 && isLoadingPresaleStats),
  };
}
