import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import PageHero from '../components/PageHero';
import SectionHeading from '../components/SectionHeading';
import { FadeUp } from '../components/AnimatedSection';
import MagneticButton from '../components/MagneticButton';
import Odometer from '../components/Odometer';
import MarqueeColumn from '../components/MarqueeColumn';
import StampBadge from '../components/StampBadge';
import FolderTabDivider from '../components/FolderTabDivider';
import ScrollReveal from '../components/ScrollReveal';
import { CULTURE, CREW } from '../data/media';

/* ===== Travel Opportunity (accent island — image-led gallery) =====
   The travel perk, told in pictures: three destination tiles for the real
   programs Credence runs — the Chicago regional, the all-expenses retreat,
   and the Seattle leadership summit. Minimal copy; the photography carries it.
   Each tile flips its tokens to the dark theme so text stays legible over the
   image, with a soft zoom on hover. */
const TRIPS = [
  { place: 'Chicago', name: 'Regional Conference', freq: 'Twice a year', note: 'Top consultants meet to network and sharpen the craft.', img: CULTURE[0], alt: 'Credence team gathered at a regional conference dinner' },
  { place: 'Breathtaking destinations', name: 'Rest & Retreat', freq: 'All-expenses-paid', note: 'A trip built to recharge, reconnect, and reset.', img: CULTURE[1], alt: 'Credence team on a retreat by the water' },
  { place: 'Seattle', name: 'Leadership Summit', freq: 'Nationwide', note: 'Directors and top leaders, together to grow.', img: CREW[0], alt: 'Credence leadership team together' },
];

function Travel() {
  return (
    <section className="island-accent pad-md">
      <div className="shell">
        <ScrollReveal from="up" distance={110}>
          <SectionHeading
            eyebrow="Travel Opportunity"
            title="The work takes you"
            titleItalic="places."
            subhead="Conferences, retreats, and leadership summits — on us. See the country while you build the career."
            align="center"
            maxWidth={720}
          />
        </ScrollReveal>

        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-5 lg:gap-6 mt-10 md:mt-12">
          {TRIPS.map((trip, i) => (
            <FadeUp key={trip.name} delay={i * 0.08}>
              <article
                data-theme="dark"
                className="group relative overflow-hidden h-full"
                style={{ borderRadius: 20, border: '1px solid var(--hair)', boxShadow: '0 34px 64px -38px rgba(0,0,0,0.6)' }}
              >
                <div className="relative overflow-hidden" style={{ aspectRatio: '4 / 5' }}>
                  <img
                    src={trip.img}
                    alt={trip.alt}
                    loading="lazy"
                    className="absolute inset-0 w-full h-full transition-transform duration-700 ease-out group-hover:scale-[1.06]"
                    style={{ objectFit: 'cover', filter: 'contrast(1.04)' }}
                  />
                  {/* legibility gradient */}
                  <span
                    aria-hidden="true"
                    className="absolute inset-0 pointer-events-none"
                    style={{ background: 'linear-gradient(0deg, rgba(14,22,24,0.88) 3%, rgba(14,22,24,0.34) 44%, transparent 72%)' }}
                  />

                  {/* frequency chip */}
                  <span
                    className="absolute top-4 left-4 font-mono uppercase"
                    style={{
                      fontSize: 10, letterSpacing: '0.14em', color: 'var(--bone)',
                      background: 'color-mix(in srgb, var(--ink) 52%, transparent)',
                      backdropFilter: 'blur(6px)', WebkitBackdropFilter: 'blur(6px)',
                      border: '1px solid color-mix(in srgb, var(--bone) 24%, transparent)',
                      borderRadius: 999, padding: '5px 11px',
                    }}
                  >
                    {trip.freq}
                  </span>

                  {/* bottom content */}
                  <div className="absolute inset-x-0 bottom-0 p-5 lg:p-6">
                    <div className="font-mono uppercase mb-2" style={{ fontSize: 10, letterSpacing: '0.18em', color: 'var(--electric)' }}>
                      {trip.place}
                    </div>
                    <h3 className="t-display-s" style={{ fontFamily: 'var(--font-display)', color: 'var(--bone)', lineHeight: 1.05, margin: '0 0 8px' }}>
                      {trip.name}
                    </h3>
                    <p className="body-sm" style={{ color: 'color-mix(in srgb, var(--bone) 80%, transparent)', margin: 0, maxWidth: '30ch' }}>
                      {trip.note}
                    </p>
                  </div>
                </div>
              </article>
            </FadeUp>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ===== What you gain (cream — animated benefit columns) =====
   The real "What You Gain as part of Our Team" perks from the live careers
   page, shown as three vertically auto-scrolling columns of paper-cards
   (MarqueeColumn owns the infinite loop + reduced-motion). A top/bottom mask
   fades the scroll so it reads as a living, premium wall — not a static grid.
   Themed entirely in the house tokens (paper-card, Fraunces, mono). */
const GAINS = [
  { tag: 'Onboarding', title: 'Training Programs', desc: 'Comprehensive initial training so you feel confident and prepared from day one.', accent: 'var(--electric)' },
  { tag: 'Growth', title: 'Career Growth', desc: 'A business that keeps growing with top-tier clients — and the room for you to grow with it.', accent: 'var(--ember)' },
  { tag: 'Travel', title: 'Travel Opportunities', desc: 'Conferences, retreats, and leadership summits across the country — on us.', accent: 'var(--electric)' },
  { tag: 'People', title: 'Mentorship', desc: 'A collaborative team where networking and lifting each other up is the standard.', accent: 'var(--ember)' },
  { tag: 'Leadership', title: 'Management Opportunities', desc: 'Entry-level roles built to teach real leadership through hands-on experience.', accent: 'var(--electric)' },
  { tag: 'Future', title: 'Planning for the Future', desc: '401(k) matching and Roth IRA guidance to grow your retirement savings.', accent: 'var(--ember)' },
];

const GAIN_COLUMNS = [GAINS.slice(0, 2), GAINS.slice(2, 4), GAINS.slice(4, 6)];

function GainCard(b) {
  return (
    <article className="paper-card" style={{ borderRadius: 22, padding: 'clamp(22px, 2.4vw, 30px)', width: '100%', maxWidth: 322 }}>
      <div className="flex items-center gap-2.5 mb-4">
        <span aria-hidden="true" style={{ display: 'inline-block', width: 9, height: 9, borderRadius: 2, background: b.accent, transform: 'rotate(45deg)' }} />
        <span className="font-mono uppercase" style={{ fontSize: 10, letterSpacing: '0.16em', color: 'var(--smoke)' }}>{b.tag}</span>
      </div>
      <h3 className="t-display-s" style={{ fontFamily: 'var(--font-display)', color: 'var(--bone)', lineHeight: 1.1, margin: '0 0 10px' }}>{b.title}</h3>
      <p className="body" style={{ color: 'var(--smoke)', margin: 0 }}>{b.desc}</p>
    </article>
  );
}

function WhatYouGain() {
  return (
    <section className="pad-md paper relative overflow-hidden">
      {/* ambient brand glow, top-right */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute"
        style={{
          width: 'min(58vw, 700px)', height: 'min(40vw, 500px)', right: '-10%', top: '2%',
          background: 'radial-gradient(circle, color-mix(in srgb, var(--electric) 12%, transparent), transparent 66%)',
          filter: 'blur(64px)',
        }}
      />

      <div className="shell relative">
        <ScrollReveal from="up" distance={110}>
          <SectionHeading
            eyebrow="The upside"
            title="What you gain as"
            titleItalic="part of the team."
            subhead="Training, mentorship, travel, and a real plan for your future — here's what comes with the work."
            align="center"
            maxWidth={760}
          />
        </ScrollReveal>

        <div
          className="flex justify-center gap-6 mt-12 md:mt-14 overflow-hidden"
          style={{
            maxHeight: 'min(70vh, 600px)',
            maskImage: 'linear-gradient(to bottom, transparent, #000 15%, #000 85%, transparent)',
            WebkitMaskImage: 'linear-gradient(to bottom, transparent, #000 15%, #000 85%, transparent)',
          }}
        >
          <MarqueeColumn items={GAIN_COLUMNS[0]} duration={24} renderItem={GainCard} />
          <MarqueeColumn items={GAIN_COLUMNS[1]} duration={31} className="hidden md:block" renderItem={GainCard} />
          <MarqueeColumn items={GAIN_COLUMNS[2]} duration={27} className="hidden lg:block" renderItem={GainCard} />
        </div>
      </div>
    </section>
  );
}

/* ===== Open positions (cream — accordion; roles mirror the live careers page) =====
   The three real openings from credenceinnovations.org/careers, each expanding
   to full job details (summary + responsibilities + what we look for) the way
   the source site's individual job pages present them. CTA is "View job". */
const positions = [
  {
    title: 'Retail Sales Associate',
    type: 'Full-time · In-store',
    location: 'Retail partner locations',
    summary: 'Represent our clients on the floor as a technology-focused brand ambassador — matching shoppers to the right products and turning store visits into loyalty.',
    sections: [
      {
        label: "What you'll do",
        items: [
          'Greet every customer warmly and professionally',
          'Act as a brand ambassador for the technology you represent',
          'Give tailored product recommendations based on real needs',
          'Keep growing your product knowledge through ongoing learning',
          'Keep the department organized and well-stocked',
        ],
      },
      {
        label: 'What we look for',
        items: [
          '18 years or older',
          'Thrives in a fast-paced, team-oriented environment',
          'Flexible scheduling based on availability',
          'Strong customer-relationship skills',
        ],
      },
    ],
    tags: ['Customer service', 'Technology', 'On-site'],
  },
  {
    title: 'Sales Manager',
    type: 'Leadership · Full-time',
    location: 'Indianapolis & expansion markets',
    summary: 'Lead from the front. Build and inspire high-performing teams while turning data into the decisions that move the business forward.',
    sections: [
      {
        label: "What you'll do",
        items: [
          'Lead and inspire the team while fostering a supportive culture',
          'Plan and manage departmental workloads monthly and quarterly',
          'Oversee hourly team members and shape business strategy',
          'Build high-performing teams through recruiting and talent development',
          'Analyze data to extract insights and support decisions',
        ],
      },
      {
        label: "What you'll develop",
        items: [
          'A client-service foundation and a positive team culture',
          'Consumer engagement, problem-solving, and conflict resolution',
          'Retail and business essentials',
        ],
      },
    ],
    tags: ['Leadership', 'Strategy', 'Weekly pay'],
  },
  {
    title: 'Entry Level Marketing & Sales Assistant',
    type: 'Entry-level · Full-time',
    location: 'Indianapolis, IN',
    summary: 'Start your career with hands-on training in marketing, sales, and leadership — running real campaigns and events from day one.',
    sections: [
      {
        label: "What you'll do",
        items: [
          'Execute marketing campaigns and organize sales events',
          'Plan and support field marketing, events, and product launches',
          'Collaborate with clients on campaign support',
          'Build customized marketing strategies alongside managers',
          'Own coordination and project management for sales events',
          'Bring fresh, revenue-generating ideas to the table',
        ],
      },
      {
        label: 'What we look for',
        items: [
          'No prior experience required',
          'Hard work and a learning mindset',
          'Excellent communication skills',
          'Thrives collaborating in a team environment',
        ],
      },
    ],
    tags: ['Entry-level', 'Marketing', 'Training provided'],
  },
];

function Positions() {
  const [open, setOpen] = useState(0);
  return (
    <section className="pad-md paper">
      <div className="shell-narrow">
        {/* header slides up — accordion cards left unwrapped so their height animation is undisturbed */}
        <ScrollReveal from="up" distance={110}>
          <SectionHeading
            eyebrow="Open roles"
            title="Now hiring across"
            titleItalic="the network."
          />
        </ScrollReveal>
        <div className="flex flex-col gap-4 mt-4">
          {positions.map((p, i) => {
            const isOpen = open === i;
            return (
              <div
                key={p.title}
                className="paper-card"
                style={{ borderRadius: 18, padding: 'clamp(8px, 1.4vw, 14px) clamp(18px, 2.6vw, 30px)' }}
              >
                <button
                  onClick={() => setOpen(isOpen ? -1 : i)}
                  aria-expanded={isOpen}
                  className="w-full flex items-center justify-between gap-4 py-5 text-left group"
                >
                  <div className="flex items-baseline gap-4 md:gap-6 flex-wrap">
                    <span className="stat-num" style={{ fontSize: 'clamp(20px,2.5vw,32px)' }}>{String(i + 1).padStart(2, '0')}</span>
                    <span
                      className="t-display-s transition-colors"
                      style={{ fontFamily: 'var(--font-display)', color: isOpen ? 'var(--electric)' : 'var(--bone)' }}
                    >
                      {p.title}
                    </span>
                    <span className="font-mono text-[10px] tracking-widest uppercase" style={{ color: 'var(--smoke)' }}>{p.type}</span>
                  </div>

                  {/* View job pill — toggles the full job details */}
                  <span
                    className={`shrink-0 inline-flex items-center gap-2 rounded-full font-mono uppercase border transition-colors duration-300 ${
                      isOpen
                        ? 'border-[color:var(--electric)] text-[color:var(--electric)]'
                        : 'border-[color:var(--hair)] text-[color:var(--bone)] group-hover:border-[color:var(--electric)] group-hover:text-[color:var(--electric)]'
                    }`}
                    style={{
                      fontSize: 10, letterSpacing: '0.14em', padding: '8px 14px',
                      background: isOpen ? 'color-mix(in srgb, var(--electric) 10%, transparent)' : 'transparent',
                    }}
                  >
                    {isOpen ? 'Close' : 'View job'}
                    <motion.svg
                      width="11" height="11" viewBox="0 0 11 11" fill="none"
                      animate={{ rotate: isOpen ? 180 : 0 }}
                      transition={{ duration: 0.3 }}
                      aria-hidden="true"
                    >
                      <path d="M2.5 4L5.5 7L8.5 4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                    </motion.svg>
                  </span>
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.4, ease: [0.2, 0.8, 0.2, 1] }}
                      style={{ overflow: 'hidden' }}
                    >
                      <div className="pb-8 pl-0 md:pl-[60px]">
                        <div className="mb-5" style={{ borderTop: '1px solid var(--hair)' }} />
                        {p.location && (
                          <p className="font-mono uppercase mb-4" style={{ fontSize: 10, letterSpacing: '0.16em', color: 'var(--ember)' }}>
                            {p.location}
                          </p>
                        )}
                        <p className="body-lg leading-relaxed mb-7" style={{ color: 'var(--smoke)', maxWidth: '60ch' }}>{p.summary}</p>

                        <div className="grid sm:grid-cols-2 gap-x-10 gap-y-7 mb-7">
                          {p.sections.map((sec) => (
                            <div key={sec.label}>
                              <h4 className="font-mono uppercase mb-3.5" style={{ fontSize: 10, letterSpacing: '0.16em', color: 'var(--smoke)' }}>{sec.label}</h4>
                              <ul className="flex flex-col gap-2.5 m-0 p-0" style={{ listStyle: 'none' }}>
                                {sec.items.map((it) => (
                                  <li key={it} className="flex items-start gap-3">
                                    <span aria-hidden="true" className="shrink-0" style={{ marginTop: 9, width: 6, height: 6, borderRadius: 1, background: 'var(--electric)', transform: 'rotate(45deg)' }} />
                                    <span className="body" style={{ color: 'var(--bone)' }}>{it}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          ))}
                        </div>

                        <div className="flex flex-wrap gap-2 mb-7">
                          {p.tags.map((t) => (
                            <span
                              key={t}
                              className="px-3 py-1.5 text-xs rounded-full"
                              style={{ border: '1px solid var(--hair)', color: 'var(--smoke)' }}
                            >
                              {t}
                            </span>
                          ))}
                        </div>

                        <a href="#apply" className="mag-btn inline-flex text-sm px-5 py-2.5" style={{ background: 'var(--electric)' }}>
                          Apply now
                        </a>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* Pre-seeded confetti specks (computed once at module load, not during render)
   so the success burst stays visually identical without an impure render. */
const CONFETTI = Array.from({ length: 30 }, (_, i) => ({
  left: 20 + Math.random() * 60,
  dur: 1 + Math.random(),
  delay: Math.random() * 0.3,
  color: i % 2 ? 'var(--ember)' : 'var(--electric)',
}));

/* Web3Forms delivers each submission straight to hr@credenceinnovations.com.
   The access key is bound to that inbox: create it (free, ~1 min) at
   https://web3forms.com using hr@credenceinnovations.com as the email, then
   paste the key below — or, preferred, set VITE_WEB3FORMS_KEY in a .env file
   at the project root (`VITE_WEB3FORMS_KEY=xxxxxxxx-...`) and restart the dev
   server. Until a real key is set the form shows a friendly error instead of
   silently failing. */
const WEB3FORMS_ACCESS_KEY = import.meta.env.VITE_WEB3FORMS_KEY || 'YOUR_WEB3FORMS_ACCESS_KEY';
const WEB3FORMS_ENDPOINT = 'https://api.web3forms.com/submit';

/* ===== Apply form (dark island — real Web3Forms submission to HR) ===== */
function ApplyForm() {
  const [status, setStatus] = useState('idle'); // 'idle' | 'submitting' | 'success' | 'error'
  const [errorMsg, setErrorMsg] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    if (status === 'submitting') return;
    const form = e.currentTarget;
    const data = new FormData(form);

    // Honeypot: a filled hidden field means a bot — pretend success, send nothing.
    if (data.get('botcheck')) { setStatus('success'); form.reset(); return; }

    if (!WEB3FORMS_ACCESS_KEY || WEB3FORMS_ACCESS_KEY === 'YOUR_WEB3FORMS_ACCESS_KEY') {
      setStatus('error');
      setErrorMsg("The application form isn't connected yet — add a Web3Forms access key to start sending to HR.");
      return;
    }

    data.append('access_key', WEB3FORMS_ACCESS_KEY);
    data.append('subject', `New application: ${data.get('role') || 'Careers'} — Credence Innovations`);
    data.append('from_name', 'Credence Careers Site');
    if (data.get('email')) data.append('replyto', data.get('email'));

    setStatus('submitting');
    setErrorMsg('');
    try {
      const res = await fetch(WEB3FORMS_ENDPOINT, {
        method: 'POST',
        headers: { Accept: 'application/json' },
        body: data,
      });
      const json = await res.json().catch(() => ({}));
      if (res.ok && json.success) {
        setStatus('success');
        form.reset();
      } else {
        setStatus('error');
        setErrorMsg(json.message || 'Something went wrong sending your application. Please try again.');
      }
    } catch (err) {
      setStatus('error');
      setErrorMsg('Network error — please check your connection and try again.');
    }
  }

  return (
    <section id="apply" data-theme="dark" className="paper pad-lg" style={{ background: 'var(--ink)' }}>
      <div className="shell-narrow">
        {/* heading block slides up — the form + confetti success overlay stay unwrapped */}
        <ScrollReveal from="up" distance={110} className="text-center" style={{ marginBottom: 'clamp(36px, 5vw, 56px)' }}>
          <FadeUp><span className="eyebrow block mb-5">Start the conversation</span></FadeUp>
          <FadeUp delay={0.05}>
            <h2 className="t-display-l" style={{ fontFamily: 'var(--font-display)', color: 'var(--bone)' }}>
              Tell us you're interested.{' '}
              <span className="d-ital" style={{ color: 'var(--electric)' }}>
                We'll take it from there.
              </span>
            </h2>
          </FadeUp>
          <FadeUp delay={0.12}>
            <p className="body-lg measure mx-auto mt-6" style={{ textAlign: 'center' }}>
              No cover letter required. We hire for drive — we train the rest.
            </p>
          </FadeUp>
        </ScrollReveal>

        <FadeUp delay={0.18}>
          <div className="paper-card relative" style={{ padding: 'clamp(20px, 3vw, 36px)', borderRadius: 22 }}>
            <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-6">
              {/* honeypot — hidden from people, catches bots */}
              <input type="checkbox" name="botcheck" tabIndex={-1} autoComplete="off" aria-hidden="true" style={{ display: 'none' }} />

              <label className="block">
                <span className="eyebrow block mb-2" style={{ color: 'var(--smoke)' }}>Full name *</span>
                <input required name="name" autoComplete="name" className="form-input" placeholder="Jordan Reyes" />
              </label>
              <label className="block">
                <span className="eyebrow block mb-2" style={{ color: 'var(--smoke)' }}>Email *</span>
                <input required type="email" name="email" autoComplete="email" className="form-input" placeholder="you@email.com" />
              </label>
              <label className="block">
                <span className="eyebrow block mb-2" style={{ color: 'var(--smoke)' }}>Phone</span>
                <input name="phone" type="tel" autoComplete="tel" className="form-input" placeholder="(555) 000-0000" />
              </label>
              <label className="block">
                <span className="eyebrow block mb-2" style={{ color: 'var(--smoke)' }}>Role of interest *</span>
                <select required name="role" className="form-input" defaultValue="">
                  <option value="" disabled>Select a role</option>
                  {positions.map((p) => <option key={p.title}>{p.title}</option>)}
                  <option>Not sure yet</option>
                </select>
              </label>
              <div className="md:col-span-2">
                <label className="block">
                  <span className="eyebrow block mb-2" style={{ color: 'var(--smoke)' }}>Why Credence? *</span>
                  <textarea required name="message" rows={4} className="form-input resize-none" placeholder="Tell us what drives you…" />
                </label>
              </div>
              <div className="md:col-span-2 flex flex-col sm:flex-row items-start sm:items-center gap-6 mt-2">
                <MagneticButton type="submit" disabled={status === 'submitting'}>
                  {status === 'submitting' ? 'Sending…' : 'Submit Application'}
                </MagneticButton>
                <p className="body-sm" style={{ color: 'var(--smoke)' }}>We review every application personally.</p>
              </div>

              {status === 'error' && (
                <div className="md:col-span-2" role="alert">
                  <p className="body-sm" style={{ color: 'var(--ember)', margin: 0 }}>{errorMsg}</p>
                </div>
              )}
            </form>

            <AnimatePresence>
              {status === 'success' && (
                <motion.div
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="absolute inset-0 flex flex-col items-center justify-center text-center z-20 px-6"
                  style={{ background: 'var(--graphite)', borderRadius: 22, minHeight: 360 }}
                >
                  {CONFETTI.map((c, i) => (
                    <span
                      key={i}
                      style={{
                        position: 'absolute',
                        top: '30%',
                        left: `${c.left}%`,
                        width: 8,
                        height: 8,
                        background: c.color,
                        animation: `confetti-fall ${c.dur}s ease-out ${c.delay}s forwards`,
                      }}
                    />
                  ))}
                  <motion.div initial={{ scale: 0.8, y: 20 }} animate={{ scale: 1, y: 0 }} transition={{ delay: 0.1, ease: [0.2, 0.8, 0.2, 1] }}>
                    <div className="w-16 h-16 mx-auto mb-6 rounded-full flex items-center justify-center" style={{ border: '2px solid var(--electric)' }}>
                      <span style={{ color: 'var(--electric)', fontSize: 28 }}>✓</span>
                    </div>
                    <h3 className="t-display-m mb-4" style={{ fontFamily: 'var(--font-display)', color: 'var(--bone)' }}>Application sent.</h3>
                    <p className="body max-w-md" style={{ color: 'var(--smoke)' }}>It's on its way to our talent team at Credence. We'll reach out within two business days.</p>
                    <button onClick={() => setStatus('idle')} className="mt-8 tab-link" style={{ '--tab': 'var(--electric)' }}>
                      Submit another <span className="arrow" aria-hidden="true">→</span>
                    </button>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </FadeUp>
      </div>
    </section>
  );
}

/* ===== The team, today (cream — editorial stat ledger) =====
   Replaces the flat, dead-space card grid with a framed three-stat ledger:
   a real framing line, then rolling Odometer numerals divided by hairlines,
   each with a line of context so the figures actually mean something. */
const STATS = [
  { label: 'On the team', value: '450+', accent: 'var(--electric)', note: 'Reps, managers, and owners — coast to coast.' },
  { label: 'Cities to work', value: '40+', accent: 'var(--ember)', note: 'Active markets you can transfer into.' },
  { label: 'Years growing', value: '9+', accent: 'var(--electric)', note: 'Profitable, independent, and still expanding.' },
];

function TeamNumbers() {
  return (
    <section className="pad-md paper">
      <div className="shell">
        <ScrollReveal from="up" distance={110}>
          {/* framing line */}
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-5 mb-10 md:mb-12">
            <div>
              <span className="eyebrow block mb-4">The team, today</span>
              <h2 className="t-display-m" style={{ fontFamily: 'var(--font-display)', color: 'var(--bone)', lineHeight: 1.06, maxWidth: '20ch' }}>
                <span className="d-caps">Big enough to deliver.</span>{' '}
                <span className="d-ital" style={{ color: 'var(--electric)' }}>Small enough to know your name.</span>
              </h2>
            </div>
            <span className="font-mono uppercase flex-shrink-0" style={{ fontSize: 11, letterSpacing: '0.16em', color: 'var(--smoke)' }}>
              As of 2026
            </span>
          </div>

          {/* the ledger */}
          <style>{`
            .team-ledger { display: grid; grid-template-columns: 1fr; border-top: 1px solid var(--hair); border-bottom: 1px solid var(--hair); }
            .team-ledger > .tl-cell { padding: 30px 0; border-top: 1px solid var(--hair); }
            .team-ledger > .tl-cell:first-child { border-top: none; }
            @media (min-width: 640px) {
              .team-ledger { grid-template-columns: repeat(3, minmax(0, 1fr)); }
              .team-ledger > .tl-cell { padding: 38px 36px; border-top: none; border-left: 1px solid var(--hair); }
              .team-ledger > .tl-cell:first-child { border-left: none; padding-left: 0; }
              .team-ledger > .tl-cell:last-child { padding-right: 0; }
            }
          `}</style>
          <div className="team-ledger">
            {STATS.map((s) => (
              <div key={s.label} className="tl-cell">
                <div className="font-mono uppercase" style={{ fontSize: 11, letterSpacing: '0.14em', color: 'var(--smoke)', marginBottom: 14 }}>
                  {s.label}
                </div>
                <Odometer
                  value={s.value}
                  className="stat-num"
                  style={{ display: 'block', fontSize: 'clamp(46px, 6vw, 82px)', lineHeight: 0.92, color: s.accent }}
                />
                <span aria-hidden="true" className="block" style={{ width: 42, height: 2, background: s.accent, borderRadius: 2, opacity: 0.85, marginTop: 18, marginBottom: 18 }} />
                <p className="body" style={{ color: 'var(--smoke)', margin: 0, maxWidth: '34ch' }}>
                  {s.note}
                </p>
              </div>
            ))}
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}

export default function Careers() {
  return (
    <>
      <PageHero
        eyebrow="Careers · Now hiring"
        title="Where careers"
        italic="get built."
        mediaSide="left"
        media={
          <figure className="relative w-full" style={{ maxWidth: 440, marginInline: 'auto' }}>
            <div className="relative overflow-hidden" style={{ borderRadius: 18, border: '1px solid var(--hair)', boxShadow: '0 30px 60px -32px rgba(0,0,0,0.7)' }}>
              <img src={CULTURE[1]} alt="Credence team on the road" loading="eager" style={{ display: 'block', width: '100%', aspectRatio: '4 / 5', objectFit: 'cover', filter: 'saturate(0.98) contrast(1.03)' }} />
              <span aria-hidden="true" className="absolute inset-0 pointer-events-none" style={{ background: 'linear-gradient(0deg, rgba(14,22,24,0.4), transparent 45%)' }} />
            </div>
          </figure>
        }
        subhead="Real sales skill, real leadership, real travel — earned on the floor alongside a team that takes you as seriously as the work."
        tint="amber"
        badge={<StampBadge topText="NOW HIRING" bottomText="JOIN THE TEAM" center="2026" color="var(--ember)" size={104} rotate={-9} />}
      >
        <MagneticButton href="#apply">See Open Roles</MagneticButton>
      </PageHero>

      {/* the team in numbers — editorial stat ledger */}
      <TeamNumbers />

      <FolderTabDivider label="Travel Opportunity" tone="electric" fill="var(--ink)" />
      <Travel />

      <WhatYouGain />
      <Positions />

      <FolderTabDivider label="Apply now" tone="ember" fill="var(--ink)" />
      <ApplyForm />
    </>
  );
}
