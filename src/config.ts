import { type Address, http } from "viem";
import { beam, beamTestnet } from "wagmi/chains";
import { createConfig } from "wagmi";
import {
  connectorsForWallets,
} from "@rainbow-me/rainbowkit";
import {
  metaMaskWallet,
  rainbowWallet,
  walletConnectWallet,
  coinbaseWallet,
} from "@rainbow-me/rainbowkit/wallets";

// ---------------------------------------------------------------------------
// Chain definitions
// ---------------------------------------------------------------------------

export const SUPPORTED_CHAINS = [beam, beamTestnet] as const;

// ---------------------------------------------------------------------------
// Wagmi / RainbowKit config
// ---------------------------------------------------------------------------

const PROJECT_ID = "05f1bc7c3d4ce4d40fe55e540e58c2da";

const connectors = connectorsForWallets(
  [
    {
      groupName: "Recommended",
      wallets: [metaMaskWallet, rainbowWallet, walletConnectWallet, coinbaseWallet],
    },
  ],
  {
    appName: "BeamPad",
    projectId: PROJECT_ID,
  }
);

export const config = createConfig({
  connectors,
  chains: SUPPORTED_CHAINS,
  transports: {
    [beam.id]: http(),
    [beamTestnet.id]: http(),
  },
});

// ---------------------------------------------------------------------------
// Owner address
// ---------------------------------------------------------------------------

export const OWNER: Address = "0x4C3Af86D9F5B8bDeB0fD211E9ed4590d709CaA71" as Address;

// ---------------------------------------------------------------------------
// Contract address map
// ---------------------------------------------------------------------------

export type ContractAddressMap = {
  tokenLocker: Address;
  nftFactory: Address;
  presaleFactory: Address;
  tokenFactory: Address;
  airdropMultisender: Address;
};

const ZERO: Address = "0x0000000000000000000000000000000000000000";

export const CONTRACT_ADDRESSES: Record<number, ContractAddressMap> = {
  [beam.id]: {
    tokenLocker: ZERO,
    nftFactory: ZERO,
    presaleFactory: ZERO,
    tokenFactory: ZERO,
    airdropMultisender: ZERO,
  },
  [beamTestnet.id]: {
    tokenLocker: "0x81850e53dec753b95de4599173755bc640575c3d",
    nftFactory: "0x83faf9a7b7a33ff761011b40dc2ec54a079c2459",
    presaleFactory: "0x40bfd48521cdaa3ea460917e053738765063745d",
    tokenFactory: "0xc73290ec0d30c793250d50d2ec1bcfa36e2b00c8",
    airdropMultisender: "0x153a2142d68ee6bd2a4cd63b46c0f60aec34cc14",
  },
};

// ---------------------------------------------------------------------------
// Staking contract addresses
// ---------------------------------------------------------------------------

export const STAKING_CONTRACT_ADDRESSES: Record<number, Address> = {
  [beam.id]: ZERO,
  [beamTestnet.id]: ZERO,
};

// ---------------------------------------------------------------------------
// Explorer URLs
// ---------------------------------------------------------------------------

export const EXPLORER_URLS: Record<number, string> = {
  [beam.id]: "https://subnets.avax.network/beam",
  [beamTestnet.id]: "https://subnets-test.avax.network/beam",
};

// ---------------------------------------------------------------------------
// Chain labels
// ---------------------------------------------------------------------------

export const CHAIN_LABELS: Record<number, string> = {
  [beam.id]: "Beam Mainnet",
  [beamTestnet.id]: "Beam Testnet",
};

// ---------------------------------------------------------------------------
// Native token labels
// ---------------------------------------------------------------------------

export const NATIVE_TOKEN_LABELS: Record<number, string> = {
  [beam.id]: "BEAM",
  [beamTestnet.id]: "BEAM",
};

// ---------------------------------------------------------------------------
// Helper functions (default to Beam mainnet)
// ---------------------------------------------------------------------------

export function getContractAddresses(chainId?: number): ContractAddressMap {
  return CONTRACT_ADDRESSES[chainId ?? beam.id] ?? CONTRACT_ADDRESSES[beam.id];
}

export function getStakingContractAddress(chainId?: number): Address {
  return STAKING_CONTRACT_ADDRESSES[chainId ?? beam.id] ?? STAKING_CONTRACT_ADDRESSES[beam.id];
}

export function getExplorerUrl(chainId?: number): string {
  return EXPLORER_URLS[chainId ?? beam.id] ?? EXPLORER_URLS[beam.id];
}

export function getNativeTokenLabel(chainId?: number): string {
  return NATIVE_TOKEN_LABELS[chainId ?? beam.id] ?? NATIVE_TOKEN_LABELS[beam.id];
}

// ===========================================================================
//  CONTRACT ABIs
// ===========================================================================

// ---------------------------------------------------------------------------
// StakingContract ABI
// ---------------------------------------------------------------------------

export const StakingContract = [
  {
    inputs: [{ internalType: "address", name: "_tokenAddress", type: "address" }],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "address", name: "user", type: "address" },
      { indexed: false, internalType: "uint256", name: "amount", type: "uint256" },
    ],
    name: "Stake",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "address", name: "user", type: "address" },
      { indexed: false, internalType: "uint256", name: "amount", type: "uint256" },
    ],
    name: "UnStake",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "address", name: "user", type: "address" },
      { indexed: false, internalType: "uint256", name: "amount", type: "uint256" },
    ],
    name: "claimedRewards",
    type: "event",
  },
  {
    inputs: [],
    name: "EmergencyRecover",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "finalise",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "getReward",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "_amount", type: "uint256" }],
    name: "notify",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "_amount", type: "uint256" }],
    name: "stake",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "startStaking",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "_finishAt", type: "uint256" }],
    name: "updateFinishAt",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "_rewardRate", type: "uint256" }],
    name: "updateRewardRate",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "_amount", type: "uint256" }],
    name: "withdraw",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "_account", type: "address" }],
    name: "balanceOf",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "_account", type: "address" }],
    name: "calculateReward",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "duration",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "finishAt",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "owner",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "_account", type: "address" }],
    name: "pendingRewards",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "rewardPerToken",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "rewardRate",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "", type: "address" }],
    name: "rewards",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "rewardsToken",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "", type: "address" }],
    name: "stakers",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "stakingStatus",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "stakingToken",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "totalSupply",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "totalTokensStakeCount",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "_account", type: "address" }],
    name: "totalUserEarned",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
] as const;

// ---------------------------------------------------------------------------
// PresaleFactory ABI
// ---------------------------------------------------------------------------

export const PresaleFactory = [
  { type: "constructor", inputs: [], stateMutability: "nonpayable" },
  {
    type: "function",
    name: "allPresales",
    inputs: [{ name: "", type: "uint256", internalType: "uint256" }],
    outputs: [{ name: "", type: "address", internalType: "address" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "createPresale",
    inputs: [
      {
        name: "params",
        type: "tuple",
        internalType: "struct PresaleFactory.CreateParams",
        components: [
          { name: "saleToken", type: "address", internalType: "address" },
          { name: "paymentToken", type: "address", internalType: "address" },
          {
            name: "config",
            type: "tuple",
            internalType: "struct PresaleConfig",
            components: [
              { name: "startTime", type: "uint64", internalType: "uint64" },
              { name: "endTime", type: "uint64", internalType: "uint64" },
              { name: "rate", type: "uint256", internalType: "uint256" },
              { name: "softCap", type: "uint256", internalType: "uint256" },
              { name: "hardCap", type: "uint256", internalType: "uint256" },
              { name: "minContribution", type: "uint256", internalType: "uint256" },
              { name: "maxContribution", type: "uint256", internalType: "uint256" },
            ],
          },
          { name: "owner", type: "address", internalType: "address" },
          { name: "requiresWhitelist", type: "bool", internalType: "bool" },
        ],
      },
    ],
    outputs: [{ name: "presale", type: "address", internalType: "address" }],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "factoryOwner",
    inputs: [],
    outputs: [{ name: "", type: "address", internalType: "address" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "feeRecipient",
    inputs: [],
    outputs: [{ name: "", type: "address", internalType: "address" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "presalesCreatedBy",
    inputs: [{ name: "creator", type: "address", internalType: "address" }],
    outputs: [{ name: "", type: "address[]", internalType: "address[]" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "setFeeRecipient",
    inputs: [{ name: "newRecipient", type: "address", internalType: "address" }],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "setWhitelistedCreator",
    inputs: [
      { name: "creator", type: "address", internalType: "address" },
      { name: "whitelisted", type: "bool", internalType: "bool" },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "totalPresales",
    inputs: [],
    outputs: [{ name: "", type: "uint256", internalType: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "whitelistedCreators",
    inputs: [{ name: "", type: "address", internalType: "address" }],
    outputs: [{ name: "", type: "bool", internalType: "bool" }],
    stateMutability: "view",
  },
  {
    type: "event",
    name: "CreatorWhitelisted",
    inputs: [
      { name: "creator", type: "address", indexed: true, internalType: "address" },
      { name: "whitelisted", type: "bool", indexed: false, internalType: "bool" },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "FeeRecipientUpdated",
    inputs: [{ name: "newRecipient", type: "address", indexed: true, internalType: "address" }],
    anonymous: false,
  },
  {
    type: "event",
    name: "PresaleCreated",
    inputs: [
      { name: "creator", type: "address", indexed: true, internalType: "address" },
      { name: "presale", type: "address", indexed: true, internalType: "address" },
      { name: "saleToken", type: "address", indexed: true, internalType: "address" },
      { name: "paymentToken", type: "address", indexed: false, internalType: "address" },
      { name: "requiresWhitelist", type: "bool", indexed: false, internalType: "bool" },
    ],
    anonymous: false,
  },
] as const;

// ---------------------------------------------------------------------------
// PresaleContract (LaunchpadPresaleContract) ABI
// ---------------------------------------------------------------------------

export const PresaleContract = [
  {
    type: "function",
    name: "saleToken",
    inputs: [],
    outputs: [{ name: "", type: "address", internalType: "contract IERC20" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "paymentToken",
    inputs: [],
    outputs: [{ name: "", type: "address", internalType: "contract IERC20" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "isPaymentETH",
    inputs: [],
    outputs: [{ name: "", type: "bool", internalType: "bool" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "startTime",
    inputs: [],
    outputs: [{ name: "", type: "uint64", internalType: "uint64" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "endTime",
    inputs: [],
    outputs: [{ name: "", type: "uint64", internalType: "uint64" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "rate",
    inputs: [],
    outputs: [{ name: "", type: "uint256", internalType: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "softCap",
    inputs: [],
    outputs: [{ name: "", type: "uint256", internalType: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "hardCap",
    inputs: [],
    outputs: [{ name: "", type: "uint256", internalType: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "minContribution",
    inputs: [],
    outputs: [{ name: "", type: "uint256", internalType: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "maxContribution",
    inputs: [],
    outputs: [{ name: "", type: "uint256", internalType: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "totalRaised",
    inputs: [],
    outputs: [{ name: "", type: "uint256", internalType: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "committedTokens",
    inputs: [],
    outputs: [{ name: "", type: "uint256", internalType: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "totalTokensDeposited",
    inputs: [],
    outputs: [{ name: "", type: "uint256", internalType: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "claimEnabled",
    inputs: [],
    outputs: [{ name: "", type: "bool", internalType: "bool" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "refundsEnabled",
    inputs: [],
    outputs: [{ name: "", type: "bool", internalType: "bool" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "tokenFeeBps",
    inputs: [],
    outputs: [{ name: "", type: "uint96", internalType: "uint96" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "proceedsFeeBps",
    inputs: [],
    outputs: [{ name: "", type: "uint96", internalType: "uint96" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "owner",
    inputs: [],
    outputs: [{ name: "", type: "address", internalType: "address" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "contributions",
    inputs: [{ name: "", type: "address", internalType: "address" }],
    outputs: [{ name: "", type: "uint256", internalType: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "purchasedTokens",
    inputs: [{ name: "", type: "address", internalType: "address" }],
    outputs: [{ name: "", type: "uint256", internalType: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "contribute",
    inputs: [{ name: "amount", type: "uint256", internalType: "uint256" }],
    outputs: [],
    stateMutability: "payable",
  },
  {
    type: "function",
    name: "claimTokens",
    inputs: [],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "claimRefund",
    inputs: [],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "depositSaleTokens",
    inputs: [{ name: "amount", type: "uint256", internalType: "uint256" }],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "finalize",
    inputs: [],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "cancelPresale",
    inputs: [],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "withdrawProceeds",
    inputs: [{ name: "amount", type: "uint256", internalType: "uint256" }],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "withdrawUnusedTokens",
    inputs: [{ name: "amount", type: "uint256", internalType: "uint256" }],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "addToWhitelist",
    inputs: [{ name: "account", type: "address", internalType: "address" }],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "addManyToWhitelist",
    inputs: [{ name: "accounts", type: "address[]", internalType: "address[]" }],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "removeFromWhitelist",
    inputs: [{ name: "account", type: "address", internalType: "address" }],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "updateConfig",
    inputs: [
      {
        name: "config",
        type: "tuple",
        internalType: "struct PresaleConfig",
        components: [
          { name: "startTime", type: "uint64", internalType: "uint64" },
          { name: "endTime", type: "uint64", internalType: "uint64" },
          { name: "rate", type: "uint256", internalType: "uint256" },
          { name: "softCap", type: "uint256", internalType: "uint256" },
          { name: "hardCap", type: "uint256", internalType: "uint256" },
          { name: "minContribution", type: "uint256", internalType: "uint256" },
          { name: "maxContribution", type: "uint256", internalType: "uint256" },
        ],
      },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "updateFees",
    inputs: [
      { name: "newTokenFeeBps", type: "uint96", internalType: "uint96" },
      { name: "newProceedsFeeBps", type: "uint96", internalType: "uint96" },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
] as const;

// ---------------------------------------------------------------------------
// TokenFactory ABI
// ---------------------------------------------------------------------------

export const TokenFactory = [
  {
    inputs: [
      {
        components: [
          { internalType: "string", name: "name", type: "string" },
          { internalType: "string", name: "symbol", type: "string" },
          { internalType: "uint8", name: "decimals", type: "uint8" },
          { internalType: "uint256", name: "initialSupply", type: "uint256" },
          { internalType: "address", name: "initialRecipient", type: "address" },
        ],
        internalType: "struct TokenFactory.TokenParams",
        name: "params",
        type: "tuple",
      },
    ],
    name: "createPlainToken",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        components: [
          { internalType: "string", name: "name", type: "string" },
          { internalType: "string", name: "symbol", type: "string" },
          { internalType: "uint8", name: "decimals", type: "uint8" },
          { internalType: "uint256", name: "initialSupply", type: "uint256" },
          { internalType: "address", name: "initialRecipient", type: "address" },
        ],
        internalType: "struct TokenFactory.TokenParams",
        name: "params",
        type: "tuple",
      },
    ],
    name: "createMintableToken",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        components: [
          { internalType: "string", name: "name", type: "string" },
          { internalType: "string", name: "symbol", type: "string" },
          { internalType: "uint8", name: "decimals", type: "uint8" },
          { internalType: "uint256", name: "initialSupply", type: "uint256" },
          { internalType: "address", name: "initialRecipient", type: "address" },
        ],
        internalType: "struct TokenFactory.TokenParams",
        name: "params",
        type: "tuple",
      },
    ],
    name: "createBurnableToken",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        components: [
          { internalType: "string", name: "name", type: "string" },
          { internalType: "string", name: "symbol", type: "string" },
          { internalType: "uint8", name: "decimals", type: "uint8" },
          { internalType: "uint256", name: "initialSupply", type: "uint256" },
          { internalType: "address", name: "initialRecipient", type: "address" },
        ],
        internalType: "struct TokenFactory.TokenParams",
        name: "params",
        type: "tuple",
      },
      { internalType: "address", name: "taxWallet", type: "address" },
      { internalType: "uint256", name: "taxBps", type: "uint256" },
    ],
    name: "createTaxableToken",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        components: [
          { internalType: "string", name: "name", type: "string" },
          { internalType: "string", name: "symbol", type: "string" },
          { internalType: "uint8", name: "decimals", type: "uint8" },
          { internalType: "uint256", name: "initialSupply", type: "uint256" },
          { internalType: "address", name: "initialRecipient", type: "address" },
        ],
        internalType: "struct TokenFactory.TokenParams",
        name: "params",
        type: "tuple",
      },
    ],
    name: "createNonMintableToken",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "address", name: "token", type: "address" },
      { indexed: true, internalType: "address", name: "creator", type: "address" },
      { indexed: false, internalType: "string", name: "name", type: "string" },
      { indexed: false, internalType: "string", name: "symbol", type: "string" },
    ],
    name: "TokenCreated",
    type: "event",
  },
] as const;

// ---------------------------------------------------------------------------
// TokenLocker ABI
// ---------------------------------------------------------------------------

export const TokenLocker = [
  {
    inputs: [
      { internalType: "address", name: "token", type: "address" },
      { internalType: "uint256", name: "amount", type: "uint256" },
      { internalType: "uint64", name: "duration", type: "uint64" },
      { internalType: "string", name: "name", type: "string" },
      { internalType: "string", name: "description", type: "string" },
    ],
    name: "lockTokens",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "lockId", type: "uint256" }],
    name: "unlock",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "uint256", name: "lockId", type: "uint256" },
      { internalType: "uint64", name: "additionalDuration", type: "uint64" },
    ],
    name: "extendLock",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "uint256", name: "lockId", type: "uint256" },
      { internalType: "address", name: "newOwner", type: "address" },
    ],
    name: "transferLockOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "lockId", type: "uint256" }],
    name: "getLock",
    outputs: [
      {
        components: [
          { internalType: "address", name: "token", type: "address" },
          { internalType: "address", name: "owner", type: "address" },
          { internalType: "uint256", name: "amount", type: "uint256" },
          { internalType: "uint64", name: "lockTime", type: "uint64" },
          { internalType: "uint64", name: "unlockTime", type: "uint64" },
          { internalType: "bool", name: "withdrawn", type: "bool" },
          { internalType: "string", name: "name", type: "string" },
          { internalType: "string", name: "description", type: "string" },
        ],
        internalType: "struct TokenLocker.Lock",
        name: "",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "user", type: "address" }],
    name: "getUserLocks",
    outputs: [{ internalType: "uint256[]", name: "", type: "uint256[]" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "totalLocks",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "uint256", name: "lockId", type: "uint256" },
      { indexed: true, internalType: "address", name: "owner", type: "address" },
      { indexed: true, internalType: "address", name: "token", type: "address" },
      { indexed: false, internalType: "uint256", name: "amount", type: "uint256" },
      { indexed: false, internalType: "uint64", name: "unlockTime", type: "uint64" },
    ],
    name: "TokensLocked",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "uint256", name: "lockId", type: "uint256" },
      { indexed: true, internalType: "address", name: "owner", type: "address" },
      { indexed: false, internalType: "uint256", name: "amount", type: "uint256" },
    ],
    name: "TokensUnlocked",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "uint256", name: "lockId", type: "uint256" },
      { indexed: false, internalType: "uint64", name: "newUnlockTime", type: "uint64" },
    ],
    name: "LockExtended",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "uint256", name: "lockId", type: "uint256" },
      { indexed: true, internalType: "address", name: "previousOwner", type: "address" },
      { indexed: true, internalType: "address", name: "newOwner", type: "address" },
    ],
    name: "LockOwnershipTransferred",
    type: "event",
  },
] as const;

// ---------------------------------------------------------------------------
// AirdropMultiSender ABI
// ---------------------------------------------------------------------------

export const AirdropMultiSender = [
  {
    inputs: [
      { internalType: "address", name: "token", type: "address" },
      { internalType: "address[]", name: "recipients", type: "address[]" },
      { internalType: "uint256[]", name: "amounts", type: "uint256[]" },
    ],
    name: "multiSendToken",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address[]", name: "recipients", type: "address[]" },
      { internalType: "uint256[]", name: "amounts", type: "uint256[]" },
    ],
    name: "multiSendETH",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "address", name: "token", type: "address" },
      { indexed: false, internalType: "uint256", name: "totalRecipients", type: "uint256" },
      { indexed: false, internalType: "uint256", name: "totalAmount", type: "uint256" },
    ],
    name: "TokensSent",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: false, internalType: "uint256", name: "totalRecipients", type: "uint256" },
      { indexed: false, internalType: "uint256", name: "totalAmount", type: "uint256" },
    ],
    name: "ETHSent",
    type: "event",
  },
] as const;

// ---------------------------------------------------------------------------
// NFTFactory ABI
// ---------------------------------------------------------------------------

export const NFTFactory = [
  {
    inputs: [
      { internalType: "string", name: "name", type: "string" },
      { internalType: "string", name: "symbol", type: "string" },
      { internalType: "string", name: "baseURI", type: "string" },
      { internalType: "uint256", name: "maxSupply", type: "uint256" },
      { internalType: "uint256", name: "mintPrice", type: "uint256" },
    ],
    name: "createNFTCollection",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "address", name: "collection", type: "address" },
      { indexed: true, internalType: "address", name: "creator", type: "address" },
      { indexed: false, internalType: "string", name: "name", type: "string" },
      { indexed: false, internalType: "string", name: "symbol", type: "string" },
      { indexed: false, internalType: "uint256", name: "maxSupply", type: "uint256" },
    ],
    name: "NFTCollectionCreated",
    type: "event",
  },
] as const;

// ---------------------------------------------------------------------------
// ERC20 ABI
// ---------------------------------------------------------------------------

export const erc20Abi = [
  {
    inputs: [],
    name: "name",
    outputs: [{ internalType: "string", name: "", type: "string" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "symbol",
    outputs: [{ internalType: "string", name: "", type: "string" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "decimals",
    outputs: [{ internalType: "uint8", name: "", type: "uint8" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "totalSupply",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "account", type: "address" }],
    name: "balanceOf",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "to", type: "address" },
      { internalType: "uint256", name: "amount", type: "uint256" },
    ],
    name: "transfer",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "from", type: "address" },
      { internalType: "address", name: "to", type: "address" },
      { internalType: "uint256", name: "amount", type: "uint256" },
    ],
    name: "transferFrom",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "spender", type: "address" },
      { internalType: "uint256", name: "amount", type: "uint256" },
    ],
    name: "approve",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "owner", type: "address" },
      { internalType: "address", name: "spender", type: "address" },
    ],
    name: "allowance",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "address", name: "from", type: "address" },
      { indexed: true, internalType: "address", name: "to", type: "address" },
      { indexed: false, internalType: "uint256", name: "value", type: "uint256" },
    ],
    name: "Transfer",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "address", name: "owner", type: "address" },
      { indexed: true, internalType: "address", name: "spender", type: "address" },
      { indexed: false, internalType: "uint256", name: "value", type: "uint256" },
    ],
    name: "Approval",
    type: "event",
  },
] as const;

// ---------------------------------------------------------------------------
// Aliases
// ---------------------------------------------------------------------------

export const LaunchpadPresaleContract = PresaleContract;
export const AirdropMultisenderContract = AirdropMultiSender;
export const NFTFactoryContract = NFTFactory;
export const PresaleFactoryContract = PresaleFactory;
