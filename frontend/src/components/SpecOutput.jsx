import React, { useState } from 'react';
import { 
  Copy, 
  Check, 
  Download, 
  RotateCcw, 
  Edit3, 
  FileCode, 
  Terminal, 
  Database, 
  ShieldAlert, 
  ExternalLink,
  Sparkles
} from 'lucide-react';

export default function SpecOutput({
  specData,
  onReset,
  onEdit,
  onShowToast
}) {
  const { spec, spec_instruction, filename } = specData;
  const [activeTab, setActiveTab] = useState('prompt'); // 'prompt' | 'json' | 'models' | 'failures'
  const [copiedKey, setCopiedKey] = useState(null);

  const copyToClipboard = (text, keyName, label) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(keyName);
    if (onShowToast) {
      onShowToast(`Copied ${label} to clipboard! Paste directly into your AI.`);
    }
    setTimeout(() => {
      setCopiedKey(null);
    }, 2500);
  };

  const downloadSpecFile = () => {
    const jsonStr = JSON.stringify(spec, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename || `${spec.pattern_id || 'system'}.spec`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    if (onShowToast) {
      onShowToast(`Downloaded ${filename || 'system.spec'}`);
    }
  };

  // Build formatted copy texts for specific AI targets
  const claudePrompt = `Please implement the following production system based on this verified OneShot specification:\n\n${spec_instruction}`;
  const gptPrompt = `System Implementation Directive:\n${spec_instruction}`;
  const cursorPrompt = `/* @oneshot spec directive */\n${spec_instruction}`;

  return (
    <div className="spec-container">
      {/* Spec Header Card */}
      <div className="spec-header-card">
        <div className="spec-header-title">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <span className="badge-confidence">
              <Sparkles size={13} />
              <span>Specification Verified</span>
            </span>
            <span className="badge-count">Spec ID: {spec.spec_id}</span>
          </div>
          <h2>{spec.system}</h2>
          <p>
            Generated {new Date(spec.generated_at).toLocaleTimeString()} • Zero ambiguity • Ready for LLM ingestion
          </p>
        </div>

        <div className="spec-toolbar">
          <button
            type="button"
            className="btn-outline-action"
            onClick={onEdit}
            title="Edit configuration options"
          >
            <Edit3 size={15} />
            <span>Edit Choices</span>
          </button>

          <button
            type="button"
            className="btn-outline-action"
            onClick={downloadSpecFile}
          >
            <Download size={15} />
            <span>Download .spec</span>
          </button>

          <button
            type="button"
            className="btn-primary-action"
            onClick={() => copyToClipboard(spec_instruction, 'main', 'LLM Prompt')}
          >
            {copiedKey === 'main' ? <Check size={16} /> : <Copy size={16} />}
            <span>{copiedKey === 'main' ? 'Copied to Clipboard!' : 'Copy Spec Prompt'}</span>
          </button>
        </div>
      </div>

      {/* Target Assistant Direct Copy Buttons */}
      <div className="target-tools-bar">
        <div className="tools-title">One-Click Export for Coding Assistants:</div>
        <div className="tools-grid">
          <div
            className="tool-copy-card"
            onClick={() => copyToClipboard(claudePrompt, 'claude', 'Claude Code / Chat Prompt')}
          >
            <div className="tool-info">
              <h5>Claude 3.5 Sonnet</h5>
              <p>Optimized for Claude Code & Chat</p>
            </div>
            {copiedKey === 'claude' ? <Check size={18} color="var(--accent-emerald)" /> : <Copy size={18} color="var(--text-muted)" />}
          </div>

          <div
            className="tool-copy-card"
            onClick={() => copyToClipboard(cursorPrompt, 'cursor', 'Cursor Composer / Rules')}
          >
            <div className="tool-info">
              <h5>Cursor & Windsurf</h5>
              <p>Direct Composer context injection</p>
            </div>
            {copiedKey === 'cursor' ? <Check size={18} color="var(--accent-emerald)" /> : <Copy size={18} color="var(--text-muted)" />}
          </div>

          <div
            className="tool-copy-card"
            onClick={() => copyToClipboard(gptPrompt, 'gpt', 'ChatGPT / Codex Prompt')}
          >
            <div className="tool-info">
              <h5>ChatGPT / Codex</h5>
              <p>Strict system instruction format</p>
            </div>
            {copiedKey === 'gpt' ? <Check size={18} color="var(--accent-emerald)" /> : <Copy size={18} color="var(--text-muted)" />}
          </div>

          <div
            className="tool-copy-card"
            onClick={() => copyToClipboard(JSON.stringify(spec, null, 2), 'json_raw', 'Raw JSON Spec')}
          >
            <div className="tool-info">
              <h5>Raw JSON (.spec)</h5>
              <p>For MCP Server & CLI pipelines</p>
            </div>
            {copiedKey === 'json_raw' ? <Check size={18} color="var(--accent-emerald)" /> : <Copy size={18} color="var(--text-muted)" />}
          </div>
        </div>
      </div>

      {/* Spec Tabs */}
      <div className="spec-tabs">
        <button
          type="button"
          className={`spec-tab-btn ${activeTab === 'prompt' ? 'active' : ''}`}
          onClick={() => setActiveTab('prompt')}
        >
          <FileCode size={15} style={{ marginRight: '6px', verticalAlign: 'middle' }} />
          LLM Prompt (Copy-Ready)
        </button>

        <button
          type="button"
          className={`spec-tab-btn ${activeTab === 'json' ? 'active' : ''}`}
          onClick={() => setActiveTab('json')}
        >
          <Terminal size={15} style={{ marginRight: '6px', verticalAlign: 'middle' }} />
          Formal JSON (.spec)
        </button>

        <button
          type="button"
          className={`spec-tab-btn ${activeTab === 'models' ? 'active' : ''}`}
          onClick={() => setActiveTab('models')}
        >
          <Database size={15} style={{ marginRight: '6px', verticalAlign: 'middle' }} />
          Data Models & Schema
        </button>

        <button
          type="button"
          className={`spec-tab-btn ${activeTab === 'failures' ? 'active' : ''}`}
          onClick={() => setActiveTab('failures')}
        >
          <ShieldAlert size={15} style={{ marginRight: '6px', verticalAlign: 'middle' }} />
          Guarded Anti-Patterns
        </button>
      </div>

      {/* Spec Code Box */}
      <div className="spec-code-wrapper">
        <div className="spec-code-header">
          <span>
            {activeTab === 'prompt' && 'markdown • prompt'}
            {activeTab === 'json' && `${filename || 'spec.json'} • json`}
            {activeTab === 'models' && 'sql • schema'}
            {activeTab === 'failures' && 'rules • constraints'}
          </span>

          <div className="copy-button-row">
            <button
              type="button"
              className={`copy-mini-btn ${copiedKey === 'tab_copy' ? 'copied' : ''}`}
              onClick={() => {
                let content = spec_instruction;
                if (activeTab === 'json') content = JSON.stringify(spec, null, 2);
                if (activeTab === 'models') content = JSON.stringify(spec.data_models, null, 2);
                if (activeTab === 'failures') content = spec.failure_modes_to_avoid.join('\n');
                copyToClipboard(content, 'tab_copy', 'Current Tab');
              }}
            >
              {copiedKey === 'tab_copy' ? <Check size={13} /> : <Copy size={13} />}
              <span>{copiedKey === 'tab_copy' ? 'Copied' : 'Copy'}</span>
            </button>
          </div>
        </div>

        {activeTab === 'prompt' && (
          <pre className="spec-pre">{spec_instruction}</pre>
        )}

        {activeTab === 'json' && (
          <pre className="spec-pre">{JSON.stringify(spec, null, 2)}</pre>
        )}

        {activeTab === 'models' && (
          <div style={{ padding: '20px' }}>
            {Object.entries(spec.data_models || {}).map(([modelKey, modelVal]) => (
              <div
                key={modelKey}
                style={{
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-md)',
                  padding: '16px',
                  marginBottom: '16px'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                  <h4 style={{ color: 'var(--accent-cyan)', fontFamily: 'var(--font-mono)' }}>
                    Table: {modelVal.table || modelKey}
                  </h4>
                  {modelVal.proven_uses && (
                    <span className="badge-count">{modelVal.proven_uses.toLocaleString()} verified uses</span>
                  )}
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '8px' }}>
                  {(modelVal.fields || []).map((f, fIdx) => (
                    <div
                      key={fIdx}
                      style={{
                        padding: '6px 10px',
                        background: 'var(--bg-surface)',
                        borderRadius: 'var(--radius-sm)',
                        fontSize: '12.5px',
                        fontFamily: 'var(--font-mono)',
                        display: 'flex',
                        justifyContent: 'space-between'
                      }}
                    >
                      <span style={{ color: f.primary ? 'var(--accent-amber)' : 'var(--text-primary)' }}>
                        {f.name} {f.primary && '🔑'}
                      </span>
                      <span style={{ color: 'var(--text-muted)' }}>{f.type}</span>
                    </div>
                  ))}
                </div>

                {modelVal.indexes && modelVal.indexes.length > 0 && (
                  <div style={{ marginTop: '10px', fontSize: '12px', color: 'var(--text-muted)' }}>
                    Indexes: <code style={{ color: 'var(--accent-blue)' }}>{modelVal.indexes.join(', ')}</code>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {activeTab === 'failures' && (
          <div style={{ padding: '24px' }}>
            <h4 style={{ color: 'var(--accent-rose)', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <ShieldAlert size={18} />
              <span>Production Failure Modes Explicitly Excluded</span>
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {(spec.failure_modes_to_avoid || []).map((fm, idx) => (
                <div
                  key={idx}
                  style={{
                    padding: '12px 16px',
                    background: 'rgba(244, 63, 94, 0.06)',
                    border: '1px solid rgba(244, 63, 94, 0.2)',
                    borderRadius: 'var(--radius-md)',
                    fontSize: '13.5px',
                    color: 'var(--text-secondary)'
                  }}
                >
                  <strong style={{ color: 'var(--accent-rose)', marginRight: '8px' }}>ANTI-PATTERN {idx + 1}:</strong>
                  {fm}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Start Over Action */}
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
        <button
          type="button"
          className="btn-secondary-sm"
          onClick={onReset}
          style={{ padding: '10px 20px', fontSize: '14px' }}
        >
          <RotateCcw size={15} />
          <span>Generate Another Spec</span>
        </button>
      </div>
    </div>
  );
}
