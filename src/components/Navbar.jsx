import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
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

// shared spring for the sliding active/hover pill
const PILL_SPRING = { type: 'spring', stiffness: 420, damping: 34, mass: 0.7 };

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [polOpen, setPolOpen] = useState(false);
  const [hovered, setHovered] = useState(null); // which link key the pill rests on
  const reduce = useReducedMotion();
  const location = useLocation();
  const polActive = policies.some((p) => location.pathname === p.to);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => { setMenuOpen(false); setPolOpen(false); }, [location]);

  // The pill rests under whatever is hovered; with nothing hovered it falls
  // back to the active route so the current page reads as "selected".
  const activeKey = polActive ? 'policies' : (links.find((l) => l.to === location.pathname)?.to ?? null);
  const pillKey = hovered ?? activeKey;

  return (
    <>
      <motion.nav
        initial={reduce ? false : { y: -28, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className={`nav-wrap fixed top-0 left-0 right-0 z-[9990] flex justify-center px-3 md:px-6 ${scrolled ? 'is-scrolled' : ''}`}
      >
        <div className={`nav-bar relative ${scrolled ? 'is-scrolled nav-blur' : ''}`}>
          <div className="nav-row flex items-center justify-between px-5 md:px-8"
            style={{ height: scrolled ? 68 : 80 }}>
            {/* Logo */}
            <Link to="/" className="nav-logo flex items-center" aria-label="Credence Innovations — home">
              <Logo style={{ fontSize: 15, color: 'var(--electric)' }} />
            </Link>

            {/* Desktop links — one cluster, one sliding pill */}
            <div
              className="hidden lg:flex items-center gap-1"
              onMouseLeave={() => setHovered(null)}
            >
              {links.map((l) => {
                const active = location.pathname === l.to;
                return (
                  <Link
                    key={l.to}
                    to={l.to}
                    onMouseEnter={() => setHovered(l.to)}
                    aria-current={active ? 'page' : undefined}
                    className="nav-link"
                    style={{ color: pillKey === l.to ? 'var(--bone)' : 'var(--smoke)' }}
                  >
                    {pillKey === l.to && (
                      <motion.span layoutId="nav-pill" className="nav-pill" transition={reduce ? { duration: 0 } : PILL_SPRING} />
                    )}
                    <span className="nav-label">{l.label}</span>
                  </Link>
                );
              })}

              {/* Policies dropdown — shares the pill group */}
              <div
                className="relative"
                onMouseEnter={() => { setHovered('policies'); setPolOpen(true); }}
                onMouseLeave={() => setPolOpen(false)}
              >
                <button
                  type="button"
                  onClick={() => setPolOpen((v) => !v)}
                  aria-haspopup="true"
                  aria-expanded={polOpen}
                  className="nav-link"
                  style={{ color: pillKey === 'policies' ? 'var(--bone)' : 'var(--smoke)', background: 'none', cursor: 'pointer' }}
                >
                  {pillKey === 'policies' && (
                    <motion.span layoutId="nav-pill" className="nav-pill" transition={PILL_SPRING} />
                  )}
                  <span className="nav-label flex items-center gap-1.5">
                    Policies
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none" className="nav-caret"
                      style={{ transform: polOpen ? 'rotate(180deg)' : 'none' }}>
                      <path d="M2 3.5L5 6.5L8 3.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                </button>
                <AnimatePresence>
                  {polOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.97 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.97 }}
                      transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
                      className="absolute right-0 top-full pt-4"
                      style={{ minWidth: 212 }}
                    >
                      <div
                        className="nav-blur paper rounded-2xl overflow-hidden p-1.5"
                        style={{ background: 'var(--nav-bg)', border: '1px solid var(--divider)', boxShadow: '0 24px 60px -28px var(--shadow-card)' }}
                      >
                        {policies.map((p, i) => {
                          const active = location.pathname === p.to;
                          return (
                            <motion.div
                              key={p.to}
                              initial={{ opacity: 0, x: -6 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: 0.04 + i * 0.05, duration: 0.3 }}
                            >
                              <Link
                                to={p.to}
                                aria-current={active ? 'page' : undefined}
                                className="block px-4 py-2.5 rounded-xl text-sm transition-colors"
                                style={{
                                  color: active ? 'var(--bone)' : 'var(--smoke)',
                                  fontFamily: 'Inter, sans-serif',
                                  background: active ? 'var(--brand-soft)' : 'transparent',
                                }}
                                onMouseEnter={(e) => { if (!active) e.currentTarget.style.background = 'color-mix(in srgb, var(--bone) 7%, transparent)'; }}
                                onMouseLeave={(e) => { if (!active) e.currentTarget.style.background = 'transparent'; }}
                              >
                                {p.label}
                              </Link>
                            </motion.div>
                          );
                        })}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* theme toggle + CTA + hamburger */}
            <div className="flex items-center gap-2.5 md:gap-3">
              <ThemeToggle />
              <Link
                to="/contact"
                className="mag-btn nav-cta hidden md:inline-flex"
                style={{ background: 'var(--electric)' }}
              >
                Partner With Us
              </Link>
              <button
                className="nav-icon-btn lg:hidden"
                onClick={() => setMenuOpen(!menuOpen)}
                aria-label="Menu"
                aria-expanded={menuOpen}
              >
                <span className="relative flex flex-col items-center justify-center gap-1.5 w-5">
                  <span className="block w-5 h-px transition-all duration-300"
                    style={{ background: 'var(--bone)', transform: menuOpen ? 'rotate(45deg) translateY(3px)' : 'none' }} />
                  <span className="block w-5 h-px transition-all duration-300"
                    style={{ background: 'var(--bone)', opacity: menuOpen ? 0 : 1 }} />
                  <span className="block w-5 h-px transition-all duration-300"
                    style={{ background: 'var(--bone)', transform: menuOpen ? 'rotate(-45deg) translateY(-3px)' : 'none' }} />
                </span>
              </button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-[9985] flex flex-col paper"
            style={{ background: 'var(--graphite)' }}
          >
            <div className="h-16 md:h-20 flex items-center justify-between px-6">
              <Link to="/" className="flex items-center" aria-label="Credence Innovations — home">
                <Logo style={{ fontSize: 15, color: 'var(--electric)' }} />
              </Link>
              <div className="flex items-center gap-3">
                <ThemeToggle />
                <button onClick={() => setMenuOpen(false)} className="nav-icon-btn" aria-label="Close menu">
                  <span className="text-xl leading-none" style={{ color: 'var(--bone)' }}>✕</span>
                </button>
              </div>
            </div>
            <div className="flex flex-col gap-1 px-6 pt-8">
              {links.map((l, i) => (
                <motion.div key={l.to}
                  initial={{ opacity: 0, x: 24 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.05 + i * 0.06, duration: 0.45, ease: [0.16, 1, 0.3, 1] }}>
                  <Link
                    to={l.to}
                    className="group flex items-center justify-between py-4 text-2xl border-b"
                    style={{ color: 'var(--bone)', borderColor: 'var(--divider)', fontFamily: 'var(--font-display)', fontStyle: 'italic' }}
                  >
                    {l.label}
                    <span className="font-mono not-italic" style={{ fontSize: 11, color: 'var(--electric)' }}>
                      {String(i + 1).padStart(2, '0')}
                    </span>
                  </Link>
                </motion.div>
              ))}

              {/* Policies group */}
              <motion.div
                initial={{ opacity: 0, x: 24 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.05 + links.length * 0.06, duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
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
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.45, duration: 0.4 }}
                className="mt-8"
              >
                <Link to="/contact" className="mag-btn nav-cta w-full justify-center py-4">
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
