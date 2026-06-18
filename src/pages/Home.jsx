import { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion';
import { FadeUp } from '../components/AnimatedSection';
import DrawUnderline from '../components/DrawUnderline';
import { getMember } from '../data/team';
import RecordSection from '../components/RecordSection';
import SpecialtyShowcase from '../components/SpecialtyShowcase';
import SectionHeading from '../components/SectionHeading';
import MagneticButton from '../components/MagneticButton';
import Odometer from '../components/Odometer';
import RolloutScroll from '../components/RolloutScroll';
import CultureStory from '../components/CultureStory';
import SplineRobot from '../components/SplineRobot';
import SpotlightCard from '../components/SpotlightCard';
import PartnerForm from '../components/PartnerForm';
import FeatureRow from '../components/FeatureRow';
import StatCard from '../components/StatCard';
import OddCardGrid from '../components/OddCardGrid';
import PartnerVoices from '../components/PartnerVoices';
import PressMarquee from '../components/PressMarquee';
import FolderTabDivider from '../components/FolderTabDivider';
import EditorialFigure from '../components/EditorialFigure';
import CultureGallery from '../components/CultureGallery';
import StampBadge from '../components/StampBadge';
import ScrollReveal from '../components/ScrollReveal';
import { scrollToEl } from '../components/SmoothScroll';
import FieldScroll from '../components/FieldScroll';

/* ============ HERO (untouched) ============ */
function Hero() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const videoY = useTransform(scrollYProgress, [0, 1], ['0%', '40%']);
  const opacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  return (
    <section ref={ref} className="relative min-h-svh overflow-hidden">
      {/* parallax background — theme-aware: clean light in light mode, dark in dark mode */}
      <motion.div className="absolute inset-0" style={{ y: videoY }}>
        <div className="absolute inset-0" style={{ background: 'var(--ink)' }} />
        {/* soft brand glow — subtle tint on white, ambient on dark; transform-only */}
        <motion.div
          aria-hidden
          className="absolute rounded-full pointer-events-none"
          style={{
            width: '70%', height: '70%', left: '15%', top: '16%',
            background: 'radial-gradient(circle, rgba(68,104,122,0.20), transparent 60%)',
            filter: 'blur(52px)', willChange: 'transform',
          }}
          animate={{ x: ['0%', '-12%', '0%'], y: ['0%', '10%', '0%'] }}
          transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut' }}
        />
        <div className="absolute inset-0 dot-grid opacity-30" />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, transparent 55%, var(--ink) 100%)' }} />
      </motion.div>

      {/* content — heading + subhead on top (compact, one line), robot filling the rest */}
      <div className="relative z-10 min-h-svh w-full flex flex-col items-center text-center px-6 md:px-12 pt-20 md:pt-24 pb-0">
        <motion.div style={{ opacity }} className="flex flex-col items-center flex-shrink-0 max-w-[1340px]">
          <FadeUp>
            <h1
              className="uppercase"
              style={{
                fontFamily: 'Inter, sans-serif',
                fontWeight: 800,
                letterSpacing: '-0.015em',
                lineHeight: 1.0,
                fontSize: 'clamp(22px, 4.6vw, 66px)',
                color: 'var(--electric)',
              }}
            >
              Your next market is already open.
            </h1>
          </FadeUp>
          <FadeUp delay={0.15}>
            <p className="mt-3 md:mt-4 text-sm md:text-base leading-relaxed mx-auto" style={{ color: 'var(--smoke)', maxWidth: 760 }}>
              Credence Innovations places trained brand representatives inside the country's largest
              retailers — Walmart, Target, Costco, Lowe's, BJ's — launching and scaling Fortune 500
              brands face-to-face.
            </p>
          </FadeUp>
        </motion.div>

        {/* interactive 3D robot — enlarged and bled slightly past the edges so it
            dominates the viewport like the reference (cropped by overflow-hidden) */}
        <motion.div className="relative w-full flex-1 min-h-[52svh]" style={{ opacity }}>
          <motion.div
            className="absolute"
            style={{ top: 0, bottom: '-12%', left: '-8%', right: '-8%' }}
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2, ease: [0.2, 0.8, 0.2, 1] }}
          >
            <SplineRobot maxWidth={1500} fill />
          </motion.div>
        </motion.div>
      </div>

      {/* scroll cue (anchored to the first viewport, lower-left) */}
      <motion.button
        onClick={() => scrollToEl('#ecosystem')}
        className="absolute bottom-6 left-6 md:left-10 z-20 w-12 h-12 rounded-full flex items-center justify-center"
        style={{ border: '1px solid var(--divider)', background: 'var(--chip-bg)', backdropFilter: 'blur(6px)', color: 'var(--bone)' }}
        whileHover={{ scale: 1.1, borderColor: 'var(--electric)', color: 'var(--electric)' }}
        aria-label="Scroll to explore"
      >
        <motion.span animate={{ y: [0, 5, 0] }} transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}>↓</motion.span>
      </motion.button>
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
];
const REP_BRANDS = ['AT&T', 'Apple', 'LeafFilter', 'Just Energy'];

function EcosystemBar() {
  const reduce = useReducedMotion();
  const [active, setActive] = useState(0);

  return (
    <section id="ecosystem" data-theme="dark" className="paper relative overflow-hidden pad-lg" style={{ background: 'var(--ink)' }}>
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
                  <DrawUnderline color="var(--electric)">all five</DrawUnderline>
                </span>{' '}
                of America's largest big-box retailers.
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
                    style={{ height: 'clamp(260px, 34vw, 360px)', borderRadius: 14 }}
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
            <div key={r.name} className="paper-card flex items-start justify-between gap-4 p-5" style={{ borderRadius: 14 }}>
              <div className="min-w-0">
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
        <PressMarquee label="Brands we represent" items={REP_BRANDS} speed={26} />
      </div>
    </section>
  );
}

/* ============ 4-STEP (accent island frame) ============ */
function ModelSection() {
  return (
    <section className="island-accent relative">
      <div className="shell pad-md" style={{ paddingBottom: 0 }}>
        <SectionHeading
          eyebrow="How we work"
          title="From one store to every state —"
          titleItalic="a proven four-stage rollout."
          align="center"
          maxWidth={900}
        />
      </div>
      <RolloutScroll />
      <div className="shell text-center" style={{ paddingBottom: 'clamp(56px, 9vw, 130px)' }}>
        <MagneticButton variant="outline" to="/what-we-do">See the full model</MagneticButton>
      </div>
    </section>
  );
}

/* "The Record" now lives in its own component — an animated growth curve
   + an open, box-free ledger. See components/RecordSection.jsx. */

/* ============ FOUNDER — minimal, quote-led spotlight ============ */
function Founder() {
  // achievements pulled from Abby's profile (single source of truth in data/team.js)
  const awards = getMember('abby-caudill')?.awards ?? [];

  return (
    <section className="pad-md paper relative overflow-hidden">
      {/* ambient depth */}
      <div aria-hidden="true" className="pointer-events-none absolute" style={{
        width: 'min(52vw, 640px)', height: 'min(52vw, 640px)', left: '-6%', top: '14%',
        background: 'radial-gradient(circle, color-mix(in srgb, var(--electric) 14%, transparent), transparent 64%)', filter: 'blur(72px)',
      }} />

      <div className="shell relative">
        <div className="grid lg:grid-cols-[0.82fr_1.18fr] gap-12 lg:gap-20 items-center">

          {/* ── portrait ── */}
          <ScrollReveal from="left" distance={120} className="relative order-1">
            <div className="relative">
              <EditorialFigure src="/team/abby-caudill.png" label="Founder · Abby Caudill" aspect="4/5" index={1} />

              {/* floating glass label */}
              <div className="absolute" style={{ top: 16, left: -14, zIndex: 3 }}>
                <span className="flex items-center gap-2 rounded-full px-3.5 py-2" style={{
                  background: 'color-mix(in srgb, var(--graphite) 80%, transparent)', border: '1px solid var(--hair)',
                  backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)', boxShadow: '0 14px 30px -20px var(--shadow-card)',
                }}>
                  <span className="rounded-full" style={{ width: 6, height: 6, background: 'var(--ember)' }} />
                  <span className="font-mono" style={{ fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--bone)' }}>Founder &amp; Operator</span>
                </span>
              </div>

              {/* rubber stamp */}
              <div className="absolute" style={{ right: -14, bottom: 22, zIndex: 2 }} aria-hidden="true">
                <StampBadge topText="TEN YEARS" bottomText="ZERO FAILED" center="EST '16" color="var(--ember)" size={104} rotate={-9} />
              </div>
            </div>
          </ScrollReveal>

          {/* ── text (minimal, quote-led) ── */}
          <div className="order-2">
            <FadeUp><span className="eyebrow block mb-7">The founder</span></FadeUp>

            <FadeUp delay={0.05}>
              <blockquote className="t-display-l" style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', color: 'var(--bone)', lineHeight: 1.18, maxWidth: '17ch' }}>
                <span aria-hidden="true" style={{ color: 'var(--ember)', fontSize: '1.5em', lineHeight: 0, marginRight: 2 }}>&ldquo;</span>
                Build the team you&apos;d send to your <DrawUnderline color="var(--electric)"><span style={{ color: 'var(--electric)' }}>own customers.</span></DrawUnderline>
              </blockquote>
            </FadeUp>

            {/* attribution */}
            <FadeUp delay={0.12}>
              <div className="flex items-center gap-4 mt-8">
                <span style={{ width: 34, height: 1, background: 'var(--hair)' }} aria-hidden="true" />
                <div>
                  <p style={{ fontFamily: 'var(--font-display)', fontWeight: 600, color: 'var(--bone)', fontSize: 'clamp(19px, 1.9vw, 24px)', lineHeight: 1.1 }}>Abby Caudill</p>
                  <p className="font-mono mt-1" style={{ fontSize: 10.5, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--smoke)' }}>Founder · On the floor since 2016</p>
                </div>
              </div>
            </FadeUp>

            {/* achievements — pulled from Abby's profile */}
            <FadeUp delay={0.18}>
              <div className="mt-9">
                <p className="font-mono mb-4" style={{ fontSize: 10.5, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--ember)' }}>Recognition</p>
                <ul className="grid sm:grid-cols-2 gap-x-8 gap-y-4">
                  {awards.map((a) => (
                    <li key={a} className="flex items-start gap-3">
                      <span className="grid place-items-center shrink-0 rounded-full" style={{ width: 30, height: 30, marginTop: 1, background: 'var(--brand-soft)', border: '1px solid var(--hair)' }}>
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--ember)" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                          <circle cx="12" cy="9" r="5" /><path d="M8.5 13.4 L7 21 l5-2.6 5 2.6 -1.5-7.6" />
                        </svg>
                      </span>
                      <span className="body-sm" style={{ color: 'var(--bone)', lineHeight: 1.35 }}>{a}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </FadeUp>

            {/* CTA → opens the founder's full profile on the Team page */}
            <FadeUp delay={0.24}>
              <div className="mt-10 pt-8" style={{ borderTop: '1px solid var(--hair)' }}>
                <MagneticButton to="/team/abby-caudill">View Abby&apos;s full profile</MagneticButton>
              </div>
            </FadeUp>
          </div>
        </div>
      </div>
    </section>
  );
}

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

export default function Home() {
  return (
    <>
      <Hero />
      <FolderTabDivider label="Inside the doors" tone="electric" fill="var(--ink)" />
      <EcosystemBar />
      <SpecialtyShowcase />
      <ModelSection />
      <RecordSection />
      <Founder />
      <FolderTabDivider label="In the field" tone="electric" fill="var(--ink)" />
      <FieldScroll />
      <PartnerVoices />
      <CultureStory />
      <FolderTabDivider label="Partner with us" tone="ember" fill="var(--ink)" />
      <CTASection />
    </>
  );
}
