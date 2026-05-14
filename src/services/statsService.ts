import { TokenStats } from '../types';
import { firestoreService } from './firestoreService';
import { fetchLiveStats } from './dexscreenerService';

export const statsService = {
  getCombinedStats: async (): Promise<TokenStats | null> => {
    try {
      const dbData = await firestoreService.getStats();
      const liveData = await fetchLiveStats();
      
      if (!dbData && !liveData) return null;

      const fallback: TokenStats = {
        price: 0,
        marketCap: 0,
        liquidity: 0,
        holders: 0,
        volume24h: 0,
        burnedToken: 0,
        burnPercent: 0,
        tax: '0/0',
        lpStatus: 'Unknown'
      };

      const base = dbData || fallback;

      return {
        ...base,
        ...(liveData ? {
          price: liveData.price ?? base.price,
          marketCap: liveData.marketCap ?? base.marketCap,
          liquidity: liveData.liquidity ?? base.liquidity,
          volume24h: liveData.volume24h ?? base.volume24h,
        } : {})
      };
    } catch (error) {
      console.error('Error fetching combined stats:', error);
      return null;
    }
  }
};
