'use client';

import dynamic from 'next/dynamic';
import { useState, useCallback } from 'react';
import Navbar from '@/components/Navbar';
import About from '@/components/About';
import Experience from '@/components/Experience';
import Skills from '@/components/Skills';
import Projects from '@/components/Projects';
import Certificates from '@/components/Certificates';
import Contact from '@/components/Contact';
import CursorOrb from '@/components/CursorOrb';

// SSR disabled — canvas + scroll APIs require the browser
const CinematicSequence = dynamic(
  () => import('@/components/CinematicSequence'),
  {
    ssr: false,
    loading: () => (
      <div
        style={{
          width: '100vw',
          height: '100vh',
          background: '#000',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      />
    ),
  }
);

export default function Home() {
  // portfolioReady = true when the hero cinematic sequence is complete
  const [portfolioReady, setPortfolioReady] = useState(false);

  const handleHeroComplete = useCallback(() => {
    setPortfolioReady(true);
    // Small delay so the hero's scroll lock cleans up first
    setTimeout(() => {
      const portfolioEl = document.getElementById('portfolio');
      if (portfolioEl) portfolioEl.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  }, []);

  return (
    <>
      {/* Custom cursor — desktop only */}
      <CursorOrb />

      {/* Navbar — slides in once portfolio is ready */}
      <Navbar visible={portfolioReady} />

      {/* Film grain overlay — persists across all sections */}
      <div aria-hidden style={{
        position: 'fixed', inset: 0, zIndex: 60, pointerEvents: 'none', opacity: 0.032,
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        backgroundSize: '210px 210px',
      }} />

      {/* Vignette */}
      <div aria-hidden style={{
        position: 'fixed', inset: 0, zIndex: 5, pointerEvents: 'none',
        background: 'radial-gradient(ellipse 80% 80% at 50% 50%, transparent 55%, rgba(0,0,0,0.45) 100%)',
      }} />

      <main style={{ background: '#050505', overflowX: 'hidden' }}>
        {/* ── HERO (cinematic sequence) ────────────────────────────── */}
        <CinematicSequence onComplete={handleHeroComplete} />

        {/* ── PORTFOLIO sections ───────────────────────────────────── */}
        {portfolioReady && (
          <div id="portfolio">
            {/* Cinematic separator */}
            <div style={{
              height: '1px',
              background: 'linear-gradient(90deg, transparent, rgba(59,130,246,0.4), rgba(139,92,246,0.4), transparent)',
              margin: 0,
            }} />

            <About />
            <Experience />
            <Skills />
            <Projects />
            <Certificates />
            <Contact />
          </div>
        )}
      </main>
    </>
  );
}
