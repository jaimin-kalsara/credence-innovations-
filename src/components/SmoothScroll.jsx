import { useEffect } from 'react';
import Lenis from 'lenis';
import { useLocation } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

let lenisInstance = null;

export function scrollToTop() {
  if (lenisInstance) lenisInstance.scrollTo(0, { immediate: true });
  else window.scrollTo(0, 0);
}

export function scrollToEl(target) {
  if (lenisInstance) lenisInstance.scrollTo(target, { offset: -80, duration: 1.4 });
}

export default function SmoothScroll({ children }) {
  const location = useLocation();

  useEffect(() => {
    // lerp-based smoothing tracks the wheel responsively without lagging text.
    const lenis = new Lenis({
      lerp: 0.1,
      smoothWheel: true,
      wheelMultiplier: 0.7,
      touchMultiplier: 1.6,
      syncTouch: false,
    });
    lenisInstance = lenis;
    window.__lenis = lenis;

    // ── canonical Lenis ↔ GSAP integration ──
    // ONE unified RAF: gsap's ticker drives Lenis, and ScrollTrigger updates
    // once per Lenis scroll. This keeps Lenis, every ScrollTrigger and all
    // scroll-linked motion on the same frame — no desync, no double-RAF jitter.
    lenis.on('scroll', ScrollTrigger.update);
    const onTick = (time) => lenis.raf(time * 1000); // gsap ticker time is in seconds
    gsap.ticker.add(onTick);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(onTick);
      lenis.off('scroll', ScrollTrigger.update);
      lenis.destroy();
      lenisInstance = null;
    };
  }, []);

  // scroll to top on route change
  useEffect(() => {
    if (lenisInstance) lenisInstance.scrollTo(0, { immediate: true });
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return children;
}
