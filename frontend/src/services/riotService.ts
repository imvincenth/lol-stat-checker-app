import type { PlayerData } from '../types';
import type { MatchData } from '../types';

const RIOT_SERVICE_ENDPOINT = import.meta.env.VITE_RIOT_SERVICE_ENDPOINT;

// Memory cache for player data to avoid redundant network requests
// const playerCache = new Map<string, PlayerData>();
// const CACHE_DURATION = 1 * 60 * 1000; // 1 minute

// type CacheEntry<T> = { 
//   data: T; 
//   timestamp: number;
// };

export async function fetchPlayerData(platform: string, name: string, tag: string): Promise<PlayerData> {
  // const cacheKey = `${platform}-${name}-${tag}`;
  
  // Check player cache for existing data and that the cache is still valid
  // const cacheEntry: { data: PlayerData, timestamp: string } = playerCache.get(cacheKey);
  // if (cacheEntry && checkCacheExpiry(cacheEntry)) {
  //   return cacheEntry.data;
  // }

  const response = await fetch(`${RIOT_SERVICE_ENDPOINT}/api/summoner/${platform}/${name}/${tag}`);
  
  if (!response.ok) {
    throw new Error(`${response.status}: ${response.statusText}`);
  }

  
  const playerData: PlayerData = await response.json();
  
  // playerCache.set(cacheKey, { data: playerData, timestamp: Date.now() });
  return playerData;
}

export async function fetchMatchData(platform: string, puuid: string, matchType: string): Promise<MatchData[]> {
  const response = await fetch(`${RIOT_SERVICE_ENDPOINT}/api/matches/${platform}/${puuid}/${matchType}`);

  if (!response.ok) {
    throw new Error('Failed to fetch match data.');
  }

  const matchData: MatchData[] = await response.json();
  return matchData;
}