import PageHero from '../components/PageHero';
import SectionHeading from '../components/SectionHeading';
import { FadeUp } from '../components/AnimatedSection';
import FeatureRow from '../components/FeatureRow';
import EditorialFigure from '../components/EditorialFigure';
import ImageStoryTimeline from '../components/ImageStoryTimeline';
import Odometer from '../components/Odometer';
import StampBadge from '../components/StampBadge';
import FolderTabDivider from '../components/FolderTabDivider';
import DrawUnderline from '../components/DrawUnderline';
import MagneticButton from '../components/MagneticButton';
import ScrollReveal from '../components/ScrollReveal';
import { CREW, CULTURE, FIELD, RECOGNITION } from '../data/media';

/* ===== Founder (CREAM · FeatureRow, text right) ===== */
function Founder() {
  return (
    /* Whole founder feature-row slides in from the left as you scroll.
       FeatureRow owns its own internal two-column grid (text via FadeUp /
       visual via ClipReveal), so we wrap the row as one block and keep its
       paper className on the ScrollReveal. */
    <ScrollReveal from="left" distance={120} className="paper">
      <FeatureRow
        side="right"
        eyebrow="The founder"
        heading={
          <h2 className="t-display-l" style={{ color: 'var(--bone)', margin: 0 }}>
            <span className="d-caps">A decade on the floor,</span>{' '}
            <span className="d-ital" style={{ color: 'var(--electric)' }}>
              distilled into one{' '}
              <DrawUnderline color="var(--electric)">playbook</DrawUnderline>.
            </span>
          </h2>
        }
        body="A communications graduate from Eastern Kentucky University, Abby Caudill has spent nearly ten years running face-to-face retail campaigns across telecom, home services, energy, and consumer electronics."
        extra={
          <>
            <p className="body-lg measure" style={{ color: 'var(--smoke)' }}>
              She built Credence Innovations on a single belief: send customers the team you'd want representing your own name.
            </p>
            <blockquote
              className="d-ital"
              style={{
                fontFamily: 'var(--font-display)',
                fontStyle: 'italic',
                fontSize: 'clamp(24px, 3vw, 34px)',
                lineHeight: 1.15,
                color: 'var(--bone)',
                borderLeft: '2px solid var(--electric)',
                paddingLeft: 24,
                margin: '32px 0 0',
              }}
            >
              "Build the team you'd send to your own customers."
              <footer
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: 11,
                  letterSpacing: '0.16em',
                  textTransform: 'uppercase',
                  color: 'var(--smoke)',
                  fontStyle: 'normal',
                  marginTop: 16,
                }}
              >
                — Abby Caudill, Founder
              </footer>
            </blockquote>
          </>
        }
        visual={
          <EditorialFigure
            src="/team/abby-caudill.png"
            label="Founder · Abby Caudill"
            aspect="4/5"
            index={1}
          />
        }
        stamp={
          <StampBadge
            topText="NINE YEARS"
            bottomText="ZERO FAILED"
            center="EST '16"
            color="var(--ember)"
            size={108}
            rotate={-9}
          />
        }
      />
    </ScrollReveal>
  );
}

/* ===== Timeline (ACCENT ISLAND · ScrubTimeline) ===== */
const milestones = [
  { marker: '2016', heading: 'The first floor', body: 'Credence Innovations opens with a single retail campaign and a belief in face-to-face selling.', imageIndex: 0, src: '' },
  { marker: '2018', heading: 'First national client', body: 'A Fortune 500 telecom brand signs on. The model proves it travels.', imageIndex: 1, src: '' },
  { marker: '2020', heading: 'Five-retailer access', body: "Operating partnerships across Walmart, Target, Costco, Lowe's, and BJ's.", imageIndex: 2, src: '' },
  { marker: '2022', heading: 'Owner of the Year', body: 'Industry recognition for performance, culture, and consistency.', imageIndex: 3, src: '' },
  { marker: '2025', heading: 'National Consultant', body: 'Three rookie owners developed in a single year. The bench gets deeper.', imageIndex: 4, src: '' },
  { marker: 'Today', heading: '40+ cities, one standard', body: '211 campaigns, 450+ representatives, 99% population reach, and still growing.', imageIndex: 0, src: '' },
];

function Timeline() {
  return (
    <section className="island-accent pad-md">
      <div className="shell">
        {/* header slides up; the ImageStoryTimeline below owns its own scroll logic */}
        <ScrollReveal from="up" distance={110}>
          <SectionHeading
            eyebrow="The story"
            title="Nine years,"
            titleItalic="written from the floor up."
            align="center"
            maxWidth={760}
          />
        </ScrollReveal>
        <div style={{ marginTop: 'clamp(40px, 5vw, 64px)' }}>
          <ImageStoryTimeline items={milestones} />
        </div>
      </div>
    </section>
  );
}

/* ===== Awards (CREAM · flip cards — mechanic preserved) ===== */
function Awards() {
  const awards = [
    { title: 'Owner of the Year', year: '2022', stampTop: 'OWNER OF', stampBottom: 'THE YEAR', stampCenter: "'22", color: 'var(--ember)', back: 'Recognized for performance, culture, and operational consistency across every market.' },
    { title: 'National Consultant', year: '2025', stampTop: 'NATIONAL', stampBottom: 'CONSULTANT', stampCenter: "'25", color: 'var(--electric)', back: 'Elevated to develop and mentor new owners across the national network.' },
    { title: '3 Rookie Owners', year: 'One year', stampTop: 'ROOKIE', stampBottom: 'OWNERS', stampCenter: '×3', color: 'var(--ember)', back: 'Three first-year owners launched and developed in a single twelve-month span.' },
    { title: 'A+ BBB Rating', year: 'Active', stampTop: 'A+ RATED', stampBottom: 'BBB', stampCenter: 'A+', color: 'var(--electric)', back: 'A standing record of trust with clients, partners, and the communities we serve.' },
  ];
  return (
    <section className="pad-md paper">
      <div className="shell">
        <SectionHeading
          eyebrow="Recognition"
          title="Nine years."
          titleItalic="Zero failed campaigns."
          subhead="Hover any card to read the story behind it."
        />
        <div className="row-scroll grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-2">
          {awards.map((a, i) => (
            /* Cards FAN IN from left/up/right. scaleFrom={1} = slide only, NO
               scale — so the flip-card rotateY hover transform is never disturbed.
               We only wrap the OUTER static container; the flip mechanic lives
               on .flip-card / .flip-card-inner inside and is left intact. */
            <ScrollReveal
              key={a.title}
              from={['left', 'up', 'right'][i % 3]}
              distance={120}
              scaleFrom={1}
            >
              {/* flip mechanic preserved: .flip-card / .flip-card-inner rotateY on hover */}
              <div className="flip-card h-64" data-cursor="expand">
                <div className="flip-card-inner h-full">
                  {/* FRONT — restyled as a warm paper-card with a StampBadge disc */}
                  <div
                    className="flip-card-front paper-card"
                    style={{
                      padding: 28,
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      borderRadius: 18,
                    }}
                  >
                    <StampBadge
                      topText={a.stampTop}
                      bottomText={a.stampBottom}
                      center={a.stampCenter}
                      color={a.color}
                      size={88}
                      rotate={-7}
                    />
                    <div>
                      <h3
                        className="t-display-s"
                        style={{ fontFamily: 'var(--font-display)', color: 'var(--bone)', margin: '0 0 4px' }}
                      >
                        {a.title}
                      </h3>
                      <p
                        style={{
                          fontFamily: "'JetBrains Mono', monospace",
                          fontSize: 10,
                          letterSpacing: '0.16em',
                          textTransform: 'uppercase',
                          color: 'var(--smoke)',
                          margin: 0,
                        }}
                      >
                        {a.year}
                      </p>
                    </div>
                  </div>
                  {/* BACK — dark island reveal */}
                  <div
                    data-theme="dark"
                    className="flip-card-back paper"
                    style={{
                      padding: 28,
                      display: 'flex',
                      alignItems: 'center',
                      background: 'var(--ink)',
                      border: '1px solid var(--electric)',
                      borderRadius: 18,
                    }}
                  >
                    <p className="body" style={{ color: 'var(--bone)', margin: 0 }}>{a.back}</p>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ===== Team culture (CREAM · image-led culture tiles) =====
   Replaces the old "What we stand on" values grid. The culture is shown, not
   told: three real team photos as tactile tiles with an overlay caption (each
   flips to the dark theme so the text reads over the image), with a soft zoom
   on hover. Consistent with the tile language used elsewhere on the site. */
const CULTURE_TILES = [
  { kicker: 'Collaboration', title: 'We win as a team', note: "Only as strong as our weakest link — so we lift each other every day.", img: CULTURE[0], alt: 'Credence team together at a team dinner' },
  { kicker: 'Connection', title: 'Family, on and off the floor', note: 'Team nights, trips, and bonds that outlast any campaign.', img: CULTURE[1], alt: 'Credence team on a retreat by the water' },
  { kicker: 'Recognition', title: 'We celebrate the wins', note: 'Big closes, milestones, promotions — nothing goes unnoticed.', img: CULTURE[2], alt: 'Credence team celebrating together' },
];

function TeamCulture() {
  return (
    <section className="pad-md paper">
      <div className="shell">
        <ScrollReveal from="up" distance={110}>
          <SectionHeading
            eyebrow="Team culture"
            title="We work hard."
            titleItalic="We celebrate harder."
            subhead="The work is face-to-face — and so is the team. This is the culture that keeps people here."
            align="center"
            maxWidth={720}
          />
        </ScrollReveal>

        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-5 lg:gap-6 mt-10 md:mt-12">
          {CULTURE_TILES.map((c, i) => (
            <ScrollReveal key={c.title} from={['left', 'up', 'right'][i % 3]} distance={110}>
              <article
                data-theme="dark"
                className="group relative overflow-hidden h-full"
                style={{ borderRadius: 20, border: '1px solid var(--hair)', boxShadow: '0 34px 64px -38px rgba(0,0,0,0.6)' }}
              >
                <div className="relative overflow-hidden" style={{ aspectRatio: '4 / 5' }}>
                  <img
                    src={c.img}
                    alt={c.alt}
                    loading="lazy"
                    className="absolute inset-0 w-full h-full transition-transform duration-700 ease-out group-hover:scale-[1.06]"
                    style={{ objectFit: 'cover', filter: 'contrast(1.04)' }}
                  />
                  <span
                    aria-hidden="true"
                    className="absolute inset-0 pointer-events-none"
                    style={{ background: 'linear-gradient(0deg, rgba(14,22,24,0.9) 3%, rgba(14,22,24,0.34) 46%, transparent 72%)' }}
                  />
                  <div className="absolute inset-x-0 bottom-0 p-5 lg:p-6">
                    <div className="font-mono uppercase mb-2" style={{ fontSize: 10, letterSpacing: '0.18em', color: 'var(--electric)' }}>{c.kicker}</div>
                    <h3 className="t-display-s" style={{ fontFamily: 'var(--font-display)', color: 'var(--bone)', lineHeight: 1.06, margin: '0 0 8px' }}>{c.title}</h3>
                    <p className="body-sm" style={{ color: 'color-mix(in srgb, var(--bone) 80%, transparent)', margin: 0, maxWidth: '32ch' }}>{c.note}</p>
                  </div>
                </div>
              </article>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ===== Highlights (CREAM · article-style milestone cards) =====
   The "Highlights" from the live aboutus page, presented as four editorial
   cards (photo + category + headline + blurb). Consistent with the site's
   paper-card language; soft image zoom on hover. */
const HIGHLIGHTS = [
  { kicker: 'Growth', title: 'A bigger home base', body: 'Moved into a larger Castleton HQ and scaled hiring around a daily development culture.', img: FIELD[5], alt: 'The Credence team at the office' },
  { kicker: 'Campaigns', title: 'LeafFilter, multiplied', body: 'Expanded the LeafFilter campaign across more stores — and opened energy-sector trials.', img: FIELD[0], alt: 'Credence reps working a campaign' },
  { kicker: 'Culture', title: 'Giving back, in Cancún', body: 'A growing charity program, a team retreat in Cancún, and leaders promoted from within.', img: CULTURE[1], alt: 'Credence team on a retreat' },
  { kicker: 'Expansion', title: 'A+ and expanding', body: 'New markets, national promotions, and an A+ BBB rating across multiple states.', img: RECOGNITION[0], alt: 'Credence recognition and awards' },
];

function Highlights() {
  return (
    <section className="pad-md paper">
      <div className="shell">
        <ScrollReveal from="up" distance={110}>
          <SectionHeading
            eyebrow="Highlights"
            title="Milestones worth"
            titleItalic="marking."
            subhead="A few of the moments that shaped where Credence is today."
            align="center"
            maxWidth={680}
          />
        </ScrollReveal>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 lg:gap-6 mt-10 md:mt-12">
          {HIGHLIGHTS.map((h, i) => (
            <ScrollReveal key={h.title} from={['left', 'up', 'up', 'right'][i] || 'up'} distance={100}>
              <article className="paper-card group h-full overflow-hidden flex flex-col" style={{ borderRadius: 18, padding: 0 }}>
                <div className="relative overflow-hidden" style={{ aspectRatio: '16 / 11' }}>
                  <img
                    src={h.img}
                    alt={h.alt}
                    loading="lazy"
                    className="absolute inset-0 w-full h-full transition-transform duration-700 ease-out group-hover:scale-[1.05]"
                    style={{ objectFit: 'cover', filter: 'contrast(1.03)' }}
                  />
                  <span aria-hidden="true" className="absolute inset-0 pointer-events-none" style={{ background: 'linear-gradient(0deg, rgba(14,22,24,0.28), transparent 55%)' }} />
                </div>
                <div className="flex flex-col gap-2" style={{ padding: 'clamp(18px, 2vw, 24px)' }}>
                  <span className="font-mono uppercase" style={{ fontSize: 10, letterSpacing: '0.16em', color: 'var(--electric)' }}>{h.kicker}</span>
                  <h3 className="t-display-s" style={{ fontFamily: 'var(--font-display)', color: 'var(--bone)', lineHeight: 1.1, margin: 0, fontSize: 'clamp(20px, 1.5vw, 24px)' }}>{h.title}</h3>
                  <p className="body-sm" style={{ color: 'var(--smoke)', margin: 0 }}>{h.body}</p>
                </div>
              </article>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ===== Close (DARK ISLAND · balanced stat ledger + headline + CTAs) =====
   Replaces the lopsided card grid with an even four-stat ledger divided by
   hairlines — rolling Odometer numerals, alternating brand accents — so the
   closing panel reads as deliberate and professional, with no dead space. */
const CLOSE_STATS = [
  { label: 'Years of operation', value: '9+', accent: 'var(--ember)' },
  { label: 'Campaigns executed', value: '211', accent: 'var(--electric)' },
  { label: 'Representatives', value: '450+', accent: 'var(--electric)' },
  { label: 'Cities nationwide', value: '40+', accent: 'var(--ember)' },
];

function Close() {
  return (
    <section data-theme="dark" className="paper pad-lg" style={{ background: 'var(--ink)' }}>
      <div className="shell">
        {/* Closing stat panel slides up into place as the page lands. */}
        <ScrollReveal from="up" distance={110}>
          <style>{`
            .close-ledger { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); border-top: 1px solid var(--hair); border-bottom: 1px solid var(--hair); }
            .close-ledger > .cl-cell { padding: 24px 0; }
            @media (max-width: 767px) {
              .close-ledger > .cl-cell:nth-child(n+3) { border-top: 1px solid var(--hair); }
              .close-ledger > .cl-cell:nth-child(even) { border-left: 1px solid var(--hair); padding-left: clamp(18px, 5vw, 32px); }
            }
            @media (min-width: 768px) {
              .close-ledger { grid-template-columns: repeat(4, minmax(0, 1fr)); }
              .close-ledger > .cl-cell { padding: 6px 34px; border-left: 1px solid var(--hair); }
              .close-ledger > .cl-cell:first-child { border-left: none; padding-left: 0; }
              .close-ledger > .cl-cell:last-child { padding-right: 0; }
            }
          `}</style>
          <div className="close-ledger">
            {CLOSE_STATS.map((s) => (
              <div key={s.label} className="cl-cell">
                <div className="font-mono uppercase" style={{ fontSize: 10, letterSpacing: '0.14em', color: 'var(--smoke)', marginBottom: 12 }}>
                  {s.label}
                </div>
                <Odometer
                  value={s.value}
                  className="stat-num"
                  style={{ display: 'block', fontSize: 'clamp(40px, 5vw, 70px)', lineHeight: 0.92, color: s.accent }}
                />
              </div>
            ))}
          </div>
        </ScrollReveal>

        <div className="text-center" style={{ marginTop: 'clamp(48px, 6vw, 80px)' }}>
          <FadeUp>
            <h2 className="t-display-l" style={{ color: 'var(--bone)', margin: '0 auto', maxWidth: 900 }}>
              <span className="d-caps">The story is still</span>{' '}
              <span className="d-ital" style={{ color: 'var(--electric)' }}>
                being written on the floor.
              </span>
            </h2>
          </FadeUp>
          <FadeUp delay={0.12}>
            <div className="flex flex-col sm:flex-row gap-4 justify-center" style={{ marginTop: 36 }}>
              <MagneticButton to="/team">Meet the team</MagneticButton>
              <MagneticButton variant="outline" to="/contact">Partner with us</MagneticButton>
            </div>
          </FadeUp>
        </div>
      </div>
    </section>
  );
}

export default function About() {
  return (
    <>
      <PageHero
        eyebrow="About Credence"
        title="Built on the floor."
        italic="Proven, market by market."
        media={
          <figure className="relative w-full" style={{ maxWidth: 440, marginInline: 'auto' }}>
            <div className="relative overflow-hidden" style={{ borderRadius: 18, border: '1px solid var(--hair)', boxShadow: '0 30px 60px -32px rgba(0,0,0,0.7)' }}>
              <img src={CREW[0]} alt="The Credence team" loading="eager" style={{ display: 'block', width: '100%', aspectRatio: '4 / 5', objectFit: 'cover', filter: 'saturate(0.98) contrast(1.03)' }} />
              <span aria-hidden="true" className="absolute inset-0 pointer-events-none" style={{ background: 'linear-gradient(0deg, rgba(14,22,24,0.4), transparent 45%)' }} />
            </div>
          </figure>
        }
        subhead="We started with one campaign and one conviction — that the best marketing still happens face-to-face. Nine years later, that conviction reaches 99% of the country."
        tint="amber"
        badge={
          <StampBadge
            topText="ESTABLISHED"
            bottomText="CREDENCE"
            center="EST 2016"
            color="var(--ember)"
            size={104}
            rotate={-7}
          />
        }
      />
      <Founder />
      <FolderTabDivider label="The story" tone="electric" fill="var(--ink)" />
      <Timeline />
      <FolderTabDivider label="Recognition" tone="ember" fill="var(--ink)" />
      <Awards />
      <FolderTabDivider label="Team culture" tone="electric" fill="var(--ink)" />
      <TeamCulture />
      <FolderTabDivider label="Highlights" tone="ember" fill="var(--ink)" />
      <Highlights />
      <FolderTabDivider label="The story is still being written" tone="electric" fill="var(--ink)" />
      <Close />
    </>
  );
}
