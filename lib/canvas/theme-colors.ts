/**
 * Canvas and WebGL can't read CSS custom properties, so effects get the
 * theme as plain RGB triplets (0–1) read from the same tokens the rest of
 * the page uses. Re-read whenever the theme attribute on <html> flips.
 */
export type RGB = [number, number, number];

export interface ThemeColors {
  dark: boolean;
  bg: RGB;
  surface: RGB;
  ink: RGB;
  muted: RGB;
  recede: RGB;
  /** The bright brand amber, for fills and glows. */
  accent: RGB;
  /** The amber that stays legible as a thin line on this theme's background. */
  accentLine: RGB;
}

function parseColor(value: string): RGB {
  const v = value.trim();
  const hex = v.match(/^#([0-9a-f]{3}|[0-9a-f]{6})$/i);
  if (hex) {
    const h = hex[1].length === 3 ? hex[1].replace(/./g, (c) => c + c) : hex[1];
    return [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16) / 255) as RGB;
  }
  const rgb = v.match(/rgba?\(([^)]+)\)/i);
  if (rgb) {
    const [r, g, b] = rgb[1].split(/[\s,/]+/).map(Number);
    return [r / 255, g / 255, b / 255];
  }
  return [0, 0, 0];
}

export function readThemeColors(): ThemeColors {
  const style = getComputedStyle(document.documentElement);
  const get = (name: string) => parseColor(style.getPropertyValue(name));
  const bg = get("--color-bg");
  const dark = 0.2126 * bg[0] + 0.7152 * bg[1] + 0.0722 * bg[2] < 0.5;
  return {
    dark,
    bg,
    surface: get("--color-surface"),
    ink: get("--color-ink"),
    muted: get("--color-ink-muted"),
    recede: get("--color-ink-recede"),
    accent: get("--color-accent"),
    accentLine: get("--color-accent-text"),
  };
}

/** CSS color string from an RGB triplet, for Canvas 2D. */
export function css(c: RGB, alpha = 1): string {
  return `rgba(${Math.round(c[0] * 255)},${Math.round(c[1] * 255)},${Math.round(c[2] * 255)},${alpha})`;
}

export function mixRGB(a: RGB, b: RGB, t: number): RGB {
  return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t];
}
