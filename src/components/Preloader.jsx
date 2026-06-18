import { useState, useEffect } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import Logo from './Logo';

const EXPO = [0.16, 1, 0.3, 1];
const CURTAIN = [0.76, 0, 0.24, 1];

/* Branded preload screen. On first paint it covers the site with the warm theme
   background; the logo eases up out of a blur, a brand-teal progress line fills,
   then the whole panel lifts away like a curtain to reveal the page. Shown once
   per full page load; honors prefers-reduced-motion (quick fade, no curtain). */
export default function Preloader() {
  const reduce = useReducedMotion();
  const [done, setDone] = useState(false);

  useEffect(() => {
    // pause smooth-scroll + lock the page while the curtain is up
    const lenis = typeof window !== 'undefined' ? window.__lenis : null;
    try { lenis && lenis.stop(); } catch (e) { /* not ready yet — fine */ }

    const t = setTimeout(() => setDone(true), reduce ? 350 : 1900);
    return () => clearTimeout(t);
  }, [reduce]);

  useEffect(() => {
    if (!done) return;
    const lenis = typeof window !== 'undefined' ? window.__lenis : null;
    try { lenis && lenis.start(); } catch (e) { /* noop */ }
  }, [done]);

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          key="preloader"
          className="fixed inset-0 flex flex-col items-center justify-center paper"
          style={{ background: 'var(--ink)', zIndex: 100001 }}
          initial={{ opacity: 1 }}
          exit={reduce ? { opacity: 0 } : { y: '-100%' }}
          transition={{ duration: reduce ? 0.35 : 0.9, ease: CURTAIN }}
          aria-label="Loading"
          role="status"
        >
          {/* ambient texture + soft brand glow */}
          <div className="absolute inset-0 dot-grid pointer-events-none" style={{ opacity: 0.35 }} />
          <div
            aria-hidden="true"
            className="absolute rounded-full pointer-events-none"
            style={{
              width: 'clamp(320px, 70vw, 520px)', height: 'clamp(320px, 70vw, 520px)',
              background: 'radial-gradient(circle, var(--glow-soft), transparent 66%)', filter: 'blur(46px)',
            }}
          />

          {/* logo eases up out of a blur */}
          <motion.div
            className="relative"
            initial={reduce ? false : { opacity: 0, y: 18, filter: 'blur(7px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ duration: 0.85, ease: EXPO }}
          >
            <Logo style={{ fontSize: 'clamp(22px, 4.6vw, 34px)', color: 'var(--bone)' }} />
          </motion.div>

          {/* brand-teal progress line */}
          {!reduce && (
            <div className="relative mt-9" style={{ width: 'min(64vw, 200px)', height: 2, background: 'var(--hair)', borderRadius: 2, overflow: 'hidden' }}>
              <motion.div
                className="absolute inset-y-0 left-0"
                style={{ background: 'var(--electric)', borderRadius: 2 }}
                initial={{ width: '0%' }}
                animate={{ width: '100%' }}
                transition={{ duration: 1.55, ease: EXPO }}
              />
            </div>
          )}

          <motion.p
            className="relative mt-5 font-mono uppercase"
            style={{ fontSize: 10, letterSpacing: '0.22em', color: 'var(--smoke)' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            Field marketing, nationwide
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
