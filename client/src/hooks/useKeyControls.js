import { useEffect, useLayoutEffect, useRef } from 'react';

export default function useKeyControls(onKey, enabled) {
  const handlerRef = useRef(onKey);

  useLayoutEffect(() => {
    handlerRef.current = onKey;
  });

  useEffect(() => {
    if (!enabled) return undefined;

    const handleKeyDown = (event) => {
      if (event.target.closest?.('input, textarea')) return;
      if (handlerRef.current(event)) event.preventDefault();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [enabled]);
}
