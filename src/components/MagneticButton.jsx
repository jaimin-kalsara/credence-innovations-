import { useRef } from 'react';
import { Link } from 'react-router-dom';

export default function MagneticButton({ children, to, href, onClick, variant = 'solid', className = '', type, disabled = false }) {
  const ref = useRef(null);

  const handleMove = (e) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    el.style.transform = `translate(${x * 0.25}px, ${y * 0.35}px)`;
  };

  const handleLeave = () => {
    if (ref.current) ref.current.style.transform = 'translate(0,0)';
  };

  const cls = `mag-btn ${variant === 'outline' ? 'mag-btn-outline' : ''} ${className}`;
  const style = { transition: 'transform 0.3s cubic-bezier(0.2,0.8,0.2,1), box-shadow 0.3s' };

  const inner = (
    <>
      {children}
      <span style={{ display: 'inline-block', transition: 'transform 0.3s' }} className="arrow">→</span>
    </>
  );

  if (to) {
    return (
      <Link ref={ref} to={to} className={cls} style={style} onMouseMove={handleMove} onMouseLeave={handleLeave}>
        {inner}
      </Link>
    );
  }
  if (href) {
    return (
      <a ref={ref} href={href} className={cls} style={style} onMouseMove={handleMove} onMouseLeave={handleLeave}>
        {inner}
      </a>
    );
  }
  return (
    <button
      ref={ref}
      type={type || 'button'}
      onClick={onClick}
      disabled={disabled}
      aria-busy={disabled || undefined}
      className={cls}
      style={{ ...style, ...(disabled ? { opacity: 0.6, cursor: 'wait', pointerEvents: 'none' } : null) }}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
    >
      {inner}
    </button>
  );
}
