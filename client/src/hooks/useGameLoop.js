import { useEffect, useLayoutEffect, useRef } from 'react';

const MAX_FRAME_MS = 50;

export default function useGameLoop(callback, running) {
  const callbackRef = useRef(callback);

  useLayoutEffect(() => {
    callbackRef.current = callback;
  });

  useEffect(() => {
    if (!running) return undefined;
    let frame = 0;
    let last = performance.now();

    const loop = (now) => {
      const delta = Math.min(now - last, MAX_FRAME_MS);
      last = now;
      callbackRef.current(delta);
      frame = requestAnimationFrame(loop);
    };

    frame = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(frame);
  }, [running]);
}
