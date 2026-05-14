'use client';

import { useRef, useState, useCallback } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import SkillModal, { type SkillCategory } from './SkillModal';

const SKILL_CATEGORIES: SkillCategory[] = [
  {
    name: 'Supply Chain & Inventory',
    color: '#3B82F6',
    icon: '⛓️',
    image: '/dp-bismillah/supply-chain-inventory.png',
    experience: 'Active — UAE Operations (Present)',
    desc: 'End-to-end supply chain oversight including stock control, warehouse coordination, vendor management, and audit-ready inventory documentation across UAE operations.',
    tools: ['MS Excel', 'ERP Systems', 'SAP Basics', 'Zoho Inventory'],
    skills: [
      'Inventory Management', 'Stock Monitoring & Replenishment',
      'FIFO & Stock Rotation', 'Warehouse Coordination',
      'GRV & LPO Processing', 'Invoice Preparation & Billing',
      'Stock Audit & Physical Verification', 'Purchase Coordination',
      'Vendor Coordination', 'Material Tracking',
    ],
  },
  {
    name: 'Data & Operations',
    color: '#22D3EE',
    icon: '📊',
    image: '/dp-bismillah/data-operations.png',
    experience: '1 Year — 247 Digitize Pvt Ltd (Chennai)',
    desc: 'High-accuracy data operations including QC validation, structured reporting, and SLA-driven workflows supporting client data integrity at scale.',
    tools: ['MS Excel', 'Google Sheets', 'VLOOKUP', 'Pivot Tables'],
    skills: [
      'Data Entry & Quality Control', 'Excel Reporting & Validation',
      'VLOOKUP / XLOOKUP', 'Pivot Tables',
      'Conditional Formatting', 'Documentation Management',
      'SLA Tracking', 'Audit-Ready Reporting',
    ],
  },
  {
    name: 'Technical — Dev',
    color: '#8B5CF6',
    icon: '💻',
    image: '/dp-bismillah/frontend-dev.png',
    experience: 'Ongoing — Freelance & Internship Projects',
    desc: 'Full-stack web development with a focus on responsive front-end builds, WordPress customisation, and database-driven desktop applications using Python and MySQL.',
    tools: ['VS Code', 'WordPress', 'MySQL', 'Python', 'GitHub'],
    skills: [
      'MS Excel (Advanced)', 'WordPress',
      'HTML & CSS', 'JavaScript',
      'Responsive Web Design', 'Front-End Development',
      'Basic MySQL', 'Python (Internship)',
    ],
  },
  {
    name: 'SEO & Digital Marketing',
    color: '#10B981',
    icon: '🔍',
    image: '/dp-bismillah/seo-marketing.png',
    experience: 'Present — A. Commercial Traders (Karaikal)',
    desc: 'Full-spectrum digital marketing including technical SEO, Core Web Vitals optimisation, Meta ad campaign management, and email marketing for client acquisition.',
    tools: ['GA4', 'Google Search Console', 'Meta Ads Manager', 'Mailchimp', 'Semrush'],
    skills: [
      'On-Page & Off-Page SEO', 'Google Analytics (GA4)',
      'Google Search Console', 'Core Web Vitals Optimisation',
      'Meta Ad Campaigns', 'Email Marketing',
      'Audience Targeting', 'Schema Markup',
    ],
  },
  {
    name: 'Design Tools',
    color: '#F59E0B',
    icon: '🎨',
    image: '/dp-bismillah/design-tools.png',
    experience: 'Ongoing — Client Projects & Personal Work',
    desc: 'Creative asset production for landing pages, social media, and digital campaigns with a focus on conversion-focused visual design and brand consistency.',
    tools: ['Canva', 'Figma', 'Adobe Express'],
    skills: [
      'Canva', 'Figma (Basics)',
      'Creative Asset Production', 'Landing Page UI',
      'Conversion-Focused Design',
    ],
  },
  {
    name: 'Soft Skills',
    color: '#EF4444',
    icon: '🤝',
    image: '/dp-bismillah/soft-skills.png',
    experience: 'Demonstrated across all roles',
    desc: 'Core professional competencies that drive performance across supply chain, data, and digital roles — grounded in accuracy, teamwork, and adaptability.',
    tools: ['Communication', 'Reporting', 'Coordination'],
    skills: [
      'Attention to Detail', 'Fast Learning Ability',
      'Time Management', 'Multitasking',
      'Team Coordination', 'Client Communication',
      'Problem Solving', 'Immediate Availability',
    ],
  },
];

/* ── Holographic 3-D tilt card ─────────────────────────────────────────── */
function SkillCard({
  category,
  index,
  onClick,
}: {
  category: SkillCategory;
  index: number;
  onClick: () => void;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState(false);
  const rotX = useMotionValue(0);
  const rotY = useMotionValue(0);
  const sRotX = useSpring(rotX, { stiffness: 150, damping: 20 });
  const sRotY = useSpring(rotY, { stiffness: 150, damping: 20 });

  const onMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = cardRef.current!.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    rotX.set(((e.clientY - cy) / (rect.height / 2)) * -8);
    rotY.set(((e.clientX - cx) / (rect.width / 2)) * 8);
  };

  const onMouseLeave = () => {
    setHovered(false);
    rotX.set(0);
    rotY.set(0);
  };

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={onMouseMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={onMouseLeave}
      onClick={onClick}
      initial={{ opacity: 0, y: 50, scale: 0.9 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.8, delay: index * 0.07, ease: [0.16, 1, 0.3, 1] }}
      style={{
        rotateX: sRotX, rotateY: sRotY,
        transformStyle: 'preserve-3d', perspective: 800,
        background: hovered
          ? `linear-gradient(145deg,rgba(${hexToRgb(category.color)},0.1) 0%,rgba(255,255,255,0.04) 100%)`
          : 'rgba(255,255,255,0.03)',
        border: `1px solid ${hovered ? 'rgba(255,255,255,0.16)' : 'rgba(255,255,255,0.07)'}`,
        borderRadius: '22px',
        padding: '2rem 1.8rem',
        cursor: 'pointer',
        position: 'relative', overflow: 'hidden',
        backdropFilter: 'blur(24px) saturate(1.4)',
        boxShadow: hovered
          ? `0 8px 40px rgba(0,0,0,0.65), 0 0 0 1px rgba(${hexToRgb(category.color)},0.15), 0 1px 0 rgba(255,255,255,0.1) inset`
          : `0 4px 24px rgba(0,0,0,0.5), 0 1px 0 rgba(255,255,255,0.06) inset`,
        transition: 'background 0.4s ease, border-color 0.4s ease, box-shadow 0.4s ease',
      }}
    >
      {hovered && (
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          background: `radial-gradient(circle at 50% 0%,rgba(${hexToRgb(category.color)},0.14),transparent 65%)`,
        }} />
      )}

      {/* Top glow line */}
      <div style={{
        position: 'absolute', top: 0, left: '15%', right: '15%', height: 1,
        background: hovered
          ? `linear-gradient(90deg,transparent,${category.color},transparent)`
          : `linear-gradient(90deg,transparent,rgba(255,255,255,0.06),transparent)`,
        transition: 'background 0.4s ease',
      }} />

      {/* Floating orb */}
      <motion.div
        animate={{ y: hovered ? [0, -5, 0] : 0 }}
        transition={{ duration: 2.2, repeat: hovered ? Infinity : 0, ease: 'easeInOut' }}
        style={{
          width: 44, height: 44, borderRadius: '50%',
          background: `radial-gradient(circle,rgba(${hexToRgb(category.color)},0.4),rgba(${hexToRgb(category.color)},0.06))`,
          boxShadow: hovered ? `0 0 22px rgba(${hexToRgb(category.color)},0.5)` : 'none',
          marginBottom: '1rem',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '1.25rem',
          transition: 'box-shadow 0.4s ease',
        }}
      >
        {category.icon}
      </motion.div>

      <h3 style={{
        fontFamily: "'Inter Tight',sans-serif", fontWeight: 700,
        fontSize: '0.84rem', letterSpacing: '0.03em',
        color: 'rgba(255,255,255,0.9)', marginBottom: '1rem',
      }}>{category.name}</h3>

      <ul style={{ listStyle: 'none', margin: 0, padding: 0,
        display: 'flex', flexDirection: 'column', gap: '0.5rem',
      }}>
        {category.skills.slice(0, 6).map((skill, i) => (
          <li key={skill} style={{
            display: 'flex', alignItems: 'center', gap: '0.55rem',
            fontFamily: "'Inter Tight',sans-serif", fontWeight: 300,
            fontSize: '0.69rem', color: 'rgba(255,255,255,0.52)',
          }}>
            <span style={{
              width: 3, height: 3, borderRadius: '50%',
              background: category.color, flexShrink: 0,
              boxShadow: hovered ? `0 0 5px ${category.color}` : 'none',
              transition: 'box-shadow 0.3s',
            }} />
            {skill}
          </li>
        ))}
        {category.skills.length > 6 && (
          <li style={{
            fontFamily: "'Inter Tight',sans-serif", fontWeight: 300,
            fontSize: '0.62rem', color: category.color,
            letterSpacing: '0.06em', marginTop: '0.2rem',
          }}>
            +{category.skills.length - 6} more — click to expand
          </li>
        )}
      </ul>

      {/* Bottom CTA hint */}
      <motion.div
        animate={{ opacity: hovered ? 1 : 0, y: hovered ? 0 : 6 }}
        transition={{ duration: 0.3 }}
        style={{
          position: 'absolute', bottom: '1.2rem', right: '1.4rem',
          display: 'flex', alignItems: 'center', gap: '0.35rem',
          fontFamily: "'Inter Tight',sans-serif", fontWeight: 400,
          fontSize: '0.55rem', letterSpacing: '0.18em', textTransform: 'uppercase',
          color: category.color,
        }}
      >
        View details
        <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
          <path d="M1 4h6M4 1l3 3-3 3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </motion.div>
    </motion.div>
  );
}

function hexToRgb(hex: string) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `${r},${g},${b}`;
}

function FloatingSphere({ color, size, x, y, delay }: {
  color: string; size: number; x: string; y: string; delay: number;
}) {
  return (
    <motion.div
      animate={{ y: [0, -22, 0], opacity: [0.25, 0.5, 0.25] }}
      transition={{ duration: 5 + delay, repeat: Infinity, ease: 'easeInOut', delay }}
      style={{
        position: 'absolute', left: x, top: y,
        width: size, height: size, borderRadius: '50%',
        background: `radial-gradient(circle,${color}28,transparent 70%)`,
        filter: 'blur(20px)', pointerEvents: 'none', zIndex: 0,
      }}
    />
  );
}

export default function Skills() {
  const [selected, setSelected] = useState<SkillCategory | null>(null);
  const onClose = useCallback(() => setSelected(null), []);

  return (
    <>
      <section
        id="skills"
        style={{
          position: 'relative',
          background: 'linear-gradient(180deg,#050505 0%,#070710 50%,#050505 100%)',
          padding: 'clamp(5rem,10vh,8rem) clamp(1.5rem,8vw,8rem)',
          overflow: 'hidden',
        }}
      >
        <FloatingSphere color="#3B82F6" size={320} x="3%"  y="8%"  delay={0}   />
        <FloatingSphere color="#8B5CF6" size={260} x="72%" y="55%" delay={1.5} />
        <FloatingSphere color="#22D3EE" size={200} x="48%" y="2%"  delay={3}   />

        {/* Noise overlay */}
        <div aria-hidden style={{
          position: 'absolute', inset: 0, zIndex: 0, pointerEvents: 'none', opacity: 0.028,
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundSize: '200px 200px',
        }} />

        <div style={{ position: 'relative', zIndex: 2, maxWidth: 1280, margin: '0 auto' }}>
          {/* Header */}
          <div style={{ marginBottom: 'clamp(3rem,6vh,5rem)', textAlign: 'center' }}>
            <motion.p
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ duration: 0.7 }}
              style={{
                fontFamily: "'Inter Tight',sans-serif", fontWeight: 200,
                fontSize: '0.58rem', letterSpacing: '0.5em', textTransform: 'uppercase',
                color: '#8B5CF6', marginBottom: '1rem',
              }}
            >Skills Ecosystem</motion.p>

            <motion.h2
              initial={{ opacity: 0, y: 30, filter: 'blur(10px)' }}
              whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              style={{
                fontFamily: "'Inter Tight',sans-serif", fontWeight: 800,
                fontSize: 'clamp(2.4rem,5vw,5rem)', letterSpacing: '-0.04em', lineHeight: 0.9,
              }}
            >
              <span style={{
                background: 'linear-gradient(135deg,#fff 0%,#d1d5db 50%,#fff 100%)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
              } as React.CSSProperties}>EXPERTISE</span><br />
              <span style={{ color: 'rgba(255,255,255,0.15)', fontWeight: 200 }}>MATRIX</span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
              viewport={{ once: true }} transition={{ delay: 0.3 }}
              style={{
                fontFamily: "'Inter Tight',sans-serif", fontWeight: 300,
                fontSize: '0.72rem', color: 'rgba(255,255,255,0.3)',
                marginTop: '1.2rem', letterSpacing: '0.04em',
              }}
            >
              Click any card to explore full skill details
            </motion.p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit,minmax(265px,1fr))',
            gap: 'clamp(1rem,2vw,1.4rem)',
          }}>
            {SKILL_CATEGORIES.map((cat, i) => (
              <SkillCard
                key={cat.name}
                category={cat}
                index={i}
                onClick={() => setSelected(cat)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Modal — rendered outside section so it overlays everything */}
      <SkillModal category={selected} onClose={onClose} />
    </>
  );
}
