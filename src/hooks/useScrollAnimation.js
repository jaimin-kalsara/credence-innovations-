import { useEffect, useRef } from 'react';

export function useScrollAnimation(options = {}) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add('in-view');
          if (!options.repeat) observer.unobserve(el);
        } else if (options.repeat) {
          el.classList.remove('in-view');
        }
      },
      { threshold: options.threshold || 0.15, rootMargin: options.rootMargin || '0px' }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return ref;
}

export function useCounter(target, duration = 1500) {
  const ref = useRef(null);
  const hasRun = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !hasRun.current) {
        hasRun.current = true;
        const start = performance.now();
        const isFloat = String(target).includes('.');
        const numericTarget = parseFloat(String(target).replace(/[^0-9.]/g, ''));

        function update(now) {
          const elapsed = now - start;
          const progress = Math.min(elapsed / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          const current = Math.floor(eased * numericTarget);

          const suffix = String(target).replace(/[0-9.]/g, '');
          el.textContent = current.toLocaleString() + suffix;

          if (progress < 1) requestAnimationFrame(update);
          else el.textContent = String(target).includes('+') || String(target).includes('%')
            ? numericTarget.toLocaleString() + suffix
            : numericTarget.toLocaleString();
        }

        requestAnimationFrame(update);
        observer.unobserve(el);
      }
    }, { threshold: 0.5 });

    observer.observe(el);
    return () => observer.disconnect();
  }, [target, duration]);

  return ref;
}
