import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAccount, useChainId, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { parseUnits, type Address } from 'viem';
import { TokenFactory, getContractAddresses, getExplorerUrl } from '@/config';
import {
  Coins,
  Flame,
  Printer,
  Percent,
  Ban,
  Loader2,
  CheckCircle2,
  ExternalLink,
  Copy,
  AlertTriangle,
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

type TokenType = 'plain' | 'mintable' | 'burnable' | 'taxable' | 'nonMintable';

const tokenTypes: {
  type: TokenType;
  label: string;
  description: string;
  icon: React.FC<{ className?: string }>;
  functionName: string;
}[] = [
  {
    type: 'plain',
    label: 'Plain',
    description: 'Standard ERC20 token with fixed supply.',
    icon: Coins,
    functionName: 'createPlainToken',
  },
  {
    type: 'mintable',
    label: 'Mintable',
    description: 'Owner can mint new tokens after creation.',
    icon: Printer,
    functionName: 'createMintableToken',
  },
  {
    type: 'burnable',
    label: 'Burnable',
    description: 'Holders can burn their tokens to reduce supply.',
    icon: Flame,
    functionName: 'createBurnableToken',
  },
  {
    type: 'taxable',
    label: 'Taxable',
    description: 'Automatic tax on transfers sent to a wallet.',
    icon: Percent,
    functionName: 'createTaxableToken',
  },
  {
    type: 'nonMintable',
    label: 'Non-Mintable',
    description: 'Fixed supply token that can never be minted.',
    icon: Ban,
    functionName: 'createNonMintableToken',
  },
];

const CreateTokenPage: React.FC = () => {
  const { address: userAddress, isConnected } = useAccount();
  const chainId = useChainId();
  const contracts = getContractAddresses(chainId);
  const explorerUrl = getExplorerUrl(chainId);

  const [selectedType, setSelectedType] = useState<TokenType>('plain');
  const [name, setName] = useState('');
  const [symbol, setSymbol] = useState('');
  const [decimals, setDecimals] = useState('18');
  const [initialSupply, setInitialSupply] = useState('');
  const [recipient, setRecipient] = useState('');
  const [taxWallet, setTaxWallet] = useState('');
  const [taxBps, setTaxBps] = useState('');
  const [createdTokenAddress, setCreatedTokenAddress] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

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

  // Extract created token address from receipt logs
  useEffect(() => {
    if (isSuccess && receipt?.logs) {
      // TokenCreated event - first indexed param is the token address
      for (const log of receipt.logs) {
        if (log.topics.length >= 2) {
          const tokenAddr = `0x${log.topics[1]?.slice(26)}`;
          if (tokenAddr && tokenAddr.length === 42) {
            setCreatedTokenAddress(tokenAddr);
            break;
          }
        }
      }
    }
  }, [isSuccess, receipt]);

  // Default recipient to connected wallet
  useEffect(() => {
    if (userAddress && !recipient) {
      setRecipient(userAddress);
    }
  }, [userAddress, recipient]);

  const handleSubmit = () => {
    if (!name || !symbol || !initialSupply || !recipient) return;

    const dec = parseInt(decimals) || 18;
    const supply = parseUnits(initialSupply, dec);
    const recipientAddr = recipient as Address;

    const tokenTypeConfig = tokenTypes.find((t) => t.type === selectedType);
    if (!tokenTypeConfig) return;

    if (selectedType === 'taxable') {
      if (!taxWallet || !taxBps) return;
      writeContract({
        abi: TokenFactory,
        address: contracts.tokenFactory,
        functionName: 'createTaxableToken',
        args: [
          {
            name,
            symbol,
            decimals: dec,
            initialSupply: supply,
            initialRecipient: recipientAddr,
          },
          taxWallet as Address,
          BigInt(taxBps),
        ],
      });
    } else {
      writeContract({
        abi: TokenFactory,
        address: contracts.tokenFactory,
        functionName: tokenTypeConfig.functionName as any,
        args: [
          {
            name,
            symbol,
            decimals: dec,
            initialSupply: supply,
            initialRecipient: recipientAddr,
          },
        ],
      });
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleReset = () => {
    reset();
    setName('');
    setSymbol('');
    setDecimals('18');
    setInitialSupply('');
    setRecipient(userAddress || '');
    setTaxWallet('');
    setTaxBps('');
    setCreatedTokenAddress(null);
    setSelectedType('plain');
  };

  // Success state
  if (isSuccess && createdTokenAddress) {
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
            <h2 className="font-display text-display-md text-ink">Token Created!</h2>
            <p className="text-body text-ink-muted">
              Your {symbol} token has been deployed successfully.
            </p>
          </div>
          <div className="bg-ink/[0.03] rounded-2xl p-4 space-y-2">
            <p className="text-body-sm text-ink-muted">Token Address</p>
            <div className="flex items-center gap-2 justify-center">
              <code className="text-body font-mono text-ink break-all">
                {createdTokenAddress}
              </code>
              <button
                onClick={() => handleCopy(createdTokenAddress)}
                className="p-1.5 rounded-lg hover:bg-ink/5 transition-colors"
              >
                <Copy className="w-4 h-4 text-ink-muted" />
              </button>
            </div>
            {copied && <p className="text-xs text-green-600">Copied!</p>}
          </div>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href={`${explorerUrl}/address/${createdTokenAddress}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary inline-flex items-center gap-2"
            >
              View on Explorer <ExternalLink className="w-4 h-4" />
            </a>
            <button onClick={handleReset} className="btn-secondary">
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
        <h1 className="font-display text-display-lg text-ink">Create Token</h1>
        <p className="text-body-lg text-ink-muted">
          Deploy your own ERC20 token on Beam with just a few clicks.
        </p>
      </motion.section>

      {/* Token Type Selector */}
      <motion.section variants={itemVariants} className="space-y-4">
        <label className="text-body font-medium text-ink">Token Type</label>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {tokenTypes.map((tt) => (
            <button
              key={tt.type}
              onClick={() => setSelectedType(tt.type)}
              className={`text-left p-4 rounded-2xl border-2 transition-all ${
                selectedType === tt.type
                  ? 'border-accent bg-accent/5 shadow-sm'
                  : 'border-transparent bg-ink/[0.03] hover:bg-ink/[0.06]'
              }`}
            >
              <div className="flex items-center gap-3 mb-2">
                <div
                  className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                    selectedType === tt.type
                      ? 'bg-accent text-white'
                      : 'bg-ink/5 text-ink-muted'
                  }`}
                >
                  <tt.icon className="w-4 h-4" />
                </div>
                <span className="font-medium text-ink">{tt.label}</span>
              </div>
              <p className="text-body-sm text-ink-muted">{tt.description}</p>
            </button>
          ))}
        </div>
      </motion.section>

      {/* Form */}
      <motion.section variants={itemVariants} className="glass-card rounded-3xl p-6 space-y-5">
        <h2 className="font-display text-display-sm text-ink">Token Details</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-body-sm text-ink-muted font-medium">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="My Token"
              className="input-field w-full"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-body-sm text-ink-muted font-medium">Symbol</label>
            <input
              type="text"
              value={symbol}
              onChange={(e) => setSymbol(e.target.value)}
              placeholder="MTK"
              className="input-field w-full"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-body-sm text-ink-muted font-medium">Decimals</label>
            <input
              type="number"
              value={decimals}
              onChange={(e) => setDecimals(e.target.value)}
              placeholder="18"
              className="input-field w-full"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-body-sm text-ink-muted font-medium">Initial Supply</label>
            <input
              type="text"
              value={initialSupply}
              onChange={(e) => setInitialSupply(e.target.value)}
              placeholder="1000000"
              className="input-field w-full"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-body-sm text-ink-muted font-medium">Recipient Address</label>
          <input
            type="text"
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
            placeholder="0x..."
            className="input-field w-full font-mono text-sm"
          />
          <p className="text-xs text-ink-faint">Defaults to your connected wallet.</p>
        </div>

        {/* Taxable Fields */}
        {selectedType === 'taxable' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-ink/5">
            <div className="space-y-1.5">
              <label className="text-body-sm text-ink-muted font-medium">Tax Wallet</label>
              <input
                type="text"
                value={taxWallet}
                onChange={(e) => setTaxWallet(e.target.value)}
                placeholder="0x..."
                className="input-field w-full font-mono text-sm"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-body-sm text-ink-muted font-medium">
                Tax (BPS, e.g. 100 = 1%)
              </label>
              <input
                type="number"
                value={taxBps}
                onChange={(e) => setTaxBps(e.target.value)}
                placeholder="100"
                className="input-field w-full"
              />
            </div>
          </div>
        )}

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
            !name ||
            !symbol ||
            !initialSupply ||
            !recipient
          }
          className="btn-primary w-full"
        >
          {isPending || isConfirming ? (
            <span className="inline-flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              {isConfirming ? 'Confirming...' : 'Creating Token...'}
            </span>
          ) : !isConnected ? (
            'Connect Wallet First'
          ) : (
            'Create Token'
          )}
        </button>
      </motion.section>
    </motion.div>
  );
};

export default CreateTokenPage;
