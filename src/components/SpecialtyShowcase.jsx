import { Link } from 'react-router-dom';
import { FadeUp } from './AnimatedSection';
import { FIELD, PEOPLE } from '../data/media';

/* ============================================================
   OUR SPECIALTY — an image showcase.

   The abstract map animation is gone: each specialty is now shown with a
   real photo of the work, so the meaning is immediate and the section
   reads with energy (real reps, real floors). Minimal header, four bold
   image cards that zoom and lift on hover, each linking to the full model.
   ============================================================ */

const SPECIALTIES = [
  { word: 'New market entry', line: 'Into a city that has never seen you.', photo: FIELD[2] },
  { word: 'Retail activation', line: 'Trained reps, live on the store floor.', photo: FIELD[8] },
  { word: 'Product launches', line: 'Demo and trial, right at the aisle.', photo: PEOPLE[0] },
  { word: 'Service expansion', line: 'New regions for home, energy & telecom.', photo: FIELD[12] },
];

export default function SpecialtyShowcase() {
  return (
    <section className="pad-md paper relative overflow-hidden">
      {/* high-energy ambient lighting */}
      <div aria-hidden="true" className="pointer-events-none absolute" style={{
        width: 'min(54vw, 680px)', height: 'min(54vw, 680px)', right: '-8%', top: '4%',
        background: 'radial-gradient(circle, color-mix(in srgb, var(--electric) 16%, transparent), transparent 64%)', filter: 'blur(72px)',
      }} />
      <div aria-hidden="true" className="pointer-events-none absolute" style={{
        width: 'min(46vw, 580px)', height: 'min(46vw, 580px)', left: '-8%', bottom: '0%',
        background: 'radial-gradient(circle, color-mix(in srgb, var(--ember) 14%, transparent), transparent 64%)', filter: 'blur(78px)',
      }} />

      <div className="shell relative">
        {/* ── minimal header ── */}
        <div className="flex flex-wrap items-end justify-between gap-x-10 gap-y-4 mb-10 md:mb-14">
          <div>
            <FadeUp><span className="eyebrow block mb-5">Our specialty</span></FadeUp>
            <FadeUp delay={0.05}>
              <h2 className="t-display-l" style={{ fontFamily: 'var(--font-display)', color: 'var(--bone)', maxWidth: '16ch' }}>
                We open the markets{' '}
                <span className="d-ital" style={{ color: 'var(--electric)' }}>you&apos;ve never reached.</span>
              </h2>
            </FadeUp>
          </div>
          <FadeUp delay={0.1}>
            <Link to="/what-we-do" className="tab-link" style={{ ['--tab']: 'var(--ember)' }}>
              See the full model <span className="arrow">→</span>
            </Link>
          </FadeUp>
        </div>

        {/* ── image cards ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-5">
          {SPECIALTIES.map((s, i) => (
            <FadeUp key={s.word} delay={0.06 * i}>
              <Link to="/what-we-do" className="spec-card" data-cursor="expand" aria-label={`${s.word}. ${s.line}`}>
                <div className="spec-media" style={{ aspectRatio: '4 / 5' }}>
                  <img src={s.photo} alt={s.word} loading="lazy" className="spec-img" />
                  <span className="spec-grad" aria-hidden="true" />
                  {/* number */}
                  <span className="font-mono absolute" style={{ top: 14, left: 14, fontSize: 11, letterSpacing: '0.18em', color: 'rgba(244,241,234,0.85)' }}>
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  {/* title + reveal line */}
                  <div className="absolute left-0 right-0 bottom-0" style={{ padding: 'clamp(14px, 1.6vw, 22px)' }}>
                    <div className="flex items-center justify-between gap-2">
                      <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 600, color: '#F4F1EA', fontSize: 'clamp(17px, 1.7vw, 23px)', lineHeight: 1.12, margin: 0 }}>{s.word}</h3>
                      <span className="spec-arrow shrink-0" aria-hidden="true" style={{ fontSize: 18 }}>→</span>
                    </div>
                    <p className="spec-line body-sm overflow-hidden" style={{ marginTop: 6 }}>{s.line}</p>
                  </div>
                  <span className="spec-accent" aria-hidden="true" />
                </div>
              </Link>
            </FadeUp>
          ))}
        </div>
      </div>
    </section>
  );
}
