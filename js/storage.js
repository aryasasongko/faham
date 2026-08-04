/* Safe, versioned localStorage.
   Private browsing, a full quota, or a corrupted value must never take the app
   down — every failure degrades to an in-memory store that lasts the session. */

const memory = new Map();
let available = null;

function probe() {
  if (available !== null) return available;
  try {
    const k = '__faham_probe__';
    window.localStorage.setItem(k, '1');
    window.localStorage.removeItem(k);
    available = true;
  } catch (e) {
    available = false;
  }
  return available;
}

/** True when preferences will survive a reload. Shown in Settings. */
export function isPersistent() {
  return probe();
}

/**
 * Read and parse a JSON value.
 * Returns `fallback` for a missing key, malformed JSON, or a value whose type
 * does not match the fallback's — so a hand-edited or half-written record can
 * never crash a render.
 */
export function readJSON(key, fallback) {
  let raw = null;
  if (probe()) {
    try { raw = window.localStorage.getItem(key); } catch (e) { raw = null; }
  }
  if (raw === null && memory.has(key)) raw = memory.get(key);
  if (raw === null || raw === undefined) return fallback;

  let parsed;
  try { parsed = JSON.parse(raw); } catch (e) { return fallback; }
  if (parsed === null || typeof parsed !== typeof fallback) return fallback;
  if (Array.isArray(fallback) !== Array.isArray(parsed)) return fallback;
  return parsed;
}

/** Write a JSON value. Falls back to the session store when storage is closed. */
export function writeJSON(key, value) {
  let raw;
  try { raw = JSON.stringify(value); } catch (e) { return false; }
  memory.set(key, raw);
  if (!probe()) return false;
  try {
    window.localStorage.setItem(key, raw);
    return true;
  } catch (e) {
    return false;
  }
}

export function removeKey(key) {
  memory.delete(key);
  if (!probe()) return;
  try { window.localStorage.removeItem(key); } catch (e) { /* nothing to do */ }
}

/** Keep only the keys a schema knows about, so stray fields cannot leak in. */
export function pick(source, allowed) {
  const out = {};
  if (!source || typeof source !== 'object') return out;
  allowed.forEach((k) => {
    if (Object.prototype.hasOwnProperty.call(source, k)) out[k] = source[k];
  });
  return out;
}
