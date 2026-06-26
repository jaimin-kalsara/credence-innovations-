import { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import PageHero from '../components/PageHero';
import { motion, useReducedMotion } from 'framer-motion';
import { FadeUp, SplitText } from '../components/AnimatedSection';
import Odometer from '../components/Odometer';
import DrawUnderline from '../components/DrawUnderline';
import MagneticButton from '../components/MagneticButton';
import StampBadge from '../components/StampBadge';
import Scribble from '../components/Scribble';
import OddCardGrid from '../components/OddCardGrid';
import StatCard from '../components/StatCard';
import ScrollReveal from '../components/ScrollReveal';
import PressMarquee from '../components/PressMarquee';
import FolderTabDivider from '../components/FolderTabDivider';
import PartnerForm from '../components/PartnerForm';
import { RETAILER_LOGOS, logoFor } from '../data/logos';
import BrandLogo from '../components/BrandLogo';
import { CREW } from '../data/media';

gsap.registerPlugin(ScrollTrigger, useGSAP);

const brands = [
  {
    name: 'AT&T',
    sector: 'Telecom',
    line: 'Connecting customers face-to-face inside the aisles they already walk.',
    body: 'Trained reps inside Walmart and Target turning foot traffic into qualified connections — week after week, market after market.',
    stat: '12-market rollout',
    index: 0,
  },
  {
    name: 'LeafFilter',
    sector: 'Home Services',
    line: 'Demoing gutter protection exactly where homeowners shop.',
    body: "Live product demonstrations inside Lowe's and Costco, putting a complex home-services pitch in front of the right buyer at the right moment.",
    stat: '1 region → 8 markets',
    index: 1,
  },
  {
    name: 'Just Energy',
    sector: 'Energy',
    line: 'Face-to-face enrollment that builds trust before it asks for it.',
    body: 'Energy is sold on confidence. Our reps have the conversation a hundred times before launch day — so customers say yes to a name they just met.',
    stat: 'National coverage',
    index: 2,
  },
];

/* ===== Horizontal-scroll brand gallery (GSAP pin) — dark editorial island =====
   PRESERVED: the GSAP matchMedia + pinned horizontal-scrub tween is untouched.
   We only re-skin the intro + brand panels as dark editorial spreads. */
function BrandGallery() {
  const container = useRef(null);
  const track = useRef(null);

  useGSAP(
    () => {
      if (window.__lenis) window.__lenis.on('scroll', ScrollTrigger.update);
      const mm = gsap.matchMedia();
      mm.add('(min-width: 1024px)', () => {
        const total = track.current.scrollWidth - window.innerWidth;
        const tween = gsap.to(track.current, {
          x: -total,
          ease: 'none',
          scrollTrigger: {
            trigger: container.current,
            start: 'top top',
            end: () => `+=${total}`,
            pin: true,
            scrub: 1,
            invalidateOnRefresh: true,
          },
        });
        return () => tween.kill();
      });
      return () => mm.revert();
    },
    { scope: container }
  );

  return (
    <section
      ref={container}
      data-theme="dark"
      className="paper relative overflow-hidden"
      style={{ background: 'var(--ink)' }}
    >
      <div ref={track} className="flex flex-col lg:flex-row lg:h-screen lg:flex-nowrap">
        {/* intro panel */}
        <div className="w-full lg:w-screen lg:h-screen flex-shrink-0 flex items-center px-6 md:px-12 py-20 lg:py-0">
          <div style={{ maxWidth: 640 }}>
            <FadeUp>
              <span className="eyebrow block mb-6">The portfolio</span>
            </FadeUp>
            <h2 className="t-display-l mb-7" style={{ color: 'var(--bone)' }}>
              <SplitText text="Brands you know." className="d-caps" />
              <br />
              <SplitText
                text="Built market by market."
                className="d-ital"
                style={{ color: 'var(--electric)' }}
                delay={0.2}
              />
            </h2>
            <FadeUp delay={0.3}>
              <p className="body-lg measure mb-9" style={{ maxWidth: 520 }}>
                Four sectors. One method. Scroll through the campaigns we've run inside America's
                biggest retailers.
              </p>
            </FadeUp>
            <FadeUp delay={0.4}>
              <p
                className="hidden lg:flex items-center gap-3 font-mono text-[10px] tracking-widest uppercase"
                style={{ color: 'var(--electric)' }}
              >
                <span style={{ position: 'relative', display: 'inline-block', width: 64, height: 14 }}>
                  <Scribble kind="arrow" color="var(--electric)" width={2.4} />
                </span>
                Scroll to explore
              </p>
            </FadeUp>
          </div>
        </div>

        {/* brand panels — dark editorial spreads */}
        {brands.map((b) => (
          <div
            key={b.name}
            className="w-full lg:w-auto lg:h-screen flex-shrink-0 flex items-center border-t lg:border-t-0 lg:border-l"
            style={{ borderColor: 'var(--divider)', background: 'var(--graphite)' }}
          >
            <div
              className="relative flex flex-col justify-center px-6 md:px-14 lg:px-24 py-14 lg:py-0"
              style={{ maxWidth: 'min(92vw, 620px)' }}
            >
              <span
                className="font-mono text-[10px] tracking-widest uppercase mb-5"
                style={{ color: 'var(--ember)' }}
              >
                {b.sector}
              </span>
              {logoFor(b.name) && <BrandLogo name={b.name} height={26} fallback="hide" style={{ marginBottom: 20 }} />}
              <h3
                className="d-caps mb-5"
                style={{
                  fontSize: 'clamp(40px, 6vw, 92px)',
                  lineHeight: 0.96,
                  color: 'var(--bone)',
                }}
              >
                {b.name}
              </h3>
              <p
                className="d-ital mb-6"
                style={{
                  fontSize: 'clamp(20px, 2.4vw, 30px)',
                  lineHeight: 1.18,
                  color: 'var(--electric)',
                  maxWidth: 480,
                }}
              >
                {b.line}
              </p>
              <p className="body mb-9" style={{ color: 'var(--smoke)', maxWidth: 480 }}>
                {b.body}
              </p>
              <div className="self-start">
                <StampBadge
                  topText="RESULT"
                  bottomText="CREDENCE"
                  center={b.stat}
                  color="var(--electric)"
                  size={108}
                  rotate={b.index % 2 ? 6 : -7}
                />
              </div>
            </div>

          </div>
        ))}
      </div>
    </section>
  );
}

/* ===== Retailer network (accent island) — cardless ledger + a giant 99% keystone ===== */
const NETWORK = [
  { name: 'Walmart', value: '4,600+', unit: 'stores', note: 'The highest-traffic floor in America.' },
  { name: 'Target', value: '1,900+', unit: 'stores', note: 'Reaching the design-conscious shopper.' },
  { name: 'Costco', value: '600+', unit: 'warehouses', note: 'High-intent buyers, high basket value.' },
  { name: "Sam's Club", value: '600+', unit: 'clubs', note: 'Membership warehouse buyers, ready for the big basket.' },
  { name: "Lowe's", value: '1,700+', unit: 'stores', note: 'The homeowner at the moment of need.' },
  { name: "BJ's", value: '240+', unit: 'clubs', note: 'Loyal value-club members across the East Coast.' },
];

function RetailerNetwork() {
  return (
    <section className="island-accent pad-md">
      <div className="shell">
        {/* headline + a giant rolling 99% keystone */}
        <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-10 lg:gap-16 lg:items-end">
          <div>
            <FadeUp><span className="eyebrow block mb-5">The retail network</span></FadeUp>
            <FadeUp delay={0.05}>
              <h2 className="t-display-l" style={{ color: 'var(--bone)', fontFamily: 'var(--font-display)' }}>
                <span className="d-caps">Six retailers.</span>{' '}
                <span className="d-ital" style={{ color: 'var(--electric)' }}>
                  Ninety-nine percent of the{' '}
                  <DrawUnderline color="var(--ember)">country</DrawUnderline>.
                </span>
              </h2>
            </FadeUp>
            <FadeUp delay={0.12}>
              <p className="body-lg mt-6" style={{ color: 'var(--smoke)', maxWidth: 540 }}>
                We don't rent shelf space. We operate inside the stores where buying decisions happen every day.
              </p>
            </FadeUp>
          </div>

          <FadeUp delay={0.1}>
            <div className="lg:text-right">
              <div className="stat-num leading-none" style={{ fontSize: 'clamp(88px, 13vw, 184px)' }}>
                <Odometer value="99%" />
              </div>
              <p className="font-mono text-[11px] tracking-[0.18em] uppercase mt-3" style={{ color: 'var(--smoke)' }}>
                of the U.S. population within reach
              </p>
              <div className="mt-4 h-[5px] rounded-full overflow-hidden" style={{ background: 'var(--hair)' }} aria-hidden="true">
                <motion.div className="h-full rounded-full" style={{ background: 'var(--electric)' }}
                  initial={{ width: 0 }} whileInView={{ width: '99%' }} viewport={{ once: true, margin: '-15%' }}
                  transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1], delay: 0.2 }} />
              </div>
            </div>
          </FadeUp>
        </div>

        {/* the five retailers — a cardless editorial ledger with alive, rolling counts */}
        <div className="mt-14 lg:mt-20" style={{ borderBottom: '1px solid var(--hair)' }}>
          {NETWORK.map((r, i) => (
            <FadeUp key={r.name} delay={i * 0.05}>
              <div
                className="ed-row group grid gap-x-6 gap-y-2 py-6 md:py-8 md:grid-cols-[minmax(0,0.98fr)_minmax(0,0.78fr)_minmax(0,1.04fr)] md:items-baseline"
                style={{ borderTop: '1px solid var(--hair)' }}
              >
                <div className="flex items-center gap-3 min-w-0">
                  {logoFor(r.name) && <BrandLogo name={r.name} height={20} className="brand-plate--sm" fallback="hide" />}
                  <h3 className="ed-row-title" style={{ fontFamily: 'var(--font-display)', color: 'var(--bone)', fontSize: 'clamp(26px, 3.2vw, 42px)', lineHeight: 1, margin: 0, whiteSpace: 'nowrap' }}>
                    {r.name}
                  </h3>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="stat-num" style={{ fontSize: 'clamp(26px, 3.4vw, 44px)' }}><Odometer value={r.value} /></span>
                  <span className="font-mono text-[11px] tracking-[0.12em] uppercase" style={{ color: 'var(--smoke)' }}>{r.unit}</span>
                </div>
                <p className="body" style={{ color: 'var(--smoke)', margin: 0, maxWidth: '46ch' }}>{r.note}</p>
              </div>
            </FadeUp>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ===== Proof bar (cream StatCard row) ===== */
function ProofBar() {
  const cards = [
    { label: 'Campaigns executed', value: '211', accent: 'var(--electric)', tilt: -1.2 },
    { label: 'Sectors served', value: '4', accent: 'var(--ember)', tilt: 1.4 },
    { label: 'Markets activated', value: '40+', accent: 'var(--electric)', tilt: -0.9 },
    { label: 'Client satisfaction', value: '98%', accent: 'var(--electric)', pill: 'Repeat partners', tilt: 1.1 },
  ];

  return (
    <section className="pad-md paper">
      <div className="shell">
        <FadeUp>
          <div style={{ maxWidth: '40ch', marginBottom: 'clamp(28px, 4vw, 44px)' }}>
            <span className="eyebrow block mb-4">The record so far</span>
            <h2 className="t-display-m" style={{ color: 'var(--bone)' }}>
              <SplitText text="Proof, not" className="d-caps" />{' '}
              <SplitText text="promises." className="d-ital" style={{ color: 'var(--electric)' }} delay={0.15} />
            </h2>
          </div>
        </FadeUp>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
            gap: 'clamp(16px, 2.4vw, 26px)',
          }}
          className="proof-grid"
        >
          {cards.map((c, i) => (
            <ScrollReveal key={c.label} from={['left', 'up', 'right'][i % 3]} distance={120}>
              <StatCard
                label={c.label}
                value={c.value}
                pill={c.pill}
                accent={c.accent}
                tilt={c.tilt}
              />
            </ScrollReveal>
          ))}
        </div>
        {/* widen to 4-up on md+ without touching index.css */}
        <style>{`@media (min-width: 768px){.proof-grid{grid-template-columns:repeat(4,minmax(0,1fr))!important;}}`}</style>
      </div>
    </section>
  );
}

/* ===== CTA (dark island + PartnerForm) ===== */
function ClientsCTA() {
  return (
    <section data-theme="dark" className="paper pad-lg" style={{ background: 'var(--ink)' }}>
      <div className="shell-narrow">
        <ScrollReveal from="up" distance={110} className="text-center" style={{ marginBottom: 'clamp(36px, 5vw, 56px)' }}>
          <FadeUp>
            <span className="eyebrow block mb-5">Join the portfolio</span>
          </FadeUp>
          <FadeUp delay={0.05}>
            <h2 className="t-display-l" style={{ color: 'var(--bone)' }}>
              <SplitText text="Your brand, inside the stores" className="d-caps" />{' '}
              <SplitText
                text="every American already shops."
                className="d-ital"
                style={{ color: 'var(--electric)' }}
                delay={0.15}
              />
            </h2>
          </FadeUp>
          <FadeUp delay={0.12}>
            <p className="body-lg measure mx-auto mt-6" style={{ textAlign: 'center' }}>
              Tell us what you're launching or scaling. We'll show you the markets where it fits and
              the fastest path to the floor.
            </p>
          </FadeUp>
        </ScrollReveal>
        <FadeUp delay={0.18}>
          <div className="paper-card" style={{ padding: 'clamp(20px, 3vw, 36px)', borderRadius: 22 }}>
            <PartnerForm />
          </div>
        </FadeUp>
        <div className="flex items-center justify-center gap-8 mt-10 opacity-90">
          <StampBadge topText="FORTUNE 500" bottomText="REPRESENTED" center="500" color="var(--electric)" size={80} rotate={-6} />
          <StampBadge topText="A+ RATED" bottomText="BBB" center="A+" color="var(--ember)" size={80} rotate={5} />
        </div>
      </div>
    </section>
  );
}

/* Clients hero imagery — tasteful placeholder photos graded into the dark
   editorial look. To use real photos, replace the two files in
   /public/clients (same filenames) — no code change needed. */
function ClientsHeroMedia() {
  const reduce = useReducedMotion();
  const grade = { display: 'block', width: '100%', objectFit: 'cover', filter: 'saturate(0.98) contrast(1.03)' };
  const tint = {
    position: 'absolute', inset: 0, pointerEvents: 'none',
    background: 'linear-gradient(0deg, rgba(14,22,24,0.42), transparent 48%)',
  };
  return (
    <motion.div
      className="relative w-full"
      style={{ width: '100%', maxWidth: 560 }}
      initial={reduce ? false : { opacity: 0, y: 26, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.9, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="relative overflow-hidden" style={{ borderRadius: 18, border: '1px solid var(--hair)', boxShadow: '0 30px 60px -30px rgba(0,0,0,0.7)' }}>
        <img src={CREW[0]} alt="The Credence team" loading="eager" style={{ ...grade, aspectRatio: '4 / 5' }} />
        <span aria-hidden="true" style={tint} />
      </div>
      <motion.div
        className="absolute overflow-hidden"
        style={{ left: '6%', bottom: '6%', width: '38%', borderRadius: 12, border: '1px solid var(--hair)', boxShadow: '0 18px 40px -20px rgba(0,0,0,0.85)' }}
        initial={reduce ? false : { opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
      >
        <img src={CREW[1]} alt="Credence reps at a recognition event" loading="eager" style={{ ...grade, aspectRatio: '4 / 3' }} />
        <span aria-hidden="true" style={tint} />
      </motion.div>
    </motion.div>
  );
}

export default function Clients() {
  return (
    <>
      <PageHero
        eyebrow="The ecosystem"
        title="Brands you know."
        italic="Stores every American shops."
        subhead="We represent Fortune 500 names inside the country's five largest retailers — and we make the introduction in person."
        badge={<StampBadge topText="FORTUNE 500" bottomText="REPRESENTED" center="500" color="var(--electric)" size={104} rotate={-8} />}
        media={<ClientsHeroMedia />}
      >
        <MagneticButton to="/contact">Partner With Us</MagneticButton>
      </PageHero>

      {/* retailer ticker */}
      <PressMarquee label="Where we operate" items={RETAILER_LOGOS} speed={30} />

      <FolderTabDivider label="The portfolio" tone="electric" fill="var(--ink)" />
      <BrandGallery />
      <FolderTabDivider label="The retail network" tone="electric" fill="var(--ink)" flip />

      <RetailerNetwork />
      <ProofBar />

      <FolderTabDivider label="Join the portfolio" tone="ember" fill="var(--ink)" />
      <ClientsCTA />
    </>
  );
}
