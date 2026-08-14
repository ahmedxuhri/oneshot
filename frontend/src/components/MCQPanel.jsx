import React, { useState, useEffect } from 'react';
import { 
  ArrowRight, 
  ArrowLeft, 
  CheckCircle2, 
  Layers, 
  AlertTriangle, 
  Globe, 
  Server, 
  Database, 
  Cpu, 
  Settings2,
  ExternalLink
} from 'lucide-react';

export default function MCQPanel({
  interpretation,
  onGenerate,
  onBack,
  onChangePattern,
  loading = false
}) {
  const {
    matched_pattern,
    pattern_name,
    pattern_category,
    pattern_description,
    pattern_confidence,
    reasoning,
    clarifying_questions = [],
    known_failure_modes = [],
    web_sources = []
  } = interpretation;

  // Initialize state with default first option for each clarifying question
  const [answers, setAnswers] = useState({});
  const [stack, setStack] = useState({
    backend: 'Python (FastAPI)',
    database: 'PostgreSQL',
    cache: 'Redis',
    frontend: 'React (SPA)'
  });
  const [customNotes, setCustomNotes] = useState('');

  useEffect(() => {
    const initialAnswers = {};
    clarifying_questions.forEach((q) => {
      if (q.options && q.options.length > 0) {
        initialAnswers[q.id] = q.options[0];
      }
    });
    setAnswers(initialAnswers);
  }, [clarifying_questions]);

  const handleSelectOption = (questionId, option) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: option
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!loading) {
      onGenerate({
        patternId: matched_pattern,
        answers,
        stack,
        customRequirements: customNotes
      });
    }
  };

  return (
    <div className="mcq-container">
      {/* Pattern Match Banner */}
      <div className="matched-banner">
        <div className="matched-top">
          <div className="matched-title-group">
            <div className="matched-title">{pattern_name}</div>
            <span className="badge-confidence">
              <CheckCircle2 size={13} />
              <span>{Math.round(pattern_confidence * 100)}% Match</span>
            </span>
          </div>

          <button
            type="button"
            className="btn-secondary-sm"
            onClick={onChangePattern}
          >
            <Layers size={14} />
            <span>Switch Pattern</span>
          </button>
        </div>

        <p className="matched-desc">{pattern_description}</p>

        <div className="matched-meta">
          <div className="meta-item">
            <span style={{ color: 'var(--text-muted)' }}>Category:</span>
            <strong style={{ color: 'var(--text-primary)', textTransform: 'capitalize' }}>{pattern_category}</strong>
          </div>
          <div className="meta-item">
            <span style={{ color: 'var(--text-muted)' }}>Pattern ID:</span>
            <code style={{ color: 'var(--accent-cyan)' }}>{matched_pattern}</code>
          </div>
          <div className="meta-item">
            <span style={{ color: 'var(--text-muted)' }}>AI Reasoning:</span>
            <span>{reasoning}</span>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Clarifying Questions (3-5 MCQs) */}
        <div className="questions-list">
          <div className="section-heading">
            <Settings2 size={18} color="var(--accent-cyan)" />
            <span>Clarification & Architecture Decisions</span>
          </div>

          {clarifying_questions.map((q, idx) => (
            <div key={q.id || idx} className="question-card">
              <div className="question-header">
                <div>
                  <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 700, marginRight: '8px' }}>
                    0{idx + 1}.
                  </span>
                  <span className="question-title">{q.question}</span>
                </div>
                {q.impacts && (
                  <span className="question-impact">{q.impacts}</span>
                )}
              </div>

              <div className="options-grid">
                {q.options.map((opt, optIdx) => {
                  const isSelected = answers[q.id] === opt;
                  return (
                    <button
                      key={optIdx}
                      type="button"
                      className={`option-btn ${isSelected ? 'selected' : ''}`}
                      onClick={() => handleSelectOption(q.id, opt)}
                    >
                      <div className="radio-circle">
                        {isSelected && <div className="radio-inner-dot" />}
                      </div>
                      <span className="option-label">{opt}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Tech Stack Customizer */}
        <div className="stack-section">
          <div className="section-heading">
            <Server size={18} color="var(--accent-blue)" />
            <span>Target Technology Stack</span>
          </div>

          <div className="stack-grid">
            <div className="stack-item">
              <label>Backend Framework</label>
              <select
                className="stack-select"
                value={stack.backend}
                onChange={(e) => setStack({ ...stack, backend: e.target.value })}
              >
                <option value="Python (FastAPI)">Python (FastAPI)</option>
                <option value="Python (Django / DRF)">Python (Django / DRF)</option>
                <option value="Node.js (Next.js App Router)">Node.js (Next.js)</option>
                <option value="Node.js (Express / Fastify)">Node.js (Express / Fastify)</option>
                <option value="Node.js (NestJS)">Node.js (NestJS)</option>
                <option value="Go (Gin / Fiber)">Go (Gin / Fiber)</option>
                <option value="Rust (Axum)">Rust (Axum)</option>
              </select>
            </div>

            <div className="stack-item">
              <label>Primary Database</label>
              <select
                className="stack-select"
                value={stack.database}
                onChange={(e) => setStack({ ...stack, database: e.target.value })}
              >
                <option value="PostgreSQL">PostgreSQL</option>
                <option value="MySQL 8+">MySQL 8+</option>
                <option value="SQLite (Embedded / LibSQL)">SQLite (LibSQL / Turso)</option>
                <option value="MongoDB">MongoDB</option>
                <option value="Supabase (PostgreSQL + RLS)">Supabase</option>
              </select>
            </div>

            <div className="stack-item">
              <label>Caching / Queue</label>
              <select
                className="stack-select"
                value={stack.cache}
                onChange={(e) => setStack({ ...stack, cache: e.target.value })}
              >
                <option value="Redis">Redis</option>
                <option value="DragonflyDB / KeyDB">DragonflyDB / KeyDB</option>
                <option value="RabbitMQ / Celery">RabbitMQ</option>
                <option value="PostgreSQL SKIP LOCKED Queue">PostgreSQL Queue</option>
                <option value="None / In-Memory">None / In-Memory</option>
              </select>
            </div>

            <div className="stack-item">
              <label>Frontend UI</label>
              <select
                className="stack-select"
                value={stack.frontend}
                onChange={(e) => setStack({ ...stack, frontend: e.target.value })}
              >
                <option value="React (Vite SPA + Tailwind)">React (Vite SPA)</option>
                <option value="Next.js 14+ (React Server Components)">Next.js 14+</option>
                <option value="Vue.js 3 / Nuxt">Vue.js / Nuxt</option>
                <option value="SvelteKit">SvelteKit</option>
                <option value="Vanilla HTML / JS (No Framework)">Vanilla HTML / JS</option>
              </select>
            </div>
          </div>

          <div style={{ marginTop: '16px' }}>
            <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-muted)', fontWeight: 600, marginBottom: '6px', textTransform: 'uppercase' }}>
              Additional Custom Directives (Optional)
            </label>
            <input
              type="text"
              className="stack-input"
              placeholder="e.g. Include rate limiting on /auth endpoints, support dark mode in UI, use Docker Compose..."
              value={customNotes}
              onChange={(e) => setCustomNotes(e.target.value)}
            />
          </div>
        </div>

        {/* Known Failure Modes Box */}
        {known_failure_modes.length > 0 && (
          <div className="failure-modes-box">
            <h4>
              <AlertTriangle size={16} />
              <span>Anti-Patterns Automatically Guarded in Spec</span>
            </h4>
            <ul className="failure-list">
              {known_failure_modes.map((fm, idx) => (
                <li key={idx} className="failure-item">
                  <span style={{ color: 'var(--accent-rose)', fontWeight: 'bold' }}>✕</span>
                  <span>{fm}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Web Search Sources */}
        {web_sources.length > 0 && (
          <details className="sources-box">
            <summary>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Globe size={16} color="var(--accent-blue)" />
                <span>Live Architecture References ({web_sources.length} sources)</span>
              </div>
              <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Expand to review</span>
            </summary>
            <div className="sources-list">
              {web_sources.map((s, idx) => (
                <a
                  key={idx}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="source-link-card"
                >
                  <div className="src-title" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span>{s.title || 'Architecture Reference'}</span>
                    <ExternalLink size={12} />
                  </div>
                  <div className="src-body">{s.body}</div>
                </a>
              ))}
            </div>
          </details>
        )}

        {/* Bottom Actions */}
        <div className="form-actions-bar">
          <button
            type="button"
            className="btn-outline-action"
            onClick={onBack}
          >
            <ArrowLeft size={16} />
            <span>Refine Prompt</span>
          </button>

          <button
            type="submit"
            className="btn-oneshot"
            disabled={loading}
            style={{ padding: '12px 28px', fontSize: '16px' }}
          >
            <span>Generate Precision Spec</span>
            <ArrowRight size={18} />
          </button>
        </div>
      </form>
    </div>
  );
}
