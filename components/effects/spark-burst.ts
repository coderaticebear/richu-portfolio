import { mulberry32 } from "@/lib/canvas/noise";
import { css, type ThemeColors } from "@/lib/canvas/theme-colors";
import type { CanvasEffect } from "@/lib/canvas/use-canvas-effect";

/*
  F — Open a Ticket (Contact).
  A one-second burst of sparks from the submit button: short life,
  gravity and drag, streaks along the velocity. Sparks rather than
  confetti, so it stays quiet. It runs its own frames only while sparks
  are alive; nothing ticks between submits.
*/

interface Spark {
  x: number;
  y: number;
  vx: number;
  vy: number;
  age: number;
  life: number;
  hot: boolean;
}

export interface SparkBurst extends CanvasEffect {
  /** Burst from a point in CSS pixels relative to the canvas. */
  burst(x: number, y: number): void;
}

export function createSparkBurst(canvas: HTMLCanvasElement, colors: ThemeColors): SparkBurst | null {
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;
  const rand = mulberry32(99);
  let theme = colors;
  let dpr = 1;
  let sparks: Spark[] = [];
  let raf = 0;
  let last = 0;

  const tick = (now: number) => {
    const dt = Math.min((now - last) / 1000, 1 / 30);
    last = now;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // Additive light on dark; plain paint on light, where "lighter" vanishes.
    ctx.globalCompositeOperation = theme.dark ? "lighter" : "source-over";
    ctx.lineCap = "round";
    sparks = sparks.filter((s) => (s.age += dt) < s.life);
    for (const s of sparks) {
      s.vy += 560 * dpr * dt;
      s.vx *= 1 - 2.4 * dt;
      s.vy *= 1 - 2.4 * dt;
      const x0 = s.x;
      const y0 = s.y;
      s.x += s.vx * dt;
      s.y += s.vy * dt;
      const k = 1 - s.age / s.life;
      const color = s.hot && theme.dark ? theme.ink : theme.dark ? theme.accent : theme.accentLine;
      ctx.strokeStyle = css(color, k);
      ctx.lineWidth = (s.hot ? 1.7 : 1.3) * dpr;
      ctx.beginPath();
      ctx.moveTo(x0 - s.vx * dt * 1.5, y0 - s.vy * dt * 1.5);
      ctx.lineTo(s.x, s.y);
      ctx.stroke();
    }
    ctx.globalCompositeOperation = "source-over";
    if (sparks.length) {
      raf = requestAnimationFrame(tick);
    } else {
      raf = 0;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  };

  return {
    frame() {
      // Nothing to draw between bursts.
    },
    resize(_w, _h, nextDpr) {
      dpr = nextDpr;
    },
    setTheme(next) {
      theme = next;
    },
    burst(x, y) {
      const ox = x * dpr;
      const oy = y * dpr;
      for (let i = 0; i < 90; i++) {
        const angle = -Math.PI / 2 + (rand() - 0.5) * Math.PI * 1.25;
        const speed = (170 + rand() * 380) * dpr;
        sparks.push({
          x: ox,
          y: oy,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          age: 0,
          life: 0.45 + rand() * 0.5,
          hot: rand() < 0.3,
        });
      }
      if (!raf) {
        last = performance.now();
        raf = requestAnimationFrame(tick);
      }
    },
    dispose() {
      cancelAnimationFrame(raf);
      sparks = [];
    },
  };
}
