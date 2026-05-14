'use client';

import { useRef, useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { Download } from 'lucide-react';

/* ── Animated counter ─────────────────────────────────────────────────── */
function Counter({ to, suffix = '' }: { to: number; suffix?: string }) {
  const [val, setVal] = useState(0);
  const [started, setStarted] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setStarted(true); },
      { threshold: 0.5 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    if (!started) return;
    let start: number | null = null;
    const step = (ts: number) => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / 1800, 1);
      const e = 1 - Math.pow(1 - p, 3);
      setVal(Math.round(e * to));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [started, to]);

  return <span ref={ref}>{val}{suffix}</span>;
}

/* ── Premium role card ─────────────────────────────────────────────────── */
function RoleCard({ icon, title, desc, delay, color }: {
  icon: string; title: string; desc: string; delay: number; color: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40, filter: 'blur(12px)' }}
      whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.9, delay, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -6 }}
      style={{
        background: 'rgba(255,255,255,0.04)',
        border: '1px solid rgba(255,255,255,0.09)',
        borderRadius: '20px',
        padding: '1.6rem 1.8rem',
        backdropFilter: 'blur(24px) saturate(1.4)',
        position: 'relative', overflow: 'hidden',
        cursor: 'default',
        boxShadow: '0 4px 24px rgba(0,0,0,0.5), 0 0 0 0 transparent, 0 1px 0 rgba(255,255,255,0.07) inset',
        transition: 'box-shadow 0.45s ease, transform 0.45s ease',
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLDivElement).style.boxShadow =
          `0 8px 40px rgba(0,0,0,0.65), 0 0 40px rgba(${color},0.1), 0 1px 0 rgba(255,255,255,0.1) inset`;
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLDivElement).style.boxShadow =
          '0 4px 24px rgba(0,0,0,0.5), 0 0 0 0 transparent, 0 1px 0 rgba(255,255,255,0.07) inset';
      }}
    >
      {/* Silver top edge */}
      <div style={{
        position: 'absolute', top: 0, left: '10%', right: '10%', height: 1,
        background: `linear-gradient(90deg,transparent,rgba(255,255,255,0.15) 30%,rgba(255,255,255,0.25) 50%,rgba(255,255,255,0.15) 70%,transparent)`,
      }} />
      {/* Color corner glow */}
      <div style={{
        position: 'absolute', top: -30, right: -30, width: 80, height: 80,
        background: `radial-gradient(circle,rgba(${color},0.18),transparent 70%)`,
        borderRadius: '50%', pointerEvents: 'none',
      }} />
      {/* Sheen */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: '40%',
        background: 'linear-gradient(180deg,rgba(255,255,255,0.025) 0%,transparent 100%)',
        borderRadius: '20px 20px 0 0', pointerEvents: 'none',
      }} />

      <span style={{ fontSize: '1.5rem', display: 'block', marginBottom: '0.75rem' }}>{icon}</span>
      <p style={{
        fontFamily: "'Inter Tight',sans-serif", fontWeight: 600,
        fontSize: '0.85rem', letterSpacing: '0.03em',
        color: 'rgba(255,255,255,0.92)', marginBottom: '0.4rem',
      }}>{title}</p>
      <p style={{
        fontFamily: "'Inter Tight',sans-serif", fontWeight: 300,
        fontSize: '0.7rem', color: 'rgba(255,255,255,0.5)', lineHeight: 1.65,
      }}>{desc}</p>
    </motion.div>
  );
}

const ROLES = [
  { icon: '⛓️', title: 'Supply Chain Management Supervisor',        desc: 'GRV & LPO processing, warehouse coordination, stock audits & FIFO rotation.',              delay: 0.10, color: '59,130,246' },
  { icon: '📦', title: 'Inventory & Operations Coordinator',          desc: 'ERP & Excel reporting, purchase coordination, billing workflows, vendor tracking.',         delay: 0.20, color: '34,211,238' },
  { icon: '💻', title: 'Web Developer & Digital Marketer',            desc: 'WordPress, Core Web Vitals, on-page SEO, Meta Ads & email campaigns.',                      delay: 0.30, color: '139,92,246' },
  { icon: '📊', title: 'Data QC & Customer Support',                  desc: '99%+ data accuracy, VLOOKUP/XLOOKUP, Pivot Tables, SLA achievement, client POC.',          delay: 0.40, color: '16,185,129' },
];

const STATS = [
  { value: 2,  suffix: '+', label: 'Years in UAE' },
  { value: 5,  suffix: '+', label: 'Projects Built' },
  { value: 5,  suffix: '',  label: 'Certifications' },
  { value: 99, suffix: '%', label: 'Data Accuracy' },
];

const STRENGTHS = [
  'Attention to Detail','Fast Learner','Inventory Accuracy',
  'Time Management','Multitasking','Team Coordination',
  'Documentation','Problem Solving',
];

export default function About() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const lightX = useSpring(mouseX, { stiffness: 55, damping: 18 });
  const lightY = useSpring(mouseY, { stiffness: 55, damping: 18 });

  useEffect(() => {
    const s = sectionRef.current;
    if (!s) return;
    const move = (e: MouseEvent) => {
      const r = s.getBoundingClientRect();
      mouseX.set(e.clientX - r.left);
      mouseY.set(e.clientY - r.top);
    };
    s.addEventListener('mousemove', move);
    return () => s.removeEventListener('mousemove', move);
  }, [mouseX, mouseY]);

  return (
    <section
      id="about"
      ref={sectionRef}
      style={{
        position: 'relative', minHeight: '100vh',
        background: '#050505',
        display: 'flex', alignItems: 'center',
        padding: 'clamp(5rem,10vh,8rem) clamp(1.5rem,8vw,8rem)',
        overflow: 'hidden',
      }}
    >
      {/* Mouse-follow light */}
      <motion.div style={{
        position: 'absolute', pointerEvents: 'none', zIndex: 1,
        width: 600, height: 600, borderRadius: '50%',
        background: 'radial-gradient(circle,rgba(59,130,246,0.06) 0%,transparent 70%)',
        x: lightX, y: lightY, translateX: '-50%', translateY: '-50%',
      }} />

      {/* Grid lines */}
      <div style={{
        position: 'absolute', inset: 0, zIndex: 0, pointerEvents: 'none',
        backgroundImage: `linear-gradient(rgba(255,255,255,0.025) 1px,transparent 1px),
          linear-gradient(90deg,rgba(255,255,255,0.025) 1px,transparent 1px)`,
        backgroundSize: '60px 60px',
      }} />

      {/* Floating blobs */}
      {[
        { top:'8%', left:'4%', w:360, color:'59,130,246', d:9 },
        { top:'60%', right:'4%', w:300, color:'139,92,246', d:11 },
      ].map((b, i) => (
        <motion.div key={i}
          animate={{ scale:[1,1.15,1], opacity:[0.25,0.45,0.25] }}
          transition={{ duration:b.d, repeat:Infinity, ease:'easeInOut', delay:i*2 }}
          style={{
            position:'absolute', top:b.top, left:(b as any).left, right:(b as any).right,
            width:b.w, height:b.w, borderRadius:'50%',
            background:`radial-gradient(circle,rgba(${b.color},0.07),transparent 70%)`,
            filter:'blur(40px)', pointerEvents:'none', zIndex:0,
          }}
        />
      ))}

      <div style={{ position:'relative', zIndex:2, width:'100%', maxWidth:1280, margin:'0 auto' }}>
        {/* ── Top grid ─────────────────────────────────────────────── */}
        <div className="about-grid" style={{ marginBottom:'clamp(3rem,6vh,4.5rem)' }}>

          {/* LEFT */}
          <div>
            <motion.p
              initial={{ opacity:0, x:-30 }} whileInView={{ opacity:1, x:0 }}
              viewport={{ once:true }} transition={{ duration:0.7 }}
              style={{
                fontFamily:"'Inter Tight',sans-serif", fontWeight:200,
                fontSize:'0.58rem', letterSpacing:'0.5em', textTransform:'uppercase',
                color:'#3B82F6', marginBottom:'1.4rem',
              }}
            >About Me</motion.p>

            <motion.h2
              initial={{ opacity:0, y:40, filter:'blur(10px)' }}
              whileInView={{ opacity:1, y:0, filter:'blur(0px)' }}
              viewport={{ once:true }}
              transition={{ duration:1, delay:0.1, ease:[0.16,1,0.3,1] }}
              style={{
                fontFamily:"'Inter Tight',sans-serif", fontWeight:800,
                fontSize:'clamp(2.6rem,5.5vw,5.5rem)',
                lineHeight:0.88, letterSpacing:'-0.04em', marginBottom:'1.8rem',
              }}
            >
              <span style={{
                background:'linear-gradient(135deg,#fff 0%,#d1d5db 50%,#fff 100%)',
                WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent',
              } as React.CSSProperties}>MOHAMED</span><br />
              <span style={{ color:'rgba(255,255,255,0.22)', fontWeight:200 }}>NAZEER</span>
            </motion.h2>

            <motion.p
              initial={{ opacity:0, y:20 }} whileInView={{ opacity:1, y:0 }}
              viewport={{ once:true }}
              transition={{ duration:0.9, delay:0.25, ease:[0.16,1,0.3,1] }}
              style={{
                fontFamily:"'Inter Tight',sans-serif", fontWeight:300,
                fontSize:'clamp(0.82rem,1.1vw,0.95rem)', lineHeight:1.88,
                color:'rgba(255,255,255,0.55)', maxWidth:'44ch', marginBottom:'2.5rem',
              }}
            >
              Detail-oriented professional with hands-on experience in Supply Chain Management,
              Inventory Control, Data Operations, Customer Support, and Digital Marketing.
              Based in UAE — open to immediate opportunities.
            </motion.p>

            {/* Stats */}
            <div style={{ display:'flex', gap:'clamp(1.5rem,4vw,3.5rem)', flexWrap:'wrap', marginBottom:'clamp(2.5rem,5vh,3.5rem)' }}>
              {STATS.map(({ value, suffix, label }, i) => (
                <motion.div key={label}
                  initial={{ opacity:0, y:20 }} whileInView={{ opacity:1, y:0 }}
                  viewport={{ once:true }}
                  transition={{ duration:0.7, delay:0.3 + i*0.08 }}
                >
                  <p style={{
                    fontFamily:"'Inter Tight',sans-serif", fontWeight:800,
                    fontSize:'clamp(1.9rem,3.2vw,3rem)',
                    letterSpacing:'-0.04em', lineHeight:1,
                    background:'linear-gradient(135deg,#fff 0%,#9ca3af 100%)',
                    WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent',
                  } as React.CSSProperties}>
                    <Counter to={value} suffix={suffix} />
                  </p>
                  <p style={{
                    fontFamily:"'Inter Tight',sans-serif", fontWeight:300,
                    fontSize:'0.58rem', letterSpacing:'0.22em',
                    color:'rgba(255,255,255,0.35)', textTransform:'uppercase',
                    marginTop:'0.3rem',
                  }}>{label}</p>
                </motion.div>
              ))}
            </div>

            {/* Resume Button */}
            <motion.a
              href="https://drive.google.com/file/d/1ufPQZXZ-DJtk7tITOS64xnVKWk17At1-/view?usp=sharing"
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
              whileHover={{ 
                scale: 1.02, 
                y: -2,
                boxShadow: '0 8px 30px rgba(59,130,246,0.25), 0 0 0 1px rgba(255,255,255,0.15) inset' 
              }}
              whileTap={{ scale: 0.98 }}
              className="group flex sm:inline-flex items-center justify-center gap-2 rounded-full backdrop-blur-xl border border-white/10 w-full sm:w-max relative overflow-hidden"
              style={{
                background: 'rgba(255,255,255,0.03)',
                padding: '0.85rem 2rem',
                color: 'rgba(255,255,255,0.95)',
                fontFamily: "'Inter Tight', sans-serif",
                fontWeight: 500,
                fontSize: '0.8rem',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                boxShadow: '0 4px 20px rgba(0,0,0,0.5), 0 1px 0 rgba(255,255,255,0.08) inset',
                textDecoration: 'none',
                cursor: 'pointer'
              }}
            >
              {/* Subtle blue glow */}
              <div style={{
                position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
                width: '120%', height: '120%',
                background: 'radial-gradient(circle, rgba(59,130,246,0.15) 0%, transparent 60%)',
                pointerEvents: 'none', zIndex: 0
              }} />

              {/* Shimmer effect container */}
              <motion.div
                initial={{ x: '-100%' }}
                whileHover={{ x: '200%' }}
                transition={{ duration: 1, ease: "easeInOut" }}
                style={{
                  position: 'absolute', top: 0, left: 0, width: '50%', height: '100%',
                  background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)',
                  transform: 'skewX(-20deg)', pointerEvents: 'none', zIndex: 1
                }}
              />

              <span style={{ position: 'relative', zIndex: 2 }}>DOWNLOAD RESUME</span>
              <Download size={16} strokeWidth={2} style={{ position: 'relative', zIndex: 2 }} />
            </motion.a>
          </div>

          {/* RIGHT: role cards */}
          <div style={{ display:'flex', flexDirection:'column', gap:'0.9rem' }}>
            {ROLES.map(card => <RoleCard key={card.title} {...card} />)}
          </div>
        </div>

        {/* ── Strengths ─────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity:0, y:20 }} whileInView={{ opacity:1, y:0 }}
          viewport={{ once:true }} transition={{ duration:0.8, delay:0.15 }}
          style={{ marginBottom:'1.6rem' }}
        >
          <p style={{
            fontFamily:"'Inter Tight',sans-serif", fontWeight:200,
            fontSize:'0.55rem', letterSpacing:'0.45em', textTransform:'uppercase',
            color:'rgba(255,255,255,0.28)', marginBottom:'1rem',
          }}>Core Strengths</p>
          <div style={{ display:'flex', flexWrap:'wrap', gap:'0.5rem' }}>
            {STRENGTHS.map((s, i) => (
              <motion.span key={s}
                initial={{ opacity:0, scale:0.85 }}
                whileInView={{ opacity:1, scale:1 }}
                viewport={{ once:true }}
                transition={{ duration:0.45, delay:i*0.06 }}
                whileHover={{ scale:1.05 }}
                style={{
                  display:'inline-block', padding:'0.35rem 0.9rem',
                  background:'rgba(255,255,255,0.05)',
                  border:'1px solid rgba(255,255,255,0.1)',
                  borderRadius:'100px',
                  fontFamily:"'Inter Tight',sans-serif",
                  fontWeight:400, fontSize:'0.6rem', letterSpacing:'0.1em',
                  color:'rgba(255,255,255,0.65)', textTransform:'uppercase',
                  cursor:'default',
                  boxShadow:'0 1px 0 rgba(255,255,255,0.07) inset',
                }}
              >{s}</motion.span>
            ))}
          </div>
        </motion.div>

        {/* ── Language + Availability ───────────────────────────────── */}
        <div style={{ display:'flex', flexWrap:'wrap', gap:'1rem' }}>
          {[
            {
              icon:'🌐', label:'Languages', value:'English · Tamil · Hindi',
              bg:'rgba(255,255,255,0.03)', border:'rgba(255,255,255,0.08)', glow:false,
            },
            {
              icon:'⚡', label:'Availability', value:'Immediate Joiner · Willing to Relocate within UAE',
              bg:'rgba(59,130,246,0.06)', border:'rgba(59,130,246,0.2)', glow:true,
            },
          ].map(item => (
            <motion.div key={item.label}
              initial={{ opacity:0, x:-20 }} whileInView={{ opacity:1, x:0 }}
              viewport={{ once:true }} transition={{ duration:0.7, delay:0.3 }}
              style={{
                padding:'1rem 1.5rem',
                background:item.bg,
                border:`1px solid ${item.border}`,
                borderRadius:'14px', display:'flex', gap:'0.9rem', alignItems:'center',
                boxShadow:'0 4px 20px rgba(0,0,0,0.4), 0 1px 0 rgba(255,255,255,0.06) inset',
              }}
            >
              {item.glow && (
                <motion.span
                  animate={{ opacity:[1,0.3,1] }}
                  transition={{ duration:2, repeat:Infinity }}
                  style={{
                    width:7, height:7, borderRadius:'50%',
                    background:'#22D3EE', boxShadow:'0 0 10px #22D3EE',
                    display:'block', flexShrink:0,
                  }}
                />
              )}
              {!item.glow && <span style={{ fontSize:'1.1rem', flexShrink:0 }}>{item.icon}</span>}
              <div>
                <p style={{
                  fontFamily:"'Inter Tight',sans-serif", fontWeight:200,
                  fontSize:'0.5rem', letterSpacing:'0.35em', textTransform:'uppercase',
                  color:'rgba(255,255,255,0.28)', marginBottom:'0.2rem',
                }}>{item.label}</p>
                <p style={{
                  fontFamily:"'Inter Tight',sans-serif", fontWeight:400,
                  fontSize:'0.76rem', color:'rgba(255,255,255,0.72)',
                }}>{item.value}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
