import { motion, useReducedMotion } from 'framer-motion';
import { SOCIAL_URL } from '../data/media';

/* ConnectSection — "Connect with us everywhere". Premium circular icon cards
   that drop in with a gravity-spring bounce (scroll-triggered, staggered), then
   idle-float softly. Hover lifts/scales the circle, glows its border, tints the
   glyph to the platform's brand colour, rotates the icon a touch, and reveals a
   tooltip. Each opens the platform in a new tab. Reduced-motion → simple fade.

   Icons are monochrome glyphs (brand colour stays subtle, only on hover) so the
   row blends with the editorial palette. Handshake uses the Material Symbols
   glyph (loaded in the @import); the rest are inline SVGs. URLs marked
   "editable" are best-guess profile links — swap in the real ones. */

const EXPO = [0.16, 1, 0.3, 1];

function LinkedInIcon() {
  return (<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M20.45 20.45h-3.56v-5.57c0-1.33-.03-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.07 2.07 0 1 1 0-4.13 2.07 2.07 0 0 1 0 4.13zM7.12 20.45H3.56V9h3.56v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.72v20.55C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.72C24 .77 23.2 0 22.22 0z" /></svg>);
}
function IndeedIcon() {
  return (<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><circle cx="12" cy="4.6" r="2.7" /><rect x="9.3" y="8.6" width="5.4" height="11" rx="2.7" /></svg>);
}
function GlassdoorIcon() {
  return (<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M13 0h9a2 2 0 0 1 2 2v9.2a.4.4 0 0 1-.68.28L12.72.68A.4.4 0 0 1 13 0Z" /><path d="M11 24H2a2 2 0 0 1-2-2v-9.2a.4.4 0 0 1 .68-.28L11.28 23.32A.4.4 0 0 1 11 24Z" /></svg>);
}
function FacebookIcon() {
  return (<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M22.68 0H1.32C.59 0 0 .59 0 1.32v21.36C0 23.41.59 24 1.32 24h11.5v-9.29H9.69v-3.62h3.13V8.41c0-3.1 1.89-4.79 4.66-4.79 1.32 0 2.46.1 2.79.14v3.24h-1.92c-1.5 0-1.79.71-1.79 1.76v2.31h3.59l-.47 3.62h-3.12V24h6.12c.73 0 1.32-.59 1.32-1.32V1.32C24 .59 23.41 0 22.68 0z" /></svg>);
}
function InstagramIcon() {
  return (<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2.16c3.2 0 3.58.01 4.85.07 1.17.05 1.8.25 2.23.41.56.22.96.48 1.38.9.42.42.68.82.9 1.38.16.42.36 1.06.41 2.23.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.05 1.17-.25 1.8-.41 2.23-.22.56-.48.96-.9 1.38-.42.42-.82.68-1.38.9-.42.16-1.06.36-2.23.41-1.27.06-1.65.07-4.85.07s-3.58-.01-4.85-.07c-1.17-.05-1.8-.25-2.23-.41a3.7 3.7 0 0 1-1.38-.9 3.7 3.7 0 0 1-.9-1.38c-.16-.42-.36-1.06-.41-2.23C2.17 15.58 2.16 15.2 2.16 12s.01-3.58.07-4.85c.05-1.17.25-1.8.41-2.23.22-.56.48-.96.9-1.38.42-.42.82-.68 1.38-.9.42-.16 1.06-.36 2.23-.41C8.42 2.17 8.8 2.16 12 2.16M12 0C8.74 0 8.33.01 7.05.07 5.78.13 4.9.33 4.14.63c-.79.3-1.46.72-2.13 1.38C1.35 2.68.93 3.35.63 4.14.33 4.9.13 5.78.07 7.05.01 8.33 0 8.74 0 12s.01 3.67.07 4.95c.06 1.27.26 2.15.56 2.91.3.79.72 1.46 1.38 2.13.67.66 1.34 1.08 2.13 1.38.76.3 1.64.5 2.91.56C8.33 23.99 8.74 24 12 24s3.67-.01 4.95-.07c1.27-.06 2.15-.26 2.91-.56.79-.3 1.46-.72 2.13-1.38.66-.67 1.08-1.34 1.38-2.13.3-.76.5-1.64.56-2.91.06-1.28.07-1.69.07-4.95s-.01-3.67-.07-4.95c-.06-1.27-.26-2.15-.56-2.91-.3-.79-.72-1.46-1.38-2.13C21.32 1.35 20.65.93 19.86.63c-.76-.3-1.64-.5-2.91-.56C15.67.01 15.26 0 12 0zm0 5.84A6.16 6.16 0 1 0 18.16 12 6.16 6.16 0 0 0 12 5.84zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.41-10.85a1.44 1.44 0 1 0 0 2.88 1.44 1.44 0 0 0 0-2.88z" /></svg>);
}

const PLATFORMS = [
  { key: 'linkedin',  brand: '#0A66C2', href: 'https://www.linkedin.com/company/credence-innovations', tip: 'Connect on LinkedIn',   label: 'Credence Innovations on LinkedIn (opens in a new tab)', Icon: LinkedInIcon },
  { key: 'instagram', brand: '#E4405F', href: SOCIAL_URL,                                                tip: 'Follow on Instagram',    label: 'Credence Innovations on Instagram (opens in a new tab)', Icon: InstagramIcon },
  { key: 'facebook',  brand: '#1877F2', href: 'https://www.facebook.com/credenceinnovations',           tip: 'Follow on Facebook',     label: 'Credence Innovations on Facebook (opens in a new tab)', Icon: FacebookIcon },
  { key: 'glassdoor', brand: '#0CAA41', href: 'https://www.glassdoor.com/Overview/Working-at-Credence-Innovations-EI_IE.htm', tip: 'Reviews on Glassdoor', label: 'Credence Innovations on Glassdoor (opens in a new tab)', Icon: GlassdoorIcon },
  { key: 'indeed',    brand: '#2164F3', href: 'https://www.indeed.com/cmp/Credence-Innovations',        tip: 'Careers on Indeed',      label: 'Credence Innovations careers on Indeed (opens in a new tab)', Icon: IndeedIcon },
  { key: 'handshake', brand: '#3A2D6B', href: 'https://joinhandshake.com',                              tip: 'Find us on Handshake',   label: 'Credence Innovations on Handshake (opens in a new tab)', material: 'handshake' },
];

export default function ConnectSection() {
  const reduce = useReducedMotion();

  const fade = (d = 0) => ({
    initial: reduce ? { opacity: 0 } : { opacity: 0, y: 16 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: '-80px' },
    transition: { duration: 0.6, delay: d, ease: EXPO },
  });

  return (
    <section className="cn-section paper relative overflow-hidden pad-md">
      <style>{`
        .cn-glow { position: absolute; left: 50%; top: 42%; transform: translate(-50%, -50%);
          width: min(56vw, 680px); height: min(40vw, 460px); pointer-events: none;
          background: radial-gradient(circle, color-mix(in srgb, var(--electric) 10%, transparent), transparent 66%); filter: blur(86px); }

        .cn-row { display: flex; flex-wrap: wrap; justify-content: center; align-items: center;
          gap: clamp(16px, 2.4vw, 32px); margin: clamp(28px, 3.2vw, 38px) auto 0; max-width: 760px; }
        .cn-item { will-change: transform; }
        .cn-float { display: inline-block; }
        .cn-circle {
          position: relative; display: grid; place-items: center;
          width: clamp(66px, 8vw, 92px); aspect-ratio: 1; border-radius: 50%;
          background: color-mix(in srgb, var(--graphite) 72%, transparent);
          border: 1px solid var(--hair); color: var(--smoke);
          box-shadow: 0 1px 0 rgba(255,255,255,0.5) inset, 0 18px 40px -24px var(--shadow-card);
          backdrop-filter: blur(9px); -webkit-backdrop-filter: blur(9px);
          cursor: none; text-decoration: none;
          transition: transform .35s var(--ease-out-quart), box-shadow .35s ease, border-color .35s ease, color .35s ease, background .35s ease;
        }
        .cn-circle:hover {
          transform: translateY(-7px) scale(1.06);
          color: var(--c-brand, var(--electric));
          border-color: color-mix(in srgb, var(--c-brand, var(--electric)) 55%, var(--hair));
          background: color-mix(in srgb, var(--graphite) 88%, transparent);
          box-shadow: 0 30px 60px -26px var(--shadow-card), 0 0 0 4px color-mix(in srgb, var(--c-brand, var(--electric)) 12%, transparent);
        }
        .cn-circle:focus-visible { outline: 2px solid var(--electric); outline-offset: 4px; }
        .cn-ic { display: grid; place-items: center; width: clamp(28px, 3.4vw, 38px); height: clamp(28px, 3.4vw, 38px);
          transition: transform .4s var(--ease-out-quart); }
        .cn-ic svg { width: 100%; height: 100%; display: block; }
        .cn-ic .material-symbols-rounded { font-size: clamp(30px, 3.7vw, 42px); line-height: 1; }
        .cn-circle:hover .cn-ic { transform: rotate(-6deg) scale(1.06); }

        /* tooltip */
        .cn-tip { position: absolute; bottom: calc(100% + 12px); left: 50%; transform: translateX(-50%) translateY(5px);
          white-space: nowrap; font-family: 'JetBrains Mono', monospace; font-size: 9.5px; letter-spacing: 0.12em; text-transform: uppercase;
          color: var(--bone); background: color-mix(in srgb, var(--graphite) 94%, transparent); border: 1px solid var(--hair);
          padding: 7px 11px; border-radius: 9px; box-shadow: 0 14px 30px -18px var(--shadow-card);
          opacity: 0; pointer-events: none; transition: opacity .25s ease, transform .25s ease; z-index: 3; }
        .cn-tip::after { content: ''; position: absolute; top: 100%; left: 50%; transform: translateX(-50%);
          border: 5px solid transparent; border-top-color: var(--hair); }
        .cn-circle:hover .cn-tip, .cn-circle:focus-visible .cn-tip { opacity: 1; transform: translateX(-50%) translateY(0); }

        /* soft idle float after the drop settles */
        @keyframes cn-float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-5px); } }
        .cn-float { animation: cn-float 5s ease-in-out infinite; animation-delay: 1.2s; }
        .cn-item:nth-child(2) .cn-float { animation-duration: 5.6s; animation-delay: 1.35s; }
        .cn-item:nth-child(3) .cn-float { animation-duration: 5.2s; animation-delay: 1.5s; }
        .cn-item:nth-child(4) .cn-float { animation-duration: 5.8s; animation-delay: 1.25s; }
        .cn-item:nth-child(5) .cn-float { animation-duration: 5.4s; animation-delay: 1.45s; }
        .cn-item:nth-child(6) .cn-float { animation-duration: 6s;   animation-delay: 1.6s; }
        @media (hover: none) { .cn-tip { display: none; } }
        /* balanced 3 × 2 grid on phones */
        @media (max-width: 480px) { .cn-row { max-width: 300px; gap: 18px; } }
        @media (prefers-reduced-motion: reduce) {
          .cn-float { animation: none; }
          .cn-circle, .cn-ic { transition: none; }
          .cn-circle:hover { transform: none; }
          .cn-circle:hover .cn-ic { transform: none; }
        }
      `}</style>

      <span className="cn-glow" aria-hidden="true" />

      <div className="shell relative" style={{ textAlign: 'center' }}>
        {/* heading sets the stage */}
        <motion.span className="eyebrow inline-flex" {...fade(0)}>Follow our journey</motion.span>
        <motion.h2 className="t-display-l mt-4" style={{ fontFamily: 'var(--font-display)', color: 'var(--bone)', maxWidth: '16ch', marginInline: 'auto' }} {...fade(0.07)}>
          <span className="d-caps">Connect with us</span>{' '}
          <span className="d-ital" style={{ color: 'var(--electric)' }}>everywhere.</span>
        </motion.h2>
        <motion.p className="body-lg" style={{ color: 'var(--smoke)', maxWidth: '52ch', marginInline: 'auto', marginTop: 'clamp(14px, 1.8vw, 22px)' }} {...fade(0.14)}>
          Stay close to the team, explore career opportunities, and see what life at Credence looks like — across every platform.
        </motion.p>

        {/* icons — spring-pop into place, staggered, after the heading settles */}
        <div className="cn-row">
          {PLATFORMS.map((p, i) => (
            <motion.div
              key={p.key}
              className="cn-item"
              initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.5, y: 28, rotate: -12 }}
              whileInView={reduce ? { opacity: 1 } : { opacity: 1, scale: 1, y: 0, rotate: 0 }}
              viewport={{ once: true, margin: '-70px' }}
              transition={reduce
                ? { duration: 0.4, delay: i * 0.05 }
                : { type: 'spring', stiffness: 480, damping: 15, mass: 0.7, delay: 0.32 + i * 0.08 }}
            >
              <span className="cn-float">
                <a
                  className="cn-circle"
                  href={p.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-cursor="expand"
                  aria-label={p.label}
                  style={{ '--c-brand': p.brand }}
                >
                  <span className="cn-ic">
                    {p.material
                      ? <span className="material-symbols-rounded" aria-hidden="true">{p.material}</span>
                      : <p.Icon />}
                  </span>
                  <span className="cn-tip" role="tooltip">{p.tip}</span>
                </a>
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
