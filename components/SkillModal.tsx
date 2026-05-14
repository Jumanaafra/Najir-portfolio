'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';

export interface SkillCategory {
  name: string;
  color: string;
  icon: string;
  skills: string[];
  desc: string;
  tools: string[];
  experience: string;
  image: string; // path under /public e.g. "/dp-bismillah/supply-chain-inventory.png"
}

interface SkillModalProps {
  category: SkillCategory | null;
  onClose: () => void;
}

/* ── Cinematic image panel ───────────────────────────────────────────────── */
function ImagePanel({ category }: { category: SkillCategory }) {
  const rgb = hexToRgb(category.color);

  return (
    <div style={{
      position: 'relative', width: '100%',
      minHeight: 'clamp(280px, 50vh, 520px)',
      borderRadius: 20, overflow: 'hidden',
      background: '#0a0a0a',
    }}>
      {/* ── Real image ───────────────────────────────────────────── */}
      <motion.img
        src={category.image}
        alt={category.name}
        initial={{ scale: 1.06, opacity: 0 }}
        animate={{ scale: 1,    opacity: 1  }}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        style={{
          position: 'absolute', inset: 0,
          width: '100%', height: '100%',
          objectFit: 'cover', objectPosition: 'center',
          display: 'block',
        }}
      />

      {/* Dark cinematic vignette */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        background: `
          radial-gradient(ellipse at center, transparent 30%, rgba(0,0,0,0.55) 100%),
          linear-gradient(180deg, rgba(0,0,0,0.18) 0%, transparent 35%, transparent 55%, rgba(0,0,0,0.7) 100%),
          linear-gradient(90deg, rgba(0,0,0,0.25) 0%, transparent 40%)
        `,
      }} />

      {/* Color accent overlay — ties image to category color */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        background: `linear-gradient(135deg, rgba(${rgb},0.12) 0%, transparent 60%)`,
        mixBlendMode: 'screen',
      }} />

      {/* Top edge shimmer */}
      <div style={{
        position: 'absolute', top: 0, left: '8%', right: '8%', height: 1,
        background: `linear-gradient(90deg, transparent, rgba(255,255,255,0.25) 40%, rgba(${rgb},0.7) 50%, rgba(255,255,255,0.25) 60%, transparent)`,
        pointerEvents: 'none',
      }} />

      {/* Subtle moving gradient light */}
      <motion.div
        animate={{ x: ['-10%', '110%'] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'linear', repeatDelay: 2 }}
        style={{
          position: 'absolute', top: 0, bottom: 0,
          width: '30%', pointerEvents: 'none',
          background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.04), transparent)',
          transform: 'skewX(-15deg)',
        }}
      />

      {/* Cinematic noise grain */}
      <div aria-hidden style={{
        position: 'absolute', inset: 0, pointerEvents: 'none', opacity: 0.04,
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        backgroundSize: '180px 180px',
      }} />

      {/* Bottom caption badge */}
      <div style={{
        position: 'absolute', bottom: '1.4rem', left: '1.4rem',
        display: 'flex', alignItems: 'center', gap: '0.6rem',
        padding: '0.55rem 1rem',
        background: 'rgba(0,0,0,0.55)',
        backdropFilter: 'blur(12px)',
        border: `1px solid rgba(${rgb},0.28)`,
        borderRadius: 100,
      }}>
        <span style={{ fontSize: '1rem' }}>{category.icon}</span>
        <span style={{
          fontFamily: "'Inter Tight', sans-serif", fontWeight: 400,
          fontSize: '0.62rem', letterSpacing: '0.18em',
          color: 'rgba(255,255,255,0.8)', textTransform: 'uppercase',
        }}>{category.name}</span>
      </div>
    </div>
  );
}

/* ── Progress bar ────────────────────────────────────────────────────────── */
function SkillBar({ skill, color, index }: { skill: string; color: string; index: number }) {
  const rgb = hexToRgb(color);
  const pct = 72 + (index * 7) % 26;

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.1 + index * 0.06, ease: [0.16, 1, 0.3, 1] }}
      style={{ marginBottom: '0.85rem' }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem' }}>
          <motion.div
            animate={{ opacity: [1, 0.4, 1], scale: [1, 1.3, 1] }}
            transition={{ duration: 2.2 + index * 0.3, repeat: Infinity }}
            style={{
              width: 5, height: 5, borderRadius: '50%',
              background: color, boxShadow: `0 0 8px ${color}`,
              flexShrink: 0,
            }}
          />
          <span style={{
            fontFamily: "'Inter Tight', sans-serif", fontWeight: 400,
            fontSize: '0.78rem', color: 'rgba(255,255,255,0.82)',
          }}>{skill}</span>
        </div>
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 + index * 0.06 }}
          style={{
            fontFamily: "'Inter Tight', sans-serif", fontWeight: 300,
            fontSize: '0.62rem', letterSpacing: '0.08em',
            color: `rgba(${rgb},0.9)`,
          }}
        >{pct}%</motion.span>
      </div>
      <div style={{
        height: 3, borderRadius: 2,
        background: 'rgba(255,255,255,0.06)', overflow: 'hidden',
      }}>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.9, delay: 0.2 + index * 0.07, ease: [0.16, 1, 0.3, 1] }}
          style={{
            height: '100%', borderRadius: 2,
            background: `linear-gradient(90deg, ${color}, rgba(${rgb},0.5))`,
            boxShadow: `0 0 8px rgba(${rgb},0.6)`,
          }}
        />
      </div>
    </motion.div>
  );
}

function hexToRgb(hex: string) {
  return `${parseInt(hex.slice(1, 3), 16)},${parseInt(hex.slice(3, 5), 16)},${parseInt(hex.slice(5, 7), 16)}`;
}

/* ── Main modal ──────────────────────────────────────────────────────────── */
export default function SkillModal({ category, onClose }: SkillModalProps) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  useEffect(() => {
    if (category) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [category]);

  const modalContent = (
    <AnimatePresence mode="wait">
      {category && (
        <>
          {/* ── Backdrop ─────────────────────────────────────────────── */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
            onClick={onClose}
            style={{
              position: 'fixed', inset: 0, zIndex: 400,
              background: 'rgba(0,0,0,0.85)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
            }}
          />

          {/* ── Modal panel ──────────────────────────────────────────── */}
          <motion.div
            key="modal"
            initial={{ opacity: 0, scale: 0.9, y: 36 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 36 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            style={{
              position: 'fixed', inset: 0, zIndex: 401,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              padding: 'clamp(1rem,3vw,2rem)',
              pointerEvents: 'none',
            }}
          >
            <div
              onClick={e => e.stopPropagation()}
              style={{
                pointerEvents: 'all',
                width: '100%', maxWidth: 1000,
                maxHeight: '92vh', overflowY: 'auto',
                scrollbarWidth: 'none',
                borderRadius: 32,
                background: 'linear-gradient(145deg, rgba(10,10,14,0.98) 0%, rgba(6,6,9,0.99) 100%)',
                border: '1px solid rgba(255,255,255,0.1)',
                boxShadow: `
                  0 0 0 1px rgba(255,255,255,0.04),
                  0 40px 100px rgba(0,0,0,0.95),
                  0 0 140px rgba(255,255,255,0.025)
                `,
                backdropFilter: 'blur(40px)',
                position: 'relative', overflow: 'hidden',
              }}
            >
              {/* Noise texture */}
              <div aria-hidden style={{
                position: 'absolute', inset: 0, zIndex: 0, pointerEvents: 'none', opacity: 0.025,
                backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
                backgroundSize: '180px 180px',
              }} />

              {/* Colour glow blobs */}
              <motion.div
                animate={{ opacity: [0.4, 0.7, 0.4], scale: [1, 1.12, 1] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                style={{
                  position: 'absolute', top: -80, right: -80, width: 300, height: 300,
                  borderRadius: '50%',
                  background: `radial-gradient(circle,${category.color}18,transparent 70%)`,
                  filter: 'blur(30px)', pointerEvents: 'none',
                }}
              />
              <motion.div
                animate={{ opacity: [0.25, 0.45, 0.25] }}
                transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1.5 }}
                style={{
                  position: 'absolute', bottom: -60, left: -60, width: 260, height: 260,
                  borderRadius: '50%',
                  background: `radial-gradient(circle,${category.color}0e,transparent 70%)`,
                  filter: 'blur(28px)', pointerEvents: 'none',
                }}
              />

              {/* Top shimmer line */}
              <div style={{
                position: 'absolute', top: 0, left: '10%', right: '10%', height: 1,
                background: `linear-gradient(90deg,transparent,${category.color}70 50%,transparent)`,
                zIndex: 2,
              }} />

              {/* ── Close ──────────────────────────────────────────── */}
              <motion.button
                onClick={onClose}
                whileHover={{ scale: 1.12, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                style={{
                  position: 'absolute', top: '1.4rem', right: '1.4rem', zIndex: 10,
                  width: 38, height: 38, borderRadius: '50%',
                  background: 'rgba(255,255,255,0.07)',
                  border: '1px solid rgba(255,255,255,0.12)',
                  cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: 'rgba(255,255,255,0.7)',
                }}
                onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.14)')}
                onMouseLeave={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.07)')}
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M1 1l12 12M13 1L1 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              </motion.button>

              {/* ── Two-column body ───────────────────────────────── */}
              <div
                className="modal-grid"
                style={{
                  display: 'grid',
                  gap: 'clamp(1.5rem,3vw,2.5rem)',
                  padding: 'clamp(1.8rem,3.5vw,2.8rem)',
                  position: 'relative', zIndex: 2,
                  alignItems: 'start',
                }}
              >
                {/* LEFT: real image */}
                <motion.div
                  initial={{ opacity: 0, x: -28 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
                  style={{ position: 'sticky', top: 0 }}
                >
                  <ImagePanel category={category} />

                  {/* Experience badge */}
                  <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    style={{
                      marginTop: '1rem',
                      padding: '0.9rem 1.2rem',
                      background: 'rgba(255,255,255,0.025)',
                      border: '1px solid rgba(255,255,255,0.07)',
                      borderRadius: 14,
                      display: 'flex', alignItems: 'center', gap: '0.75rem',
                    }}
                  >
                    <motion.span
                      animate={{ opacity: [1, 0.3, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      style={{
                        width: 7, height: 7, borderRadius: '50%',
                        background: category.color,
                        boxShadow: `0 0 8px ${category.color}`,
                        display: 'block', flexShrink: 0,
                      }}
                    />
                    <div>
                      <p style={{
                        fontFamily: "'Inter Tight',sans-serif", fontWeight: 200,
                        fontSize: '0.48rem', letterSpacing: '0.35em', textTransform: 'uppercase',
                        color: 'rgba(255,255,255,0.28)', marginBottom: '0.15rem',
                      }}>Experience Level</p>
                      <p style={{
                        fontFamily: "'Inter Tight',sans-serif", fontWeight: 500,
                        fontSize: '0.75rem', color: 'rgba(255,255,255,0.75)',
                      }}>{category.experience}</p>
                    </div>
                  </motion.div>

                  {/* Tools */}
                  {category.tools.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                      style={{ marginTop: '0.9rem' }}
                    >
                      <p style={{
                        fontFamily: "'Inter Tight',sans-serif", fontWeight: 200,
                        fontSize: '0.48rem', letterSpacing: '0.35em', textTransform: 'uppercase',
                        color: 'rgba(255,255,255,0.25)', marginBottom: '0.55rem',
                      }}>Tools & Tech</p>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                        {category.tools.map((t, i) => (
                          <motion.span key={t}
                            initial={{ opacity: 0, scale: 0.85 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.45 + i * 0.05 }}
                            style={{
                              padding: '0.25rem 0.7rem',
                              background: `${category.color}0e`,
                              border: `1px solid ${category.color}2e`,
                              borderRadius: 100,
                              fontFamily: "'Inter Tight',sans-serif",
                              fontWeight: 400, fontSize: '0.56rem', letterSpacing: '0.1em',
                              color: category.color, textTransform: 'uppercase',
                            }}
                          >{t}</motion.span>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </motion.div>

                {/* RIGHT: details */}
                <motion.div
                  initial={{ opacity: 0, x: 28 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.12, ease: [0.16, 1, 0.3, 1] }}
                >
                  <p style={{
                    fontFamily: "'Inter Tight',sans-serif", fontWeight: 200,
                    fontSize: '0.52rem', letterSpacing: '0.45em', textTransform: 'uppercase',
                    color: category.color, marginBottom: '0.6rem',
                  }}>Skill Category</p>

                  <h2 style={{
                    fontFamily: "'Inter Tight',sans-serif", fontWeight: 800,
                    fontSize: 'clamp(1.4rem,2.8vw,2.1rem)', letterSpacing: '-0.03em',
                    lineHeight: 1.05, marginBottom: '0.75rem',
                    background: 'linear-gradient(135deg,#fff 0%,#d1d5db 60%,#fff 100%)',
                    WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                  } as React.CSSProperties}>{category.name}</h2>

                  <p style={{
                    fontFamily: "'Inter Tight',sans-serif", fontWeight: 300,
                    fontSize: '0.8rem', lineHeight: 1.82,
                    color: 'rgba(255,255,255,0.52)', marginBottom: '1.6rem',
                  }}>{category.desc}</p>

                  {/* Divider */}
                  <div style={{
                    height: 1, marginBottom: '1.6rem',
                    background: 'linear-gradient(90deg,transparent,rgba(255,255,255,0.09) 40%,rgba(255,255,255,0.14) 50%,rgba(255,255,255,0.09) 60%,transparent)',
                  }} />

                  <p style={{
                    fontFamily: "'Inter Tight',sans-serif", fontWeight: 200,
                    fontSize: '0.5rem', letterSpacing: '0.38em', textTransform: 'uppercase',
                    color: 'rgba(255,255,255,0.28)', marginBottom: '1.1rem',
                  }}>Proficiency Breakdown</p>

                  <div>
                    {category.skills.map((skill, i) => (
                      <SkillBar key={skill} skill={skill} color={category.color} index={i} />
                    ))}
                  </div>

                  {/* Divider */}
                  <div style={{
                    height: 1, margin: '1.6rem 0',
                    background: 'linear-gradient(90deg,transparent,rgba(255,255,255,0.09) 40%,rgba(255,255,255,0.14) 50%,rgba(255,255,255,0.09) 60%,transparent)',
                  }} />

                  <p style={{
                    fontFamily: "'Inter Tight',sans-serif", fontWeight: 200,
                    fontSize: '0.5rem', letterSpacing: '0.38em', textTransform: 'uppercase',
                    color: 'rgba(255,255,255,0.28)', marginBottom: '0.85rem',
                  }}>Key Competencies</p>

                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.42rem' }}>
                    {category.skills.map((skill, i) => (
                      <motion.span key={skill}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.08 + i * 0.045 }}
                        whileHover={{ scale: 1.06, y: -2 }}
                        style={{
                          display: 'inline-block',
                          padding: '0.3rem 0.82rem',
                          background: 'rgba(255,255,255,0.05)',
                          border: '1px solid rgba(255,255,255,0.1)',
                          borderRadius: 100,
                          fontFamily: "'Inter Tight',sans-serif",
                          fontWeight: 400, fontSize: '0.6rem', letterSpacing: '0.07em',
                          color: 'rgba(255,255,255,0.65)', cursor: 'default',
                          boxShadow: '0 1px 0 rgba(255,255,255,0.06) inset',
                          transition: 'border-color 0.25s, color 0.25s',
                        }}
                        onMouseEnter={e => {
                          (e.currentTarget as HTMLElement).style.borderColor = `${category.color}50`;
                          (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.92)';
                        }}
                        onMouseLeave={e => {
                          (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.1)';
                          (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.65)';
                        }}
                      >{skill}</motion.span>
                    ))}
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );

  if (!mounted) return null;
  return createPortal(modalContent, document.body);
}
