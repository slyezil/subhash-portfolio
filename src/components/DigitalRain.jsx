import { useEffect, useRef } from 'react';

const GLYPHS = 'アィウエオカキクケコサシスセソタチツテトナニヌネノ0123456789<>[]{}/$#@';

function pick() {
  return GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
}

export default function DigitalRain({ height = 110 }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;

    const ctx = canvas.getContext('2d');
    const reduced =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let raf = null;
    let last = 0;
    let columns = [];
    const fontSize = 14;

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      const count = Math.ceil(canvas.width / fontSize);
      columns = Array.from({ length: count }, (_, i) => ({
        x: i * fontSize,
        y: Math.random() * canvas.height,
        speed: 1.2 + Math.random() * 2.4
      }));
    };

    const paintStatic = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.font = `${fontSize}px "Share Tech Mono", monospace`;
      columns.forEach((c) => {
        ctx.fillStyle = 'rgba(0,229,255,0.22)';
        ctx.fillText(pick(), c.x, (c.y % canvas.height + canvas.height) % canvas.height);
      });
    };

    const draw = (ts) => {
      raf = requestAnimationFrame(draw);
      if (ts - last < 55) return;
      last = ts;
      ctx.fillStyle = 'rgba(4,5,12,0.16)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.font = `${fontSize}px "Share Tech Mono", monospace`;
      columns.forEach((c) => {
        const magenta = Math.random() > 0.92;
        ctx.fillStyle = magenta ? 'rgba(255,43,214,0.85)' : 'rgba(0,229,255,0.8)';
        ctx.fillText(pick(), c.x, c.y);
        c.y += c.speed * fontSize * 0.35;
        if (c.y > canvas.height + Math.random() * 220) c.y = -20;
      });
    };

    resize();
    window.addEventListener('resize', resize);

    if (reduced) {
      paintStatic();
      return () => window.removeEventListener('resize', resize);
    }

    raf = requestAnimationFrame(draw);

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && raf === null) {
          raf = requestAnimationFrame(draw);
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
      window.removeEventListener('resize', resize);
    };
  }, []);

  return <canvas ref={canvasRef} className="rain-canvas" style={{ height }} aria-hidden="true" />;
}
