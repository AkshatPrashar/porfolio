export function readString(key) {
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

export function writeString(key, value) {
  try {
    window.localStorage.setItem(key, value);
  } catch {
    // Storage can be unavailable (private mode, blocked site data); the in-memory value still applies.
  }
}

export const readNumber = (key) => Number(readString(key)) || 0;

export const writeNumber = (key, value) => writeString(key, String(value));
