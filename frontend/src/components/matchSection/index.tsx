import React from 'react'
import type { PlayerData, MatchData } from '../../types';
import { MATCH_TYPES } from '../../consts';
import { fetchMatchData } from '../../services/riotService.ts';

interface MatchSectionProps {
  player: PlayerData | null;
}

const MatchSection: React.FC<MatchSectionProps> = ({ player }) => {
  const [matches, setMatches] = React.useState<MatchData[]>([])
  const [matchType, setMatchType] = React.useState<string>('all')

  React.useEffect(() => {
    if (!player) {
      setMatches([])
      return
    }

    const loadMatches = async () => {
      try {
        const matchData = await fetchMatchData(player.platform, player.puuid, matchType);
        setMatches(matchData);
      } catch (error) {
        console.error('Failed to fetch match data:', error);
        setMatches([]);
      }
    };

    loadMatches();
  }, [player, matchType]);

  if (!player) {
    return <div></div>
  }

  return (
    <div>
      <select 
          onChange={e => setMatchType(e.target.value)} 
          value={matchType}
        >
          {MATCH_TYPES.map((type) => (
            <option key={type.value} value={type.value}>
              {type.label}
            </option>
          ))}
        </select>
      <h2>Recent Matches:</h2>
      {matches.map((match, index) => (
        <pre key={index} style={{ border: '1px solid #ccc', marginBottom: '10px', padding: '10px' }}>
          {JSON.stringify(match, null, 2)}
        </pre>
      ))}
    </div>
  )
}

export default MatchSection