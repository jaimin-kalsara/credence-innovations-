import { useRef } from 'react';
import {
  motion, useReducedMotion,
  useScroll, useTransform, useSpring, useInView,
} from 'framer-motion';
import { FIELD } from '../data/media';

/* ============================================================================
   AboutArticle — a premium, magazine-style feature article.

   Editorial (not boxy): a centered headline, a soft-feathered cinematic image,
   a drop-cap lead, a breakout pull-quote, flowing prose, service tags and a
   byline — threaded by a vertical reading-progress line that fills as you
   scroll. Content is the company's own "About" narrative (purpose, founding,
   focus). Line-mask reveals, parallax, clip-in image, staggered tags, count-in
   year. Theme-adaptive · reduced-motion aware · no GSAP.

   Source narrative: credenceinnovations.org/aboutus
============================================================================ */

const EXPO = [0.16, 1, 0.3, 1];
const SPRING = { type: 'spring', stiffness: 130, damping: 21, mass: 1 };
const TAGS = ['Direct Marketing', 'Experiential Marketing', 'Face-to-Face Campaigns', 'Custom Strategy'];

export default function AboutArticle() {
  const reduce = useReducedMotion();
  const sectionRef = useRef(null);
  const headRef = useRef(null);
  const headIn = useInView(headRef, { once: true, margin: '-12% 0px' });
  const figRef = useRef(null);
  const bodyRef = useRef(null);

  const { scrollYProgress: secProg } = useScroll({ target: sectionRef, offset: ['start end', 'end start'] });
  const bgY = useTransform(secProg, [0, 1], reduce ? ['0%', '0%'] : ['-4%', '4%']);

  const { scrollYProgress: figProg } = useScroll({ target: figRef, offset: ['start end', 'end start'] });
  const imgY = useTransform(figProg, [0, 1], reduce ? ['0%', '0%'] : ['-9%', '9%']);

  const { scrollYProgress: bodyProg } = useScroll({ target: bodyRef, offset: ['start 78%', 'end 68%'] });
  const progScale = useSpring(reduce ? 1 : bodyProg, { stiffness: 120, damping: 30, mass: 0.4 });

  const lineV = reduce ? { hidden: { opacity: 0 }, show: { opacity: 1 } } : { hidden: { y: '120%' }, show: { y: '0%' } };
  const block = (delay = 0) => ({
    initial: reduce ? { opacity: 0 } : { opacity: 0, y: 24, filter: 'blur(5px)' },
    whileInView: { opacity: 1, y: 0, filter: 'blur(0px)' },
    viewport: { once: true, margin: '-14%' },
    transition: { duration: 0.75, delay, ease: EXPO },
  });

  return (
    <section ref={sectionRef} className="ar-section paper relative overflow-hidden pad-lg" aria-label="Our purpose — the Credence story">
      <style>{`
        .ar-section { isolation: isolate;
          background:
            radial-gradient(54% 40% at 82% 6%, color-mix(in srgb, var(--electric) 9%, transparent), transparent 60%),
            radial-gradient(50% 38% at 8% 94%, color-mix(in srgb, var(--ember) 7%, transparent), transparent 62%),
            var(--ink); }
        .ar-bg { position: absolute; inset: 0; z-index: 0; pointer-events: none; overflow: hidden; }
        .ar-orb { position: absolute; border-radius: 50%; filter: blur(94px); }
        .ar-orb-1 { width: 34vw; max-width: 500px; aspect-ratio: 1; right: -8%; top: -6%; background: radial-gradient(circle, color-mix(in srgb, var(--electric) 14%, transparent), transparent 64%); }
        .ar-orb-2 { width: 30vw; max-width: 440px; aspect-ratio: 1; left: -8%; bottom: -8%; background: radial-gradient(circle, color-mix(in srgb, var(--ember) 11%, transparent), transparent 64%); }
        .ar-grain { position: absolute; inset: 0; opacity: 0.035; mix-blend-mode: overlay;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E"); background-size: 140px 140px; }

        .ar-inner { position: relative; z-index: 2; }

        /* header */
        .ar-head { max-width: 820px; margin-inline: auto; text-align: center; }
        .ar-kicker { display: inline-flex; align-items: center; gap: 9px; padding: 7px 15px; border-radius: 999px;
          font-family: 'JetBrains Mono', monospace; font-size: 10px; letter-spacing: 0.2em; text-transform: uppercase; color: var(--bone);
          background: color-mix(in srgb, var(--graphite) 52%, transparent); border: 1px solid color-mix(in srgb, var(--electric) 26%, var(--hair)); }
        .ar-kicker .dot { width: 6px; height: 6px; border-radius: 50%; background: var(--electric); box-shadow: 0 0 10px var(--electric); }
        .ar-title { font-family: var(--font-display); color: var(--bone); line-height: 1.02; letter-spacing: -0.02em;
          font-size: clamp(34px, 5vw, 68px); margin-top: clamp(16px, 1.8vw, 22px); }
        .ar-title .ln { display: block; overflow: hidden; padding-bottom: 0.06em; }
        .ar-title .ln > span { display: inline-block; will-change: transform; }
        .ar-hi { font-style: italic; font-weight: 500;
          background: linear-gradient(100deg, var(--electric), #6FB6D9 55%, var(--electric)); -webkit-background-clip: text; background-clip: text; -webkit-text-fill-color: transparent; color: var(--electric); }
        .ar-stand { color: var(--smoke); font-size: clamp(16px, 1.3vw, 19px); line-height: 1.6; max-width: 60ch; margin: clamp(18px, 1.8vw, 24px) auto 0; }
        .ar-meta { display: flex; flex-wrap: wrap; align-items: center; justify-content: center; gap: 10px 16px; margin-top: clamp(18px, 2vw, 26px);
          font-family: 'JetBrains Mono', monospace; font-size: 10px; letter-spacing: 0.14em; text-transform: uppercase; color: var(--smoke); }
        .ar-meta .by { color: var(--ember); }
        .ar-meta .sep { width: 4px; height: 4px; border-radius: 50%; background: var(--hair); }

        /* feature image — feathered, no hard frame */
        .ar-figure { position: relative; margin: clamp(34px, 4.4vw, 56px) auto 0; width: min(1060px, 100%); aspect-ratio: 21 / 9; }
        .ar-figwrap { position: absolute; inset: 0; overflow: hidden; border-radius: clamp(20px, 2vw, 30px);
          -webkit-mask-image: radial-gradient(125% 130% at 50% 38%, #000 74%, transparent 100%); mask-image: radial-gradient(125% 130% at 50% 38%, #000 74%, transparent 100%);
          box-shadow: 0 54px 120px -56px var(--shadow-card); }
        .ar-figwrap img { position: absolute; inset: 0; width: 100%; height: 116%; object-fit: cover; filter: saturate(1.04) contrast(1.03); }
        .ar-figscrim { position: absolute; inset: 0; pointer-events: none; background: linear-gradient(to top, color-mix(in srgb, var(--ink) 50%, transparent), transparent 44%); }
        .ar-figtag { position: absolute; left: clamp(16px, 2vw, 26px); bottom: clamp(14px, 1.8vw, 22px); z-index: 2;
          font-family: 'JetBrains Mono', monospace; font-size: 9.5px; letter-spacing: 0.16em; text-transform: uppercase; color: #F3EEE2; }

        /* article body */
        .ar-article { position: relative; max-width: 700px; margin: clamp(40px, 5vw, 64px) auto 0; padding-left: clamp(20px, 3vw, 40px); }
        .ar-prog { position: absolute; left: 0; top: 6px; bottom: 6px; width: 2px; border-radius: 2px; background: color-mix(in srgb, var(--bone) 12%, transparent); overflow: hidden; }
        .ar-prog-fill { position: absolute; inset: 0; transform-origin: top; background: linear-gradient(var(--electric), var(--ember)); }
        .ar-p { color: var(--smoke); font-size: clamp(16px, 1.18vw, 18.5px); line-height: 1.74; margin-top: clamp(20px, 2vw, 26px); }
        .ar-p:first-of-type { margin-top: 0; }
        .ar-p strong { color: var(--bone); font-weight: 600; }
        .ar-dropcap { float: left; font-family: var(--font-display); font-weight: 600; font-size: clamp(58px, 7vw, 88px); line-height: 0.78;
          padding: 6px 14px 0 0; color: var(--electric); }

        .ar-quote { position: relative; margin: clamp(34px, 4vw, 50px) 0; width: min(860px, 92vw); margin-inline: calc((700px - min(860px, 92vw)) / 2); text-align: center; }
        .ar-quote .qg { display: block; font-family: var(--font-display); font-weight: 600; font-size: clamp(50px, 6vw, 80px); line-height: 0.4; color: color-mix(in srgb, var(--ember) 80%, transparent); }
        .ar-quote p { font-family: var(--font-display); font-style: italic; color: var(--bone); font-size: clamp(24px, 3.1vw, 40px); line-height: 1.18; letter-spacing: -0.01em; margin: 18px auto 0; max-width: 22ch; }
        .ar-quote .ql { display: block; width: 54px; height: 2px; margin: 22px auto 0; background: linear-gradient(90deg, transparent, var(--electric), transparent); }

        .ar-tags { display: flex; flex-wrap: wrap; gap: 10px; margin-top: clamp(30px, 3.4vw, 42px); }
        .ar-tag { font-family: 'JetBrains Mono', monospace; font-size: 10px; letter-spacing: 0.12em; text-transform: uppercase; color: var(--bone);
          padding: 9px 15px; border-radius: 999px; background: color-mix(in srgb, var(--graphite) 50%, transparent); border: 1px solid var(--hair); }
        [data-theme="dark"] .ar-tag { background: color-mix(in srgb, #1c272e 70%, transparent); border-color: rgba(255,255,255,0.1); }

        .ar-byline { display: flex; flex-wrap: wrap; align-items: center; gap: 14px; margin-top: clamp(34px, 4vw, 50px); padding-top: clamp(22px, 2.4vw, 30px); border-top: 1px solid var(--hair); }
        .ar-byline .rule { width: 34px; height: 1px; background: var(--electric); flex: none; }
        .ar-byname { font-family: var(--font-display); font-style: italic; color: var(--bone); font-size: clamp(20px, 2vw, 28px); line-height: 1; }
        .ar-byrole { font-family: 'JetBrains Mono', monospace; font-size: 10px; letter-spacing: 0.14em; text-transform: uppercase; color: var(--smoke); margin-top: 7px; }

        @media (max-width: 620px) { .ar-quote { margin-inline: 0; width: 100%; } }
      `}</style>

      <motion.div className="ar-bg" aria-hidden="true" style={{ y: bgY }}>
        <span className="ar-orb ar-orb-1" />
        <span className="ar-orb ar-orb-2" />
        <span className="ar-grain" />
      </motion.div>

      <div className="shell ar-inner">
        {/* header */}
        <div className="ar-head" ref={headRef}>
          <motion.span className="ar-kicker"
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: 12 }} animate={headIn ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6, ease: EXPO }}>
            <span className="dot" aria-hidden="true" />Our purpose
          </motion.span>
          <h1 className="ar-title">
            <span className="ln"><motion.span initial="hidden" animate={headIn ? 'show' : 'hidden'} variants={lineV} transition={{ ...(reduce ? { duration: 0.5 } : SPRING), delay: 0.1 }}>Driven by purpose.</motion.span></span>
            <span className="ln"><motion.span className="ar-hi" initial="hidden" animate={headIn ? 'show' : 'hidden'} variants={lineV} transition={{ ...(reduce ? { duration: 0.5 } : SPRING), delay: 0.18 }}>Built on people.</motion.span></span>
          </h1>
          <motion.p className="ar-stand"
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: 14, filter: 'blur(4px)' }} animate={headIn ? { opacity: 1, y: 0, filter: 'blur(0px)' } : {}} transition={{ duration: 0.7, delay: 0.3, ease: EXPO }}>
            How a single Indianapolis office grew into a national force in face-to-face marketing — without ever letting go of the people who built it.
          </motion.p>
          <motion.div className="ar-meta"
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: 10 }} animate={headIn ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6, delay: 0.42, ease: EXPO }}>
            <span className="by">Abby Caudill, Founder</span><span className="sep" aria-hidden="true" /><span>Est. 2016 · Indianapolis</span><span className="sep" aria-hidden="true" /><span>3 min read</span>
          </motion.div>
        </div>

        {/* feature image */}
        <div className="ar-figure" ref={figRef}>
          <motion.div className="ar-figwrap"
            initial={reduce ? { opacity: 0 } : { opacity: 0, clipPath: 'inset(0 0 100% 0)' }}
            animate={headIn ? { opacity: 1, clipPath: 'inset(0 0 0% 0)' } : {}}
            transition={{ duration: 1, ease: EXPO, delay: 0.5 }}>
            <motion.img src={FIELD[5]} alt="The Credence Innovations team at work" loading="lazy" draggable="false" style={reduce ? undefined : { y: imgY }} />
            <span className="ar-figscrim" aria-hidden="true" />
            <span className="ar-figtag">Indianapolis, Indiana · The floor</span>
          </motion.div>
        </div>

        {/* article body */}
        <div className="ar-article" ref={bodyRef}>
          <span className="ar-prog" aria-hidden="true"><motion.span className="ar-prog-fill" style={{ scaleY: progScale }} /></span>

          <motion.p className="ar-p" {...block(0)}>
            <span className="ar-dropcap">I</span>n 2016, Abby Caudill founded Credence Innovations with a background in broadcasting and media from Eastern Kentucky University — and a simple conviction: that ambition, turned into action, can build something that lasts. From a single office in Indianapolis, she set out to create more than a marketing firm. She wanted a place where <strong>growth, leadership, and opportunity</strong> are open to anyone with the drive to earn them.
          </motion.p>

          <motion.blockquote className="ar-quote" {...block(0.05)}>
            <span className="qg" aria-hidden="true">&ldquo;</span>
            <p>We turn ambition into action, and ideas into impact.</p>
            <span className="ql" aria-hidden="true" />
          </motion.blockquote>

          <motion.p className="ar-p" {...block(0)}>
            That belief still runs the company. Built on a hands-on culture of <strong>promoting from within</strong>, Credence drives customer acquisition for Fortune 500 and Fortune 50 brands through four disciplines — direct marketing, experiential marketing, face-to-face campaigns, and custom strategy — across telecommunications, home improvement, energy, nonprofit, and consumer goods.
          </motion.p>

          <motion.p className="ar-p" {...block(0)}>
            Headquartered in Indianapolis and <strong>A+ rated by the BBB</strong>, the team now reaches across multiple states — and keeps growing, market by market, on the same standard it started with: send customers the kind of people you'd be proud to send to your own.
          </motion.p>

          <motion.div className="ar-tags"
            initial="hidden" whileInView="show" viewport={{ once: true, margin: '-12%' }} transition={{ staggerChildren: 0.07, delayChildren: 0.05 }}>
            {TAGS.map((t) => (
              <motion.span key={t} className="ar-tag"
                variants={reduce ? { hidden: { opacity: 0 }, show: { opacity: 1 } } : { hidden: { opacity: 0, y: 14, scale: 0.92 }, show: { opacity: 1, y: 0, scale: 1, transition: SPRING } }}>{t}</motion.span>
            ))}
          </motion.div>

          <motion.div className="ar-byline" {...block(0)}>
            <span className="rule" aria-hidden="true" />
            <div>
              <div className="ar-byname">Abby Caudill</div>
              <div className="ar-byrole">Founder, Credence Innovations · Indianapolis, Indiana</div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
