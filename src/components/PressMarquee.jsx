import BrandLogo from './BrandLogo';

/* Archetype G — infinite brand/logo ticker.
   A quiet mono label sits at the left of a band; the brands scroll as an
   edge-masked CSS marquee. This is the ONE allowed perpetual loop (a pure
   CSS ticker via .marquee-track / @keyframes marquee in index.css).

   Items may be plain strings (rendered as display-type names) OR
   { name, logo } objects (rendered as <BrandLogo> plates) — so the same
   ticker works as a name strip or a real logo wall.

   Accessibility: the scrolling strip is aria-hidden and duplicated for the
   seamless loop; a real, visually-hidden <ul> carries the names for AT.
   Pause-on-hover is handled by .marquee-wrap:hover in index.css. Under
   prefers-reduced-motion the global rule in index.css collapses the
   animation duration, so the strip effectively freezes (no JS needed). */

const srOnly = {
  position: 'absolute',
  width: '1px',
  height: '1px',
  padding: 0,
  margin: '-1px',
  overflow: 'hidden',
  clip: 'rect(0, 0, 0, 0)',
  whiteSpace: 'nowrap',
  border: 0,
};

const nameOf = (it) => (it && typeof it === 'object' ? it.name : it);

export default function PressMarquee({
  label = 'Brands we represent',
  items = [],
  speed = 28,
  className = '',
  style,
  ...rest
}) {
  // Render twice so translateX(-50%) wraps seamlessly.
  const doubled = [...items, ...items];

  return (
    <section
      className={`pad-sm ${className}`.trim()}
      aria-label={label}
      style={style}
      {...rest}
    >
      <div className="shell">
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'clamp(16px, 4vw, 48px)',
            flexWrap: 'wrap',
          }}
        >
          {/* Left mono kicker — fixed, doesn't scroll */}
          <span
            className="eyebrow"
            style={{ flex: '0 0 auto', color: 'var(--smoke)' }}
          >
            {label}
          </span>

          {/* The scrolling strip (decorative duplicate). */}
          <div
            className="marquee-wrap"
            style={{ flex: '1 1 320px', minWidth: 0, overflow: 'hidden' }}
            aria-hidden="true"
          >
            <div
              className="marquee-track"
              style={{ animationDuration: `${speed}s`, alignItems: 'center' }}
            >
              {doubled.map((item, i) => {
                const isObj = item && typeof item === 'object';
                return (
                  <span
                    key={i}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.9em',
                      paddingInline: isObj ? '0.7rem' : '1.4rem',
                    }}
                  >
                    {isObj ? (
                      <BrandLogo name={item.name} logo={item.logo} height={26} className="brand-plate--sm" />
                    ) : (
                      <>
                        <span
                          style={{
                            fontFamily: 'var(--font-display)',
                            fontSize: 'clamp(1.05rem, 1.6vw, 1.45rem)',
                            fontWeight: 600,
                            lineHeight: 1,
                            color: 'var(--bone)',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {item}
                        </span>
                        {/* separator dot in the brand accent */}
                        <span
                          aria-hidden="true"
                          style={{
                            display: 'inline-block',
                            width: '5px',
                            height: '5px',
                            borderRadius: '50%',
                            background: 'var(--electric)',
                            opacity: 0.7,
                          }}
                        />
                      </>
                    )}
                  </span>
                );
              })}
            </div>
          </div>
        </div>

        {/* Real, accessible list of the names (visually hidden). */}
        <ul style={srOnly}>
          {items.map((item, i) => (
            <li key={i}>{nameOf(item)}</li>
          ))}
        </ul>
      </div>
    </section>
  );
}
