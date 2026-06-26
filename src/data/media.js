/* ============================================================
   MEDIA MANIFEST — the real Credence photo + video library.

   Source files live in /public/media (images, web-optimized) and
   /public/media/video (interview clips). Categorized by what they
   actually show so each section uses thematically-relevant shots.
   Every one of the 39 photos is referenced by exactly one pool
   below (heroes reuse a few CREW shots), so nothing is left unused.

   To swap a photo: drop a same-named file in /public/media.
   ============================================================ */

const f = (n) => `/media/${n}.jpg`;
const v = (n) => `/media/video/${n}.mp4`;

/* Abby Caudill, the founder (and close team) — for founder / about features */
export const FOUNDER = [f('abbypaul'), f('abbyamani1'), f('abbyamani2')];

/* Full-team / crew group shots — for heroes + ecosystem moments */
export const CREW = [
  f('credencecrew1'),
  f('briteam2'),
];

/* Recognition — awards, trophies, certificates, the balloon-arch stage */
export const RECOGNITION = [
  f('cadepromo'),
  f('whatsapp-image-2026-03-04-at-13.00.38'),
  f('whatsapp-image-2026-03-04-at-13.00.44'),
  f('whatsapp-image-2026-03-04-at-13.00.45'),
  f('whatsapp-image-2026-03-03-at-17.31.30'),
  f('whatsapp-image-2026-03-03-at-17.31.28-1-'),
];

/* The people — pairs and small groups of reps / managers */
export const PEOPLE = [
  f('aronshivanimiami'),
  f('baylenarondeep'),
  f('shivanicade-1-'),
  f('laurenmitchfunny'),
  f('anthonyabby'),
  f('dexterjanetabby'),
  f('janetabbybri'),
  f('abbydhyey'),
];

/* Culture — team nights, dinners, the beach, the ferris wheel */
export const CULTURE = [
  f('dinner1'),
  f('beach1'),
  f('ferriswheel'),
  f('janetwater'),
  f('thumbsup'),
];

/* In the field / on the road — team at work, offices, market days */
export const FIELD = [
  f('whatsapp-image-2026-02-18-at-18.50.51'),
  f('whatsapp-image-2026-02-17-at-17.54.57'),
  f('whatsapp-image-2026-02-18-at-19.12.27'),
  f('whatsapp-image-2026-02-18-at-19.12.27-2-'),
  f('whatsapp-image-2026-02-18-at-19.12.27-4-'),
  f('whatsapp-image-2026-03-04-at-12.23.19-1-'),
  f('whatsapp-image-2026-03-04-at-12.23.20-2-'),
  f('whatsapp-image-2026-03-04-at-12.23.27'),
  f('whatsapp-image-2026-03-06-at-09.24.59'),
  f('whatsapp-image-2026-03-06-at-09.24.59-1-'),
  f('whatsapp-image-2026-03-06-at-09.25.00'),
  f('whatsapp-image-2026-03-06-at-09.25.00-1-'),
  f('whatsapp-image-2026-03-06-at-09.25.01'),
  f('whatsapp-image-2026-03-06-at-09.25.01-1-'),
  f('whatsapp-image-2026-03-06-at-09.25.02-1-'),
];

/* Interview clips (served locally in dev; host externally for production).
   `poster` reuses a relevant still so the player has a frame before play. */
export const INTERVIEWS = [
  { src: v('briana-interview'), title: 'Meet Briana', poster: f('aronshivanimiami') },
  { src: v('lauren-history-of-the-business'), title: 'The history of the business', poster: f('laurenmitchfunny') },
  { src: v('lauren-what-were-you-doing-before-this-'), title: 'Before Credence', poster: f('janetabbybri') },
  { src: v('favorite-part-about-our-industry'), title: 'Our favorite part of the industry', poster: f('credencecrew1') },
  { src: v('why-is-this-an-essential-service-'), title: 'Why this is essential', poster: f('briteam2') },
  { src: v('how-can-i-tell-my-parents-what-we-do-'), title: 'Explaining what we do', poster: f('dexterjanetabby') },
  { src: v('what-is-one-habit_'), title: 'One habit that matters', poster: f('thumbsup') },
];

/* A flat list of every photo, for any "show everything" surface */
export const ALL_PHOTOS = [...FOUNDER, ...CREW, ...RECOGNITION, ...PEOPLE, ...CULTURE, ...FIELD];

/* ============================================================
   SOCIAL — the @credence social wall. 10 specific Instagram posts, each
   rendered as an AUTOPLAY cover-video tile that links to its post. The cover
   videos use the /media/video scheme keyed to each post's shortcode
   (e.g. /media/video/DZLMuszFJW0.mp4) — drop those .mp4s in and flip
   VIDEOS_READY to true; they then autoplay (muted) whenever a tile is in the
   central band. `poster` is a stand-in team still shown until the cover video
   exists. Two posts (DYpBMw4kRHF, DW65zOmlC1t) are image carousels on
   Instagram — if there's no video cover for them, switch them to type:'image'.
   ============================================================ */
/* Master switches for video playback (poster placeholders shown while false).
   VIDEOS_READY → testimonials, founder film, careers, About story (those .mp4s
   are in /public/media/video). SOCIAL_VIDEOS_READY → the @credence social wall
   reels (the 10 per-post reels aren't on disk yet, so this stays false to avoid
   404s; flip it once those files are added). */
export const VIDEOS_READY = true;
export const SOCIAL_VIDEOS_READY = false;

export const SOCIAL_URL = 'https://www.instagram.com/credenceinnovations/';

const ig = (shortcode) => `https://www.instagram.com/p/${shortcode}/`;

export const SOCIAL = [
  { type: 'video', src: v('DZLMuszFJW0'), poster: f('credencecrew1'),    href: ig('DZLMuszFJW0'), caption: 'Credence Innovations on Instagram' },
  { type: 'video', src: v('DZX49gyB3CJ'), poster: f('briteam2'),         href: ig('DZX49gyB3CJ'), caption: 'Credence Innovations on Instagram' },
  { type: 'video', src: v('DYpBMw4kRHF'), poster: f('aronshivanimiami'), href: ig('DYpBMw4kRHF'), caption: 'Credence Innovations on Instagram' }, // carousel on IG
  { type: 'video', src: v('DY0HWBChlKK'), poster: f('baylenarondeep'),   href: ig('DY0HWBChlKK'), caption: 'Credence Innovations on Instagram' },
  { type: 'video', src: v('DYFUFuoBwWd'), poster: f('cadepromo'),        href: ig('DYFUFuoBwWd'), caption: 'Credence Innovations on Instagram' },
  { type: 'video', src: v('DYAaSRSBw2m'), poster: f('dexterjanetabby'),  href: ig('DYAaSRSBw2m'), caption: 'Credence Innovations on Instagram' },
  { type: 'video', src: v('DXzomrIlMk1'), poster: f('janetabbybri'),     href: ig('DXzomrIlMk1'), caption: 'Credence Innovations on Instagram' },
  { type: 'video', src: v('DXFLhu5AX0f'), poster: f('laurenmitchfunny'), href: ig('DXFLhu5AX0f'), caption: 'Credence Innovations on Instagram' },
  { type: 'video', src: v('DXFIds4gS47'), poster: f('dinner1'),          href: ig('DXFIds4gS47'), caption: 'Credence Innovations on Instagram' },
  { type: 'video', src: v('DW65zOmlC1t'), poster: f('beach1'),           href: ig('DW65zOmlC1t'), caption: 'Credence Innovations on Instagram' }, // carousel on IG
];

/* ============================================================
   Categorized brand videos — real .mp4s in /public/media/video, named to
   match the slugs below. Categories follow the client's own file labels.
   ============================================================ */
const clip = (name, poster, title, blurb) => ({ src: v(name), poster: f(poster), title, blurb });

/* TESTIMONIAL — team members on their experience (featured + supporting, Home).
   The first item is the FEATURED "Start here" story. `name` and `length` are
   light, editable metadata for the cards (swap in real names/durations). */
export const TESTIMONIAL_VIDEOS = [
  { ...clip('lauren-before-credence', 'janetabbybri', 'Before Credence', 'What life looked like before I stepped onto the floor — and what changed.'), name: 'Lauren', length: '1:24' },
  { ...clip('why-is-this-an-essential-service', 'briteam2', 'Why the work matters', 'The honest case for what we do every day.'), length: '0:58' },
  { ...clip('what-is-one-habit', 'thumbsup', 'The one habit that wins', 'The small discipline behind the results.'), length: '1:06' },
];

/* FOUNDER — a word from Abby Caudill (Home, below her bio) */
export const FOUNDER_VIDEO = clip('abby-interview-web', 'abbypaul', 'A word from our founder', 'Abby Caudill on why Credence exists — and the standard behind it.');

/* CAREER — what the work is really like (grid on the Careers page) */
export const CAREER_VIDEOS = [
  clip('briana-interview', 'aronshivanimiami', 'Meet Briana', 'Leading a market, in her words.'),
  clip('favorite-part-about-our-industry', 'credencecrew1', 'Our favorite part', 'The part of the job we love most.'),
  clip('how-can-i-tell-my-parents-what-we-do', 'dexterjanetabby', 'Explaining the job', 'Putting the work into plain words.'),
];

/* ABOUT — the history of the business (About page) */
export const ABOUT_VIDEO = clip('lauren-history-of-the-business', 'laurenmitchfunny', 'How it all started', 'Lauren on how Credence grew, from the floor up.');
