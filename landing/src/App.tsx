import './index.css';
import TerminalDemo from './components/TerminalDemo';
import BenchmarkChart from './components/BenchmarkChart';
import ArchDiagram from './components/ArchDiagram';
import ScrollReveal from './components/ScrollReveal';

const GITHUB_REPO = 'https://github.com/abhoy009/encryptoni';

const FEATURES = [
  {
    icon: '🔐',
    title: 'Authenticated Encryption',
    desc: 'AES-256-GCM with PBKDF2 key derivation (100k iterations, SHA-256). GCM tag verification prevents silent data corruption.',
    accent: 'border-[#6c63ff]/30 hover:border-[#6c63ff]/70',
    glow: 'hover:shadow-[0_0_40px_rgba(108,99,255,0.12)]',
  },
  {
    icon: '⚡',
    title: 'Parallel Execution',
    desc: 'Three concurrency modes: serial, multithreading (pthread), and multiprocessing (fork). 4× speedup on Apple M2 Pro.',
    accent: 'border-[#00d4ff]/30 hover:border-[#00d4ff]/70',
    glow: 'hover:shadow-[0_0_40px_rgba(0,212,255,0.10)]',
  },
  {
    icon: '🌊',
    title: 'Streaming I/O',
    desc: '64 KB chunk-by-chunk processing handles files of any size — tested to 1 GB+ — with minimal memory footprint.',
    accent: 'border-[#6c63ff]/30 hover:border-[#6c63ff]/70',
    glow: 'hover:shadow-[0_0_40px_rgba(108,99,255,0.12)]',
  },
  {
    icon: '🛡️',
    title: 'Zero Data Loss',
    desc: 'Atomic temp-file-then-rename write pattern. Power loss or interruption during encryption never corrupts your originals.',
    accent: 'border-emerald-500/30 hover:border-emerald-500/70',
    glow: 'hover:shadow-[0_0_40px_rgba(52,211,153,0.10)]',
  },
];

const BADGES = ['AES-256-GCM', 'PBKDF2', 'Parallel', 'C++17', 'OpenSSL 3'];

export default function App() {
  return (
    <div className="min-h-screen bg-base text-gray-200 font-sans overflow-x-hidden">

      {/* ─── NAV ─────────────────────────────────────────── */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass-card border-b border-white/[0.05]">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <span className="font-bold tracking-tight gradient-text text-lg">encryptoni</span>
          <div className="flex items-center gap-4">
            <a href="#features" className="text-sm text-muted hover:text-gray-200 transition-colors hidden sm:block">Features</a>
            <a href="#benchmark" className="text-sm text-muted hover:text-gray-200 transition-colors hidden sm:block">Benchmark</a>
            <a href="#install" className="text-sm text-muted hover:text-gray-200 transition-colors hidden sm:block">Install</a>
            <a
              href={GITHUB_REPO}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-sm hover:bg-white/10 transition-all"
            >
              <GithubIcon /> GitHub
            </a>
          </div>
        </div>
      </nav>

      {/* ─── HERO ────────────────────────────────────────── */}
      <section className="relative pt-32 pb-24 px-6 overflow-hidden">
        {/* Background glow */}
        <div className="absolute inset-0 bg-gradient-hero pointer-events-none" />
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[400px] rounded-full opacity-20 blur-[120px] bg-gradient-to-r from-[#6c63ff] to-[#00d4ff] pointer-events-none" />

        <div className="relative max-w-4xl mx-auto text-center">
          {/* Animated badge row */}
          <div className="flex flex-wrap justify-center gap-2 mb-8 animate-fade-in-up animation-fill-both">
            {BADGES.map((b, i) => (
              <span
                key={b}
                className="px-3 py-1 rounded-full text-xs font-mono font-medium border border-[#6c63ff]/40 bg-[#6c63ff]/10 text-[#a5b4fc] animate-fade-in-up animation-fill-both"
                style={{ animationDelay: `${i * 80}ms` }}
              >
                {b}
              </span>
            ))}
          </div>

          <h1 className="text-5xl sm:text-6xl md:text-7xl font-black tracking-tight leading-none mb-6 animate-fade-in-up animation-fill-both animate-delay-200">
            Encrypt at the{' '}
            <span className="gradient-text animate-float inline-block">speed of fork</span>
          </h1>

          <p className="text-lg sm:text-xl text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed animate-fade-in-up animation-fill-both animate-delay-300">
            AES-256-GCM parallel file encryption engine written in C++17.
            Serial, multithreaded, and multiprocessing modes — 4× speedup on a 1 GB dataset.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up animation-fill-both animate-delay-400">
            <a
              href="#install"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl font-semibold text-white bg-gradient-to-r from-[#6c63ff] to-[#00d4ff] hover:opacity-90 transition-opacity shadow-lg shadow-[#6c63ff]/25"
            >
              Get Started →
            </a>
            <a
              href={GITHUB_REPO}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl font-semibold text-gray-300 glass-card border border-white/10 hover:border-[#6c63ff]/50 transition-all"
            >
              <GithubIcon /> Star on GitHub
            </a>
          </div>
        </div>
      </section>

      {/* ─── TERMINAL DEMO ───────────────────────────────── */}
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <ScrollReveal>
            <SectionLabel>Live Demo</SectionLabel>
            <SectionTitle>Real commands. Real output.</SectionTitle>
          </ScrollReveal>
          <ScrollReveal delay={150}>
            <TerminalDemo />
          </ScrollReveal>
        </div>
      </section>

      {/* ─── FEATURES ────────────────────────────────────── */}
      <section id="features" className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <ScrollReveal>
            <SectionLabel>Features</SectionLabel>
            <SectionTitle>Production-grade, from the ground up</SectionTitle>
          </ScrollReveal>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-10">
            {FEATURES.map((f, i) => (
              <ScrollReveal key={f.title} delay={i * 80}>
                <div className={`glass-card rounded-2xl p-6 border ${f.accent} ${f.glow} transition-all duration-300 h-full`}>
                  <div className="text-3xl mb-3">{f.icon}</div>
                  <h3 className="font-bold text-gray-100 mb-2">{f.title}</h3>
                  <p className="text-sm text-muted leading-relaxed">{f.desc}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ─── BENCHMARK ───────────────────────────────────── */}
      <section id="benchmark" className="py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <ScrollReveal>
            <SectionLabel>Benchmarks</SectionLabel>
            <SectionTitle>4× faster with multiprocessing</SectionTitle>
          </ScrollReveal>
          <ScrollReveal delay={150}>
            <BenchmarkChart />
          </ScrollReveal>
        </div>
      </section>

      {/* ─── ARCHITECTURE ────────────────────────────────── */}
      <section id="architecture" className="py-16 px-6">
        <div className="max-w-5xl mx-auto">
          <ScrollReveal>
            <SectionLabel>Architecture</SectionLabel>
            <SectionTitle>Pipeline overview</SectionTitle>
          </ScrollReveal>
          <ScrollReveal delay={150}>
            <ArchDiagram />
          </ScrollReveal>
          {/* Key details grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
            {[
              { label: 'Header format', value: '44 bytes', sub: 'Salt(16) + IV(12) + Tag(16)' },
              { label: 'Chunk size', value: '64 KB', sub: 'streaming, constant memory' },
              { label: 'PBKDF2 iterations', value: '100,000', sub: 'SHA-256, PKCS5_PBKDF2_HMAC' },
            ].map(({ label, value, sub }) => (
              <ScrollReveal key={label}>
                <div className="glass-card rounded-xl p-5 text-center border border-white/[0.05]">
                  <div className="text-2xl font-black gradient-text mb-1">{value}</div>
                  <div className="text-sm font-medium text-gray-300 mb-0.5">{label}</div>
                  <div className="text-xs text-muted font-mono">{sub}</div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ─── INSTALL ─────────────────────────────────────── */}
      <section id="install" className="py-16 px-6">
        <div className="max-w-3xl mx-auto">
          <ScrollReveal>
            <SectionLabel>Install</SectionLabel>
            <SectionTitle>Up and running in seconds</SectionTitle>
          </ScrollReveal>

          <ScrollReveal delay={100}>
            <div className="space-y-4 mt-8">
              {/* Clone & build */}
              <div className="glass-card rounded-2xl overflow-hidden border border-white/[0.05]">
                <div className="flex items-center gap-2 px-4 py-2.5 bg-white/[0.03] border-b border-white/[0.04]">
                  <span className="text-xs font-mono text-muted uppercase tracking-widest">Build from source</span>
                </div>
                <div className="p-4 font-mono text-sm space-y-1">
                  <CodeLine comment="# Clone"     cmd="git clone https://github.com/&lt;USERNAME&gt;/encryptoni" />
                  <CodeLine comment="# Build"     cmd="cd encryptoni &amp;&amp; make" />
                  <CodeLine comment="# Encrypt"   cmd="./encrypt_decrypt ./mydir --action encrypt --mode fork" />
                  <CodeLine comment="# Decrypt"   cmd="./encrypt_decrypt ./mydir --action decrypt --mode fork" />
                </div>
              </div>

              {/* Password options */}
              <div className="glass-card rounded-2xl overflow-hidden border border-white/[0.05]">
                <div className="flex items-center gap-2 px-4 py-2.5 bg-white/[0.03] border-b border-white/[0.04]">
                  <span className="text-xs font-mono text-muted uppercase tracking-widest">Password resolution order</span>
                </div>
                <div className="p-4 font-mono text-sm space-y-1">
                  <CodeLine comment="# 1. Flag"   cmd="./encrypt_decrypt ./dir --action encrypt --password mysecret" />
                  <CodeLine comment="# 2. Env"    cmd="export ENCRYPTONI_PASSWORD=mysecret" />
                  <CodeLine comment="# 3. .env"   cmd='echo "PASSWORD=mysecret" &gt; .env' />
                </div>
              </div>
            </div>
          </ScrollReveal>

          {/* Platform buttons */}
          <ScrollReveal delay={200}>
            <div className="flex flex-wrap justify-center gap-3 mt-8">
              {[
                { label: '🍎 macOS arm64', href: `${GITHUB_REPO}/releases/latest` },
                { label: '🖥 macOS x86_64', href: `${GITHUB_REPO}/releases/latest` },
                { label: '🐧 Linux x86_64', href: `${GITHUB_REPO}/releases/latest` },
              ].map(({ label, href }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl glass-card border border-white/10 text-sm font-medium hover:border-[#6c63ff]/50 hover:text-gray-100 transition-all"
                >
                  {label}
                </a>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ─── CTA ─────────────────────────────────────────── */}
      <section className="py-24 px-6">
        <ScrollReveal>
          <div className="max-w-2xl mx-auto text-center glass-card rounded-3xl p-12 border border-[#6c63ff]/20 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-[#6c63ff]/5 to-[#00d4ff]/5 pointer-events-none" />
            <h2 className="text-3xl sm:text-4xl font-black mb-4 gradient-text">Ship encryption that impresses</h2>
            <p className="text-gray-400 mb-8 leading-relaxed">
              Open source, zero dependencies beyond OpenSSL.<br />Built for performance engineers who take data safety seriously.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href={GITHUB_REPO}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl font-semibold text-white bg-gradient-to-r from-[#6c63ff] to-[#00d4ff] hover:opacity-90 transition-opacity shadow-lg shadow-[#6c63ff]/25"
              >
                <GithubIcon /> Star on GitHub
              </a>
              <a
                href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(GITHUB_REPO)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl font-semibold text-[#0a66c2] bg-[#0a66c2]/10 border border-[#0a66c2]/30 hover:bg-[#0a66c2]/20 transition-all"
              >
                <LinkedInIcon /> Share on LinkedIn
              </a>
            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* ─── FOOTER ──────────────────────────────────────── */}
      <footer className="py-8 px-6 border-t border-white/[0.05] text-center text-xs text-muted">
        <p>
          Built with C++17 · OpenSSL 3 · AES-256-GCM · PBKDF2 ·{' '}
          <a href={GITHUB_REPO} className="hover:text-gray-300 transition-colors underline underline-offset-2">
            MIT License
          </a>
        </p>
      </footer>
    </div>
  );
}

/* ─── Sub-components ─────────────────────────────── */

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-xs font-mono font-semibold uppercase tracking-[0.2em] gradient-text mb-3">
      {children}
    </p>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-3xl sm:text-4xl font-black text-gray-100 mb-10 leading-tight">
      {children}
    </h2>
  );
}

function CodeLine({ comment, cmd }: { comment: string; cmd: string }) {
  return (
    <div>
      <span className="text-muted">{comment}</span>
      <br />
      <span className="text-[#00d4ff]">$ </span>
      <span className="text-gray-200" dangerouslySetInnerHTML={{ __html: cmd }} />
    </div>
  );
}

function GithubIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
    </svg>
  );
}

function LinkedInIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}
