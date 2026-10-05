import type { SkillGroup, SkillGroupKey } from "@/lib/types";
import { clamp, lerp, mulberry32 } from "@/lib/canvas/noise";
import { css, readFonts, type ThemeColors } from "@/lib/canvas/theme-colors";
import type { CanvasEffect } from "@/lib/canvas/use-canvas-effect";

/*
  C — Ping the Stack (Skills).
  Every skill is a node, clustered by group and laid out once with a small
  force simulation. A ping runs a breadth-first search from one skill and
  the reply travels hop by hop: packets along the links, rings on arrival,
  and a terminal-style log the section shows under the map.
*/

const ANCHORS: Record<SkillGroupKey, [number, number]> = {
  net: [0.14, 0.3],
  itsm: [0.4, 0.24],
  docs: [0.66, 0.2],
  tools: [0.86, 0.44],
  code: [0.62, 0.76],
  os: [0.18, 0.78],
};
const HOP = 0.42; // seconds per hop
const TAU = Math.PI * 2;

interface SkillNode {
  name: string;
  label: string;
  group: SkillGroupKey;
  x: number;
  y: number;
  fx: number;
  fy: number;
  showLabel: boolean;
}

interface Ping {
  source: number;
  level: Int16Array;
  max: number;
  order: number[];
  printed: number;
  done: boolean;
  start: number;
}

export interface PingSummary {
  name: string;
  reached: number;
  hops: number;
}

export interface SkillNetwork extends CanvasEffect {
  /** `instant` shows the finished result at once (paused / reduced motion). */
  ping(name: string, instant: boolean): PingSummary | null;
  /** Hit-test in CSS pixels; highlights and returns the skill under the pointer. */
  hoverAt(x: number, y: number): string | null;
  clearHover(): void;
  onLog(listener: (text: string) => void): void;
}

export function createSkillNetwork(
  canvas: HTMLCanvasElement,
  colors: ThemeColors,
  groups: SkillGroup[],
  links: [string, string][],
): SkillNetwork | null {
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;
  const fonts = readFonts();
  let theme = colors;
  let W = 1;
  let H = 1;
  let dpr = 1;
  let fontPx = 11.5;

  const nodes: SkillNode[] = groups.flatMap((g) =>
    g.items.map((item) => ({
      name: item.name,
      label: item.short ?? item.name,
      group: g.key,
      x: 0,
      y: 0,
      fx: 0,
      fy: 0,
      showLabel: true,
    })),
  );
  const index = new Map(nodes.map((n, i) => [n.name, i]));
  const edges = links
    .map(([a, b]) => [index.get(a), index.get(b)] as const)
    .filter((e): e is readonly [number, number] => e[0] !== undefined && e[1] !== undefined);
  const adjacent = nodes.map(() => [] as number[]);
  for (const [a, b] of edges) {
    adjacent[a].push(b);
    adjacent[b].push(a);
  }

  let ping: Ping | null = null;
  let hover = -1;
  let clock = 0;
  let autoPinged = false;
  let log: (text: string) => void = () => {};
  let lines: string[] = [];

  const layout = () => {
    const aspect = W / H;
    const rand = mulberry32(3);
    for (const n of nodes) {
      const a = ANCHORS[n.group];
      n.x = a[0] + (rand() - 0.5) * 0.18;
      n.y = a[1] + (rand() - 0.5) * 0.18;
    }
    // 1) Forces. Repulsion uses a wide ellipse because labels run sideways.
    const ITER = 320;
    for (let it = 0; it < ITER; it++) {
      const cool = 1 - it / ITER;
      for (const n of nodes) {
        n.fx = 0;
        n.fy = 0;
      }
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const a = nodes[i];
          const b = nodes[j];
          const dx = (b.x - a.x) * aspect;
          const dy = b.y - a.y;
          const ex = dx / 2.4;
          const d2 = ex * ex + dy * dy + 1e-4;
          if (d2 > 0.09) continue;
          const f = 0.00006 / (d2 * Math.sqrt(d2));
          a.fx -= dx * f;
          a.fy -= dy * f;
          b.fx += dx * f;
          b.fy += dy * f;
        }
      }
      for (const [i, j] of edges) {
        const a = nodes[i];
        const b = nodes[j];
        const dx = (b.x - a.x) * aspect;
        const dy = b.y - a.y;
        const d = Math.sqrt(dx * dx + dy * dy) + 1e-6;
        const k = (d - 0.2) * 0.02;
        a.fx += (dx / d) * k;
        a.fy += (dy / d) * k;
        b.fx -= (dx / d) * k;
        b.fy -= (dy / d) * k;
      }
      for (const n of nodes) {
        const a = ANCHORS[n.group];
        n.fx += (a[0] - n.x) * aspect * 0.04;
        n.fy += (a[1] - n.y) * 0.04;
        n.x = clamp(n.x + clamp(n.fx / aspect, -0.015, 0.015) * cool, 0.05, 0.95);
        n.y = clamp(n.y + clamp(n.fy, -0.015, 0.015) * cool, 0.07, 0.93);
      }
    }
    // 2) Treat labels as boxes and push overlapping pairs apart along the
    //    axis that overlaps less.
    const charW = fontPx * 0.56 * dpr;
    const lineH = fontPx * 1.5 * dpr;
    const pad = 5 * dpr;
    const box = (n: SkillNode) => {
      const x = n.x * W;
      const y = n.y * H;
      const tw = n.label.length * charW;
      return n.x < 0.74
        ? [x - 5 * dpr, x + 8 * dpr + tw, y - lineH / 2, y + lineH / 2]
        : [x - 8 * dpr - tw, x + 5 * dpr, y - lineH / 2, y + lineH / 2];
    };
    const overlaps = (a: number[], b: number[]) =>
      Math.min(a[1], b[1]) - Math.max(a[0], b[0]) + pad > 0 &&
      Math.min(a[3], b[3]) - Math.max(a[2], b[2]) + pad > 0;
    for (let it = 0; it < 400; it++) {
      let moved = false;
      const boxes = nodes.map(box);
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const a = boxes[i];
          const b = boxes[j];
          const ox = Math.min(a[1], b[1]) - Math.max(a[0], b[0]) + pad;
          const oy = Math.min(a[3], b[3]) - Math.max(a[2], b[2]) + pad;
          if (ox <= 0 || oy <= 0) continue;
          moved = true;
          const ni = nodes[i];
          const nj = nodes[j];
          if (oy <= ox || it < 120) {
            const s = ((ni.y <= nj.y ? -1 : 1) * (oy / 2 + 0.5)) / H;
            ni.y = clamp(ni.y + s, 0.05, 0.95);
            nj.y = clamp(nj.y - s, 0.05, 0.95);
          } else {
            const s = ((ni.x <= nj.x ? -1 : 1) * (ox / 2 + 0.5)) / W;
            ni.x = clamp(ni.x + s, 0.04, 0.96);
            nj.x = clamp(nj.x - s, 0.04, 0.96);
          }
        }
      }
      if (!moved) break;
    }
    // 3) If a small screen still can't fit every name, drop the labels
    //    that collide (best-connected skills keep theirs). The full list
    //    is always in the HTML below the map.
    const accepted: number[][] = [];
    const byDegree = nodes.map((_, i) => i).sort((a, b) => adjacent[b].length - adjacent[a].length);
    for (const i of byDegree) {
      const b = box(nodes[i]);
      nodes[i].showLabel = !accepted.some((a) => overlaps(a, b));
      if (nodes[i].showLabel) accepted.push(b);
    }
  };

  const writeLog = () => log(lines.slice(-5).join("\n"));

  const advanceLog = (elapsed: number) => {
    if (!ping) return;
    let changed = false;
    while (ping.printed < ping.order.length && ping.level[ping.order[ping.printed]] * HOP <= elapsed) {
      const i = ping.order[ping.printed++];
      lines.push(`reply from ${nodes[i].label.padEnd(18)} hops=${ping.level[i]}`);
      changed = true;
    }
    if (!ping.done && ping.printed === ping.order.length && elapsed >= ping.max * HOP) {
      ping.done = true;
      lines.push(`--- ${ping.order.length} skills reached, ${ping.max} hops max`);
      changed = true;
    }
    if (changed) writeLog();
  };

  const startPing = (source: number, instant: boolean): PingSummary => {
    const level = new Int16Array(nodes.length).fill(-1);
    level[source] = 0;
    const queue = [source];
    while (queue.length) {
      const u = queue.shift()!;
      for (const v of adjacent[u]) {
        if (level[v] < 0) {
          level[v] = level[u] + 1;
          queue.push(v);
        }
      }
    }
    let max = 0;
    for (const l of level) max = Math.max(max, l);
    const order = nodes
      .map((_, i) => i)
      .filter((i) => i !== source && level[i] >= 0)
      .sort((a, b) => level[a] - level[b]);
    ping = { source, level, max, order, printed: 0, done: false, start: instant ? clock - max * HOP - 0.001 : clock };
    lines = [`$ ping "${nodes[source].label}"`];
    writeLog();
    if (instant) advanceLog(max * HOP + 0.001);
    return { name: nodes[source].name, reached: order.length, hops: max };
  };

  const draw = () => {
    const line = theme.dark ? theme.accent : theme.accentLine;
    ctx.clearRect(0, 0, W, H);
    const elapsed = ping ? clock - ping.start : 0;
    let fade = 0;
    if (ping) {
      fade = clamp(1 - (elapsed - (ping.max * HOP + 2.6)) / 0.8, 0, 1);
      if (fade <= 0) ping = null;
      else advanceLog(elapsed);
    }
    const X = (n: SkillNode) => n.x * W;
    const Y = (n: SkillNode) => n.y * H;

    ctx.lineWidth = dpr;
    for (const [a, b] of edges) {
      let lit = 0;
      if (ping) {
        const la = ping.level[a];
        const lb = ping.level[b];
        if (la >= 0 && lb >= 0 && Math.abs(la - lb) === 1 && elapsed >= Math.max(la, lb) * HOP) lit = fade;
      }
      const nearHover = hover >= 0 && (a === hover || b === hover);
      ctx.strokeStyle =
        lit > 0 ? css(line, 0.18 + 0.5 * lit) : nearHover ? css(line, 0.6) : css(theme.ink, theme.dark ? 0.09 : 0.12);
      ctx.beginPath();
      ctx.moveTo(X(nodes[a]), Y(nodes[a]));
      ctx.lineTo(X(nodes[b]), Y(nodes[b]));
      ctx.stroke();
    }

    if (ping) {
      ctx.fillStyle = theme.dark ? "#ffe9c7" : css(line);
      for (const [a, b] of edges) {
        for (const [u, v] of [
          [a, b],
          [b, a],
        ]) {
          if (ping.level[u] < 0 || ping.level[v] !== ping.level[u] + 1) continue;
          const s = (elapsed - ping.level[u] * HOP) / HOP;
          if (s <= 0 || s >= 1) continue;
          ctx.beginPath();
          ctx.arc(lerp(X(nodes[u]), X(nodes[v]), s), lerp(Y(nodes[u]), Y(nodes[v]), s), 2.4 * dpr, 0, TAU);
          ctx.fill();
        }
      }
    }

    ctx.font = `${fontPx * dpr}px ${fonts.sans}`;
    ctx.textBaseline = "middle";
    nodes.forEach((n, i) => {
      const x = X(n);
      const y = Y(n);
      const lv = ping ? ping.level[i] : -1;
      const reached = !!ping && lv >= 0 && elapsed >= lv * HOP;
      const isSource = !!ping && i === ping.source;
      const near = i === hover || (hover >= 0 && adjacent[hover].includes(i));
      const r = (isSource ? 5 : 3.4) * dpr;
      ctx.fillStyle = reached ? css(line, 0.35 + 0.65 * fade) : near ? css(theme.ink) : css(theme.recede, 0.8);
      ctx.beginPath();
      ctx.arc(x, y, r, 0, TAU);
      ctx.fill();
      if (reached) {
        const since = elapsed - lv * HOP;
        if (since < 0.7) {
          ctx.strokeStyle = css(line, (1 - since / 0.7) * fade);
          ctx.beginPath();
          ctx.arc(x, y, r + since * 26 * dpr, 0, TAU);
          ctx.stroke();
        }
      }
      if (!n.showLabel && i !== hover) return;
      ctx.fillStyle = (reached && fade > 0.4) || near ? css(theme.ink) : css(theme.muted, 0.9);
      const right = n.x < 0.74;
      ctx.textAlign = right ? "left" : "right";
      ctx.fillText(n.label, x + (right ? 8 : -8) * dpr, y);
    });
    ctx.textAlign = "left";
  };

  return {
    frame(time, dt) {
      clock = time;
      // One ping on its own the first time the map is running on screen.
      if (!autoPinged && dt > 0 && time > 0.6) {
        autoPinged = true;
        startPing(index.get("DNS") ?? 0, false);
      }
      draw();
    },
    resize(w, h, nextDpr) {
      W = w;
      H = h;
      dpr = nextDpr;
      fontPx = w / dpr < 640 ? 10 : 11.5;
      layout();
    },
    setTheme(next) {
      theme = next;
    },
    ping(name, instant) {
      const i = index.get(name);
      if (i === undefined) return null;
      autoPinged = true;
      return startPing(i, instant);
    },
    hoverAt(x, y) {
      let best = -1;
      let bestDist = 18 * dpr;
      nodes.forEach((n, i) => {
        const d = Math.hypot(n.x * W - x * dpr, n.y * H - y * dpr);
        if (d < bestDist) {
          bestDist = d;
          best = i;
        }
      });
      hover = best;
      return best >= 0 ? nodes[best].name : null;
    },
    clearHover() {
      hover = -1;
    },
    onLog(listener) {
      log = listener;
    },
    dispose() {
      ping = null;
    },
  };
}
