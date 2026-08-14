import React, { useState, useEffect } from 'react';
import { Sparkles, Layers, BookOpen, AlertCircle, GitBranch } from 'lucide-react';
import PromptInput from './components/PromptInput';
import MCQPanel from './components/MCQPanel';
import SpecOutput from './components/SpecOutput';
import LoadingState from './components/LoadingState';
import PatternCatalogModal from './components/PatternCatalogModal';
import { interpretPrompt, generateSpec, fetchAllPatterns } from './api';

export default function App() {
  const [view, setView] = useState('input'); // 'input' | 'loading' | 'clarify' | 'spec'
  const [loadingMessage, setLoadingMessage] = useState('Synthesizing precision specification...');
  const [promptText, setPromptText] = useState('');
  const [interpretation, setInterpretation] = useState(null);
  const [specData, setSpecData] = useState(null);
  const [allPatterns, setAllPatterns] = useState([]);
  const [catalogOpen, setCatalogOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  // Fetch initial pattern catalog
  useEffect(() => {
    fetchAllPatterns()
      .then((patterns) => {
        setAllPatterns(patterns || []);
      })
      .catch((err) => {
        console.warn('Could not fetch patterns catalog initially:', err);
      });
  }, []);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  // Step 1: User submits a prompt
  const handlePromptSubmit = async (text) => {
    setPromptText(text);
    setErrorMessage(null);
    setView('loading');
    setLoadingMessage('Analyzing intent & classifying architecture pattern...');

    try {
      const result = await interpretPrompt(text);
      setInterpretation(result);
      if (result.all_available_patterns && allPatterns.length === 0) {
        setAllPatterns(result.all_available_patterns);
      }
      setView('clarify');
    } catch (err) {
      console.error('Interpret error:', err);
      setErrorMessage(err.message || 'Failed to interpret prompt. Please try again.');
      setView('input');
    }
  };

  // Direct selection from catalog
  const handleSelectPatternDirectly = (pattern) => {
    const directInterpretation = {
      matched_pattern: pattern.id,
      pattern_name: pattern.name,
      pattern_category: pattern.category || 'system',
      pattern_description: pattern.description || '',
      pattern_confidence: 0.99,
      reasoning: `Directly selected '${pattern.name}' from verified pattern catalog.`,
      clarifying_questions: pattern.clarifying_questions || [],
      known_failure_modes: pattern.known_failure_modes || [],
      web_sources: [
        {
          title: `${pattern.name} Architecture Reference`,
          body: `Verified production schema with ${Object.keys(pattern.data_models || {}).length} relational data models.`,
          href: 'https://sudolaps.top/oneshot'
        }
      ]
    };
    setInterpretation(directInterpretation);
    setView('clarify');
  };

  // Step 2: User answers MCQs and clicks Generate Spec
  const handleGenerateSpec = async ({ patternId, answers, stack, customRequirements }) => {
    setErrorMessage(null);
    setView('loading');
    setLoadingMessage('Compiling formal .spec file & LLM directives...');

    try {
      const domainMeta = {
        domain_title: interpretation?.domain_title,
        domain_summary: interpretation?.domain_summary,
        domain_models: interpretation?.domain_models,
        user_prompt: interpretation?.user_prompt || promptText
      };
      const result = await generateSpec(patternId, answers, stack, customRequirements, domainMeta);
      setSpecData(result);
      setView('spec');
    } catch (err) {
      console.error('Generate spec error:', err);
      setErrorMessage(err.message || 'Failed to generate specification. Please try again.');
      setView('clarify');
    }
  };

  return (
    <div className="app-container">
      {/* Navigation Header */}
      <header className="app-header">
        <div className="brand-logo" onClick={() => setView('input')}>
          <div className="logo-badge">
            <Sparkles size={20} />
          </div>
          <div>
            <div className="brand-name">
              One<span>Shot</span>
            </div>
          </div>
          <span className="brand-tagline">/ Precision Spec Engine</span>
        </div>

        <div className="header-actions">
          <button
            type="button"
            className="btn-secondary-sm"
            onClick={() => setCatalogOpen(true)}
          >
            <Layers size={15} />
            <span>Patterns ({allPatterns.length || 20})</span>
          </button>

          <a
            href="https://github.com/ahmedxuhri/oneshot"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-secondary-sm"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"></path>
              <path d="M9 18c-4.51 2-5-2-7-2"></path>
            </svg>
            <span>GitHub</span>
          </a>
        </div>
      </header>

      {/* Error Alert */}
      {errorMessage && (
        <div style={{
          background: 'rgba(244, 63, 94, 0.1)',
          border: '1px solid rgba(244, 63, 94, 0.3)',
          color: 'var(--accent-rose)',
          padding: '12px 18px',
          borderRadius: 'var(--radius-md)',
          marginBottom: '20px',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          fontSize: '14px'
        }}>
          <AlertCircle size={18} />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Main View Router */}
      <main style={{ flex: 1 }}>
        {view === 'input' && (
          <PromptInput
            onSubmit={handlePromptSubmit}
            onOpenCatalog={() => setCatalogOpen(true)}
            patternCount={allPatterns.length || 20}
          />
        )}

        {view === 'loading' && (
          <LoadingState message={loadingMessage} />
        )}

        {view === 'clarify' && interpretation && (
          <MCQPanel
            interpretation={interpretation}
            onGenerate={handleGenerateSpec}
            onBack={() => setView('input')}
            onChangePattern={() => setCatalogOpen(true)}
          />
        )}

        {view === 'spec' && specData && (
          <SpecOutput
            specData={specData}
            onReset={() => {
              setInterpretation(null);
              setSpecData(null);
              setView('input');
            }}
            onEdit={() => setView('clarify')}
            onShowToast={showToast}
          />
        )}
      </main>

      {/* Toast Notice */}
      {toastMessage && (
        <div className="toast-notice">
          <Sparkles size={16} color="var(--accent-cyan)" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Pattern Catalog Modal */}
      <PatternCatalogModal
        isOpen={catalogOpen}
        onClose={() => setCatalogOpen(false)}
        patterns={allPatterns}
        onSelectPattern={handleSelectPatternDirectly}
      />

      {/* Footer */}
      <footer className="app-footer">
        <p>
          OneShot — Zero-ambiguity precision specifications for AI coding agents.
        </p>
        <div className="footer-links">
          <a href="https://github.com/ahmedxuhri/oneshot" target="_blank" rel="noopener noreferrer" className="footer-link">
            GitHub Repository
          </a>
          <span>•</span>
          <a href="https://sudolaps.top" target="_blank" rel="noopener noreferrer" className="footer-link">
            sudolaps.top
          </a>
          <span>•</span>
          <a href="https://github.com/ahmedxuhri/oneshot/blob/main/VISION.md" target="_blank" rel="noopener noreferrer" className="footer-link">
            Manifesto
          </a>
        </div>
      </footer>
    </div>
  );
}
