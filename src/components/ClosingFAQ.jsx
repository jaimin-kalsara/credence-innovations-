import { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

/* ClosingFAQ — an SEO / GEO friendly FAQ that sits at
   the bottom of every page (mounted globally in Layout). The questions and answers
   are plain, factual, and conversational so they read well for people, for search
   engines, and for AI answer engines. Every answer stays in the DOM even when the
   item is collapsed, so the content is always crawlable. The matching FAQPage +
   Organization structured data (JSON-LD) lives statically in index.html. */

export const FAQS = [
  {
    q: 'What does Credence Innovations do?',
    a: "Credence Innovations is a retail field marketing agency. We place trained brand representatives directly inside America's largest big-box retailers to launch, sell, and scale Fortune 500 brands face to face with real shoppers.",
  },
  {
    q: 'Which retailers does Credence Innovations operate inside?',
    a: "We operate inside all five of America's largest big-box retailers: Walmart, Target, Costco, Lowe's, and BJ's. We are the only field marketing partner active across all five.",
  },
  {
    q: 'What services does Credence Innovations offer?',
    a: 'We offer three core services. Retail Activation puts trained reps selling on the store floor. National Rollout scales a proven campaign from one market to many. New Product Launch drives education, demo, trial, and purchase at the exact moment a customer reaches the shelf.',
  },
  {
    q: 'Where is Credence Innovations located, and where do you operate?',
    a: 'Credence Innovations is headquartered in Indianapolis, Indiana. We run campaigns in more than 40 cities and reach over 99 percent of the U.S. population through our retail network.',
  },
  {
    q: 'What kinds of brands does Credence Innovations work with?',
    a: 'We work with Fortune 500 and high-growth brands that need real in-store sales and market expansion, across categories like telecom, energy, home services, and consumer products.',
  },
  {
    q: 'How does Credence Innovations help a brand grow?',
    a: 'We put trained people on the floor where buying decisions happen, prove what converts in one market, then replicate it nationwide with the same standard, so brands scale without losing quality or consistency.',
  },
  {
    q: 'What makes Credence Innovations different from other marketing agencies?',
    a: 'Most agencies sell decks. We sell products. Our representatives work inside the store, face to face with customers, and we are the only partner operating across all five major big-box retailers.',
  },
  {
    q: 'How many campaigns has Credence Innovations run?',
    a: 'Credence Innovations has run more than 211 campaigns across 40 plus cities over 9 plus years, reaching 99 percent of the U.S. population.',
  },
  {
    q: 'How can my brand partner with Credence Innovations?',
    a: "Reach out through our Contact page or email hr@credenceinnovations.com to start a conversation about placing your brand inside Walmart, Target, Costco, Lowe's, and BJ's.",
  },
  {
    q: 'Does Credence Innovations hire, and how do I join the team?',
    a: 'Yes. We hire and train brand representatives and campaign managers. Visit our Careers page to see open roles and apply.',
  },
];

const EXPO = [0.16, 1, 0.3, 1];

function FaqItem({ item, index, open, onToggle, reduce }) {
  const qid = `faq-q-${index}`;
  const aid = `faq-a-${index}`;
  return (
    <div style={{ borderTop: '1px solid var(--hair)' }}>
      <h3 style={{ margin: 0 }}>
        <button
          id={qid} aria-expanded={open} aria-controls={aid} onClick={onToggle}
          className="w-full flex items-start justify-between gap-6 text-left py-6"
          style={{ cursor: 'pointer', background: 'transparent' }}
        >
          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 500, fontSize: 'clamp(18px, 2vw, 24px)', lineHeight: 1.25, color: open ? 'var(--electric)' : 'var(--bone)', transition: 'color 0.3s ease' }}>
            {item.q}
          </span>
          <span aria-hidden="true" className="shrink-0 grid place-items-center" style={{ width: 30, height: 30, marginTop: 3, color: 'var(--electric)', transform: open ? 'rotate(45deg)' : 'none', transition: 'transform 0.4s var(--ease-out-quart)' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
              <path d="M12 5v14M5 12h14" />
            </svg>
          </span>
        </button>
      </h3>
      {/* answer stays mounted (crawlable) even when collapsed; height animates */}
      <motion.div
        id={aid} role="region" aria-labelledby={qid}
        initial={false} animate={{ height: open ? 'auto' : 0, opacity: open ? 1 : 0 }}
        transition={{ duration: reduce ? 0 : 0.4, ease: EXPO }}
        style={{ overflow: 'hidden' }}
      >
        <p className="body-lg" style={{ color: 'var(--smoke)', paddingBottom: 28, maxWidth: '72ch' }}>
          {item.a}
        </p>
      </motion.div>
    </div>
  );
}

export default function ClosingFAQ() {
  const reduce = useReducedMotion();
  const [open, setOpen] = useState(() => new Set([0])); // first answer open by default
  const toggle = (i) =>
    setOpen((prev) => {
      const next = new Set(prev);
      next.has(i) ? next.delete(i) : next.add(i);
      return next;
    });

  return (
    <section className="paper pad-lg" aria-labelledby="faq-heading">
        <div className="shell">
          <div className="grid lg:grid-cols-[minmax(280px,360px)_1fr] gap-10 lg:gap-16 items-start">
            <div className="lg:sticky lg:top-28">
              <span className="eyebrow block mb-5">FAQ</span>
              <h2 id="faq-heading" className="t-display-m" style={{ fontFamily: 'var(--font-display)', color: 'var(--bone)', lineHeight: 1.05 }}>
                Questions,{' '}
                <span className="d-ital" style={{ color: 'var(--electric)' }}>answered.</span>
              </h2>
              <p className="body mt-5" style={{ color: 'var(--smoke)', maxWidth: '34ch' }}>
                What we do, who we work with, and how to bring your brand into the country's biggest stores.
              </p>
            </div>

            <div style={{ borderBottom: '1px solid var(--hair)' }}>
              {FAQS.map((item, i) => (
                <FaqItem key={i} item={item} index={i} open={open.has(i)} onToggle={() => toggle(i)} reduce={reduce} />
              ))}
            </div>
          </div>
        </div>
      </section>
  );
}
