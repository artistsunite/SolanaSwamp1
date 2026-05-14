import { TokenStats } from '../types';

const TOKEN_ADDRESS = '56RCsF1zhwn7wJWd7dHDZu7yiCNGVyaMF8kTZYSBpump';
const DEXSCREENER_API = `https://api.dexscreener.com/latest/dex/tokens/${TOKEN_ADDRESS}`;

export interface DexScreenerResponse {
  pairs: Array<{
    priceUsd: string;
    fdv: number;
    liquidity: {
      usd: number;
    };
    volume: {
      h24: number;
    };
    boosts?: {
      active: number;
    };
    chainId: string;
    dexId: string;
    pairAddress: string;
    baseToken: {
      address: string;
      name: string;
      symbol: string;
    };
  }>;
}

export async function fetchLiveStats(): Promise<Partial<TokenStats> | null> {
  try {
    const response = await fetch(DEXSCREENER_API);
    if (!response.ok) throw new Error('Failed to fetch from DexScreener');
    
    const data: DexScreenerResponse = await response.json();
    
    if (!data.pairs || data.pairs.length === 0) return null;
    
    // Pick the most liquid pair or just the first one
    const mainPair = data.pairs[0];
    
    return {
      price: parseFloat(mainPair.priceUsd),
      marketCap: mainPair.fdv,
      liquidity: mainPair.liquidity.usd,
      volume24h: mainPair.volume.h24,
    };
  } catch (error) {
    console.error('DexScreener API Error:', error);
    return null;
  }
}
