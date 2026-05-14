'use client';

import { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const EXPERIENCES = [
  {
    id: '01',
    role: 'Supply Chain Management Supervisor',
    company: '',          // UAE role — no company name given
    companyShort: 'UAE Operations',
    period: 'Present',
    location: 'UAE',
    color: '#3B82F6',
    tags: ['Inventory Control', 'FIFO', 'GRV / LPO', 'ERP', 'Stock Audit', 'Procurement'],
    bullets: [
      'Monitor & maintain accurate stock levels across warehouses',
      'Track incoming/outgoing inventory and update ERP & Excel records',
      'Coordinate with warehouse, suppliers, and sales teams daily',
      'Conduct stock audits, physical verification & FIFO rotation',
      'Process purchase requests, replenishments & LPOs',
      'Handle GRV entries — verify materials against purchase orders',
      'Prepare invoices accurately & maintain billing documentation',
    ],
  },
  {
    id: '02',
    role: 'Web Developer & Digital Marketer',
    company: 'A. Commercial Traders',
    companyShort: 'A. Commercial Traders',
    period: 'Nov 2024 – Present',
    location: 'Karaikal, India',
    color: '#22D3EE',
    tags: ['WordPress', 'SEO', 'Core Web Vitals', 'Meta Ads', 'Email Marketing', 'UX'],
    bullets: [
      'Built responsive WordPress websites with conversion-focused layouts',
      'Improved UX and mobile optimisation across all client sites',
      'Boosted Core Web Vitals scores through performance tuning',
      'Implemented on-page & off-page SEO strategies',
      'Managed Meta ad campaigns with audience targeting & A/B testing',
      'Executed email marketing campaigns with optimised creatives',
    ],
  },
  {
    id: '03',
    role: 'Customer Support | Data QC | Capturing',
    company: '247 Digitize Private Limited',
    companyShort: '247 Digitize Pvt Ltd',
    period: 'Nov 2023 – Nov 2024',
    location: 'Chennai, India',
    color: '#8B5CF6',
    tags: ['Data Entry', 'VLOOKUP', 'Pivot Tables', 'QC', 'SLA', 'Client POC'],
    bullets: [
      'Captured and validated 1,000+ records weekly with 99%+ accuracy',
      'Served as primary client POC for daily operations',
      'Performed QC checks, data validations & audit-ready reporting',
      'Used VLOOKUP / XLOOKUP / Pivot Tables for complex data tasks',
      'Consistently achieved SLA targets & reduced operational rework',
    ],
  },
];

function ExperienceCard({ exp, index }: { exp: typeof EXPERIENCES[0]; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30, filter: 'blur(8px)' }}
      whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.9, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ scale: 1.02, boxShadow: `0 0 60px ${exp.color}20` }}
      style={{
        minWidth: 'clamp(320px, 40vw, 540px)',
        background: 'linear-gradient(135deg,rgba(255,255,255,0.04) 0%,rgba(255,255,255,0.015) 100%)',
        border: '1px solid rgba(255,255,255,0.07)',
        borderRadius: '24px',
        padding: 'clamp(2rem,3vw,2.8rem)',
        backdropFilter: 'blur(20px)',
        position: 'relative', overflow: 'hidden',
        cursor: 'default', flexShrink: 0,
      boxShadow: `0 4px 30px rgba(0,0,0,0.65), 0 1px 0 rgba(255,255,255,0.07) inset`,
        transition: 'box-shadow 0.45s ease, transform 0.45s ease',
      }}
    >
      {/* Top accent */}
      <div style={{
        position: 'absolute', top: 0, left: '10%', right: '10%', height: 1,
        background: `linear-gradient(90deg,transparent,${exp.color}80,transparent)`,
      }} />

      {/* Glow blob */}
      <div style={{
        position: 'absolute', top: -60, right: -60, width: 160, height: 160,
        background: `radial-gradient(circle,${exp.color}12,transparent 70%)`,
        borderRadius: '50%', pointerEvents: 'none',
      }} />

      {/* Big ID watermark */}
      <p style={{
        fontFamily:"'Inter Tight',sans-serif", fontWeight:700,
        fontSize:'4.5rem', lineHeight:1, letterSpacing:'-0.05em',
        color:'rgba(255,255,255,0.04)', userSelect:'none',
        position:'absolute', top:'1rem', right:'1.5rem',
      }}>{exp.id}</p>

      {/* Content */}
      <div style={{ position:'relative', zIndex:2 }}>
        <p style={{
          fontFamily:"'Inter Tight',sans-serif", fontWeight:200,
          fontSize:'0.55rem', letterSpacing:'0.45em', color:exp.color,
          textTransform:'uppercase', marginBottom:'0.8rem',
        }}>{exp.period} · {exp.location}</p>

        <h3 style={{
          fontFamily:"'Inter Tight',sans-serif", fontWeight:700,
          fontSize:'clamp(1rem,1.8vw,1.3rem)', letterSpacing:'-0.02em',
          color:'rgba(255,255,255,0.92)', marginBottom:'0.3rem', lineHeight:1.2,
        }}>{exp.role}</h3>

        {exp.company && (
          <p style={{
            fontFamily:"'Inter Tight',sans-serif", fontWeight:500,
            fontSize:'0.72rem', letterSpacing:'0.06em',
            color:'rgba(255,255,255,0.32)', marginBottom:'1.4rem',
          }}>{exp.company}</p>
        )}

        <ul style={{
          listStyle:'none', margin:'0 0 1.6rem', padding:0,
          display:'flex', flexDirection:'column', gap:'0.6rem',
        }}>
          {exp.bullets.map(b => (
            <li key={b} style={{
              display:'flex', gap:'0.7rem', alignItems:'flex-start',
              fontFamily:"'Inter Tight',sans-serif", fontWeight:300,
              fontSize:'0.75rem', lineHeight:1.65, color:'rgba(255,255,255,0.5)',
            }}>
              <span style={{
                width:4, height:4, borderRadius:'50%', background:exp.color,
                flexShrink:0, marginTop:'0.45rem',
              }} />
              {b}
            </li>
          ))}
        </ul>

        <div style={{ display:'flex', flexWrap:'wrap', gap:'0.45rem' }}>
          {exp.tags.map(tag => (
            <span key={tag} style={{
              padding:'0.28rem 0.75rem',
              background:`${exp.color}12`,
              border:`1px solid ${exp.color}28`,
              borderRadius:'100px',
              fontFamily:"'Inter Tight',sans-serif",
              fontWeight:400, fontSize:'0.55rem', letterSpacing:'0.12em',
              color:exp.color, textTransform:'uppercase',
            }}>{tag}</span>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

/* ── Education card ─────────────────────────────────────────────────────── */
const EDUCATION = [
  {
    degree: 'Bachelor of Computer Applications (BCA)',
    school: 'Don Bosco Arts & Science College',
    location: 'Karaikal',
    year: '2018 – 2020',
    icon: '🎓',
    color: '#3B82F6',
  },
  {
    degree: 'Higher Secondary Certificate — Computer Science',
    school: "St. Mary's Higher Secondary School",
    location: 'Karaikal',
    year: '2020 – 2023',
    icon: '📚',
    color: '#22D3EE',
  },
];

export default function Experience() {
  const trackRef   = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const track   = trackRef.current;
    const section = sectionRef.current;
    if (!track || !section) return;

    const getScrollWidth = () => track.scrollWidth - window.innerWidth + window.innerWidth * 0.16;

    const ctx = gsap.context(() => {
      gsap.to(track, {
        x: () => -getScrollWidth(),
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: () => `+=${getScrollWidth() + window.innerWidth * 0.5}`,
          pin: true,
          scrub: 1.2,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="experience"
      ref={sectionRef}
      style={{ background: '#050505', overflow: 'hidden' }}
    >
      {/* BG grid */}
      <div style={{
        position: 'absolute', inset: 0, zIndex: 0, pointerEvents: 'none',
        backgroundImage: `linear-gradient(rgba(255,255,255,0.012) 1px,transparent 1px),
          linear-gradient(90deg,rgba(255,255,255,0.012) 1px,transparent 1px)`,
        backgroundSize: '80px 80px',
      }} />

      {/* Section header */}
      <div style={{
        position: 'relative', zIndex: 10,
        padding: 'clamp(5rem,10vh,8rem) clamp(1.5rem,8vw,8rem) 3rem',
      }}>
        <motion.p
          initial={{ opacity:0, x:-30 }}
          whileInView={{ opacity:1, x:0 }}
          viewport={{ once:true }}
          transition={{ duration:0.7 }}
          style={{
            fontFamily:"'Inter Tight',sans-serif", fontWeight:200,
            fontSize:'0.58rem', letterSpacing:'0.5em', textTransform:'uppercase',
            color:'#22D3EE', marginBottom:'1rem',
          }}
        >
          Work Experience
        </motion.p>
        <motion.h2
          initial={{ opacity:0, y:30 }}
          whileInView={{ opacity:1, y:0 }}
          viewport={{ once:true }}
          transition={{ duration:0.9, delay:0.1, ease:[0.16,1,0.3,1] }}
          style={{
            fontFamily:"'Inter Tight',sans-serif", fontWeight:800,
            fontSize:'clamp(2.4rem,5vw,5rem)', letterSpacing:'-0.04em', lineHeight:0.9,
          }}
        >
          <span style={{
            background:'linear-gradient(135deg,#fff 0%,#d1d5db 50%,#fff 100%)',
            WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent',
          } as React.CSSProperties}>CAREER</span><br />
          <span style={{ color:'rgba(255,255,255,0.15)', fontWeight:200 }}>TIMELINE</span>
        </motion.h2>
        <motion.div
          initial={{ scaleX:0 }}
          whileInView={{ scaleX:1 }}
          viewport={{ once:true }}
          transition={{ duration:1.2, delay:0.3, ease:[0.16,1,0.3,1] }}
          style={{
            height:1, width:'100%', maxWidth:260,
            background:'linear-gradient(90deg,#22D3EE,transparent)',
            transformOrigin:'left', marginTop:'1.4rem',
          }}
        />
      </div>

      {/* Horizontal track */}
      <div
        ref={trackRef}
        style={{
          display:'flex', gap:'clamp(1.5rem,3vw,2.2rem)',
          padding:'0 clamp(1.5rem,8vw,8rem) clamp(3rem,8vh,5rem)',
          willChange:'transform',
          alignItems:'flex-start',
        }}
      >
        {EXPERIENCES.map((exp, i) => (
          <ExperienceCard key={exp.id} exp={exp} index={i} />
        ))}

        {/* Education column at the end */}
        <div style={{
          minWidth:'clamp(280px,32vw,420px)', flexShrink:0,
          display:'flex', flexDirection:'column', gap:'1rem',
        }}>
          <motion.p
            initial={{ opacity:0 }}
            whileInView={{ opacity:1 }}
            viewport={{ once:true }}
            transition={{ delay:0.3 }}
            style={{
              fontFamily:"'Inter Tight',sans-serif", fontWeight:200,
              fontSize:'0.55rem', letterSpacing:'0.45em', textTransform:'uppercase',
              color:'rgba(255,255,255,0.25)', marginBottom:'0.4rem',
            }}
          >Education</motion.p>
          {EDUCATION.map((edu, i) => (
            <motion.div
              key={edu.degree}
              initial={{ opacity:0, y:30 }}
              whileInView={{ opacity:1, y:0 }}
              viewport={{ once:true }}
              transition={{ duration:0.8, delay:i*0.15, ease:[0.16,1,0.3,1] }}
              whileHover={{ y:-4, boxShadow:`0 0 30px ${edu.color}18` }}
              style={{
                background:'rgba(255,255,255,0.025)',
                border:`1px solid ${edu.color}22`,
                borderRadius:'16px',
                padding:'1.6rem',
                backdropFilter:'blur(16px)',
                position:'relative', overflow:'hidden',
                cursor:'default',
              }}
            >
              <div style={{
                position:'absolute', top:0, left:'10%', right:'10%', height:1,
                background:`linear-gradient(90deg,transparent,${edu.color}60,transparent)`,
              }} />
              <span style={{ fontSize:'1.4rem', display:'block', marginBottom:'0.8rem' }}>{edu.icon}</span>
              <p style={{
                fontFamily:"'Inter Tight',sans-serif", fontWeight:600,
                fontSize:'0.8rem', color:'rgba(255,255,255,0.85)', marginBottom:'0.35rem',
                lineHeight:1.3,
              }}>{edu.degree}</p>
              <p style={{
                fontFamily:"'Inter Tight',sans-serif", fontWeight:300,
                fontSize:'0.68rem', color:'rgba(255,255,255,0.38)', marginBottom:'0.2rem',
              }}>{edu.school}</p>
              <p style={{
                fontFamily:"'Inter Tight',sans-serif", fontWeight:200,
                fontSize:'0.58rem', letterSpacing:'0.15em', color:edu.color,
              }}>{edu.year}</p>
            </motion.div>
          ))}
        </div>

        {/* End marker */}
        <motion.div
          initial={{ opacity:0 }}
          whileInView={{ opacity:1 }}
          viewport={{ once:true }}
          transition={{ delay:0.5 }}
          style={{
            minWidth:'20vw', display:'flex', alignItems:'center',
            justifyContent:'center', flexShrink:0,
          }}
        >
          <p style={{
            fontFamily:"'Inter Tight',sans-serif", fontWeight:700,
            fontSize:'clamp(2.5rem,5vw,6rem)', letterSpacing:'-0.05em',
            color:'rgba(255,255,255,0.03)', textTransform:'uppercase',
            textAlign:'center', lineHeight:0.9,
          }}>MORE<br />TO<br />COME</p>
        </motion.div>
      </div>
    </section>
  );
}
