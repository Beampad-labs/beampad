import { PresaleFactory } from '@/config';
import { useChainContracts } from '@/lib/hooks/useChainContracts';
import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import type { Address } from 'viem';

/**
 * Hook for factory owner to manage whitelisted creators
 */
export function useSetWhitelistedCreator() {
  const { presaleFactory } = useChainContracts();
  const {
    writeContract,
    data: hash,
    isPending,
    isError,
    error,
    reset,
  } = useWriteContract();

  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  const addWhitelistedCreator = (creatorAddress: Address) => {
    writeContract({
      address: presaleFactory,
      abi: PresaleFactory,
      functionName: 'addWhitelistedCreator',
      args: [creatorAddress],
    });
  };

  return {
    addWhitelistedCreator,
    hash,
    isPending,
    isConfirming,
    isSuccess,
    isError,
    error,
    reset,
    isBusy: isPending || isConfirming,
  };
}

/**
 * Hook for factory owner to update fee recipient
 * NOTE: setFeeRecipient is not available in the current PresaleFactory ABI.
 * This hook is stubbed out for future use.
 */
export function useSetFeeRecipient() {
  // Stubbed: setFeeRecipient does not exist in the current PresaleFactory ABI
  const setFeeRecipient = (_newRecipient: Address) => {
    console.warn('setFeeRecipient is not available in the current PresaleFactory ABI');
  };

  return {
    setFeeRecipient,
    hash: undefined,
    isPending: false,
    isConfirming: false,
    isSuccess: false,
    isError: false,
    error: null,
    reset: () => {},
    isBusy: false,
  };
}

/**
 * Hook for fee recipient to update fees on a specific presale
 * NOTE: updateFees is not available in the current LaunchpadPresaleContract ABI.
 * This hook is stubbed out for future use.
 */
export function useUpdatePresaleFees() {
  // Stubbed: updateFees does not exist in the current LaunchpadPresaleContract ABI
  const updateFees = (
    _presaleAddress: Address,
    _newTokenFeeBps: number,
    _newProceedsFeeBps: number
  ) => {
    console.warn('updateFees is not available in the current LaunchpadPresaleContract ABI');
  };

  return {
    updateFees,
    hash: undefined,
    isPending: false,
    isConfirming: false,
    isSuccess: false,
    isError: false,
    error: null,
    reset: () => {},
    isBusy: false,
  };
}
