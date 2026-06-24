import { useEffect, useRef, useState } from 'react';

const COMMANDS = [
  '$ ./encrypt_decrypt ./docs --action encrypt --mode fork',
  '✓ Encrypted 200 files in 1.02s  [4× speedup via fork]',
  '',
  '$ ./encrypt_decrypt ./docs --action decrypt --mode thread',
  '✓ Decrypted 200 files in 2.98s',
  '',
  '$ ./encrypt_decrypt --help',
  'Usage: ./encrypt_decrypt <dir> --action <encrypt|decrypt>',
  '       [--mode <serial|fork|thread>] [--password <pass>]',
];

export default function TerminalDemo() {
  const [displayed, setDisplayed] = useState('');
  const [lineIndex, setLineIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [showCursor, setShowCursor] = useState(true);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (lineIndex >= COMMANDS.length) {
      // Restart after a pause
      const timeout = setTimeout(() => {
        setDisplayed('');
        setLineIndex(0);
        setCharIndex(0);
      }, 3000);
      return () => clearTimeout(timeout);
    }

    const currentLine = COMMANDS[lineIndex];

    if (charIndex < currentLine.length) {
      const delay = currentLine.startsWith('$') ? 40 : 20;
      intervalRef.current = setTimeout(() => {
        setDisplayed(prev => prev + currentLine[charIndex]);
        setCharIndex(c => c + 1);
      }, delay);
    } else {
      // Line done — pause then move to next
      const pause = currentLine === '' ? 80 : currentLine.startsWith('✓') ? 600 : 350;
      intervalRef.current = setTimeout(() => {
        setDisplayed(prev => prev + '\n');
        setLineIndex(l => l + 1);
        setCharIndex(0);
      }, pause);
    }

    return () => {
      if (intervalRef.current) clearTimeout(intervalRef.current);
    };
  }, [lineIndex, charIndex]);

  // Blink cursor
  useEffect(() => {
    const id = setInterval(() => setShowCursor(v => !v), 530);
    return () => clearInterval(id);
  }, []);

  const lines = displayed.split('\n');

  return (
    <div className="glass-card rounded-2xl overflow-hidden shadow-2xl shadow-black/50 max-w-2xl mx-auto">
      {/* Traffic lights */}
      <div className="flex items-center gap-2 px-4 py-3 bg-white/[0.03] border-b border-white/[0.05]">
        <span className="w-3 h-3 rounded-full bg-[#ff5f57]" />
        <span className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
        <span className="w-3 h-3 rounded-full bg-[#28c840]" />
        <span className="ml-3 text-xs text-muted font-mono tracking-wide">encryptoni — zsh</span>
      </div>
      {/* Terminal body */}
      <div className="p-5 font-mono text-sm leading-relaxed min-h-[200px]">
        {lines.map((line, i) => (
          <div key={i} className={
            line.startsWith('$') ? 'text-[#00d4ff]' :
            line.startsWith('✓') ? 'text-emerald-400' :
            line.startsWith('Usage') || line.startsWith('      ') ? 'text-gray-400' :
            'text-gray-300'
          }>
            {line || ' '}
            {i === lines.length - 1 && (
              <span className={`inline-block w-2 h-4 bg-[#6c63ff] ml-0.5 align-middle transition-opacity ${showCursor ? 'opacity-100' : 'opacity-0'}`} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
