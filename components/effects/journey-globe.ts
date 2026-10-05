import type { Place } from "@/lib/types";
import { css, readFonts, type ThemeColors } from "@/lib/canvas/theme-colors";
import type { CanvasEffect } from "@/lib/canvas/use-canvas-effect";

/*
  D — Kerala to Toronto (Experience).
  A dotted globe (Natural Earth land, ~3.8k dots) in orthographic
  projection, with the great-circle arc between the two places Richu has
  worked. `focus` is a position along that arc, 0 = from, 1 = to; the
  camera eases toward it, so scrolling the role list flies the view.
*/

type Vec3 = [number, number, number];
const TAU = Math.PI * 2;
const D2R = Math.PI / 180;

const toVec = (lat: number, lon: number): Vec3 => [
  Math.cos(lat * D2R) * Math.cos(lon * D2R),
  Math.cos(lat * D2R) * Math.sin(lon * D2R),
  Math.sin(lat * D2R),
];

export interface JourneyGlobe extends CanvasEffect {
  /**
   * Point the camera at `s` along the arc. With `follow`, a marker rides
   * the arc and the nearer place pulses; without it the globe just shows
   * the whole route.
   */
  setFocus(s: number, follow: boolean): void;
}

export function createJourneyGlobe(
  canvas: HTMLCanvasElement,
  colors: ThemeColors,
  land: number[],
  from: Place,
  to: Place,
): JourneyGlobe | null {
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;
  const fonts = readFonts();
  let theme = colors;
  let W = 1;
  let H = 1;
  let dpr = 1;

  // Land dots as unit vectors, once.
  const count = land.length / 2;
  const dots = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const [x, y, z] = toVec(land[2 * i] / 10, land[2 * i + 1] / 10);
    dots[3 * i] = x;
    dots[3 * i + 1] = y;
    dots[3 * i + 2] = z;
  }

  const A = toVec(from.lat, from.lon);
  const B = toVec(to.lat, to.lon);
  const omega = Math.acos(A[0] * B[0] + A[1] * B[1] + A[2] * B[2]);
  const slerp = (s: number): Vec3 => {
    const k1 = Math.sin((1 - s) * omega) / Math.sin(omega);
    const k2 = Math.sin(s * omega) / Math.sin(omega);
    return [A[0] * k1 + B[0] * k2, A[1] * k1 + B[1] * k2, A[2] * k1 + B[2] * k2];
  };

  let focus = 0.5;
  let target = 0.5;
  let follow = false;

  const draw = (time: number) => {
    ctx.clearRect(0, 0, W, H);
    const R = Math.min(W, H) * 0.42;
    const cx = W / 2;
    const cy = H / 2;
    const c = slerp(focus);
    // Tilt the view a little south of the focus so the arc's lift reads.
    const lat0 = Math.asin(c[2]) - 0.12;
    const lon0 = Math.atan2(c[1], c[0]) + 0.05 * Math.sin(time * 0.25);
    const cl = Math.cos(lon0);
    const sl = Math.sin(lon0);
    const cp = Math.cos(lat0);
    const sp = Math.sin(lat0);
    const project = (x: number, y: number, z: number): Vec3 => {
      const x1 = x * cl + y * sl;
      const y1 = -x * sl + y * cl;
      return [cx + R * y1, cy - R * (-x1 * sp + z * cp), x1 * cp + z * sp];
    };
    const line = theme.dark ? theme.accent : theme.accentLine;

    // atmosphere, disc, rim
    const halo = ctx.createRadialGradient(cx, cy, R * 0.92, cx, cy, R * 1.28);
    halo.addColorStop(0, css(theme.accent, theme.dark ? 0.1 : 0.14));
    halo.addColorStop(1, css(theme.accent, 0));
    ctx.fillStyle = halo;
    ctx.beginPath();
    ctx.arc(cx, cy, R * 1.28, 0, TAU);
    ctx.fill();
    ctx.fillStyle = css(theme.surface);
    ctx.beginPath();
    ctx.arc(cx, cy, R, 0, TAU);
    ctx.fill();
    ctx.strokeStyle = css(theme.ink, 0.08);
    ctx.lineWidth = dpr;
    ctx.stroke();

    // land: only the near hemisphere, dimmer and smaller toward the limb
    const size = Math.max(1, R * 0.0075);
    ctx.fillStyle = css(theme.ink);
    for (let i = 0; i < count; i++) {
      const x = dots[3 * i];
      const y = dots[3 * i + 1];
      const z = dots[3 * i + 2];
      const x1 = x * cl + y * sl;
      const depth = x1 * cp + z * sp;
      if (depth <= 0.02) continue;
      const y1 = -x * sl + y * cl;
      const sy = -x1 * sp + z * cp;
      const ss = size * (0.55 + 0.45 * depth);
      ctx.globalAlpha = theme.dark ? 0.1 + 0.55 * depth : 0.22 + 0.55 * depth;
      ctx.fillRect(cx + R * y1 - ss / 2, cy - R * sy - ss / 2, ss, ss);
    }
    ctx.globalAlpha = 1;

    // the route, lifted off the surface at its middle
    ctx.save();
    ctx.lineWidth = 1.8 * dpr;
    ctx.strokeStyle = css(line, 0.9);
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    if (theme.dark) {
      ctx.shadowColor = css(theme.accent, 0.7);
      ctx.shadowBlur = 10 * dpr;
    }
    ctx.beginPath();
    let drawing = false;
    for (let k = 0; k <= 96; k++) {
      const s = k / 96;
      const v = slerp(s);
      const lift = 1 + 0.18 * Math.sin(Math.PI * s);
      const [px, py, depth] = project(v[0] * lift, v[1] * lift, v[2] * lift);
      // Behind the globe only if it's both on the far side and inside the disc.
      const visible = depth > 0 || Math.hypot(px - cx, py - cy) > R;
      if (!visible) {
        drawing = false;
        continue;
      }
      if (drawing) ctx.lineTo(px, py);
      else ctx.moveTo(px, py);
      drawing = true;
    }
    ctx.stroke();
    ctx.restore();

    // places
    ctx.font = `500 ${11 * dpr}px ${fonts.mono}`;
    ctx.textBaseline = "middle";
    const marker = (v: Vec3, label: string, active: boolean) => {
      const [x, y, depth] = project(v[0], v[1], v[2]);
      if (depth <= 0) return;
      ctx.fillStyle = css(line);
      ctx.beginPath();
      ctx.arc(x, y, 3.2 * dpr, 0, TAU);
      ctx.fill();
      if (active) {
        const phase = (time * 0.7) % 1;
        ctx.strokeStyle = css(line, 0.7 * (1 - phase));
        ctx.lineWidth = dpr;
        ctx.beginPath();
        ctx.arc(x, y, (4 + phase * 22) * dpr, 0, TAU);
        ctx.stroke();
      }
      ctx.fillStyle = css(theme.ink, 0.85);
      ctx.fillText(label.toUpperCase(), x + 9 * dpr, y - 10 * dpr);
    };
    marker(A, from.label, follow && focus < 0.5);
    marker(B, to.label, follow && focus >= 0.5);

    // a traveller riding the arc while the camera flies
    if (follow && focus > 0.03 && focus < 0.97) {
      const v = slerp(focus);
      const lift = 1 + 0.18 * Math.sin(Math.PI * focus);
      const [x, y] = project(v[0] * lift, v[1] * lift, v[2] * lift);
      ctx.save();
      ctx.fillStyle = theme.dark ? "#fff3e0" : css(line);
      if (theme.dark) {
        ctx.shadowColor = css(theme.accent);
        ctx.shadowBlur = 14 * dpr;
      }
      ctx.beginPath();
      ctx.arc(x, y, 3 * dpr, 0, TAU);
      ctx.fill();
      ctx.restore();
    }
  };

  return {
    frame(time, dt) {
      focus = dt > 0 ? focus + (target - focus) * (1 - Math.exp(-4 * dt)) : target;
      draw(time);
    },
    resize(w, h, nextDpr) {
      W = w;
      H = h;
      dpr = nextDpr;
    },
    setTheme(next) {
      theme = next;
    },
    setFocus(s, nextFollow) {
      target = Math.min(1, Math.max(0, s));
      follow = nextFollow;
    },
    dispose() {},
  };
}
