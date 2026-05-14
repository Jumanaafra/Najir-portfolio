'use client';

import { useRef, useState, useEffect, useCallback } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

export interface CinematicSequenceProps {
  onComplete?: () => void;
}

// ─── Config ───────────────────────────────────────────────────────────────────
const TOTAL_FRAMES  = 224;
const VIRTUAL_MAX   = 5500;   // virtual scroll pixels (higher = more turns of wheel per frame)
const WHEEL_SPEED   = 1.0;
const SPRING_CFG    = { stiffness: 55, damping: 22, mass: 0.75, restDelta: 0.0001 };

const pad3      = (n: number) => String(n).padStart(3, '0');
const frameSrc  = (i: number) => `/sequence/ezgif-frame-${pad3(i)}.jpg`;

function paint(ctx: CanvasRenderingContext2D, img: HTMLImageElement, w: number, h: number) {
  const iw = img.naturalWidth, ih = img.naturalHeight;
  if (!iw || !ih) return;
  const scale = Math.max(w / iw, h / ih);
  const dw = iw * scale, dh = ih * scale;
  ctx.drawImage(img, (w - dw) / 2, (h - dh) / 2, dw, dh);
}

// ─── Component ────────────────────────────────────────────────────────────────
export default function CinematicSequence({ onComplete }: CinematicSequenceProps) {
  const canvasRef   = useRef<HTMLCanvasElement>(null);
  const framesRef   = useRef<HTMLImageElement[]>([]);
  const rafRef      = useRef<number>(0);
  const lastIdxRef  = useRef(-1);
  const dimRef      = useRef({ w: 0, h: 0 });
  const virtualRef  = useRef(0);   // virtual scroll [0 … VIRTUAL_MAX]

  const [phase, setPhase] = useState<'loading' | 'fading' | 'ready'>('loading');
  const [pct,   setPct]   = useState(0);
  const [completed, setCompleted] = useState(false);
  const completedRef = useRef(false);

  // Motion values
  const rawProgress    = useMotionValue(0);
  const smoothProgress = useSpring(rawProgress, SPRING_CFG);
  const springRef      = useRef(0);

  useEffect(() => {
    return smoothProgress.on('change', v => { springRef.current = v; });
  }, [smoothProgress]);

  // Text-beat motion values
  const scrollIndOp = useTransform(rawProgress, [0, 0.04], [1, 0]);
  const aOp = useTransform(smoothProgress, [0.00, 0.06, 0.14, 0.19], [0, 1, 1, 0]);
  const bOp = useTransform(smoothProgress, [0.26, 0.33, 0.44, 0.49], [0, 1, 1, 0]);
  const cOp = useTransform(smoothProgress, [0.54, 0.61, 0.71, 0.76], [0, 1, 1, 0]);
  const dOp = useTransform(smoothProgress, [0.80, 0.87, 0.95, 1.00], [0, 1, 1, 1]);
  const aY  = useTransform(smoothProgress, [0.00, 0.06, 0.14, 0.19], [20, 0, 0, -20]);
  const bY  = useTransform(smoothProgress, [0.26, 0.33, 0.44, 0.49], [20, 0, 0, -20]);
  const cY  = useTransform(smoothProgress, [0.54, 0.61, 0.71, 0.76], [20, 0, 0, -20]);
  const dY  = useTransform(smoothProgress, [0.80, 0.87, 0.95, 1.00], [20, 0,  0,  0]);

  // ── Complete hero & unlock scroll ─────────────────────────────────────────────
  const triggerComplete = useCallback(() => {
    if (completedRef.current) return;
    completedRef.current = true;
    setCompleted(true);
    // Unlock native body scroll for portfolio sections
    document.documentElement.style.overflow = '';
    document.body.style.overflow = '';
    onComplete?.();
  }, [onComplete]);

  // ── Virtual scroll: wheel + touch + keyboard ─────────────────────────────────
  useEffect(() => {
    if (phase !== 'ready' || completed) return;

    // Keep body locked while hero is active
    document.documentElement.style.overflow = 'hidden';
    document.body.style.overflow = 'hidden';

    const advance = (delta: number) => {
      virtualRef.current = Math.max(0, Math.min(VIRTUAL_MAX, virtualRef.current + delta * WHEEL_SPEED));
      rawProgress.set(virtualRef.current / VIRTUAL_MAX);
      // Auto-complete when user scrolls to the very end
      if (virtualRef.current >= VIRTUAL_MAX) {
        setTimeout(triggerComplete, 600);
      }
    };

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      advance(e.deltaY);
    };

    let touchY = 0;
    const onTouchStart = (e: TouchEvent) => { touchY = e.touches[0].clientY; };
    const onTouchMove  = (e: TouchEvent) => {
      e.preventDefault();
      const dy = touchY - e.touches[0].clientY;
      touchY   = e.touches[0].clientY;
      advance(dy * 2.2);
    };

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown' || e.key === 'PageDown') { e.preventDefault(); advance(220); }
      if (e.key === 'ArrowUp'   || e.key === 'PageUp'  ) { e.preventDefault(); advance(-220); }
    };

    window.addEventListener('wheel',      onWheel,      { passive: false });
    window.addEventListener('touchstart', onTouchStart, { passive: false });
    window.addEventListener('touchmove',  onTouchMove,  { passive: false });
    window.addEventListener('keydown',    onKey);

    return () => {
      window.removeEventListener('wheel',      onWheel);
      window.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchmove',  onTouchMove);
      window.removeEventListener('keydown',    onKey);
    };
  }, [phase, rawProgress, completed, triggerComplete]);

  // ── Preload all frames ────────────────────────────────────────────────────────
  useEffect(() => {
    let cancelled = false;
    let done = 0;
    const buf: (HTMLImageElement | null)[] = new Array(TOTAL_FRAMES).fill(null);

    for (let i = 0; i < TOTAL_FRAMES; i++) {
      const img  = new Image();
      img.decoding = 'async';
      img.src  = frameSrc(i + 1);
      const slot = i;
      const settle = () => {
        done++;
        if (!cancelled) setPct(Math.round((done / TOTAL_FRAMES) * 100));
        if (done === TOTAL_FRAMES && !cancelled) {
          framesRef.current = buf.filter((x): x is HTMLImageElement => x !== null);
          setPhase('fading');
          setTimeout(() => { if (!cancelled) setPhase('ready'); }, 700);
        }
      };
      img.onload  = () => { buf[slot] = img; settle(); };
      img.onerror = settle;
    }
    return () => { cancelled = true; };
  }, []);

  // ── Canvas setup & rAF loop ───────────────────────────────────────────────────
  const setupCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;

    // Apply HD context settings — MUST be called after every canvas resize
    // because setting canvas.width/height resets ALL 2d context state.
    const applyHD = () => {
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
    };

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;   // full native DPR, no cap
      const w = window.innerWidth, h = window.innerHeight;
      dimRef.current = { w, h };
      canvas.width  = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      canvas.style.width  = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      applyHD();   // restore after reset
      const fr = framesRef.current;
      const idx = Math.round(springRef.current * (fr.length - 1));
      if (fr[idx]) paint(ctx, fr[idx], w, h);
    };

    resize();
    if (framesRef.current[0]) paint(ctx, framesRef.current[0], dimRef.current.w, dimRef.current.h);

    const ro = new ResizeObserver(resize);
    ro.observe(document.body);

    const loop = () => {
      const fr = framesRef.current;
      if (fr.length > 0) {
        const idx = Math.min(Math.max(0, Math.round(springRef.current * (fr.length - 1))), fr.length - 1);
        if (idx !== lastIdxRef.current) {
          lastIdxRef.current = idx;
          const { w, h } = dimRef.current;
          applyHD();   // guard: re-assert quality before every draw
          paint(ctx, fr[idx], w, h);
        }
      }
      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);

    return () => { ro.disconnect(); cancelAnimationFrame(rafRef.current); };
  }, []);

  useEffect(() => {
    if (phase !== 'ready') return;
    return setupCanvas();
  }, [phase, setupCanvas]);

  // ── Style helpers ─────────────────────────────────────────────────────────────
  const beatWrap = (align: 'center' | 'left' | 'right'): React.CSSProperties => ({
    position: 'absolute', inset: 0, zIndex: 10, pointerEvents: 'none',
    display: 'flex', flexDirection: 'column',
    alignItems: align === 'left' ? 'flex-start' : align === 'right' ? 'flex-end' : 'center',
    justifyContent: 'flex-end',
    padding: `0 ${align === 'center' ? '2rem' : 'clamp(2rem,8vw,8rem)'} 8vh`,
    textAlign: align,
  });

  const headStyle = (align: 'center' | 'left' | 'right'): React.CSSProperties => ({
    fontFamily: "'Inter Tight',-apple-system,sans-serif",
    fontWeight: 800, fontSize: 'clamp(2.2rem,7vw,8rem)',
    lineHeight: 0.90, letterSpacing: '-0.04em',
    color: 'rgba(255,255,255,0.88)', whiteSpace: 'pre-line',
    margin: '0.25rem 0 0.85rem', textAlign: align,
    textShadow: '0 2px 40px rgba(0,0,0,0.5)',
  });

  const subStyle = (align: 'center' | 'left' | 'right'): React.CSSProperties => ({
    fontFamily: "'Inter Tight',-apple-system,sans-serif",
    fontWeight: 300, fontSize: 'clamp(0.78rem,1.25vw,1rem)',
    letterSpacing: '0.07em', color: 'rgba(255,255,255,0.4)',
    maxWidth: '36ch', textAlign: align,
  });

  const labelStyle: React.CSSProperties = {
    fontFamily: "'Inter Tight',sans-serif", fontWeight: 200,
    fontSize: '0.54rem', letterSpacing: '0.55em',
    color: 'rgba(255,255,255,0.22)', textTransform: 'uppercase', marginBottom: '0.5rem',
  };

  return (
    <>
      {/* Film grain */}
      <div aria-hidden style={{
        position: 'fixed', inset: 0, zIndex: 60, pointerEvents: 'none', opacity: 0.042,
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        backgroundSize: '210px 210px',
      }} />

      {/* Vignette */}
      <div aria-hidden style={{
        position: 'fixed', inset: 0, zIndex: 5, pointerEvents: 'none',
        background: 'radial-gradient(ellipse 80% 80% at 50% 50%, transparent 55%, rgba(0,0,0,0.55) 100%)',
      }} />

      {/* Loading screen */}
      {phase !== 'ready' && (
        <motion.div
          animate={{ opacity: phase === 'fading' ? 0 : 1 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          style={{
            position: 'fixed', inset: 0, zIndex: 1000, background: '#000',
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center', gap: '2rem',
          }}
        >
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: 'rgba(255,255,255,0.04)' }}>
            <div style={{
              height: '100%', width: `${pct}%`,
              background: 'linear-gradient(90deg,rgba(255,255,255,0.2),rgba(255,255,255,0.85))',
              boxShadow: '0 0 12px rgba(255,255,255,0.3)', transition: 'width 0.15s linear',
            }} />
          </div>
          <div style={{ position: 'relative', width: 52, height: 52 }}>
            <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', border: '1px solid rgba(255,255,255,0.07)' }} />
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1.4, ease: 'linear' }}
              style={{ position: 'absolute', inset: 0, borderRadius: '50%', border: '1px solid transparent', borderTopColor: 'rgba(255,255,255,0.6)' }}
            />
          </div>
          <p style={{ fontFamily: "'Inter Tight',sans-serif", fontWeight: 100, fontSize: '0.68rem', letterSpacing: '0.45em', color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase' }}>
            {pct < 100 ? `${pct}%` : 'READY'}
          </p>
          <p style={{ position: 'absolute', bottom: '2.5rem', fontFamily: "'Inter Tight',sans-serif", fontWeight: 200, fontSize: '0.52rem', letterSpacing: '0.55em', color: 'rgba(255,255,255,0.12)', textTransform: 'uppercase' }}>
            Preparing cinematic experience
          </p>
        </motion.div>
      )}

      {/* ── Hero: fixed fullscreen — no native scroll ── */}
      <div style={{ position: 'fixed', inset: 0, overflow: 'hidden' }}>

        {/* Canvas */}
        <canvas ref={canvasRef} style={{ position: 'absolute', inset: 0, display: 'block', background: '#000' }} />

        {/* Subtle bottom gradient */}
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0,
          height: '20%', pointerEvents: 'none', zIndex: 6,
          background: 'linear-gradient(to top, rgba(0,0,0,0.4) 0%, transparent 100%)',
        }} />

        {/* Beat A */}
        <motion.div style={{ ...beatWrap('center'), opacity: aOp, y: aY }}>
          <p style={labelStyle}>I</p>
          <h1 style={headStyle('center')}>THE VISIONARY</h1>
          <p style={subStyle('center')}>Precision. Presence. Silence.</p>
        </motion.div>

        {/* Beat B */}
        <motion.div style={{ ...beatWrap('left'), opacity: bOp, y: bY }}>
          <p style={labelStyle}>II</p>
          <h2 style={headStyle('left')}>{'CONTROLLED\nMOTION'}</h2>
          <p style={subStyle('left')}>Every movement engineered with intent.</p>
        </motion.div>

        {/* Beat C */}
        <motion.div style={{ ...beatWrap('right'), opacity: cOp, y: cY }}>
          <p style={{ ...labelStyle, textAlign: 'right' }}>III</p>
          <h2 style={headStyle('right')}>{'LUXURY IN\nSTILLNESS'}</h2>
          <p style={subStyle('right')}>Power does not need noise.</p>
        </motion.div>

        {/* Beat D + CTA */}
        <motion.div style={{ ...beatWrap('center'), opacity: dOp, y: dY }}>
          <p style={labelStyle}>IV</p>
          <h2 style={headStyle('center')}>{'ENTER THE\nEXPERIENCE'}</h2>
          <p style={subStyle('center')}>A premium cinematic portfolio crafted beyond trends.</p>
          <motion.button
            onClick={triggerComplete}
            whileHover={{ scale: 1.05, borderColor: 'rgba(255,255,255,0.5)', boxShadow: '0 0 30px rgba(59,130,246,0.3)' }}
            whileTap={{ scale: 0.96 }}
            style={{
              marginTop: '1.8rem', padding: '0.9rem 2.6rem',
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.18)',
              color: 'rgba(255,255,255,0.75)',
              fontFamily: "'Inter Tight',sans-serif",
              fontWeight: 300, fontSize: '0.62rem', letterSpacing: '0.4em',
              textTransform: 'uppercase', cursor: 'pointer', outline: 'none',
              backdropFilter: 'blur(8px)', pointerEvents: 'auto',
              transition: 'border-color 0.3s ease',
            }}
          >
            Explore Portfolio
          </motion.button>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div style={{
          position: 'absolute', bottom: '2.8rem', left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem',
          zIndex: 20, opacity: scrollIndOp, pointerEvents: 'none',
        }}>
          <p style={{ fontFamily: "'Inter Tight',sans-serif", fontWeight: 200, fontSize: '0.52rem', letterSpacing: '0.52em', color: 'rgba(255,255,255,0.28)', textTransform: 'uppercase' }}>
            Scroll to Explore
          </p>
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ repeat: Infinity, duration: 1.9, ease: 'easeInOut' }}
            style={{ width: 1, height: 36, background: 'linear-gradient(to bottom, rgba(255,255,255,0.4), transparent)' }}
          />
        </motion.div>

        {/* Frame counter */}
        <div style={{
          position: 'absolute', bottom: '2.8rem', right: 'clamp(1.5rem,4vw,4rem)',
          zIndex: 20, pointerEvents: 'none',
        }}>
          <FrameCounter springRef={springRef} total={TOTAL_FRAMES} />
        </div>

      </div>
    </>
  );
}

// ─── Frame counter ────────────────────────────────────────────────────────────
function FrameCounter({ springRef, total }: { springRef: React.MutableRefObject<number>; total: number }) {
  const elRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    let rafId: number;
    let last = -1;
    const tick = () => {
      const idx = Math.min(Math.max(0, Math.round(springRef.current * (total - 1))), total - 1) + 1;
      if (idx !== last && elRef.current) {
        elRef.current.textContent = `${String(idx).padStart(3, '0')} / ${total}`;
        last = idx;
      }
      rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [springRef, total]);

  return (
    <p ref={elRef} style={{
      fontFamily: "'Inter Tight',monospace", fontWeight: 200,
      fontSize: '0.52rem', letterSpacing: '0.4em',
      color: 'rgba(255,255,255,0.2)', textTransform: 'uppercase',
    }}>
      001 / {total}
    </p>
  );
}
