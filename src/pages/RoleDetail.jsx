import { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import { getRole, ROLES } from '../data/roles';
import MagneticButton from '../components/MagneticButton';

const EXPO = [0.16, 1, 0.3, 1];
const SPRING = { type: 'spring', stiffness: 130, damping: 21, mass: 1 };

/* One page per open role at /careers/:slug — full job detail + apply CTA. */
export default function RoleDetail() {
  const reduce = useReducedMotion();
  const { slug } = useParams();
  const role = getRole(slug);

  useEffect(() => {
    if (window.__lenis) window.__lenis.scrollTo(0, { immediate: true });
    window.scrollTo(0, 0);
    if (role) document.title = `${role.title} · Careers · Credence Innovations`;
    return () => { document.title = 'Credence Innovations'; };
  }, [slug, role]);

  if (!role) {
    return (
      <section className="paper" style={{ paddingTop: 'clamp(120px, 16vh, 200px)', paddingBottom: 'clamp(80px, 12vh, 140px)' }}>
        <div className="shell-narrow text-center">
          <h1 className="t-display-l" style={{ fontFamily: 'var(--font-display)', color: 'var(--bone)' }}>Role not found.</h1>
          <Link to="/careers" className="tab-link mt-8 inline-flex" style={{ ['--tab']: 'var(--ember)' }}>
            Back to open roles <span className="arrow">→</span>
          </Link>
        </div>
      </section>
    );
  }

  const idx = ROLES.findIndex((r) => r.slug === slug);
  const next = ROLES[(idx + 1) % ROLES.length];
  const meta = [role.type, role.location, role.pay].filter(Boolean);
  const up = (delay = 0) => ({
    initial: reduce ? { opacity: 0 } : { opacity: 0, y: 22, filter: 'blur(5px)' },
    animate: { opacity: 1, y: 0, filter: 'blur(0px)' },
    transition: { duration: 0.7, delay, ease: EXPO },
  });

  return (
    <article className="rd-page paper relative overflow-hidden">
      <style>{`
        .rd-page { isolation: isolate; padding-top: clamp(96px, 13vh, 168px); padding-bottom: clamp(60px, 9vw, 120px);
          background: radial-gradient(60% 36% at 84% 4%, color-mix(in srgb, var(--electric) 9%, transparent), transparent 60%),
            radial-gradient(50% 34% at 4% 90%, color-mix(in srgb, var(--ember) 7%, transparent), transparent 62%), var(--ink); }
        .rd-bg { position: absolute; inset: 0; z-index: 0; pointer-events: none; overflow: hidden; }
        .rd-orb { position: absolute; border-radius: 50%; filter: blur(94px); }
        .rd-orb-1 { width: 32vw; max-width: 480px; aspect-ratio: 1; right: -8%; top: -4%; background: radial-gradient(circle, color-mix(in srgb, var(--electric) 14%, transparent), transparent 64%); }
        .rd-orb-2 { width: 28vw; max-width: 420px; aspect-ratio: 1; left: -8%; bottom: -6%; background: radial-gradient(circle, color-mix(in srgb, var(--ember) 11%, transparent), transparent 64%); }
        .rd-mark { position: absolute; z-index: 0; right: 1%; top: 6%; font-family: var(--font-display); font-weight: 600; font-size: clamp(120px, 18vw, 280px);
          line-height: 0.8; color: transparent; -webkit-text-stroke: 1.4px color-mix(in srgb, var(--bone) 11%, transparent); pointer-events: none; user-select: none; }
        .rd-inner { position: relative; z-index: 2; }
        .rd-back { display: inline-flex; align-items: center; gap: 8px; font-family: 'JetBrains Mono', monospace; font-size: 11px; letter-spacing: 0.16em; text-transform: uppercase; color: var(--smoke); }
        .rd-type { font-family: 'JetBrains Mono', monospace; font-size: 11px; letter-spacing: 0.2em; text-transform: uppercase; color: var(--ember); }
        .rd-title { font-family: var(--font-display); color: var(--bone); line-height: 1.02; letter-spacing: -0.02em; font-size: clamp(36px, 5vw, 68px); margin-top: 12px; max-width: 18ch; }
        .rd-meta { display: flex; flex-wrap: wrap; gap: 8px 14px; margin-top: clamp(16px, 2vw, 24px); }
        .rd-meta span { display: inline-flex; align-items: center; gap: 8px; font-family: 'JetBrains Mono', monospace; font-size: 10px; letter-spacing: 0.12em; text-transform: uppercase; color: var(--bone);
          padding: 8px 14px; border-radius: 999px; background: color-mix(in srgb, var(--graphite) 52%, transparent); border: 1px solid var(--hair); }
        [data-theme="dark"] .rd-meta span { background: color-mix(in srgb, #1c272e 70%, transparent); border-color: rgba(255,255,255,0.1); }
        .rd-meta .dot { width: 6px; height: 6px; border-radius: 50%; background: var(--electric); }
        .rd-grid { display: grid; grid-template-columns: 1fr; gap: clamp(36px, 5vw, 56px); margin-top: clamp(34px, 4.4vw, 56px); align-items: start; }
        @media (min-width: 980px) { .rd-grid { grid-template-columns: minmax(0, 1.5fr) minmax(0, 0.9fr); column-gap: clamp(48px, 5vw, 80px); } }
        .rd-summary { color: var(--smoke); font-size: clamp(17px, 1.4vw, 21px); line-height: 1.6; max-width: 56ch; font-family: var(--font-display); }
        .rd-sec { margin-top: clamp(30px, 3.6vw, 46px); }
        .rd-sec-h { display: flex; align-items: center; gap: 12px; font-family: 'JetBrains Mono', monospace; font-size: 11px; letter-spacing: 0.16em; text-transform: uppercase; color: var(--electric); margin-bottom: clamp(14px, 1.6vw, 20px); }
        .rd-sec-h::after { content: ''; flex: 1; height: 1px; background: var(--hair); }
        .rd-li { display: flex; align-items: flex-start; gap: 14px; padding: clamp(11px, 1.2vw, 14px) 0; border-top: 1px solid var(--hair); }
        .rd-li:first-child { border-top: none; }
        .rd-li .ic { flex: none; width: 22px; height: 22px; margin-top: 1px; border-radius: 7px; display: grid; place-items: center; color: var(--electric); background: color-mix(in srgb, var(--electric) 14%, transparent); }
        .rd-li .ic svg { width: 13px; height: 13px; }
        .rd-li p { color: var(--bone); font-size: clamp(15px, 1.15vw, 17px); line-height: 1.5; margin: 0; }
        .rd-aside { position: relative; }
        @media (min-width: 980px) { .rd-aside { position: sticky; top: clamp(96px, 12vh, 140px); } }
        .rd-card { position: relative; border-radius: 22px; overflow: hidden; padding: clamp(22px, 2.4vw, 30px);
          background: linear-gradient(158deg, rgba(255,255,255,0.05), transparent 60%), color-mix(in srgb, var(--graphite) 60%, transparent); border: 1px solid var(--hair);
          box-shadow: 0 36px 80px -44px var(--shadow-card); }
        [data-theme="dark"] .rd-card { background: linear-gradient(158deg, rgba(255,255,255,0.06), transparent 58%), linear-gradient(158deg, #1c272e, #161f25); border-color: rgba(255,255,255,0.1); }
        .rd-card-k { font-family: 'JetBrains Mono', monospace; font-size: 10px; letter-spacing: 0.16em; text-transform: uppercase; color: var(--smoke); }
        .rd-card-t { font-family: var(--font-display); color: var(--bone); font-size: clamp(22px, 2vw, 28px); line-height: 1.1; margin-top: 8px; }
        .rd-card-b { color: var(--smoke); font-size: 14px; line-height: 1.55; margin-top: 12px; }
        .rd-tags { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 18px; }
        .rd-tag { font-family: 'JetBrains Mono', monospace; font-size: 9.5px; letter-spacing: 0.1em; text-transform: uppercase; color: var(--bone); padding: 7px 12px; border-radius: 999px; border: 1px solid var(--hair); }
        .rd-card-cta { margin-top: clamp(20px, 2.2vw, 26px); display: flex; flex-direction: column; gap: 12px; }
        .rd-card-note { font-family: 'JetBrains Mono', monospace; font-size: 9.5px; letter-spacing: 0.12em; text-transform: uppercase; color: var(--smoke); text-align: center; }
        .rd-next { margin-top: clamp(40px, 6vw, 72px); border-top: 1px solid var(--hair); padding-top: clamp(24px, 3vw, 40px); display: flex; align-items: center; justify-content: space-between; gap: 20px; }
        .rd-next-k { font-family: 'JetBrains Mono', monospace; font-size: 10px; letter-spacing: 0.2em; text-transform: uppercase; color: var(--smoke); }
        .rd-next-t { font-family: var(--font-display); color: var(--bone); font-size: clamp(20px, 2vw, 28px); margin-top: 6px; transition: color .3s ease; }
        .rd-next:hover .rd-next-t { color: var(--electric); }
        .rd-next-a { color: var(--electric); font-size: 26px; transition: transform .3s ease; }
        .rd-next:hover .rd-next-a { transform: translateX(6px); }
      `}</style>

      <div className="rd-bg" aria-hidden="true">
        <span className="rd-orb rd-orb-1" />
        <span className="rd-orb rd-orb-2" />
      </div>
      <span className="rd-mark" aria-hidden="true">{String(idx + 1).padStart(2, '0')}</span>

      <div className="shell rd-inner">
        <motion.div {...up(0)}>
          <Link to="/careers" className="rd-back anim-link"><span aria-hidden="true">←</span> All open roles</Link>
        </motion.div>

        <motion.p className="rd-type" {...up(0.05)} style={{ marginTop: 'clamp(22px, 3vw, 34px)' }}>Open role · Now hiring</motion.p>
        <motion.h1 className="rd-title" {...up(0.1)}>{role.title}</motion.h1>
        <motion.div className="rd-meta" {...up(0.18)}>
          {meta.map((m) => <span key={m}><span className="dot" aria-hidden="true" />{m}</span>)}
        </motion.div>

        <div className="rd-grid">
          {/* main */}
          <div>
            <motion.p className="rd-summary" {...up(0.24)}>{role.summary}</motion.p>
            {role.sections.map((sec, si) => (
              <motion.div className="rd-sec" key={sec.label} {...up(0.3 + si * 0.06)}>
                <div className="rd-sec-h">{sec.label}</div>
                <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
                  {sec.items.map((it) => (
                    <li className="rd-li" key={it}>
                      <span className="ic" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12l5 5L20 6" /></svg></span>
                      <p>{it}</p>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>

          {/* apply card */}
          <motion.aside className="rd-aside" initial={reduce ? { opacity: 0 } : { opacity: 0, y: 28, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ ...(reduce ? { duration: 0.5 } : SPRING), delay: 0.34 }}>
            <div className="rd-card">
              <div className="rd-card-k">Ready to apply?</div>
              <div className="rd-card-t">{role.title}</div>
              <p className="rd-card-b">{role.blurb}</p>
              <div className="rd-tags">{role.tags.map((t) => <span className="rd-tag" key={t}>{t}</span>)}</div>
              <div className="rd-card-cta">
                <MagneticButton to={`/apply?role=${role.slug}`}>Apply now</MagneticButton>
                <span className="rd-card-note">Quick form · We reply within 48 hours</span>
              </div>
            </div>
          </motion.aside>
        </div>

        <Link to={`/careers/${next.slug}`} className="rd-next group">
          <div>
            <div className="rd-next-k">Next role</div>
            <div className="rd-next-t">{next.title}</div>
          </div>
          <span className="rd-next-a" aria-hidden="true">→</span>
        </Link>
      </div>
    </article>
  );
}
