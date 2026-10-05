/**
 * Minimal WebGL1 plumbing shared by the shader effects: one full-screen
 * triangle, one program, and lazily cached uniform locations. No library —
 * a fragment shader on a single triangle doesn't need one.
 */

const VERTEX_SRC = "attribute vec2 a_pos; void main(){ gl_Position = vec4(a_pos, 0.0, 1.0); }";

export type Uniforms = Record<string, WebGLUniformLocation | null>;

export interface ShaderPass {
  gl: WebGLRenderingContext;
  u: Uniforms;
  draw(): void;
  dispose(): void;
}

export function createShaderPass(canvas: HTMLCanvasElement, fragmentSrc: string): ShaderPass | null {
  const gl = canvas.getContext("webgl", {
    antialias: false,
    alpha: false,
    powerPreference: "low-power",
    preserveDrawingBuffer: false,
  });
  if (!gl) return null;

  const compile = (type: number, src: string) => {
    const shader = gl.createShader(type);
    if (!shader) throw new Error("createShader failed");
    gl.shaderSource(shader, src);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      throw new Error(gl.getShaderInfoLog(shader) ?? "shader compile failed");
    }
    return shader;
  };

  let program: WebGLProgram | null = null;
  let buffer: WebGLBuffer | null = null;
  try {
    program = gl.createProgram();
    if (!program) return null;
    gl.attachShader(program, compile(gl.VERTEX_SHADER, VERTEX_SRC));
    gl.attachShader(program, compile(gl.FRAGMENT_SHADER, fragmentSrc));
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      throw new Error(gl.getProgramInfoLog(program) ?? "program link failed");
    }
  } catch (err) {
    console.error(err);
    return null;
  }
  gl.useProgram(program);

  buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  const loc = gl.getAttribLocation(program, "a_pos");
  gl.enableVertexAttribArray(loc);
  gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

  const cache: Uniforms = {};
  const prog = program;
  const u = new Proxy(cache, {
    get: (c, key: string) => (key in c ? c[key] : (c[key] = gl.getUniformLocation(prog, key))),
  });

  return {
    gl,
    u,
    draw() {
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    },
    dispose() {
      // Free the program and buffer; the context itself goes with its canvas.
      // (Forcing context loss here would break a remount onto the same canvas.)
      gl.deleteBuffer(buffer);
      gl.deleteProgram(prog);
    },
  };
}

/** Value noise + fbm, shared by every shader. Hash avoids sin() for precision. */
export const GLSL_NOISE = /* glsl */ `
float hash(vec2 p){ p = fract(p*vec2(123.34, 456.21)); p += dot(p, p + 45.32); return fract(p.x*p.y); }
float noise(vec2 p){
  vec2 i = floor(p), f = fract(p);
  vec2 u = f*f*(3.0 - 2.0*f);
  return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x), mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
}
float fbm(vec2 p){
  float v = 0.0, a = 0.5;
  for (int i = 0; i < 4; i++){ v += a*noise(p); p = p*2.03 + vec2(17.0, 9.0); a *= 0.5; }
  return v;
}`;
