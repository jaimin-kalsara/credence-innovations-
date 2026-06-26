import { useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence, useReducedMotion, useInView } from 'framer-motion';
import CinematicImage from './CinematicImage';

/* ImageStoryTimeline — a scroll-driven story timeline where EACH milestone has its
   own image. On desktop the left column is a sticky image "stage" that crossfades to
   whichever milestone is crossing the middle of the viewport (a scrollytelling swap);
   the right column is the milestone list, the active one lit in brand teal. On mobile
   (and under reduced motion) the sticky stage is dropped and every milestone shows its
   own image inline, stacked. Each image is a CinematicImage slot: pass `src` per item
   to drop in a real photo later — the big year/marker numeral stays as the caption. */

const EXPO = [0.16, 1, 0.3, 1];

/* the image for one milestone, with its marker (year/step) set large over the scene */
function MilestoneImage({ item, aspect = '4 / 5' }) {
  // `fit="contain"` shows the whole photo (no crop) over a soft blurred fill, so a
  // subject that sits off-center is never cropped out into empty space.
  return <CinematicImage src={item.src} label={item.marker} caption={item.heading} aspect={aspect} fit="contain" />;
}

function Row({ item, index, active, setActive, reduce }) {
  const ref = useRef(null);
  // active = the row crossing the middle band of the viewport (drives the sticky stage)
  const band = useInView(ref, { margin: '-45% 0px -45% 0px' });
  const seen = useInView(ref, { once: true, margin: '-12%' });
  useEffect(() => { if (band) setActive(index); }, [band, index, setActive]);
  const on = active === index;
  return (
    <div ref={ref} className="ist-row">
      <motion.div
        initial={reduce ? false : { opacity: 0, y: 18 }}
        animate={(reduce || seen) ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6, ease: EXPO }}
      >
        {/* inline image — shown on mobile always; under reduced motion shown on all sizes.
            Decorative: the marker/heading it overlays are already in the row below, so we
            hide it from the a11y tree to avoid announcing each milestone twice. */}
        <div aria-hidden="true" className={`${reduce ? '' : 'lg:hidden'} mb-6 rounded-2xl overflow-hidden`} style={{ border: '1px solid var(--hair)' }}>
          <MilestoneImage item={item} aspect="16 / 10" />
        </div>
        <span className="block" style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', fontSize: 'clamp(1.5rem, 2.6vw, 2.1rem)', lineHeight: 1, color: 'var(--electric)', marginBottom: '0.6rem', opacity: on ? 1 : 0.5, transition: 'opacity 0.4s' }}>
          {item.marker}
        </span>
        <h3 className="t-display-s" style={{ fontFamily: 'var(--font-display)', color: on ? 'var(--electric)' : 'var(--bone)', margin: '0 0 0.55rem', transition: 'color 0.4s' }}>
          {item.heading}
        </h3>
        {item.body && <p className="body" style={{ color: 'var(--smoke)', margin: 0, maxWidth: '46ch' }}>{item.body}</p>}
      </motion.div>
    </div>
  );
}

export default function ImageStoryTimeline({ items = [], mobileScroll = false }) {
  const reduce = useReducedMotion();
  const [active, setActive] = useState(0);
  const cur = items[active] || items[0];

  return (
    <div className={`grid gap-10 lg:gap-16 items-start ${reduce ? '' : 'lg:grid-cols-[0.92fr_1.08fr]'}`}>
      <style>{`
        .ist-list { border-left: 1px solid var(--hair); padding-left: clamp(1.5rem, 3vw, 2.5rem); }
        .ist-row { padding-block: clamp(34px, 6vh, 76px); }
        /* MOBILE (≤640px, opt-in via mobileScroll) — milestones become a
           horizontal snap carousel of cards; desktop scrollytelling untouched. */
        @media (max-width: 640px) {
          .ist-list--scroll { display: flex; flex-wrap: nowrap; align-items: stretch;
            overflow-x: auto; overflow-y: visible; scroll-snap-type: x mandatory;
            -webkit-overflow-scrolling: touch; gap: 14px; padding: 0 0 12px; border-left: 0;
            -ms-overflow-style: none; scrollbar-width: none; }
          .ist-list--scroll::-webkit-scrollbar { display: none; }
          .ist-list--scroll .ist-row { flex: 0 0 82%; scroll-snap-align: start; min-width: 0;
            padding: 16px; border: 1px solid var(--hair); border-radius: 16px;
            background: color-mix(in srgb, var(--graphite) 55%, transparent); }
        }
      `}</style>
      {/* LEFT — sticky image stage that crossfades to the active milestone (desktop only) */}
      {/* decorative: the active milestone's marker/heading are conveyed by the lit row */}
      {!reduce && (
        <div className="hidden lg:block lg:sticky lg:top-24" aria-hidden="true">
          <div className="relative overflow-hidden" style={{ borderRadius: 18, border: '1px solid var(--hair)', background: 'var(--graphite)' }}>
            <div style={{ aspectRatio: '4 / 5' }} aria-hidden="true" />
            <AnimatePresence>
              <motion.div
                key={active} className="absolute inset-0" aria-hidden="true"
                initial={{ opacity: 0, scale: 1.05 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
                transition={{ duration: 0.7, ease: EXPO }}
              >
                <MilestoneImage item={cur} aspect="4 / 5" />
              </motion.div>
            </AnimatePresence>
          </div>
          {/* progress indicator — fills as you advance through the milestones */}
          <div className="flex items-center gap-1.5 mt-6" aria-hidden="true">
            {items.map((_, i) => (
              <div key={i} className="h-[3px] rounded-full" style={{ flex: 1, background: i <= active ? 'var(--electric)' : 'var(--hair)', transition: 'background 0.45s' }} />
            ))}
          </div>
        </div>
      )}

      {/* RIGHT — the milestone list */}
      <div className={`ist-list relative ${mobileScroll ? 'ist-list--scroll' : ''}`}>
        {items.map((item, i) => (
          <Row key={i} item={item} index={i} active={active} setActive={setActive} reduce={reduce} />
        ))}
      </div>
    </div>
  );
}
