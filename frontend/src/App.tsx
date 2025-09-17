import React from 'react'
import MatchSection from './components/matchSection/index.tsx'
import PlayerSection from './components/playerSection/index.tsx'
import RiotIdForm from './components/riotIdForm.tsx'
import type { PlayerData } from './types.ts'

function App() {
  const [player, setPlayer] = React.useState<PlayerData | null>(null)

  return (
    <div>
      <RiotIdForm setPlayer={setPlayer} />
      <PlayerSection player={player} />
      <MatchSection player={player} />
    </div>
  )
}

export default App