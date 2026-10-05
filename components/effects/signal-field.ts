import { createShaderPass, GLSL_NOISE } from "@/lib/canvas/gl";
import type { ThemeColors } from "@/lib/canvas/theme-colors";
import type { CanvasEffect } from "@/lib/canvas/use-canvas-effect";

/*
  A — Signal from Noise (hero).
  Grey fractal fog and static, with six oscilloscope traces that are broken
  and jittery everywhere except inside a soft lens. The lens follows a
  mouse, or drifts on its own path for touch and idle visitors.
*/

const FRAGMENT = /* glsl */ `precision highp float;
uniform vec2 u_res;
uniform float u_time;
uniform vec2 u_lens;
uniform float u_dpr;
uniform vec3 u_bg;
uniform vec3 u_ink;
uniform vec3 u_line;
uniform float u_dark;
${GLSL_NOISE}
void main(){
  vec2 uv = gl_FragCoord.xy / u_res;
  float asp = u_res.x / u_res.y;
  vec2 p = vec2(uv.x*asp, uv.y);
  float dist = length(p - vec2(u_lens.x*asp, u_lens.y));
  float lens = 1.0 - smoothstep(0.10, 0.36, dist);

  // drifting fog, pushed slightly toward the ink color
  vec2 q = vec2(fbm(p*1.6 + u_time*0.02), fbm(p*1.6 + vec2(5.2, 1.3) - u_time*0.015));
  float fog = fbm(p*2.0 + 2.5*q);
  vec3 col = mix(u_bg, u_ink, 0.07*fog);

  // static, suppressed inside the lens
  float grain = hash(floor(gl_FragCoord.xy / (2.0*u_dpr)) + floor(mod(u_time*20.0, 997.0))*vec2(7.13, 3.71));
  col += (u_ink - u_bg)*(grain - 0.5)*0.09*(1.0 - lens);

  float px = 1.0 / u_res.y;
  float amp = 0.0;
  for (int i = 0; i < 6; i++){
    float fi = float(i);
    float base = 0.14 + fi*0.145;
    float ph = u_time*(0.45 + fi*0.09) + fi*1.7;
    float f = 2.6 + fi*1.1;
    float clean = 0.030*sin(p.x*f + ph) + 0.012*sin(p.x*f*2.7 - ph*1.3);
    float jit = (noise(vec2(p.x*42.0 + fi*13.0, u_time*9.0 + fi*5.0)) - 0.5)*0.075
              + (noise(vec2(p.x*7.0 - u_time*1.2, fi*3.1)) - 0.5)*0.05;
    float d = abs(p.y - (base + clean + jit*(1.0 - lens)));
    float w = 0.8*u_dpr*px;
    float core = 1.0 - smoothstep(w, w + 1.5*u_dpr*px, d);
    float glow = exp(-d*90.0)*0.28;
    float drop = mix(step(0.42, noise(vec2(p.x*16.0 + fi*9.0, u_time*2.0 + fi))), 1.0, lens);
    amp += (core + glow)*mix(0.20, 1.0, lens)*drop;
  }
  // Dark theme: light adds up (glow). Light theme: ink lays down.
  vec3 lit = col + u_line*(amp + 0.025*lens);
  vec3 inked = mix(col, u_line, clamp(amp*0.9, 0.0, 1.0));
  col = mix(inked, lit, u_dark);

  vec2 v = uv - 0.5;
  col *= 1.0 - mix(0.12, 0.55, u_dark)*dot(v, v);
  gl_FragColor = vec4(col, 1.0);
}`;

export interface SignalField extends CanvasEffect {
  /** Pointer position in 0–1 canvas space, origin bottom-left. */
  setPointer(x: number, y: number): void;
  releasePointer(): void;
}

export function createSignalField(canvas: HTMLCanvasElement, colors: ThemeColors): SignalField | null {
  const pass = createShaderPass(canvas, FRAGMENT);
  if (!pass) return null;
  const { gl, u } = pass;
  let theme = colors;
  let dpr = 1;
  const lens = { x: 0.7, y: 0.6 };
  const target = { x: 0.7, y: 0.6 };
  let pointerAt = -Infinity;

  return {
    frame(time, dt) {
      // No pointer for a while: drift on a slow Lissajous path, right of the copy.
      if (performance.now() - pointerAt > 2500) {
        target.x = 0.68 + 0.2 * Math.sin(time * 0.31);
        target.y = 0.56 + 0.22 * Math.sin(time * 0.47 + 1.2);
      }
      const k = dt > 0 ? 1 - Math.exp(-5 * dt) : 1;
      lens.x += (target.x - lens.x) * k;
      lens.y += (target.y - lens.y) * k;

      gl.uniform2f(u.u_res, canvas.width, canvas.height);
      gl.uniform1f(u.u_time, time + 7);
      gl.uniform2f(u.u_lens, lens.x, lens.y);
      gl.uniform1f(u.u_dpr, dpr);
      gl.uniform3fv(u.u_bg, theme.bg);
      gl.uniform3fv(u.u_ink, theme.ink);
      gl.uniform3fv(u.u_line, theme.dark ? theme.accent : theme.accentLine);
      gl.uniform1f(u.u_dark, theme.dark ? 1 : 0);
      pass.draw();
    },
    resize(_w, _h, nextDpr) {
      dpr = nextDpr;
    },
    setTheme(next) {
      theme = next;
    },
    setPointer(x, y) {
      target.x = x;
      target.y = y;
      pointerAt = performance.now();
    },
    releasePointer() {
      pointerAt = -Infinity;
    },
    dispose() {
      pass.dispose();
    },
  };
}
