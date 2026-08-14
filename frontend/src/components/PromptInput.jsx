import React, { useState } from 'react';
import { ArrowRight, Sparkles, ShieldCheck, Database, Zap, BookOpen } from 'lucide-react';

const EXAMPLE_PROMPTS = [
  "Two-sided marketplace for gear rentals with Stripe Connect and reviews",
  "SaaS subscription engine with team seats and usage-based metered billing",
  "Production JWT authentication with refresh token rotation and MFA",
  "Full-lifecycle e-commerce checkout with atomic inventory decrement",
  "Real-time team chat with WebSocket channels and read receipts",
  "Calendly-like booking calendar with Google 2-way sync & DST prevention",
  "Multi-tenant SaaS foundation with PostgreSQL Row-Level Security",
  "Enterprise admin backoffice with immutable audit logging and CSV export"
];

export default function PromptInput({ onSubmit, onOpenCatalog, patternCount = 20, loading = false }) {
  const [prompt, setPrompt] = useState('');

  const handleSubmit = (e) => {
    e?.preventDefault();
    if (prompt.trim() && !loading) {
      onSubmit(prompt.trim());
    }
  };

  const handleKeyDown = (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
      handleSubmit(e);
    }
  };

  return (
    <div className="prompt-hero">
      <div className="hero-pill">
        <span className="dot" />
        <span>Lossless AI Architecture Specifier</span>
        <span className="badge-count">{patternCount} Patterns</span>
      </div>

      <h1 className="hero-title">
        Build software with AI.<br />
        <span style={{
          background: 'linear-gradient(135deg, #00f2fe 0%, #4facfe 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>
          First time. Zero re-prompting.
        </span>
      </h1>

      <p className="hero-subtitle">
        Natural language is lossy. OneShot translates your rough idea into a formal, unambiguous specification for Claude, GPT, and Cursor.
      </p>

      {/* Main Input Form */}
      <div className="prompt-box-container">
        <form onSubmit={handleSubmit} className="prompt-box">
          <textarea
            className="prompt-textarea"
            placeholder="What do you want to build? (Be rough. Be messy. We'll figure it out...)"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={handleKeyDown}
            rows={3}
            autoFocus
          />

          <div className="prompt-actions">
            <div className="prompt-tip">
              Press <kbd style={{ background: 'var(--bg-card)', padding: '2px 5px', borderRadius: '4px', border: '1px solid var(--border-subtle)', fontFamily: 'var(--font-mono)' }}>Cmd</kbd> + <kbd style={{ background: 'var(--bg-card)', padding: '2px 5px', borderRadius: '4px', border: '1px solid var(--border-subtle)', fontFamily: 'var(--font-mono)' }}>Enter</kbd> to analyze
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <button
                type="button"
                className="btn-secondary-sm"
                onClick={onOpenCatalog}
                title="Browse all 20 verified system patterns"
              >
                <BookOpen size={14} />
                <span>Browse Catalog</span>
              </button>

              <button
                type="submit"
                className="btn-oneshot"
                disabled={!prompt.trim() || loading}
              >
                <span>OneShot</span>
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Preset Suggestions */}
      <div className="presets-section">
        <div className="presets-label">Or start with a proven system pattern:</div>
        <div className="preset-chips">
          {EXAMPLE_PROMPTS.map((sample, idx) => (
            <button
              key={idx}
              className="preset-chip"
              onClick={() => {
                setPrompt(sample);
                onSubmit(sample);
              }}
            >
              {sample}
            </button>
          ))}
        </div>
      </div>

      {/* Value Proposition Features */}
      <div className="feature-row">
        <div className="feature-box">
          <div className="feature-icon-wrap">
            <Sparkles size={20} />
          </div>
          <h3>Lossless Intent Translation</h3>
          <p>
            Stops AI from guessing database relationships, edge conditions, or API signatures from loose descriptions.
          </p>
        </div>

        <div className="feature-box">
          <div className="feature-icon-wrap">
            <Database size={20} />
          </div>
          <h3>20 Production Schemas</h3>
          <p>
            Pre-validated relational database tables with proper indexing, UUID primary keys, and foreign key cascades.
          </p>
        </div>

        <div className="feature-box">
          <div className="feature-icon-wrap">
            <ShieldCheck size={20} />
          </div>
          <h3>Zero-Tolerance Anti-Patterns</h3>
          <p>
            Explicitly instructs your AI to avoid known race conditions, double booking bugs, and OWASP security pitfalls.
          </p>
        </div>
      </div>
    </div>
  );
}
