import React, { useEffect, useState } from 'react';
import { Sparkles, Cpu, Database, Search, CheckCircle2 } from 'lucide-react';

const STEPS = [
  { text: 'Deconstructing intent & extracting system constraints...', icon: Sparkles },
  { text: 'Matching against 20 verified architectural patterns...', icon: Cpu },
  { text: 'Indexing canonical SQL schema & entity models...', icon: Database },
  { text: 'Searching production failure modes & best practices...', icon: Search }
];

export default function LoadingState({ message = 'Synthesizing precision specification...' }) {
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev < STEPS.length - 1 ? prev + 1 : prev));
    }, 600);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="loading-view">
      <div className="spinner-outer">
        <div className="spinner-ring" />
        <div className="spinner-core" />
      </div>

      <h3 className="loading-title">{message}</h3>
      <p className="loading-subtitle">
        Eliminating lossy natural language ambiguities before generation
      </p>

      <div style={{ marginTop: '32px', display: 'flex', flexDirection: 'column', gap: '12px', width: '100%', maxWidth: '440px' }}>
        {STEPS.map((s, idx) => {
          const Icon = s.icon;
          const isDone = idx < activeStep;
          const isCurrent = idx === activeStep;

          return (
            <div
              key={idx}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '10px 14px',
                background: isCurrent ? 'var(--bg-card)' : 'transparent',
                borderRadius: 'var(--radius-md)',
                border: isCurrent ? '1px solid var(--border-accent)' : '1px solid transparent',
                opacity: isDone || isCurrent ? 1 : 0.35,
                transition: 'all 0.3s ease'
              }}
            >
              {isDone ? (
                <CheckCircle2 size={18} color="var(--accent-emerald)" />
              ) : (
                <Icon size={18} color={isCurrent ? 'var(--accent-cyan)' : 'var(--text-muted)'} />
              )}
              <span style={{ fontSize: '13px', textAlign: 'left', color: isCurrent ? 'var(--text-primary)' : 'var(--text-secondary)' }}>
                {s.text}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
