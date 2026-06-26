import { useState } from 'react';
import { logoFor } from '../data/logos';

/* BrandLogo — a client/retailer logo on a light "plate" so colored or dark
   logos stay legible on the site's dark sections and the cream theme alike.

   Resilient by design: if the logo file is missing (or fails to load), it
   degrades gracefully instead of showing a broken image —
     • fallback="name" (default) → renders the brand name on the plate
       (good for logo walls / marquees, so there's never a hole)
     • fallback="hide"            → renders nothing (good where the brand name
       already appears right next to it, e.g. retailer doors / ledgers)
   So a logo can be wired in advance: drop the file in and it lights up
   everywhere automatically, with zero code changes.

   Props: name, logo (omit to resolve by name; null forces fallback),
   height (px), fallback ('name' | 'hide'), className, style. */
export default function BrandLogo({ name, logo, height = 34, fallback = 'name', className = '', style }) {
  const resolved = logo !== undefined ? logo : logoFor(name);
  const [errored, setErrored] = useState(false);
  const showImg = resolved && !errored;

  if (!showImg && fallback === 'hide') return null;

  return (
    <span className={`brand-plate ${className}`.trim()} style={style} title={name}>
      {showImg ? (
        <img
          className="brand-img"
          src={resolved}
          alt={name}
          draggable="false"
          style={{ height }}
          onError={() => setErrored(true)}
        />
      ) : (
        <span className="brand-name">{name}</span>
      )}
    </span>
  );
}
