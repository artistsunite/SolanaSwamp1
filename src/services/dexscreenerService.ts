import { TokenStats } from '../types';

const TOKEN_ADDRESS = '56RCsF1zhwn7wJWd7dHDZu7yiCNGVyaMF8kTZYSBpump';
const DEXSCREENER_API = `https://api.dexscreener.com/latest/dex/tokens/${TOKEN_ADDRESS}`;

export interface DexScreenerResponse {
  pairs: Array<{
    priceUsd: string;
    fdv: number;
    marketCap?: number;
    liquidity: {
      usd: number;
    };
    volume: {
      h24: number;
    };
    info?: {
      imageUrl?: string;
      websites?: Array<{ url: string; label: string }>;
      socials?: Array<{ url: string; type: string }>;
    };
  }>;
}

export async function fetchLiveStats(): Promise<Partial<TokenStats> | null> {
  try {
    const response = await fetch(DEXSCREENER_API);
    if (!response.ok) throw new Error(`Failed to fetch from DexScreener: ${response.statusText}`);
    
    const data: DexScreenerResponse = await response.json();
    
    if (!data.pairs || data.pairs.length === 0) return null;
    
    // Pick the most liquid pair
    const mainPair = data.pairs.sort((a, b) => b.liquidity.usd - a.liquidity.usd)[0];
    
    return {
      price: parseFloat(mainPair.priceUsd),
      marketCap: mainPair.marketCap || mainPair.fdv,
      liquidity: mainPair.liquidity.usd,
      volume24h: mainPair.volume.h24,
      // DexScreener API does not provide holder count natively.
      // We return what we have and let the combined service handle the rest.
    };
  } catch (error) {
    console.error('DexScreener API Error:', error);
    return null;
  }
}
