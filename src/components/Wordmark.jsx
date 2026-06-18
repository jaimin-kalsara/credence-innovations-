// Stylized monochrome wordmarks used as logo placeholders.
// Real brand logos to be dropped in by the client (permissions pending per content doc 13.1).

export default function Wordmark({ name, className = '' }) {
  const styles = {
    fontFamily: 'Inter, sans-serif',
    fontWeight: 600,
    letterSpacing: '-0.02em',
    whiteSpace: 'nowrap',
  };

  return (
    <span className={className} style={styles}>
      {name}
    </span>
  );
}

export const RETAILERS = ['Walmart', 'Target', 'Costco', "Lowe's", "BJ's"];
export const CLIENTS = ['AT&T', 'Apple', 'LeafFilter', 'Just Energy'];
