import { useEffect, useRef } from 'react';

const LAYERS = [7, 5, 3];
const CYCLE_MS = 4200;
const TRAVEL = 330;
const UPDATE_AT = 2950;
const SAMPLES = 12;

const clamp01 = (v) => Math.min(1, Math.max(0, v));

function cssVar(name, fallback) {
  if (typeof document === 'undefined') return fallback;
  const v = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  return v || fallback;
}

function hexToRgb(hex, fb) {
  const m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return m ? [parseInt(m[1], 16), parseInt(m[2], 16), parseInt(m[3], 16)] : fb;
}

export default function NeuralNet({ height = 230 }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;

    const ctx = canvas.getContext('2d');
    const reduced =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let raf = null;
    let nodes = [];
    let edges = [];
    let edgesIn = [];
    let edgesOut = [];
    let schedule = { pulses: [], actF: [], actB: [] };
    let cyc = -1;
    let t0 = 0;
    let palette = {};
    let paletteAt = 0;

    const refreshPalette = () => {
      palette.cyan = cssVar('--cyan', '#00e5ff');
      palette.magenta = cssVar('--magenta', '#ff2bd6');
      palette.yellow = cssVar('--yellow', '#ffe600');
      palette.muted = cssVar('--text-muted', '#64789e');
    };

    const layout = () => {
      const w = canvas.offsetWidth;
      const h = canvas.offsetHeight;
      if (!w || !h) return false;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      nodes = [];
      const padX = Math.max(30, w * 0.08);
      const padY = 24;
      const colW = (w - padX * 2) / (LAYERS.length - 1);
      const starts = [];
      let acc = 0;
      LAYERS.forEach((count, li) => {
        starts.push(acc);
        acc += count;
        const gap = (h - padY * 2) / (count + 1);
        for (let i = 0; i < count; i++) {
          nodes.push({ x: padX + colW * li, y: padY + gap * (i + 1) });
        }
      });

      edges = [];
      edgesIn = nodes.map(() => []);
      edgesOut = nodes.map(() => []);
      for (let li = 0; li < LAYERS.length - 1; li++) {
        for (let i = 0; i < LAYERS[li]; i++) {
          for (let j = 0; j < LAYERS[li + 1]; j++) {
            const idx = edges.length;
            edges.push({
              a: starts[li] + i,
              b: starts[li + 1] + j,
              w: 0.25 + Math.random() * 0.55,
              bow: (Math.random() - 0.5) * 18
            });
            edgesIn[starts[li + 1] + j].push(idx);
            edgesOut[starts[li] + i].push(idx);
          }
        }
      }

      schedule = { pulses: [], actF: [], actB: [] };
      cyc = -1;
      return true;
    };

    const ctrl = (e) => {
      const a = nodes[e.a];
      const b = nodes[e.b];
      return [(a.x + b.x) / 2, (a.y + b.y) / 2 + e.bow];
    };

    const pointAt = (e, t) => {
      const a = nodes[e.a];
      const b = nodes[e.b];
      const [cx, cy] = ctrl(e);
      const u = 1 - t;
      return [
        u * u * a.x + 2 * u * t * cx + t * t * b.x,
        u * u * a.y + 2 * u * t * cy + t * t * b.y
      ];
    };

    const buildSchedule = () => {
      const actF = nodes.map(() => -Infinity);
      const actB = nodes.map(() => -Infinity);
      const pulses = [];

      LAYERS.length &&
        nodes.forEach((_, n) => {
          if (isInput(n)) actF[n] = 120 + Math.random() * 160;
        });
      function isInput(n) {
        return n < LAYERS[0];
      }
      function isOutput(n) {
        return n >= nodes.length - LAYERS[LAYERS.length - 1];
      }

      for (let li = 1; li < LAYERS.length; li++) {
        for (let n = startsOf(li); n < startsOf(li) + LAYERS[li]; n++) {
          let arrive = -Infinity;
          edgesIn[n].forEach((ei) => {
            const e = edges[ei];
            if (!isFinite(actF[e.a])) return;
            const s = actF[e.a] + Math.random() * 90;
            pulses.push({ ei, start: s, end: s + TRAVEL * (0.85 + Math.random() * 0.35), dir: 0 });
            arrive = Math.max(arrive, s + TRAVEL);
          });
          actF[n] = arrive;
        }
      }

      nodes.forEach((_, n) => {
        if (isOutput(n)) actB[n] = 2150 + Math.random() * 160;
      });
      for (let li = LAYERS.length - 2; li >= 0; li--) {
        for (let n = startsOf(li); n < startsOf(li) + LAYERS[li]; n++) {
          let arrive = -Infinity;
          edgesOut[n].forEach((ei) => {
            const e = edges[ei];
            if (!isFinite(actB[e.b])) return;
            const s = actB[e.b] + Math.random() * 90;
            pulses.push({ ei, start: s, end: s + TRAVEL * (0.85 + Math.random() * 0.35), dir: 1 });
            arrive = Math.max(arrive, s + TRAVEL);
          });
          actB[n] = arrive;
        }
      }

      edges.forEach((e, ei) => {
        if (Math.random() < 0.85) {
          const s = UPDATE_AT + Math.random() * 750;
          pulses.push({ ei, start: s, end: s + 260, dir: 2 });
        }
      });

      schedule = { pulses, actF, actB };
    };

    const startsCache = [];
    let acc0 = 0;
    LAYERS.forEach((c) => {
      startsCache.push(acc0);
      acc0 += c;
    });
    function startsOf(li) {
      return startsCache[li];
    }

    const strokeBase = (rgbMuted) => {
      edges.forEach((e) => {
        const a = nodes[e.a];
        const b = nodes[e.b];
        const [cx, cy] = ctrl(e);
        ctx.strokeStyle = `rgba(${rgbMuted[0]},${rgbMuted[1]},${rgbMuted[2]},${0.05 + e.w * 0.1})`;
        ctx.lineWidth = 0.8;
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.quadraticCurveTo(cx, cy, b.x, b.y);
        ctx.stroke();
      });
    };

    const drawPulse = (p, now, rgbC, rgbM, rgbY) => {
      const e = edges[p.ei];
      const prog = clamp01((now - p.start) / (p.end - p.start));
      const rgb = p.dir === 0 ? rgbC : p.dir === 1 ? rgbM : rgbY;

      if (p.dir === 2) {
        const flash = Math.sin(Math.PI * prog);
        const a = nodes[e.a];
        const b = nodes[e.b];
        const [cx, cy] = ctrl(e);
        ctx.strokeStyle = `rgba(${rgbY[0]},${rgbY[1]},${rgbY[2]},${flash * 0.55})`;
        ctx.lineWidth = 1 + flash * 1.6;
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.quadraticCurveTo(cx, cy, b.x, b.y);
        ctx.stroke();
        return;
      }

      const k = Math.max(2, Math.ceil(prog * SAMPLES));
      ctx.strokeStyle = `rgba(${rgb[0]},${rgb[1]},${rgb[2]},0.75)`;
      ctx.lineWidth = 1.4;
      ctx.beginPath();
      ctx.moveTo(...pointAt(e, 0));
      for (let s = 1; s <= k; s++) {
        ctx.lineTo(...pointAt(e, (s / SAMPLES) * prog));
      }
      ctx.stroke();

      const [tx, ty] = pointAt(e, prog);
      ctx.fillStyle = `rgba(${rgb[0]},${rgb[1]},${rgb[2]},0.95)`;
      ctx.beginPath();
      ctx.arc(tx, ty, 2.4, 0, Math.PI * 2);
      ctx.fill();
    };

    const drawNodes = (now, rgbC, rgbM) => {
      nodes.forEach((nd, n) => {
        const fAge = now - schedule.actF[n];
        const bAge = now - schedule.actB[n];
        const hot =
          (isFinite(fAge) && fAge >= 0 && fAge < 420) ||
          (isFinite(bAge) && bAge >= 0 && bAge < 420);

        ctx.globalAlpha = hot ? 0.95 : 0.51;
        ctx.fillStyle = palette.cyan;
        ctx.beginPath();
        ctx.arc(nd.x, nd.y, hot ? 4.6 : 3.4, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;

        const ringAge = Math.min(
          isFinite(fAge) && fAge >= 0 ? fAge : Infinity,
          isFinite(bAge) && bAge >= 0 ? bAge : Infinity
        );
        if (ringAge < 480) {
          const rp = ringAge / 480;
          const rgb = fAge <= bAge ? rgbC : rgbM;
          ctx.strokeStyle = `rgba(${rgb[0]},${rgb[1]},${rgb[2]},${(1 - rp) * 0.7})`;
          ctx.lineWidth = 1.2;
          ctx.beginPath();
          ctx.arc(nd.x, nd.y, 4 + rp * 11, 0, Math.PI * 2);
          ctx.stroke();
        }
      });
    };

    const drawFrame = (now) => {
      if (now - paletteAt > 600) {
        refreshPalette();
        paletteAt = now;
      }
      const rgbC = hexToRgb(palette.cyan, [0, 229, 255]);
      const rgbM = hexToRgb(palette.magenta, [255, 43, 214]);
      const rgbY = hexToRgb(palette.yellow, [255, 230, 0]);
      const rgbMut = hexToRgb(palette.muted, [100, 120, 158]);
      const w = canvas.offsetWidth;
      const h = canvas.offsetHeight;

      ctx.clearRect(0, 0, w, h);
      ctx.lineCap = 'round';
      strokeBase(rgbMut);

      ctx.globalCompositeOperation = 'lighter';
      schedule.pulses.forEach((p) => {
        if (now >= p.start && now <= p.end) drawPulse(p, now, rgbC, rgbM, rgbY);
      });
      ctx.globalCompositeOperation = 'source-over';

      drawNodes(now, rgbC, rgbM);
    };

    const loop = (now) => {
      if (!t0) t0 = now;
      const el = now - t0;
      const c = Math.floor(el / CYCLE_MS);
      if (c !== cyc) {
        cyc = c;
        edges.forEach((e) => {
          e.w = Math.min(0.88, Math.max(0.12, e.w + (Math.random() - 0.5) * 0.12));
        });
        buildSchedule();
      }
      drawFrame(el % CYCLE_MS);
      raf = requestAnimationFrame(loop);
    };

    refreshPalette();
    if (!layout()) return undefined;
    window.addEventListener('resize', layout);

    if (reduced) {
      const repaintStatic = () => {
        layout();
        buildSchedule();
        drawFrame(1050);
      };
      repaintStatic();
      window.addEventListener('resize', repaintStatic);
      return () => {
        window.removeEventListener('resize', layout);
        window.removeEventListener('resize', repaintStatic);
      };
    }

    raf = requestAnimationFrame(loop);
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && raf === null) {
          raf = requestAnimationFrame(loop);
        } else if (!entry.isIntersecting && raf !== null) {
          cancelAnimationFrame(raf);
          raf = null;
        }
      },
      { threshold: 0 }
    );
    io.observe(canvas);

    return () => {
      if (raf !== null) cancelAnimationFrame(raf);
      io.disconnect();
      window.removeEventListener('resize', layout);
    };
  }, []);

  return (
    <div className="nn-wrap">
      <span className="nn-caption mono" aria-hidden="true">
        {'// PAIRWISE_WEIGHT_UPDATES::LIVE'}
      </span>
      <canvas
        ref={canvasRef}
        className="nn-canvas"
        style={{ height }}
        role="img"
        aria-label="Tapered neural network firing pairwise connections through forward and backward passes"
      />
    </div>
  );
}
