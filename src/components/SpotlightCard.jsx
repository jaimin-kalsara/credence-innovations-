import { useRef } from 'react';

/* Interactive spotlight card (21st.dev / Aceternity style): a soft, brand-tinted
   radial glow tracks the cursor inside the card on hover. Performance-safe — it
   only updates two CSS custom properties on pointer move and paints a radial
   gradient on the hovered card; nothing else on the page repaints. */
export default function SpotlightCard({
  as: Tag = 'div',
  className = '',
  style = {},
  children,
  ...rest
}) {
  const ref = useRef(null);

  const onPointerMove = (e) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    el.style.setProperty('--mx', `${e.clientX - r.left}px`);
    el.style.setProperty('--my', `${e.clientY - r.top}px`);
  };

  return (
    <Tag ref={ref} onPointerMove={onPointerMove} className={`spotlight ${className}`} style={style} {...rest}>
      {children}
    </Tag>
  );
}
