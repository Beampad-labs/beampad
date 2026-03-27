import { isAddress, type Address } from 'viem';

export type TokenPrefill = {
  address?: Address;
  symbol?: string;
  name?: string;
  decimals?: number;
};

export function buildTokenPrefillSearch(token: {
  address: Address;
  symbol?: string;
  name?: string;
  decimals?: number;
}): string {
  const params = new URLSearchParams();

  params.set('token', token.address);

  if (token.symbol) {
    params.set('symbol', token.symbol);
  }

  if (token.name) {
    params.set('name', token.name);
  }

  if (typeof token.decimals === 'number' && Number.isFinite(token.decimals)) {
    params.set('decimals', token.decimals.toString());
  }

  const search = params.toString();
  return search ? `?${search}` : '';
}

export function readTokenPrefill(searchParams: URLSearchParams): TokenPrefill {
  const rawAddress = searchParams.get('token')?.trim();
  const rawDecimals = searchParams.get('decimals');
  const parsedDecimals = rawDecimals === null ? undefined : Number(rawDecimals);

  return {
    address: rawAddress && isAddress(rawAddress) ? rawAddress : undefined,
    symbol: searchParams.get('symbol')?.trim() || undefined,
    name: searchParams.get('name')?.trim() || undefined,
    decimals: parsedDecimals !== undefined && Number.isFinite(parsedDecimals)
      ? parsedDecimals
      : undefined,
  };
}
