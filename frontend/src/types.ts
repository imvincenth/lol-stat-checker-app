export type PlayerData = {
  platform: string;
  puuid: string;
  gameName: string;
  tagLine: string;
  profileIconId: number;
  revisionDate: number;
  summonerLevel: number;
  tier: string;
  rank: string;
  leaguePoints: number;
  wins: number;
  losses: number;
}

export type MatchData = {
  gameCreation: number;
  gameDuration: number;
  gameStartTimestamp: number;
  gameEndTimestamp: number;
  gameMode: string;
  gameType: string;
  gameVersion: string;
  mapId: number;
  queueId: number;
  endOfGameResult: string;
  tournamentCode?: string;
}