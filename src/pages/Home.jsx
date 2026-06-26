import { useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence, useScroll, useTransform, useReducedMotion } from 'framer-motion';
import { FadeUp } from '../components/AnimatedSection';
import DrawUnderline from '../components/DrawUnderline';
import { getMember } from '../data/team';
import RecordSection from '../components/RecordSection';
import SpecialtyShowcase from '../components/SpecialtyShowcase';
import SectionHeading from '../components/SectionHeading';
import MagneticButton from '../components/MagneticButton';
import Odometer from '../components/Odometer';
import WorkflowJourney from '../components/WorkflowJourney';
import CultureStory from '../components/CultureStory';
import SpotlightCard from '../components/SpotlightCard';
import PartnerForm from '../components/PartnerForm';
import StatCard from '../components/StatCard';
import PartnerVoices from '../components/PartnerVoices';
import PressMarquee from '../components/PressMarquee';
import FolderTabDivider from '../components/FolderTabDivider';
import EditorialFigure from '../components/EditorialFigure';
import CultureGallery from '../components/CultureGallery';
import StampBadge from '../components/StampBadge';
import ScrollReveal from '../components/ScrollReveal';
import { scrollToEl } from '../components/SmoothScroll';
import SplineRobot from '../components/SplineRobot';
import RecognitionAlbum from '../components/RecognitionAlbum';
import ShowreelSection from '../components/ShowreelSection';
import SocialWall from '../components/SocialWall';
import FollowJourney from '../components/FollowJourney';
import FounderFilm from '../components/FounderFilm';
import FounderSpotlight from '../components/FounderSpotlight';
import MeetTeam from '../components/MeetTeam';
import LatestInsights from '../components/LatestInsights';
import { TestimonialShowcase } from '../components/VideoShowcase';
import { TESTIMONIAL_VIDEOS } from '../data/media';
import BrandLogo from '../components/BrandLogo';
import { CLIENT_LOGOS, logoFor } from '../data/logos';

/* ============ HERO — "Coverage" ============
   A brand-true, frameless hero: a kinetic headline that cycles through the six
   retailers Credence operates inside, over a living "coverage map" — a hub of
   market nodes radiating reach across a territory. Type- and SVG-driven, so it
   arranges cleanly on every screen (no overlap, no boxes). */
const HERO_RETAILERS = ['Walmart', 'Target', 'Costco', "Lowe's", "BJ's", "Sam's Club"];
const HERO_STATS = [
  { v: '450+', l: 'reps' },
  { v: '40+', l: 'cities' },
  { v: '99%', l: 'U.S. reach' },
];

/* word-by-word mask reveal — each word slides up from behind a clip line */
function RevealWords({ text, className = '', style = {}, baseDelay = 0, reduce = false }) {
  const words = text.split(' ');
  return (
    <span className={className} style={{ display: 'block', ...style }}>
      {words.map((w, i) => (
        <span
          key={`${w}-${i}`}
          style={{
            display: 'inline-block', overflow: 'hidden', verticalAlign: 'bottom',
            marginRight: '0.24em', paddingBottom: '0.14em', marginBottom: '-0.14em',
          }}
        >
          <motion.span
            style={{ display: 'inline-block' }}
            initial={reduce ? false : { y: '118%' }}
            animate={{ y: 0 }}
            transition={{ duration: 0.9, delay: baseDelay + i * 0.085, ease: [0.16, 1, 0.3, 1] }}
          >
            {w}
          </motion.span>
        </span>
      ))}
    </span>
  );
}

function Hero() {
  const ref = useRef(null);
  const bgRef = useRef(null);
  const reduce = useReducedMotion();
  const [ri, setRi] = useState(0);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const bgY = useTransform(scrollYProgress, [0, 1], ['0%', '34%']);
  const contentY = useTransform(scrollYProgress, [0, 1], ['0%', '12%']);
  const opacity = useTransform(scrollYProgress, [0, 0.72], [1, 0]);

  // cycle the retailer in the headline
  useEffect(() => {
    if (reduce) return;
    const id = setInterval(() => setRi((i) => (i + 1) % HERO_RETAILERS.length), 2200);
    return () => clearInterval(id);
  }, [reduce]);

  // pointer parallax — eased depth on the aurora glows.
  useEffect(() => {
    if (reduce) return;
    const stage = ref.current;
    if (!stage || window.matchMedia('(pointer: coarse)').matches) return;
    let raf = 0, tx = 0, ty = 0, cx = 0, cy = 0;
    const loop = () => {
      cx += (tx - cx) * 0.07; cy += (ty - cy) * 0.07;
      if (bgRef.current) bgRef.current.style.transform = `translate3d(${cx * 24}px, ${cy * 24}px, 0)`;
      if (Math.abs(tx - cx) > 0.0005 || Math.abs(ty - cy) > 0.0005) raf = requestAnimationFrame(loop);
      else raf = 0;
    };
    const onMove = (e) => {
      const r = stage.getBoundingClientRect();
      tx = (e.clientX - r.left) / r.width - 0.5;
      ty = (e.clientY - r.top) / r.height - 0.5;
      if (!raf) raf = requestAnimationFrame(loop);
    };
    stage.addEventListener('pointermove', onMove);
    return () => { stage.removeEventListener('pointermove', onMove); if (raf) cancelAnimationFrame(raf); };
  }, [reduce]);

  return (
    <section ref={ref} className="relative min-h-svh w-full overflow-hidden" style={{ background: 'var(--ink)' }}>
      {/* ── aurora background — drifting brand glows + territory grid ── */}
      <motion.div className="absolute inset-0 z-0" style={{ y: bgY }}>
        <div ref={bgRef} className="absolute will-change-transform" style={{ inset: '-6%' }}>
          <motion.div
            aria-hidden className="absolute rounded-full pointer-events-none"
            style={{ width: '62%', height: '70%', left: '34%', top: '0%', background: 'radial-gradient(circle, rgba(68,104,122,0.30), transparent 62%)', filter: 'blur(64px)', willChange: 'transform' }}
            animate={reduce ? undefined : { x: ['0%', '-8%', '0%'], y: ['0%', '8%', '0%'], scale: [1, 1.06, 1] }}
            transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.div
            aria-hidden className="absolute rounded-full pointer-events-none"
            style={{ width: '48%', height: '48%', right: '4%', bottom: '2%', background: 'radial-gradient(circle, rgba(232,146,60,0.18), transparent 64%)', filter: 'blur(78px)', willChange: 'transform' }}
            animate={reduce ? undefined : { x: ['0%', '7%', '0%'], y: ['0%', '-6%', '0%'], scale: [1, 1.08, 1] }}
            transition={{ duration: 26, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.div
            aria-hidden className="absolute rounded-full pointer-events-none"
            style={{ width: '40%', height: '44%', left: '-4%', top: '10%', background: 'radial-gradient(circle, rgba(46,74,88,0.32), transparent 66%)', filter: 'blur(82px)', willChange: 'transform' }}
            animate={reduce ? undefined : { x: ['0%', '6%', '0%'], y: ['0%', '7%', '0%'] }}
            transition={{ duration: 24, repeat: Infinity, ease: 'easeInOut' }}
          />
          <div className="absolute inset-0 dot-grid opacity-[0.16]" />
        </div>
      </motion.div>

      {/* ── soft bottom fade into the next section ── */}
      <div className="absolute inset-0 z-[3] pointer-events-none" style={{ background: 'linear-gradient(180deg, transparent 64%, color-mix(in srgb, var(--ink) 36%, transparent) 88%, var(--ink) 100%)' }} />

      {/* ── content + robot ──
          mobile: stacked (text on top, robot in its own zone below — no overlap)
          desktop: split (text left, robot bled to the right) */}
      <div className="relative z-10 min-h-svh flex flex-col md:grid md:grid-cols-[1.05fr_0.95fr] md:items-center md:gap-6 px-6 sm:px-9 md:px-14 lg:px-24 pt-28 pb-8 md:pb-16">
        {/* ── text column ── */}
        <motion.div className="md:max-w-[640px]" style={{ y: contentY, opacity }}>
          {/* the headline — big clause / small connective / kinetic retailer */}
          <h1 style={{ fontFamily: 'var(--font-display)', lineHeight: 0.92 }}>
            <RevealWords
              text="Your brand,"
              baseDelay={0.18}
              reduce={reduce}
              className="d-caps"
              style={{ color: 'var(--bone)', fontWeight: 600, letterSpacing: '-0.022em', fontSize: 'clamp(38px, 6.2vw, 90px)' }}
            />
            <motion.span
              className="font-mono block"
              style={{ color: 'var(--smoke)', fontSize: 'clamp(11px, 1.1vw, 13px)', letterSpacing: '0.26em', textTransform: 'uppercase', margin: '0.7em 0 0.5em' }}
              initial={reduce ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.7, delay: 0.5 }}
            >
              on the floor of
            </motion.span>
            <span className="d-ital block relative" style={{ color: 'var(--electric)', fontSize: 'clamp(38px, 6.2vw, 90px)' }}>
              <span className="sr-only">America&apos;s largest retailers.</span>
              <span aria-hidden="true" style={{ display: 'inline-block', position: 'relative' }}>
                <AnimatePresence mode="wait" initial={false}>
                  <motion.span
                    key={HERO_RETAILERS[ri]}
                    style={{ display: 'inline-block' }}
                    initial={reduce ? false : { y: '44%', opacity: 0, filter: 'blur(7px)' }}
                    animate={{ y: 0, opacity: 1, filter: 'blur(0px)' }}
                    exit={reduce ? { opacity: 0 } : { y: '-44%', opacity: 0, filter: 'blur(7px)' }}
                    transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  >
                    {HERO_RETAILERS[ri]}.
                  </motion.span>
                </AnimatePresence>
              </span>
            </span>
          </h1>

          <motion.p
            className="mt-7 md:mt-9 body"
            style={{ color: 'var(--smoke)', maxWidth: 460 }}
            initial={reduce ? false : { opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, delay: 0.85, ease: [0.2, 0.8, 0.2, 1] }}
          >
            Credence deploys trained brand representatives inside America&apos;s six largest retailers —
            launching and scaling Fortune 500 brands, face-to-face.
          </motion.p>

          <motion.div
            className="mt-8 md:mt-10 flex flex-wrap items-center gap-4 sm:gap-5"
            initial={reduce ? false : { opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, delay: 0.95, ease: [0.2, 0.8, 0.2, 1] }}
          >
            <MagneticButton to="/contact">Partner With Us</MagneticButton>
            <button
              type="button"
              onClick={() => scrollToEl('#ecosystem')}
              className="tab-link"
              style={{ ['--tab']: 'var(--ember)' }}
            >
              See inside the doors
              <span className="arrow material-symbols-rounded" aria-hidden="true">arrow_forward</span>
            </button>
          </motion.div>

          {/* inline proof line — counts, hairline-separated (no boxes) */}
          <motion.div
            className="mt-9 md:mt-12 flex items-center flex-wrap gap-x-5 sm:gap-x-7 gap-y-3"
            initial={reduce ? false : { opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.05, ease: [0.2, 0.8, 0.2, 1] }}
          >
            {HERO_STATS.map((s, i) => (
              <span key={s.l} className="flex items-center gap-x-5 sm:gap-x-7">
                {i > 0 && <span aria-hidden="true" style={{ width: 1, height: 24, background: 'var(--hair)' }} />}
                <span className="flex items-baseline gap-2">
                  <span className="stat-num leading-none" style={{ fontSize: 'clamp(22px, 2.4vw, 30px)' }}><Odometer value={s.v} /></span>
                  <span className="font-mono" style={{ fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--smoke)' }}>{s.l}</span>
                </span>
              </span>
            ))}
          </motion.div>
        </motion.div>

        {/* ── interactive 3D robot — its own zone (below on mobile, right on desktop) ──
            On mobile it bleeds to the screen edges and takes a generous ~50svh so it
            reads clearly; on desktop it fills the right column and bleeds off-edge.
            Outer carries the scroll-fade; inner carries the mount fade/scale, so the
            two opacities multiply instead of fighting over the same property. */}
        <motion.div
          className="relative w-full flex-1 min-h-[46svh] mt-2 md:mt-0 md:min-h-0 md:h-[80vh] md:-mr-[3%] lg:-mr-[8%] pointer-events-none md:pointer-events-auto"
          style={{ opacity }}
        >
          {/* absolute inset-0 fills the flex parent reliably — a percentage
              height (h-full) would collapse to 0 here because the flex parent
              has no explicit height on mobile, hiding the robot. */}
          <motion.div
            className="absolute inset-0"
            initial={reduce ? false : { opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.1, delay: 0.3, ease: [0.2, 0.8, 0.2, 1] }}
          >
            <SplineRobot maxWidth={1100} fill />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

/* ============ ECOSYSTEM BAR — "Inside the Doors" (dark island) ============ */
const RACK = [
  { name: 'Walmart', count: '4,600+', unit: 'supercenters', note: 'Everyday-traffic supercenters — the widest net in America.' },
  { name: 'Target', count: '1,900+', unit: 'stores', note: 'Design-led shoppers, premium launch energy.' },
  { name: 'Costco', count: '600+', unit: 'warehouses', note: 'High-intent members, high basket size.' },
  { name: "Lowe's", count: '1,700+', unit: 'stores', note: 'Project buyers for home and service brands.' },
  { name: "BJ's", count: '240+', unit: 'clubs', note: 'Loyal value-club households, East-Coast strong.' },
  { name: "Sam's Club", count: '600+', unit: 'clubs', note: 'Member-first warehouse shoppers, nationwide reach.' },
];

function EcosystemBar() {
  const reduce = useReducedMotion();
  const [active, setActive] = useState(0);

  return (
    <section id="ecosystem" data-theme="dark" className="paper relative overflow-hidden pad-md" style={{ background: 'var(--ink)' }}>
      <div className="shell">

        {/* BAND 1 — mixed headline + 99% keystone StatCard */}
        <div className="grid lg:grid-cols-[1fr_auto] gap-10 lg:gap-16 lg:items-end mb-14 md:mb-20">
          <ScrollReveal from="left">
            <FadeUp>
              <span className="eyebrow block mb-5">Where we operate / Who we represent</span>
            </FadeUp>
            <FadeUp delay={0.05}>
              <h2 className="t-display-l" style={{ fontFamily: 'var(--font-display)', color: 'var(--bone)', maxWidth: 900 }}>
                The only marketing partner operating inside{' '}
                <span className="d-ital" style={{ color: 'var(--electric)' }}>
                  <DrawUnderline color="var(--electric)">all six</DrawUnderline>
                </span>{' '}
                of America&apos;s largest big-box retailers.
              </h2>
            </FadeUp>
          </ScrollReveal>
          <ScrollReveal from="right" style={{ width: 'min(100%, 250px)' }}>
            <StatCard label="Population reach" value="99%" sub="of the U.S. within reach." tilt={1.8} />
          </ScrollReveal>
        </div>

        {/* BAND 2 — the retailer rack (lg+): hover/tap a door to look inside */}
        <FadeUp delay={0.1}>
          <div className="hidden lg:flex gap-3" onMouseLeave={() => !reduce && setActive(0)}>
            {RACK.map((r, i) => {
              const open = active === i;
              return (
                <motion.div
                  key={r.name}
                  onMouseEnter={() => !reduce && setActive(i)}
                  onFocus={() => setActive(i)}
                  onClick={() => setActive(i)}
                  tabIndex={0}
                  role="button"
                  aria-label={`${r.name}: ${r.count} ${r.unit}`}
                  data-cursor="expand"
                  className="relative outline-none focus-visible:z-10"
                  style={{ flexGrow: open ? 2.4 : 0.7, flexBasis: 0 }}
                  animate={{ flexGrow: open ? 2.4 : 0.7 }}
                  transition={reduce ? { duration: 0 } : { duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
                >
                  <SpotlightCard
                    className="paper-card relative overflow-hidden"
                    style={{
                      height: 'clamp(260px, 34vw, 360px)', borderRadius: 16,
                      background: 'linear-gradient(158deg, rgba(255,255,255,0.07), rgba(255,255,255,0.015) 44%, transparent 72%), linear-gradient(158deg, #1c272e 0%, #161f25 100%)',
                      border: open ? '1px solid color-mix(in srgb, var(--electric) 42%, rgba(255,255,255,0.11))' : '1px solid rgba(255,255,255,0.11)',
                      boxShadow: open
                        ? '0 44px 92px -48px rgba(0,0,0,0.85), 0 0 0 1px color-mix(in srgb, var(--electric) 24%, transparent), 0 28px 72px -30px color-mix(in srgb, var(--electric) 40%, transparent), inset 0 1px 0 rgba(255,255,255,0.08)'
                        : '0 28px 60px -40px rgba(0,0,0,0.7), inset 0 1px 0 rgba(255,255,255,0.06)',
                      transition: 'border-color 0.5s ease, box-shadow 0.5s ease',
                    }}
                  >
                    <div className="relative h-full p-5 md:p-7">
                      <span className="font-mono text-[11px] tracking-[0.22em]" style={{ color: open ? 'var(--electric)' : 'var(--smoke)' }}>
                        0{i + 1}
                      </span>

                      {/* resting name — horizontal at the bottom, fades out when open */}
                      <motion.span
                        aria-hidden="true"
                        className="absolute left-5 md:left-7 bottom-5 md:bottom-7 d-caps whitespace-nowrap"
                        style={{ fontSize: 'clamp(16px, 1.3vw, 21px)', color: 'var(--bone)' }}
                        animate={{ opacity: open ? 0 : 0.9 }}
                        transition={{ duration: 0.3 }}
                      >
                        {r.name}
                      </motion.span>

                      {/* open content — fades in over the door */}
                      <motion.div
                        className="absolute left-5 md:left-7 right-5 md:right-7 bottom-5 md:bottom-7"
                        animate={{ opacity: open ? 1 : 0, y: open ? 0 : 10 }}
                        transition={reduce ? { duration: 0 } : { duration: 0.4, delay: open ? 0.12 : 0 }}
                        style={{ pointerEvents: open ? 'auto' : 'none' }}
                      >
                        {logoFor(r.name) && <BrandLogo name={r.name} height={28} className="brand-plate--sm" fallback="hide" style={{ marginBottom: 14 }} />}
                        <h3 className="d-caps text-xl md:text-2xl mb-2.5" style={{ color: 'var(--bone)' }}>{r.name}</h3>
                        <div className="stat-num leading-none" style={{ fontSize: 'clamp(30px, 3.2vw, 42px)' }}>
                          {open && <Odometer value={r.count} />}
                        </div>
                        <p className="font-mono text-[11px] tracking-[0.18em] uppercase mt-1.5" style={{ color: 'var(--ember)' }}>{r.unit}</p>
                        <p className="text-sm leading-relaxed mt-2.5" style={{ color: 'var(--smoke)', maxWidth: 260 }}>{r.note}</p>
                      </motion.div>
                    </div>
                  </SpotlightCard>
                </motion.div>
              );
            })}
          </div>
        </FadeUp>

        {/* BAND 2 — tablet/mobile / reduced-motion fallback (fully revealed stack) */}
        <div className="lg:hidden flex flex-col gap-3">
          {RACK.map((r, i) => (
            <div key={r.name} className="paper-card flex items-start justify-between gap-4 p-5" style={{ borderRadius: 16, background: 'linear-gradient(158deg, rgba(255,255,255,0.06), transparent 60%), linear-gradient(158deg, #1c272e, #161f25)', border: '1px solid rgba(255,255,255,0.1)' }}>
              <div className="min-w-0">
                {logoFor(r.name) && (
                  <div style={{ marginBottom: 10 }}>
                    <BrandLogo name={r.name} height={22} className="brand-plate--sm" fallback="hide" />
                  </div>
                )}
                <span className="font-mono text-[10px] tracking-[0.2em] mr-2 align-middle" style={{ color: 'var(--electric)' }}>0{i + 1}</span>
                <h3 className="d-caps text-xl inline align-middle" style={{ color: 'var(--bone)' }}>{r.name}</h3>
                <p className="text-xs mt-2" style={{ color: 'var(--smoke)' }}>{r.note}</p>
              </div>
              <div className="text-right shrink-0">
                <span className="stat-num" style={{ fontSize: 28 }}><Odometer value={r.count} /></span>
                <p className="font-mono text-[9px] tracking-[0.18em] uppercase mt-0.5" style={{ color: 'var(--ember)' }}>{r.unit}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* BAND 3 — brands as a small infinite-scrolling banner */}
      <div className="mt-14 md:mt-20">
        <PressMarquee label="Brands we represent" items={CLIENT_LOGOS} speed={26} />
      </div>
    </section>
  );
}

/* ============ "How we work" — zig-zag pinned process cards (WorkflowJourney
   owns its own section, background, header, cards and CTA). ============ */
function ModelSection() {
  return <WorkflowJourney />;
}

/* "The Record" now lives in its own component — an animated growth curve
   + an open, box-free ledger. See components/RecordSection.jsx. */


/* "Partner Voices" now lives in its own component — animated testimonials
   (after-content only). See components/PartnerVoices.jsx. */

/* ============ CULTURE (cream strip + voices) ============ */
function Culture() {
  return <CultureGallery />;
}

/* ============ CTA FORM (dark island — split: pitch rail + form) ============ */
const PARTNER_PROOF = [
  'Where your product fits — market by market.',
  'The retail partners already asking for it.',
  'A pilot-to-rollout plan, not a pitch deck.',
  'A trained field team — built, not hired.',
];
const PARTNER_STATS = [
  { v: '450+', l: 'trained reps' },
  { v: '40+', l: 'cities' },
  { v: '99%', l: 'U.S. reach' },
];
function CTASection() {
  return (
    <section id="partner" className="pad-lg paper">
      <div className="shell">
        <div data-theme="dark" className="island-dark paper relative mx-auto" style={{ background: 'var(--ink)', maxWidth: 1200, padding: 'clamp(36px, 6vw, 80px) clamp(22px, 5vw, 64px)' }}>
          {/* ambient lighting (clipped by the island's overflow:hidden) */}
          <div aria-hidden="true" className="pointer-events-none absolute" style={{ width: 'min(48vw, 560px)', height: 'min(48vw, 560px)', left: '-10%', top: '-12%', background: 'radial-gradient(circle, color-mix(in srgb, var(--electric) 26%, transparent), transparent 64%)', filter: 'blur(76px)' }} />
          <div aria-hidden="true" className="pointer-events-none absolute" style={{ width: 'min(42vw, 520px)', height: 'min(42vw, 520px)', right: '-12%', bottom: '-16%', background: 'radial-gradient(circle, color-mix(in srgb, var(--ember) 22%, transparent), transparent 64%)', filter: 'blur(82px)' }} />

          <div className="relative grid lg:grid-cols-[0.86fr_1.14fr] gap-12 lg:gap-16 items-start">
            {/* ── LEFT — the pitch ── */}
            <div>
              <FadeUp><span className="eyebrow block mb-5">Partner with us</span></FadeUp>
              <FadeUp delay={0.05}>
                <h2 className="t-display-l" style={{ fontFamily: 'var(--font-display)', color: 'var(--bone)', maxWidth: '15ch' }}>
                  Tell us about your brand.{' '}
                  <span className="d-ital" style={{ color: 'var(--electric)' }}>
                    See what <DrawUnderline color="var(--electric)">national reach</DrawUnderline> looks like.
                  </span>
                </h2>
              </FadeUp>
              <FadeUp delay={0.12}>
                <p className="body-lg mt-6" style={{ color: 'var(--smoke)', maxWidth: '42ch' }}>
                  A 15-minute intro call with our partnerships team — and a clear picture of where your product can win.
                </p>
              </FadeUp>

              {/* what you get */}
              <FadeUp delay={0.16}>
                <ul className="mt-9 flex flex-col gap-3.5">
                  {PARTNER_PROOF.map((t) => (
                    <li key={t} className="flex items-start gap-3">
                      <span className="grid place-items-center shrink-0 rounded-full" style={{ width: 22, height: 22, marginTop: 1, background: 'var(--brand-soft)', border: '1px solid var(--hair)' }}>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--electric)" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12.5l4.5 4.5L19 6.5" /></svg>
                      </span>
                      <span className="body" style={{ color: 'var(--bone)' }}>{t}</span>
                    </li>
                  ))}
                </ul>
              </FadeUp>

              {/* confidence stats */}
              <FadeUp delay={0.2}>
                <div className="flex items-stretch gap-6 mt-9">
                  {PARTNER_STATS.map((s, i) => (
                    <div key={s.l} className="flex items-stretch gap-6">
                      {i > 0 && <span aria-hidden="true" style={{ width: 1, background: 'var(--hair)' }} />}
                      <div>
                        <span className="stat-num block" style={{ fontSize: 'clamp(26px, 3vw, 38px)', lineHeight: 1, color: 'var(--electric)' }}><Odometer value={s.v} /></span>
                        <span className="font-mono block mt-1" style={{ fontSize: 9.5, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--smoke)' }}>{s.l}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </FadeUp>

              {/* trust stamps */}
              <FadeUp delay={0.24}>
                <div className="flex items-center gap-7 mt-10">
                  <StampBadge topText="A+ RATED" bottomText="BBB" center="A+" color="var(--electric)" size={70} rotate={-6} />
                  <StampBadge topText="ESTABLISHED" bottomText="INDIANAPOLIS" center="2016" color="var(--ember)" size={70} rotate={5} />
                  <span className="font-mono" style={{ fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--smoke)', maxWidth: '16ch', lineHeight: 1.5 }}>Replies within one business day</span>
                </div>
              </FadeUp>
            </div>

            {/* ── RIGHT — the form ── */}
            <ScrollReveal from="up" scaleFrom={1} distance={70}>
              <div className="paper-card" style={{ padding: 'clamp(20px, 2.6vw, 36px)', borderRadius: 22 }}>
                <PartnerForm />
              </div>
            </ScrollReveal>
          </div>
        </div>
      </div>
    </section>
  );
}

/* "Team Culture" now lives in its own component — a value-by-value scroll
   story ("Built, not hired"). See components/CultureStory.jsx. */


/* ===== Team testimonials — cinematic dark island; the component owns its own
   section, background, heading and the three-video composition. ===== */
function TeamTestimonials() {
  return <TestimonialShowcase items={TESTIMONIAL_VIDEOS} />;
}

export default function Home() {
  return (
    <>
      <Hero />
      <FolderTabDivider label="Inside the doors" tone="electric" fill="var(--ink)" />
      <EcosystemBar />
      <ShowreelSection />
      <ModelSection />
      <RecordSection />
      <FounderSpotlight />
      <FounderFilm />
      <MeetTeam />
      <FolderTabDivider label="Recognition" tone="ember" fill="var(--ink)" />
      <RecognitionAlbum />
      <PartnerVoices />
      <CultureStory />
      <FolderTabDivider label="From the team" tone="electric" fill="var(--ink)" />
      <TeamTestimonials />
      <FolderTabDivider label="Our services" tone="electric" fill="var(--ink)" />
      <SpecialtyShowcase />
      <FolderTabDivider label="Partner with us" tone="ember" fill="var(--ink)" />
      <CTASection />
      <FolderTabDivider label="Follow along" tone="electric" fill="var(--ink)" />
      <SocialWall />
      <FollowJourney />
      <FolderTabDivider label="Latest insights" tone="ember" fill="var(--ink)" />
      <LatestInsights />
    </>
  );
}
