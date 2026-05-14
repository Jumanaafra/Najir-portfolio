'use client';

import { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const CONTACT_INFO = [
  {
    icon: '📧',
    label: 'Email',
    value: 'Mohamednazeeruae1@gmail.com',
    href: 'mailto:Mohamednazeeruae1@gmail.com',
  },
  {
    icon: '📱',
    label: 'Phone',
    value: '+971 50 763 4759',
    href: 'tel:+971507634759',
  },
  {
    icon: '🔗',
    label: 'LinkedIn',
    value: 'linkedin.com/in/Mdnazeer1',
    href: 'https://linkedin.com/in/Mdnazeer1',
  },
  {
    icon: '📍',
    label: 'Location',
    value: 'United Arab Emirates',
    href: '#',
  },
];

type FormState = 'idle' | 'sending' | 'sent' | 'error';

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [state, setState] = useState<FormState>('idle');
  const [focused, setFocused] = useState<string | null>(null);
  const sectionRef = useRef<HTMLDivElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setState('sending');
    // Replace with real API call (e.g. Formspree / Resend)
    await new Promise(r => setTimeout(r, 1800));
    setState('sent');
    setForm({ name: '', email: '', subject: '', message: '' });
    setTimeout(() => setState('idle'), 4500);
  };

  const inputBase: React.CSSProperties = {
    width: '100%',
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: '12px',
    padding: '1rem 1.2rem',
    fontFamily: "'Inter Tight',sans-serif",
    fontWeight: 300, fontSize: '0.85rem',
    color: 'rgba(255,255,255,0.85)',
    outline: 'none',
    transition: 'border-color 0.3s ease, box-shadow 0.3s ease, background 0.3s ease',
    boxSizing: 'border-box',
  };

  const inputFocused: React.CSSProperties = {
    borderColor: 'rgba(59,130,246,0.55)',
    boxShadow: '0 0 20px rgba(59,130,246,0.08)',
    background: 'rgba(59,130,246,0.04)',
  };

  const labelStyle: React.CSSProperties = {
    fontFamily: "'Inter Tight',sans-serif",
    fontWeight: 300, fontSize: '0.56rem', letterSpacing: '0.3em',
    color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase',
    display: 'block', marginBottom: '0.55rem',
  };

  return (
    <section
      id="contact"
      ref={sectionRef}
      style={{
        position: 'relative', background: '#050505',
        padding: 'clamp(5rem,10vh,8rem) clamp(1.5rem,8vw,8rem)',
        overflow: 'hidden',
      }}
    >
      {/* Ambient blobs */}
      <div style={{
        position:'absolute', top:'18%', left:'-10%', width:480, height:480,
        borderRadius:'50%', background:'radial-gradient(circle,rgba(59,130,246,0.06),transparent 70%)',
        filter:'blur(60px)', pointerEvents:'none', zIndex:0,
      }} />
      <div style={{
        position:'absolute', bottom:'8%', right:'-8%', width:380, height:380,
        borderRadius:'50%', background:'radial-gradient(circle,rgba(139,92,246,0.06),transparent 70%)',
        filter:'blur(60px)', pointerEvents:'none', zIndex:0,
      }} />

      {/* Grid overlay */}
      <div style={{
        position:'absolute', inset:0, zIndex:0, pointerEvents:'none',
        backgroundImage:`linear-gradient(rgba(255,255,255,0.012) 1px,transparent 1px),
          linear-gradient(90deg,rgba(255,255,255,0.012) 1px,transparent 1px)`,
        backgroundSize:'60px 60px',
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
              color:'#3B82F6', marginBottom:'1rem',
            }}
          >Get In Touch</motion.p>

          <motion.h2
            initial={{ opacity:0, y:30, filter:'blur(10px)' }}
            whileInView={{ opacity:1, y:0, filter:'blur(0px)' }}
            viewport={{ once:true }}
            transition={{ duration:1, delay:0.1, ease:[0.16,1,0.3,1] }}
            style={{
              fontFamily:"'Inter Tight',sans-serif", fontWeight:800,
              fontSize:'clamp(2.4rem,5vw,5rem)', letterSpacing:'-0.04em',
              color:'rgba(255,255,255,0.9)', lineHeight:0.9, marginBottom:'1.4rem',
            }}
          >
            LET&apos;S<br />
            <span style={{ color:'rgba(255,255,255,0.18)', fontWeight:200 }}>CONNECT</span>
          </motion.h2>

          <motion.p
            initial={{ opacity:0 }} whileInView={{ opacity:1 }}
            viewport={{ once:true }} transition={{ delay:0.3 }}
            style={{
              fontFamily:"'Inter Tight',sans-serif", fontWeight:300,
              fontSize:'0.88rem', color:'rgba(255,255,255,0.38)',
              maxWidth:'44ch', margin:'0 auto', lineHeight:1.85,
            }}
          >
            Open to new opportunities in the UAE — supply chain roles,
            digital operations, or web projects. Immediate joiner.
          </motion.p>
        </div>

        {/* Two-col */}
        <div className="contact-grid">
          {/* LEFT: Contact info */}
          <div style={{ display:'flex', flexDirection:'column', gap:'1.1rem' }}>
            {CONTACT_INFO.map(({ icon, label, value, href }, i) => (
              <motion.a
                key={label}
                href={href}
                target={href.startsWith('http') ? '_blank' : undefined}
                rel="noopener noreferrer"
                initial={{ opacity:0, x:-30 }}
                whileInView={{ opacity:1, x:0 }}
                viewport={{ once:true }}
                transition={{ duration:0.7, delay:i * 0.1, ease:[0.16,1,0.3,1] }}
                whileHover={{ x:6, borderColor:'rgba(59,130,246,0.38)' }}
                style={{
                  display:'flex', alignItems:'center', gap:'1.1rem',
                  padding:'1.2rem 1.5rem',
                  background:'rgba(255,255,255,0.02)',
                  border:'1px solid rgba(255,255,255,0.055)',
                  borderRadius:'14px',
                  textDecoration:'none', cursor: href==='#' ? 'default' : 'pointer',
                  backdropFilter:'blur(10px)',
                  transition:'border-color 0.3s, transform 0.3s',
                }}
              >
                <span style={{ fontSize:'1.3rem', flexShrink:0 }}>{icon}</span>
                <div style={{ minWidth:0 }}>
                  <p style={{
                    fontFamily:"'Inter Tight',sans-serif", fontWeight:200,
                    fontSize:'0.52rem', letterSpacing:'0.3em', textTransform:'uppercase',
                    color:'rgba(255,255,255,0.28)', marginBottom:'0.2rem',
                  }}>{label}</p>
                  <p style={{
                    fontFamily:"'Inter Tight',sans-serif", fontWeight:400,
                    fontSize:'0.8rem', color:'rgba(255,255,255,0.72)',
                    overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap',
                  }}>{value}</p>
                </div>
              </motion.a>
            ))}

            {/* Availability badge */}
            <motion.div
              initial={{ opacity:0, scale:0.92 }}
              whileInView={{ opacity:1, scale:1 }}
              viewport={{ once:true }}
              transition={{ delay:0.5 }}
              style={{
                padding:'1rem 1.5rem',
                background:'linear-gradient(135deg,rgba(59,130,246,0.07),rgba(139,92,246,0.07))',
                border:'1px solid rgba(59,130,246,0.18)',
                borderRadius:'14px', display:'flex', alignItems:'center', gap:'0.8rem',
              }}
            >
              <div style={{ display:'flex', flexDirection:'column', gap:'0.25rem', alignItems:'center' }}>
                <motion.span
                  animate={{ opacity:[1,0.3,1] }}
                  transition={{ duration:2, repeat:Infinity }}
                  style={{
                    width:7, height:7, borderRadius:'50%',
                    background:'#22D3EE', boxShadow:'0 0 8px #22D3EE',
                    display:'block',
                  }}
                />
              </div>
              <p style={{
                fontFamily:"'Inter Tight',sans-serif", fontWeight:300,
                fontSize:'0.68rem', letterSpacing:'0.06em',
                color:'rgba(255,255,255,0.48)', lineHeight:1.6,
              }}>
                <strong style={{ color:'rgba(255,255,255,0.7)', fontWeight:500 }}>Immediate Joiner</strong>
                {' '}— Available for supply chain, data ops, and web roles in the UAE.
                Willing to relocate within UAE.
              </p>
            </motion.div>
          </div>

          {/* RIGHT: Form panel */}
          <motion.div
            initial={{ opacity:0, y:40, filter:'blur(10px)' }}
            whileInView={{ opacity:1, y:0, filter:'blur(0px)' }}
            viewport={{ once:true }}
            transition={{ duration:1, delay:0.2, ease:[0.16,1,0.3,1] }}
            style={{
              background:'rgba(255,255,255,0.03)',
              border:'1px solid rgba(255,255,255,0.09)',
              borderRadius:'24px',
              padding:'clamp(2rem,3vw,3rem)',
              backdropFilter:'blur(28px) saturate(1.5)',
              position:'relative', overflow:'hidden',
              boxShadow:'0 4px 30px rgba(0,0,0,0.5), 0 1px 0 rgba(255,255,255,0.07) inset',
            }}
          >
            {/* Top glow */}
            <div style={{
              position:'absolute', top:0, left:'15%', right:'15%', height:1,
              background:'linear-gradient(90deg,transparent,rgba(59,130,246,0.55),transparent)',
            }} />

            <AnimatePresence mode="wait">
              {state === 'sent' ? (
                <motion.div
                  key="success"
                  initial={{ opacity:0, scale:0.9 }}
                  animate={{ opacity:1, scale:1 }}
                  exit={{ opacity:0 }}
                  style={{
                    display:'flex', flexDirection:'column', alignItems:'center',
                    justifyContent:'center', minHeight:300, gap:'1.5rem', textAlign:'center',
                  }}
                >
                  <motion.div
                    animate={{ scale:[1,1.2,1], rotate:[0,10,-10,0] }}
                    transition={{ duration:0.6 }}
                    style={{ fontSize:'3rem' }}
                  >✅</motion.div>
                  <p style={{
                    fontFamily:"'Inter Tight',sans-serif", fontWeight:600,
                    fontSize:'1.05rem', color:'rgba(255,255,255,0.85)',
                  }}>Message Sent!</p>
                  <p style={{
                    fontFamily:"'Inter Tight',sans-serif", fontWeight:300,
                    fontSize:'0.78rem', color:'rgba(255,255,255,0.38)',
                  }}>I&apos;ll get back to you soon.</p>
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  initial={{ opacity:0 }}
                  animate={{ opacity:1 }}
                  exit={{ opacity:0 }}
                  onSubmit={handleSubmit}
                  style={{ display:'flex', flexDirection:'column', gap:'1.2rem' }}
                >
                  <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'1rem' }} className="form-row">
                    <div>
                      <label htmlFor="contact-name" style={labelStyle}>Name</label>
                      <input id="contact-name" name="name" type="text" required
                        value={form.name} onChange={handleChange}
                        onFocus={() => setFocused('name')} onBlur={() => setFocused(null)}
                        placeholder="Your name"
                        style={{ ...inputBase, ...(focused==='name' ? inputFocused : {}) }}
                      />
                    </div>
                    <div>
                      <label htmlFor="contact-email" style={labelStyle}>Email</label>
                      <input id="contact-email" name="email" type="email" required
                        value={form.email} onChange={handleChange}
                        onFocus={() => setFocused('email')} onBlur={() => setFocused(null)}
                        placeholder="your@email.com"
                        style={{ ...inputBase, ...(focused==='email' ? inputFocused : {}) }}
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="contact-subject" style={labelStyle}>Subject</label>
                    <input id="contact-subject" name="subject" type="text" required
                      value={form.subject} onChange={handleChange}
                      onFocus={() => setFocused('subject')} onBlur={() => setFocused(null)}
                      placeholder="Job opportunity, project inquiry…"
                      style={{ ...inputBase, ...(focused==='subject' ? inputFocused : {}) }}
                    />
                  </div>

                  <div>
                    <label htmlFor="contact-message" style={labelStyle}>Message</label>
                    <textarea id="contact-message" name="message" required rows={5}
                      value={form.message} onChange={handleChange}
                      onFocus={() => setFocused('message')} onBlur={() => setFocused(null)}
                      placeholder="Tell me about the role or project…"
                      style={{ ...inputBase, resize:'none', ...(focused==='message' ? inputFocused : {}) }}
                    />
                  </div>

                  {/* Send button */}
                  <motion.button
                    type="submit"
                    disabled={state==='sending'}
                    whileHover={state!=='sending' ? { y:-2, scale:1.03 } : {}}
                    whileTap={state!=='sending' ? { scale:0.97 } : {}}
                    className="btn-silver"
                    style={{
                      width:'100%', justifyContent:'center',
                      padding:'1.05rem 2rem',
                      borderRadius:'12px',
                      fontSize:'0.72rem',
                      opacity: state==='sending' ? 0.7 : 1,
                      cursor: state==='sending' ? 'default' : 'pointer',
                    }}
                  >
                    {state==='sending' ? (
                      <>
                        <motion.div
                          animate={{ rotate:360 }}
                          transition={{ repeat:Infinity, duration:1, ease:'linear' }}
                          style={{
                            width:13, height:13, borderRadius:'50%',
                            border:'1.5px solid transparent', borderTopColor:'rgba(255,255,255,0.6)',
                          }}
                        />
                        Transmitting…
                      </>
                    ) : (
                      <>
                        Send Message
                        <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                          <path d="M1 6.5h11M7.5 2.5l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </>
                    )}
                  </motion.button>
                </motion.form>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>

      {/* Footer */}
      <motion.div
        initial={{ opacity:0 }}
        whileInView={{ opacity:1 }}
        viewport={{ once:true }}
        transition={{ delay:0.5 }}
        style={{
          position:'relative', zIndex:2, maxWidth:1280, margin:'5rem auto 0',
          paddingTop:'2rem',
          borderTop:'1px solid rgba(255,255,255,0.05)',
          display:'flex', justifyContent:'space-between', alignItems:'center',
          flexWrap:'wrap', gap:'1rem',
        }}
      >
        <p style={{
          fontFamily:"'Inter Tight',sans-serif", fontWeight:200,
          fontSize:'0.58rem', letterSpacing:'0.28em', textTransform:'uppercase',
          color:'rgba(255,255,255,0.18)',
        }}>
          © 2025 Mohamed Nazeer · UAE
        </p>
        <p style={{
          fontFamily:"'Inter Tight',sans-serif", fontWeight:200,
          fontSize:'0.58rem', letterSpacing:'0.28em', textTransform:'uppercase',
          color:'rgba(255,255,255,0.12)',
        }}>
          Built with Next.js · GSAP · Framer Motion
        </p>
      </motion.div>
    </section>
  );
}
