/* CinematicImage — a framed image slot.
   • Give it a real photo via `src` and it shows the photo (object-cover) with an
     optional label tag + caption.
   • With NO src it renders a clean, on-brand PLACEHOLDER (a labelled frame with a
     small photo icon) so every slot is obviously ready for a real picture.
   Dropping a `src` in later turns the placeholder into the photo with zero layout
   change. */

function PhotoIcon({ size = 40 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="3" y="5" width="18" height="14" rx="2.5" />
      <circle cx="8.5" cy="10.5" r="1.8" />
      <path d="M21 15l-4.5-4.5L6 21" />
    </svg>
  );
}

export default function CinematicImage({
  src,
  label,
  caption,
  aspect = '16/9',
  index = 0, // eslint-disable-line no-unused-vars -- kept for API compatibility
  className = '',
  kenBurns = false,
  duotone = false, // eslint-disable-line no-unused-vars -- kept for API compatibility
  children,
}) {
  return (
    <div
      className={`ci-visual relative overflow-hidden ${className}`}
      style={{ aspectRatio: aspect, background: 'var(--graphite)' }}
      data-cursor="expand"
    >
      {src ? (
        <>
          <img
            src={src}
            alt={caption || label || 'Credence Innovations'}
            className="w-full h-full object-cover ci-photo"
            style={kenBurns ? { animation: 'kenburns 7s ease-out both' } : {}}
            loading="lazy"
          />
          {(label || caption) && (
            <div className="absolute inset-0 pointer-events-none" style={{ background: 'linear-gradient(180deg, transparent 45%, rgba(10,10,11,0.74) 100%)' }} />
          )}
          {label && (
            <span className="absolute top-4 left-4 font-mono text-[10px] tracking-widest uppercase px-2 py-1" style={{ color: '#F4F1EA', background: 'rgba(10,10,11,0.45)', backdropFilter: 'blur(4px)' }}>
              {label}
            </span>
          )}
          {caption && (
            <span className="absolute bottom-4 left-4 right-4 text-sm" style={{ color: '#F4F1EA' }}>{caption}</span>
          )}
        </>
      ) : (
        /* PLACEHOLDER — clean labelled frame, ready for a real photo */
        <div className="absolute inset-0 dot-grid flex flex-col items-center justify-center gap-3 px-5 text-center">
          <span style={{ color: 'var(--smoke)', opacity: 0.55 }}><PhotoIcon /></span>
          {label && (
            <span className="font-mono text-[10px] tracking-[0.18em] uppercase" style={{ color: 'var(--smoke)' }}>{label}</span>
          )}
          {caption && (
            <span className="font-mono text-[9px] tracking-[0.14em] uppercase" style={{ color: 'var(--smoke)', opacity: 0.6, maxWidth: '24ch' }}>{caption}</span>
          )}
        </div>
      )}
      {children}
    </div>
  );
}
