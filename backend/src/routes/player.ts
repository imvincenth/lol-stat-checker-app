import { Router } from "express";
import axios from "axios";
import type { AccountPayload, RankedEntry, SummonerPayload } from "../types/riot";
import type { PlayerData } from "../types";
import { PLATFORM_REGION_MAP } from "../helpers/consts";

const router = Router();
const API_KEY = process.env.RIOT_API_KEY;

router.get("/:platform/:name/:tag", async (req, res) => {
  const { platform, name, tag } = req.params;

  const region = PLATFORM_REGION_MAP[platform];
  if (!region) {
    return res.status(400).json({ error: "Invalid platform." });
  }

  if (!API_KEY) {
    return res.status(500).json({ error: "Riot API key is not configured." });
  }

  try {
    // 1. Use the platform, name and tag to fetch the player's PUUID
    const accountRes = await axios.get<AccountPayload>(`https://${region}.api.riotgames.com/riot/account/v1/accounts/by-riot-id/${name}/${tag}`, {
      headers: {
        "X-Riot-Token": API_KEY
      }
    });

    const playerData = accountRes.data;
    const puuid = playerData.puuid;

    // 2. Use the PUUID to fetch the player's summoner data
    const summonerRes = await axios.get<SummonerPayload>(`https://${platform}.api.riotgames.com/lol/summoner/v4/summoners/by-puuid/${puuid}`, {
      headers: {
        "X-Riot-Token": API_KEY
      }
    });

    const summonerData = summonerRes.data;

    // 3. Use the PUUID to fetch the player's ranked data
    const rankedRes = await axios.get<RankedEntry>(`https://${platform}.api.riotgames.com/lol/league/v4/entries/by-puuid/${puuid}`, {
      headers: {
        "X-Riot-Token": API_KEY
      }
    });

    const rankedData = rankedRes.data;

    const playerResponse: PlayerData = {
      platform,
      puuid: playerData.puuid,
      gameName: playerData.gameName,
      tagLine: playerData.tagLine,
      profileIconId: summonerData.profileIconId,
      revisionDate: summonerData.revisionDate,
      summonerLevel: summonerData.summonerLevel,
      tier: rankedData.tier || "UNRANKED",
      rank: rankedData.rank || "",
      leaguePoints: rankedData.leaguePoints || 0,
      wins: rankedData.wins || 0,
      losses: rankedData.losses || 0,
    };

    res.json(playerResponse);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const statusCode = error.response?.status;
      
      let errorMessage = "An unknown error occurred.";
      let httpStatus = 500;

      // Define custom error messages based on status codes
      switch (statusCode) {
        case 404:
          errorMessage = "Summoner not found. Please double-check if you have the correct Riot ID.";
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