import { useEffect, useState } from 'react';
import './index.css';
import TerminalDemo from './components/TerminalDemo';
import BenchmarkChart from './components/BenchmarkChart';
import ScrollReveal from './components/ScrollReveal';

const GITHUB_REPO = 'https://github.com/abhoy009/encryptoni';

/* ─── Dark mode hook ──────────────────────────────────── */
function useDarkMode() {
  const [dark, setDark] = useState(() => {
    if (typeof window === 'undefined') return false;
    const stored = localStorage.getItem('theme');
    if (stored) return stored === 'dark';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    const root = document.documentElement;
    if (dark) {
      root.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [dark]);

  return { dark, toggle: () => setDark(d => !d) };
}

/* ─── Data ────────────────────────────────────────────── */
const FEATURES = [
  {
    icon: <LockIcon />,
    label: 'Authenticated Encryption',
    title: 'AES-256-GCM with PBKDF2',
    desc: '100,000-iteration key derivation with SHA-256. The GCM authentication tag verifies integrity on every decrypt — silent corruption is impossible.',
  },
  {
    icon: <BoltIcon />,
    label: 'Parallel Execution',
    title: 'Serial, thread and fork modes',
    desc: 'Three concurrency strategies in a single binary. Multiprocessing isolates address spaces completely, yielding 4× speedup on Apple M2 Pro.',
  },
  {
    icon: <LayersIcon />,
    label: 'Streaming I/O',
    title: '64 KB chunk processing',
    desc: 'Files are read and encrypted in 64 KB chunks regardless of total size. Tested to 1 GB+ with constant, minimal memory usage.',
  },
  {
    icon: <ShieldIcon />,
    label: 'Zero Data Loss',
    title: 'Atomic write guarantee',
    desc: 'Output lands in a temp file and is renamed only on success. Power loss or SIGKILL mid-operation can never corrupt the original.',
  },
];

const STATS = [
  { value: '4×', label: 'Fork speedup' },
  { value: '1 GB+', label: 'Files tested' },
  { value: '100k', label: 'PBKDF2 iters' },
];

const BADGES = ['AES-256-GCM', 'PBKDF2', 'C++17', 'OpenSSL 3', 'fork / thread'];

/* ─── App ─────────────────────────────────────────────── */
export default function App() {
  const { dark, toggle } = useDarkMode();

  return (
    <div style={{ backgroundColor: 'var(--bg)', color: 'var(--text)', minHeight: '100vh', overflowX: 'hidden' }}>

      {/* ── NAV ─────────────────────────────────────────── */}
      <nav className="nav-root fixed top-0 left-0 right-0 z-50">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">

          <div className="flex items-center gap-2.5">
            <LockIcon size={18} color="var(--accent)" />
            <span style={{ color: 'var(--text)', fontWeight: 600, fontSize: '0.9375rem', letterSpacing: '-0.01em' }}>
              encryptoni
            </span>
          </div>

          <div className="hidden sm:flex items-center gap-6">
            <a href="#features" className="nav-link">Features</a>
            <a href="#benchmark" className="nav-link">Benchmarks</a>
            <a href="#install"   className="nav-link">Install</a>
          </div>

          <div className="flex items-center gap-2.5">
            <a
              href={GITHUB_REPO}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:flex items-center gap-1.5 nav-link"
              style={{ fontSize: '0.8125rem' }}
            >
              <GithubIcon size={14} />
              GitHub
            </a>

            {/* Dark mode toggle */}
            <button onClick={toggle} className="theme-toggle" aria-label="Toggle dark mode">
              {dark ? <SunIcon /> : <MoonIcon />}
            </button>

            <a href="#install" className="btn-primary">Get Started</a>
          </div>
        </div>
      </nav>

      {/* ── HERO ────────────────────────────────────────── */}
      <section className="grid-bg relative pt-28 pb-0 px-6 overflow-hidden">
        {/* Teal gradient blob */}
        <div style={{
          position: 'absolute', top: 0, right: 0,
          width: '55vw', height: '75vh',
          background: 'radial-gradient(ellipse at 80% 0%, rgba(13,148,136,0.1), transparent 65%)',
          pointerEvents: 'none',
        }} />

        <div className="relative max-w-6xl mx-auto">
          {/* Version pill */}
          <div className="mb-8 animate-fade-in-up animation-fill-both">
            <span className="version-badge">
              <span style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--accent)', flexShrink: 0, animation: 'pulse 2s infinite' }} />
              v1.0.0 · AES-256-GCM · fork / thread / serial
              <span style={{ color: 'var(--text-4)' }}>→</span>
            </span>
          </div>

          {/* Two-column */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-start pb-16">

            {/* LEFT */}
            <div className="animate-fade-in-up animation-fill-both animate-delay-100">
              <h1 style={{
                fontSize: 'clamp(2.5rem, 5vw, 3.75rem)',
                fontWeight: 800,
                letterSpacing: '-0.03em',
                lineHeight: 1.08,
                marginBottom: '1.25rem',
                color: 'var(--text)',
              }}>
                The parallel<br />
                encryption engine<br />
                <span style={{ color: 'var(--accent)' }}>for C++.</span>
              </h1>

              <p style={{ fontSize: '1.0625rem', color: 'var(--text-3)', lineHeight: 1.7, marginBottom: '0.875rem', maxWidth: '38rem' }}>
                encryptoni encrypts your files with AES-256-GCM, derives keys via PBKDF2 and distributes work across cores using fork or pthreads — returning verified, authenticated ciphertext.
              </p>
              <p style={{ fontSize: '1rem', color: 'var(--text-3)', lineHeight: 1.7, marginBottom: '2rem', maxWidth: '38rem' }}>
                4× faster than serial. Originals are safe on interruption. Chunk-by-chunk streaming handles arbitrarily large files.
              </p>

              {/* Checklist */}
              <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 2rem', display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
                {[
                  '4× average speedup via multiprocessing',
                  'Local-only — your files never leave your machine',
                  'Atomic writes — zero corruption on power loss',
                ].map(item => (
                  <li key={item} style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', fontSize: '0.9375rem', color: 'var(--text-3)' }}>
                    <CheckIcon />
                    {item}
                  </li>
                ))}
              </ul>

              {/* CTAs */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.625rem' }}>
                <a href="#install" className="btn-primary">
                  <TerminalIcon /> Install encryptoni
                </a>
                <a href="#benchmark" className="btn-outline">
                  <ChartIcon /> Benchmarks
                </a>
                <a href={GITHUB_REPO} target="_blank" rel="noopener noreferrer" className="btn-outline">
                  <GithubIcon size={14} /> GitHub
                </a>
              </div>
            </div>

            {/* RIGHT */}
            <div className="animate-fade-in-up animation-fill-both animate-delay-300">
              <TerminalDemo />
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.625rem', marginTop: '0.75rem' }}>
                {STATS.map(s => (
                  <div key={s.label} className="stat-card">
                    <div style={{ fontSize: '1.375rem', fontWeight: 700, letterSpacing: '-0.02em', color: 'var(--text)' }}>{s.value}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-4)', marginTop: '0.125rem' }}>{s.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Badge bar */}
        <div style={{ borderTop: '1px solid var(--border)', background: 'var(--surface)', backdropFilter: 'blur(8px)' }}>
          <div className="max-w-6xl mx-auto px-6 py-3 flex flex-wrap items-center gap-x-6 gap-y-2">
            <span style={{ fontSize: '0.75rem', color: 'var(--text-4)', fontWeight: 500 }}>Works with</span>
            {BADGES.map(b => (
              <span key={b} style={{ fontSize: '0.75rem', fontFamily: "'JetBrains Mono', monospace", color: 'var(--text-3)', fontWeight: 500 }}>{b}</span>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES ────────────────────────────────────── */}
      <section id="features" className="py-24 px-6" style={{ background: 'var(--surface)' }}>
        <div className="max-w-6xl mx-auto">
          <ScrollReveal>
            <div className="sec-label">Features</div>
            <h2 style={{ fontSize: 'clamp(1.75rem, 3.5vw, 2.5rem)', fontWeight: 700, letterSpacing: '-0.025em', textAlign: 'center', color: 'var(--text)', marginBottom: '0.75rem' }}>
              Production-grade, from the ground up.
            </h2>
            <p style={{ textAlign: 'center', color: 'var(--text-3)', maxWidth: '36rem', margin: '0 auto 3.5rem', fontSize: '1rem', lineHeight: 1.7 }}>
              Every component is designed for engineers who care about correctness, performance and safety.
            </p>
          </ScrollReveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {FEATURES.map((f, i) => (
              <ScrollReveal key={f.title} delay={i * 80}>
                <div className="feature-card h-full">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.875rem' }}>
                    <span style={{ color: 'var(--accent)' }}>{f.icon}</span>
                    <span style={{ fontSize: '0.68rem', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--accent-text)' }}>
                      {f.label}
                    </span>
                  </div>
                  <h3 style={{ fontSize: '1.0625rem', fontWeight: 600, letterSpacing: '-0.01em', color: 'var(--text)', marginBottom: '0.5rem' }}>{f.title}</h3>
                  <p style={{ fontSize: '0.875rem', color: 'var(--text-3)', lineHeight: 1.7 }}>{f.desc}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── COMPARISON TABLE ─────────────────────────────── */}
      <section style={{ background: 'var(--bg)' }} className="grid-bg py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <ScrollReveal>
            <div className="sec-label">Why encryptoni</div>
            <h2 style={{ fontSize: 'clamp(1.75rem, 3.5vw, 2.5rem)', fontWeight: 700, letterSpacing: '-0.025em', textAlign: 'center', color: 'var(--text)', marginBottom: '0.75rem' }}>
              Precision over brute force.
            </h2>
            <p style={{ textAlign: 'center', color: 'var(--text-3)', maxWidth: '36rem', margin: '0 auto 3rem', fontSize: '1rem', lineHeight: 1.7 }}>
              Measured on a 1 GB dataset (200 × 5 MB files) on Apple M2 Pro.
            </p>
          </ScrollReveal>

          <ScrollReveal delay={100}>
            <div className="card overflow-hidden">
              <table className="cmp-table w-full border-collapse">
                <thead>
                  <tr>
                    <th style={{ textAlign: 'left' }}>Metric</th>
                    <th style={{ textAlign: 'center' }}>Serial</th>
                    <th style={{ textAlign: 'center' }}>Thread</th>
                    <th className="th-accent" style={{ textAlign: 'center' }}>Fork ✦</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { metric: 'Elapsed time (1 GB)', serial: '4.0 s',  thread: '3.0 s',       fork: '1.0 s' },
                    { metric: 'Speedup vs serial',   serial: '1×',     thread: '1.3×',        fork: '4×' },
                    { metric: 'Peak memory',         serial: '~64 KB', thread: '~64 KB',      fork: '~64 KB' },
                    { metric: 'Lock contention',     serial: 'None',   thread: 'Mutex locks', fork: 'None (VM isolated)' },
                    { metric: 'Data integrity',      serial: 'GCM tag',thread: 'GCM tag',     fork: 'GCM tag' },
                  ].map(row => (
                    <tr key={row.metric}>
                      <td style={{ color: 'var(--text-2)', fontWeight: 500 }}>{row.metric}</td>
                      <td className="val-muted" style={{ textAlign: 'center' }}>{row.serial}</td>
                      <td className="val-muted" style={{ textAlign: 'center' }}>{row.thread}</td>
                      <td className="val-accent" style={{ textAlign: 'center' }}>{row.fork}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ── BENCHMARK CHART ──────────────────────────────── */}
      <section id="benchmark" className="py-24 px-6" style={{ background: 'var(--surface)' }}>
        <div className="max-w-4xl mx-auto">
          <ScrollReveal>
            <div className="sec-label">Benchmarks</div>
            <h2 style={{ fontSize: 'clamp(1.75rem, 3.5vw, 2.5rem)', fontWeight: 700, letterSpacing: '-0.025em', textAlign: 'center', color: 'var(--text)', marginBottom: '0.75rem' }}>
              4× faster with multiprocessing.
            </h2>
            <p style={{ textAlign: 'center', color: 'var(--text-3)', maxWidth: '36rem', margin: '0 auto 3rem', fontSize: '1rem', lineHeight: 1.7 }}>
              Independent virtual address spaces eliminate lock contention entirely — every core runs at full utilisation.
            </p>
          </ScrollReveal>
          <ScrollReveal delay={150}>
            <BenchmarkChart />
          </ScrollReveal>
        </div>
      </section>

      {/* ── HOW IT WORKS ─────────────────────────────────── */}
      <section className="grid-bg py-24 px-6" style={{ background: 'var(--bg)' }}>
        <div className="max-w-4xl mx-auto">
          <ScrollReveal>
            <div className="sec-label">How it works</div>
            <h2 style={{ fontSize: 'clamp(1.75rem, 3.5vw, 2.5rem)', fontWeight: 700, letterSpacing: '-0.025em', textAlign: 'center', color: 'var(--text)', marginBottom: '0.75rem' }}>
              A five-stage pipeline from<br />raw file to safe ciphertext.
            </h2>
            <p style={{ textAlign: 'center', color: 'var(--text-3)', maxWidth: '36rem', margin: '0 auto 3.5rem', fontSize: '1rem', lineHeight: 1.7 }}>
              Each stage is local, observable and incremental — no cloud, no external dependencies beyond OpenSSL.
            </p>
          </ScrollReveal>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {[
              { step: '01', title: 'Password resolution',     desc: 'CLI flag → env var → .env file. Predictable resolution order, never persisted to disk.' },
              { step: '02', title: 'Key derivation (PBKDF2)', desc: 'PKCS5_PBKDF2_HMAC with SHA-256, 100,000 iterations, 16-byte random salt — producing a 32-byte AES-256 key.' },
              { step: '03', title: 'IV generation & header',  desc: '12-byte random IV generated per file. Header format: Salt (16) + IV (12) + Tag (16) = 44 bytes total.' },
              { step: '04', title: 'Chunk-by-chunk AES-GCM',  desc: '64 KB chunks streamed through EVP_EncryptUpdate. GCM accumulates an authentication tag across all chunks.' },
              { step: '05', title: 'Atomic rename',           desc: 'Output written to a temp file. On success, renamed over the original — guaranteeing zero corruption on interruption.' },
            ].map((s, i) => (
              <ScrollReveal key={s.step} delay={i * 60}>
                <div className="pipeline-step">
                  <div className="step-num">{s.step}</div>
                  <div>
                    <h3 style={{ fontSize: '0.9375rem', fontWeight: 600, letterSpacing: '-0.01em', color: 'var(--text)', marginBottom: '0.25rem' }}>{s.title}</h3>
                    <p style={{ fontSize: '0.875rem', color: 'var(--text-3)', lineHeight: 1.65 }}>{s.desc}</p>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>

          {/* Key numbers */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-10">
            {[
              { value: '44 bytes', label: 'Header format',     sub: 'Salt(16) + IV(12) + Tag(16)' },
              { value: '64 KB',    label: 'Chunk size',         sub: 'streaming, constant memory'  },
              { value: '100,000',  label: 'PBKDF2 iterations',  sub: 'SHA-256, PKCS5_PBKDF2_HMAC'  },
            ].map(({ value, label, sub }) => (
              <ScrollReveal key={label}>
                <div className="card p-6 text-center">
                  <div style={{ fontSize: '1.625rem', fontWeight: 700, letterSpacing: '-0.02em', color: 'var(--accent-text)', marginBottom: '0.25rem' }}>{value}</div>
                  <div style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-2)', marginBottom: '0.125rem' }}>{label}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-4)', fontFamily: "'JetBrains Mono', monospace" }}>{sub}</div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── INSTALL ──────────────────────────────────────── */}
      <section id="install" className="py-24 px-6" style={{ background: 'var(--surface)' }}>
        <div className="max-w-3xl mx-auto">
          <ScrollReveal>
            <div className="sec-label">Install</div>
            <h2 style={{ fontSize: 'clamp(1.75rem, 3.5vw, 2.5rem)', fontWeight: 700, letterSpacing: '-0.025em', textAlign: 'center', color: 'var(--text)', marginBottom: '0.75rem' }}>
              Up and running in seconds.
            </h2>
            <p style={{ textAlign: 'center', color: 'var(--text-3)', maxWidth: '32rem', margin: '0 auto 3rem', fontSize: '1rem', lineHeight: 1.7 }}>
              Zero runtime dependencies beyond OpenSSL. Build from source with a single make command.
            </p>
          </ScrollReveal>

          <ScrollReveal delay={100}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {/* Build block */}
              <div className="card overflow-hidden">
                <div style={{ padding: '0.625rem 1rem', background: 'var(--surface-2)', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ fontSize: '0.7rem', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-4)' }}>
                    Build from source
                  </span>
                </div>
                <div className="code-block p-5" style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.8125rem', lineHeight: 1.8 }}>
                  <CodeLine comment="# Clone"   cmd="git clone https://github.com/abhoy009/encryptoni" />
                  <CodeLine comment="# Build"   cmd="cd encryptoni &amp;&amp; make" />
                  <CodeLine comment="# Encrypt" cmd="./encrypt ./mydir --mode fork" />
                  <CodeLine comment="# Decrypt" cmd="./decrypt ./mydir --mode fork" />
                </div>
              </div>

              {/* Password block */}
              <div className="card overflow-hidden">
                <div style={{ padding: '0.625rem 1rem', background: 'var(--surface-2)', borderBottom: '1px solid var(--border)' }}>
                  <span style={{ fontSize: '0.7rem', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-4)' }}>
                    Password resolution order
                  </span>
                </div>
                <div className="code-block p-5" style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.8125rem', lineHeight: 1.8 }}>
                  <CodeLine comment="# 1. CLI flag"  cmd="./encrypt ./dir --password mysecret" />
                  <CodeLine comment="# 2. Env var"   cmd="export ENCRYPTONI_PASSWORD=mysecret" />
                  <CodeLine comment='# 3. .env file' cmd='echo "PASSWORD=mysecret" &gt; .env' />
                </div>
              </div>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={200}>
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '0.625rem', marginTop: '2rem' }}>
              {[
                { label: '🍎 macOS arm64',  href: `${GITHUB_REPO}/releases/latest` },
                { label: '🖥 macOS x86_64', href: `${GITHUB_REPO}/releases/latest` },
                { label: '🐧 Linux x86_64', href: `${GITHUB_REPO}/releases/latest` },
              ].map(({ label, href }) => (
                <a key={label} href={href} target="_blank" rel="noopener noreferrer" className="btn-outline">{label}</a>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ── CTA BAND ─────────────────────────────────────── */}
      <section className="cta-band py-20 px-6">
        <ScrollReveal>
          <div className="max-w-2xl mx-auto text-center">
            <h2 style={{ fontSize: 'clamp(1.75rem, 3.5vw, 2.5rem)', fontWeight: 700, letterSpacing: '-0.02em', color: dark ? 'var(--text)' : '#fff', marginBottom: '0.75rem' }}>
              Star on GitHub
            </h2>
            <p style={{ color: dark ? 'var(--text-3)' : 'rgba(255,255,255,0.8)', marginBottom: '2rem', fontSize: '1rem', lineHeight: 1.7 }}>
              Open source, MIT licensed. Zero dependencies beyond OpenSSL.<br />
              Built for engineers who take data safety seriously.
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '0.75rem', alignItems: 'center' }}>
              <a
                href={GITHUB_REPO}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
                  padding: '0.625rem 1.375rem', borderRadius: '0.625rem',
                  background: dark ? 'var(--surface)' : '#fff',
                  color: dark ? 'var(--text)' : '#0d9488',
                  fontWeight: 500, fontSize: '0.875rem',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
                  transition: 'transform 0.15s',
                }}
              >
                <GithubIcon size={14} /> Star on GitHub
              </a>

              <button
                onClick={() => navigator.clipboard?.writeText('git clone https://github.com/abhoy009/encryptoni')}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: '0.625rem',
                  padding: '0.625rem 1.125rem', borderRadius: '0.625rem',
                  background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)',
                  color: dark ? 'var(--text-2)' : 'rgba(255,255,255,0.9)',
                  fontFamily: "'JetBrains Mono', monospace", fontSize: '0.8125rem',
                  cursor: 'pointer',
                }}
              >
                git clone github.com/abhoy009/encryptoni
                <CopyIcon />
              </button>
            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* ── FOOTER ───────────────────────────────────────── */}
      <footer className="footer-root py-14 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 mb-10">
            <div className="col-span-2 sm:col-span-1">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.625rem' }}>
                <LockIcon size={16} color="var(--accent)" />
                <span style={{ fontWeight: 600, fontSize: '0.9375rem', color: 'var(--text)' }}>encryptoni</span>
              </div>
              <p style={{ fontSize: '0.8125rem', color: 'var(--text-3)', lineHeight: 1.7 }}>
                Parallel AES-256-GCM file encryption engine in C++17.
              </p>
            </div>

            {[
              {
                heading: 'Product',
                links: [
                  { label: 'Features',     href: '#features' },
                  { label: 'Benchmarks',   href: '#benchmark' },
                  { label: 'Install',      href: '#install' },
                  { label: 'Architecture', href: '#architecture' },
                ],
              },
              {
                heading: 'Community',
                links: [
                  { label: 'GitHub',       href: GITHUB_REPO },
                  { label: 'Issues',       href: `${GITHUB_REPO}/issues` },
                  { label: 'Releases',     href: `${GITHUB_REPO}/releases` },
                  { label: 'Contributing', href: `${GITHUB_REPO}/blob/main/CONTRIBUTING.md` },
                ],
              },
              {
                heading: 'Resources',
                links: [
                  { label: 'README',       href: `${GITHUB_REPO}#readme` },
                  { label: 'MIT License',  href: `${GITHUB_REPO}/blob/main/LICENSE` },
                  { label: 'OpenSSL 3',    href: 'https://www.openssl.org/docs/' },
                  { label: 'AES-GCM spec', href: 'https://nvlpubs.nist.gov/nistpubs/Legacy/SP/nistspecialpublication800-38d.pdf' },
                ],
              },
            ].map(col => (
              <div key={col.heading}>
                <h4 style={{ fontSize: '0.68rem', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--text-4)', marginBottom: '1rem' }}>
                  {col.heading}
                </h4>
                <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
                  {col.links.map(l => (
                    <li key={l.label}>
                      <a
                        href={l.href}
                        target={l.href.startsWith('http') ? '_blank' : undefined}
                        rel="noopener noreferrer"
                        style={{ fontSize: '0.875rem', color: 'var(--text-3)', transition: 'color 0.15s' }}
                        onMouseEnter={e => (e.currentTarget.style.color = 'var(--text)')}
                        onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-3)')}
                      >
                        {l.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div style={{ borderTop: '1px solid var(--border)', paddingTop: '1.25rem', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '0.5rem' }}>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-4)' }}>
              Built with C++17 · OpenSSL 3 · AES-256-GCM · PBKDF2 · MIT License
            </p>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-4)' }}>encryptoni v1.0.0</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

/* ─── Icon components ─────────────────────────────────── */

function LockIcon({ size = 20, color = 'currentColor' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="3" y="11" width="18" height="11" rx="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}

function BoltIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
    </svg>
  );
}

function LayersIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 2L2 7l10 5 10-5-10-5z" /><path d="M2 17l10 5 10-5" /><path d="M2 12l10 5 10-5" />
    </svg>
  );
}

function ShieldIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  );
}

function GithubIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ flexShrink: 0 }}>
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function TerminalIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polyline points="4 17 10 11 4 5" /><line x1="12" y1="19" x2="20" y2="19" />
    </svg>
  );
}

function ChartIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <line x1="18" y1="20" x2="18" y2="10" />
      <line x1="12" y1="20" x2="12" y2="4" />
      <line x1="6" y1="20" x2="6" y2="14" />
    </svg>
  );
}

function CopyIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="9" y="9" width="13" height="13" rx="2" /><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  );
}

function SunIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="5" />
      <line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" />
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
      <line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" />
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" /><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  );
}

function CodeLine({ comment, cmd }: { comment: string; cmd: string }) {
  return (
    <div style={{ marginBottom: '0.25rem' }}>
      <span style={{ color: 'var(--text-4)' }}>{comment}</span>
      <br />
      <span style={{ color: 'var(--accent)' }}>$ </span>
      <span style={{ color: '#e6edf3' }} dangerouslySetInnerHTML={{ __html: cmd }} />
    </div>
  );
}
