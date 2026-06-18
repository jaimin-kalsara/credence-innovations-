import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/* Reads the theme that the inline script in index.html already applied to
   <html data-theme>, toggles it, and persists the choice to localStorage. */
function currentTheme() {
  if (typeof document === 'undefined') return 'dark';
  return document.documentElement.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
}

export default function ThemeToggle({ className = '' }) {
  const [theme, setTheme] = useState(currentTheme);
  const isLight = theme === 'light';

  const toggle = () => {
    const next = isLight ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', next);
    try { localStorage.setItem('ci-theme', next); } catch { /* storage blocked — fine */ }
    setTheme(next);
  };

  return (
    <button
      onClick={toggle}
      aria-label={isLight ? 'Switch to dark mode' : 'Switch to light mode'}
      title={isLight ? 'Switch to dark mode' : 'Switch to light mode'}
      className={`relative w-9 h-9 flex items-center justify-center rounded-full border overflow-hidden transition-colors ${className}`}
      style={{ borderColor: 'var(--divider)', color: 'var(--electric)' }}
    >
      <AnimatePresence mode="wait" initial={false}>
        {isLight ? (
          <motion.svg
            key="moon"
            initial={{ rotate: -90, opacity: 0, scale: 0.6 }}
            animate={{ rotate: 0, opacity: 1, scale: 1 }}
            exit={{ rotate: 90, opacity: 0, scale: 0.6 }}
            transition={{ duration: 0.3, ease: [0.2, 0.8, 0.2, 1] }}
            width="16" height="16" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
          >
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
          </motion.svg>
        ) : (
          <motion.svg
            key="sun"
            initial={{ rotate: 90, opacity: 0, scale: 0.6 }}
            animate={{ rotate: 0, opacity: 1, scale: 1 }}
            exit={{ rotate: -90, opacity: 0, scale: 0.6 }}
            transition={{ duration: 0.3, ease: [0.2, 0.8, 0.2, 1] }}
            width="16" height="16" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="4" />
            <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
          </motion.svg>
        )}
      </AnimatePresence>
    </button>
  );
}
