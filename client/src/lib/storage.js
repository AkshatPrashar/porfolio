export function readNumber(key) {
  try {
    return Number(window.localStorage.getItem(key)) || 0;
  } catch {
    return 0;
  }
}

export function writeNumber(key, value) {
  try {
    window.localStorage.setItem(key, String(value));
  } catch {
    // Storage can be unavailable (private mode, blocked site data); the in-memory value still applies.
  }
}
