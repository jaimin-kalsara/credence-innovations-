import { useRef } from 'react';
import { motion, useInView, useReducedMotion } from 'framer-motion';

/* Rolling-digit odometer (Relay-style "money in motion"). Each digit is a
   vertical 0–9 reel that rolls to its target on scroll-into-view, cascading
   left→right with a restrained ease-out. Separators (commas) and the suffix
   (+, %, etc.) render static. Accessible: the real value is exposed via
   aria-label and the reels are hidden from the a11y tree. */
function Reel({ digit, delay, inView, reduce }) {
  const target = inView ? -digit * 10 : 0; // % of the 10-tall reel
  return (
    <span className="odo-digit" aria-hidden="true">
      <motion.span
        className="odo-reel"
        initial={{ y: '0%' }}
        animate={{ y: `${target}%` }}
        transition={reduce ? { duration: 0 } : { duration: 1.1 + delay * 1.4, delay, ease: [0.16, 1, 0.3, 1] }}
      >
        {Array.from({ length: 10 }, (_, n) => (
          <span key={n} className="odo-num">{n}</span>
        ))}
      </motion.span>
    </span>
  );
}

export default function Odometer({ value, className = '', style = {} }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  const reduce = useReducedMotion();

  const match = String(value).match(/^([\d.,]+)(.*)$/);
  const numStr = match ? match[1].replace(/,/g, '') : '';
  const suffix = match ? match[2] : String(value);
  const num = parseFloat(numStr);
  const formatted = isNaN(num) ? String(value) : num.toLocaleString();
  const chars = formatted.split('');

  let di = -1;
  return (
    <span ref={ref} className={`odometer ${className}`} style={style} role="text" aria-label={String(value)}>
      {chars.map((c, i) => {
        if (/\d/.test(c)) {
          di += 1;
          return <Reel key={i} digit={Number(c)} delay={di * 0.07} inView={inView} reduce={reduce} />;
        }
        return <span key={i} className="odo-sep" aria-hidden="true">{c}</span>;
      })}
      {suffix && <span className="odo-suffix" aria-hidden="true">{suffix}</span>}
    </span>
  );
}
