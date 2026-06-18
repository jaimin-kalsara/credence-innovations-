import { FadeUp, StaggerChildren, StaggerItem } from '../components/AnimatedSection';
import PageHero from '../components/PageHero';
import SectionHeading from '../components/SectionHeading';
import RolloutScroll from '../components/RolloutScroll';
import EditorialRows from '../components/EditorialRows';
import MagneticButton from '../components/MagneticButton';
import ImageStoryTimeline from '../components/ImageStoryTimeline';
import Scribble from '../components/Scribble';
import StampBadge from '../components/StampBadge';
import FolderTabDivider from '../components/FolderTabDivider';
import DrawUnderline from '../components/DrawUnderline';
import ScrollReveal from '../components/ScrollReveal';
import { FIELD } from '../data/media';

/* ===== The difference (DARK island) — "Them vs Us" comparison =====
   Each of the 3 rows pits a struck/muted "Them" claim against a ringed,
   checked "Us" claim in --electric. The Them side gets a hand bracket +
   cross-out feel; the Us side a hand circle + check. All copy verbatim. */
const DIFF_ROWS = [
  { them: 'Impressions', us: 'Conversations' },
  { them: 'Your existing buyers', us: 'Brand-new customers' },
  { them: 'A dashboard', us: 'A handshake' },
];

function DiffRow({ them, us, i }) {
  return (
    <FadeUp delay={i * 0.08}>
      <div
        className="flex flex-col items-center text-center gap-3 py-6 md:grid md:grid-cols-[1fr_auto_1fr] md:items-center md:gap-8 md:py-7 md:text-left"
        style={{ borderTop: i ? '1px solid var(--hair)' : 'none' }}
      >
        {/* THEM — the old way: muted, with a clean strike-through (still readable) */}
        <div className="md:text-right">
          <p className="font-mono text-[10px] tracking-[0.2em] uppercase mb-2" style={{ color: 'var(--smoke)' }}>Them</p>
          <span
            className="relative inline-block"
            style={{ fontFamily: 'var(--font-display)', color: 'var(--smoke)', opacity: 0.62, fontSize: 'clamp(20px, 2.5vw, 30px)', lineHeight: 1.18 }}
          >
            {them}
            <span aria-hidden="true" className="absolute left-0 right-0" style={{ top: '52%', height: 2, borderRadius: 2, background: 'currentColor', opacity: 0.7 }} />
          </span>
        </div>

        {/* arrow — points right on desktop, down on mobile */}
        <span aria-hidden="true" className="rotate-90 md:rotate-0 select-none" style={{ color: 'var(--ember)', fontSize: 'clamp(18px, 2vw, 26px)', lineHeight: 1 }}>→</span>

        {/* US — the Credence way: bright, clear, checked (no scribble across the word) */}
        <div className="md:text-left">
          <p className="font-mono text-[10px] tracking-[0.2em] uppercase mb-2" style={{ color: 'var(--ember)' }}>Us</p>
          <span
            className="inline-block"
            style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', color: 'var(--electric)', fontSize: 'clamp(20px, 2.5vw, 30px)', lineHeight: 1.18 }}
          >
            {us}
            <span aria-hidden="true" className="inline-block align-middle" style={{ width: '0.8em', height: '0.8em', marginLeft: '0.45em' }}>
              <Scribble kind="check" color="var(--electric)" width={3} delay={0.4 + i * 0.08} />
            </span>
          </span>
        </div>
      </div>
    </FadeUp>
  );
}

function Difference() {
  return (
    <section data-theme="dark" className="paper relative overflow-hidden pad-lg" style={{ background: 'var(--ink)' }}>
      <div className="shell grid lg:grid-cols-[0.95fr_1.05fr] gap-12 lg:gap-20 items-center">
        {/* intro column — slides in from the left */}
        <ScrollReveal from="left" distance={120}>
          <div>
            <FadeUp><span className="eyebrow block mb-5">The difference</span></FadeUp>
            <FadeUp delay={0.05}>
              <h2 className="t-display-l" style={{ fontFamily: 'var(--font-display)', color: 'var(--bone)' }}>
                Most agencies market to your audience.{' '}
                <span className="d-ital" style={{ color: 'var(--electric)' }}>
                  We build you a <DrawUnderline color="var(--electric)">new one</DrawUnderline>.
                </span>
              </h2>
            </FadeUp>
            <FadeUp delay={0.12}>
              <p className="body-lg mt-7" style={{ color: 'var(--smoke)', maxWidth: '52ch' }}>
                Digital ads chase people who already know you. We walk up to the ones who don't. Inside the store, in the
                aisle, at the exact moment they're deciding. No impressions. No guesswork. Real conversations that end in a sale.
              </p>
            </FadeUp>
          </div>
        </ScrollReveal>

        {/* the comparison ledger — slides in from the right */}
        <ScrollReveal from="right" distance={120}>
          <FadeUp delay={0.1}>
            <div className="paper-card" style={{ padding: 'clamp(18px, 3vw, 34px)', borderRadius: 20 }}>
              <div className="flex flex-col">
                {DIFF_ROWS.map((row, i) => (
                  <DiffRow key={row.us} them={row.them} us={row.us} i={i} />
                ))}
              </div>
            </div>
          </FadeUp>
        </ScrollReveal>
      </div>
    </section>
  );
}

/* ===== Capabilities (CREAM) — non-uniform 6-up paper-card grid ===== */
const CAPS = [
  { title: 'Retail Activation', body: "Trained brand reps on the floor inside Walmart, Target, Costco, Lowe's, and BJ's.", tilt: -1.4 },
  { title: 'Product Launch', body: 'Education, demo, and trial at the precise moment a customer walks the aisle.', tilt: 1.1 },
  { title: 'National Rollout', body: 'From one store to hundreds — same standard, same brand experience, every market.', tilt: -0.8, accent: true },
  { title: 'Custom Training', body: 'Every rep is built on your product, your voice, your customer before launch day.', tilt: 1.4 },
  { title: 'Market Entry', body: 'Breaking unknown brands into saturated markets through trusted retail floors.', tilt: -1.1 },
  { title: 'Brand Protection', body: 'Reps who sound like they have worked for you for years — never outsourced.', tilt: 0.9 },
];

function Capabilities() {
  return (
    <section className="pad-md paper">
      <div className="shell">
        <SectionHeading
          eyebrow="Capabilities"
          title="Everything we do happens"
          titleItalic="face-to-face."
          align="center"
          maxWidth={780}
        />
        <div className="mt-6 md:mt-10">
          <EditorialRows items={CAPS.map((c) => ({ title: c.title, body: c.body }))} />
        </div>
      </div>
    </section>
  );
}

/* ===== The model (ACCENT island) — deep-dive four-stage rollout ===== */
function Model() {
  return (
    <section className="island-accent relative">
      <div className="shell pad-md" style={{ paddingBottom: 0 }}>
        <SectionHeading
          eyebrow="The four-stage model"
          title="From a single store to every state —"
          titleItalic="without losing the standard."
          subhead="The proven rollout we run for every brand, every sector. Scroll to walk through it."
          maxWidth={900}
        />
      </div>
      {/* RolloutScroll — the pinned, scroll-scrubbed stepper (same four stages as Home) */}
      <RolloutScroll />
    </section>
  );
}

/* ===== Process (CREAM) — scroll-scrubbed timeline of the 4 steps ===== */
const PROCESS_STEPS = [
  { marker: '01', heading: 'Discovery', body: 'We learn your product, your margins, and the customer you want to win.', imageIndex: 0 },
  { marker: '02', heading: 'Custom training', body: 'Reps are trained on your voice until the pitch is second nature.', imageIndex: 1 },
  { marker: '03', heading: 'Pilot launch', body: 'We go live in a target market and measure conversion from day one.', imageIndex: 2 },
  { marker: '04', heading: 'Scale', body: 'What converts gets replicated, market by market, coast to coast.', imageIndex: 3 },
];

function Process() {
  return (
    <section className="pad-md paper">
      <div className="shell">
        <FadeUp>
          <SectionHeading
            eyebrow="How an engagement runs"
            title="Four weeks from handshake"
            titleItalic="to the floor."
            maxWidth={780}
          />
        </FadeUp>
        <div className="mt-10 lg:mt-14">
          <ImageStoryTimeline items={PROCESS_STEPS} />
        </div>
      </div>
    </section>
  );
}

/* ===== CTA (DARK island) — twin CTA ===== */
function CTA() {
  return (
    <section data-theme="dark" className="paper pad-lg" style={{ background: 'var(--ink)' }}>
      <ScrollReveal from="up" distance={110} className="shell-narrow text-center">
        <FadeUp><span className="eyebrow block mb-5">See it in your market</span></FadeUp>
        <FadeUp delay={0.05}>
          <h2 className="t-display-l" style={{ fontFamily: 'var(--font-display)', color: 'var(--bone)' }}>
            Let's map your fastest path from{' '}
            <span className="d-ital" style={{ color: 'var(--electric)' }}>
              pilot to <DrawUnderline color="var(--electric)">national</DrawUnderline>.
            </span>
          </h2>
        </FadeUp>
        <FadeUp delay={0.15}>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-9">
            <MagneticButton to="/contact">Partner With Us</MagneticButton>
            <MagneticButton variant="outline" to="/clients">See the work</MagneticButton>
          </div>
        </FadeUp>
        <div className="flex items-center justify-center gap-8 mt-12 opacity-90">
          <StampBadge topText="HANDSHAKE TO" bottomText="THE FLOOR" center="4 WKS" color="var(--electric)" size={84} rotate={-7} />
          <StampBadge topText="ESTABLISHED" bottomText="INDIANAPOLIS" center="2016" color="var(--ember)" size={84} rotate={6} />
        </div>
      </ScrollReveal>
    </section>
  );
}

export default function WhatWeDo() {
  return (
    <>
      <PageHero
        eyebrow="What we do"
        title="We don't market to your audience."
        italic="We build you a new one."
        backdrop={FIELD[0]}
        subhead="Credence Innovations puts trained brand representatives inside America's biggest retailers — turning first-time shoppers into lifelong customers."
      />
      <FolderTabDivider label="The difference" tone="electric" fill="var(--ink)" />
      <Difference />
      <Capabilities />
      <FolderTabDivider label="The four-stage model" tone="electric" fill="color-mix(in srgb, var(--electric) 6%, var(--ink))" />
      <Model />
      <Process />
      <FolderTabDivider label="See it in your market" tone="ember" fill="var(--ink)" />
      <CTA />
    </>
  );
}
