import { useEffect, useRef, useState } from 'react';

const TABS = ['Build', 'Encrypt', 'Decrypt', 'Help'] as const;
type Tab = typeof TABS[number];

const TAB_COMMANDS: Record<Tab, string[]> = {
  Build: [
    '$ git clone https://github.com/abhoy009/encryptoni',
    '$ cd encryptoni && make',
    '✓  Compiled in 3.2s — binary ready',
  ],
  Encrypt: [
    '$ ./encrypt_decrypt ./docs --action encrypt --mode fork',
    '✓  Encrypted 200 files in 1.02s  [4× via fork]',
    '',
    '$ ./encrypt_decrypt ./docs --action encrypt --mode thread',
    '✓  Encrypted 200 files in 3.12s',
  ],
  Decrypt: [
    '$ ./encrypt_decrypt ./docs --action decrypt --mode fork',
    '✓  Decrypted 200 files in 1.04s',
    '',
    '$ ./encrypt_decrypt ./docs --action decrypt --mode serial',
    '✓  Decrypted 200 files in 4.11s',
  ],
  Help: [
    '$ ./encrypt_decrypt --help',
    'Usage: ./encrypt_decrypt <dir> --action <encrypt|decrypt>',
    '       [--mode <serial|fork|thread>] [--password <pass>]',
    '',
    'Password: --password flag → ENCRYPTONI_PASSWORD → .env',
  ],
};

export default function TerminalDemo() {
  const [activeTab, setActiveTab] = useState<Tab>('Build');
  const [displayed, setDisplayed] = useState('');
  const [lineIndex, setLineIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [showCursor, setShowCursor] = useState(true);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setDisplayed('');
    setLineIndex(0);
    setCharIndex(0);
  }, [activeTab]);

  useEffect(() => {
    const commands = TAB_COMMANDS[activeTab];
    if (lineIndex >= commands.length) {
      timerRef.current = setTimeout(() => {
        setDisplayed('');
        setLineIndex(0);
        setCharIndex(0);
      }, 3500);
      return () => { if (timerRef.current) clearTimeout(timerRef.current); };
    }

    const currentLine = commands[lineIndex];
    if (charIndex < currentLine.length) {
      const delay = currentLine.startsWith('$') ? 38 : 18;
      timerRef.current = setTimeout(() => {
        setDisplayed(prev => prev + currentLine[charIndex]);
        setCharIndex(c => c + 1);
      }, delay);
    } else {
      const pause = currentLine === '' ? 80 : currentLine.startsWith('✓') ? 700 : 400;
      timerRef.current = setTimeout(() => {
        setDisplayed(prev => prev + '\n');
        setLineIndex(l => l + 1);
        setCharIndex(0);
      }, pause);
    }
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [lineIndex, charIndex, activeTab]);

  useEffect(() => {
    const id = setInterval(() => setShowCursor(v => !v), 530);
    return () => clearInterval(id);
  }, []);

  const lines = displayed.split('\n');

  return (
    <div className="terminal-card">
      {/* Title bar */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 8,
        padding: '10px 16px',
        background: 'var(--term-bar)',
        borderBottom: '1px solid rgba(255,255,255,0.05)',
      }}>
        <span style={{ width: 11, height: 11, borderRadius: '50%', background: '#ff5f57', flexShrink: 0 }} />
        <span style={{ width: 11, height: 11, borderRadius: '50%', background: '#ffbd2e', flexShrink: 0 }} />
        <span style={{ width: 11, height: 11, borderRadius: '50%', background: '#28c840', flexShrink: 0 }} />
        <span style={{ marginLeft: 10, fontSize: '0.75rem', color: 'rgba(255,255,255,0.3)', fontFamily: "'JetBrains Mono', monospace" }}>terminal</span>
      </div>

      {/* Tabs */}
      <div style={{
        display: 'flex',
        background: 'var(--term-tabs)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
      }}>
        {TABS.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              padding: '8px 16px',
              fontSize: '0.8125rem',
              fontWeight: activeTab === tab ? 500 : 400,
              color: activeTab === tab ? 'var(--accent)' : 'rgba(255,255,255,0.35)',
              background: 'none',
              border: 'none',
              borderBottom: `2px solid ${activeTab === tab ? 'var(--accent)' : 'transparent'}`,
              cursor: 'pointer',
              transition: 'color 0.15s',
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Body */}
      <div style={{
        padding: '1.125rem 1.25rem',
        fontFamily: "'JetBrains Mono', monospace",
        fontSize: '0.8125rem',
        lineHeight: 1.75,
        minHeight: '9rem',
      }}>
        {lines.map((line, i) => {
          const color =
            line.startsWith('$')   ? 'var(--accent)' :
            line.startsWith('✓')   ? '#4ade80' :
            line.startsWith('Usage') || line.startsWith('       ') || line.startsWith('Password') ? 'rgba(255,255,255,0.4)' :
            'rgba(255,255,255,0.75)';

          return (
            <div key={i} style={{ color }}>
              {line || '\u00a0'}
              {i === lines.length - 1 && (
                <span style={{
                  display: 'inline-block',
                  width: 7, height: '1em',
                  background: 'var(--accent)',
                  marginLeft: 2,
                  verticalAlign: 'middle',
                  opacity: showCursor ? 0.85 : 0,
                  transition: 'opacity 0.1s',
                }} />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
