import { useEffect, useRef, useState } from 'react';

interface Bar {
  label: string;
  time: number;
  maxTime: number;
  badgeColor: string;
  badgeBg: string;
  barColor: string;
  isBest?: boolean;
}

const BARS: Bar[] = [
  {
    label: 'Serial',
    time: 4, maxTime: 4,
    badgeColor: 'var(--text-4)', badgeBg: 'var(--surface-3)',
    barColor: 'var(--border)',
  },
  {
    label: 'Thread',
    time: 3, maxTime: 4,
    badgeColor: '#60a5fa', badgeBg: 'rgba(96,165,250,0.1)',
    barColor: '#60a5fa',
  },
  {
    label: 'Fork',
    time: 1, maxTime: 4,
    badgeColor: 'var(--accent-text)', badgeBg: 'var(--accent-sub)',
    barColor: 'var(--accent)',
    isBest: true,
  },
];

export default function BenchmarkChart() {
  const [animate, setAnimate] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setAnimate(true); },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className="card" style={{ padding: '2rem', maxWidth: '36rem', margin: '0 auto' }}>
      <p style={{ textAlign: 'center', fontSize: '0.75rem', fontFamily: "'JetBrains Mono', monospace", color: 'var(--text-4)', letterSpacing: '0.05em', marginBottom: '2rem' }}>
        1 GB dataset · 200 files × 5 MB · Apple M2 Pro
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {BARS.map((bar, idx) => {
          const widthPct = Math.round((bar.time / bar.maxTime) * 100);
          return (
            <div key={bar.label}>
              {/* Label row */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
                  <span style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-2)', width: '3.25rem' }}>
                    {bar.label}
                  </span>
                  <span style={{
                    fontSize: '0.7rem', fontWeight: 600,
                    padding: '0.1rem 0.5rem', borderRadius: '999px',
                    color: bar.badgeColor, background: bar.badgeBg,
                    border: `1px solid ${bar.isBest ? 'var(--accent-bdr)' : 'var(--border)'}`,
                    fontFamily: "'JetBrains Mono', monospace",
                  }}>
                    {bar.isBest ? '4× 🚀' : bar.time === 3 ? '1.3×' : '1×'}
                  </span>
                </div>
                <span style={{
                  fontSize: '0.875rem', fontWeight: 600,
                  fontFamily: "'JetBrains Mono', monospace",
                  color: bar.isBest ? 'var(--accent-text)' : 'var(--text-4)',
                }}>
                  {bar.time}s
                </span>
              </div>

              {/* Bar */}
              <div style={{ height: '1.625rem', background: 'var(--surface-3)', borderRadius: '999px', overflow: 'hidden', border: '1px solid var(--border)' }}>
                <div
                  style={{
                    height: '100%',
                    borderRadius: '999px',
                    background: bar.barColor,
                    width: animate ? `${widthPct}%` : '0%',
                    transition: animate ? `width 1100ms cubic-bezier(0.25, 1, 0.5, 1) ${idx * 180}ms` : 'none',
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>

      <p style={{ textAlign: 'center', fontSize: '0.8125rem', color: 'var(--text-4)', marginTop: '1.75rem', lineHeight: 1.6 }}>
        Multiprocessing achieves 4× speedup — independent virtual memory,<br />zero lock contention, all cores utilized.
      </p>
    </div>
  );
}
