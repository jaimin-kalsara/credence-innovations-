import { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion';
import MagneticButton from './MagneticButton';

/* CultureGallery — the Home › "Inside Credence" section rebuilt as ONE scroll
   animation. On desktop the section pins and PANS SIDEWAYS as you scroll down,
   moving through full-height culture "blocks" (cream and teal alternate for
   rhythm) and ending on a team quote + a careers CTA. On mobile / reduced-motion
   it becomes a clean horizontal swipe carousel. No photos, no boxes, no
   empty placeholders. Brand tokens only; hero untouched. */

const EXPO = [0.16, 1, 0.3, 1];

const VALUES = [
  { word: 'The huddle', line: 'Every day starts as a team, with the goals on the board before anyone hits the floor.' },
  { word: 'Mentorship', line: 'You are paired with a lead from day one. Nobody is left to figure it out alone.' },
  { word: 'Recognition', line: 'Wins get named out loud, in the room, not buried at the bottom of a report.' },
  { word: 'The team', line: 'The people you work beside become the reason you stay, on the good weeks and the hard ones.' },
  { word: 'The floor', line: 'Leadership works the same store floor you do. Nobody here manages from a distance.' },
];

const QUOTE = {
  text: 'It is the only job I have had where the team night is as good as the work day. Both make you better.',
  role: 'Campaign Manager, 4 years',
};

/* one readable display headline; the key phrase set in accent italic, same family */
function Head({ pre, accent, size }) {
  return (
    <h2 className={size} style={{ fontFamily: 'var(--font-display)', fontWeight: 600, color: 'var(--bone)', margin: 0, lineHeight: 1.05 }}>
      {pre}{' '}<span className="d-ital" style={{ color: 'var(--electric)' }}>{accent}</span>
    </h2>
  );
}

/* ── one panel's CONTENT (theme/bg handled by the wrapper) ── */
function Intro() {
  return (
    <div>
      <p className="font-mono text-[11px] tracking-[0.22em] uppercase mb-6" style={{ color: 'var(--ember)' }}>Inside Credence</p>
      <Head pre="Where careers and people" accent="get built." size="t-display-l" />
      <p className="body-lg mt-6" style={{ color: 'var(--smoke)', maxWidth: '40ch' }}>
        Mentorship, momentum, and a team that takes the work as seriously as the people doing it.
      </p>
    </div>
  );
}

function Value({ v, n }) {
  return (
    <div>
      <p className="font-mono text-[12px] tracking-[0.18em]" style={{ color: 'var(--electric)', marginBottom: 18 }}>0{n}</p>
      <h3 className="t-display-l" style={{ fontFamily: 'var(--font-display)', fontWeight: 600, color: 'var(--bone)', margin: 0, lineHeight: 1.0 }}>{v.word}</h3>
      <span className="block" style={{ width: 64, height: 3, background: 'var(--electric)', borderRadius: 2, margin: '26px 0' }} />
      <p className="body-lg" style={{ color: 'var(--smoke)', maxWidth: '34ch' }}>{v.line}</p>
    </div>
  );
}

function End() {
  return (
    <div>
      <p className="font-mono text-[11px] tracking-[0.22em] uppercase mb-7" style={{ color: 'var(--ember)' }}>From the team</p>
      <p className="t-display-m" style={{ fontFamily: 'var(--font-display)', color: 'var(--bone)', lineHeight: 1.2, maxWidth: '20ch', margin: 0 }}>
        &ldquo;{QUOTE.text}&rdquo;
      </p>
      <p className="mt-6 text-sm" style={{ color: 'var(--smoke)' }}>{QUOTE.role}</p>
      <div className="mt-10"><MagneticButton to="/careers">See open roles</MagneticButton></div>
    </div>
  );
}

/* panel descriptors: width + theme(dark island vs cream) + content */
const PANELS = [
  { key: 'intro', dark: false, w: 'clamp(440px, 64vw, 820px)', mw: '86vw', node: <Intro /> },
  ...VALUES.map((v, i) => ({ key: v.word, dark: i % 2 === 0, w: 'clamp(380px, 42vw, 560px)', mw: '84vw', node: <Value v={v} n={i + 1} /> })),
  { key: 'end', dark: true, w: 'clamp(440px, 60vw, 760px)', mw: '88vw', node: <End /> },
];

function Panel({ p, mobile }) {
  return (
    <div
      {...(p.dark ? { 'data-theme': 'dark' } : {})}
      className="shrink-0 flex flex-col justify-center"
      style={{
        width: mobile ? p.mw : p.w,
        height: '100%',
        scrollSnapAlign: mobile ? 'center' : undefined,
        background: p.dark ? 'var(--ink)' : 'var(--graphite)',
        padding: 'clamp(28px, 4vw, 72px)',
        borderRight: '1px solid var(--hair-faint)',
      }}
    >
      {p.node}
    </div>
  );
}

/* ───────────── DESKTOP — pin + pan sideways ───────────── */
function Pinned() {
  const wrap = useRef(null);
  const track = useRef(null);
  const [dist, setDist] = useState(0);

  useEffect(() => {
    const measure = () => {
      if (track.current) setDist(Math.max(0, track.current.scrollWidth - window.innerWidth));
    };
    measure();
    const t = setTimeout(measure, 350); // re-measure after fonts settle
    window.addEventListener('resize', measure);
    return () => { clearTimeout(t); window.removeEventListener('resize', measure); };
  }, []);

  const { scrollYProgress } = useScroll({ target: wrap, offset: ['start start', 'end end'] });
  const x = useTransform(scrollYProgress, [0, 1], [0, -dist]);

  return (
    <section ref={wrap} className="relative paper" style={{ height: `calc(100vh + ${dist}px)` }}>
      <div className="sticky top-0 h-screen overflow-hidden">
        <motion.div ref={track} className="flex" style={{ x, height: '100vh' }}>
          {PANELS.map((p) => <Panel key={p.key} p={p} />)}
        </motion.div>
      </div>
    </section>
  );
}

/* ───────────── MOBILE / reduced-motion — swipe carousel ───────────── */
function Carousel() {
  return (
    <section className="paper" style={{ paddingBlock: 'var(--pad-sm)' }}>
      <div
        className="no-scrollbar flex"
        style={{ overflowX: 'auto', scrollSnapType: 'x mandatory', WebkitOverflowScrolling: 'touch', height: '78vh', minHeight: 460 }}
      >
        {PANELS.map((p) => <Panel key={p.key} p={p} mobile />)}
      </div>
    </section>
  );
}

export default function CultureGallery() {
  const reduce = useReducedMotion();
  const [wide, setWide] = useState(() => typeof window !== 'undefined' && window.matchMedia('(min-width: 1024px)').matches);
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1024px)');
    const upd = () => setWide(mq.matches);
    upd();
    mq.addEventListener('change', upd);
    return () => mq.removeEventListener('change', upd);
  }, []);

  if (reduce || !wide) return <Carousel />;
  return <Pinned />;
}
