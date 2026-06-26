import { useState, useRef, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { motion, AnimatePresence, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { ROLES } from '../data/roles';

const EXPO = [0.16, 1, 0.3, 1];
const SPRING = { type: 'spring', stiffness: 130, damping: 21, mass: 1 };
const HR_EMAIL = 'hr@credenceinnovations.com';
const ROLE_OPTIONS = [...ROLES.map((r) => r.title), 'Other'];
const PERKS = [
  { t: 'Paid training', d: 'Built from the floor up — no experience needed.' },
  { t: 'Real growth', d: 'A clear path from rep to leadership and ownership.' },
  { t: 'Travel, on us', d: 'Conferences, retreats and leadership summits.' },
  { t: 'Weekly pay', d: 'Performance rewarded — every single week.' },
];
const CONFETTI = Array.from({ length: 26 }, (_, i) => ({ l: 8 + (i * 3.4) % 84, d: 0.6 + ((i * 7) % 9) / 10, delay: ((i * 5) % 6) / 20, c: i % 2 ? 'var(--electric)' : 'var(--ember)' }));

export default function Apply() {
  const reduce = useReducedMotion();
  const [params] = useSearchParams();
  const fileRef = useRef(null);
  const sectionRef = useRef(null);

  const roleFromUrl = (() => { const r = ROLES.find((x) => x.slug === params.get('role')); return r ? r.title : ''; })();
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', phone: '', role: roleFromUrl, social: '' });
  const [fileName, setFileName] = useState('');
  const [status, setStatus] = useState('idle'); // idle | sending | done
  const [error, setError] = useState('');
  const [selectOpen, setSelectOpen] = useState(false);
  const selectRef = useRef(null);

  useEffect(() => {
    if (!selectOpen) return undefined;
    const onDown = (e) => { if (selectRef.current && !selectRef.current.contains(e.target)) setSelectOpen(false); };
    const onKey = (e) => { if (e.key === 'Escape') setSelectOpen(false); };
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey);
    return () => { document.removeEventListener('mousedown', onDown); document.removeEventListener('keydown', onKey); };
  }, [selectOpen]);

  useEffect(() => {
    if (window.__lenis) window.__lenis.scrollTo(0, { immediate: true });
    window.scrollTo(0, 0);
    document.title = 'Apply · Credence Innovations';
    return () => { document.title = 'Credence Innovations'; };
  }, []);

  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start end', 'end start'] });
  const bgY = useTransform(scrollYProgress, [0, 1], reduce ? ['0%', '0%'] : ['-4%', '4%']);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = (e) => {
    e.preventDefault();
    setError('');
    if (!form.firstName || !form.lastName || !form.email || !form.phone || !form.role) {
      setError('Please add your name, email, phone, and the role you want.');
      return;
    }
    setStatus('sending');
    const lines = [
      `Role: ${form.role}`,
      `Name: ${form.firstName} ${form.lastName}`,
      `Email: ${form.email}`,
      `Phone: ${form.phone}`,
      `Social / profile: ${form.social || '—'}`,
      `Resume: ${fileName || 'to be attached by applicant'}`,
    ].join('\n');

    const key = import.meta.env.VITE_WEB3FORMS_KEY;
    if (key) {
      const fd = new FormData();
      fd.append('access_key', key);
      fd.append('subject', `New application — ${form.role} — ${form.firstName} ${form.lastName}`);
      fd.append('from_name', 'Credence Careers');
      fd.append('Role', form.role);
      fd.append('Name', `${form.firstName} ${form.lastName}`);
      fd.append('Email', form.email);
      fd.append('Phone', form.phone);
      fd.append('Social', form.social || '—');
      if (fileRef.current?.files?.[0]) fd.append('attachment', fileRef.current.files[0]);
      fetch('https://api.web3forms.com/submit', { method: 'POST', body: fd })
        .then((r) => r.json())
        .then((j) => { if (j.success) setStatus('done'); else throw new Error(j.message); })
        .catch(() => { setStatus('idle'); setError(`Couldn't submit automatically — please email ${HR_EMAIL} directly.`); });
    } else {
      const subject = `Job Application — ${form.role} — ${form.firstName} ${form.lastName}`;
      const body = `New application via the Credence Innovations website.\n\n${lines}\n\nPlease attach your resume to this email before sending. Thank you!`;
      window.location.href = `mailto:${HR_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      setStatus('done');
    }
  };

  const field = (key, label, type = 'text', extra = {}) => (
    <div className={`af-field ${form[key] ? 'filled' : ''}`}>
      <input className="af-input" type={type} value={form[key]} onChange={set(key)} placeholder=" " autoComplete={extra.ac || 'off'} {...extra.attrs} />
      <label>{label}</label>
      <span className="af-underline" aria-hidden="true" />
    </div>
  );
  const up = (delay = 0) => ({
    initial: reduce ? { opacity: 0 } : { opacity: 0, y: 20, filter: 'blur(4px)' },
    animate: { opacity: 1, y: 0, filter: 'blur(0px)' },
    transition: { duration: 0.6, delay, ease: EXPO },
  });

  return (
    <section ref={sectionRef} className="af-section paper relative overflow-hidden" aria-label="Apply to Credence Innovations">
      <style>{`
        .af-section { isolation: isolate; padding-top: clamp(96px, 13vh, 168px); padding-bottom: clamp(56px, 8vw, 110px);
          background: radial-gradient(56% 40% at 86% 4%, color-mix(in srgb, var(--electric) 10%, transparent), transparent 60%),
            radial-gradient(52% 38% at 4% 96%, color-mix(in srgb, var(--ember) 8%, transparent), transparent 62%), var(--ink); }
        .af-bg { position: absolute; inset: 0; z-index: 0; pointer-events: none; overflow: hidden; }
        .af-orb { position: absolute; border-radius: 50%; filter: blur(96px); }
        .af-orb-1 { width: 34vw; max-width: 500px; aspect-ratio: 1; right: -8%; top: -4%; background: radial-gradient(circle, color-mix(in srgb, var(--electric) 14%, transparent), transparent 64%); }
        .af-orb-2 { width: 30vw; max-width: 440px; aspect-ratio: 1; left: -8%; bottom: -6%; background: radial-gradient(circle, color-mix(in srgb, var(--ember) 11%, transparent), transparent 64%); }
        .af-mark { position: absolute; z-index: 0; right: -1%; top: 8%; font-family: var(--font-display); font-weight: 600; font-style: italic;
          font-size: clamp(140px, 22vw, 360px); line-height: 0.7; color: transparent; -webkit-text-stroke: 1.4px color-mix(in srgb, var(--bone) 10%, transparent); pointer-events: none; user-select: none; }
        .af-inner { position: relative; z-index: 2; }
        .af-grid { display: grid; grid-template-columns: 1fr; gap: clamp(36px, 5vw, 60px); align-items: start; }
        @media (min-width: 940px) { .af-grid { grid-template-columns: minmax(0, 0.82fr) minmax(0, 1.18fr); column-gap: clamp(48px, 5vw, 84px); } }

        /* left editorial */
        .af-aside { position: relative; }
        @media (min-width: 940px) { .af-aside { position: sticky; top: clamp(96px, 12vh, 140px); } }
        .af-back { display: inline-flex; align-items: center; gap: 8px; font-family: 'JetBrains Mono', monospace; font-size: 11px; letter-spacing: 0.16em; text-transform: uppercase; color: var(--smoke); }
        .af-eyebrow { display: inline-flex; align-items: center; gap: 9px; margin-top: clamp(20px, 2.6vw, 30px); padding: 7px 15px; border-radius: 999px;
          font-family: 'JetBrains Mono', monospace; font-size: 10px; letter-spacing: 0.2em; text-transform: uppercase; color: var(--bone);
          background: color-mix(in srgb, var(--graphite) 52%, transparent); border: 1px solid color-mix(in srgb, var(--electric) 26%, var(--hair)); }
        .af-eyebrow .dot { width: 6px; height: 6px; border-radius: 50%; background: var(--electric); box-shadow: 0 0 10px var(--electric); }
        .af-h { font-family: var(--font-display); color: var(--bone); line-height: 1.0; letter-spacing: -0.02em; font-size: clamp(36px, 4.6vw, 60px); margin-top: clamp(14px, 1.6vw, 20px); }
        .af-h .it { font-style: italic; font-weight: 500; background: linear-gradient(100deg, var(--electric), #6FB6D9 55%, var(--electric)); -webkit-background-clip: text; background-clip: text; -webkit-text-fill-color: transparent; color: var(--electric); }
        .af-rolebadge { display: inline-flex; align-items: center; gap: 9px; margin-top: clamp(16px, 2vw, 22px); padding: 9px 15px; border-radius: 12px;
          font-family: 'JetBrains Mono', monospace; font-size: 10px; letter-spacing: 0.12em; text-transform: uppercase; color: var(--bone);
          background: color-mix(in srgb, var(--electric) 12%, transparent); border: 1px solid color-mix(in srgb, var(--electric) 30%, transparent); }
        .af-intro { color: var(--smoke); font-size: clamp(15px, 1.1vw, 16.5px); line-height: 1.6; margin-top: clamp(16px, 1.8vw, 22px); max-width: 42ch; }
        .af-perks { margin-top: clamp(24px, 3vw, 34px); display: flex; flex-direction: column; }
        .af-perk { display: flex; gap: 14px; padding: clamp(13px, 1.4vw, 16px) 0; border-top: 1px solid var(--hair); }
        .af-perk:first-child { border-top: none; }
        .af-perk .ic { flex: none; width: 24px; height: 24px; border-radius: 8px; display: grid; place-items: center; color: var(--electric); background: color-mix(in srgb, var(--electric) 14%, transparent); margin-top: 1px; }
        .af-perk .ic svg { width: 13px; height: 13px; }
        .af-perk-t { font-family: var(--font-display); font-weight: 600; color: var(--bone); font-size: 15.5px; line-height: 1.1; }
        .af-perk-d { color: var(--smoke); font-size: 13px; line-height: 1.45; margin-top: 3px; }
        .af-hr { font-family: 'JetBrains Mono', monospace; font-size: 10px; letter-spacing: 0.12em; text-transform: uppercase; color: var(--smoke); margin-top: clamp(22px, 2.6vw, 30px); }
        .af-hr a { color: var(--electric); }

        /* form — underline fields, no boxes */
        .af-form { position: relative; }
        .af-row { display: grid; grid-template-columns: 1fr; gap: clamp(20px, 2.4vw, 30px); }
        @media (min-width: 560px) { .af-row { grid-template-columns: 1fr 1fr; } }
        .af-field { position: relative; padding-top: 22px; }
        .af-field label { position: absolute; left: 0; top: 24px; color: var(--smoke); pointer-events: none; font-size: 16px; transition: all .25s var(--ease-out-expo); }
        .af-field:focus-within label, .af-field.filled label { top: 0; font-size: 10.5px; letter-spacing: 0.14em; text-transform: uppercase; color: var(--electric); }
        .af-input { width: 100%; background: transparent; border: none; border-bottom: 1.5px solid var(--hair); padding: 6px 0 11px; color: var(--bone); font-size: 16px; font-family: inherit; outline: none; }
        /* custom dropdown — the native <select> option list can't be themed (it's OS-drawn) */
        .af-cselect.open { z-index: 30; }
        .af-cselect-btn { display: flex; align-items: center; justify-content: space-between; gap: 12px; width: 100%; text-align: left; background: transparent; border: none; border-bottom: 1.5px solid var(--hair); padding: 6px 0 11px; color: var(--bone); font-size: 16px; font-family: inherit; cursor: pointer; outline: none; }
        .af-cselect-val { color: var(--bone); min-height: 1.2em; }
        .af-cselect-chev { width: 13px; height: 13px; flex: none; color: var(--smoke); transition: transform .35s var(--ease-out-expo), color .3s ease; }
        .af-cselect.open .af-cselect-chev { transform: rotate(180deg); color: var(--electric); }
        .af-cselect.open .af-underline { transform: scaleX(1); }
        .af-cselect-menu { position: absolute; left: 0; right: 0; top: calc(100% + 8px); z-index: 30; list-style: none; margin: 0; padding: 7px; border-radius: 16px;
          background: var(--graphite); border: 1px solid var(--hair); box-shadow: 0 34px 70px -28px var(--shadow-card), inset 0 1px 0 rgba(255,255,255,0.05); }
        [data-theme="dark"] .af-cselect-menu { background: linear-gradient(160deg, #1f2a30, #161f24); border-color: rgba(255,255,255,0.12); }
        .af-cselect-opt { display: flex; align-items: center; justify-content: space-between; gap: 12px; width: 100%; text-align: left; padding: 12px 14px; border-radius: 11px; border: none; background: transparent; cursor: pointer; color: var(--bone); font-size: 15px; transition: background .22s ease, color .22s ease; }
        .af-cselect-opt:hover, .af-cselect-opt:focus-visible { background: color-mix(in srgb, var(--electric) 14%, transparent); outline: none; }
        .af-cselect-opt.on { color: var(--electric); background: color-mix(in srgb, var(--electric) 12%, transparent); }
        .af-cselect-opt .chk { width: 15px; height: 15px; flex: none; }
        .af-underline { position: absolute; left: 0; bottom: 0; height: 1.5px; width: 100%; background: linear-gradient(90deg, var(--electric), var(--ember)); transform: scaleX(0); transform-origin: left; transition: transform .45s var(--ease-out-expo); }
        .af-field:focus-within .af-underline { transform: scaleX(1); }

        .af-file { display: flex; align-items: center; gap: 14px; width: 100%; padding: 16px 0; border-bottom: 1.5px solid var(--hair); cursor: pointer; transition: border-color .3s ease; }
        .af-file:hover { border-color: color-mix(in srgb, var(--electric) 50%, var(--hair)); }
        .af-file-ic { flex: none; width: 40px; height: 40px; border-radius: 12px; display: grid; place-items: center; color: var(--electric); background: color-mix(in srgb, var(--electric) 12%, transparent); border: 1px dashed color-mix(in srgb, var(--electric) 40%, transparent); }
        .af-file-t { color: var(--bone); font-size: 15px; }
        .af-file-s { display: block; color: var(--smoke); font-size: 12px; margin-top: 2px; }
        .af-file.has .af-file-ic { border-style: solid; }

        .af-err { color: var(--ember); font-size: 13px; margin-top: 18px; }
        .af-actions { display: flex; flex-wrap: wrap; align-items: center; gap: 16px 22px; margin-top: clamp(28px, 3vw, 38px); }
        .af-submit { position: relative; display: inline-flex; align-items: center; gap: 11px; padding: 15px 26px; border-radius: 999px; border: none; cursor: pointer;
          font-family: 'JetBrains Mono', monospace; font-size: 11.5px; letter-spacing: 0.16em; text-transform: uppercase; color: var(--ink); background: var(--bone);
          box-shadow: 0 22px 48px -22px var(--shadow-card); transition: transform .4s var(--ease-out-expo), box-shadow .4s ease, opacity .3s ease; overflow: hidden; }
        .af-submit:hover { transform: translateY(-3px); box-shadow: 0 30px 60px -24px var(--shadow-card), 0 0 0 1px color-mix(in srgb, var(--electric) 40%, transparent); }
        .af-submit:disabled { opacity: 0.7; cursor: default; transform: none; }
        .af-submit .spin { width: 15px; height: 15px; border-radius: 50%; border: 2px solid color-mix(in srgb, var(--ink) 30%, transparent); border-top-color: var(--ink); animation: af-spin .7s linear infinite; }
        @keyframes af-spin { to { transform: rotate(360deg); } }
        .af-note { font-family: 'JetBrains Mono', monospace; font-size: 10px; letter-spacing: 0.1em; text-transform: uppercase; color: var(--smoke); }

        /* success */
        .af-done { position: relative; text-align: center; padding: clamp(20px, 4vw, 50px) 0; }
        .af-check { width: 76px; height: 76px; border-radius: 50%; display: grid; place-items: center; margin: 0 auto clamp(20px, 2.4vw, 28px);
          background: color-mix(in srgb, var(--electric) 16%, transparent); border: 1px solid color-mix(in srgb, var(--electric) 40%, transparent); color: var(--electric); }
        .af-done-h { font-family: var(--font-display); color: var(--bone); font-size: clamp(26px, 3vw, 40px); line-height: 1.05; }
        .af-done-p { color: var(--smoke); font-size: clamp(14px, 1.1vw, 16px); line-height: 1.6; max-width: 44ch; margin: 14px auto 0; }
        .af-done-p b { color: var(--electric); }
        .af-confetti { position: absolute; inset: 0; pointer-events: none; overflow: hidden; }
        .af-confetti i { position: absolute; top: 12%; width: 8px; height: 12px; border-radius: 2px; }

        @media (prefers-reduced-motion: reduce) { .af-submit .spin { animation: none; } }
      `}</style>

      <motion.div className="af-bg" aria-hidden="true" style={{ y: bgY }}>
        <span className="af-orb af-orb-1" /><span className="af-orb af-orb-2" />
      </motion.div>
      <span className="af-mark" aria-hidden="true">Join</span>

      <div className="shell af-inner">
        <div className="af-grid">
          {/* editorial */}
          <aside className="af-aside">
            <motion.div {...up(0)}><Link to={params.get('role') ? `/careers/${params.get('role')}` : '/careers'} className="af-back anim-link"><span aria-hidden="true">←</span> Back to roles</Link></motion.div>
            <motion.span className="af-eyebrow" {...up(0.05)}><span className="dot" aria-hidden="true" />Join us</motion.span>
            <motion.h2 className="af-h" {...up(0.1)}>Let&apos;s build your <span className="it">career.</span></motion.h2>
            {roleFromUrl && <motion.span className="af-rolebadge" {...up(0.16)}>Applying for · {roleFromUrl}</motion.span>}
            <motion.p className="af-intro" {...up(0.2)}>Tell us a little about you and attach your resume. Real people read every application — we reply within 48 hours.</motion.p>
            <div className="af-perks">
              {PERKS.map((p, i) => (
                <motion.div className="af-perk" key={p.t} {...up(0.26 + i * 0.06)}>
                  <span className="ic" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12l5 5L20 6" /></svg></span>
                  <div><div className="af-perk-t">{p.t}</div><div className="af-perk-d">{p.d}</div></div>
                </motion.div>
              ))}
            </div>
            <motion.p className="af-hr" {...up(0.5)}>Questions? <a href={`mailto:${HR_EMAIL}`}>{HR_EMAIL}</a></motion.p>
          </aside>

          {/* form / success */}
          <div className="af-form">
            <AnimatePresence mode="wait">
              {status === 'done' ? (
                <motion.div key="done" className="af-done" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.5, ease: EXPO }}>
                  {!reduce && <span className="af-confetti" aria-hidden="true">{CONFETTI.map((c, i) => (
                    <motion.i key={i} style={{ left: `${c.l}%`, background: c.c }}
                      initial={{ y: 0, opacity: 0, rotate: 0 }} animate={{ y: [0, 320], opacity: [0, 1, 1, 0], rotate: 360 }}
                      transition={{ duration: c.d + 0.8, delay: c.delay, ease: 'easeOut' }} />
                  ))}</span>}
                  <motion.div className="af-check" initial={{ scale: 0, rotate: -20 }} animate={{ scale: 1, rotate: 0 }} transition={reduce ? { duration: 0.3 } : { ...SPRING, delay: 0.1 }}>
                    <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><motion.path d="M5 12l5 5L20 6" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.5, delay: 0.25, ease: EXPO }} /></svg>
                  </motion.div>
                  <h3 className="af-done-h">Application on its way.</h3>
                  <p className="af-done-p">Your details are headed to <b>{HR_EMAIL}</b>. If your email app just opened, attach your resume and hit send — we&apos;ll be in touch within 48 hours.</p>
                  <div className="af-actions" style={{ justifyContent: 'center' }}>
                    <button className="af-submit" onClick={() => { setStatus('idle'); }}>Submit another</button>
                    <Link to="/careers" className="af-note anim-link">Back to careers →</Link>
                  </div>
                </motion.div>
              ) : (
                <motion.form key="form" onSubmit={submit} noValidate initial={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <motion.div className="af-row" {...up(0.12)}>
                    {field('firstName', 'First name', 'text', { ac: 'given-name' })}
                    {field('lastName', 'Last name', 'text', { ac: 'family-name' })}
                  </motion.div>
                  <motion.div className="af-row" style={{ marginTop: 'clamp(20px,2.4vw,30px)' }} {...up(0.18)}>
                    {field('email', 'Email', 'email', { ac: 'email' })}
                    {field('phone', 'Phone', 'tel', { ac: 'tel' })}
                  </motion.div>
                  <motion.div ref={selectRef} className={`af-field af-cselect ${form.role ? 'filled' : ''} ${selectOpen ? 'open' : ''}`} style={{ marginTop: 'clamp(20px,2.4vw,30px)' }} {...up(0.24)}>
                    <button type="button" className="af-cselect-btn" onClick={() => setSelectOpen((o) => !o)} aria-haspopup="listbox" aria-expanded={selectOpen}>
                      <span className="af-cselect-val">{form.role || ' '}</span>
                      <svg className="af-cselect-chev" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M2 4l4 4 4-4" /></svg>
                    </button>
                    <label>What are you applying for?</label>
                    <span className="af-underline" aria-hidden="true" />
                    <AnimatePresence>
                      {selectOpen && (
                        <motion.ul className="af-cselect-menu" role="listbox"
                          initial={reduce ? { opacity: 0 } : { opacity: 0, y: 8, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={reduce ? { opacity: 0 } : { opacity: 0, y: 6, scale: 0.98 }} transition={{ duration: 0.2, ease: EXPO }}>
                          {ROLE_OPTIONS.map((opt) => (
                            <li key={opt}>
                              <button type="button" role="option" aria-selected={form.role === opt}
                                className={`af-cselect-opt ${form.role === opt ? 'on' : ''}`}
                                onClick={() => { setForm((f) => ({ ...f, role: opt })); setSelectOpen(false); }}>
                                <span>{opt}</span>
                                {form.role === opt && <svg className="chk" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12l5 5L20 6" /></svg>}
                              </button>
                            </li>
                          ))}
                        </motion.ul>
                      )}
                    </AnimatePresence>
                  </motion.div>
                  <motion.div className={`af-field ${form.social ? 'filled' : ''}`} style={{ marginTop: 'clamp(20px,2.4vw,30px)' }} {...up(0.3)}>
                    <input className="af-input" type="text" value={form.social} onChange={set('social')} placeholder=" " />
                    <label>Social / profile link (LinkedIn, Indeed…)</label>
                    <span className="af-underline" aria-hidden="true" />
                  </motion.div>
                  <motion.label className={`af-file ${fileName ? 'has' : ''}`} style={{ marginTop: 'clamp(22px,2.6vw,32px)' }} {...up(0.36)}>
                    <input ref={fileRef} type="file" accept=".pdf,.doc,.docx" hidden onChange={(e) => setFileName(e.target.files?.[0]?.name || '')} />
                    <span className="af-file-ic" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 16V4M7 9l5-5 5 5M5 20h14" /></svg></span>
                    <span><span className="af-file-t">{fileName || 'Attach your resume'}</span><span className="af-file-s">{fileName ? 'Tap to change' : 'PDF or Word · optional but recommended'}</span></span>
                  </motion.label>

                  {error && <p className="af-err">{error}</p>}
                  <motion.div className="af-actions" {...up(0.42)}>
                    <button type="submit" className="af-submit" disabled={status === 'sending'}>
                      {status === 'sending' ? <><span className="spin" aria-hidden="true" />Sending…</> : <>Submit application <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" /></svg></>}
                    </button>
                  </motion.div>
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
