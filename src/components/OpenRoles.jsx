import { useRef, useState, useEffect } from 'react';
import { motion, useReducedMotion, useInView, useScroll, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ROLES } from '../data/roles';

/* ============================================================================
   OpenRoles — "Open roles" (Careers)

   A premium card grid (one card per live role): title, a line of info, the
   tags, and an Apply affordance that opens that role's own detail page
   (/careers/:slug). Soft, elevated cards with a gradient hover ring + glow
   (no hard boxes), a cursor-following sheen, staggered scroll-reveal, and a
   masked-line heading. Theme-adaptive · reduced-motion aware · no GSAP.
============================================================================ */

const EXPO = [0.16, 1, 0.3, 1];
const SPRING = { type: 'spring', stiffness: 130, damping: 21, mass: 1 };

function RoleCard({ role, i, entered, reduce }) {
  const onMove = (e) => {
    if (reduce) return;
    const el = e.currentTarget; const r = el.getBoundingClientRect();
    el.style.setProperty('--gx', `${((e.clientX - r.left) / r.width) * 100}%`);
    el.style.setProperty('--gy', `${((e.clientY - r.top) / r.height) * 100}%`);
  };
  return (
    <motion.div className="or-cell"
      initial={reduce ? { opacity: 0 } : { opacity: 0, y: 36, scale: 0.95 }}
      animate={entered ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{ duration: 0.7, delay: 0.1 + i * 0.1, ease: EXPO }}>
      <Link to={`/careers/${role.slug}`} className="or-card" onMouseMove={onMove} data-cursor="expand" aria-label={`Apply — ${role.title}`}>
        <span className="or-ring" aria-hidden="true" />
        {!reduce && <span className="or-glow" aria-hidden="true" />}
        <span className="or-sheen" aria-hidden="true" />

        <div className="or-top">
          <span className="or-num">{String(i + 1).padStart(2, '0')}</span>
          <span className="or-status"><span className="dot" aria-hidden="true" />Now hiring</span>
        </div>

        <h3 className="or-title">{role.title}</h3>
        <div className="or-meta">{[role.type, role.location].filter(Boolean).join(' · ')}</div>
        <p className="or-blurb">{role.blurb}</p>

        <div className="or-tags">
          {role.tags.map((t) => <span className="or-tag" key={t}>{t}</span>)}
        </div>

        <span className="or-apply">
          Apply
          <span className="or-apply-ic" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 6l6 6-6 6" /></svg></span>
        </span>
      </Link>
    </motion.div>
  );
}

export default function OpenRoles() {
  const reduce = useReducedMotion();
  const sectionRef = useRef(null);
  const inView = useInView(sectionRef, { margin: '-10% 0px -10% 0px' });
  const [entered, setEntered] = useState(false);
  useEffect(() => { if (inView) setEntered(true); }, [inView]);
  useEffect(() => {
    const id = setTimeout(() => { const el = sectionRef.current; if (!el) return; const r = el.getBoundingClientRect(); if (r.top < window.innerHeight && r.bottom > 0) setEntered(true); }, 800);
    return () => clearTimeout(id);
  }, []);

  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start end', 'end start'] });
  const bgY = useTransform(scrollYProgress, [0, 1], reduce ? ['0%', '0%'] : ['-4%', '4%']);
  const lineV = reduce ? { hidden: { opacity: 0 }, show: { opacity: 1 } } : { hidden: { y: '120%' }, show: { y: '0%' } };

  return (
    <section ref={sectionRef} className="or-section paper relative overflow-hidden pad-lg" aria-label="Open roles">
      <style>{`
        .or-section { isolation: isolate;
          background:
            radial-gradient(56% 42% at 84% 6%, color-mix(in srgb, var(--electric) 9%, transparent), transparent 60%),
            radial-gradient(52% 40% at 6% 94%, color-mix(in srgb, var(--ember) 7%, transparent), transparent 62%),
            var(--ink); }
        .or-bg { position: absolute; inset: 0; z-index: 0; pointer-events: none; overflow: hidden; }
        .or-orb { position: absolute; border-radius: 50%; filter: blur(94px); }
        .or-orb-1 { width: 34vw; max-width: 500px; aspect-ratio: 1; left: -8%; top: -4%; background: radial-gradient(circle, color-mix(in srgb, var(--electric) 13%, transparent), transparent 64%); }
        .or-orb-2 { width: 30vw; max-width: 440px; aspect-ratio: 1; right: -8%; bottom: -8%; background: radial-gradient(circle, color-mix(in srgb, var(--ember) 11%, transparent), transparent 64%); }
        .or-grain { position: absolute; inset: 0; opacity: 0.035; mix-blend-mode: overlay;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E"); background-size: 140px 140px; }

        .or-inner { position: relative; z-index: 2; }
        .or-head { display: flex; flex-wrap: wrap; align-items: flex-end; justify-content: space-between; gap: 18px 40px; }
        .or-pill { display: inline-flex; align-items: center; gap: 9px; padding: 7px 15px; border-radius: 999px;
          font-family: 'JetBrains Mono', monospace; font-size: 10px; letter-spacing: 0.2em; text-transform: uppercase; color: var(--bone);
          background: color-mix(in srgb, var(--graphite) 52%, transparent); border: 1px solid color-mix(in srgb, var(--electric) 26%, var(--hair)); }
        .or-pill .dot { width: 6px; height: 6px; border-radius: 50%; background: var(--electric); box-shadow: 0 0 10px var(--electric); }
        .or-h { font-family: var(--font-display); color: var(--bone); line-height: 1.0; letter-spacing: -0.02em; font-size: clamp(32px, 4.4vw, 58px); margin-top: clamp(14px, 1.6vw, 20px); }
        .or-h .ln { display: block; overflow: hidden; padding-bottom: 0.06em; }
        .or-h .ln > span { display: inline-block; will-change: transform; }
        .or-hi { font-style: italic; font-weight: 500; background: linear-gradient(100deg, var(--electric), #6FB6D9 55%, var(--electric)); -webkit-background-clip: text; background-clip: text; -webkit-text-fill-color: transparent; color: var(--electric); }
        .or-count { font-family: 'JetBrains Mono', monospace; font-size: 10.5px; letter-spacing: 0.16em; text-transform: uppercase; color: var(--smoke); display: inline-flex; align-items: center; gap: 10px; padding-bottom: 8px; }
        .or-count b { font-family: var(--font-display); font-style: italic; font-size: 22px; color: var(--electric); }

        .or-grid { display: grid; grid-template-columns: 1fr; gap: clamp(18px, 2vw, 26px); margin-top: clamp(34px, 4vw, 54px); }
        @media (min-width: 700px) { .or-grid { grid-template-columns: repeat(2, 1fr); } }
        @media (min-width: 1040px) { .or-grid { grid-template-columns: repeat(3, 1fr); } }
        .or-cell { display: flex; }

        .or-card { position: relative; display: flex; flex-direction: column; width: 100%; text-decoration: none; overflow: hidden;
          padding: clamp(22px, 2.2vw, 30px); border-radius: 24px; cursor: pointer;
          background: linear-gradient(160deg, rgba(255,255,255,0.04), transparent 56%), color-mix(in srgb, var(--graphite) 58%, transparent);
          border: 1px solid var(--hair); box-shadow: 0 28px 60px -42px var(--shadow-card);
          transition: transform .5s var(--ease-out-expo), box-shadow .5s ease, border-color .5s ease; }
        [data-theme="dark"] .or-card { background: linear-gradient(160deg, rgba(255,255,255,0.06), transparent 54%), linear-gradient(160deg, #1c272e, #161f25); border-color: rgba(255,255,255,0.1); }
        .or-card:hover { transform: translateY(-8px); border-color: color-mix(in srgb, var(--electric) 38%, var(--hair));
          box-shadow: 0 50px 96px -44px var(--shadow-card), 0 24px 70px -30px color-mix(in srgb, var(--electric) 40%, transparent); }
        .or-card:focus-visible { outline: 2px solid var(--electric); outline-offset: 3px; }
        .or-ring { position: absolute; inset: 0; border-radius: inherit; padding: 1px; pointer-events: none; z-index: 1; opacity: 0; transition: opacity .5s ease;
          background: linear-gradient(150deg, color-mix(in srgb, var(--bone) 30%, transparent), transparent 42%, color-mix(in srgb, var(--electric) 60%, transparent));
          -webkit-mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0); -webkit-mask-composite: xor; mask-composite: exclude; }
        .or-card:hover .or-ring { opacity: 1; }
        .or-glow { position: absolute; inset: 0; z-index: 0; pointer-events: none; opacity: 0; transition: opacity .4s ease;
          background: radial-gradient(300px circle at var(--gx, 50%) var(--gy, 50%), color-mix(in srgb, var(--electric) 16%, transparent), transparent 60%); }
        .or-card:hover .or-glow { opacity: 1; }
        .or-sheen { position: absolute; top: 0; left: 0; right: 0; height: 1px; z-index: 2; pointer-events: none;
          background: linear-gradient(90deg, transparent, color-mix(in srgb, var(--bone) 40%, transparent), transparent); opacity: 0.5; }

        .or-top { position: relative; z-index: 2; display: flex; align-items: center; justify-content: space-between; }
        .or-num { font-family: var(--font-display); font-weight: 600; font-size: clamp(28px, 3vw, 40px); line-height: 1; color: transparent; -webkit-text-stroke: 1px color-mix(in srgb, var(--bone) 34%, transparent); }
        .or-status { display: inline-flex; align-items: center; gap: 7px; font-family: 'JetBrains Mono', monospace; font-size: 9px; letter-spacing: 0.14em; text-transform: uppercase; color: var(--smoke); }
        .or-status .dot { width: 6px; height: 6px; border-radius: 50%; background: #56c08a; box-shadow: 0 0 9px #56c08a; }
        .or-title { position: relative; z-index: 2; font-family: var(--font-display); font-weight: 600; color: var(--bone); font-size: clamp(22px, 2vw, 28px); line-height: 1.08; letter-spacing: -0.01em; margin-top: clamp(16px, 1.8vw, 22px); transition: color .35s ease; }
        .or-card:hover .or-title { color: var(--electric); }
        .or-meta { position: relative; z-index: 2; font-family: 'JetBrains Mono', monospace; font-size: 9.5px; letter-spacing: 0.12em; text-transform: uppercase; color: var(--ember); margin-top: 10px; }
        .or-blurb { position: relative; z-index: 2; color: var(--smoke); font-size: clamp(14px, 1.05vw, 15.5px); line-height: 1.6; margin-top: 14px; }
        .or-tags { position: relative; z-index: 2; display: flex; flex-wrap: wrap; gap: 7px; margin-top: 16px; }
        .or-tag { font-family: 'JetBrains Mono', monospace; font-size: 9px; letter-spacing: 0.08em; text-transform: uppercase; color: var(--bone); padding: 6px 11px; border-radius: 999px; border: 1px solid var(--hair); }

        .or-apply { position: relative; z-index: 2; display: inline-flex; align-items: center; gap: 10px; align-self: flex-start; margin-top: clamp(20px, 2.4vw, 28px);
          font-family: 'JetBrains Mono', monospace; font-size: 11px; letter-spacing: 0.16em; text-transform: uppercase; color: var(--bone);
          padding: 11px 16px; border-radius: 999px; border: 1px solid var(--hair); transition: background .4s var(--ease-out-expo), color .4s ease, border-color .4s ease; }
        .or-apply-ic { display: grid; place-items: center; transition: transform .4s var(--ease-out-expo); }
        .or-apply-ic svg { width: 15px; height: 15px; }
        .or-card:hover .or-apply { background: var(--bone); color: var(--ink); border-color: var(--bone); }
        .or-card:hover .or-apply-ic { transform: translateX(3px); }

        @media (prefers-reduced-motion: reduce) { .or-card, .or-title, .or-apply, .or-ring, .or-glow { transition: none; } .or-card:hover { transform: none; } }
      `}</style>

      <motion.div className="or-bg" aria-hidden="true" style={{ y: bgY }}>
        <span className="or-orb or-orb-1" />
        <span className="or-orb or-orb-2" />
        <span className="or-grain" />
      </motion.div>

      <div className="shell or-inner">
        <div className="or-head">
          <div>
            <motion.span className="or-pill"
              initial={reduce ? { opacity: 0 } : { opacity: 0, y: 12 }} animate={entered ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6, ease: EXPO }}>
              <span className="dot" aria-hidden="true" />Open roles
            </motion.span>
            <h2 className="or-h">
              <span className="ln"><motion.span initial="hidden" animate={entered ? 'show' : 'hidden'} variants={lineV} transition={{ ...(reduce ? { duration: 0.5 } : SPRING), delay: 0.1 }}>Now hiring across</motion.span></span>
              <span className="ln"><motion.span className="or-hi" initial="hidden" animate={entered ? 'show' : 'hidden'} variants={lineV} transition={{ ...(reduce ? { duration: 0.5 } : SPRING), delay: 0.18 }}>the network.</motion.span></span>
            </h2>
          </div>
          <motion.span className="or-count"
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: 10 }} animate={entered ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6, delay: 0.3, ease: EXPO }}>
            <b>{String(ROLES.length).padStart(2, '0')}</b> roles open now
          </motion.span>
        </div>

        <div className="or-grid">
          {ROLES.map((role, i) => <RoleCard key={role.slug} role={role} i={i} entered={entered} reduce={reduce} />)}
        </div>
      </div>
    </section>
  );
}
