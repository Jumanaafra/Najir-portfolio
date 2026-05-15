'use client';

import { useRef, useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/* ─── Data ───────────────────────────────────────────────────────────────── */
const PROJECTS = [
  {
    id: '01',
    title: 'offerbizz.com',
    subtitle: 'Business Listings Platform',
    url: 'https://offerbizz.com',
    desc: 'A high-performance business listings platform with lead capture forms, schema-based SEO, Google Analytics 4 tracking, and conversion funnel optimisation for local business discovery.',
    tags: ['WordPress', 'Schema SEO', 'GA4', 'Lead Gen', 'Conversion'],
    color: '#3B82F6',
    rgb: '59,130,246',
    emoji: '🏪',
    stat: 'B2C Platform',
  },
  {
    id: '02',
    title: 'commercialtraders.in',
    subtitle: 'Responsive B2B Trading Website',
    url: 'https://commercialtraders.in',
    desc: 'Conversion-focused B2B trading website with WhatsApp CTA integration, mobile-first responsive design, Core Web Vitals optimisation, and SEO-driven traffic strategy.',
    tags: ['WordPress', 'WhatsApp CTA', 'Mobile UX', 'SEO', 'Core Web Vitals'],
    color: '#22D3EE',
    rgb: '34,211,238',
    emoji: '🏭',
    stat: 'B2B Portal',
  },
  {
    id: '03',
    title: 'amirhamzabm.com',
    subtitle: 'Personal Branding & Booking',
    url: 'https://amirhamzabm.com',
    desc: 'Premium personal brand website with integrated booking flow, dedicated service pages, SEO structure, and responsive design to maximise client conversions.',
    tags: ['WordPress', 'Booking Flow', 'Service Pages', 'SEO', 'Responsive'],
    color: '#8B5CF6',
    rgb: '139,92,246',
    emoji: '✨',
    stat: 'Brand Site',
  },
  {
    id: '04',
    title: 'Pharmacy Manager',
    subtitle: 'Desktop App — Python + SQLite3',
    url: '#',
    desc: 'Full-featured pharmacy management system with inventory control, automated billing engine, medicine expiry alerts, revenue dashboard, and full database operations via SQLite3.',
    tags: ['Python', 'SQLite3', 'Inventory', 'Billing', 'Expiry Alerts'],
    color: '#10B981',
    rgb: '16,185,129',
    emoji: '💊',
    stat: 'Healthcare App',
  },
  {
    id: '05',
    title: 'Price Comparator',
    subtitle: 'E-Commerce Intelligence Tool',
    url: '#',
    desc: 'Automated price comparison tool for e-commerce products built during internship — multi-store tracking, SQLite3 database management, and structured data analysis.',
    tags: ['Python', 'SQLite3', 'Web Scraping', 'Price Analysis', 'Data Ops'],
    color: '#F59E0B',
    rgb: '245,158,11',
    emoji: '📊',
    stat: 'Analytics Tool',
  },
];

/* ─── Progress dots ──────────────────────────────────────────────────────── */
function Dots({ active, total, onDot }: { active: number; total: number; onDot: (i: number) => void }) {
  return (
    <div style={{ display: 'flex', gap: '0.45rem', alignItems: 'center' }}>
      {Array.from({ length: total }).map((_, i) => (
        <button
          key={i}
          onClick={() => onDot(i)}
          aria-label={`Project ${i + 1}`}
          style={{
            height: 2, borderRadius: 2, border: 'none', cursor: 'pointer', padding: 0,
            width: i === active ? 28 : 12,
            background: i === active
              ? 'linear-gradient(90deg,#3B82F6,#22D3EE)'
              : 'rgba(255,255,255,0.15)',
            boxShadow: i === active ? '0 0 8px rgba(59,130,246,0.7)' : 'none',
            transition: 'all 0.4s cubic-bezier(0.16,1,0.3,1)',
          }}
        />
      ))}
    </div>
  );
}

/* ─── Card content (shared between desktop + mobile) ─────────────────────── */
function CardContent({ p, isActive }: { p: typeof PROJECTS[0]; isActive: boolean }) {
  return (
    <>
      {/* Top metallic shimmer line */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: 1,
        background: isActive
          ? `linear-gradient(90deg,transparent 0%,rgba(255,255,255,0.08) 15%,rgba(${p.rgb},0.85) 50%,rgba(255,255,255,0.08) 85%,transparent 100%)`
          : 'rgba(255,255,255,0.05)',
        transition: 'background 0.6s ease',
      }} />

      {/* Reflection sheen */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: '42%',
        background: 'linear-gradient(180deg,rgba(255,255,255,0.028) 0%,transparent 100%)',
        borderRadius: '24px 24px 0 0', pointerEvents: 'none',
      }} />

      {/* Ambient glow */}
      {isActive && (
        <div style={{
          position: 'absolute', top: -50, left: '15%', width: 260, height: 260,
          background: `radial-gradient(circle,rgba(${p.rgb},0.11),transparent 70%)`,
          filter: 'blur(35px)', pointerEvents: 'none', borderRadius: '50%',
        }} />
      )}

      {/* ID watermark */}
      <p style={{
        position: 'absolute', top: '1.5rem', right: '1.8rem',
        fontFamily: "'Inter Tight',sans-serif", fontWeight: 800,
        fontSize: 'clamp(4rem,7vw,8rem)', lineHeight: 1, letterSpacing: '-0.05em',
        color: 'rgba(255,255,255,0.03)', userSelect: 'none', pointerEvents: 'none',
        margin: 0,
      }}>{p.id}</p>

      {/* Emoji + stat badge */}
      <div style={{ position: 'relative', zIndex: 2, marginBottom: 'auto', display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
        <span style={{
          fontSize: 'clamp(1.5rem,2.5vw,2.2rem)', display: 'block', marginBottom: '0.45rem',
        }}>{p.emoji}</span>
        <span style={{
          display: 'inline-block', padding: '0.22rem 0.65rem',
          background: `rgba(${p.rgb},0.12)`, border: `1px solid rgba(${p.rgb},0.28)`,
          borderRadius: 100, fontFamily: "'Inter Tight',sans-serif",
          fontWeight: 400, fontSize: '0.52rem', letterSpacing: '0.18em',
          color: p.color, textTransform: 'uppercase',
        }}>{p.stat}</span>
      </div>

      {/* Main content — anchored to bottom */}
      <div style={{ position: 'relative', zIndex: 2, marginTop: '1.5rem', display: 'flex', flexDirection: 'column' }}>
        {/* Subtitle */}
        <p style={{
          fontFamily: "'Inter Tight',sans-serif", fontWeight: 200,
          fontSize: 'clamp(0.48rem,0.9vw,0.56rem)', letterSpacing: '0.42em',
          color: p.color, textTransform: 'uppercase', marginBottom: '0.5rem',
        }}>{p.subtitle}</p>

        {/* Title */}
        <h3 style={{
          fontFamily: "'Inter Tight',sans-serif", fontWeight: 800,
          fontSize: 'clamp(1.25rem,2.5vw,2.2rem)', letterSpacing: '-0.03em',
          lineHeight: 1.02, marginBottom: '0.85rem',
          wordBreak: 'break-word',
          background: isActive
            ? `linear-gradient(135deg,#fff 0%,rgba(${p.rgb},0.85) 100%)`
            : 'rgba(255,255,255,0.65)',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          transition: 'background 0.5s ease',
        } as React.CSSProperties}>{p.title}</h3>

        {/* Description */}
        <p style={{
          fontFamily: "'Inter Tight',sans-serif", fontWeight: 300,
          fontSize: 'clamp(0.72rem,1vw,0.84rem)', lineHeight: 1.82,
          color: 'rgba(255,255,255,0.52)', marginBottom: '1.2rem',
          maxWidth: '44ch',
        }}>{p.desc}</p>

        {/* Tags */}
        <div style={{ display: 'flex', gap: '0.38rem', flexWrap: 'wrap', marginBottom: '1.4rem' }}>
          {p.tags.map(tag => (
            <span key={tag} style={{
              padding: '0.24rem 0.7rem',
              background: `rgba(${p.rgb},0.08)`,
              border: `1px solid rgba(${p.rgb},0.22)`,
              borderRadius: 100,
              fontFamily: "'Inter Tight',sans-serif",
              fontWeight: 400, fontSize: '0.52rem', letterSpacing: '0.1em',
              color: `rgba(${p.rgb},0.9)`, textTransform: 'uppercase',
              whiteSpace: 'nowrap',
            }}>{tag}</span>
          ))}
        </div>

        {/* CTA */}
        {p.url !== '#' && (
          <motion.a
            href={p.url} target="_blank" rel="noopener noreferrer"
            whileHover={{ y: -2, scale: 1.04 }} whileTap={{ scale: 0.97 }}
            className="btn-silver"
            style={{ textDecoration: 'none', display: 'inline-flex', flexShrink: 0 }}
          >
            Visit Live Site
            <svg width="9" height="9" viewBox="0 0 10 10" fill="none">
              <path d="M1 9L9 1M9 1H3M9 1V7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </motion.a>
        )}
      </div>
    </>
  );
}

/* ─── Desktop card (with 3D tilt) ────────────────────────────────────────── */
function DesktopCard({ p, isActive, onClick }: {
  p: typeof PROJECTS[0]; isActive: boolean; onClick: () => void;
}) {
  const ref  = useRef<HTMLDivElement>(null);
  const rotX = useMotionValue(0);
  const rotY = useMotionValue(0);
  const sX   = useSpring(rotX, { stiffness: 80, damping: 18 });
  const sY   = useSpring(rotY, { stiffness: 80, damping: 18 });

  const onMove = (e: React.MouseEvent) => {
    if (!isActive || !ref.current) return;
    const r  = ref.current.getBoundingClientRect();
    rotX.set(((e.clientY - r.top  - r.height / 2) / (r.height / 2)) * -4);
    rotY.set(((e.clientX - r.left - r.width  / 2) / (r.width  / 2)) *  4);
  };
  const onLeave = () => { rotX.set(0); rotY.set(0); };

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      onClick={onClick}
      style={{
        rotateX: sX, rotateY: sY,
        transformStyle: 'preserve-3d', perspective: 1200,
        width: '100%', height: '100%',
      }}
    >
      <div style={{
        width: '100%', height: '100%',
        borderRadius: 24,
        transform: isActive ? 'scale(1)' : 'scale(0.88)',
        opacity: isActive ? 1 : 0.28,
        filter: isActive ? 'blur(0px)' : 'blur(4px)',
        transition: 'transform 0.6s cubic-bezier(0.16,1,0.3,1), opacity 0.5s ease, filter 0.5s ease',
        cursor: isActive ? 'default' : 'pointer',
      }}>
        <div style={{
          width: '100%', height: '100%', borderRadius: 24,
          background: isActive
            ? `linear-gradient(145deg,rgba(${p.rgb},0.09) 0%,rgba(8,8,10,0.97) 65%)`
            : 'rgba(6,6,8,0.92)',
          border: `1px solid ${isActive ? `rgba(${p.rgb},0.28)` : 'rgba(255,255,255,0.05)'}`,
          padding: 'clamp(1.8rem,3.5vw,3rem)',
          display: 'flex', flexDirection: 'column', justifyContent: 'flex-end',
          position: 'relative', overflow: 'hidden',
          boxShadow: isActive
            ? `0 0 0 1px rgba(${p.rgb},0.12), 0 20px 60px rgba(0,0,0,0.82), 0 0 80px rgba(${p.rgb},0.06)`
            : '0 8px 28px rgba(0,0,0,0.6)',
          transition: 'all 0.55s ease',
        }}>
          <CardContent p={p} isActive={isActive} />
        </div>
      </div>
    </motion.div>
  );
}

/* ─── Mobile card swiper ─────────────────────────────────────────────────── */
function MobileSwiper({ active, goTo }: { active: number; goTo: (i: number) => void }) {
  const p = PROJECTS[active];

  return (
    <div style={{ padding: '0 clamp(1.2rem,5vw,2rem) clamp(2.5rem,5vh,4rem)' }}>
      {/* Card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={active}
          initial={{ opacity: 0, x: 40, scale: 0.95 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: -40, scale: 0.95 }}
          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          style={{
            borderRadius: 22,
            background: `linear-gradient(145deg,rgba(${p.rgb},0.08) 0%,rgba(8,8,10,0.97) 65%)`,
            border: `1px solid rgba(${p.rgb},0.28)`,
            padding: 'clamp(1.4rem,5vw,2.2rem)',
            display: 'flex', flexDirection: 'column',
            position: 'relative', overflow: 'hidden',
            boxShadow: `0 0 0 1px rgba(${p.rgb},0.1), 0 16px 50px rgba(0,0,0,0.8), 0 0 60px rgba(${p.rgb},0.06)`,
            minHeight: 'clamp(360px,55vh,480px)',
          }}
        >
          <CardContent p={p} isActive={true} />
        </motion.div>
      </AnimatePresence>

      {/* Nav row */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        marginTop: '1.5rem', gap: '1rem',
      }}>
        {/* Prev */}
        <button
          onClick={() => goTo(active - 1)}
          disabled={active === 0}
          style={{
            width: 42, height: 42, borderRadius: '50%', border: 'none',
            background: active === 0 ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.08)',
            color: active === 0 ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.75)',
            cursor: active === 0 ? 'not-allowed' : 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            transition: 'all 0.3s ease', flexShrink: 0,
            boxShadow: '0 2px 12px rgba(0,0,0,0.4), 0 1px 0 rgba(255,255,255,0.06) inset',
          }}
          aria-label="Previous project"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M9 2L4 7l5 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>

        {/* Dots */}
        <Dots active={active} total={PROJECTS.length} onDot={goTo} />

        {/* Next */}
        <button
          onClick={() => goTo(active + 1)}
          disabled={active === PROJECTS.length - 1}
          style={{
            width: 42, height: 42, borderRadius: '50%', border: 'none',
            background: active === PROJECTS.length - 1 ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.08)',
            color: active === PROJECTS.length - 1 ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.75)',
            cursor: active === PROJECTS.length - 1 ? 'not-allowed' : 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            transition: 'all 0.3s ease', flexShrink: 0,
            boxShadow: '0 2px 12px rgba(0,0,0,0.4), 0 1px 0 rgba(255,255,255,0.06) inset',
          }}
          aria-label="Next project"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M5 2l5 5-5 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>
    </div>
  );
}

/* ─── Section header ─────────────────────────────────────────────────────── */
function SectionHeader({ active, isMobile }: { active: number; isMobile: boolean }) {
  return (
    <div style={{
      position: 'relative', zIndex: 10,
      padding: `clamp(4rem,8vh,6.5rem) clamp(1.4rem,6vw,6rem) clamp(1.8rem,3vh,2.5rem)`,
      display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between',
      flexWrap: 'wrap', gap: '1.2rem',
    }}>
      <div>
        <motion.p
          initial={{ opacity: 0, x: -24 }} whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.7 }}
          style={{
            fontFamily: "'Inter Tight',sans-serif", fontWeight: 200,
            fontSize: '0.56rem', letterSpacing: '0.48em', textTransform: 'uppercase',
            color: '#3B82F6', marginBottom: '0.8rem',
          }}
        >Selected Works</motion.p>

        <motion.h2
          initial={{ opacity: 0, y: 24, filter: 'blur(8px)' }}
          whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          style={{
            fontFamily: "'Inter Tight',sans-serif", fontWeight: 800,
            fontSize: 'clamp(2rem,4.5vw,4.2rem)',
            letterSpacing: '-0.04em', lineHeight: 0.9, margin: 0,
          }}
        >
          <span style={{
            background: 'linear-gradient(135deg,#fff 0%,#d1d5db 50%,#fff 100%)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          } as React.CSSProperties}>PROJECT</span>
          <br />
          <span style={{ color: 'rgba(255,255,255,0.18)', fontWeight: 200 }}>SHOWCASE</span>
        </motion.h2>
      </div>

      {/* Counter + dots — hidden on mobile (dots are in swiper) */}
      {!isMobile && (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.55rem' }}>
          <p style={{
            fontFamily: "'Inter Tight',sans-serif", fontWeight: 200,
            fontSize: '0.52rem', letterSpacing: '0.32em', textTransform: 'uppercase',
            color: 'rgba(255,255,255,0.25)',
          }}>
            {String(active + 1).padStart(2, '0')} / {String(PROJECTS.length).padStart(2, '0')}
          </p>
          <Dots active={active} total={PROJECTS.length} onDot={() => {}} />
        </div>
      )}
    </div>
  );
}

/* ─── Main export ────────────────────────────────────────────────────────── */
export default function Projects() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const trackRef   = useRef<HTMLDivElement>(null);
  const [active,   setActive]   = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  /* JS-driven breakpoint */
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check, { passive: true });
    return () => window.removeEventListener('resize', check);
  }, []);

  /* GSAP horizontal pin — desktop only */
  useEffect(() => {
    if (isMobile) return;
    const section = sectionRef.current;
    const track   = trackRef.current;
    if (!section || !track) return;

    const getScrollAmt = () => {
      const cards = track.querySelectorAll<HTMLElement>('.proj-slide');
      if (!cards.length) return 0;
      return (cards[0].offsetWidth + 24) * (PROJECTS.length - 1);
    };

    const ctx = gsap.context(() => {
      gsap.to(track, {
        x: () => -getScrollAmt(),
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: () => `+=${getScrollAmt() + window.innerWidth * 0.55}`,
          pin: true, scrub: 1, anticipatePin: 1, invalidateOnRefresh: true,
          onUpdate: self => {
            const idx = Math.round(self.progress * (PROJECTS.length - 1));
            setActive(Math.max(0, Math.min(PROJECTS.length - 1, idx)));
          },
        },
      });
    }, section);

    return () => ctx.revert();
  }, [isMobile]);

  /* Keyboard nav */
  const goTo = useCallback((idx: number) => {
    setActive(Math.max(0, Math.min(PROJECTS.length - 1, idx)));
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') goTo(active + 1);
      if (e.key === 'ArrowLeft')  goTo(active - 1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [active, goTo]);

  return (
    <section
      id="projects"
      ref={sectionRef}
      style={{ background: '#050505', overflow: 'hidden', position: 'relative' }}
    >
      {/* BG glow */}
      <div aria-hidden style={{
        position: 'absolute', inset: 0, zIndex: 0, pointerEvents: 'none',
        background: 'radial-gradient(ellipse 90% 60% at 50% 50%,rgba(59,130,246,0.03) 0%,transparent 65%)',
      }} />

      {/* Section header */}
      <SectionHeader active={active} isMobile={isMobile} />

      {/* ── MOBILE: single-card swiper ───────────────────────────────── */}
      {isMobile && (
        <MobileSwiper active={active} goTo={goTo} />
      )}

      {/* ── DESKTOP: GSAP pinned horizontal carousel ─────────────────── */}
      {!isMobile && (
        <div
          ref={trackRef}
          style={{
            display: 'flex', gap: 24,
            padding: `0 clamp(1.4rem,6vw,6rem) clamp(3rem,6vh,4.5rem)`,
            willChange: 'transform',
          }}
        >
          {PROJECTS.map((project, i) => (
            <div
              key={project.id}
              className="proj-slide"
              style={{
                flexShrink: 0,
                width:  'clamp(320px,52vw,640px)',
                height: 'clamp(360px,54vh,520px)',
              }}
            >
              <DesktopCard
                p={project}
                isActive={i === active}
                onClick={() => goTo(i)}
              />
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
