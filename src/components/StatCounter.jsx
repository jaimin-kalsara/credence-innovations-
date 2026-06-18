import Odometer from './Odometer';

export default function StatCounter({ value, label }) {
  return (
    <div className="text-center">
      <div style={{ marginBottom: 8 }}>
        <Odometer value={value} className="stat-num" style={{ fontSize: 'clamp(48px, 8vw, 100px)', lineHeight: 1 }} />
      </div>
      <p className="font-mono text-xs tracking-widest uppercase" style={{ color: 'var(--smoke)' }}>
        {label}
      </p>
    </div>
  );
}
