const TOKENS = ['black', 'carbon', 'surface', 'red', 'green', 'purple', 'ink', 'muted', 'line'];

export function setupCanvas(canvas, width, height) {
  const ratio = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width = width * ratio;
  canvas.height = height * ratio;
  const ctx = canvas.getContext('2d');
  ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
  return ctx;
}

export function readPalette() {
  const styles = getComputedStyle(document.documentElement);
  const channels = Object.fromEntries(
    TOKENS.map((token) => [token, styles.getPropertyValue(`--color-${token}`).trim()]),
  );
  return (token, alpha = 1) => `rgb(${channels[token]} / ${alpha})`;
}
