import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import ThemeToggle from './ThemeToggle';
import Logo from './Logo';

const links = [
  { label: 'Clients', to: '/clients' },
  { label: 'What We Do', to: '/what-we-do' },
  { label: 'About', to: '/about' },
  { label: 'Team', to: '/team' },
  { label: 'Careers', to: '/careers' },
  { label: 'Contact', to: '/contact' },
];

const policies = [
  { label: 'Privacy Policy', to: '/privacy-policy' },
  { label: 'Terms & Conditions', to: '/terms-and-conditions' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [polOpen, setPolOpen] = useState(false);
  const location = useLocation();
  const polActive = policies.some((p) => location.pathname === p.to);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => { setMenuOpen(false); setPolOpen(false); }, [location]);

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-[9990] transition-all duration-500 ${
          scrolled ? 'nav-blur border-b paper' : ''
        }`}
        style={{
          background: scrolled ? 'var(--nav-bg)' : 'transparent',
          borderColor: 'var(--divider)',
        }}
      >
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center group" aria-label="Credence Innovations — home">
            <Logo style={{ fontSize: 15, color: 'var(--electric)' }} />
          </Link>

          {/* Desktop links */}
          <div className="hidden lg:flex items-center gap-8">
            {links.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                aria-current={location.pathname === l.to ? 'page' : undefined}
                className="anim-link text-sm tracking-wide transition-colors"
                style={{
                  color: location.pathname === l.to ? 'var(--bone)' : 'var(--smoke)',
                  fontFamily: 'Inter, sans-serif',
                }}
              >
                {l.label}
              </Link>
            ))}

            {/* Policies dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setPolOpen(true)}
              onMouseLeave={() => setPolOpen(false)}
            >
              <button
                type="button"
                onClick={() => setPolOpen((v) => !v)}
                aria-haspopup="true"
                aria-expanded={polOpen}
                className="anim-link text-sm tracking-wide transition-colors flex items-center gap-1.5"
                style={{
                  color: polActive ? 'var(--bone)' : 'var(--smoke)',
                  fontFamily: 'Inter, sans-serif',
                }}
              >
                Policies
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none"
                  style={{ transition: 'transform 0.3s', transform: polOpen ? 'rotate(180deg)' : 'none' }}>
                  <path d="M2 3.5L5 6.5L8 3.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
              <AnimatePresence>
                {polOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.98 }}
                    transition={{ duration: 0.22, ease: [0.2, 0.8, 0.2, 1] }}
                    className="absolute right-0 top-full pt-3"
                    style={{ minWidth: 200 }}
                  >
                    <div
                      className="nav-blur paper rounded-xl overflow-hidden p-1.5"
                      style={{ background: 'var(--nav-bg)', border: '1px solid var(--divider)', boxShadow: 'var(--shadow-card)' }}
                    >
                      {policies.map((p) => {
                        const active = location.pathname === p.to;
                        return (
                          <Link
                            key={p.to}
                            to={p.to}
                            aria-current={active ? 'page' : undefined}
                            className="block px-4 py-2.5 rounded-lg text-sm transition-colors"
                            style={{
                              color: active ? 'var(--bone)' : 'var(--smoke)',
                              fontFamily: 'Inter, sans-serif',
                              background: active ? 'color-mix(in srgb, var(--electric) 14%, transparent)' : 'transparent',
                            }}
                            onMouseEnter={(e) => { if (!active) e.currentTarget.style.background = 'color-mix(in srgb, var(--bone) 8%, transparent)'; }}
                            onMouseLeave={(e) => { if (!active) e.currentTarget.style.background = 'transparent'; }}
                          >
                            {p.label}
                          </Link>
                        );
                      })}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* theme toggle + CTA + hamburger */}
          <div className="flex items-center gap-3 md:gap-4">
            <ThemeToggle />
            <Link
              to="/contact"
              className="mag-btn hidden md:inline-flex text-sm px-5 py-2.5"
              style={{ background: 'var(--electric)' }}
            >
              Partner With Us
            </Link>
            <button
              className="lg:hidden w-10 h-10 flex flex-col justify-center gap-1.5 items-center"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Menu"
            >
              <span className="block w-6 h-px transition-all duration-300"
                style={{ background: 'var(--bone)', transform: menuOpen ? 'rotate(45deg) translateY(3px)' : 'none' }} />
              <span className="block w-6 h-px transition-all duration-300"
                style={{ background: 'var(--bone)', opacity: menuOpen ? 0 : 1 }} />
              <span className="block w-6 h-px transition-all duration-300"
                style={{ background: 'var(--bone)', transform: menuOpen ? 'rotate(-45deg) translateY(-3px)' : 'none' }} />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.4, ease: [0.2, 0.8, 0.2, 1] }}
            className="fixed inset-0 z-[9985] flex flex-col paper"
            style={{ background: 'var(--graphite)' }}
          >
            <div className="h-16 md:h-20 flex items-center justify-between px-6">
              <Link to="/" className="flex items-center" aria-label="Credence Innovations — home">
                <Logo style={{ fontSize: 15, color: 'var(--electric)' }} />
              </Link>
              <div className="flex items-center gap-3">
                <ThemeToggle />
                <button onClick={() => setMenuOpen(false)} className="w-10 h-10 flex items-center justify-center">
                  <span className="text-2xl" style={{ color: 'var(--bone)' }}>✕</span>
                </button>
              </div>
            </div>
            <div className="flex flex-col gap-1 px-6 pt-8">
              {links.map((l, i) => (
                <motion.div key={l.to}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.06, duration: 0.4 }}>
                  <Link
                    to={l.to}
                    className="block py-4 text-2xl border-b"
                    style={{ color: 'var(--bone)', borderColor: 'var(--divider)', fontFamily: 'var(--font-display)', fontStyle: 'italic' }}
                  >
                    {l.label}
                  </Link>
                </motion.div>
              ))}

              {/* Policies group */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: links.length * 0.06, duration: 0.4 }}
                className="pt-6"
              >
                <p className="font-mono mb-2" style={{ fontSize: 10, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--smoke)' }}>
                  Policies
                </p>
                {policies.map((p) => (
                  <Link
                    key={p.to}
                    to={p.to}
                    className="block py-3 text-lg border-b"
                    style={{ color: 'var(--smoke)', borderColor: 'var(--divider)', fontFamily: 'var(--font-display)', fontStyle: 'italic' }}
                  >
                    {p.label}
                  </Link>
                ))}
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="mt-8"
              >
                <Link to="/contact" className="mag-btn w-full justify-center py-4">
                  Partner With Us
                </Link>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
