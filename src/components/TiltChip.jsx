import { useRef } from 'react';

/* Interactive 3D tilt pill. As the cursor moves over the chip it rotates in
   perspective toward the pointer (and lifts); leaving snaps it flat. Only the
   hovered chip updates two CSS vars on pointer move, so it's cheap. The marquee
   pauses on hover, so chips are stationary while you interact with them. */
export default function TiltChip({ children }) {
  const ref = useRef(null);

  const onMove = (e) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;   // 0..1
    const py = (e.clientY - r.top) / r.height;   // 0..1
    el.style.setProperty('--ry', `${(px - 0.5) * 18}deg`);   // left/right
    el.style.setProperty('--rx', `${(0.5 - py) * 14}deg`);   // up/down
  };

  const onLeave = () => {
    const el = ref.current;
    if (!el) return;
    el.style.setProperty('--rx', '0deg');
    el.style.setProperty('--ry', '0deg');
  };

  return (
    <span
      ref={ref}
      className="logo-chip tilt"
      data-cursor="expand"
      onPointerMove={onMove}
      onPointerLeave={onLeave}
    >
      {children}
    </span>
  );
}
