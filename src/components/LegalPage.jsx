import { useEffect } from 'react';
import { FadeUp } from './AnimatedSection';

/* Shared legal/policy page — on-brand (Fraunces display, paper, brand tokens),
   with an editorial header, an optional sticky table of contents, and clean
   prose. Used by Privacy Policy and Terms & Conditions. */
const slugify = (h) => h.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

export default function LegalPage({ eyebrow = 'Legal', title, italic, updated, intro, sections = [] }) {
  useEffect(() => {
    if (window.__lenis) window.__lenis.scrollTo(0, { immediate: true });
    window.scrollTo(0, 0);
    document.title = `${title} · Credence Innovations`;
    return () => { document.title = 'Credence Innovations'; };
  }, [title]);

  const headed = sections.filter((s) => s.heading);
  const hasToc = headed.length > 2;
  const jump = (e, id) => {
    e.preventDefault();
    if (window.__lenis) window.__lenis.scrollTo(`#${id}`, { offset: -96, duration: 1 });
    else document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <article className="paper relative overflow-hidden" style={{ paddingTop: 'clamp(112px, 15vh, 184px)', paddingBottom: 'clamp(56px, 8vh, 104px)' }}>
      {/* ambient header glow */}
      <div aria-hidden="true" className="pointer-events-none absolute" style={{
        width: 'min(70vw, 860px)', height: 'min(46vw, 560px)', left: '-6%', top: '-8%',
        background: 'radial-gradient(circle, color-mix(in srgb, var(--electric) 14%, transparent), transparent 64%)', filter: 'blur(60px)',
      }} />

      <div className="shell relative">
        {/* ── header ── */}
        <FadeUp><span className="eyebrow block mb-5">{eyebrow}</span></FadeUp>
        <FadeUp delay={0.05}>
          <h1 className="t-display-l" style={{ color: 'var(--bone)', lineHeight: 1.04, maxWidth: '20ch' }}>
            <span className="d-caps">{title}</span>
            {italic && <> <span className="d-ital" style={{ color: 'var(--electric)' }}>{italic}</span></>}
          </h1>
        </FadeUp>
        {(updated || intro) && (
          <FadeUp delay={0.1}>
            {updated && <p className="font-mono mt-5" style={{ fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--ember)' }}>{updated}</p>}
            {intro && <p className="body-lg mt-5" style={{ color: 'var(--smoke)', maxWidth: '60ch' }}>{intro}</p>}
          </FadeUp>
        )}

        <div className="mt-10 md:mt-14" style={{ borderTop: '1px solid var(--hair)' }} />

        {/* ── body ── */}
        <div className={hasToc ? 'mt-10 md:mt-14 grid lg:grid-cols-[minmax(0,210px)_minmax(0,1fr)] gap-10 lg:gap-16 items-start' : 'mt-10 md:mt-14'}>
          {hasToc && (
            <nav className="hidden lg:block lg:sticky lg:top-28" aria-label="On this page">
              <p className="font-mono mb-4" style={{ fontSize: 10, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--smoke)' }}>On this page</p>
              <ul className="flex flex-col gap-2.5">
                {headed.map((s) => (
                  <li key={s.heading}>
                    <a href={`#${slugify(s.heading)}`} onClick={(e) => jump(e, slugify(s.heading))}
                      className="anim-link block" style={{ fontSize: 13, color: 'var(--smoke)', lineHeight: 1.3 }}>
                      {s.heading}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          )}

          <div style={hasToc ? undefined : { maxWidth: '72ch' }}>
            {sections.map((s, i) => (
              <section key={i} id={s.heading ? slugify(s.heading) : undefined} style={{ scrollMarginTop: 96, marginBottom: 'clamp(28px, 4vw, 44px)' }}>
                {s.heading && (
                  <FadeUp>
                    <h2 className="t-display-s" style={{ fontFamily: 'var(--font-display)', color: 'var(--bone)', lineHeight: 1.12, marginBottom: 14 }}>{s.heading}</h2>
                  </FadeUp>
                )}
                {s.paragraphs?.map((para, j) => (
                  <FadeUp key={j} delay={0.02 * j}>
                    <p className="body-lg" style={{ color: 'var(--smoke)', marginTop: j === 0 ? 0 : 16 }}>{para}</p>
                  </FadeUp>
                ))}
                {s.defs && (
                  <FadeUp>
                    <dl className="mt-2" style={{ borderTop: '1px solid var(--hair)' }}>
                      {s.defs.map((d) => (
                        <div key={d.term} className="grid sm:grid-cols-[minmax(0,0.4fr)_minmax(0,1fr)] gap-x-6 gap-y-1 py-4" style={{ borderBottom: '1px solid var(--hair)' }}>
                          <dt className="font-mono" style={{ fontSize: 11, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--electric)' }}>{d.term}</dt>
                          <dd className="body" style={{ color: 'var(--bone)', margin: 0 }}>{d.def}</dd>
                        </div>
                      ))}
                    </dl>
                  </FadeUp>
                )}
              </section>
            ))}
          </div>
        </div>
      </div>
    </article>
  );
}
