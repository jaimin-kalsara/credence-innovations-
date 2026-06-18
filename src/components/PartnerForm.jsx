import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import MagneticButton from './MagneticButton';

const industries = ['Telecom', 'Home Services', 'Energy', 'Consumer Electronics', 'Financial Services', 'Nonprofit', 'Other'];
const revenues = ['<$1M', '$1–10M', '$10–50M', '$50M–$500M', '$500M+'];
const retailers = ['Walmart', 'Target', 'Costco', "Lowe's", "BJ's", 'Other'];
const markets = ['National', 'Northeast', 'Midwest', 'South', 'West'];

function Field({ label, children }) {
  return (
    <label className="block">
      <span className="eyebrow block mb-2" style={{ color: 'var(--smoke)' }}>{label}</span>
      {children}
    </label>
  );
}

function Chips({ options, selected, onToggle }) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((opt) => {
        const active = selected.includes(opt);
        return (
          <button
            key={opt}
            type="button"
            onClick={() => onToggle(opt)}
            className="px-4 py-2 text-sm transition-all duration-300 border"
            style={{
              borderColor: active ? 'var(--electric)' : 'var(--divider)',
              background: active ? 'rgba(91,150,181,0.15)' : 'transparent',
              color: active ? 'var(--bone)' : 'var(--smoke)',
            }}
          >
            {opt}
          </button>
        );
      })}
    </div>
  );
}

export default function PartnerForm({ compact = false }) {
  const [submitted, setSubmitted] = useState(false);
  const [targetRetailers, setTargetRetailers] = useState([]);
  const [targetMarkets, setTargetMarkets] = useState([]);

  const toggle = (setter, list) => (v) =>
    setter(list.includes(v) ? list.filter((x) => x !== v) : [...list, v]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="relative">
      <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-6">
        <Field label="Full name *">
          <input required className="form-input" placeholder="Jane Doe" />
        </Field>
        <Field label="Work email *">
          <input required type="email" className="form-input" placeholder="jane@company.com" />
        </Field>
        <Field label="Company *">
          <input required className="form-input" placeholder="Company Inc." />
        </Field>
        <Field label="Role / title *">
          <input required className="form-input" placeholder="VP of Sales" />
        </Field>
        <Field label="Industry *">
          <select required className="form-input" defaultValue="">
            <option value="" disabled>Select industry</option>
            {industries.map((i) => <option key={i}>{i}</option>)}
          </select>
        </Field>
        <Field label="Annual revenue (optional)">
          <select className="form-input" defaultValue="">
            <option value="">Select range</option>
            {revenues.map((r) => <option key={r}>{r}</option>)}
          </select>
        </Field>
        <div className="md:col-span-2">
          <Field label="What are you launching or scaling? *">
            <textarea required rows={4} className="form-input resize-none" placeholder="Tell us about your brand and goals…" />
          </Field>
        </div>
        <div className="md:col-span-2">
          <Field label="Target retailers (optional)">
            <Chips options={retailers} selected={targetRetailers} onToggle={toggle(setTargetRetailers, targetRetailers)} />
          </Field>
        </div>
        <div className="md:col-span-2">
          <Field label="Target markets (optional)">
            <Chips options={markets} selected={targetMarkets} onToggle={toggle(setTargetMarkets, targetMarkets)} />
          </Field>
        </div>

        <div className="md:col-span-2 flex flex-col sm:flex-row items-start sm:items-center gap-6 mt-2">
          <MagneticButton type="submit" className="shrink-0">Request a partnership call</MagneticButton>
          <p className="text-sm" style={{ color: 'var(--smoke)' }}>
            We respond within one business day. No decks, no pressure — just a conversation.
          </p>
        </div>
      </form>

      <AnimatePresence>
        {submitted && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 flex flex-col items-center justify-center text-center z-20 px-6"
            style={{ background: 'var(--graphite)', minHeight: 400 }}
          >
            {/* confetti */}
            {Array.from({ length: 30 }).map((_, i) => (
              <span key={i} style={{
                position: 'absolute',
                top: '30%',
                left: `${20 + Math.random() * 60}%`,
                width: 8, height: 8,
                background: i % 2 ? 'var(--ember)' : 'var(--electric)',
                animation: `confetti-fall ${1 + Math.random()}s ease-out ${Math.random() * 0.3}s forwards`,
              }} />
            ))}
            <motion.div
              initial={{ scale: 0.8, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              transition={{ delay: 0.1, ease: [0.2, 0.8, 0.2, 1] }}
            >
              <div className="w-16 h-16 mx-auto mb-6 rounded-full flex items-center justify-center"
                style={{ border: '2px solid var(--electric)' }}>
                <span style={{ color: 'var(--electric)', fontSize: 28 }}>✓</span>
              </div>
              <h3 className="font-display text-3xl mb-4" style={{ color: 'var(--bone)' }}>Got it.</h3>
              <p className="text-base max-w-md" style={{ color: 'var(--smoke)' }}>
                A partnerships lead will be in touch within one business day.
              </p>
              <button onClick={() => setSubmitted(false)} className="mt-8 anim-link text-sm" style={{ color: 'var(--electric)' }}>
                Submit another inquiry
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
