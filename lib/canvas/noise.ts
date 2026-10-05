/** Seeded PRNG so every particle layout reproduces frame for frame. */
export function mulberry32(seed: number): () => number {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export type Noise2D = (x: number, y: number) => number;

/** Smooth 2D value noise in roughly [-1, 1]. */
export function valueNoise(seed: number): Noise2D {
  const rand = mulberry32(seed);
  const perm = new Uint8Array(512);
  const vals = new Float32Array(256);
  const p = Array.from({ length: 256 }, (_, i) => i);
  for (let i = 255; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [p[i], p[j]] = [p[j], p[i]];
  }
  for (let i = 0; i < 512; i++) perm[i] = p[i & 255];
  for (let i = 0; i < 256; i++) vals[i] = rand() * 2 - 1;
  const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
  return (x, y) => {
    const xi = Math.floor(x);
    const yi = Math.floor(y);
    const xf = x - xi;
    const yf = y - yi;
    const X = xi & 255;
    const Y = yi & 255;
    const u = xf * xf * (3 - 2 * xf);
    const v = yf * yf * (3 - 2 * yf);
    const a = vals[perm[X + perm[Y]]];
    const b = vals[perm[X + 1 + perm[Y]]];
    const c = vals[perm[X + perm[Y + 1]]];
    const d = vals[perm[X + 1 + perm[Y + 1]]];
    return lerp(lerp(a, b, u), lerp(c, d, u), v);
  };
}

/** Curl of a noise potential: a divergence-free, fluid-looking flow. */
export function curl(noise: Noise2D, x: number, y: number): [number, number] {
  const e = 0.01;
  return [
    (noise(x, y + e) - noise(x, y - e)) / (2 * e),
    -(noise(x + e, y) - noise(x - e, y)) / (2 * e),
  ];
}

export const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
export const smoothstep = (a: number, b: number, x: number) => {
  const t = clamp((x - a) / (b - a), 0, 1);
  return t * t * (3 - 2 * t);
};
