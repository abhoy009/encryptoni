import { useEffect, useRef, useState } from 'react';

interface Bar {
  label: string;
  time: number;
  maxTime: number;
  color: string;
  badge: string;
}

const BARS: Bar[] = [
  { label: 'Serial', time: 4, maxTime: 4, color: 'from-gray-500 to-gray-400', badge: '1×' },
  { label: 'Thread', time: 3, maxTime: 4, color: 'from-[#6c63ff] to-[#9d97ff]', badge: '1.3×' },
  { label: 'Fork', time: 1, maxTime: 4, color: 'from-[#6c63ff] to-[#00d4ff]', badge: '4× 🚀' },
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
    <div ref={ref} className="glass-card rounded-2xl p-8 max-w-2xl mx-auto">
      <div className="text-center mb-2">
        <span className="text-xs font-mono text-muted uppercase tracking-widest">1 GB dataset · 200 files of 5 MB · Apple M2 Pro</span>
      </div>

      <div className="space-y-6 mt-6">
        {BARS.map((bar) => {
          const widthPct = Math.round((bar.time / bar.maxTime) * 100);
          return (
            <div key={bar.label}>
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center gap-3">
                  <span className="text-sm font-semibold text-gray-200 w-12">{bar.label}</span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-white/5 border border-white/10 font-mono text-gray-400">
                    {bar.badge}
                  </span>
                </div>
                <span className="text-sm font-mono font-bold gradient-text">{bar.time}s</span>
              </div>
              <div className="h-8 w-full bg-white/5 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full bg-gradient-to-r ${bar.color} transition-all ease-out`}
                  style={{
                    width: animate ? `${widthPct}%` : '0%',
                    transitionDuration: animate ? '1200ms' : '0ms',
                    transitionDelay: animate ? `${BARS.indexOf(bar) * 150}ms` : '0ms',
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>

      <p className="text-center text-xs text-muted mt-6">
        Multiprocessing achieves 4× speedup — independent virtual memory, zero lock contention, all cores utilized.
      </p>
    </div>
  );
}
