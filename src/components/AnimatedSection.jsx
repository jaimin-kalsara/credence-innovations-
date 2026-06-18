import { motion } from 'framer-motion';

export function FadeUp({ children, delay = 0, className = '', style = {} }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.7, delay, ease: [0.2, 0.8, 0.2, 1] }}
      className={className}
      style={style}
    >
      {children}
    </motion.div>
  );
}

export function StaggerChildren({ children, className = '', stagger = 0.08 }) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-60px' }}
      variants={{ visible: { transition: { staggerChildren: stagger } } }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({ children, className = '' }) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.2, 0.8, 0.2, 1] } },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function SplitText({ text, className = '', style = {}, delay = 0 }) {
  const words = text.split(' ');
  return (
    <motion.span
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-60px' }}
      className={className}
      style={{ display: 'inline-block', ...style }}
    >
      {words.map((word, wi) => (
        <span
          key={wi}
          style={{
            display: 'inline-block',
            overflow: 'hidden',
            marginRight: '0.25em',
            // The reveal mask must clip the word while it slides up, but the tight
            // display line-height would otherwise slice tall Fraunces caps/descenders.
            // Pad the clip box vertically and cancel it with negative margins so the
            // glyphs get room while the line spacing stays exactly the same.
            paddingTop: '0.22em',
            paddingBottom: '0.16em',
            marginTop: '-0.22em',
            marginBottom: '-0.16em',
          }}
        >
          <motion.span
            variants={{
              hidden: { y: '120%' },
              visible: { y: 0, transition: { duration: 0.65, delay: delay + wi * 0.04, ease: [0.2, 0.8, 0.2, 1] } },
            }}
            style={{ display: 'inline-block' }}
          >
            {word}
          </motion.span>
        </span>
      ))}
    </motion.span>
  );
}

export function ClipReveal({ children, className = '', delay = 0 }) {
  return (
    <motion.div
      initial={{ clipPath: 'inset(0 100% 0 0)' }}
      whileInView={{ clipPath: 'inset(0 0% 0 0)' }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.9, delay, ease: [0.2, 0.8, 0.2, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function Counter({ value, suffix = '', className = '' }) {
  const numericValue = parseFloat(String(value).replace(/[^0-9.]/g, ''));

  return (
    <motion.span
      className={className}
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
    >
      <motion.span
        initial={0}
        whileInView={numericValue}
        viewport={{ once: true }}
        transition={{ duration: 1.5, ease: 'easeOut' }}
        onUpdate={(latest) => {}}
      >
        {({ latest }) => Math.floor(latest)}
      </motion.span>
      {suffix}
    </motion.span>
  );
}
