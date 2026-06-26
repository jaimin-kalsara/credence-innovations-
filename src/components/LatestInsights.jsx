import { motion, useReducedMotion } from 'framer-motion';
import { FadeUp } from './AnimatedSection';
import MagneticButton from './MagneticButton';

/* LatestInsights — a premium, editorial "Latest Insights" showcase of the three
   most recent posts from the company blog (credenceinnovations.org/blog). Each
   card is one external link (new tab) to the full article: featured image →
   category badge + reading time → date → title → excerpt → "Read article".
   Scroll-staggered entrance, refined hover (image zoom, lift, shadow bloom,
   accent border + title/arrow shift). Reduced-motion → static.

   NOTE: the three latest live posts are text-only (no dedicated featured image),
   so each card is paired with a representative brand culture photo. Swap the
   `image` field per post if a true hero image becomes available. */

const POSTS = [
  {
    title: 'Building Something Bigger in the Heart of Indianapolis',
    url: 'https://www.credenceinnovations.org/post/building-something-bigger-in-the-heart-of-indianapolis',
    date: 'Oct 29, 2025',
    category: 'Company',
    read: '3 min read',
    accent: 'var(--electric)',
    image: '/media/credencecrew1.jpg',
    excerpt:
      "It's not just a business in Indianapolis — it's a business built by Indianapolis. How a single local office grew into a marketing firm with national reach.",
  },
  {
    title: 'Why Real Results Speak Louder Than Rumors',
    url: 'https://www.credenceinnovations.org/post/why-real-results-speak-louder-than-rumors',
    date: 'Oct 28, 2025',
    category: 'Insights',
    read: '3 min read',
    accent: 'var(--ember)',
    image: '/media/briteam2.jpg',
    excerpt:
      "The faster a company grows, the louder the noise gets — but results don't lie. A look at the real Fortune 50 and Fortune 500 partnerships behind the work.",
  },
  {
    title: 'A Business Built on Real Partnerships and Real Work',
    url: 'https://www.credenceinnovations.org/post/a-business-built-on-real-partnerships-and-real-work',
    date: 'Oct 28, 2025',
    category: 'Culture',
    read: '2 min read',
    accent: 'var(--electric)',
    image: '/media/baylenarondeep.jpg',
    excerpt:
      'Performance-based growth — no smoke and mirrors, no empty titles. A closer look at the structure that actually drives the company forward.',
  },
];

const EXPO = [0.16, 1, 0.3, 1];

export default function LatestInsights() {
  const reduce = useReducedMotion();

  return (
    <section className="li-section paper relative overflow-hidden pad-lg" aria-labelledby="insights-heading">
      <style>{`
        .li-grid { display: grid; grid-template-columns: 1fr; gap: clamp(20px, 2.4vw, 30px); }
        .li-cell { display: flex; }
        @media (min-width: 640px) and (max-width: 1023px) {
          .li-grid { grid-template-columns: repeat(2, 1fr); }
          .li-cell:nth-child(3) { grid-column: 1 / -1; justify-self: center; width: min(100%, calc(50% - 15px)); }
        }
        @media (min-width: 1024px) { .li-grid { grid-template-columns: repeat(3, 1fr); } }

        .li-card { position: relative; display: flex; flex-direction: column; width: 100%; height: 100%;
          text-decoration: none; border: 1px solid var(--hair); border-radius: 20px; overflow: hidden;
          background: var(--graphite); cursor: none;
          box-shadow: 0 1px 0 rgba(255,255,255,0.04) inset, 0 22px 50px -34px var(--shadow-card);
          transition: transform .45s var(--ease-out-quart), box-shadow .45s ease, border-color .4s ease; }
        .li-card:hover { transform: translateY(-6px);
          border-color: color-mix(in srgb, var(--c-accent) 46%, var(--hair));
          box-shadow: 0 1px 0 rgba(255,255,255,0.05) inset, 0 40px 82px -38px var(--shadow-card); }
        .li-card:focus-visible { outline: 2px solid var(--c-accent); outline-offset: 3px; }
        /* top accent hairline that draws in on hover */
        .li-card::after { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 2px; transform: scaleX(0);
          transform-origin: left; background: var(--c-accent); opacity: .85; z-index: 3;
          transition: transform .5s var(--ease-out-quart); }
        .li-card:hover::after { transform: scaleX(1); }

        .li-media { position: relative; aspect-ratio: 16 / 10; overflow: hidden; background: var(--ink); }
        .li-media img { width: 100%; height: 100%; object-fit: cover; object-position: center; display: block;
          filter: saturate(1.02) contrast(1.02); transition: transform .8s var(--ease-out-quart); }
        .li-card:hover .li-media img { transform: scale(1.06); }
        .li-scrim { position: absolute; inset: 0; pointer-events: none;
          background: linear-gradient(to top, rgba(8,11,12,0.55), rgba(8,11,12,0.05) 42%, transparent 60%); }

        .li-badge { position: absolute; top: 13px; left: 13px; display: inline-flex; align-items: center; gap: 6px;
          font-family: 'JetBrains Mono', monospace; font-size: 9.5px; letter-spacing: 0.16em; text-transform: uppercase;
          color: #F4F1EA; background: rgba(10,14,15,0.42); border: 1px solid rgba(243,238,226,0.20);
          padding: 5px 11px; border-radius: 999px; backdrop-filter: blur(6px); -webkit-backdrop-filter: blur(6px); }
        .li-badge .dot { width: 5px; height: 5px; border-radius: 999px; background: var(--c-accent); }
        .li-read { position: absolute; top: 13px; right: 13px; font-family: 'JetBrains Mono', monospace; font-size: 9.5px;
          letter-spacing: 0.12em; color: #F4F1EA; background: rgba(10,14,15,0.42); border: 1px solid rgba(243,238,226,0.18);
          padding: 5px 10px; border-radius: 999px; backdrop-filter: blur(6px); -webkit-backdrop-filter: blur(6px); }

        .li-body { display: flex; flex-direction: column; flex: 1; padding: clamp(18px, 1.9vw, 26px); }
        .li-date { font-family: 'JetBrains Mono', monospace; font-size: 10px; letter-spacing: 0.16em; text-transform: uppercase;
          color: var(--ember); }
        .li-title { font-family: var(--font-display); color: var(--bone); font-size: clamp(19px, 1.5vw, 23px); line-height: 1.18;
          letter-spacing: -0.01em; margin-top: 12px; transition: color .3s ease; }
        .li-card:hover .li-title { color: var(--c-accent); }
        .li-excerpt { color: var(--smoke); font-size: 14px; line-height: 1.6; margin-top: 13px;
          display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden; }
        .li-foot { display: flex; align-items: center; gap: 8px; margin-top: auto; padding-top: clamp(16px, 1.8vw, 22px); }
        .li-read-more { display: inline-flex; align-items: center; gap: 8px; font-family: 'JetBrains Mono', monospace;
          font-size: 10px; letter-spacing: 0.16em; text-transform: uppercase; color: var(--bone); transition: color .3s ease; }
        .li-card:hover .li-read-more { color: var(--c-accent); }
        .li-read-more .material-symbols-rounded { font-size: 18px; transition: transform .35s var(--ease-out-quart); }
        .li-card:hover .li-read-more .material-symbols-rounded { transform: translateX(4px); }
        /* hairline above the footer for a clean editorial divide */
        .li-divider { height: 1px; background: var(--hair); margin-top: clamp(16px, 1.8vw, 22px); }

        @media (prefers-reduced-motion: reduce) {
          .li-card, .li-media img, .li-card::after, .li-read-more .material-symbols-rounded { transition: none; }
          .li-card:hover { transform: none; }
          .li-card:hover .li-media img { transform: none; }
          .li-card:hover::after { transform: scaleX(1); }
        }

        /* MOBILE — horizontal snap carousel (≤640px only; desktop grid untouched) */
        @media (max-width: 640px) {
          .li-grid { display: flex; flex-wrap: nowrap; overflow-x: auto; overflow-y: visible;
            scroll-snap-type: x mandatory; -webkit-overflow-scrolling: touch; gap: 14px;
            scroll-padding-inline: 0; padding-bottom: 12px; max-width: 100%;
            -ms-overflow-style: none; scrollbar-width: none; }
          .li-grid::-webkit-scrollbar { display: none; }
          .li-cell { flex: 0 0 84%; scroll-snap-align: start; min-width: 0; margin-top: 0 !important; }
        }
      `}</style>

      {/* soft ambient depth */}
      <div aria-hidden="true" className="pointer-events-none absolute" style={{
        width: 'min(52vw, 660px)', height: 'min(40vw, 480px)', left: '50%', top: '4%', transform: 'translateX(-50%)',
        background: 'radial-gradient(circle, color-mix(in srgb, var(--electric) 11%, transparent), transparent 66%)', filter: 'blur(86px)',
      }} />

      <div className="shell relative">
        {/* heading */}
        <div className="text-center" style={{ maxWidth: 740, marginInline: 'auto' }}>
          <FadeUp>
            <div className="flex justify-center"><span className="eyebrow">Latest insights</span></div>
          </FadeUp>
          <FadeUp delay={0.05}>
            <h2 id="insights-heading" className="t-display-l mt-4" style={{ fontFamily: 'var(--font-display)', color: 'var(--bone)' }}>
              <span className="d-caps">Ideas, insights &amp;</span>{' '}
              <span className="d-ital" style={{ color: 'var(--electric)' }}>industry updates.</span>
            </h2>
          </FadeUp>
          <FadeUp delay={0.1}>
            <p className="body-lg mt-5" style={{ color: 'var(--smoke)', maxWidth: '58ch', marginInline: 'auto' }}>
              Expert advice, company news, and practical insights that help brands grow — with a closer look at
              the culture and expertise behind the work.
            </p>
          </FadeUp>
        </div>

        {/* cards */}
        <div className="li-grid" style={{ marginTop: 'clamp(36px, 4.5vw, 60px)' }}>
          {POSTS.map((p, i) => (
            <motion.div
              key={p.url}
              className="li-cell"
              initial={reduce ? { opacity: 0 } : { opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-70px' }}
              transition={{ duration: 0.6, delay: reduce ? 0 : 0.12 + i * 0.1, ease: EXPO }}
            >
              <article style={{ display: 'flex', width: '100%' }}>
                <a
                  className="li-card"
                  style={{ '--c-accent': p.accent }}
                  href={p.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-cursor="expand"
                  aria-label={`Read the article: ${p.title} (opens in a new tab)`}
                >
                  <div className="li-media">
                    <img src={p.image} alt={`Credence Innovations — ${p.title}`} loading="lazy" decoding="async" draggable="false" />
                    <span className="li-scrim" aria-hidden="true" />
                    <span className="li-badge"><span className="dot" aria-hidden="true" />{p.category}</span>
                    <span className="li-read">{p.read}</span>
                  </div>
                  <div className="li-body">
                    <span className="li-date">{p.date}</span>
                    <h3 className="li-title">{p.title}</h3>
                    <p className="li-excerpt">{p.excerpt}</p>
                    <div className="li-divider" aria-hidden="true" />
                    <div className="li-foot">
                      <span className="li-read-more">
                        Read article
                        <span className="material-symbols-rounded" aria-hidden="true">arrow_forward</span>
                      </span>
                    </div>
                  </div>
                </a>
              </article>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <FadeUp delay={0.2}>
          <div className="flex justify-center" style={{ marginTop: 'clamp(34px, 4vw, 52px)' }}>
            <MagneticButton href="https://www.credenceinnovations.org/blog" target="_blank" variant="outline">
              View all blogs
            </MagneticButton>
          </div>
        </FadeUp>
      </div>
    </section>
  );
}
