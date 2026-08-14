import React, { useState } from 'react';
import { X, Search, Layers, ArrowRight } from 'lucide-react';

export default function PatternCatalogModal({ isOpen, onClose, patterns = [], onSelectPattern }) {
  const [filter, setFilter] = useState('');

  if (!isOpen) return null;

  const filtered = patterns.filter((p) =>
    p.name.toLowerCase().includes(filter.toLowerCase()) ||
    (p.category || '').toLowerCase().includes(filter.toLowerCase()) ||
    (p.description || '').toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Layers size={20} color="var(--accent-cyan)" />
            <div>
              <h3 style={{ fontSize: '18px', fontWeight: 800 }}>Verified Pattern Database</h3>
              <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                20 production-grade architecture systems with pre-validated data models
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
          >
            <X size={20} />
          </button>
        </div>

        <div style={{ padding: '16px 24px 0' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: 'var(--bg-card)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-md)',
            padding: '8px 14px'
          }}>
            <Search size={16} color="var(--text-muted)" />
            <input
              type="text"
              placeholder="Filter by keyword, name, category (e.g. auth, payment, rbac)..."
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              style={{
                background: 'transparent',
                border: 'none',
                outline: 'none',
                color: 'var(--text-primary)',
                width: '100%',
                fontSize: '13.5px'
              }}
            />
          </div>
        </div>

        <div className="modal-body">
          {filtered.map((p) => (
            <div
              key={p.id}
              className="catalog-card"
              onClick={() => {
                onSelectPattern(p);
                onClose();
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                <span style={{
                  fontSize: '11px',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  color: 'var(--accent-blue)',
                  letterSpacing: '0.05em'
                }}>
                  {p.category || 'System'}
                </span>
                <ArrowRight size={14} color="var(--text-muted)" />
              </div>
              <h4>{p.name}</h4>
              <p>{p.description}</p>
            </div>
          ))}

          {filtered.length === 0 && (
            <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '40px 20px', color: 'var(--text-muted)' }}>
              No patterns matching "{filter}". Try "auth", "saas", "chat", or "ecommerce".
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
