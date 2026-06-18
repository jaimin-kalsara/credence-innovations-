import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

/* The user's proven embed: load the viewer web component from unpkg and point
   it at the remote Spline scene. The runtime + scene are heavy, so we DEFER the
   whole thing until the browser is idle and the hero is actually in view — the
   rest of the page renders and becomes interactive first. */
const VIEWER_SRC = 'https://unpkg.com/@splinetool/viewer@1.10.90/build/spline-viewer.js';
const SCENE_URL = 'https://prod.spline.design/LAZjJRXefD7Q1kmu/scene.splinecode';

/* Inject the viewer script once. Resolves as soon as the custom element is
   defined so callers can safely create <spline-viewer>. */
let viewerPromise = null;
function loadViewerScript() {
  if (typeof window === 'undefined') return Promise.reject(new Error('no window'));
  if (window.customElements?.get('spline-viewer')) return Promise.resolve();
  if (viewerPromise) return viewerPromise;
  viewerPromise = new Promise((resolve, reject) => {
    const existing = document.querySelector(`script[src="${VIEWER_SRC}"]`);
    if (existing) {
      if (window.customElements?.get('spline-viewer')) return resolve();
      existing.addEventListener('load', () => resolve());
      existing.addEventListener('error', () => reject(new Error('spline-viewer failed to load')));
      return;
    }
    const s = document.createElement('script');
    s.type = 'module';
    s.src = VIEWER_SRC;
    s.onload = () => resolve();
    s.onerror = () => { viewerPromise = null; reject(new Error('spline-viewer failed to load')); };
    document.head.appendChild(s);
  });
  return viewerPromise;
}

/* Static, on-brand stand-in for reduced-motion / low-power / load failure. */
function Fallback({ note }) {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center gap-5">
      <div
        className="w-32 h-32 rounded-full"
        style={{
          background:
            'radial-gradient(circle at 50% 40%, rgba(91,150,181,0.55), rgba(68,104,122,0.15) 60%, transparent 72%)',
          boxShadow: '0 0 70px rgba(91,150,181,0.25)',
        }}
      />
      <span className="font-mono text-[10px] tracking-widest uppercase" style={{ color: 'var(--smoke)' }}>
        {note}
      </span>
    </div>
  );
}

export default function SplineRobot({ maxWidth = 980, fill = false }) {
  const stageRef = useRef(null);
  const mountRef = useRef(null);
  const [phase, setPhase] = useState('idle'); // idle | loading | ready | error

  const reduce =
    typeof window !== 'undefined' &&
    window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

  // Skip the heavy WebGL on data-saver, very slow connections, or very low-RAM
  // devices — they get the lightweight brand fallback instead.
  const lowPower =
    typeof navigator !== 'undefined' &&
    (navigator.connection?.saveData === true ||
      /^(slow-2g|2g)$/.test(navigator.connection?.effectiveType || '') ||
      (typeof navigator.deviceMemory === 'number' && navigator.deviceMemory > 0 && navigator.deviceMemory < 2));

  // One effect: lazily load the scene only when it nears the viewport AND the
  // browser is idle, then pause its render loop whenever it scrolls off-screen.
  useEffect(() => {
    if (reduce || lowPower) return;
    const stage = stageRef.current;
    const mount = mountRef.current;
    if (!stage || !mount) return;
    if (mount.querySelector('spline-viewer')) return; // StrictMode double-run guard

    let cancelled = false;
    let started = false;
    let idleHandle = null;
    let safety = null;
    let badgeTimer = null;

    const createViewer = () => {
      if (cancelled || mount.querySelector('spline-viewer')) return;
      const viewer = document.createElement('spline-viewer');
      viewer.setAttribute('url', SCENE_URL);
      viewer.setAttribute('loading-anim-type', 'none');
      viewer.style.cssText =
        'position:absolute;inset:0;width:100%;height:100%;border:0;outline:none;background:transparent;';

      // Hide Spline's "Built with Spline" badge inside the shadow root.
      const hideBadge = () => {
        try {
          const sr = viewer.shadowRoot;
          if (sr && !sr.getElementById('ci-hide-badge')) {
            const st = document.createElement('style');
            st.id = 'ci-hide-badge';
            st.textContent = '#logo{display:none!important;}';
            sr.appendChild(st);
          }
        } catch { /* shadow root not reachable — gradient mask is the fallback */ }
      };

      viewer.addEventListener('load', () => { if (!cancelled) setPhase('ready'); hideBadge(); });
      viewer.addEventListener('error', () => { if (!cancelled) setPhase('error'); });
      mount.appendChild(viewer);

      let tries = 0;
      badgeTimer = setInterval(() => {
        hideBadge();
        if (++tries > 24 || (viewer.shadowRoot && viewer.shadowRoot.getElementById('ci-hide-badge'))) {
          clearInterval(badgeTimer); badgeTimer = null;
        }
      }, 200);

      safety = setTimeout(() => { if (!cancelled) setPhase((p) => (p === 'loading' ? 'ready' : p)); }, 6000);
    };

    const startLoad = () => {
      if (cancelled || started) return;
      started = true;
      setPhase('loading');
      loadViewerScript().then(() => { if (!cancelled) createViewer(); }).catch(() => { if (!cancelled) setPhase('error'); });
    };

    // defer the kickoff to idle time so the critical page work finishes first
    const scheduleIdle = () => {
      if (started || idleHandle) return;
      if ('requestIdleCallback' in window) {
        idleHandle = window.requestIdleCallback(startLoad, { timeout: 2500 });
      } else {
        idleHandle = setTimeout(startLoad, 1200);
      }
    };

    const io = new IntersectionObserver(
      ([entry]) => {
        const v = mount.querySelector('spline-viewer');
        if (entry.isIntersecting) {
          scheduleIdle();           // first time it nears view → schedule the load
          if (v) v.style.display = 'block';   // resume
        } else if (v) {
          v.style.display = 'none'; // pause WebGL while off-screen
        }
      },
      { rootMargin: '200px' }
    );
    io.observe(stage);

    return () => {
      cancelled = true;
      io.disconnect();
      if (idleHandle) {
        if ('cancelIdleCallback' in window) window.cancelIdleCallback(idleHandle);
        clearTimeout(idleHandle);
      }
      if (safety) clearTimeout(safety);
      if (badgeTimer) clearInterval(badgeTimer);
      const v = mount.querySelector('spline-viewer');
      if (v && v.parentNode) v.parentNode.removeChild(v);
    };
  }, [reduce, lowPower]);

  const showFallback = reduce || lowPower;

  return (
    <div ref={stageRef} className={`relative mx-auto w-full ${fill ? 'h-full' : 'min-w-[380px]'}`} style={{ maxWidth }}>
      {/* ambient teal halo behind the robot */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
        style={{
          width: '78%', height: '78%',
          background: 'radial-gradient(circle at 50% 45%, rgba(91,150,181,0.30), transparent 62%)',
          filter: 'blur(46px)',
        }}
      />
      {/* slow rotating guide ring (skipped for reduced motion / low power) */}
      {!showFallback && (
        <motion.div
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-1/2 rounded-full"
          style={{ width: '60%', aspectRatio: '1', x: '-50%', y: '-46%', border: '1px solid rgba(91,150,181,0.10)' }}
          animate={{ rotate: 360 }}
          transition={{ duration: 48, repeat: Infinity, ease: 'linear' }}
        />
      )}

      {/* the robot stage (transparent, frameless) */}
      <div
        className={`relative w-full ${fill ? 'h-full' : 'aspect-[16/12] md:aspect-[16/10]'}`}
        role="img"
        aria-label="Interactive 3D robot — drag to explore"
      >
        <div ref={mountRef} className="absolute inset-0" />

        {showFallback && <Fallback note={lowPower ? 'Interactive 3D · saved for speed' : 'Interactive 3D · motion reduced'} />}
        {phase === 'error' && !showFallback && <Fallback note="3D experience unavailable" />}

        {/* mask the Spline watermark (visual only — does not block interaction) */}
        <div
          aria-hidden
          className="pointer-events-none absolute bottom-0 right-0 h-12 w-40"
          style={{ background: 'linear-gradient(315deg, var(--ink) 36%, transparent 78%)' }}
        />
      </div>

      {/* ground shadow to anchor the robot */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 -translate-x-1/2"
        style={{
          bottom: '7%', width: '40%', height: 26,
          background: 'radial-gradient(ellipse at center, rgba(0,0,0,0.55), transparent 70%)',
          filter: 'blur(10px)',
        }}
      />
    </div>
  );
}
