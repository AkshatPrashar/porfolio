import { useCallback, useEffect, useState } from 'react';
import { api } from '../lib/api';

export default function useLeaderboard(game) {
  const [scores, setScores] = useState([]);
  const [status, setStatus] = useState(game ? 'loading' : 'idle');
  const [version, setVersion] = useState(0);

  useEffect(() => {
    if (!game) return undefined;
    let active = true;

    api
      .getScores(game)
      .then((data) => {
        if (!active) return;
        setScores(data.scores);
        setStatus('ready');
      })
      .catch(() => active && setStatus('offline'));

    return () => {
      active = false;
    };
  }, [game, version]);

  const submit = useCallback(
    async (name, score) => {
      const { rank } = await api.submitScore({ name, game, score });
      setVersion((current) => current + 1);
      return rank;
    },
    [game],
  );

  return { scores, status, submit };
}
