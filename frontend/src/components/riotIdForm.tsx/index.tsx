import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { riotIdSchema } from './riotIdSchema.ts';
import type { PlayerData } from '../../types';
import { PLATFORMS } from '../../consts.ts';
import { fetchPlayerData } from '../../services/riotService.ts';

type RiotIdForm = {
  riotId: string;
  platform: string;
};

function RiotIdForm({ setPlayer }: { setPlayer: (player: PlayerData | null) => void }) {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<RiotIdForm>({
    resolver: zodResolver(riotIdSchema),
    defaultValues: {
      riotId: '',
      platform: 'na1',
    },
  });

  const onSubmit = async (data: RiotIdForm) => {
    setError(null);
    setLoading(true);

    const [name, tag] = data.riotId.split('#');

    try {
      const playerData = await fetchPlayerData(data.platform, name, tag);
      setPlayer(playerData);
      reset();
    } catch (err) {
      setError(`Failed to fetch player data ${(err as Error).message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <select {...register('platform')}>
        {PLATFORMS.map((p) => (
          <option key={p.value} value={p.value}>
            {p.label}
          </option>
        ))}
      </select>
      <input type="text" {...register('riotId')} placeholder="Riot ID" />
      <button type="submit">Search</button>
      {loading && <p>Loading...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {errors.riotId && <p style={{ color: 'red' }}>{errors.riotId.message}</p>}
    </form>
  );
}

export default RiotIdForm;
