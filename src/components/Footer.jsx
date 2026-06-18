import { Link } from 'react-router-dom';
import Logo from './Logo';
import Scribble from './Scribble';
import StampBadge from './StampBadge';
import Parallax from './Parallax';

export default function Footer() {
  return (
    <footer data-theme="dark" className="relative paper" style={{ background: 'var(--ink)' }}>
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-14">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center mb-5">
              <Logo style={{ fontSize: 17, color: 'var(--bone)' }} />
            </div>
            <p className="text-sm leading-relaxed mb-6" style={{ color: 'var(--smoke)', maxWidth: 220 }}>
              Placing trained brand representatives inside America's biggest retailers.
            </p>
            <div className="flex gap-4">
              {['IN', 'LI', 'FB'].map(s => (
                <a key={s} href="#" className="w-9 h-9 flex items-center justify-center rounded-full border transition-colors hover:border-[var(--electric)]"
                  style={{ borderColor: 'var(--hair)', color: 'var(--smoke)', fontSize: 11 }}>
                  {s}
                </a>
              ))}
            </div>
          </div>

          {/* Company */}
          <div>
            <p className="eyebrow mb-4" style={{ color: 'var(--smoke)' }}>Company</p>
            {[['About', '/about'], ['Team', '/team'], ['Careers', '/careers'], ['Contact', '/contact']].map(([l, h]) => (
              <Link key={h} to={h} className="block text-sm py-1.5 anim-link" style={{ color: 'var(--smoke)' }}>{l}</Link>
            ))}
          </div>

          {/* Work */}
          <div>
            <p className="eyebrow mb-4" style={{ color: 'var(--smoke)' }}>Work</p>
            {[['Clients', '/clients'], ['What We Do', '/what-we-do']].map(([l, h]) => (
              <Link key={h} to={h} className="block text-sm py-1.5 anim-link" style={{ color: 'var(--smoke)' }}>{l}</Link>
            ))}
          </div>

          {/* Connect */}
          <div>
            <p className="eyebrow mb-4" style={{ color: 'var(--smoke)' }}>Connect</p>
            <a href="mailto:hr@credenceinnovations.com" className="block text-sm py-1.5 anim-link break-all" style={{ color: 'var(--smoke)' }}>
              hr@credenceinnovations.com
            </a>
            <p className="text-sm py-1.5 mt-4 eyebrow" style={{ color: 'var(--smoke)' }}>Legal</p>
            <a href="#" className="block text-sm py-1.5 anim-link" style={{ color: 'var(--smoke)' }}>Privacy</a>
            <a href="#" className="block text-sm py-1.5 anim-link" style={{ color: 'var(--smoke)' }}>Terms</a>
          </div>
        </div>

        {/* oversized warm wordmark — drifts on scroll, the page's last breath */}
        <div className="relative" style={{ overflow: 'hidden' }}>
          <Parallax axis="x" speed={0.08} style={{ overflow: 'visible' }}>
            <div aria-hidden="true" className="d-caps select-none" style={{
              fontSize: 'clamp(48px, 12vw, 168px)', lineHeight: 0.82, color: 'transparent',
              WebkitTextStroke: '1px var(--hair)', whiteSpace: 'nowrap',
            }}>
              CREDENCE
            </div>
          </Parallax>
        </div>

        {/* hand-drawn divider */}
        <div className="my-7" style={{ width: 160, height: 14 }}>
          <Scribble kind="squiggle" color="var(--ember)" />
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between gap-5">
          <div className="flex items-center gap-5">
            <StampBadge topText="ESTABLISHED" bottomText="INDIANAPOLIS" center="2016" color="var(--electric)" size={68} rotate={-7} />
            <p className="font-mono text-xs" style={{ color: 'var(--smoke)' }}>
              © {new Date().getFullYear()} Credence Innovations. Indianapolis, IN.
            </p>
          </div>
          <p className="font-mono text-xs" style={{ color: 'var(--smoke)' }}>
            40+ CITIES · 211 CAMPAIGNS · 9+ YEARS
          </p>
        </div>
      </div>
    </footer>
  );
}
