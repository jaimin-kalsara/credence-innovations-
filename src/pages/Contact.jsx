import PageHero from '../components/PageHero';
import { FadeUp } from '../components/AnimatedSection';
import PartnerForm from '../components/PartnerForm';
import MagneticButton from '../components/MagneticButton';
import FolderTabDivider from '../components/FolderTabDivider';
import Scribble from '../components/Scribble';
import DrawUnderline from '../components/DrawUnderline';
import ScrollReveal from '../components/ScrollReveal';

/* ===== Two paths (CREAM) =====
   Opposing paper-cards: brands (electric tab, solid CTA) vs talent (ember tab,
   outline CTA). One hand-drawn arrow points from the divider toward the brand
   card's CTA. All copy + both CTA targets preserved verbatim. */
function Paths() {
  const paths = [
    {
      eyebrow: 'For brands',
      title: 'Partner with us.',
      body: 'Put a trained team on the floor inside the retailers your next customers already trust.',
      cta: 'Request a call',
      anchor: '#partner',
      solid: true,
      tab: 'var(--electric)',
    },
    {
      eyebrow: 'For talent',
      title: 'Join the team.',
      body: 'Build real sales skill and leadership alongside a team that has your back.',
      cta: 'See open roles',
      anchor: '/careers',
      solid: false,
      tab: 'var(--ember)',
    },
  ];

  return (
    <section className="pad-md paper">
      <div className="shell">
        <div className="grid md:grid-cols-2 gap-6 lg:gap-8 items-stretch">
          {paths.map((p, i) => (
            <ScrollReveal key={p.title} from={i === 0 ? 'left' : 'right'} distance={120}>
              <div
                className="paper-card relative h-full flex flex-col overflow-hidden"
                style={{ padding: 'clamp(28px, 3.4vw, 48px)', borderRadius: 18 }}
              >
                {/* left tab spine in the path's tone */}
                <span
                  aria-hidden="true"
                  style={{
                    position: 'absolute',
                    left: 0,
                    top: 'clamp(28px, 3.4vw, 48px)',
                    bottom: 'clamp(28px, 3.4vw, 48px)',
                    width: 3,
                    borderRadius: 3,
                    background: p.tab,
                  }}
                />
                <span
                  className="font-mono uppercase block mb-5"
                  style={{
                    fontSize: '10.5px',
                    letterSpacing: '0.16em',
                    fontWeight: 600,
                    color: p.tab,
                    paddingLeft: 18,
                  }}
                >
                  {p.eyebrow}
                </span>
                <h3
                  className="t-display-m mb-4"
                  style={{ fontFamily: 'var(--font-display)', color: 'var(--bone)', paddingLeft: 18 }}
                >
                  {p.title}
                </h3>
                <p className="body-lg mb-9" style={{ color: 'var(--smoke)', paddingLeft: 18, maxWidth: '40ch' }}>
                  {p.body}
                </p>

                {/* CTA pinned to the bottom; brand card carries the scribble arrow */}
                <div className="relative mt-auto" style={{ paddingLeft: 18 }}>
                  {i === 0 && (
                    <Scribble
                      kind="arrow"
                      color="var(--electric)"
                      delay={0.5}
                      style={{
                        position: 'absolute',
                        width: 78,
                        height: 46,
                        left: -46,
                        top: -34,
                        transform: 'rotate(8deg)',
                      }}
                    />
                  )}
                  {p.anchor.startsWith('#') ? (
                    <MagneticButton href={p.anchor} variant={p.solid ? 'solid' : 'outline'}>
                      {p.cta}
                    </MagneticButton>
                  ) : (
                    <MagneticButton to={p.anchor} variant={p.solid ? 'solid' : 'outline'}>
                      {p.cta}
                    </MagneticButton>
                  )}
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ===== Direct contact (CREAM, pure print typography) =====
   No cards — mono labels over Fraunces values, on a ruled ledger grid. All three
   channels (Partnerships / Careers / Headquarters) preserved with their links. */
function Direct() {
  const channels = [
    { label: 'Partnerships & Careers', value: 'hr@credenceinnovations.com', href: 'mailto:hr@credenceinnovations.com', note: 'Brands and talent — same inbox.' },
    { label: 'Headquarters', value: 'Indianapolis, Indiana', href: null },
  ];

  return (
    <section className="pad-md paper">
      <div className="shell">
        <FadeUp>
          <h2
            className="t-display-m"
            style={{ fontFamily: 'var(--font-display)', color: 'var(--bone)', marginBottom: 'clamp(36px, 5vw, 56px)', maxWidth: '14ch' }}
          >
            Reach us <span className="d-ital" style={{ color: 'var(--electric)' }}>directly.</span>
          </h2>
        </FadeUp>

        <ScrollReveal from="up" distance={110} scaleFrom={1} style={{ borderTop: '1px solid var(--hair)' }}>
          {channels.map((c, i) => (
            <FadeUp key={c.label} delay={i * 0.08}>
              <div
                className="grid sm:grid-cols-[200px_1fr] gap-3 sm:gap-10 items-baseline py-7 md:py-9"
                style={{ borderBottom: '1px solid var(--hair)' }}
              >
                <p
                  className="font-mono uppercase"
                  style={{ fontSize: '11px', letterSpacing: '0.16em', color: 'var(--ember)' }}
                >
                  {c.label}
                </p>
                <div>
                  {c.href ? (
                    <a
                      href={c.href}
                      className="anim-link break-words"
                      style={{
                        fontFamily: 'var(--font-display)',
                        fontSize: 'clamp(26px, 4vw, 44px)',
                        lineHeight: 1.05,
                        color: 'var(--bone)',
                      }}
                    >
                      {c.value}
                    </a>
                  ) : (
                    <span
                      style={{
                        fontFamily: 'var(--font-display)',
                        fontSize: 'clamp(26px, 4vw, 44px)',
                        lineHeight: 1.05,
                        color: 'var(--bone)',
                      }}
                    >
                      {c.value}
                    </span>
                  )}
                  {c.note && (
                    <p className="body-sm" style={{ color: 'var(--smoke)', marginTop: 10 }}>{c.note}</p>
                  )}
                </div>
              </div>
            </FadeUp>
          ))}
        </ScrollReveal>
      </div>
    </section>
  );
}

/* ===== Form (DARK ISLAND) =====
   Keeps id="partner" on the <section> so the #partner anchor + the brand path's
   solid CTA both resolve here. PartnerForm (and its success state) reused intact;
   all heading + subhead copy preserved verbatim. */
function FormSection() {
  return (
    <section id="partner" data-theme="dark" className="paper pad-lg" style={{ background: 'var(--ink)' }}>
      <div className="shell-narrow">
        <ScrollReveal from="up" distance={110} className="text-center" style={{ marginBottom: 'clamp(36px, 5vw, 56px)' }}>
          <FadeUp>
            <span className="eyebrow block mb-5">Partner with us</span>
          </FadeUp>
          <FadeUp delay={0.05}>
            <h2 className="t-display-l" style={{ fontFamily: 'var(--font-display)', color: 'var(--bone)' }}>
              Tell us about your brand.{' '}
              <span className="d-ital" style={{ color: 'var(--electric)' }}>
                We'll show you <DrawUnderline color="var(--electric)">national reach.</DrawUnderline>
              </span>
            </h2>
          </FadeUp>
          <FadeUp delay={0.12}>
            <p className="body-lg measure mx-auto mt-6" style={{ textAlign: 'center' }}>
              A 15-minute intro call. We'll walk you through the markets where your product fits and the
              fastest path from pilot to rollout.
            </p>
          </FadeUp>
        </ScrollReveal>
        <FadeUp delay={0.18}>
          <div className="paper-card" style={{ padding: 'clamp(20px, 3vw, 36px)', borderRadius: 22 }}>
            <PartnerForm />
          </div>
        </FadeUp>
      </div>
    </section>
  );
}

/* ===== Our office (CREAM) — embedded Google map + the essentials, side by side ===== */
function OfficeMap() {
  const address = '6535 E 82nd St, Indianapolis, IN 46250';
  const embed = `https://www.google.com/maps?q=${encodeURIComponent(address)}&z=15&output=embed`;
  const directions = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(address)}`;

  return (
    <section className="pad-md paper">
      <div className="shell">
        <FadeUp>
          <h2 className="t-display-m" style={{ fontFamily: 'var(--font-display)', color: 'var(--bone)', marginBottom: 'clamp(28px, 4vw, 44px)', maxWidth: '16ch' }}>
            Find us <span className="d-ital" style={{ color: 'var(--electric)' }}>on the map.</span>
          </h2>
        </FadeUp>

        <div className="grid lg:grid-cols-[1.4fr_0.6fr] gap-6 lg:gap-10 items-stretch">
          {/* map */}
          <FadeUp>
            <div className="relative overflow-hidden" style={{ borderRadius: 18, border: '1px solid var(--hair)', boxShadow: '0 30px 60px -34px var(--shadow-card)' }}>
              <iframe
                title="Credence Innovations office — 6535 E 82nd St, Indianapolis, IN"
                src={embed}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
                style={{ border: 0, display: 'block', width: '100%', height: '100%', minHeight: 'clamp(320px, 42vh, 460px)' }}
              />
            </div>
          </FadeUp>

          {/* contact info */}
          <FadeUp delay={0.08}>
            <div className="paper-card h-full flex flex-col justify-center" style={{ padding: 'clamp(24px, 3vw, 40px)', borderRadius: 18 }}>
              <span className="font-mono uppercase block mb-4" style={{ fontSize: 11, letterSpacing: '0.16em', color: 'var(--ember)' }}>Our office</span>
              <h3 className="t-display-s" style={{ fontFamily: 'var(--font-display)', color: 'var(--bone)', margin: '0 0 14px' }}>Castleton, Indianapolis</h3>
              <p className="body" style={{ color: 'var(--smoke)', margin: 0 }}>6535 E 82nd St<br />Indianapolis, IN 46250</p>
              <a href={directions} target="_blank" rel="noopener noreferrer" className="anim-link mt-6" style={{ fontFamily: 'var(--font-display)', fontSize: 18, color: 'var(--electric)' }}>
                Get directions →
              </a>
              <span aria-hidden="true" style={{ height: 1, background: 'var(--hair)', margin: '24px 0' }} />
              <span className="font-mono uppercase block mb-2" style={{ fontSize: 10.5, letterSpacing: '0.16em', color: 'var(--smoke)' }}>Email</span>
              <a href="mailto:hr@credenceinnovations.com" className="anim-link break-words" style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(17px, 1.6vw, 21px)', color: 'var(--bone)' }}>
                hr@credenceinnovations.com
              </a>
            </div>
          </FadeUp>
        </div>
      </div>
    </section>
  );
}

export default function Contact() {
  return (
    <>
      <PageHero
        eyebrow="Contact"
        title="Let's talk."
        italic="Your next market is open."
        align="center"
        subhead="Whether you're a brand looking for national reach or talent looking for a platform — this is where it starts."
      />
      <Paths />
      <Direct />
      <OfficeMap />
      <FolderTabDivider label="Partner with us" tone="ember" fill="var(--ink)" />
      <FormSection />
    </>
  );
}
