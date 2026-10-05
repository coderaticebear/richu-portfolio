import { clamp, curl, lerp, mulberry32, smoothstep, valueNoise } from "@/lib/canvas/noise";
import { css, mixRGB, readFonts, type ThemeColors } from "@/lib/canvas/theme-colors";
import type { CanvasEffect } from "@/lib/canvas/use-canvas-effect";

/*
  B — The Ticket Pipeline ("How I work").
  Tickets enter on the left as a curl-noise swarm, calm down through
  Reproduce, get pulled into a lane by cause during Isolate, then either
  merge into "resolved" or peel off to engineering. The four stages are
  equal quarters of the width, matching the step list under the canvas.
*/

// The three causes the résumé's work splits into: network faults,
// application behavior, and login/configuration ("access").
const LANES = [
  { name: "network", y: 0.32 },
  { name: "application", y: 0.5 },
  { name: "access", y: 0.68 },
];
const ESCALATE_RATE = 0.18;

interface Ticket {
  x: number;
  y: number;
  px: number;
  py: number;
  lane: number;
  escalate: boolean;
}

export interface TicketPipeline extends CanvasEffect {
  counts(): { resolved: number; escalated: number };
}

export function createTicketPipeline(canvas: HTMLCanvasElement, colors: ThemeColors): TicketPipeline | null {
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;
  const fonts = readFonts();
  const noise = valueNoise(7);
  let rand = mulberry32(42);
  let theme = colors;
  let W = 1;
  let H = 1;
  let dpr = 1;
  let tickets: Ticket[] = [];
  const counts = { resolved: 0, escalated: 0 };

  const spawn = (t: Ticket, anywhere: boolean): Ticket => {
    t.x = anywhere ? rand() * W : -rand() * W * 0.04;
    t.y = H * (0.14 + rand() * 0.74);
    t.px = t.x;
    t.py = t.y;
    t.lane = Math.floor(rand() * LANES.length);
    t.escalate = rand() < ESCALATE_RATE;
    return t;
  };

  const step = (time: number, dt: number) => {
    const speed = W * 0.06;
    const scale = W * 0.11;
    for (const t of tickets) {
      const xn = t.x / W;
      const chaos = 1 - smoothstep(0.08, 0.48, xn); // Intake → Reproduce
      const order = smoothstep(0.5, 0.66, xn); // Isolate
      const exit = smoothstep(0.75, 0.93, xn); // Escalate or resolve
      const [cx, cy] = curl(noise, t.x / scale, t.y / scale + time * 0.09);
      const swirl = W * 0.1 * chaos;
      const targetY = lerp(H * LANES[t.lane].y, t.escalate ? H * 0.12 : H * 0.5, exit);
      const vx = Math.max(speed * (0.55 + 0.45 * (1 - chaos)) + cx * swirl, -speed * 0.3);
      const vy = cy * swirl + (targetY - t.y) * order * 2.6;
      t.px = t.x;
      t.py = t.y;
      t.x = Math.max(t.x + vx * dt, -W * 0.06);
      t.y = clamp(t.y + vy * dt, 4, H - 4);
      if (t.x > W + 4) {
        if (t.escalate) counts.escalated++;
        else counts.resolved++;
        spawn(t, false);
      }
    }
  };

  const draw = () => {
    const done = theme.dark ? theme.accent : theme.accentLine;
    ctx.globalAlpha = 1;
    ctx.fillStyle = css(theme.bg, 0.2);
    ctx.fillRect(0, 0, W, H);
    ctx.lineWidth = 1.7 * dpr;
    ctx.lineCap = "round";
    for (const t of tickets) {
      const o = smoothstep(0.46, 0.7, t.x / W);
      ctx.globalAlpha = 0.45 + 0.55 * o;
      ctx.strokeStyle = css(mixRGB(theme.muted, t.escalate ? theme.ink : done, o));
      ctx.beginPath();
      ctx.moveTo(t.px, t.py);
      ctx.lineTo(t.x + 0.01, t.y);
      ctx.stroke();
    }
    ctx.globalAlpha = 1;
    ctx.font = `500 ${10.5 * dpr}px ${fonts.mono}`;
    ctx.textBaseline = "middle";
    ctx.textAlign = "left";
    ctx.fillStyle = css(theme.recede);
    for (const lane of LANES) ctx.fillText(lane.name, W * 0.515, H * lane.y - 12 * dpr);
    ctx.textAlign = "right";
    ctx.fillStyle = css(done);
    ctx.fillText("resolved →", W - 10 * dpr, H * 0.5 - 14 * dpr);
    ctx.fillStyle = css(theme.ink, 0.85);
    const engineeringY = H * 0.12 - 14 * dpr < 34 * dpr ? H * 0.12 + 16 * dpr : H * 0.12 - 14 * dpr;
    ctx.fillText("to engineering ↗", W - 10 * dpr, engineeringY);
    ctx.textAlign = "left";
  };

  // Lay out a fresh, already-flowing pipeline: fixed seed, then run a
  // couple of seconds so the still frame (reduced motion) is a full one.
  const reset = () => {
    rand = mulberry32(42);
    const count = W < 700 * dpr ? 150 : 260;
    tickets = Array.from({ length: count }, () => spawn({} as Ticket, true));
    ctx.fillStyle = css(theme.bg);
    ctx.fillRect(0, 0, W, H);
    for (let i = 0; i < 150; i++) {
      step(i / 60, 1 / 60);
      draw();
    }
    // The warm-up only fills the pipe; the tally counts what visitors watch.
    counts.resolved = 0;
    counts.escalated = 0;
  };

  return {
    frame(time, dt) {
      if (dt > 0) step(time, dt);
      draw();
    },
    resize(w, h, nextDpr) {
      W = w;
      H = h;
      dpr = nextDpr;
      reset();
    },
    setTheme(next) {
      theme = next;
      reset();
    },
    counts: () => ({ ...counts }),
    dispose() {
      tickets = [];
    },
  };
}
