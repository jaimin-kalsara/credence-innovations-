import { motion } from 'framer-motion';

// City coordinates roughly mapped onto a 1000x600 viewBox of the continental US.
const cities = [
  { name: 'Seattle', x: 130, y: 95 }, { name: 'Portland', x: 120, y: 130 },
  { name: 'San Francisco', x: 90, y: 270 }, { name: 'Los Angeles', x: 145, y: 330 },
  { name: 'Las Vegas', x: 200, y: 290 }, { name: 'Phoenix', x: 235, y: 350 },
  { name: 'Denver', x: 365, y: 270 }, { name: 'Salt Lake City', x: 270, y: 230 },
  { name: 'Dallas', x: 470, y: 400 }, { name: 'Houston', x: 510, y: 440 },
  { name: 'Kansas City', x: 510, y: 270 }, { name: 'Minneapolis', x: 540, y: 160 },
  { name: 'Chicago', x: 620, y: 210 }, { name: 'Indianapolis', x: 660, y: 250, hq: true },
  { name: 'Nashville', x: 640, y: 330 }, { name: 'Atlanta', x: 700, y: 380 },
  { name: 'Miami', x: 800, y: 510 }, { name: 'Detroit', x: 690, y: 200 },
  { name: 'New York', x: 850, y: 215 }, { name: 'Boston', x: 885, y: 180 },
  { name: 'Philadelphia', x: 840, y: 240 }, { name: 'Washington DC', x: 815, y: 270 },
  { name: 'Charlotte', x: 745, y: 340 }, { name: 'Cleveland', x: 720, y: 220 },
];

// connections from Indianapolis HQ outward
const hq = cities.find((c) => c.hq);
const links = cities.filter((c) => !c.hq).slice(0, 14);

export default function USMap({ animated = false, interactive = false }) {
  return (
    <svg viewBox="0 0 1000 600" className="w-full h-auto" style={{ maxHeight: '60vh' }}>
      {/* faint silhouette frame */}
      <rect x="60" y="70" width="850" height="480" rx="40" fill="none" style={{ stroke: 'var(--hair-faint)' }} />

      {/* dot grid backdrop */}
      {Array.from({ length: 18 }).map((_, r) =>
        Array.from({ length: 30 }).map((_, c) => (
          <circle key={`${r}-${c}`} cx={70 + c * 29} cy={80 + r * 26} r="1" style={{ fill: 'var(--hair-faint)' }} />
        ))
      )}

      {/* connecting lines */}
      {animated && links.map((c, i) => (
        <motion.line
          key={`l-${i}`}
          x1={hq.x} y1={hq.y} x2={c.x} y2={c.y}
          stroke="var(--electric)" strokeWidth="1" opacity="0.35"
          initial={{ pathLength: 0 }}
          whileInView={{ pathLength: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, delay: 0.3 + i * 0.08, ease: 'easeOut' }}
        />
      ))}

      {/* city dots */}
      {cities.map((c, i) => (
        <g key={c.name}>
          <motion.circle
            cx={c.x} cy={c.y} r={c.hq ? 6 : 4}
            fill={c.hq ? 'var(--ember)' : 'var(--electric)'}
            initial={animated ? { scale: 0, opacity: 0 } : {}}
            whileInView={animated ? { scale: 1, opacity: 1 } : {}}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: i * 0.05 }}
            style={{ transformOrigin: `${c.x}px ${c.y}px` }}
          />
          <motion.circle
            cx={c.x} cy={c.y} r={c.hq ? 6 : 4}
            fill="none" stroke={c.hq ? 'var(--ember)' : 'var(--electric)'} strokeWidth="1"
            initial={{ scale: 1, opacity: 0.6 }}
            animate={{ scale: [1, 2.5], opacity: [0.6, 0] }}
            transition={{ duration: 2, repeat: Infinity, delay: i * 0.12, ease: 'easeOut' }}
            style={{ transformOrigin: `${c.x}px ${c.y}px` }}
          />
        </g>
      ))}
    </svg>
  );
}
