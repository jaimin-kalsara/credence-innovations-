import { Link } from 'react-router-dom';
import FloatingCards from './FloatingCards';
import { ClipReveal } from './AnimatedSection';
import { FadeUp } from './AnimatedSection';

/* AccentIsland (Archetype C) — a soft teal accent island with a centered
   editorial header above a relative "stage". The stage's visual (a product-UI
   mock / USMap / CinematicImage / EditorialFigure) is wiped in with ClipReveal,
   and FloatingCards overlays scroll-drifting StatCards at corner anchors on lg+,
   falling back to a grid on mobile. All reveal/motion + reduced-motion handling
   lives in the composed primitives — this component is pure layout. */

export default function AccentIsland({
  eyebrow,
  heading,
  subhead,
  link,
  visual,
  cards = [],
  className = '',
  style = {},
  ...rest
}) {
  return (
    <section className={`island-accent pad-md ${className}`} style={style} {...rest}>
      <div className="shell">
        {/* Centered editorial header. */}
        <FadeUp>
          <div style={{ textAlign: 'center', maxWidth: '40ch', margin: '0 auto' }}>
            {eyebrow && (
              <div className="eyebrow" style={{ marginBottom: 14 }}>
                {eyebrow}
              </div>
            )}

            {heading && (
              <h2
                className="t-display-l"
                style={{ margin: 0, color: 'var(--bone)' }}
              >
                {heading}
              </h2>
            )}

            {subhead && (
              <p className="body-lg" style={{ margin: '16px auto 0', maxWidth: '52ch', color: 'var(--smoke)' }}>
                {subhead}
              </p>
            )}

            {link?.to && link?.label && (
              <div
                style={{
                  marginTop: 22,
                  display: 'flex',
                  justifyContent: 'center',
                }}
              >
                <Link
                  to={link.to}
                  className="tab-link"
                  style={{ '--tab': 'var(--electric)' }}
                >
                  {link.label}
                  <span className="arrow" aria-hidden="true">→</span>
                </Link>
              </div>
            )}
          </div>
        </FadeUp>

        {/* Relative stage: floating stat cards over the clip-revealed visual. */}
        <div style={{ marginTop: 'clamp(40px, 6vw, 72px)' }}>
          <FloatingCards cards={cards}>
            <ClipReveal>{visual}</ClipReveal>
          </FloatingCards>
        </div>
      </div>
    </section>
  );
}
