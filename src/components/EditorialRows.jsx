import { FadeUp } from './AnimatedSection';

/* EditorialRows — a cardless, editorial "index" list that replaces boxy card grids.
   Each item is a hairline-separated row: a numeral, a big display title, and a
   supporting line. The title warms to the brand teal on hover. Calm, staggered
   fade-up entrance. This is the cardless language we use across the site instead of
   tilted drop-shadow cards. */
export default function EditorialRows({ items = [], startAt = 1 }) {
  return (
    <div style={{ borderBottom: '1px solid var(--hair)' }}>
      {items.map((it, i) => (
        <FadeUp key={it.title} delay={i * 0.05}>
          <div
            className="ed-row group grid gap-x-8 gap-y-1.5 py-7 md:py-9 md:grid-cols-[4.5rem_minmax(0,0.95fr)_minmax(0,1.2fr)] md:items-baseline"
            style={{ borderTop: '1px solid var(--hair)' }}
          >
            <span className="stat-num" style={{ fontSize: 'clamp(20px, 2.2vw, 30px)' }}>
              {String(startAt + i).padStart(2, '0')}
            </span>
            <h3 className="t-display-s ed-row-title" style={{ fontFamily: 'var(--font-display)', color: 'var(--bone)', margin: 0, lineHeight: 1.1 }}>
              {it.title}
            </h3>
            <p className="body" style={{ color: 'var(--smoke)', margin: 0, maxWidth: '54ch' }}>
              {it.body}
            </p>
          </div>
        </FadeUp>
      ))}
    </div>
  );
}
