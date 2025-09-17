import React from 'react'
import type { PlayerData } from '../../types'

interface PlayerSectionProps {
  player: PlayerData | null;
}

const PlayerSection: React.FC<PlayerSectionProps> = ({ player }) => {
  return (
    <div>
      {player && <pre>{JSON.stringify(player, null, 2)}</pre>}
    </div>
  )
}

export default PlayerSection