import { formatUnits } from 'viem';

export const PRESALE_RATE_DIVISOR = 100n;
const PRESALE_RATE_DECIMALS = 2;

type RateFormatParams = {
  rate: bigint;
  saleTokenDecimals?: number;
  paymentTokenDecimals?: number;
  maxFractionDigits?: number;
};

const pow10 = (decimals: number): bigint => 10n ** BigInt(Math.max(0, decimals));

function trimDecimalString(value: string, maxFractionDigits = 6): string {
  if (!value.includes('.')) {
    return value;
  }

  const [whole, fraction = ''] = value.split('.');
  const trimmedFraction = fraction.slice(0, maxFractionDigits).replace(/0+$/, '');

  return trimmedFraction ? `${whole}.${trimmedFraction}` : whole;
}

function addThousandsSeparators(value: string): string {
  const [whole, fraction] = value.split('.');
  const formattedWhole = whole.replace(/\B(?=(\d{3})+(?!\d))/g, ',');

  return fraction ? `${formattedWhole}.${fraction}` : formattedWhole;
}

export function calculatePresaleRate(saleAmount: bigint, hardCap: bigint): bigint {
  if (saleAmount <= 0n || hardCap <= 0n) {
    return 0n;
  }

  return (saleAmount * PRESALE_RATE_DIVISOR) / hardCap;
}

export function calculatePresaleSaleAmount(hardCap: bigint, rate: bigint): bigint {
  if (hardCap <= 0n || rate <= 0n) {
    return 0n;
  }

  return (hardCap * rate) / PRESALE_RATE_DIVISOR;
}

export function formatPresaleRate({
  rate,
  saleTokenDecimals = 18,
  paymentTokenDecimals = 18,
  maxFractionDigits = 6,
}: RateFormatParams): string {
  if (rate <= 0n) {
    return '0';
  }

  const scaledRate = rate * pow10(paymentTokenDecimals);
  const formatted = formatUnits(scaledRate, saleTokenDecimals + PRESALE_RATE_DECIMALS);

  return addThousandsSeparators(trimDecimalString(formatted, maxFractionDigits));
}

export function formatPresaleAmount(
  value: bigint,
  decimals = 18,
  maxFractionDigits?: number
): string {
  const formatted = formatUnits(value, decimals);
  const trimmed =
    typeof maxFractionDigits === 'number'
      ? trimDecimalString(formatted, maxFractionDigits)
      : formatted;

  return addThousandsSeparators(trimmed);
}

export function formatPresaleRateLabel({
  rate,
  saleTokenSymbol,
  paymentTokenSymbol,
  saleTokenDecimals = 18,
  paymentTokenDecimals = 18,
  maxFractionDigits = 6,
}: RateFormatParams & {
  saleTokenSymbol?: string;
  paymentTokenSymbol?: string;
}): string {
  const formattedRate = formatPresaleRate({
    rate,
    saleTokenDecimals,
    paymentTokenDecimals,
    maxFractionDigits,
  });

  return `1 ${paymentTokenSymbol || 'payment token'} = ${formattedRate} ${saleTokenSymbol || 'sale token'}`;
}
