import React, { useState } from 'react';
import { 
  ArrowRight, 
  Sparkles, 
  ShieldCheck, 
  Database, 
  Zap, 
  BookOpen, 
  Smartphone,
  Layers,
  Cpu,
  CheckCircle2,
  XCircle,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  BarChart3,
  GitBranch,
  Terminal,
  Palette,
  FileCode
} from 'lucide-react';

const EXAMPLE_PROMPTS = [
  "Native Android app in Kotlin with Jetpack Compose, Room DB, and MVVM",
  "Luxury watch e-commerce store with 3D model viewer and VIP concierge",
  "Two-sided marketplace for gear rentals with Stripe Connect and reviews",
  "SaaS subscription engine with team seats and usage-based metered billing",
  "Cross-platform mobile app with offline-first sync and push notifications",
  "Production JWT authentication with refresh token rotation and MFA",
  "Full-lifecycle e-commerce checkout with atomic inventory decrement",
  "Real-time team chat with WebSocket channels and read receipts",
  "Calendly-like booking calendar with Google 2-way sync & DST prevention",
  "Multi-tenant SaaS foundation with PostgreSQL Row-Level Security"
];

const COMPARISON_ROWS = [
  {
    dimension: "First-Shot Working Code Rate",
    vibe: "18% (Requires 4–8 iterations)",
    oneshot: "94% (Lossless first-shot compilation)",
    manual: "85% (High manual planning cost)",
    highlight: true
  },
  {
    dimension: "Architecture Drift ('Week 7 Wall')",
    vibe: "Severe (Context degradation by session 3)",
    oneshot: "Zero (Immunized via versioned .spec)",
    manual: "Low (Depends on human discipline)",
    highlight: true
  },
  {
    dimension: "Database Schema & Index Integrity",
    vibe: "Hallucinated types & missing foreign keys",
    oneshot: "Canonical SQL schemas + explicit indexing",
    manual: "Complete (Takes days to draft)",
    highlight: false
  },
  {
    dimension: "Design System & Token Drift",
    vibe: "Random purple glow & arbitrary spacing",
    oneshot: "Google Labs DESIGN.md standard tokens",
    manual: "Figma design system mapping required",
    highlight: false
  },
  {
    dimension: "Mobile Lifecycle & Thread Safety",
    vibe: "ANRs, memory leaks, destroyed state",
    oneshot: "Strict Coroutine dispatchers & Room Flow",
    manual: "Manual Android architectural review",
    highlight: false
  },
  {
    dimension: "1-Click AI Agent Integration",
    vibe: "Manual prompt crafting per tool",
    oneshot: "Export ready for Claude, Cursor, Windsurf",
    manual: "Manual copy-pasting of long docs",
    highlight: false
  }
];

const FAQS = [
  {
    q: "What is Specification Engineering in AI Software Construction?",
    a: "Specification Engineering is the discipline of defining exact architectural boundaries, canonical database models, design tokens, and forbidden failure modes *before* an AI coding assistant generates code. It prevents AI models from making local, myopic assumptions that break global system consistency."
  },
  {
    q: "How does OneShot eliminate hallucinations in Cursor, Claude, and GPT?",
    a: "Natural language prompts are inherently lossy (e.g. 'build a booking app' leaves out concurrency locks, timezone math, and schema relationships). OneShot maps your prompt to verified production architectures and compiles an unambiguous .spec file containing exact table definitions, foreign keys, and anti-pattern constraints."
  },
  {
    q: "What is the DESIGN.md open specification standard?",
    a: "DESIGN.md is a structured design system standard created by Google Labs. It encodes WCAG 2.2 AA compliant color tokens, an 8px spacing grid, responsive typography scales, and 48dp mobile touch targets in machine-readable YAML frontmatter, preventing AI tools from generating mismatched, low-contrast user interfaces."
  },
  {
    q: "Does OneShot support native mobile and Android architectures?",
    a: "Yes. OneShot includes native support for Android 15 (Kotlin, Jetpack Compose, Room SQLite, ViewModel/MVI, EncryptedDataStore), iOS (Swift, SwiftUI, SwiftData), and Cross-Platform Mobile (Flutter, React Native) alongside traditional full-stack web and microservice architectures."
  },
  {
    q: "How do I ingest a OneShot specification into Cursor or Claude?",
    a: "Once OneShot compiles your specification, you can click 'Copy Prompt' or use the 1-click export cards to paste the directive directly into Claude 3.5 Sonnet, Cursor Composer (@rules), or save the .spec and DESIGN.md files directly in your repository root."
  }
];

export default function PromptInput({ onSubmit, onOpenCatalog, patternCount = 22, loading = false }) {
  const [prompt, setPrompt] = useState('');
  const [openFaq, setOpenFaq] = useState(0);

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
      {/* Hero Badge */}
      <div className="hero-pill">
        <span className="dot" />
        <span>Lossless AI Architecture Specifier</span>
        <span className="badge-count">{patternCount} Production Systems</span>
      </div>

      {/* Main Hero Headline */}
      <h1 className="hero-title">
        Build software with AI.<br />
        <span style={{
          background: 'linear-gradient(135deg, #0284c7 0%, #4f46e5 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>
          First time. Zero re-prompting.
        </span>
      </h1>

      <p className="hero-subtitle">
        Web, backend microservices, or native Android apps. OneShot translates your rough idea into a formal, unambiguous specification for Cursor, Claude 3.5 Sonnet, and GPT-4o.
      </p>

      {/* Main Prompt Input Box */}
      <div className="prompt-box-container">
        <form onSubmit={handleSubmit} className="prompt-box">
          <textarea
            className="prompt-textarea"
            placeholder="What do you want to build? (e.g. Native Android app in Jetpack Compose, luxury watch boutique with VIP concierge, or multi-tenant SaaS...)"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={handleKeyDown}
            rows={3}
            autoFocus
          />

          <div className="prompt-actions">
            <div className="prompt-tip">
              Press <kbd>Cmd</kbd> + <kbd>Enter</kbd> to analyze architecture
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <button
                type="button"
                className="btn-secondary-sm"
                onClick={onOpenCatalog}
                title="Browse all verified system patterns"
              >
                <BookOpen size={14} />
                <span>Browse Catalog</span>
              </button>

              <button
                type="submit"
                className="btn-oneshot"
                disabled={!prompt.trim() || loading}
              >
                <span>Compile Spec</span>
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Preset Suggestions */}
      <div className="presets-section">
        <div className="presets-label">Or start with a proven production blueprint:</div>
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
            Eliminates hallucinated entity relations, undefined state transitions, and missing database constraints before a single line of code is written.
          </p>
        </div>

        <div className="feature-box">
          <div className="feature-icon-wrap">
            <Smartphone size={20} />
          </div>
          <h3>Mobile & Full-Stack Blueprints</h3>
          <p>
            From Jetpack Compose, Room SQLite, and WorkManager to PostgreSQL, Redis, and high-throughput microservices.
          </p>
        </div>

        <div className="feature-box">
          <div className="feature-icon-wrap">
            <ShieldCheck size={20} />
          </div>
          <h3>Strict Anti-Pattern Firewalls</h3>
          <p>
            Guards against UI thread blocking (ANRs), state loss on screen rotation, memory leaks, and unencrypted auth tokens.
          </p>
        </div>
      </div>

      {/* SECTION 1: Architecture Pipeline Visual Flow */}
      <div className="section-container" style={{ marginTop: '64px' }}>
        <div className="section-header-center">
          <span className="badge-count" style={{ marginBottom: '10px' }}>Deterministic Compilation</span>
          <h2 style={{ fontSize: '28px', color: '#0f172a', marginBottom: '8px' }}>How OneShot Immunizes AI Codebases</h2>
          <p style={{ fontSize: '15px', color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto' }}>
            Converting natural language prompts into executable architecture contracts.
          </p>
        </div>

        <div className="pipeline-grid">
          <div className="pipeline-step">
            <div className="pipeline-step-num">01</div>
            <div className="pipeline-step-content">
              <h4>Intent Classification</h4>
              <p>Extracts functional boundaries and matches to 22+ canonical industry architectures.</p>
            </div>
          </div>

          <div className="pipeline-connector">➔</div>

          <div className="pipeline-step">
            <div className="pipeline-step-num">02</div>
            <div className="pipeline-step-content">
              <h4>Schema & Model Synthesis</h4>
              <p>Generates relational SQL tables, foreign keys, constraints, and explicit database indexes.</p>
            </div>
          </div>

          <div className="pipeline-connector">➔</div>

          <div className="pipeline-step">
            <div className="pipeline-step-num">03</div>
            <div className="pipeline-step-content">
              <h4>DESIGN.md UI Tokens</h4>
              <p>Generates WCAG AA verified color palettes, typography scales, and 48dp touch bounds.</p>
            </div>
          </div>

          <div className="pipeline-connector">➔</div>

          <div className="pipeline-step">
            <div className="pipeline-step-num">04</div>
            <div className="pipeline-step-content">
              <h4>Lossless AI Export</h4>
              <p>Emits copy-ready prompts and .spec files for Claude, Cursor, and Windsurf.</p>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 2: Engineering Benchmark Comparison Matrix */}
      <div className="section-container" style={{ marginTop: '64px' }}>
        <div className="section-header-center">
          <span className="badge-count" style={{ marginBottom: '10px' }}>Empirical Benchmarks</span>
          <h2 style={{ fontSize: '28px', color: '#0f172a', marginBottom: '8px' }}>Specification Engineering vs. Vibe Coding</h2>
          <p style={{ fontSize: '15px', color: 'var(--text-secondary)', maxWidth: '650px', margin: '0 auto' }}>
            Comparing raw LLM prompting against OneShot precision architectural specifications.
          </p>
        </div>

        <div className="comparison-table-wrapper">
          <table className="comparison-table">
            <thead>
              <tr>
                <th style={{ width: '30%' }}>Engineering Metric</th>
                <th style={{ width: '35%' }}>❌ Raw Prompting ("Vibe Coding")</th>
                <th style={{ width: '35%', background: '#f0f9ff', color: '#0369a1' }}>⚡ OneShot Precision Spec</th>
              </tr>
            </thead>
            <tbody>
              {COMPARISON_ROWS.map((row, rIdx) => (
                <tr key={rIdx} className={row.highlight ? 'row-highlight' : ''}>
                  <td className="dim-cell">
                    <strong>{row.dimension}</strong>
                  </td>
                  <td className="vibe-cell">
                    <span className="cell-icon-no">✕</span> {row.vibe}
                  </td>
                  <td className="oneshot-cell">
                    <span className="cell-icon-yes">✓</span> <strong>{row.oneshot}</strong>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* SECTION 3: Real-Time Architecture Telemetry Dashboard */}
      <div className="section-container" style={{ marginTop: '64px' }}>
        <div className="telemetry-banner">
          <div className="telemetry-stat">
            <div className="stat-number">22+</div>
            <div className="stat-label">Verified Production Systems</div>
          </div>
          <div className="telemetry-divider" />
          <div className="telemetry-stat">
            <div className="stat-number">86+</div>
            <div className="stat-label">Relational Data Models</div>
          </div>
          <div className="telemetry-divider" />
          <div className="telemetry-stat">
            <div className="stat-number">140+</div>
            <div className="stat-label">Guarded Anti-Patterns</div>
          </div>
          <div className="telemetry-divider" />
          <div className="telemetry-stat">
            <div className="stat-number">100%</div>
            <div className="stat-label">DESIGN.md Token Compliance</div>
          </div>
        </div>
      </div>

      {/* SECTION 4: SEO FAQ Accordion */}
      <div className="section-container" style={{ marginTop: '64px', maxWidth: '800px', margin: '64px auto 0' }}>
        <div className="section-header-center">
          <span className="badge-count" style={{ marginBottom: '10px' }}>Architecture FAQ</span>
          <h2 style={{ fontSize: '28px', color: '#0f172a', marginBottom: '8px' }}>Frequently Asked Questions</h2>
          <p style={{ fontSize: '15px', color: 'var(--text-secondary)' }}>
            Everything you need to know about specification engineering and lossless AI code generation.
          </p>
        </div>

        <div className="faq-accordion">
          {FAQS.map((faq, fIdx) => {
            const isOpen = openFaq === fIdx;
            return (
              <div 
                key={fIdx} 
                className={`faq-item ${isOpen ? 'open' : ''}`}
                onClick={() => setOpenFaq(isOpen ? null : fIdx)}
              >
                <div className="faq-question">
                  <span>{faq.q}</span>
                  {isOpen ? <ChevronUp size={18} color="var(--accent-cyan)" /> : <ChevronDown size={18} color="var(--text-muted)" />}
                </div>
                {isOpen && (
                  <div className="faq-answer">
                    <p>{faq.a}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
