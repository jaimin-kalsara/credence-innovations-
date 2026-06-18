/* DrawUnderline — previously stroked a hand-drawn underline beneath the wrapped
   phrase. Decorative underlines were removed site-wide per design direction, so
   this now simply renders its children inline. The accent ("highlight") color is
   applied by the parent (e.g. the `.d-ital` electric span), so it is preserved.
   Kept as a component so every existing call-site keeps working unchanged. */
export default function DrawUnderline({ children, className = '' }) {
  return <span className={`relative inline-block ${className}`}>{children}</span>;
}
