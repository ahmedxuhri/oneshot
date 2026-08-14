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
  Sparkles,
  Palette,
  FileText
} from 'lucide-react';

export default function SpecOutput({
  specData,
  onReset,
  onEdit,
  onShowToast
}) {
  const { spec, spec_instruction, design_md, theme_info, filename } = specData;
  const [activeTab, setActiveTab] = useState('prompt'); // 'prompt' | 'design' | 'json' | 'models' | 'failures'
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

  const downloadDesignMd = () => {
    if (!design_md) return;
    const blob = new Blob([design_md], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'DESIGN.md';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    if (onShowToast) {
      onShowToast('Downloaded DESIGN.md design system manifest');
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
            {spec.design_theme && (
              <span className="badge-count" style={{ background: 'rgba(56, 189, 248, 0.15)', color: 'var(--accent-cyan)', borderColor: 'rgba(56, 189, 248, 0.3)' }}>
                🎨 {spec.design_theme.name}
              </span>
            )}
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

          {design_md && (
            <button
              type="button"
              className="btn-outline-action"
              onClick={downloadDesignMd}
              style={{ borderColor: 'rgba(0, 242, 254, 0.4)', color: 'var(--accent-cyan)' }}
            >
              <Palette size={15} />
              <span>Download DESIGN.md</span>
            </button>
          )}

          <button
            type="button"
            className="btn-primary-action"
            onClick={() => copyToClipboard(spec_instruction, 'main', 'LLM Prompt')}
          >
            {copiedKey === 'main' ? <Check size={16} /> : <Copy size={16} />}
            <span>{copiedKey === 'main' ? 'Copied Prompt!' : 'Copy Prompt'}</span>
          </button>

          <button
            type="button"
            className="btn-outline-action"
            onClick={onReset}
            title="Start new specification"
          >
            <RotateCcw size={15} />
            <span>New</span>
          </button>
        </div>
      </div>

      {/* Target AI Quick Copy Cards */}
      <div className="tool-integrations-box">
        <h4>
          <ExternalLink size={15} color="var(--accent-cyan)" />
          <span>One-Click Export to AI Coding Tools</span>
        </h4>

        <div className="tool-cards-grid">
          <div
            className="tool-copy-card"
            onClick={() => copyToClipboard(claudePrompt, 'claude', 'Claude 3.5 Sonnet Prompt')}
          >
            <div className="tool-info">
              <h5>Claude 3.5 Sonnet / Opus</h5>
              <p>Optimized for Anthropic reasoning</p>
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

          {design_md && (
            <div
              className="tool-copy-card"
              onClick={() => copyToClipboard(design_md, 'design_md_copy', 'DESIGN.md File')}
              style={{ borderColor: 'rgba(0, 242, 254, 0.3)' }}
            >
              <div className="tool-info">
                <h5>DESIGN.md Manifest</h5>
                <p>Google Labs UI Tokens & Rules</p>
              </div>
              {copiedKey === 'design_md_copy' ? <Check size={18} color="var(--accent-emerald)" /> : <Copy size={18} color="var(--accent-cyan)" />}
            </div>
          )}

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

        {design_md && (
          <button
            type="button"
            className={`spec-tab-btn ${activeTab === 'design' ? 'active' : ''}`}
            onClick={() => setActiveTab('design')}
            style={{ color: activeTab === 'design' ? 'var(--accent-cyan)' : 'inherit' }}
          >
            <Palette size={15} style={{ marginRight: '6px', verticalAlign: 'middle' }} />
            DESIGN.md (UI/UX Kit)
          </button>
        )}

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
            {activeTab === 'design' && 'DESIGN.md • design tokens & component rules'}
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
                if (activeTab === 'design') content = design_md;
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

        {activeTab === 'design' && (
          <div>
            {theme_info && theme_info.colors && (
              <div style={{
                background: 'var(--bg-card)',
                borderBottom: '1px solid var(--border-subtle)',
                padding: '16px 20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '12px'
              }}>
                <div>
                  <div style={{ fontSize: '14px', fontWeight: 700, color: '#ffffff' }}>
                    🎨 Design System: {theme_info.name}
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                    {theme_info.description}
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ width: '16px', height: '16px', borderRadius: '4px', background: theme_info.colors.bg_page, border: '1px solid rgba(255,255,255,0.3)' }} title="Page BG" />
                    <span style={{ width: '16px', height: '16px', borderRadius: '4px', background: theme_info.colors.bg_card, border: '1px solid rgba(255,255,255,0.3)' }} title="Card BG" />
                    <span style={{ width: '16px', height: '16px', borderRadius: '4px', background: theme_info.colors.accent_primary }} title="Primary Accent" />
                    <span style={{ width: '16px', height: '16px', borderRadius: '4px', background: theme_info.colors.accent_success }} title="Success Accent" />
                  </div>
                  <span style={{ fontSize: '11px', color: 'var(--accent-cyan)', fontFamily: 'var(--font-mono)', fontWeight: 700 }}>
                    WCAG 2.2 AA Verified
                  </span>
                </div>
              </div>
            )}
            <pre className="spec-pre">{design_md}</pre>
          </div>
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
                    Table / Entity: {modelVal.table || modelKey}
                  </h4>
                  {modelVal.proven_uses && (
                    <span className="badge-count">{modelVal.proven_uses.toLocaleString()} verified uses</span>
                  )}
                </div>

                <div className="fields-table-wrapper">
                  <table className="fields-table">
                    <thead>
                      <tr>
                        <th>Field Name</th>
                        <th>Data Type</th>
                        <th>Properties</th>
                        <th>Default</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(modelVal.fields || []).map((f, fIdx) => (
                        <tr key={fIdx}>
                          <td>
                            <code>{f.name}</code>
                          </td>
                          <td>
                            <span className="type-badge">{f.type}</span>
                          </td>
                          <td>
                            {f.primary && <span className="tag-primary">PRIMARY KEY</span>}
                            {f.unique && <span className="tag-unique">UNIQUE</span>}
                            {f.nullable === false && <span className="tag-required">NOT NULL</span>}
                          </td>
                          <td>
                            <span style={{ color: 'var(--text-muted)', fontSize: '12px' }}>
                              {f.default !== undefined ? String(f.default) : '—'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {modelVal.indexes && modelVal.indexes.length > 0 && (
                  <div style={{ marginTop: '12px', fontSize: '12px', color: 'var(--text-muted)' }}>
                    <strong>Indexes: </strong>
                    <code>{modelVal.indexes.join(', ')}</code>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {activeTab === 'failures' && (
          <div style={{ padding: '20px' }}>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '16px', fontSize: '14px' }}>
              These critical failure modes, bugs, and anti-patterns are explicitly forbidden in the generated specification.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {(spec.failure_modes_to_avoid || []).map((fm, idx) => (
                <div
                  key={idx}
                  style={{
                    background: 'rgba(244, 63, 94, 0.08)',
                    border: '1px solid rgba(244, 63, 94, 0.25)',
                    borderRadius: 'var(--radius-md)',
                    padding: '12px 16px',
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '12px'
                  }}
                >
                  <span style={{ color: 'var(--accent-rose)', fontWeight: 'bold', fontSize: '16px' }}>✕</span>
                  <div style={{ fontSize: '13.5px', color: 'var(--text-primary)', lineHeight: 1.4 }}>
                    {fm}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
