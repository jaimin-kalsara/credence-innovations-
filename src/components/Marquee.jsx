import TiltChip from './TiltChip';

/* Scrolling logo-wall: retailer / brand names as interactive 3D-tilt pills.
   Pauses on hover (see .marquee-wrap in index.css); each chip tilts toward the
   cursor, lifts, and lights up toward the brand color. Theme-aware. */
export default function Marquee({ items, direction = 'ltr' }) {
  const doubled = [...items, ...items];

  return (
    <div className="marquee-wrap overflow-hidden relative py-5">
      <div className={direction === 'rtl' ? 'marquee-track-rtl' : 'marquee-track'}>
        {doubled.map((item, i) => (
          <div key={i} className="px-2.5 py-1" aria-hidden={i >= items.length ? 'true' : undefined}>
            <TiltChip>{item}</TiltChip>
          </div>
        ))}
      </div>
    </div>
  );
}
