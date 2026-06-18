import { useEffect, useRef } from 'react';

export default function CustomCursor() {
  const dotRef = useRef(null);
  const ringRef = useRef(null);
  const pos = useRef({ x: 0, y: 0 });
  const ring = useRef({ x: 0, y: 0 });
  const raf = useRef(null);

  useEffect(() => {
    // Skip entirely on touch / no-hover devices — saves a constant RAF loop
    // and the cursor overlay is meaningless without a pointer.
    if (typeof window !== 'undefined' && window.matchMedia?.('(hover: none), (pointer: coarse)').matches) {
      return;
    }
    const dot = dotRef.current;
    const ringEl = ringRef.current;

    const lerp = (a, b, t) => a + (b - a) * t;

    const animate = () => {
      ring.current.x = lerp(ring.current.x, pos.current.x, 0.18);
      ring.current.y = lerp(ring.current.y, pos.current.y, 0.18);
      ringEl.style.transform = `translate3d(${ring.current.x}px, ${ring.current.y}px, 0) translate(-50%, -50%)`;
      const dx = pos.current.x - ring.current.x;
      const dy = pos.current.y - ring.current.y;
      // stop the loop once the ring has caught up — no forever-running RAF when idle
      if (dx * dx + dy * dy > 0.3) {
        raf.current = requestAnimationFrame(animate);
      } else {
        raf.current = null;
      }
    };

    const onMove = (e) => {
      pos.current = { x: e.clientX, y: e.clientY };
      // transform (composited) instead of left/top (forces layout each frame)
      dot.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0) translate(-50%, -50%)`;
      // restart the ring loop only while it has catching-up to do
      if (raf.current == null) raf.current = requestAnimationFrame(animate);
    };

    const onEnter = (e) => {
      if (e.target.closest('a, button, .mag-btn, [data-cursor="expand"]')) {
        dot.classList.add('expanded');
        ringEl.classList.add('expanded');
      }
    };

    const onLeave = () => {
      dot.classList.remove('expanded');
      ringEl.classList.remove('expanded');
    };

    window.addEventListener('mousemove', onMove, { passive: true });
    document.addEventListener('mouseover', onEnter, { passive: true });
    document.addEventListener('mouseout', onLeave, { passive: true });
    raf.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseover', onEnter);
      document.removeEventListener('mouseout', onLeave);
      if (raf.current) cancelAnimationFrame(raf.current);
    };
  }, []);

  return (
    <>
      <div ref={dotRef} className="cursor-dot" />
      <div ref={ringRef} className="cursor-ring" />
    </>
  );
}
