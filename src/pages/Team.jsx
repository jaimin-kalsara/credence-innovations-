import { useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { Link } from 'react-router-dom';
import PageHero from '../components/PageHero';
import SectionHeading from '../components/SectionHeading';
import { FadeUp, StaggerChildren, StaggerItem, ClipReveal } from '../components/AnimatedSection';
import CinematicImage from '../components/CinematicImage';
import EditorialFigure from '../components/EditorialFigure';
import MagneticButton from '../components/MagneticButton';
import FolderTabDivider from '../components/FolderTabDivider';
import Scribble from '../components/Scribble';
import ScrollReveal from '../components/ScrollReveal';
import { LEADERSHIP, ROSTER } from '../data/team';
import { PEOPLE, RECOGNITION } from '../data/media';

/* ===== Leadership (CREAM 3-up portraits, hover reveal, links to each profile) ===== */
function Leadership() {
  return (
    <section className="pad-md paper">
      <div className="shell">
        <SectionHeading
          eyebrow="Leadership"
          title="The people who keep"
          titleItalic="the standard."
        />
        <div className="row-scroll grid md:grid-cols-3 gap-8 lg:gap-12 mt-2">
          {LEADERSHIP.map((l, i) => (
            <ScrollReveal
              key={l.slug}
              from="up"
              distance={90}
              scaleFrom={1}
            >
              <Link to={`/team/${l.slug}`} className="group block" style={{ textDecoration: 'none' }}>
                <figure style={{ margin: 0 }}>
                  <div className="relative overflow-hidden" style={{ border: '1px solid var(--hair)', borderRadius: 18 }}>
                    <ClipReveal>
                      <img
                        src={l.photo}
                        alt={`${l.name}, ${l.role}`}
                        className="w-full transition-transform duration-700 group-hover:scale-[1.04]"
                        style={{ display: 'block', aspectRatio: '4 / 5', objectFit: 'cover' }}
                        loading="lazy"
                      />
                    </ClipReveal>
                    <div
                      className="absolute inset-0 flex items-end p-6 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                      style={{ background: 'linear-gradient(180deg, transparent 36%, rgba(14,26,32,0.9))' }}
                    >
                      <p className="body" style={{ color: '#F3EEE2' }}>
                        {l.tagline} <span style={{ color: 'var(--electric)' }}>View profile →</span>
                      </p>
                    </div>
                  </div>

                  <figcaption className="mt-6">
                    <span className="relative inline-block">
                      <h3 className="t-display-s" style={{ fontFamily: 'var(--font-display)', color: 'var(--bone)', lineHeight: 1.05 }}>
                        {l.name}
                      </h3>
                      <span aria-hidden="true" className="absolute left-0 w-full pointer-events-none" style={{ bottom: '-0.34em', height: '0.4em' }}>
                        <Scribble kind="underline" color="var(--electric)" width={3} delay={0.2 + i * 0.12} />
                      </span>
                    </span>
                    <p className="font-mono mt-3" style={{ fontSize: 10, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--electric)' }}>
                      {l.role}
                    </p>
                  </figcaption>
                </figure>
              </Link>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ===== The team (CREAM portrait grid — each card links to a full profile) ===== */
function Roster() {
  return (
    <section className="pad-md paper">
      <div className="shell">
        <SectionHeading
          eyebrow="The team"
          title="Built,"
          titleItalic="not hired."
          subhead="Campaign managers, an analyst, and the people who run the back office. Every one trained from the floor up. Tap any face for the full story."
        />
        <div className="row-scroll grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 mt-2">
          {ROSTER.map((p, i) => (
            <ScrollReveal key={p.slug} from="up" distance={90} scaleFrom={1}>
              <Link to={`/team/${p.slug}`} className="group block" style={{ textDecoration: 'none' }}>
                <div className="relative overflow-hidden" style={{ border: '1px solid var(--hair)', borderRadius: 16 }}>
                  <img
                    src={p.photo}
                    alt={`${p.name}, ${p.role}`}
                    className="w-full transition-transform duration-700 group-hover:scale-[1.04]"
                    style={{ display: 'block', aspectRatio: '4 / 5', objectFit: 'cover' }}
                    loading="lazy"
                  />
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{ background: 'linear-gradient(180deg, transparent 52%, rgba(14,26,32,0.88))' }} />
                  <span className="absolute bottom-4 left-4 right-4 font-mono text-[10px] tracking-[0.16em] uppercase opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{ color: 'var(--electric)' }}>
                    View profile →
                  </span>
                </div>
                <h3 className="t-display-s mt-4" style={{ fontFamily: 'var(--font-display)', color: 'var(--bone)', lineHeight: 1.1 }}>{p.name}</h3>
                <p className="font-mono mt-1.5" style={{ fontSize: 10, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--smoke)' }}>{p.role}</p>
              </Link>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ===== Team Nights gallery + lightbox (DARK island, mechanic preserved) ===== */
const gallery = [...PEOPLE, ...RECOGNITION];

function TeamNights() {
  const [active, setActive] = useState(null);
  return (
    <section data-theme="dark" className="paper relative overflow-hidden pad-lg" style={{ background: 'var(--ink)' }}>
      <div className="shell">
        <SectionHeading
          eyebrow="Team Nights"
          title="The work day earns"
          titleItalic="the team night."
          subhead="Tap any frame to expand."
        />
      </div>
      <div className="shell mt-2">
        {/* masonry; reveal-once ClipReveal wipe (no kenBurns loop) */}
        {/* slide-only (scaleFrom=1) on the static gallery wrapper — never scale-wraps the clickable items or the lightbox overlay */}
        <ScrollReveal
          from="up"
          distance={110}
          scaleFrom={1}
          className="columns-2 md:columns-3 lg:columns-4 gap-4 [column-fill:_balance]"
        >
          {gallery.map((g, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.6, delay: (i % 4) * 0.08 }}
              className="mb-4 break-inside-avoid cursor-pointer"
              onClick={() => setActive(i)}
              data-cursor="expand"
            >
              <ClipReveal delay={(i % 4) * 0.06}>
                <div style={{ border: '1px solid var(--hair)', borderRadius: 14, overflow: 'hidden' }}>
                  <img src={g} alt="Credence team" loading="lazy" style={{ display: 'block', width: '100%', height: 'auto' }} />
                </div>
              </ClipReveal>
            </motion.div>
          ))}
        </ScrollReveal>
      </div>

      <AnimatePresence>
        {active !== null && (
          <motion.div className="lightbox" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setActive(null)}>
            <button className="absolute top-6 right-6 w-12 h-12 flex items-center justify-center text-3xl z-10" style={{ color: 'var(--bone)' }} onClick={() => setActive(null)} aria-label="Close">✕</button>
            <motion.div className="w-[90vw] max-w-4xl" initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} transition={{ ease: [0.2, 0.8, 0.2, 1] }} onClick={(e) => e.stopPropagation()}>
              <img src={gallery[active]} alt="Credence team" style={{ display: 'block', width: '100%', height: 'auto', maxHeight: '85vh', objectFit: 'contain', borderRadius: 12 }} />
            </motion.div>
            <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-2">
              {gallery.map((_, i) => (
                <button key={i} onClick={(e) => { e.stopPropagation(); setActive(i); }} className="w-2 h-2 rounded-full transition-all" style={{ background: i === active ? 'var(--electric)' : 'var(--hair)' }} />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

/* ===== Culture quote (ACCENT island — single quote over ghost word FAMILY) ===== */
function CultureQuote() {
  const reduce = useReducedMotion();
  return (
    <section className="island-accent pad-md relative overflow-hidden">
      <div className="shell relative">
        {/* giant ghost word */}
        <div
          aria-hidden="true"
          className="d-caps"
          style={{
            fontSize: 'clamp(120px, 24vw, 340px)',
            lineHeight: 0.8,
            color: 'transparent',
            WebkitTextStroke: '1px var(--hair)',
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
            pointerEvents: 'none',
            whiteSpace: 'nowrap',
          }}
        >
          FAMILY
        </div>

        {/* single quote card, centered over the word */}
        <ScrollReveal from="up" distance={110} className="relative mx-auto" style={{ maxWidth: 760 }}>
          <div className="paper-card relative" style={{ padding: 'clamp(2rem, 4vw, 3.2rem)' }}>
            {/* hand-drawn star mark, top-right */}
            <div
              aria-hidden="true"
              style={{ position: 'absolute', top: 18, right: 20, width: 38, height: 38, pointerEvents: 'none' }}
            >
              <Scribble kind="star" color="var(--ember)" width={3} delay={0.4} />
            </div>

            {/* oversized terracotta quote mark */}
            <span
              aria-hidden="true"
              className="d-ital"
              style={{ display: 'block', fontSize: 'clamp(56px, 7vw, 84px)', lineHeight: 0.6, color: 'var(--ember)', marginBottom: '0.7rem', userSelect: 'none' }}
            >
              &ldquo;
            </span>

            <blockquote
              className="d-ital"
              style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', fontSize: 'clamp(24px, 3.4vw, 42px)', lineHeight: 1.18, color: 'var(--bone)', margin: 0 }}
            >
              Nobody here has ever made me feel like a number. That changes how you show up — for work, for your family, for yourself.
            </blockquote>

            {/* animated divider */}
            <motion.div
              initial={reduce ? { scaleX: 1 } : { scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={reduce ? { duration: 0 } : { duration: 0.7, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
              style={{ transformOrigin: 'left center', height: 1, background: 'var(--hair)', margin: '1.6rem 0 1.25rem' }}
            />

            <p
              className="font-mono"
              style={{ fontSize: 12, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--smoke)' }}
            >
              Prima Siddiquee · Campaign Manager
            </p>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}

/* ===== Two-path CTA (CREAM twin) ===== */
function TwoPath() {
  const paths = [
    { eyebrow: "You're a brand", title: 'Let us represent you.', body: 'Put a trained team on the floor inside the retailers your customers already trust.', to: '/contact', cta: 'Partner With Us' },
    { eyebrow: "You're talent", title: 'Build a career here.', body: "Mentorship, momentum, and a team that takes the work as seriously as the people doing it.", to: '/careers', cta: 'See Open Roles' },
  ];
  return (
    <section className="pad-md paper">
      <div className="shell grid md:grid-cols-2 gap-6 lg:gap-8">
        {paths.map((p, i) => (
          <ScrollReveal
            key={p.title}
            from={i === 0 ? 'left' : 'right'}
            distance={120}
            scaleFrom={1}
          >
            <div
              className="paper-card h-full flex flex-col"
              style={{ padding: 'clamp(2rem, 3.5vw, 3rem)' }}
            >
              <span className="eyebrow block mb-5">{p.eyebrow}</span>
              <h3
                className="mb-5"
                style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(30px,4vw,52px)', color: 'var(--bone)', lineHeight: 1.05 }}
              >
                {p.title}
              </h3>
              <p className="body-lg mb-8" style={{ color: 'var(--smoke)' }}>{p.body}</p>
              <div className="mt-auto">
                <MagneticButton variant={i === 0 ? 'solid' : 'outline'} to={p.to}>{p.cta}</MagneticButton>
              </div>
            </div>
          </ScrollReveal>
        ))}
      </div>
    </section>
  );
}

export default function Team() {
  return (
    <>
      <PageHero
        eyebrow="The team"
        title="Built, not hired."
        italic="Sent like family."
        backdrop={RECOGNITION[0]}
        align="center"
        subhead="The people who walk into Walmart, Target, and Costco carrying your brand — trained, trusted, and treated like the asset they are."
      />
      <Leadership />
      <Roster />
      <FolderTabDivider label="Team nights" tone="electric" fill="var(--ink)" />
      <TeamNights />
      <FolderTabDivider label="In their words" tone="ember" flip fill="var(--brand-soft)" />
      <CultureQuote />
      <TwoPath />
    </>
  );
}
