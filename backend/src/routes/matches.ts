import { Router } from "express";
import axios from "axios";
import { PLATFORM_REGION_MAP } from "../helpers/consts";
import type { MatchData } from '../types';

const router = Router();
const API_KEY = process.env.RIOT_API_KEY;

router.get("/:platform/:puuid/:matchType", async (req, res) => {
  const { platform, puuid, matchType } = req.params;
  // Parse matchType to a query parameter
  const matchTypeParam = (matchType: string) => {
    switch (matchType) {
      case 'all':
        return '';
      case 'ranked':
        return 'type=ranked&';
      case 'normal':
        return 'type=normal&';
      default:
        return '';
    }
  }

  const region = PLATFORM_REGION_MAP[platform];
  if (!region) {
    return res.status(400).json({ error: "Invalid platform." });
  }

  if (!API_KEY) {
    return res.status(500).json({ error: "Riot API key is not configured." });
  }

  const matchListEndpoint = `https://${region}.api.riotgames.com/lol/match/v5/matches/by-puuid/${puuid}/ids?${matchTypeParam(matchType)}start=0&count=5`;

  try {
    // 1. Use PUUID to fetch the player's match list
    const matchListRes = await axios.get<string[]>(matchListEndpoint, {
      headers: {
        "X-Riot-Token": API_KEY
      }
    });

    const matchIds = matchListRes.data;
    if (matchIds.length === 0) {
      return res.status(404).json({ error: "No matches found for this player." });
    }

    // 2. Use match IDs from the match list to fetch detailed match data
    const matchDetailsPromises = matchIds.map(matchId => 
      axios.get(`https://${region}.api.riotgames.com/lol/match/v5/matches/${matchId}`, {
        headers: {
          "X-Riot-Token": API_KEY
        }
      }).then(response => response.data)
    );

    const matchDetails = await Promise.all(matchDetailsPromises);

    // 3. Return the match details
    const matchData = matchDetails.map(match => match.info);

    const matchDataDetails: MatchData[] = matchData.map((match) => ({
      gameCreation: match.gameCreation,
      gameDuration: match.gameDuration,
      gameMode: match.gameMode,
      gameType: match.gameType,
      gameVersion: match.gameVersion,
      mapId: match.mapId,
      queueId: match.queueId,
      gameStartTimestamp: match.gameStartTimestamp,
      gameEndTimestamp: match.gameEndTimestamp,
      endOfGameResult: match.endOfGameResult
    }));

    return res.json(matchDataDetails);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const statusCode = error.response?.status;
      
      let errorMessage = "An unknown error occurred.";
      let httpStatus = 500;
      
      // Define custom error messages based on status codes
      switch (statusCode) {
        case 404:
          errorMessage = "Matches not found.";
          httpStatus = 404;
          break;
        case 401:
          errorMessage = "An invalid API key was used.";
          httpStatus = 401;
          break;
        case 429:
          errorMessage = "Too many requests.";
          httpStatus = 429;
          break;
        default:
          errorMessage = error.response?.statusText || "An unknown error occurred.";
          httpStatus = statusCode || 500;
          break;
      }
      
      console.error("Error fetching data:", error.response);
      res.status(httpStatus).json({ error: errorMessage });
      
    } else {
      console.error("Unknown error:", error);
      res.status(500).json({ error: "Internal Server Error." });
    }
  }
});

export default router;