'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const CERTS = [
  {
    id: 1,
    title: 'Diploma in Database Administration',
    issuer: 'MySQL & Oracle',
    year: '2023',
    icon: '🗄️',
    color: '#3B82F6',
    desc: 'Comprehensive study of relational database administration covering MySQL and Oracle — including table design, queries, indexing, and stored procedures.',
  },
  {
    id: 2,
    title: 'Internship — Python & SQLite3 Development',
    issuer: 'Developer Internship Program',
    year: '2023',
    icon: '🐍',
    color: '#22D3EE',
    desc: 'Hands-on internship building real-world Python applications backed by SQLite3 — including the Pharmacy Management System and E-Commerce Price Comparator.',
  },
  {
    id: 3,
    title: 'Introduction to MS Excel',
    issuer: 'Simplilearn',
    year: '2023',
    icon: '📊',
    color: '#8B5CF6',
    desc: 'Certified in Excel fundamentals and intermediate techniques including formulas, VLOOKUP, Pivot Tables, data validation, and reporting dashboards.',
  },
  {
    id: 4,
    title: 'WordPress Course Completion',
    issuer: 'SkillUp',
    year: '2024',
    icon: '🌐',
    color: '#10B981',
    desc: 'Completed a structured WordPress development course covering theme customisation, plugin integration, page builders, and performance optimisation.',
  },
  {
    id: 5,
    title: 'Rashtrabhasha Hindi Examination',
    issuer: 'Rashtrabhasha Prachar Samiti',
    year: '2022',
    icon: '📜',
    color: '#F59E0B',
    desc: 'National Hindi language certification demonstrating proficiency in reading, writing, and communication in Hindi — adds to multilingual communication skills.',
  },
];

function CertCard({ cert, index, isExpanded, onClick }: {
  cert: typeof CERTS[0]; index: number; isExpanded: boolean; onClick: () => void;
}) {
  return (
    <motion.div
      layout
      initial={{ opacity:0, y:40, rotateZ: index % 2 === 0 ? -1.5 : 1.5 }}
      whileInView={{ opacity:1, y:0, rotateZ: isExpanded ? 0 : (index % 2 === 0 ? -0.8 : 0.8) }}
      viewport={{ once:true, margin:'-60px' }}
      transition={{ duration:0.8, delay:index * 0.08, ease:[0.16,1,0.3,1] }}
      whileHover={!isExpanded ? { y:-8, rotateZ:0, boxShadow:`0 20px 55px ${cert.color}22` } : {}}
      onClick={onClick}
      style={{
        background:'linear-gradient(135deg,rgba(255,255,255,0.04) 0%,rgba(255,255,255,0.015) 100%)',
        border:`1px solid ${isExpanded ? cert.color+'45' : 'rgba(255,255,255,0.065)'}`,
        borderRadius:'20px',
        padding: isExpanded ? 'clamp(1.8rem,3vw,2.4rem)' : '1.8rem',
        cursor:'pointer',
        position:'relative', overflow:'hidden',
        backdropFilter:'blur(16px)',
        transition:'border-color 0.4s ease',
      }}
    >
      {/* Cinematic spotlight when expanded */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity:0 }}
            animate={{ opacity:1 }}
            exit={{ opacity:0 }}
            style={{
              position:'absolute', inset:0, pointerEvents:'none',
              background:`radial-gradient(circle at 50% 0%,${cert.color}12,transparent 65%)`,
            }}
          />
        )}
      </AnimatePresence>

      {/* Top glow line */}
      <div style={{
        position:'absolute', top:0, left:'10%', right:'10%', height:1,
        background:`linear-gradient(90deg,transparent,${cert.color}${isExpanded?'90':'35'},transparent)`,
        transition:'opacity 0.4s',
      }} />

      {/* Reflection sheen */}
      <div style={{
        position:'absolute', top:0, left:0, right:0, height:'40%',
        background:'linear-gradient(180deg,rgba(255,255,255,0.025) 0%,transparent 100%)',
        borderRadius:'20px 20px 0 0', pointerEvents:'none',
      }} />

      <div style={{ position:'relative', zIndex:2 }}>
        <div style={{ display:'flex', alignItems:'flex-start', gap:'1rem',
          marginBottom: isExpanded ? '1.1rem' : '0',
        }}>
          {/* Icon orb */}
          <motion.div
            animate={{ rotate: isExpanded ? [0,6,-6,0] : 0 }}
            transition={{ duration:0.5 }}
            style={{
              width:44, height:44, borderRadius:'12px',
              background:`${cert.color}14`,
              border:`1px solid ${cert.color}28`,
              display:'flex', alignItems:'center', justifyContent:'center',
              fontSize:'1.35rem', flexShrink:0,
              boxShadow: isExpanded ? `0 0 18px ${cert.color}28` : 'none',
              transition:'box-shadow 0.4s',
            }}
          >
            {cert.icon}
          </motion.div>

          <div style={{ flex:1, minWidth:0 }}>
            <p style={{
              fontFamily:"'Inter Tight',sans-serif", fontWeight:600,
              fontSize:'clamp(0.76rem,1.1vw,0.88rem)', letterSpacing:'0.02em',
              color:'rgba(255,255,255,0.88)', marginBottom:'0.2rem',
              lineHeight:1.3,
            }}>{cert.title}</p>
            <p style={{
              fontFamily:"'Inter Tight',sans-serif", fontWeight:300,
              fontSize:'0.63rem', color:'rgba(255,255,255,0.38)',
            }}>{cert.issuer}</p>
          </div>

          <span style={{
            fontFamily:"'Inter Tight',sans-serif", fontWeight:200,
            fontSize:'0.58rem', letterSpacing:'0.1em',
            color:cert.color, flexShrink:0,
          }}>{cert.year}</span>
        </div>

        <AnimatePresence>
          {isExpanded && (
            <motion.p
              initial={{ opacity:0, height:0 }}
              animate={{ opacity:1, height:'auto' }}
              exit={{ opacity:0, height:0 }}
              transition={{ duration:0.4 }}
              style={{
                fontFamily:"'Inter Tight',sans-serif", fontWeight:300,
                fontSize:'0.76rem', lineHeight:1.75,
                color:'rgba(255,255,255,0.48)',
                overflow:'hidden',
              }}
            >
              {cert.desc}
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

export default function Certificates() {
  const [expanded, setExpanded] = useState<number | null>(null);
  const toggle = (id: number) => setExpanded(prev => prev === id ? null : id);

  return (
    <section
      id="certificates"
      style={{
        position:'relative',
        background:'linear-gradient(180deg,#050505 0%,#060610 50%,#050505 100%)',
        padding:'clamp(5rem,10vh,8rem) clamp(1.5rem,8vw,8rem)',
        overflow:'hidden',
      }}
    >
      {/* BG glow */}
      <div style={{
        position:'absolute', top:'30%', left:'50%', transform:'translate(-50%,-50%)',
        width:560, height:560, borderRadius:'50%',
        background:'radial-gradient(circle,rgba(139,92,246,0.055),transparent 70%)',
        filter:'blur(60px)', pointerEvents:'none', zIndex:0,
      }} />

      {/* Grid */}
      <div style={{
        position:'absolute', inset:0, zIndex:0, pointerEvents:'none',
        backgroundImage:`linear-gradient(rgba(255,255,255,0.012) 1px,transparent 1px),
          linear-gradient(90deg,rgba(255,255,255,0.012) 1px,transparent 1px)`,
        backgroundSize:'70px 70px',
      }} />

      <div style={{ position:'relative', zIndex:2, maxWidth:1280, margin:'0 auto' }}>
        {/* Header */}
        <div style={{ marginBottom:'clamp(3rem,6vh,5rem)', textAlign:'center' }}>
          <motion.p
            initial={{ opacity:0, y:20 }} whileInView={{ opacity:1, y:0 }}
            viewport={{ once:true }} transition={{ duration:0.7 }}
            style={{
              fontFamily:"'Inter Tight',sans-serif", fontWeight:200,
              fontSize:'0.58rem', letterSpacing:'0.5em', textTransform:'uppercase',
              color:'#8B5CF6', marginBottom:'1rem',
            }}
          >Credentials</motion.p>

          <motion.h2
            initial={{ opacity:0, y:30, filter:'blur(10px)' }}
            whileInView={{ opacity:1, y:0, filter:'blur(0px)' }}
            viewport={{ once:true }}
            transition={{ duration:1, delay:0.1, ease:[0.16,1,0.3,1] }}
            style={{
              fontFamily:"'Inter Tight',sans-serif", fontWeight:800,
              fontSize:'clamp(2.4rem,5vw,5rem)', letterSpacing:'-0.04em',
              color:'rgba(255,255,255,0.9)', lineHeight:0.9,
            }}
          >
            CERTIFI<br />
            <span style={{ color:'rgba(255,255,255,0.18)', fontWeight:200 }}>CATIONS</span>
          </motion.h2>

          <motion.p
            initial={{ opacity:0 }} whileInView={{ opacity:1 }}
            viewport={{ once:true }} transition={{ delay:0.3 }}
            style={{
              fontFamily:"'Inter Tight',sans-serif", fontWeight:300,
              fontSize:'0.7rem', color:'rgba(255,255,255,0.3)',
              marginTop:'1rem', letterSpacing:'0.04em',
            }}
          >Tap any card to reveal details</motion.p>
        </div>

        {/* Cards */}
        <div style={{
          display:'grid',
          gridTemplateColumns:'repeat(auto-fit,minmax(275px,1fr))',
          gap:'clamp(1rem,2vw,1.4rem)',
        }}>
          {CERTS.map((cert, i) => (
            <CertCard
              key={cert.id} cert={cert} index={i}
              isExpanded={expanded === cert.id}
              onClick={() => toggle(cert.id)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
