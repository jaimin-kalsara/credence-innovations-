import { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FadeUp } from '../components/AnimatedSection';
import { getMember, TEAM } from '../data/team';

/* Individual candidate profile — one page per team member at /team/:slug. */
export default function TeamMember() {
  const { slug } = useParams();
  const member = getMember(slug);

  useEffect(() => {
    if (window.__lenis) window.__lenis.scrollTo(0, { immediate: true });
    window.scrollTo(0, 0);
    if (member) document.title = `${member.name} · Credence Innovations`;
    return () => { document.title = 'Credence Innovations'; };
  }, [slug, member]);

  if (!member) {
    return (
      <section className="paper" style={{ paddingTop: 'clamp(120px, 16vh, 200px)', paddingBottom: 'clamp(80px, 12vh, 140px)' }}>
        <div className="shell-narrow text-center">
          <h1 className="t-display-l" style={{ fontFamily: 'var(--font-display)', color: 'var(--bone)' }}>Profile not found.</h1>
          <Link to="/team" className="tab-link mt-8 inline-flex" style={{ ['--tab']: 'var(--ember)' }}>
            Back to the team <span className="arrow">→</span>
          </Link>
        </div>
      </section>
    );
  }

  const idx = TEAM.findIndex((m) => m.slug === slug);
  const next = TEAM[(idx + 1) % TEAM.length];

  return (
    <article className="paper" style={{ paddingTop: 'clamp(96px, 13vh, 168px)' }}>
      <div className="shell">
        <Link to="/team" className="anim-link inline-flex items-center gap-2 font-mono text-[11px] tracking-[0.16em] uppercase" style={{ color: 'var(--smoke)' }}>
          <span aria-hidden="true">←</span> Back to the team
        </Link>

        <div className="grid lg:grid-cols-[0.82fr_1.18fr] gap-12 lg:gap-20 items-start mt-8 lg:mt-12">
          {/* portrait */}
          <FadeUp className="lg:sticky lg:top-24">
            <figure style={{ margin: 0 }}>
              <div className="relative overflow-hidden" style={{ borderRadius: 20, border: '1px solid var(--hair)', background: 'var(--graphite)' }}>
                <img
                  src={member.photo}
                  alt={`${member.name}, ${member.role} at Credence Innovations`}
                  className="w-full"
                  style={{ display: 'block', aspectRatio: '4 / 5', objectFit: 'cover' }}
                  loading="eager"
                />
              </div>
              {member.tagline && (
                <figcaption className="body-sm mt-4" style={{ color: 'var(--smoke)', fontStyle: 'italic', fontFamily: 'var(--font-display)', fontSize: 'clamp(15px,1.5vw,18px)' }}>
                  {member.tagline}
                </figcaption>
              )}
            </figure>
          </FadeUp>

          {/* details */}
          <div>
            <FadeUp>
              <p className="font-mono text-[11px] tracking-[0.2em] uppercase mb-4" style={{ color: 'var(--ember)' }}>{member.role}</p>
              <h1 className="t-display-l" style={{ fontFamily: 'var(--font-display)', color: 'var(--bone)', lineHeight: 1.02, margin: 0 }}>{member.name}</h1>
            </FadeUp>
            <FadeUp delay={0.08}>
              <p className="body-lg mt-7" style={{ color: 'var(--smoke)', maxWidth: '58ch' }}>{member.bio}</p>
            </FadeUp>

            {member.awards?.length > 0 && (
              <FadeUp delay={0.1}>
                <div className="mt-9">
                  <p className="font-mono text-[10.5px] tracking-[0.16em] uppercase mb-4" style={{ color: 'var(--ember)' }}>Recognition</p>
                  <ul className="grid sm:grid-cols-2 gap-x-8 gap-y-3.5">
                    {member.awards.map((a) => (
                      <li key={a} className="flex items-start gap-3">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--ember)" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className="shrink-0" style={{ marginTop: 2 }} aria-hidden="true">
                          <circle cx="12" cy="9" r="5" /><path d="M8.5 13.4 L7 21 l5-2.6 5 2.6 -1.5-7.6" />
                        </svg>
                        <span className="body" style={{ color: 'var(--bone)', lineHeight: 1.35 }}>{a}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </FadeUp>
            )}

            <div className="mt-10" style={{ borderTop: '1px solid var(--hair)' }}>
              {member.facts.map((f, i) => (
                <FadeUp key={f.label} delay={0.03 * i}>
                  <div className="grid md:grid-cols-[minmax(0,0.5fr)_minmax(0,1fr)] gap-x-8 gap-y-1 py-5" style={{ borderBottom: '1px solid var(--hair)' }}>
                    <p className="font-mono text-[10.5px] tracking-[0.14em] uppercase" style={{ color: 'var(--smoke)', margin: 0 }}>{f.label}</p>
                    <p className="body" style={{ color: 'var(--bone)', margin: 0 }}>{f.value}</p>
                  </div>
                </FadeUp>
              ))}
            </div>

            <FadeUp delay={0.1}>
              <div className="mt-9 flex flex-wrap items-center gap-x-8 gap-y-4">
                {member.social && (
                  <a href={member.social.url} target="_blank" rel="noopener noreferrer" className="tab-link" style={{ ['--tab']: 'var(--electric)' }}>
                    {member.social.label} <span className="arrow">→</span>
                  </a>
                )}
                <Link to="/careers" className="tab-link" style={{ ['--tab']: 'var(--ember)' }}>
                  Join the team <span className="arrow">→</span>
                </Link>
              </div>
            </FadeUp>
          </div>
        </div>

        {/* next teammate */}
        <div className="mt-16 lg:mt-24" style={{ borderTop: '1px solid var(--hair)', paddingTop: 'clamp(26px, 4vw, 46px)', paddingBottom: 'clamp(40px, 6vw, 80px)' }}>
          <Link to={`/team/${next.slug}`} className="group flex items-center justify-between gap-6">
            <div>
              <p className="font-mono text-[10px] tracking-[0.2em] uppercase mb-2" style={{ color: 'var(--smoke)' }}>Next</p>
              <h3 className="t-display-s" style={{ fontFamily: 'var(--font-display)', color: 'var(--bone)', margin: 0 }}>{next.name}</h3>
              <p className="font-mono text-[10px] tracking-[0.16em] uppercase mt-1.5" style={{ color: 'var(--electric)' }}>{next.role}</p>
            </div>
            <span aria-hidden="true" className="text-2xl transition-transform duration-300 group-hover:translate-x-1.5" style={{ color: 'var(--electric)' }}>→</span>
          </Link>
        </div>
      </div>
    </article>
  );
}
