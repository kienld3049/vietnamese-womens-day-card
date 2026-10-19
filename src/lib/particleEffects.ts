/**
 * Canvas Particle Engines:
 * 1. Falling Rose Petals (soft background physics)
 * 2. Celebration Heart Fireworks & Click Sparkles
 */

import { fireworkAudio } from './audioSynth.ts';

export interface ParticleFxEngine {
  explode: (x: number, y: number, palette?: string[], scale?: number) => void;
  rocket: (x0: number, y0: number, tx: number, ty: number, palette?: string[], scale?: number) => void;
  spray: (x: number, y: number, n?: number) => void;
  balloons: (n?: number) => void;
  palettes: string[][];
  getSize: () => [number, number];
  destroy: () => void;
}

export function initPetals(canvas: HTMLCanvasElement): () => void {
  const ctx = canvas.getContext('2d');
  if (!ctx) return () => {};

  let W = window.innerWidth;
  let H = window.innerHeight;
  let dpr = Math.min(window.devicePixelRatio || 1, 2);
  let animationId = 0;

  const COLORS = ['#f4a6b7', '#ee8aa2', '#f7c4cf', '#e3577b', '#f3dfb6'];

  interface Petal {
    x: number;
    y: number;
    s: number;
    vy: number;
    vx: number;
    rot: number;
    vr: number;
    sway: number;
    c: string;
    a: number;
  }

  let petals: Petal[] = [];

  function newPetal(anywhere: boolean): Petal {
    return {
      x: Math.random() * W,
      y: anywhere ? Math.random() * H : -20,
      s: 6 + Math.random() * 9,
      vy: 0.4 + Math.random() * 0.8,
      vx: -0.3 + Math.random() * 0.6,
      rot: Math.random() * Math.PI * 2,
      vr: -0.02 + Math.random() * 0.04,
      sway: Math.random() * Math.PI * 2,
      c: COLORS[Math.floor(Math.random() * COLORS.length)],
      a: 0.55 + Math.random() * 0.4
    };
  }

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    W = window.innerWidth;
    H = window.innerHeight;
    canvas.width = W * dpr;
    canvas.height = H * dpr;
    ctx?.setTransform(dpr, 0, 0, dpr, 0, 0);

    const target = Math.round(Math.min(46, W / 28));
    while (petals.length < target) petals.push(newPetal(true));
    petals = petals.slice(0, target);
  }

  function drawPetal(p: Petal) {
    if (!ctx) return;
    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate(p.rot);
    ctx.scale(1, 0.6 + 0.4 * Math.abs(Math.sin(p.sway)));
    ctx.globalAlpha = p.a;
    ctx.fillStyle = p.c;
    ctx.beginPath();
    ctx.moveTo(0, -p.s);
    ctx.bezierCurveTo(p.s * 0.9, -p.s * 0.6, p.s * 0.7, p.s * 0.7, 0, p.s);
    ctx.bezierCurveTo(-p.s * 0.7, p.s * 0.7, -p.s * 0.9, -p.s * 0.6, 0, -p.s);
    ctx.fill();
    ctx.restore();
  }

  function tick() {
    if (!ctx) return;
    ctx.clearRect(0, 0, W, H);
    for (let i = 0; i < petals.length; i++) {
      const p = petals[i];
      p.sway += 0.02;
      p.rot += p.vr;
      p.x += p.vx + Math.sin(p.sway) * 0.6;
      p.y += p.vy;
      if (p.y > H + 20 || p.x < -30 || p.x > W + 30) {
        petals[i] = newPetal(false);
      }
      drawPetal(p);
    }
    if (!document.hidden) {
      animationId = requestAnimationFrame(tick);
    }
  }

  window.addEventListener('resize', resize);
  const handleVisibility = () => {
    if (!document.hidden) animationId = requestAnimationFrame(tick);
  };
  document.addEventListener('visibilitychange', handleVisibility);

  resize();
  animationId = requestAnimationFrame(tick);

  return () => {
    cancelAnimationFrame(animationId);
    window.removeEventListener('resize', resize);
    document.removeEventListener('visibilitychange', handleVisibility);
  };
}

export function initFireworks(canvas: HTMLCanvasElement): ParticleFxEngine {
  const c = canvas.getContext('2d');
  let W = window.innerWidth;
  let H = window.innerHeight;
  let dpr = Math.min(window.devicePixelRatio || 1, 2);
  let raf = 0;
  let last = 0;

  const MAX = 1500;
  const PALETTES = [
    ['#ff4d7e', '#ff9fb8', '#ffe0e8'],
    ['#e0245e', '#ff6b9a', '#ffe3a3'],
    ['#c2375b', '#f3c97a', '#fff6e0'],
    ['#ff6fa5', '#ffc2d6', '#ffffff'],
    ['#ff3366', '#ffb347', '#fff3c4'],
    ['#d63384', '#f7a1c4', '#e8d4ff']
  ];

  const rand = (a: number, b: number) => a + Math.random() * (b - a);
  const pick = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    W = window.innerWidth;
    H = window.innerHeight;
    canvas.width = W * dpr;
    canvas.height = H * dpr;
  }

  window.addEventListener('resize', resize);
  resize();

  // Sprites
  const S = 96;
  const cache = new Map<string, HTMLCanvasElement>();

  function heartPath(g: CanvasRenderingContext2D, x: number, y: number, w: number) {
    const p = (u: number, v: number): [number, number] => [x + (u - 0.5) * w, y + (v - 0.45) * w];
    g.beginPath();
    g.moveTo(...p(0.5, 0.92));
    g.bezierCurveTo(...p(0.18, 0.72), ...p(0, 0.52), ...p(0, 0.3));
    g.bezierCurveTo(...p(0, 0.1), ...p(0.15, 0), ...p(0.3, 0));
    g.bezierCurveTo(...p(0.41, 0), ...p(0.5, 0.09), ...p(0.5, 0.2));
    g.bezierCurveTo(...p(0.5, 0.09), ...p(0.59, 0), ...p(0.7, 0));
    g.bezierCurveTo(...p(0.85, 0), ...p(1, 0.1), ...p(1, 0.3));
    g.bezierCurveTo(...p(1, 0.52), ...p(0.82, 0.72), ...p(0.5, 0.92));
    g.closePath();
  }

  function rgba(hex: string, a: number): string {
    const cleanHex = hex.replace('#', '');
    const n = parseInt(cleanHex, 16);
    return `rgba(${(n >> 16) & 255},${(n >> 8) & 255},${n & 255},${a})`;
  }

  function shade(hex: string, k: number): string {
    const cleanHex = hex.replace('#', '');
    const n = parseInt(cleanHex, 16);
    const f = (v: number) => Math.max(0, Math.min(255, Math.round(v + (k < 0 ? v : 255 - v) * k)));
    return `rgb(${f((n >> 16) & 255)},${f((n >> 8) & 255)},${f(n & 255)})`;
  }

  function sprite(kind: 'heart' | 'glow' | 'star', color: string): HTMLCanvasElement {
    const key = kind + color;
    if (cache.has(key)) return cache.get(key)!;

    const o = document.createElement('canvas');
    o.width = o.height = S;
    const g = o.getContext('2d');
    if (!g) return o;
    const m = S / 2;

    if (kind === 'heart') {
      g.shadowColor = color;
      g.shadowBlur = 14;
      heartPath(g, m, m, S * 0.66);
      const gr = g.createLinearGradient(m - 30, m - 30, m + 26, m + 30);
      gr.addColorStop(0, '#fff');
      gr.addColorStop(0.28, color);
      gr.addColorStop(1, shade(color, -0.35));
      g.fillStyle = gr;
      g.fill();
      g.shadowBlur = 0;
      g.fillStyle = 'rgba(255,255,255,.55)';
      g.beginPath();
      g.ellipse(m - 11, m - 13, 7, 4.5, -0.6, 0, Math.PI * 2);
      g.fill();
    } else if (kind === 'glow') {
      const gr = g.createRadialGradient(m, m, 0, m, m, m);
      gr.addColorStop(0, 'rgba(255,255,255,1)');
      gr.addColorStop(0.2, rgba(color, 0.85));
      gr.addColorStop(0.55, rgba(color, 0.25));
      gr.addColorStop(1, rgba(color, 0));
      g.fillStyle = gr;
      g.fillRect(0, 0, S, S);
    } else {
      // 4-point star
      const gr = g.createRadialGradient(m, m, 0, m, m, m * 0.5);
      gr.addColorStop(0, 'rgba(255,255,255,.9)');
      gr.addColorStop(1, 'rgba(255,255,255,0)');
      g.fillStyle = gr;
      g.fillRect(0, 0, S, S);
      g.fillStyle = '#fff';
      g.shadowColor = color;
      g.shadowBlur = 10;
      g.beginPath();
      for (let i = 0; i < 8; i++) {
        const r = i % 2 ? 5 : m * 0.95;
        const a = (i * Math.PI) / 4 - Math.PI / 2;
        g.lineTo(m + Math.cos(a) * r, m + Math.sin(a) * r);
      }
      g.closePath();
      g.fill();
    }
    cache.set(key, o);
    return o;
  }

  interface Particle {
    kind: 'heart' | 'glow' | 'star' | 'ring';
    x: number;
    y: number;
    vx: number;
    vy: number;
    g: number;
    drag: number;
    rot: number;
    vr: number;
    size: number;
    alpha: number;
    add?: boolean;
    life: number;
    t: number;
    wob?: number;
    pulse?: boolean;
    tw?: number;
    ph?: number;
    grow?: number;
    r0?: number;
    r1?: number;
    color: string;
    tick?: (p: Particle, dt: number) => void;
    onEnd?: (p: Particle) => void;
  }

  const parts: Particle[] = [];

  function add(p: Partial<Particle> & { color: string; kind: Particle['kind']; life: number; x: number; y: number }) {
    if (parts.length >= MAX) return;
    const full: Particle = {
      t: 0,
      vx: 0,
      vy: 0,
      g: 0,
      drag: 1,
      rot: 0,
      vr: 0,
      size: 12,
      alpha: 1,
      add: false,
      ...p
    };
    parts.push(full);
    if (!raf) {
      last = 0;
      raf = requestAnimationFrame(loop);
    }
  }

  function heart(x: number, y: number, o: Partial<Particle> = {}) {
    add({
      kind: 'heart',
      x,
      y,
      life: rand(60, 100),
      color: o.color || '#ff4d7e',
      ...o
    });
  }

  function spark(x: number, y: number, o: Partial<Particle> = {}) {
    add({
      kind: 'star',
      x,
      y,
      life: rand(40, 90),
      add: true,
      tw: rand(0.15, 0.4),
      ph: rand(0, 6),
      color: o.color || '#fff',
      ...o
    });
  }

  function glow(x: number, y: number, o: Partial<Particle> = {}) {
    add({
      kind: 'glow',
      x,
      y,
      life: 24,
      add: true,
      color: o.color || '#ff4d7e',
      ...o
    });
  }

  function ring(x: number, y: number, color: string, r = 110) {
    add({
      kind: 'ring',
      x,
      y,
      life: 40,
      r0: 6,
      r1: r,
      color,
      add: true
    });
  }

  function draw(p: Particle) {
    if (!c) return;
    const k = p.t / p.life;
    let a = p.alpha * (k > 0.65 ? 1 - (k - 0.65) / 0.35 : 1);
    c.globalCompositeOperation = p.add ? 'lighter' : 'source-over';

    if (p.kind === 'ring') {
      const e = 1 - Math.pow(1 - k, 3);
      c.setTransform(dpr, 0, 0, dpr, 0, 0);
      c.globalAlpha = (1 - k) * 0.8;
      c.strokeStyle = p.color;
      c.lineWidth = 3 * (1 - k) + 0.5;
      c.beginPath();
      c.arc(p.x, p.y, (p.r0 ?? 6) + ((p.r1 ?? 110) - (p.r0 ?? 6)) * e, 0, Math.PI * 2);
      c.stroke();
      return;
    }

    let sc = p.size;
    if (p.kind === 'heart') {
      sc *= Math.min(1, p.t / 8) * (p.pulse ? 1 + 0.12 * Math.sin(p.t * 0.3) : 1);
    }
    if (p.kind === 'star') {
      a *= 0.45 + 0.55 * Math.abs(Math.sin(p.t * (p.tw || 0.2) + (p.ph || 0)));
    }
    if (p.kind === 'glow') {
      a *= 1 - k;
      sc *= p.grow ? 1 + k * p.grow : 1;
    }
    if (a <= 0.01) return;

    c.globalAlpha = Math.min(1, a);
    const cos = (Math.cos(p.rot) * sc) / S * 1.5 * dpr;
    const sin = (Math.sin(p.rot) * sc) / S * 1.5 * dpr;
    c.setTransform(cos, sin, -sin, cos, p.x * dpr, p.y * dpr);
    c.drawImage(sprite(p.kind, p.color), -S / 2, -S / 2);
  }

  function loop(now: number) {
    if (!c) return;
    const dt = last ? Math.min((now - last) / 16.667, 3) : 1;
    last = now;
    c.setTransform(1, 0, 0, 1, 0, 0);
    c.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = parts.length - 1; i >= 0; i--) {
      const p = parts[i];
      p.t += dt;
      if (p.t >= p.life) {
        if (p.onEnd) p.onEnd(p);
        parts.splice(i, 1);
        continue;
      }
      p.vx *= Math.pow(p.drag, dt);
      p.vy *= Math.pow(p.drag, dt);
      p.vy += p.g * dt;
      if (p.wob) p.vx += Math.sin(p.t * 0.12 + p.wob) * 0.05 * dt;
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.rot += p.vr * dt;
      if (p.tick) p.tick(p, dt);
      draw(p);
    }

    if (parts.length) {
      raf = requestAnimationFrame(loop);
    } else {
      raf = 0;
      c.setTransform(1, 0, 0, 1, 0, 0);
      c.clearRect(0, 0, canvas.width, canvas.height);
    }
  }

  function explode(x: number, y: number, pal = pick(PALETTES), scale = 1) {
    scale *= Math.max(0.6, Math.min(1, W / 1000));
    fireworkAudio.playExplosion(scale);
    glow(x, y, { color: pal[0], size: 160 * scale, life: 22, grow: 0.6 });
    ring(x, y, pal[1], 120 * scale);
    ring(x, y, pal[2], 70 * scale);

    const N = Math.round(40 * scale) + 8;
    const sp = rand(3.2, 4) * scale;
    for (let i = 0; i < N; i++) {
      const t = (i / N) * Math.PI * 2;
      const hx = 16 * Math.pow(Math.sin(t), 3);
      const hy = -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t));
      const col = i % 3 ? pal[0] : pal[1];
      heart(x, y, {
        vx: (hx / 16) * sp,
        vy: (hy / 16) * sp,
        drag: 0.955,
        g: 0.025,
        size: rand(9, 14) * Math.sqrt(scale),
        color: col,
        rot: rand(-0.4, 0.4),
        vr: rand(-0.02, 0.02),
        life: rand(80, 110),
        wob: rand(0, 6)
      });
    }

    for (let i = 0; i < 34 * scale; i++) {
      const a = rand(0, Math.PI * 2);
      const v = rand(0.8, 6.5) * scale;
      spark(x, y, {
        vx: Math.cos(a) * v,
        vy: Math.sin(a) * v,
        drag: 0.95,
        g: 0.04,
        size: rand(8, 18),
        color: pick(pal),
        life: rand(60, 120)
      });
    }

    for (let i = 0; i < 6; i++) {
      const a = rand(0, Math.PI * 2);
      const v = rand(1, 3);
      heart(x, y, {
        vx: Math.cos(a) * v,
        vy: Math.sin(a) * v - 1.5,
        drag: 0.97,
        g: 0.06,
        size: rand(18, 28) * Math.sqrt(scale),
        color: pick(pal),
        rot: rand(-0.5, 0.5),
        vr: rand(-0.04, 0.04),
        life: rand(90, 130),
        pulse: true
      });
    }
  }

  function rocket(x0: number, y0: number, tx: number, ty: number, pal = pick(PALETTES), scale = 1) {
    const g = 0.16;
    const vy = -Math.sqrt(2 * g * Math.max(60, y0 - ty));
    const frames = -vy / g;
    fireworkAudio.playLaunch(Math.max(0.35, frames * 0.016));
    add({
      kind: 'heart',
      x: x0,
      y: y0,
      vx: (tx - x0) / frames,
      vy,
      g,
      size: 22,
      color: pal[0],
      life: frames + 2,
      pulse: true,
      tick(p, dt) {
        p.rot = Math.atan2(p.vx, -p.vy) * 0.5;
        if (Math.random() < 0.9 * dt) {
          glow(p.x + rand(-2, 2), p.y + 8, {
            color: pal[1],
            size: rand(18, 30),
            life: rand(14, 24),
            vy: rand(0.3, 1)
          });
        }
        if (Math.random() < 0.5 * dt) {
          spark(p.x + rand(-4, 4), p.y + 6, {
            vx: rand(-0.6, 0.6),
            vy: rand(0.5, 1.6),
            g: 0.03,
            size: rand(6, 11),
            color: pal[2],
            life: rand(25, 45)
          });
        }
      },
      onEnd(p) {
        explode(p.x, p.y, pal, scale);
      }
    });
  }

  function spray(x: number, y: number, n = 8) {
    fireworkAudio.playPop();
    const pal = pick(PALETTES);
    ring(x, y, pal[1], 50 + n * 3);
    glow(x, y, { color: pal[0], size: 50 + n * 4, life: 16 });
    for (let i = 0; i < n; i++) {
      const a = rand(-Math.PI, 0);
      const v = rand(2, 5.5);
      heart(x, y, {
        vx: Math.cos(a) * v,
        vy: Math.sin(a) * v - 1,
        drag: 0.965,
        g: 0.09,
        size: rand(10, 20),
        color: pick(pal),
        rot: rand(-0.5, 0.5),
        vr: rand(-0.05, 0.05),
        life: rand(55, 85),
        wob: rand(0, 6)
      });
    }
    for (let i = 0; i < n * 1.5; i++) {
      const a = rand(0, Math.PI * 2);
      const v = rand(1, 4.5);
      spark(x, y, {
        vx: Math.cos(a) * v,
        vy: Math.sin(a) * v,
        drag: 0.94,
        g: 0.03,
        size: rand(6, 13),
        color: pick(pal),
        life: rand(35, 70)
      });
    }
  }

  function balloons(n = 10) {
    for (let i = 0; i < n; i++) {
      const pal = pick(PALETTES);
      heart(rand(0.05, 0.95) * W, H + rand(20, 120), {
        vy: -rand(1.6, 3.2),
        vx: rand(-0.4, 0.4),
        size: rand(16, 34),
        color: pal[0],
        life: rand(160, 240),
        wob: rand(0, 6),
        rot: rand(-0.3, 0.3),
        pulse: true,
        alpha: 0.95
      });
    }
  }

  return {
    explode,
    rocket,
    spray,
    balloons,
    palettes: PALETTES,
    getSize: () => [W, H],
    destroy: () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
    }
  };
}
