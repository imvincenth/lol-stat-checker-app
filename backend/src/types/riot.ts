export type AccountPayload = {
  puuid: string;
  gameName: string;
  tagLine: string;
}

export type SummonerPayload = {
  puuid: string;
  profileIconId: number;
  revisionDate: number;
  summonerLevel: number;
}

export type RankedEntry = {
  leagueId: string;
  queueType: string;
  tier: string;
  rank: string;
  puuid: string;
  summonerName: string;
  leaguePoints: number;
  wins: number;
  losses: number;
  veteran: boolean;
  inactive: boolean;
  freshBlood: boolean;
  hotStreak: boolean;
}

export type MatchListPayload = {
  matches: string[];
}

export type MatchDetailPayload = {
  metadata: {
    matchId: string;
    participants: string[];
  };
  info: {
    gameCreation: number;
    gameDuration: number;
    gameEndTimestamp: number;
    gameId: number;
    gameMode: string;
    gameName: string;
    gameStartTimestamp: number;
    gameType: string;
    gameVersion: string;
    mapId: number;
    participants: any[];
    platformId: string;
    queueId: number;
    teams: any[];
    tournamentCode: string;
  };
}