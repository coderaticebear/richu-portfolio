import { createShaderPass, GLSL_NOISE } from "@/lib/canvas/gl";
import type { ThemeColors } from "@/lib/canvas/theme-colors";
import type { CanvasEffect } from "@/lib/canvas/use-canvas-effect";

/*
  E — Case Files (Projects).
  Two states in one shader: static (the messy problem, with a ghost of the
  structure torn through it) and a clean diagram of what was built. A
  noise-threshold dissolve with a burning amber edge moves between them.
  kind 0 draws linked database tables (School ERP); kind 1 draws a router
  fanning requests out to services (Leaf PHP). Everything is signed
  distance fields, so it stays sharp at any size. Colors are mixed toward
  the theme's ink/amber rather than added, so it reads on both themes.
*/

const FRAGMENT = /* glsl */ `precision highp float;
uniform vec2 u_res;
uniform float u_time;
uniform float u_progress;
uniform float u_kind;
uniform float u_dpr;
uniform vec3 u_bg;
uniform vec3 u_ink;
uniform vec3 u_line;
uniform vec3 u_burn;
${GLSL_NOISE}
float px;
float sdSeg(vec2 p, vec2 a, vec2 b){ vec2 pa = p - a, ba = b - a; float h = clamp(dot(pa, ba)/dot(ba, ba), 0.0, 1.0); return length(pa - ba*h); }
float sdRBox(vec2 p, vec2 b, float r){ vec2 q = abs(p) - b + r; return length(max(q, 0.0)) + min(max(q.x, q.y), 0.0) - r; }
float stroke(float d, float w){ return 1.0 - smoothstep(w, w + 1.5*px, abs(d)); }
float fillIn(float d){ return 1.0 - smoothstep(-px, px, d); }
float dotAt(vec2 p, vec2 c, float r){ return 1.0 - smoothstep(r, r + 1.5*px, length(p - c)); }
float elbow(vec2 p, vec2 a, vec2 e, float mx){
  float d = sdSeg(p, a, vec2(mx, a.y));
  d = min(d, sdSeg(p, vec2(mx, a.y), vec2(mx, e.y)));
  return min(d, sdSeg(p, vec2(mx, e.y), e));
}
vec2 tC(float i, float j, float asp){ return vec2(asp*(0.19 + 0.31*i), 0.29 + 0.43*j); }
vec2 tB(float i, float j, float asp){ return vec2(asp*0.085, 0.115 + 0.035*hash(vec2(i, j + 3.0))); }

// School ERP: six tables with header bands and rows, joined by relations.
vec2 relational(vec2 p, float asp, float t){
  float L = 0.0, H = 0.0;
  float w = 0.55*u_dpr*px;
  for (int ii = 0; ii < 3; ii++){
    for (int jj = 0; jj < 2; jj++){
      float i = float(ii), j = float(jj);
      vec2 c = tC(i, j, asp), b = tB(i, j, asp);
      vec2 q = p - c;
      float d = sdRBox(q, b, 0.014);
      L += stroke(d, w);
      H += 0.45*fillIn(sdRBox(q - vec2(0.0, b.y - 0.021), vec2(b.x, 0.021), 0.0))*fillIn(d);
      float active = floor(mod(t*0.7 + i*1.3 + j*2.1, 4.0));
      for (int kk = 0; kk < 4; kk++){
        float k = float(kk);
        float y = c.y + b.y - 0.072 - k*0.045;
        float len = 0.35 + 0.5*hash(vec2(i*7.0 + k, j));
        vec2 a0 = vec2(c.x - b.x + 0.024, y);
        vec2 a1 = vec2(a0.x + (2.0*b.x - 0.048)*len, y);
        float s = stroke(sdSeg(p, a0, a1), w)*step(c.y - b.y + 0.02, y);
        L += 0.45*s;
        H += 0.9*s*(1.0 - step(0.1, abs(k - active)));
      }
    }
  }
  vec2 a = tC(0.0, 0.0, asp) + vec2(tB(0.0, 0.0, asp).x, -0.03);
  vec2 e = tC(1.0, 0.0, asp) - vec2(tB(1.0, 0.0, asp).x, 0.03);
  L += stroke(sdSeg(p, a, e), w) + dotAt(p, a, 0.006) + dotAt(p, e, 0.006);
  H += dotAt(p, mix(a, e, fract(t*0.32)), 0.006);
  a = tC(0.0, 1.0, asp) + vec2(tB(0.0, 1.0, asp).x, -0.03);
  e = tC(1.0, 1.0, asp) - vec2(tB(1.0, 1.0, asp).x, 0.03);
  L += stroke(sdSeg(p, a, e), w) + dotAt(p, a, 0.006) + dotAt(p, e, 0.006);
  H += dotAt(p, mix(a, e, fract(t*0.32 + 0.5)), 0.006);
  a = tC(1.0, 0.0, asp) + vec2(tB(1.0, 0.0, asp).x, 0.02);
  e = tC(2.0, 1.0, asp) - vec2(tB(2.0, 1.0, asp).x, 0.02);
  L += stroke(elbow(p, a, e, mix(a.x, e.x, 0.35)), w) + dotAt(p, a, 0.006) + dotAt(p, e, 0.006);
  a = tC(1.0, 1.0, asp) + vec2(tB(1.0, 1.0, asp).x, -0.02);
  e = tC(2.0, 0.0, asp) - vec2(tB(2.0, 0.0, asp).x, -0.02);
  L += stroke(elbow(p, a, e, mix(a.x, e.x, 0.65)), w) + dotAt(p, a, 0.006) + dotAt(p, e, 0.006);
  return vec2(L, H);
}

// Leaf PHP: one router, three services, two endpoints each; routes light in turn.
vec2 router(vec2 p, float asp, float t){
  float L = 0.0, H = 0.0;
  float w = 0.55*u_dpr*px;
  vec2 root = vec2(asp*0.12, 0.5);
  float rr = 0.055;
  L += stroke(length(p - root) - rr, w);
  H += 0.8*fillIn(length(p - root) - 0.018);
  float active = floor(mod(t*0.9, 6.0));
  float mx1 = asp*0.29, mx2 = asp*0.66;
  for (int ii = 0; ii < 3; ii++){
    float i = float(ii);
    vec2 c = vec2(asp*0.47, 0.2 + 0.3*i), cb = vec2(asp*0.075, 0.042);
    float dc = sdRBox(p - c, cb, 0.012);
    float childOn = 1.0 - step(0.1, abs(floor(active/2.0) - i));
    L += stroke(dc, w) + 0.4*stroke(sdSeg(p, c - vec2(cb.x - 0.02, 0.0), c + vec2(cb.x*0.1, 0.0)), w);
    H += childOn*0.3*fillIn(dc);
    float de = elbow(p, root + vec2(rr, 0.0), c - vec2(cb.x, 0.0), mx1);
    L += 0.8*stroke(de, w);
    H += childOn*stroke(de, w*1.5);
    for (int kk = 0; kk < 2; kk++){
      float k = float(kk);
      vec2 l = vec2(asp*0.82, c.y + (k - 0.5)*0.12), lb = vec2(asp*0.085, 0.034);
      float dl = sdRBox(p - l, lb, 0.01);
      float leafOn = 1.0 - step(0.1, abs(active - (i*2.0 + k)));
      L += stroke(dl, w) + 0.4*stroke(sdSeg(p, l - vec2(lb.x - 0.02, 0.0), l + vec2(lb.x*0.2, 0.0)), w);
      H += leafOn*0.45*fillIn(dl);
      float dk = elbow(p, c + vec2(cb.x, 0.0), l - vec2(lb.x, 0.0), mx2);
      L += 0.8*stroke(dk, w);
      H += leafOn*stroke(dk, w*1.5);
    }
  }
  return vec2(L, H);
}

void main(){
  px = 1.0 / u_res.y;
  vec2 uv = gl_FragCoord.xy / u_res;
  float asp = u_res.x / u_res.y;
  vec2 p = vec2(uv.x*asp, uv.y);

  // resolved: dot grid + diagram
  vec2 sB = u_kind < 0.5 ? relational(p, asp, u_time) : router(p, asp, u_time);
  vec2 g = fract(p*24.0) - 0.5;
  vec3 colB = mix(u_bg, u_ink, 0.07*(1.0 - smoothstep(0.05, 0.1, length(g))));
  colB = mix(colB, u_ink, 0.6*clamp(sB.x, 0.0, 1.0));
  colB = mix(colB, u_line, clamp(sB.y, 0.0, 1.0));

  // noise: fog, static, and the structure torn through it
  vec2 jit = vec2((noise(vec2(p.y*26.0, u_time*3.0)) - 0.5)*0.09, 0.0);
  vec2 sG = u_kind < 0.5 ? relational(p + jit, asp, 0.0) : router(p + jit, asp, 0.0);
  float grain = hash(floor(gl_FragCoord.xy / (2.0*u_dpr)) + floor(mod(u_time*18.0, 997.0)));
  float tear = step(0.55, noise(vec2(p.y*38.0, u_time*5.0)));
  vec3 colA = mix(u_bg, u_ink, 0.06*fbm(p*4.0 + u_time*0.08));
  colA += (u_ink - u_bg)*(grain - 0.5)*0.11;
  colA = mix(colA, u_ink, 0.2*clamp(sG.x, 0.0, 1.0)*tear);

  // dissolve with a burning edge while it moves
  float n = fbm(p*3.2 + vec2(3.7, 1.9));
  float th = u_progress*1.3 - 0.15;
  vec3 col = mix(colB, colA, smoothstep(th - 0.03, th, n));
  float moving = step(0.002, u_progress)*step(u_progress, 0.998);
  col = mix(col, u_burn, (1.0 - smoothstep(0.0, 0.03, abs(n - th)))*moving);
  gl_FragColor = vec4(col, 1.0);
}`;

export interface CaseFile extends CanvasEffect {
  /** 0 = static, 1 = resolved diagram. */
  setTarget(value: number): void;
}

export function createCaseFile(
  canvas: HTMLCanvasElement,
  colors: ThemeColors,
  kind: "relational" | "router",
): CaseFile | null {
  const pass = createShaderPass(canvas, FRAGMENT);
  if (!pass) return null;
  const { gl, u } = pass;
  let theme = colors;
  let dpr = 1;
  let progress = 0;
  let target = 0;

  return {
    frame(time, dt) {
      progress = dt > 0 ? progress + (target - progress) * (1 - Math.exp(-2.6 * dt)) : target;
      if (Math.abs(target - progress) < 0.002) progress = target;
      gl.uniform2f(u.u_res, canvas.width, canvas.height);
      gl.uniform1f(u.u_time, time + 3);
      gl.uniform1f(u.u_progress, progress);
      gl.uniform1f(u.u_kind, kind === "relational" ? 0 : 1);
      gl.uniform1f(u.u_dpr, dpr);
      gl.uniform3fv(u.u_bg, theme.surface);
      gl.uniform3fv(u.u_ink, theme.ink);
      gl.uniform3fv(u.u_line, theme.dark ? theme.accent : theme.accentLine);
      gl.uniform3fv(u.u_burn, theme.accent);
      pass.draw();
    },
    resize(_w, _h, nextDpr) {
      dpr = nextDpr;
    },
    setTheme(next) {
      theme = next;
    },
    setTarget(value) {
      target = value;
    },
    dispose() {
      pass.dispose();
    },
  };
}
