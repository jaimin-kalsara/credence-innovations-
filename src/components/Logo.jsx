/* Credence Innovations wordmark.
   Rendered as a crisp, vector-sharp serif lockup that inherits `currentColor`,
   so it automatically shows dark slate on light backgrounds and white on dark
   backgrounds (matching the two supplied logo versions). Set the overall size
   with `fontSize` on `style`; everything scales in `em`. */
export default function Logo({ className = '', style = {} }) {
  return (
    <span
      className={`ci-logo ${className}`}
      role="img"
      aria-label="Credence Innovations"
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        color: 'currentColor',
        fontFamily: "'Times New Roman', Georgia, 'Times', serif",
        lineHeight: 1,
        whiteSpace: 'nowrap',
        userSelect: 'none',
        ...style,
      }}
    >
      <span style={{ fontSize: '2.55em', lineHeight: 0.74, fontWeight: 400 }}>C</span>
      <span style={{ display: 'inline-flex', flexDirection: 'column', marginLeft: '0.05em' }}>
        <span style={{ fontSize: '1.12em', letterSpacing: '0.04em', fontWeight: 400 }}>REDENCE</span>
        <span style={{ fontSize: '0.5em', letterSpacing: '0.3em', fontWeight: 400, marginTop: '0.18em' }}>
          INNOVATIONS.
        </span>
      </span>
    </span>
  );
}
