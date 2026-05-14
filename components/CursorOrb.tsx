'use client';

import { useEffect, useRef } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

export default function CursorOrb() {
  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);
  const springX = useSpring(mouseX, { stiffness: 120, damping: 18, mass: 0.5 });
  const springY = useSpring(mouseY, { stiffness: 120, damping: 18, mass: 0.5 });
  const isHovering = useRef(false);

  useEffect(() => {
    const move = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };
    window.addEventListener('mousemove', move);
    return () => window.removeEventListener('mousemove', move);
  }, [mouseX, mouseY]);

  return (
    <>
      {/* Orb */}
      <motion.div
        style={{
          position: 'fixed', zIndex: 9999, pointerEvents: 'none',
          width: 20, height: 20, borderRadius: '50%',
          background: 'rgba(59,130,246,0.8)',
          boxShadow: '0 0 20px rgba(59,130,246,0.6), 0 0 40px rgba(59,130,246,0.2)',
          x: springX, y: springY,
          translateX: '-50%', translateY: '-50%',
          mixBlendMode: 'screen',
        }}
      />
      {/* Outer ring */}
      <motion.div
        style={{
          position: 'fixed', zIndex: 9998, pointerEvents: 'none',
          width: 36, height: 36, borderRadius: '50%',
          border: '1px solid rgba(59,130,246,0.3)',
          x: springX, y: springY,
          translateX: '-50%', translateY: '-50%',
        }}
      />
    </>
  );
}
