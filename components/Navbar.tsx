'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const NAV_LINKS = [
  { label: 'About',        href: '#about' },
  { label: 'Experience',   href: '#experience' },
  { label: 'Skills',       href: '#skills' },
  { label: 'Projects',     href: '#projects' },
  { label: 'Certificates', href: '#certificates' },
  { label: 'Contact',      href: '#contact' },
];

interface NavbarProps { visible: boolean; }

export default function Navbar({ visible }: NavbarProps) {
  const [scrolled,  setScrolled]  = useState(false);
  const [menuOpen,  setMenuOpen]  = useState(false);
  const [active,    setActive]    = useState('');
  const [isMobile,  setIsMobile]  = useState(false);   // ← JS-driven breakpoint
  const ticking = useRef(false);

  /* ── Responsive: track viewport width ─────────────────────────────── */
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth <= 900);
    check();
    window.addEventListener('resize', check, { passive: true });
    return () => window.removeEventListener('resize', check);
  }, []);

  /* ── Scroll opacity ────────────────────────────────────────────────── */
  useEffect(() => {
    if (!visible) return;
    const onScroll = () => {
      if (!ticking.current) {
        requestAnimationFrame(() => {
          setScrolled(window.scrollY > 50);
          ticking.current = false;
        });
        ticking.current = true;
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [visible]);

  /* ── Active section tracking ───────────────────────────────────────── */
  useEffect(() => {
    if (!visible) return;
    const observer = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) setActive(e.target.id); }),
      { threshold: 0.35 }
    );
    NAV_LINKS.forEach(({ href }) => {
      const el = document.querySelector(href);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [visible]);

  const scrollTo = (href: string) => {
    setMenuOpen(false);
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.nav
          initial={{ y: -90, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -90, opacity: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          style={{
            position: 'fixed', top: 0, left: 0, right: 0, zIndex: 200,
            padding: '0 clamp(1.5rem, 5vw, 5rem)',
            height: scrolled ? '58px' : '76px',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            background: scrolled ? 'rgba(5,5,5,0.9)' : 'transparent',
            backdropFilter: scrolled ? 'blur(28px) saturate(1.6)' : 'none',
            borderBottom: scrolled ? '1px solid rgba(255,255,255,0.08)' : '1px solid transparent',
            boxShadow: scrolled ? '0 1px 0 rgba(255,255,255,0.04), 0 8px 32px rgba(0,0,0,0.5)' : 'none',
            transition: 'height 0.5s cubic-bezier(0.16,1,0.3,1), background 0.5s, border-color 0.5s, box-shadow 0.5s',
          }}
        >
          {/* ── Logo ─────────────────────────────────────────────── */}
          <motion.button
            onClick={() => scrollTo('#about')}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            style={{
              background: 'none', border: 'none', cursor: 'pointer', padding: 0,
              fontFamily: "'Inter Tight', sans-serif",
              fontWeight: 800, fontSize: '0.9rem', letterSpacing: '0.1em',
              textTransform: 'uppercase',
            }}
          >
            <span style={{
              background: 'linear-gradient(135deg,#fff 0%,#d1d5db 50%,#fff 100%)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            }}>M</span>
            <span style={{
              background: 'linear-gradient(135deg,#3B82F6,#22D3EE)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            }}>.</span>
            <span style={{
              background: 'linear-gradient(135deg,#fff 0%,#d1d5db 50%,#fff 100%)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            }}>NAZEER</span>
          </motion.button>

          {/* ── Desktop nav (always visible when isMobile=false) ──── */}
          {!isMobile && (
            <ul style={{
              display: 'flex', alignItems: 'center',
              gap: '2.2rem', listStyle: 'none', margin: 0, padding: 0,
            }}>
              {NAV_LINKS.map(({ label, href }) => {
                const isActive = active === href.slice(1);
                return (
                  <li key={href} style={{ position: 'relative' }}>
                    <button
                      onClick={() => scrollTo(href)}
                      style={{
                        background: 'none', border: 'none', cursor: 'pointer',
                        padding: '0.3rem 0',
                        fontFamily: "'Inter Tight', sans-serif",
                        fontWeight: isActive ? 500 : 300,
                        fontSize: '0.63rem', letterSpacing: '0.2em',
                        color: isActive ? 'rgba(255,255,255,0.96)' : 'rgba(255,255,255,0.48)',
                        textTransform: 'uppercase',
                        transition: 'color 0.3s ease',
                      }}
                      onMouseEnter={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.88)')}
                      onMouseLeave={e => {
                        e.currentTarget.style.color = isActive
                          ? 'rgba(255,255,255,0.96)'
                          : 'rgba(255,255,255,0.48)';
                      }}
                    >
                      {label}
                    </button>
                    {isActive && (
                      <motion.span
                        layoutId="nav-active-dot"
                        style={{
                          position: 'absolute', bottom: -6, left: '50%',
                          translateX: '-50%',
                          width: 3, height: 3, borderRadius: '50%',
                          background: 'linear-gradient(135deg,#3B82F6,#22D3EE)',
                          boxShadow: '0 0 8px rgba(59,130,246,0.8)',
                          display: 'block',
                        }}
                      />
                    )}
                  </li>
                );
              })}

              {/* HIRE ME */}
              <li>
                <HireMeButton onPress={() => scrollTo('#contact')} />
              </li>
            </ul>
          )}

          {/* ── Mobile hamburger (only when isMobile=true) ─────────── */}
          {isMobile && (
            <button
              onClick={() => setMenuOpen(o => !o)}
              aria-label="Toggle navigation"
              style={{
                background: 'none', border: 'none', cursor: 'pointer',
                display: 'flex', flexDirection: 'column', gap: '5px', padding: '6px',
              }}
            >
              {[0, 1, 2].map(i => (
                <motion.span
                  key={i}
                  animate={
                    menuOpen
                      ? i === 1
                        ? { opacity: 0, scaleX: 0 }
                        : { rotate: i === 0 ? 45 : -45, y: i === 0 ? 7 : -7 }
                      : { rotate: 0, y: 0, opacity: 1, scaleX: 1 }
                  }
                  transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                  style={{
                    display: 'block', width: 22, height: 1.5,
                    background: 'linear-gradient(90deg,rgba(255,255,255,0.75),rgba(255,255,255,0.4))',
                    borderRadius: 2, transformOrigin: 'center',
                  }}
                />
              ))}
            </button>
          )}

          {/* ── Mobile dropdown menu ─────────────────────────────── */}
          <AnimatePresence>
            {isMobile && menuOpen && (
              <motion.div
                initial={{ opacity: 0, y: -16, scaleY: 0.9 }}
                animate={{ opacity: 1, y: 0, scaleY: 1 }}
                exit={{ opacity: 0, y: -16, scaleY: 0.9 }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                style={{
                  position: 'fixed', top: 58, left: 0, right: 0,
                  background: 'rgba(5,5,5,0.97)',
                  backdropFilter: 'blur(28px)',
                  borderBottom: '1px solid rgba(255,255,255,0.07)',
                  padding: '2rem clamp(1.5rem,5vw,4rem)',
                  display: 'flex', flexDirection: 'column', gap: '1.5rem',
                  transformOrigin: 'top',
                  boxShadow: '0 20px 60px rgba(0,0,0,0.7)',
                }}
              >
                {NAV_LINKS.map(({ label, href }) => (
                  <button
                    key={href}
                    onClick={() => scrollTo(href)}
                    style={{
                      background: 'none', border: 'none', cursor: 'pointer',
                      textAlign: 'left',
                      fontFamily: "'Inter Tight', sans-serif", fontWeight: 400,
                      fontSize: '1.05rem', letterSpacing: '0.1em',
                      color: active === href.slice(1)
                        ? 'rgba(255,255,255,0.96)'
                        : 'rgba(255,255,255,0.55)',
                      textTransform: 'uppercase',
                    }}
                  >
                    {label}
                  </button>
                ))}
                <div style={{ paddingTop: '0.5rem' }}>
                  <HireMeButton onPress={() => scrollTo('#contact')} fullWidth />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.nav>
      )}
    </AnimatePresence>
  );
}

/* ── HIRE ME luxury silver button ──────────────────────────────────────── */
function HireMeButton({ onPress, fullWidth }: { onPress: () => void; fullWidth?: boolean }) {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.button
      onClick={onPress}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      animate={{ y: hovered ? -2 : 0, scale: hovered ? 1.05 : 1 }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      style={{
        position: 'relative',
        display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
        justifyContent: fullWidth ? 'center' : undefined,
        width: fullWidth ? '100%' : undefined,
        padding: '0.65rem 1.6rem',
        borderRadius: '100px',
        fontFamily: "'Inter Tight', sans-serif",
        fontWeight: 600, fontSize: '0.62rem', letterSpacing: '0.22em',
        textTransform: 'uppercase',
        cursor: 'pointer', border: 'none', outline: 'none',
        overflow: 'hidden',
        color: 'rgba(255,255,255,0.95)',
        background: hovered
          ? 'linear-gradient(135deg,rgba(255,255,255,0.22) 0%,rgba(255,255,255,0.35) 40%,rgba(255,255,255,0.14) 100%)'
          : 'linear-gradient(135deg,rgba(255,255,255,0.12) 0%,rgba(255,255,255,0.22) 40%,rgba(255,255,255,0.08) 100%)',
        boxShadow: hovered
          ? '0 0 0 1px rgba(255,255,255,0.38), 0 8px 32px rgba(255,255,255,0.1), 0 1px 0 rgba(255,255,255,0.2) inset'
          : '0 0 0 1px rgba(255,255,255,0.2), 0 4px 16px rgba(0,0,0,0.4), 0 1px 0 rgba(255,255,255,0.12) inset',
        transition: 'background 0.3s ease, box-shadow 0.3s ease',
      }}
    >
      {/* Animated shimmer */}
      <motion.span
        animate={{ x: ['−100%', '200%'] }}
        transition={{ duration: 2.4, repeat: Infinity, ease: 'linear', repeatDelay: 0.5 }}
        style={{
          position: 'absolute', top: 0, left: 0,
          width: '40%', height: '100%',
          background: 'linear-gradient(90deg,transparent,rgba(255,255,255,0.28),transparent)',
          pointerEvents: 'none',
          transform: 'skewX(-20deg)',
        }}
      />
      <span style={{ position: 'relative', zIndex: 1 }}>Hire Me</span>
      <svg width="10" height="10" viewBox="0 0 10 10" fill="none" style={{ position: 'relative', zIndex: 1, flexShrink: 0 }}>
        <path d="M1 9L9 1M9 1H3M9 1V7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    </motion.button>
  );
}
