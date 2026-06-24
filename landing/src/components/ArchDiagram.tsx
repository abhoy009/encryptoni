// SVG pipeline architecture diagram
export default function ArchDiagram() {
  return (
    <div className="glass-card rounded-2xl p-8 overflow-x-auto">
      <svg
        viewBox="0 0 780 240"
        className="w-full max-w-3xl mx-auto block"
        aria-label="Encryptoni pipeline: Files → Queue → Execution Modes → AES-256-GCM → Output"
        role="img"
      >
        <defs>
          <linearGradient id="accentGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#6c63ff" />
            <stop offset="100%" stopColor="#00d4ff" />
          </linearGradient>
          <marker id="arrow" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
            <path d="M0,0 L0,6 L8,3 z" fill="#6c63ff" />
          </marker>
        </defs>

        {/* Files */}
        <rect x="10" y="90" width="100" height="60" rx="10" fill="rgba(108,99,255,0.12)" stroke="#6c63ff" strokeWidth="1.5" />
        <text x="60" y="114" textAnchor="middle" fill="#a5b4fc" fontSize="11" fontFamily="Inter">📁 Files</text>
        <text x="60" y="132" textAnchor="middle" fill="#6b7280" fontSize="9" fontFamily="Inter">1 GB · 200 files</text>

        {/* Arrow */}
        <line x1="112" y1="120" x2="148" y2="120" stroke="#6c63ff" strokeWidth="1.5" markerEnd="url(#arrow)" />

        {/* Task Queue */}
        <rect x="150" y="90" width="110" height="60" rx="10" fill="rgba(108,99,255,0.12)" stroke="#6c63ff" strokeWidth="1.5" />
        <text x="205" y="114" textAnchor="middle" fill="#a5b4fc" fontSize="11" fontFamily="Inter">📋 Task Queue</text>
        <text x="205" y="132" textAnchor="middle" fill="#6b7280" fontSize="9" fontFamily="Inter">std::queue</text>

        {/* Arrow */}
        <line x1="262" y1="120" x2="298" y2="120" stroke="#6c63ff" strokeWidth="1.5" markerEnd="url(#arrow)" />

        {/* Execution Modes box */}
        <rect x="300" y="30" width="170" height="180" rx="12" fill="rgba(19,19,31,0.8)" stroke="rgba(108,99,255,0.4)" strokeWidth="1" strokeDasharray="4 3" />
        <text x="385" y="52" textAnchor="middle" fill="#6b7280" fontSize="9" fontFamily="Inter" letterSpacing="1">EXECUTION MODE</text>

        {/* Serial */}
        <rect x="318" y="62" width="134" height="34" rx="8" fill="rgba(107,114,128,0.15)" stroke="rgba(107,114,128,0.3)" strokeWidth="1" />
        <text x="385" y="83" textAnchor="middle" fill="#9ca3af" fontSize="10" fontFamily="Inter">Serial · sequential</text>

        {/* Thread */}
        <rect x="318" y="106" width="134" height="34" rx="8" fill="rgba(108,99,255,0.12)" stroke="rgba(108,99,255,0.35)" strokeWidth="1" />
        <text x="385" y="127" textAnchor="middle" fill="#a5b4fc" fontSize="10" fontFamily="Inter">pthread · 1.3× faster</text>

        {/* Fork */}
        <rect x="318" y="150" width="134" height="34" rx="8" fill="rgba(108,99,255,0.2)" stroke="url(#accentGrad)" strokeWidth="1.5" />
        <text x="385" y="171" textAnchor="middle" fill="#c4b5fd" fontSize="10" fontFamily="Inter">fork() · 4× faster 🚀</text>

        {/* Arrow */}
        <line x1="472" y1="120" x2="508" y2="120" stroke="url(#accentGrad)" strokeWidth="1.5" markerEnd="url(#arrow)" />

        {/* AES-256-GCM */}
        <rect x="510" y="80" width="120" height="80" rx="10" fill="rgba(0,212,255,0.08)" stroke="#00d4ff" strokeWidth="1.5" />
        <text x="570" y="108" textAnchor="middle" fill="#67e8f9" fontSize="10" fontFamily="Inter" fontWeight="600">AES-256-GCM</text>
        <text x="570" y="124" textAnchor="middle" fill="#6b7280" fontSize="8.5" fontFamily="Inter">PBKDF2 · SHA-256</text>
        <text x="570" y="140" textAnchor="middle" fill="#6b7280" fontSize="8.5" fontFamily="Inter">64 KB streaming</text>

        {/* Arrow */}
        <line x1="632" y1="120" x2="668" y2="120" stroke="#00d4ff" strokeWidth="1.5" markerEnd="url(#arrow)" />

        {/* Output */}
        <rect x="670" y="90" width="100" height="60" rx="10" fill="rgba(0,212,255,0.08)" stroke="#00d4ff" strokeWidth="1.5" />
        <text x="720" y="114" textAnchor="middle" fill="#67e8f9" fontSize="11" fontFamily="Inter">✓ Output</text>
        <text x="720" y="130" textAnchor="middle" fill="#6b7280" fontSize="9" fontFamily="Inter">atomic rename</text>
      </svg>
    </div>
  );
}
