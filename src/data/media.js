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
