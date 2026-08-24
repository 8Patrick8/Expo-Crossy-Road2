// Seeded PRNG utilities for the daily challenge mode.
// `mulberry32` is a small, deterministic 32-bit PRNG; feeding it the same
// seed always yields the same sequence, which is what makes the daily
// challenge reproducible across devices on the same calendar day.

export function mulberry32(seed: number): () => number {
  let state = seed >>> 0;

  return function next() {
    state = (state + 0x6d2b79f5) | 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Stable FNV-1a hash of a "YYYY-MM-DD" string into an unsigned 32-bit seed.
export function deriveDailySeed(dateKey: string = getTodayKey()): number {
  let hash = 0x811c9dc5;
  for (let i = 0; i < dateKey.length; i++) {
    hash ^= dateKey.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193);
  }
  return hash >>> 0;
}

// Time-based seed so every classic run is (in practice) different.
export function deriveClassicSeed(): number {
  return Date.now() >>> 0;
}

// Local calendar date as "YYYY-MM-DD".
export function getTodayKey(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}
