import { useState } from 'react';
import { readNumber, writeNumber } from '../lib/storage';

export default function useBestScore(game) {
  const key = `garage-best-${game}`;
  const [best, setBest] = useState(() => readNumber(key));

  const record = (score) => {
    if (score <= best) return;
    setBest(score);
    writeNumber(key, score);
  };

  return [best, record];
}
