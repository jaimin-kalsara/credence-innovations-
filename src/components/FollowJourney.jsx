import { useRef, useEffect, useState, useMemo } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SOCIAL_URL } from '../data/media';

gsap.registerPlugin(ScrollTrigger);

/* ============================================================================
   FollowJourney — "Follow Our Journey"

   A handcrafted, alive playground: one luxe dark card sits centre stage while
   six platform chips drift around it like particles in a magnetic field. The
   whole interaction is transform-only and runs on ONE shared GSAP ticker pass
   (the same ticker that already drives Lenis), so it stays pinned to 60fps.

   Per chip, every frame composes four independent forces onto a single
   `translate3d() rotate() scale()` write:
     • float  — small, fast sine drift (x ±18, y ±25, rot ±8°, scale ±.03)
     • orbit  — large, very slow elliptical travel (organic, never synced)
     • parallax — pointer offset × depth (closest 18px … farthest 5px), lerped
     • micro  — a random chip occasionally bounces (notification) or rotates
   Each chip seeds its own amplitude / frequency / phase once on mount, so
   nothing ever lines up.

   Layering keeps the forces from fighting each other:
     .fj-chip   (outer)  ← ticker writes the living transform here
       .fj-enter (inner) ← Framer Motion plays the one-shot entrance
         .fj-lift        ← CSS hover lift (translateY/scale) composes on top
   Three nested elements → three transforms that never overwrite one another.

   Hover freezes the chip: its drift eases to zero so it glides home, lifts,
   glows, and expands a glass detail card beneath it — stable enough to read.

   Reduced motion → chips rest at their home positions, simple fades, no ticker,
   no scrub, no connecting lines.
============================================================================ */

/* ---- platform glyphs (monochrome; tint to brand only on hover) ----
   Duplicated locally so the component is self-contained, matching the
   per-component glyph convention used across the site. */
function LinkedInIcon() {
  return (<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M20.45 20.45h-3.56v-5.57c0-1.33-.03-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.07 2.07 0 1 1 0-4.13 2.07 2.07 0 0 1 0 4.13zM7.12 20.45H3.56V9h3.56v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.72v20.55C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.72C24 .77 23.2 0 22.22 0z" /></svg>);
}
function IndeedIcon() {
  return (<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><circle cx="12" cy="4.6" r="2.7" /><rect x="9.3" y="8.6" width="5.4" height="11" rx="2.7" /></svg>);
}
function GlassdoorIcon() {
  return (<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M13 0h9a2 2 0 0 1 2 2v9.2a.4.4 0 0 1-.68.28L12.72.68A.4.4 0 0 1 13 0Z" /><path d="M11 24H2a2 2 0 0 1-2-2v-9.2a.4.4 0 0 1 .68-.28L11.28 23.32A.4.4 0 0 1 11 24Z" /></svg>);
}
function FacebookIcon() {
  return (<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M22.68 0H1.32C.59 0 0 .59 0 1.32v21.36C0 23.41.59 24 1.32 24h11.5v-9.29H9.69v-3.62h3.13V8.41c0-3.1 1.89-4.79 4.66-4.79 1.32 0 2.46.1 2.79.14v3.24h-1.92c-1.5 0-1.79.71-1.79 1.76v2.31h3.59l-.47 3.62h-3.12V24h6.12c.73 0 1.32-.59 1.32-1.32V1.32C24 .59 23.41 0 22.68 0z" /></svg>);
}
function InstagramIcon() {
  return (<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2.16c3.2 0 3.58.01 4.85.07 1.17.05 1.8.25 2.23.41.56.22.96.48 1.38.9.42.42.68.82.9 1.38.16.42.36 1.06.41 2.23.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.05 1.17-.25 1.8-.41 2.23-.22.56-.48.96-.9 1.38-.42.42-.82.68-1.38.9-.42.16-1.06.36-2.23.41-1.27.06-1.65.07-4.85.07s-3.58-.01-4.85-.07c-1.17-.05-1.8-.25-2.23-.41a3.7 3.7 0 0 1-1.38-.9 3.7 3.7 0 0 1-.9-1.38c-.16-.42-.36-1.06-.41-2.23C2.17 15.58 2.16 15.2 2.16 12s.01-3.58.07-4.85c.05-1.17.25-1.8.41-2.23.22-.56.48-.96.9-1.38.42-.42.82-.68 1.38-.9.42-.16 1.06-.36 2.23-.41C8.42 2.17 8.8 2.16 12 2.16M12 0C8.74 0 8.33.01 7.05.07 5.78.13 4.9.33 4.14.63c-.79.3-1.46.72-2.13 1.38C1.35 2.68.93 3.35.63 4.14.33 4.9.13 5.78.07 7.05.01 8.33 0 8.74 0 12s.01 3.67.07 4.95c.06 1.27.26 2.15.56 2.91.3.79.72 1.46 1.38 2.13.67.66 1.34 1.08 2.13 1.38.76.3 1.64.5 2.91.56C8.33 23.99 8.74 24 12 24s3.67-.01 4.95-.07c1.27-.06 2.15-.26 2.91-.56.79-.3 1.46-.72 2.13-1.38.66-.67 1.08-1.34 1.38-2.13.3-.76.5-1.64.56-2.91.06-1.28.07-1.69.07-4.95s-.01-3.67-.07-4.95c-.06-1.27-.26-2.15-.56-2.91-.3-.79-.72-1.46-1.38-2.13C21.32 1.35 20.65.93 19.86.63c-.76-.3-1.64-.5-2.91-.56C15.67.01 15.26 0 12 0zm0 5.84A6.16 6.16 0 1 0 18.16 12 6.16 6.16 0 0 0 12 5.84zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.41-10.85a1.44 1.44 0 1 0 0 2.88 1.44 1.44 0 0 0 0-2.88z" /></svg>);
}

/* Platform model — real profile URLs reused from ConnectSection.
   `x`/`y` are the chip's home position (% of the stage); `depth` is the
   parallax travel in px (closest moves most). `stat`/`statLabel`/`blurb` feed
   the hover detail card — these counts are PLACEHOLDERS, swap in real numbers. */
const PLATFORMS = [
  {
    key: 'instagram', name: 'Instagram', handle: '@credenceinnovations', brand: '#E4405F',
    href: SOCIAL_URL, Icon: InstagramIcon,
    x: 17, y: 26, depth: 18,
    stat: '12.4K', statLabel: 'followers', blurb: 'Reels from the floor, wins worth celebrating, and the team behind the standard.',
  },
  {
    key: 'linkedin', name: 'LinkedIn', handle: 'Credence Innovations', brand: '#0A66C2',
    href: 'https://www.linkedin.com/company/credence-innovations', Icon: LinkedInIcon,
    x: 82, y: 24, depth: 9,
    stat: '8.6K', statLabel: 'followers', blurb: 'Company news, open roles, and partnership updates for the industry.',
  },
  {
    key: 'facebook', name: 'Facebook', handle: 'Credence Innovations', brand: '#1877F2',
    href: 'https://www.facebook.com/credenceinnovations', Icon: FacebookIcon,
    x: 15, y: 64, depth: 14,
    stat: '5.2K', statLabel: 'followers', blurb: 'Community moments, events, and brand stories from across the country.',
  },
  {
    key: 'handshake', name: 'Handshake', handle: 'Early-career hub', brand: '#5B4DBE',
    href: 'https://joinhandshake.com', material: 'handshake',
    x: 84, y: 62, depth: 6,
    stat: 'Campus', statLabel: 'recruiting', blurb: 'Connect with our campus team and find your first role on the floor.',
  },
  {
    key: 'glassdoor', name: 'Glassdoor', handle: 'Working at Credence', brand: '#0CAA41',
    href: 'https://www.glassdoor.com/Overview/Working-at-Credence-Innovations-EI_IE.htm', Icon: GlassdoorIcon,
    x: 31, y: 83, depth: 11,
    stat: '4.7', statLabel: 'rating', blurb: 'Hear what our team really says about building a career here.',
  },
  {
    key: 'indeed', name: 'Indeed', handle: 'Credence Innovations', brand: '#2164F3',
    href: 'https://www.indeed.com/cmp/Credence-Innovations', Icon: IndeedIcon,
    x: 69, y: 85, depth: 5,
    stat: 'Open', statLabel: 'roles', blurb: 'Browse current openings nationwide and apply in a couple of taps.',
  },
];

/* On small screens the chips frame the card in two tidy rows (top + bottom),
   clear of the centred heading — same PLATFORMS order. */
const MOBILE_POS = [
  { x: 22, y: 13 },  // instagram   ┐ top row
  { x: 50, y: 9 },   // linkedin    │
  { x: 78, y: 13 },  // facebook    ┘
  { x: 22, y: 85 },  // handshake   ┐ bottom row
  { x: 50, y: 86 },  // glassdoor   │
  { x: 78, y: 85 },  // indeed      ┘
];

const TWO_PI = Math.PI * 2;
const rnd = (a, b) => a + Math.random() * (b - a);

export default function FollowJourney() {
  const reduce = useReducedMotion();

  const sectionRef = useRef(null);
  const stageRef = useRef(null);
  const playRef = useRef(null);     // ScrollTrigger scrub target (wraps card + chips)
  const cardRef = useRef(null);
  const chipRefs = useRef([]);      // outer .fj-chip nodes (ticker writes here)

  const [active, setActive] = useState(null);   // hovered chip key → detail card
  const [entered, setEntered] = useState(false); // gates the entrance + ticker
  const [isMobile, setIsMobile] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(max-width: 760px)').matches
  );

  /* live, per-frame state kept off React to avoid re-renders */
  const pointer = useRef({ tx: 0, ty: 0, x: 0, y: 0 }); // target + lerped (−1..1)
  const ampRef = useRef(1);     // global motion-amplitude scale (smaller on mobile)
  const hoverEase = useRef(PLATFORMS.map(() => 0)); // 0 rest … 1 frozen/lifted
  const hoverIdx = useRef(-1);
  const microRef = useRef(PLATFORMS.map(() => ({ type: null, start: 0 })));
  const nextMicro = useRef(2);

  /* per-chip motion seeds — random once so no two chips ever sync */
  const seeds = useMemo(() => PLATFORMS.map((p) => ({
    fxA: rnd(12, 18), fxW: rnd(0.6, 1.05), fxP: rnd(0, TWO_PI),
    fyA: rnd(16, 25), fyW: rnd(0.55, 1.0), fyP: rnd(0, TWO_PI),
    frA: rnd(4, 8), frW: rnd(0.5, 0.9), frP: rnd(0, TWO_PI),
    fsA: rnd(0.02, 0.04), fsW: rnd(0.5, 0.85), fsP: rnd(0, TWO_PI),
    oRx: rnd(18, 30), oRy: rnd(14, 24), oW: rnd(0.07, 0.14), oP: rnd(0, TWO_PI),
    depth: p.depth, enterRot: rnd(-15, 15),
  })), []);

  /* track the breakpoint + scale motion amplitude down on small screens, so the
     chips stay in their lanes and never crowd the card. */
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 760px)');
    const apply = () => { setIsMobile(mq.matches); ampRef.current = mq.matches ? 0.34 : 1; };
    apply();
    mq.addEventListener('change', apply);
    return () => mq.removeEventListener('change', apply);
  }, []);

  /* entrance gate — once the section is on screen, play it (and arm the ticker) */
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    if (reduce) { setEntered(true); return; }
    const io = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setEntered(true); io.disconnect(); } },
      { threshold: 0.15 }
    );
    io.observe(section);
    return () => io.disconnect();
  }, [reduce]);

  /* pointer parallax — track target inside the stage, normalised to −1..1
     (desktop pointer only; skipped on touch so taps/scrolls don't jiggle chips). */
  useEffect(() => {
    if (reduce || isMobile) return;
    const stage = stageRef.current;
    if (!stage) return;
    const onMove = (e) => {
      const r = stage.getBoundingClientRect();
      pointer.current.tx = Math.max(-1, Math.min(1, ((e.clientX - r.left) / r.width) * 2 - 1));
      pointer.current.ty = Math.max(-1, Math.min(1, ((e.clientY - r.top) / r.height) * 2 - 1));
    };
    const onLeave = () => { pointer.current.tx = 0; pointer.current.ty = 0; };
    stage.addEventListener('pointermove', onMove);
    stage.addEventListener('pointerleave', onLeave);
    return () => { stage.removeEventListener('pointermove', onMove); stage.removeEventListener('pointerleave', onLeave); };
  }, [reduce, isMobile]);

  /* the heartbeat — one GSAP ticker pass writes every chip's living transform.
     Gated to run only while the section is on screen. Transform-only. */
  useEffect(() => {
    if (reduce || !entered) return;
    const section = sectionRef.current;
    if (!section) return;

    let running = false;
    const tick = (time) => {
      const t = time; // seconds since the ticker started
      const pt = pointer.current;
      pt.x += (pt.tx - pt.x) * 0.08;   // spring-ish smoothing → no lag
      pt.y += (pt.ty - pt.y) * 0.08;

      // schedule the next micro-interaction (notification bounce / idle rotate)
      if (t > nextMicro.current) {
        const i = Math.floor(rnd(0, PLATFORMS.length));
        microRef.current[i] = { type: Math.random() < 0.55 ? 'bounce' : 'rotate', start: t };
        nextMicro.current = t + rnd(2.4, 4.4);
      }

      const amp = ampRef.current;
      for (let i = 0; i < PLATFORMS.length; i++) {
        const s = seeds[i];
        const el = chipRefs.current[i];
        if (!el) continue;

        // hover freeze — ease drift toward 0 so the chip glides home & holds
        const he = hoverEase.current[i] + (((hoverIdx.current === i) ? 1 : 0) - hoverEase.current[i]) * 0.14;
        hoverEase.current[i] = he;
        const m = 1 - he;

        // float + orbit (amplitude scaled down on small screens)
        let ox = amp * ((s.fxA * Math.sin(t * s.fxW + s.fxP)) + (s.oRx * Math.cos(t * s.oW + s.oP)));
        let oy = amp * ((s.fyA * Math.sin(t * s.fyW + s.fyP)) + (s.oRy * Math.sin(t * s.oW + s.oP)));
        let rot = s.frA * Math.sin(t * s.frW + s.frP);
        let scl = 1 + s.fsA * Math.sin(t * s.fsW + s.fsP);

        // parallax (depth-scaled pointer offset — desktop pointer only)
        ox += pt.x * s.depth;
        oy += pt.y * s.depth;

        // micro-interaction pulse
        const mi = microRef.current[i];
        if (mi.type) {
          const el2 = t - mi.start;
          if (mi.type === 'bounce' && el2 < 0.5) { scl += 0.08 * Math.sin(Math.PI * (el2 / 0.5)); }
          else if (mi.type === 'rotate' && el2 < 0.85) { rot += 7 * Math.sin(Math.PI * (el2 / 0.85)); }
          else mi.type = null;
        }

        ox *= m; oy *= m; rot *= m;
        el.style.transform = `translate3d(${ox.toFixed(2)}px, ${oy.toFixed(2)}px, 0) rotate(${rot.toFixed(2)}deg) scale(${scl.toFixed(3)})`;
      }
    };

    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting && !running) { running = true; gsap.ticker.add(tick); }
        else if (!e.isIntersecting && running) { running = false; gsap.ticker.remove(tick); }
      },
      { threshold: 0 }
    );
    io.observe(section);
    return () => { io.disconnect(); gsap.ticker.remove(tick); };
  }, [reduce, entered, seeds]);

  /* scroll scrub — the whole playground drifts up ~80px, scales 0.95→1 and
     fades 0.7→1 as it crosses in. ScrollTrigger.update is driven by Lenis. */
  useEffect(() => {
    if (reduce) return;
    const play = playRef.current;
    const section = sectionRef.current;
    if (!play || !section) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(play,
        { y: 80, scale: 0.95, autoAlpha: 0.7 },
        { y: 0, scale: 1, autoAlpha: 1, ease: 'none',
          scrollTrigger: { trigger: section, start: 'top 85%', end: 'top 38%', scrub: true } }
      );
    }, section);
    ScrollTrigger.refresh();
    return () => ctx.revert();
  }, [reduce]);

  const onChipEnter = (i, key) => { hoverIdx.current = i; setActive(key); };
  const onChipLeave = (i) => { if (hoverIdx.current === i) hoverIdx.current = -1; setActive((k) => (k === PLATFORMS[i].key ? null : k)); };

  return (
    <section ref={sectionRef} className="fj-section" aria-label="Follow our journey">
      <style>{`
        .fj-section { position: relative; width: 100%; padding-block: clamp(28px, 5vw, 72px);
          padding-inline: clamp(12px, 3vw, 40px); background: var(--ink); }

        /* the luxe rounded stage */
        .fj-stage { position: relative; margin-inline: auto; width: 100%; max-width: 1340px;
          height: clamp(640px, 92vh, 1000px); border-radius: 40px; overflow: hidden; isolation: isolate;
          background:
            radial-gradient(120% 80% at 18% 8%, rgba(111,168,194,0.10), transparent 52%),
            radial-gradient(110% 80% at 84% 96%, rgba(232,146,60,0.08), transparent 54%),
            linear-gradient(160deg, #0D1117 0%, #111827 52%, #161B22 100%);
          border: 1px solid rgba(255,255,255,0.06);
          box-shadow: 0 60px 140px -60px rgba(0,0,0,0.8), inset 0 1px 0 rgba(255,255,255,0.05),
            inset 0 0 0 1px rgba(255,255,255,0.02), inset 0 0 120px rgba(0,0,0,0.45);
        }
        /* very soft glowing edge */
        .fj-stage::after { content: ''; position: absolute; inset: 0; border-radius: 40px; pointer-events: none; z-index: 6;
          box-shadow: inset 0 0 0 1px rgba(111,168,194,0.12), inset 0 0 60px -20px rgba(111,168,194,0.18); }

        /* drifting background blobs — large, blurred, < 20% opacity, transform-only */
        .fj-blob { position: absolute; border-radius: 50%; filter: blur(72px); pointer-events: none;
          will-change: transform; z-index: 0; }

        .fj-play { position: absolute; inset: 0; z-index: 1; will-change: transform, opacity; }

        /* the central playground card — centred by a grid wrapper, NOT a CSS
           transform (a Framer-Motion animated transform would override it). */
        .fj-card-wrap { position: absolute; inset: 0; z-index: 2; display: grid; place-items: center; pointer-events: none; }
        .fj-card { position: relative; pointer-events: auto;
          width: min(74%, 920px); height: clamp(380px, 56%, 520px); border-radius: 36px;
          display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center;
          padding: clamp(24px, 4vw, 56px);
          background:
            linear-gradient(135deg, rgba(255,255,255,0.05), rgba(255,255,255,0.015) 40%, rgba(255,255,255,0) 70%),
            linear-gradient(160deg, #0D1117, #111827 55%, #161B22);
          background-size: 200% 200%;
          border: 1px solid rgba(255,255,255,0.06);
          backdrop-filter: blur(14px); -webkit-backdrop-filter: blur(14px);
          box-shadow: inset 0 1px 0 rgba(255,255,255,0.06), inset 0 -40px 80px -40px rgba(0,0,0,0.6),
            0 40px 90px -50px rgba(0,0,0,0.75);
          animation: fj-gradient 16s ease-in-out infinite;
        }
        @keyframes fj-gradient { 0%,100% { background-position: 0% 0%; } 50% { background-position: 100% 100%; } }

        .fj-eyebrow { font-family: 'JetBrains Mono', monospace; font-size: 11px; letter-spacing: 0.22em;
          text-transform: uppercase; color: var(--electric); opacity: 0.9; }
        .fj-title { font-family: var(--font-display); font-weight: 600; color: var(--bone);
          line-height: 0.98; letter-spacing: -0.02em; font-size: clamp(38px, 6.6vw, 92px); margin-top: 14px; }
        .fj-title .it { font-style: italic; color: var(--electric); }
        .fj-sub { color: var(--smoke); opacity: 0.78; max-width: 46ch; margin: clamp(16px, 2vw, 24px) auto 0;
          font-size: clamp(14px, 1.2vw, 18px); line-height: 1.6; }

        /* a chip lives at its home %, ticker drives the inner transform */
        .fj-chip { position: absolute; z-index: 4; width: 0; height: 0; will-change: transform; }
        .fj-enter { position: absolute; left: 0; top: 0; transform: translate(-50%, -50%); }
        .fj-lift { position: relative; display: block; transition: transform .42s var(--ease-out-quart); }
        .fj-chip:hover .fj-lift { transform: translateY(-12px) scale(1.1); }

        /* medium-sized white glass chips */
        .fj-glass { position: relative; display: grid; place-items: center;
          width: clamp(48px, 4.2vw, 60px); aspect-ratio: 1; border-radius: 50%;
          background: rgba(255,255,255,0.92); color: #1b2430;
          border: 1px solid rgba(255,255,255,0.55);
          backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px);
          box-shadow: 0 12px 30px rgba(0,0,0,0.22), 0 2px 6px rgba(0,0,0,0.12), inset 0 1px 1px rgba(255,255,255,0.85);
          cursor: pointer; text-decoration: none;
          transition: background .4s ease, box-shadow .4s ease, color .35s ease; }
        .fj-chip:hover .fj-glass {
          background: rgba(255,255,255,1); color: var(--c-brand, #1b2430);
          box-shadow: 0 20px 44px rgba(0,0,0,0.30), 0 0 0 4px color-mix(in srgb, var(--c-brand, #fff) 13%, transparent),
            0 0 26px color-mix(in srgb, var(--c-brand, #fff) 38%, transparent), inset 0 1px 1px rgba(255,255,255,0.95); }
        .fj-glass:focus-visible { outline: 2px solid var(--electric); outline-offset: 4px; }
        .fj-ic { display: grid; place-items: center; width: clamp(20px, 2vw, 26px); height: clamp(20px, 2vw, 26px);
          transition: transform .4s var(--ease-out-quart); }
        .fj-ic svg { width: 100%; height: 100%; display: block; }
        .fj-ic .material-symbols-rounded { font-size: clamp(22px, 2.2vw, 29px); line-height: 1; }
        .fj-chip:hover .fj-ic { transform: rotate(-6deg) scale(1.06); }

        /* soft platform name under each chip at rest; hidden on hover (the rich
           card takes over). Keeps the whole constellation readable. */
        .fj-name { position: absolute; top: calc(100% + 10px); left: 50%; transform: translateX(-50%);
          white-space: nowrap; font-family: 'JetBrains Mono', monospace; font-size: 9px; letter-spacing: 0.18em;
          text-transform: uppercase; color: var(--bone); opacity: 0.5; transition: opacity .3s ease, transform .3s ease; }
        .fj-chip:hover .fj-name { opacity: 0; transform: translateX(-50%) translateY(3px); }

        /* the expanded glass detail card */
        .fj-detail { position: absolute; z-index: 7; width: 232px; pointer-events: none;
          padding: 18px 18px 16px; border-radius: 28px; text-align: left;
          background: color-mix(in srgb, #0D1117 78%, transparent);
          border: 1px solid rgba(255,255,255,0.1);
          backdrop-filter: blur(25px); -webkit-backdrop-filter: blur(25px);
          box-shadow: 0 40px 90px -40px rgba(0,0,0,0.85), inset 0 1px 0 rgba(255,255,255,0.07);
          opacity: 0; transform: translateY(8px) scale(0.97); transform-origin: center top;
          transition: opacity .34s var(--ease-out-quart), transform .34s var(--ease-out-quart); }
        .fj-detail.is-open { opacity: 1; transform: translateY(0) scale(1); pointer-events: auto; }
        .fj-detail.below { transform-origin: center top; }
        .fj-detail.above { transform-origin: center bottom; }
        .fj-detail-head { display: flex; align-items: center; gap: 11px; }
        .fj-detail-badge { width: 38px; height: 38px; border-radius: 12px; display: grid; place-items: center; flex: none;
          background: rgba(255,255,255,0.95); }
        .fj-detail-badge svg { width: 20px; height: 20px; }
        .fj-detail-badge .material-symbols-rounded { font-size: 22px; }
        .fj-detail-name { font-family: var(--font-display); font-weight: 600; font-size: 16px; color: var(--bone); line-height: 1.1; }
        .fj-detail-handle { font-family: 'JetBrains Mono', monospace; font-size: 9px; letter-spacing: 0.1em;
          text-transform: uppercase; color: var(--smoke); margin-top: 3px; }
        .fj-detail-stat { display: flex; align-items: baseline; gap: 7px; margin-top: 14px; }
        .fj-detail-stat b { font-family: var(--font-display); font-weight: 600; font-size: 22px; color: var(--bone); }
        .fj-detail-stat span { font-family: 'JetBrains Mono', monospace; font-size: 9px; letter-spacing: 0.12em;
          text-transform: uppercase; color: var(--electric); }
        .fj-detail-blurb { color: var(--smoke); font-size: 12.5px; line-height: 1.5; margin-top: 8px; }
        .fj-detail-cta { display: inline-flex; align-items: center; gap: 6px; margin-top: 14px;
          font-family: 'JetBrains Mono', monospace; font-size: 9.5px; letter-spacing: 0.14em; text-transform: uppercase;
          color: var(--bone); }
        .fj-detail-cta .arrow { transition: transform .3s var(--ease-out-quart); }
        .fj-detail:hover .fj-detail-cta .arrow { transform: translateX(4px); }
        .fj-detail-divider { height: 1px; background: rgba(255,255,255,0.08); margin-top: 14px; }

        @media (max-width: 760px) {
          .fj-section { padding-inline: 10px; padding-block: 16px; }
          .fj-stage { height: clamp(560px, 84vh, 720px); border-radius: 28px; }
          .fj-card { width: 88%; height: clamp(300px, 46%, 384px); padding: 26px 20px; border-radius: 26px; }
          .fj-title { font-size: clamp(28px, 8.4vw, 44px); }
          .fj-sub { font-size: 13.5px; max-width: 32ch; margin-top: 14px; }
          .fj-eyebrow { font-size: 9.5px; letter-spacing: 0.18em; }
          .fj-glass { width: clamp(46px, 13vw, 54px); }
          .fj-ic { width: clamp(20px, 5.6vw, 24px); height: clamp(20px, 5.6vw, 24px); }
          .fj-name { font-size: 8px; }
          /* detail cards are a desktop hover interaction — hide on touch so they
             never overlap the heading; the chip + label + tap-through is enough. */
          .fj-detail { display: none; }
        }
        @media (hover: none) { .fj-name { opacity: 0.6; transform: translateX(-50%); } }
        @media (prefers-reduced-motion: reduce) {
          .fj-card { animation: none; }
          .fj-lift, .fj-glass, .fj-ic, .fj-name, .fj-detail { transition: none; }
          .fj-chip:hover .fj-lift { transform: none; }
        }
      `}</style>

      {/* the stage stays a dark luxury "island" in BOTH themes (its white-glass
          chips + dark card are designed for dark); only the section background
          around it follows the page theme. data-theme keeps the inner tokens dark. */}
      <div ref={stageRef} data-theme="dark" className="fj-stage">
        {/* drifting ambient blobs (kept under everything, opacity < 20%) */}
        <motion.span aria-hidden="true" className="fj-blob"
          style={{ width: '46%', height: '46%', left: '4%', top: '2%', background: 'radial-gradient(circle, rgba(111,168,194,0.16), transparent 62%)' }}
          animate={reduce ? undefined : { x: ['-4%', '8%', '-4%'], y: ['-3%', '6%', '-3%'] }}
          transition={{ duration: 26, repeat: Infinity, ease: 'easeInOut' }} />
        <motion.span aria-hidden="true" className="fj-blob"
          style={{ width: '50%', height: '50%', right: '2%', bottom: '0%', background: 'radial-gradient(circle, rgba(232,146,60,0.13), transparent 62%)' }}
          animate={reduce ? undefined : { x: ['4%', '-7%', '4%'], y: ['4%', '-5%', '4%'] }}
          transition={{ duration: 32, repeat: Infinity, ease: 'easeInOut' }} />
        <motion.span aria-hidden="true" className="fj-blob"
          style={{ width: '38%', height: '38%', left: '34%', top: '36%', background: 'radial-gradient(circle, rgba(111,168,194,0.10), transparent 64%)' }}
          animate={reduce ? undefined : { x: ['0%', '-6%', '0%'], y: ['0%', '7%', '0%'] }}
          transition={{ duration: 38, repeat: Infinity, ease: 'easeInOut' }} />

        <div ref={playRef} className="fj-play">
          {/* central card — fades up on entrance (1s easeOutExpo). Wrapped so the
              grid centres it; Framer animates only opacity + y on the card. */}
          <div className="fj-card-wrap">
            <motion.div ref={cardRef} className="fj-card"
              initial={reduce ? { opacity: 0 } : { opacity: 0, y: 56 }}
              animate={entered ? { opacity: 1, y: 0 } : undefined}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}>
              <span className="fj-eyebrow">Follow along · Every platform</span>
              <h2 className="fj-title">Follow Our <span className="it">Journey</span></h2>
              <p className="fj-sub">See our work, culture, achievements and latest updates across every platform.</p>
            </motion.div>
          </div>

          {/* the floating chips */}
          {PLATFORMS.map((p, i) => {
            const pos = isMobile ? MOBILE_POS[i] : { x: p.x, y: p.y };
            const below = pos.y < 58; // detail card hangs below high chips, above low ones
            const align = pos.x <= 22 ? 'l' : pos.x >= 78 ? 'r' : 'c';
            const isOpen = active === p.key;
            return (
              <div key={p.key} className="fj-chip" ref={(el) => { chipRefs.current[i] = el; }}
                style={{ left: `${pos.x}%`, top: `${pos.y}%` }}>
                <motion.div className="fj-enter"
                  initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.6, y: 60, rotate: seeds[i].enterRot }}
                  animate={entered ? { opacity: 1, scale: 1, y: 0, rotate: 0 } : undefined}
                  transition={reduce
                    ? { duration: 0.4, delay: i * 0.06 }
                    : { type: 'spring', stiffness: 180, damping: 18, delay: 0.5 + i * 0.12 }}
                  onMouseEnter={() => onChipEnter(i, p.key)}
                  onMouseLeave={() => onChipLeave(i)}>
                  <span className="fj-lift">
                    <a className="fj-glass" href={p.href} target="_blank" rel="noopener noreferrer"
                      data-cursor="expand" style={{ '--c-brand': p.brand }}
                      aria-label={`${p.name} — ${p.handle} (opens in a new tab)`}
                      onFocus={() => onChipEnter(i, p.key)} onBlur={() => onChipLeave(i)}>
                      <span className="fj-ic">
                        {p.material
                          ? <span className="material-symbols-rounded" aria-hidden="true">{p.material}</span>
                          : <p.Icon />}
                      </span>
                    </a>
                    <span className="fj-name" aria-hidden="true">{p.name}</span>

                    {/* expanded glass detail card */}
                    <div
                      className={`fj-detail ${below ? 'below' : 'above'} ${isOpen ? 'is-open' : ''}`}
                      style={{
                        left: align === 'l' ? '-8px' : align === 'r' ? 'auto' : '50%',
                        right: align === 'r' ? '-8px' : 'auto',
                        transform: align === 'c' ? 'translateX(-50%)' : 'none',
                        [below ? 'top' : 'bottom']: 'calc(100% + 16px)',
                      }}>
                      <div className="fj-detail-head">
                        <span className="fj-detail-badge" style={{ color: p.brand }}>
                          {p.material
                            ? <span className="material-symbols-rounded" aria-hidden="true">{p.material}</span>
                            : <p.Icon />}
                        </span>
                        <span>
                          <span className="fj-detail-name" style={{ display: 'block' }}>{p.name}</span>
                          <span className="fj-detail-handle">{p.handle}</span>
                        </span>
                      </div>
                      <div className="fj-detail-stat"><b>{p.stat}</b><span>{p.statLabel}</span></div>
                      <p className="fj-detail-blurb">{p.blurb}</p>
                      <div className="fj-detail-divider" />
                      <span className="fj-detail-cta">Visit Platform <span className="arrow">→</span></span>
                    </div>
                  </span>
                </motion.div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
