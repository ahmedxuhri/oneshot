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
  ExternalLink,
  Smartphone,
  Sparkles,
  ShieldCheck,
  Wand2,
  Palette,
  Laptop,
  Apple,
  Filter
} from 'lucide-react';
import { auditStack } from '../api';

const CURATED_THEMES = [
  {
    id: 'linear_dark',
    name: 'Linear Dark / Midnight Glow',
    badge: 'Developer / Modern Dark',
    category: 'curated',
    badgeColor: '#00F2FE',
    desc: 'Deep obsidian surfaces, electric cyan CTAs, glass borders, high-contrast monospace accents.',
    bgPreview: '#08090C',
    cardPreview: '#151821',
    primaryColor: '#00F2FE',
    accentColor: '#10B981',
    textColor: '#F8FAFC',
    subTextColor: '#94A3B8',
    borderColor: 'rgba(255, 255, 255, 0.15)',
    btnRadius: '6px',
    bestFor: 'Modern Web Apps, Developer Tools & SaaS'
  },
  {
    id: 'material_you',
    name: 'Material Design 3 / Android M3',
    badge: 'Android 15 Native',
    category: 'platform',
    badgeColor: '#A8C7FA',
    desc: 'Google Material You dynamic tonal palette, pill-shaped buttons, 48dp touch targets.',
    bgPreview: '#111318',
    cardPreview: '#282A2F',
    primaryColor: '#A8C7FA',
    accentColor: '#A8DAB5',
    textColor: '#E2E2E9',
    subTextColor: '#C4C6D0',
    borderColor: 'rgba(196, 198, 208, 0.22)',
    btnRadius: '9999px',
    bestFor: 'Native Android (Jetpack Compose) & Mobile Apps'
  },
  {
    id: 'apple_hig',
    name: 'Apple HIG / Clean Glass',
    badge: 'iOS / macOS Native',
    category: 'platform',
    badgeColor: '#0A84FF',
    desc: 'Cupertino frosted glassmorphism, SF Pro typography, refined hairline dividers.',
    bgPreview: '#000000',
    cardPreview: '#1C1C1E',
    primaryColor: '#0A84FF',
    accentColor: '#30D158',
    textColor: '#FFFFFF',
    subTextColor: 'rgba(235, 235, 245, 0.6)',
    borderColor: 'rgba(255, 255, 255, 0.2)',
    btnRadius: '10px',
    bestFor: 'iOS Native (SwiftUI) & Creative Utility Tools'
  },
  {
    id: 'saas_clean_light',
    name: 'Stripe / Clean Soft-SaaS',
    badge: 'Enterprise Light',
    category: 'curated',
    badgeColor: '#6366F1',
    desc: 'Crisp white cards, soft ambient drop shadows, indigo primary CTAs, high daylight legibility.',
    bgPreview: '#F8FAFC',
    cardPreview: '#FFFFFF',
    primaryColor: '#6366F1',
    accentColor: '#10B981',
    textColor: '#0F172A',
    subTextColor: '#64748B',
    borderColor: '#E2E8F0',
    btnRadius: '8px',
    bestFor: 'Admin Dashboards, B2B SaaS & Billing Portals'
  },
  {
    id: 'tactical_mono',
    name: 'Tactical Monospace / FinTech',
    badge: 'Telemetry / Terminal',
    category: 'curated',
    badgeColor: '#F59E0B',
    desc: 'High-density telemetry, neon amber status indicators, compact 4px spacing, sharp edges.',
    bgPreview: '#05070A',
    cardPreview: '#131822',
    primaryColor: '#F59E0B',
    accentColor: '#10B981',
    textColor: '#F0F6FC',
    subTextColor: '#8B949E',
    borderColor: '#30363D',
    btnRadius: '3px',
    bestFor: 'Crypto Bots, IoT Telemetry & Trading Terminal UI'
  },
  {
    id: 'luxury_gold_noir',
    name: 'Luxury Noir & Royal Gold',
    badge: 'Haute Horlogerie / VIP',
    category: 'curated',
    badgeColor: '#D4AF37',
    desc: 'Velvet obsidian surfaces, brushed champagne gold accents, serif editorial headings.',
    bgPreview: '#090A0D',
    cardPreview: '#14151B',
    primaryColor: '#D4AF37',
    accentColor: '#E5C158',
    textColor: '#F9F9FB',
    subTextColor: '#9E9EA7',
    borderColor: 'rgba(212, 175, 55, 0.25)',
    btnRadius: '4px',
    bestFor: 'Luxury Boutiques, Premium Concierge & High-End E-Commerce'
  },
  {
    id: 'clinical_teal_health',
    name: 'Clinical Teal & Serene Care',
    badge: 'Health & Medical',
    category: 'curated',
    badgeColor: '#0D9488',
    desc: 'Sterile high-clarity surfaces, soothing teal accents, maximum accessibility contrast.',
    bgPreview: '#F8FAFC',
    cardPreview: '#FFFFFF',
    primaryColor: '#0D9488',
    accentColor: '#0284C7',
    textColor: '#0F172A',
    subTextColor: '#64748B',
    borderColor: '#E2E8F0',
    btnRadius: '10px',
    bestFor: 'Patient Portals, Clinical Care & Telehealth'
  },
  {
    id: 'cyberpunk_violet',
    name: 'Cyberpunk / Neon Violet',
    badge: 'Gaming & Web3',
    category: 'curated',
    badgeColor: '#A855F7',
    desc: 'Abyssal dark backgrounds, hyper-saturated neon violet and hot pink gradients, glowing borders.',
    bgPreview: '#07060A',
    cardPreview: '#120E1C',
    primaryColor: '#A855F7',
    accentColor: '#EC4899',
    textColor: '#FAF5FF',
    subTextColor: '#A855F7',
    borderColor: 'rgba(168, 85, 247, 0.3)',
    btnRadius: '6px',
    bestFor: 'Gaming Hubs, Web3 dApps & Entertainment'
  }
];

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
    target_platform,
    domain_title,
    domain_summary,
    user_prompt,
    reasoning,
    clarifying_questions = [],
    known_failure_modes = [],
    suggested_themes = [],
    web_sources = []
  } = interpretation;

  // Determine initial platform target
  const promptLower = (user_prompt || '').toLowerCase();
  const initialPlatform = target_platform || (
    promptLower.includes('android') || matched_pattern.includes('android') ? 'android' :
    promptLower.includes('ios') || promptLower.includes('swift') ? 'ios' :
    promptLower.includes('flutter') || promptLower.includes('react native') || matched_pattern.includes('mobile') || pattern_category === 'mobile' ? 'cross_platform_mobile' :
    'fullstack_web'
  );

  const [platform, setPlatform] = useState(initialPlatform);

  // Combine dynamic AI-generated themes with curated library
  const aiThemes = (suggested_themes || []).map((t, idx) => ({
    ...t,
    id: t.id || `ai_theme_${idx}`,
    category: 'ai_tailored',
    badge: t.badge || '✨ AI Tailored'
  }));

  const allThemesList = [...aiThemes, ...CURATED_THEMES];

  // Theme filter tab: 'all' | 'ai_tailored' | 'platform'
  const [themeFilter, setThemeFilter] = useState(aiThemes.length > 0 ? 'ai_tailored' : 'all');

  // Smart initial design theme
  const initialTheme = aiThemes.length > 0 ? aiThemes[0] : (
    platform === 'android' || platform === 'cross_platform_mobile' ? CURATED_THEMES[1] : 
    platform === 'ios' ? CURATED_THEMES[2] : 
    (['admin', 'crm', 'saas'].includes(pattern_category) ? CURATED_THEMES[3] : CURATED_THEMES[0])
  );
  
  const [selectedThemeObj, setSelectedThemeObj] = useState(initialTheme);

  // Initialize state with default first option for each clarifying question
  const [answers, setAnswers] = useState({});
  const [stack, setStack] = useState({
    backend: 'Kotlin (Jetpack Compose + Coroutines)',
    database: 'Room DB (SQLite + Flow)',
    cache: 'EncryptedDataStore / Android Keystore',
    frontend: 'Jetpack Compose (Material 3 UI)'
  });
  const [customNotes, setCustomNotes] = useState('');
  const [auditData, setAuditData] = useState(null);

  // Apply default stack when platform changes
  const applyPlatformDefaults = (p) => {
    setPlatform(p);
    if (p === 'android') {
      setStack({
        backend: 'Kotlin (Jetpack Compose + Coroutines)',
        database: 'Room DB (SQLite + Flow)',
        cache: 'EncryptedDataStore / Android Keystore',
        frontend: 'Jetpack Compose (Material 3 UI)'
      });
      if (!selectedThemeObj || selectedThemeObj.category !== 'ai_tailored') {
        setSelectedThemeObj(CURATED_THEMES[1]); // Material You
      }
    } else if (p === 'cross_platform_mobile') {
      setStack({
        backend: 'Flutter (Dart + Riverpod)',
        database: 'Hive / Isar (Flutter)',
        cache: 'MMKV (High Performance Key-Value)',
        frontend: 'Flutter Material 3'
      });
    } else if (p === 'ios') {
      setStack({
        backend: 'Swift (SwiftUI + Combine/Async)',
        database: 'SwiftData (iOS 17+) / CoreData',
        cache: 'Keychain Services (Biometric)',
        frontend: 'SwiftUI (Apple HIG)'
      });
      if (!selectedThemeObj || selectedThemeObj.category !== 'ai_tailored') {
        setSelectedThemeObj(CURATED_THEMES[2]); // Apple HIG
      }
    } else {
      setStack({
        backend: 'Python (FastAPI)',
        database: 'PostgreSQL',
        cache: 'Redis',
        frontend: 'React (Vite SPA + Tailwind)'
      });
      if (!selectedThemeObj || selectedThemeObj.category !== 'ai_tailored') {
        setSelectedThemeObj(CURATED_THEMES[0]); // Linear Dark
      }
    }
  };

  useEffect(() => {
    const initialAnswers = {};
    clarifying_questions.forEach((q) => {
      if (q.options && q.options.length > 0) {
        initialAnswers[q.id] = q.options[0];
      }
    });
    setAnswers(initialAnswers);
    applyPlatformDefaults(initialPlatform);
  }, [clarifying_questions, initialPlatform]);

  // Run live AI audit whenever stack or answers change
  useEffect(() => {
    let active = true;
    auditStack(matched_pattern, stack, answers).then((res) => {
      if (active && res) {
        setAuditData(res);
      }
    });
    return () => {
      active = false;
    };
  }, [matched_pattern, stack, answers]);

  const handleSelectOption = (questionId, option) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: option
    }));
  };

  const applyAutoFix = (suggestion) => {
    setStack((prev) => ({
      ...prev,
      [suggestion.field]: suggestion.recommended
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!loading) {
      onGenerate({
        patternId: matched_pattern,
        answers,
        stack,
        customRequirements: customNotes,
        designTheme: selectedThemeObj
      });
    }
  };

  const displayedThemes = allThemesList.filter((t) => {
    if (themeFilter === 'ai_tailored') return t.category === 'ai_tailored';
    if (themeFilter === 'platform') return t.category === 'platform';
    return true; // 'all'
  });

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

        {domain_title && domain_title !== pattern_name && (
          <div style={{
            background: 'rgba(56, 189, 248, 0.08)',
            border: '1px solid rgba(56, 189, 248, 0.25)',
            borderRadius: 'var(--radius-sm)',
            padding: '10px 14px',
            marginBottom: '14px',
            display: 'flex',
            alignItems: 'baseline',
            gap: '8px'
          }}>
            <span style={{ fontSize: '11px', textTransform: 'uppercase', color: 'var(--accent-cyan)', fontWeight: 800, letterSpacing: '0.5px' }}>
              Target App:
            </span>
            <span style={{ fontSize: '14px', color: '#0f172a', fontWeight: 700 }}>{domain_title}</span>
            {domain_summary && (
              <span style={{ fontSize: '13px', color: 'var(--text-secondary)', marginLeft: '4px' }}>— {domain_summary}</span>
            )}
          </div>
        )}

        <div className="matched-meta">
          <div className="meta-item">
            <span style={{ color: 'var(--text-muted)' }}>Architecture:</span>
            <strong style={{ color: 'var(--text-primary)' }}>{pattern_name}</strong>
          </div>
          <div className="meta-item">
            <span style={{ color: 'var(--text-muted)' }}>Detected Platform:</span>
            <strong style={{ color: 'var(--accent-cyan)', textTransform: 'capitalize' }}>
              {platform === 'android' ? '📱 Native Android' : platform === 'ios' ? '🍎 Native iOS' : platform === 'cross_platform_mobile' ? '📱 Cross-Platform Mobile' : '💻 Full-Stack Web'}
            </strong>
          </div>
          <div className="meta-item">
            <span style={{ color: 'var(--text-muted)' }}>AI Reasoning:</span>
            <span>{reasoning}</span>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Section 1: Clarifying Questions (3-5 MCQs) */}
        <div className="questions-list">
          <div className="section-heading">
            <Settings2 size={18} color="var(--accent-cyan)" />
            <span>Clarification & Architecture Decisions</span>
          </div>

          {clarifying_questions.map((q, idx) => (
            <div key={q.id || idx} className="question-card">
              <div className="question-header">
                <div className="question-title-row">
                  <span className="question-number">
                    0{idx + 1}.
                  </span>
                  <span className="question-title">{q.question}</span>
                </div>
                {q.impacts && (
                  <div className="question-impact">
                    <span style={{ color: 'var(--accent-cyan)', fontWeight: 600 }}>Impact:</span>
                    <span>{q.impacts}</span>
                  </div>
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

        {/* Section 2: Visual UI/UX & Design System Selector */}
        <div className="theme-selector-section" style={{
          background: 'var(--bg-surface)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-lg)',
          padding: '24px',
          marginBottom: '28px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px', marginBottom: '8px' }}>
            <div className="section-heading" style={{ margin: 0 }}>
              <Palette size={18} color="var(--accent-cyan)" />
              <span>Visual Design System & Aesthetic (DESIGN.md)</span>
            </div>
            <span style={{ fontSize: '12px', color: 'var(--accent-cyan)', fontFamily: 'var(--font-mono)', fontWeight: 700 }}>
              Google Labs DESIGN.md Standard
            </span>
          </div>

          <p style={{ fontSize: '13.5px', color: 'var(--text-secondary)', marginBottom: '14px', lineHeight: 1.5 }}>
            Pick the visual identity for your app. The engine generates tokenized palettes, typography scales, and 48dp touch targets to stop AI design drift.
          </p>

          {/* Theme Category Filter Bar */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            marginBottom: '16px',
            flexWrap: 'wrap'
          }}>
            {aiThemes.length > 0 && (
              <button
                type="button"
                onClick={() => setThemeFilter('ai_tailored')}
                style={{
                  background: themeFilter === 'ai_tailored' ? 'rgba(0, 242, 254, 0.18)' : 'var(--bg-card)',
                  border: themeFilter === 'ai_tailored' ? '1.5px solid var(--accent-cyan)' : '1px solid var(--border-subtle)',
                  color: themeFilter === 'ai_tailored' ? 'var(--accent-cyan)' : 'var(--text-secondary)',
                  padding: '6px 14px',
                  borderRadius: '9999px',
                  fontSize: '12.5px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <Sparkles size={13} />
                <span>✨ AI-Tailored for your App ({aiThemes.length})</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => setThemeFilter('all')}
              style={{
                background: themeFilter === 'all' ? '#f1f5f9' : '#ffffff',
                border: themeFilter === 'all' ? '1.5px solid #0f172a' : '1px solid var(--border-subtle)',
                color: themeFilter === 'all' ? '#0f172a' : 'var(--text-secondary)',
                padding: '6px 14px',
                borderRadius: '9999px',
                fontSize: '12.5px',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              All Styles ({allThemesList.length})
            </button>

            <button
              type="button"
              onClick={() => setThemeFilter('platform')}
              style={{
                background: themeFilter === 'platform' ? 'rgba(56, 189, 248, 0.15)' : 'var(--bg-card)',
                border: themeFilter === 'platform' ? '1.5px solid var(--accent-blue)' : '1px solid var(--border-subtle)',
                color: themeFilter === 'platform' ? 'var(--accent-blue)' : 'var(--text-secondary)',
                padding: '6px 14px',
                borderRadius: '9999px',
                fontSize: '12.5px',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              📱 Platform Standards (Material / HIG)
            </button>
          </div>

          {/* Theme Cards Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '14px'
          }}>
            {displayedThemes.map((t) => {
              const isSelected = selectedThemeObj?.id === t.id;
              return (
                <div
                  key={t.id}
                  onClick={() => setSelectedThemeObj(t)}
                  style={{
                    background: isSelected ? 'rgba(56, 189, 248, 0.1)' : 'var(--bg-card)',
                    border: isSelected ? '2px solid var(--accent-cyan)' : '1px solid var(--border-card)',
                    borderRadius: 'var(--radius-md)',
                    padding: '16px',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    boxShadow: isSelected ? '0 0 20px rgba(0, 242, 254, 0.18)' : 'none'
                  }}
                >
                  {/* Top Bar with Title and Badge */}
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div className="radio-circle" style={{
                          borderColor: isSelected ? 'var(--accent-cyan)' : '#94a3b8',
                          background: isSelected ? 'var(--accent-cyan)' : 'transparent'
                        }}>
                          {isSelected && <div className="radio-inner-dot" />}
                        </div>
                        <span style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-primary)' }}>
                          {t.name}
                        </span>
                      </div>
                      <span style={{
                        fontSize: '11px',
                        fontWeight: 700,
                        fontFamily: 'var(--font-mono)',
                        padding: '2px 8px',
                        borderRadius: '9999px',
                        background: `${t.badgeColor || '#00F2FE'}22`,
                        color: t.badgeColor || '#00F2FE',
                        border: `1px solid ${t.badgeColor || '#00F2FE'}44`
                      }}>
                        {t.badge}
                      </span>
                    </div>

                    <p style={{ fontSize: '12.5px', color: 'var(--text-secondary)', lineHeight: 1.4, margin: '8px 0 12px 0' }}>
                      {t.desc}
                    </p>
                  </div>

                  {/* Visual Preview Box (Mini UI Mockup) */}
                  <div>
                    <div style={{
                      background: t.bgPreview || '#08090C',
                      border: `1px solid ${t.borderColor || 'rgba(255,255,255,0.15)'}`,
                      borderRadius: '8px',
                      padding: '10px',
                      marginBottom: '10px'
                    }}>
                      {/* Mini Card */}
                      <div style={{
                        background: t.cardPreview || '#151821',
                        border: `1px solid ${t.borderColor || 'rgba(255,255,255,0.15)'}`,
                        borderRadius: t.btnRadius === '9999px' ? '12px' : (t.btnRadius || '6px'),
                        padding: '8px 10px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        marginBottom: '8px'
                      }}>
                        <div>
                          <div style={{ fontSize: '11px', fontWeight: 700, color: t.textColor || '#FFFFFF' }}>Preview Card</div>
                          <div style={{ fontSize: '9.5px', color: t.subTextColor || '#94A3B8' }}>48dp Touch Target</div>
                        </div>

                        {/* Mini Button */}
                        <div style={{
                          background: t.primaryColor || '#00F2FE',
                          color: (t.bgPreview === '#FFFFFF' || t.bgPreview === '#F8FAFC') && t.id !== 'saas_clean_light' ? '#000000' : (t.id === 'saas_clean_light' || t.id === 'clinical_teal_health' ? '#FFFFFF' : '#000000'),
                          fontSize: '10px',
                          fontWeight: 700,
                          padding: '4px 10px',
                          borderRadius: t.btnRadius || '6px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '3px'
                        }}>
                          <span>Action</span>
                        </div>
                      </div>

                      {/* Color Palette Dots */}
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <span style={{ fontSize: '10px', color: t.subTextColor || '#94A3B8', fontFamily: 'var(--font-mono)' }}>Palette:</span>
                          <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: t.bgPreview, border: '1px solid rgba(255,255,255,0.4)' }} title="Background" />
                          <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: t.cardPreview, border: '1px solid rgba(255,255,255,0.2)' }} title="Surface" />
                          <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: t.primaryColor }} title="Primary Accent" />
                          <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: t.accentColor }} title="Status" />
                        </div>
                        <span style={{ fontSize: '10px', color: t.subTextColor || '#94A3B8', fontFamily: 'var(--font-mono)' }}>WCAG AA ✓</span>
                      </div>
                    </div>

                    <div style={{ fontSize: '11px', color: 'var(--accent-cyan)', fontFamily: 'var(--font-mono)' }}>
                      💡 Best for: {t.bestFor || 'Custom Production Application'}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Section 3: Tech Stack Customizer with Live Platform Target Switcher */}
        <div className="stack-section">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px', marginBottom: '16px' }}>
            <div className="section-heading" style={{ margin: 0 }}>
              {platform === 'android' ? <Smartphone size={18} color="var(--accent-cyan)" /> : 
               platform === 'ios' ? <Apple size={18} color="var(--accent-cyan)" /> :
               platform === 'cross_platform_mobile' ? <Smartphone size={18} color="var(--accent-blue)" /> : 
               <Laptop size={18} color="var(--accent-blue)" />}
              <span>Target Technology Stack</span>
            </div>

            {auditData && (
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '4px 10px',
                borderRadius: '9999px',
                fontSize: '12px',
                fontWeight: 700,
                fontFamily: 'var(--font-mono)',
                background: auditData.status === 'optimal' ? 'rgba(16, 185, 129, 0.12)' : 'rgba(244, 63, 94, 0.15)',
                color: auditData.status === 'optimal' ? 'var(--accent-emerald)' : 'var(--accent-rose)',
                border: `1px solid ${auditData.status === 'optimal' ? 'rgba(16, 185, 129, 0.3)' : 'rgba(244, 63, 94, 0.3)'}`
              }}>
                <Sparkles size={12} />
                <span>{auditData.status === 'optimal' ? 'AI Stack Audit: 100% Cohesive' : 'AI Stack Audit: Incompatible Choices'}</span>
              </div>
            )}
          </div>

          {/* Interactive Platform Target Switcher Tabs */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontSize: '11px', color: 'var(--text-muted)', fontWeight: 700, marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Select Platform Target (Auto-Configures Stack)
            </label>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
              gap: '8px'
            }}>
              <button
                type="button"
                onClick={() => applyPlatformDefaults('android')}
                style={{
                  background: platform === 'android' ? 'rgba(0, 242, 254, 0.15)' : 'var(--bg-card)',
                  border: platform === 'android' ? '2px solid var(--accent-cyan)' : '1px solid var(--border-subtle)',
                  color: platform === 'android' ? '#0f172a' : 'var(--text-secondary)',
                  padding: '10px 14px',
                  borderRadius: 'var(--radius-md)',
                  fontWeight: 700,
                  fontSize: '13px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  cursor: 'pointer',
                  transition: 'all 0.18s ease'
                }}
              >
                <Smartphone size={16} color={platform === 'android' ? 'var(--accent-cyan)' : 'inherit'} />
                <span>📱 Native Android (Kotlin)</span>
              </button>

              <button
                type="button"
                onClick={() => applyPlatformDefaults('cross_platform_mobile')}
                style={{
                  background: platform === 'cross_platform_mobile' ? 'rgba(56, 189, 248, 0.15)' : 'var(--bg-card)',
                  border: platform === 'cross_platform_mobile' ? '2px solid var(--accent-blue)' : '1px solid var(--border-subtle)',
                  color: platform === 'cross_platform_mobile' ? '#0f172a' : 'var(--text-secondary)',
                  padding: '10px 14px',
                  borderRadius: 'var(--radius-md)',
                  fontWeight: 700,
                  fontSize: '13px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  cursor: 'pointer',
                  transition: 'all 0.18s ease'
                }}
              >
                <Smartphone size={16} color={platform === 'cross_platform_mobile' ? 'var(--accent-blue)' : 'inherit'} />
                <span>📱 Flutter / React Native</span>
              </button>

              <button
                type="button"
                onClick={() => applyPlatformDefaults('ios')}
                style={{
                  background: platform === 'ios' ? 'rgba(10, 132, 255, 0.15)' : 'var(--bg-card)',
                  border: platform === 'ios' ? '2px solid #0A84FF' : '1px solid var(--border-subtle)',
                  color: platform === 'ios' ? '#0f172a' : 'var(--text-secondary)',
                  padding: '10px 14px',
                  borderRadius: 'var(--radius-md)',
                  fontWeight: 700,
                  fontSize: '13px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  cursor: 'pointer',
                  transition: 'all 0.18s ease'
                }}
              >
                <Apple size={16} color={platform === 'ios' ? '#0A84FF' : 'inherit'} />
                <span>🍎 Native iOS (SwiftUI)</span>
              </button>

              <button
                type="button"
                onClick={() => applyPlatformDefaults('fullstack_web')}
                style={{
                  background: platform === 'fullstack_web' ? 'rgba(99, 102, 241, 0.15)' : 'var(--bg-card)',
                  border: platform === 'fullstack_web' ? '2px solid #6366F1' : '1px solid var(--border-subtle)',
                  color: platform === 'fullstack_web' ? '#0f172a' : 'var(--text-secondary)',
                  padding: '10px 14px',
                  borderRadius: 'var(--radius-md)',
                  fontWeight: 700,
                  fontSize: '13px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  cursor: 'pointer',
                  transition: 'all 0.18s ease'
                }}
              >
                <Laptop size={16} color={platform === 'fullstack_web' ? '#6366F1' : 'inherit'} />
                <span>💻 Full-Stack Web App</span>
              </button>
            </div>
          </div>

          {/* AI Audit Warning & Auto-Fix Banner */}
          {auditData && auditData.suggestions && auditData.suggestions.length > 0 && (
            <div style={{
              background: 'linear-gradient(135deg, rgba(244, 63, 94, 0.1) 0%, rgba(245, 158, 11, 0.08) 100%)',
              border: '1px solid rgba(244, 63, 94, 0.35)',
              borderRadius: 'var(--radius-md)',
              padding: '14px 18px',
              marginBottom: '18px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--accent-rose)', fontWeight: 700, fontSize: '13.5px', marginBottom: '8px' }}>
                <AlertTriangle size={16} />
                <span>AI Architecture Advisor: Stack Inconsistency Detected</span>
              </div>

              {auditData.suggestions.map((sugg, sIdx) => (
                <div key={sIdx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', marginTop: '6px' }}>
                  <div style={{ fontSize: '13px', color: 'var(--text-secondary)', maxWidth: '580px' }}>
                    <strong style={{ color: 'var(--text-primary)', textTransform: 'capitalize' }}>{sugg.field}:</strong>{' '}
                    <span style={{ color: 'var(--accent-rose)', textDecoration: 'line-through' }}>{sugg.current}</span> ➔{' '}
                    <span style={{ color: 'var(--accent-emerald)', fontWeight: 700 }}>{sugg.recommended}</span>. {sugg.reason}
                  </div>

                  <button
                    type="button"
                    className="btn-secondary-sm"
                    onClick={() => applyAutoFix(sugg)}
                    style={{
                      background: 'rgba(16, 185, 129, 0.15)',
                      borderColor: 'rgba(16, 185, 129, 0.4)',
                      color: 'var(--accent-emerald)',
                      fontWeight: 700
                    }}
                  >
                    <Wand2 size={13} />
                    <span>Auto-Fix Stack</span>
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="stack-grid">
            {/* Field 1: Language / Framework */}
            <div className="stack-item">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                <label style={{ margin: 0 }}>Language / Core Framework</label>
                {auditData?.stack_verdicts?.backend && (
                  <span style={{
                    fontSize: '10.5px',
                    fontFamily: 'var(--font-mono)',
                    color: auditData.stack_verdicts.backend.status === 'optimal' ? 'var(--accent-emerald)' : 'var(--accent-rose)'
                  }}>
                    {auditData.stack_verdicts.backend.status === 'optimal' ? '✓ Optimal' : '⚠️ Warning'}
                  </span>
                )}
              </div>
              <select
                className="stack-select"
                value={stack.backend}
                onChange={(e) => setStack({ ...stack, backend: e.target.value })}
              >
                <optgroup label="Native Android & Kotlin">
                  <option value="Kotlin (Jetpack Compose + Coroutines)">Kotlin (Jetpack Compose + Coroutines) ⭐</option>
                  <option value="Kotlin Multiplatform (KMP)">Kotlin Multiplatform (KMP)</option>
                  <option value="Java (Android Native)">Java (Android Native)</option>
                </optgroup>
                <optgroup label="Cross-Platform Mobile">
                  <option value="Flutter (Dart + Riverpod)">Flutter (Dart + Riverpod) ⭐</option>
                  <option value="React Native (Expo + TypeScript)">React Native (Expo + TypeScript) ⭐</option>
                </optgroup>
                <optgroup label="Native Apple / iOS">
                  <option value="Swift (SwiftUI + Combine/Async)">Swift (SwiftUI + Combine/Async) ⭐</option>
                  <option value="Swift (UIKit + Swift Concurrency)">Swift (UIKit + Swift Concurrency)</option>
                </optgroup>
                <optgroup label="Backend & Web Frameworks">
                  <option value="Python (FastAPI)">Python (FastAPI) ⭐</option>
                  <option value="Python (Django / DRF)">Python (Django / DRF)</option>
                  <option value="Node.js (Next.js App Router)">Node.js (Next.js App Router)</option>
                  <option value="Node.js (Express / Fastify)">Node.js (Express / Fastify)</option>
                  <option value="Node.js (NestJS)">Node.js (NestJS)</option>
                  <option value="Go (Gin / Fiber)">Go (Gin / Fiber)</option>
                  <option value="Rust (Axum)">Rust (Axum)</option>
                </optgroup>
              </select>
            </div>

            {/* Field 2: Database / Local Storage */}
            <div className="stack-item">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                <label style={{ margin: 0 }}>Database / Local Storage</label>
                {auditData?.stack_verdicts?.database && (
                  <span style={{
                    fontSize: '10.5px',
                    fontFamily: 'var(--font-mono)',
                    color: auditData.stack_verdicts.database.status === 'optimal' ? 'var(--accent-emerald)' : 'var(--accent-rose)'
                  }}>
                    {auditData.stack_verdicts.database.status === 'optimal' ? '✓ Optimal' : '⚠️ Mismatch'}
                  </span>
                )}
              </div>
              <select
                className="stack-select"
                value={stack.database}
                onChange={(e) => setStack({ ...stack, database: e.target.value })}
                style={{
                  borderColor: auditData?.stack_verdicts?.database?.status === 'warning' ? 'var(--accent-rose)' : 'inherit'
                }}
              >
                <optgroup label="Mobile Embedded Databases">
                  <option value="Room DB (SQLite + Flow)">Room DB (SQLite + Flow) ⭐ (Android)</option>
                  <option value="SQLDelight (Multiplatform)">SQLDelight (Multiplatform)</option>
                  <option value="Hive / Isar (Flutter)">Hive / Isar (Flutter)</option>
                  <option value="WatermelonDB (React Native)">WatermelonDB (React Native)</option>
                  <option value="SwiftData (iOS 17+) / CoreData">SwiftData / CoreData (iOS)</option>
                  <option value="Firebase Firestore / Realm">Firebase Firestore / Realm</option>
                </optgroup>
                <optgroup label="Server & Cloud Relational Databases">
                  <option value="PostgreSQL">PostgreSQL ⭐ (Server)</option>
                  <option value="MySQL 8+">MySQL 8+</option>
                  <option value="SQLite (Embedded / LibSQL)">SQLite (LibSQL / Turso)</option>
                  <option value="MongoDB">MongoDB</option>
                  <option value="Supabase (PostgreSQL + RLS)">Supabase (PostgreSQL)</option>
                </optgroup>
              </select>
            </div>

            {/* Field 3: Cache / Preferences */}
            <div className="stack-item">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                <label style={{ margin: 0 }}>Preferences / Cache</label>
                {auditData?.stack_verdicts?.cache && (
                  <span style={{
                    fontSize: '10.5px',
                    fontFamily: 'var(--font-mono)',
                    color: auditData.stack_verdicts.cache.status === 'optimal' ? 'var(--accent-emerald)' : 'var(--accent-rose)'
                  }}>
                    {auditData.stack_verdicts.cache.status === 'optimal' ? '✓ Optimal' : '⚠️ Warning'}
                  </span>
                )}
              </div>
              <select
                className="stack-select"
                value={stack.cache}
                onChange={(e) => setStack({ ...stack, cache: e.target.value })}
                style={{
                  borderColor: auditData?.stack_verdicts?.cache?.status === 'warning' ? 'var(--accent-rose)' : 'inherit'
                }}
              >
                <optgroup label="Mobile Client Security & Preferences">
                  <option value="EncryptedDataStore / Android Keystore">EncryptedDataStore (Keystore) ⭐ (Android)</option>
                  <option value="DataStore Preferences">DataStore Preferences</option>
                  <option value="MMKV (High Performance Key-Value)">MMKV (High Performance Key-Value)</option>
                  <option value="Keychain Services (Biometric)">Keychain Services (iOS Biometric)</option>
                  <option value="SharedPreferences (Encrypted)">EncryptedSharedPreferences</option>
                </optgroup>
                <optgroup label="Server Distributed Caching & Queues">
                  <option value="Redis">Redis ⭐ (Server)</option>
                  <option value="DragonflyDB / KeyDB">DragonflyDB / KeyDB</option>
                  <option value="RabbitMQ / Celery">RabbitMQ / Celery</option>
                  <option value="PostgreSQL SKIP LOCKED Queue">PostgreSQL Queue</option>
                  <option value="None / In-Memory">None / In-Memory</option>
                </optgroup>
              </select>
            </div>

            {/* Field 4: UI Framework */}
            <div className="stack-item">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                <label style={{ margin: 0 }}>UI System & Design Framework</label>
                {auditData?.stack_verdicts?.frontend && (
                  <span style={{
                    fontSize: '10.5px',
                    fontFamily: 'var(--font-mono)',
                    color: auditData.stack_verdicts.frontend.status === 'optimal' ? 'var(--accent-emerald)' : 'var(--accent-rose)'
                  }}>
                    {auditData.stack_verdicts.frontend.status === 'optimal' ? '✓ Optimal' : '⚠️ Warning'}
                  </span>
                )}
              </div>
              <select
                className="stack-select"
                value={stack.frontend}
                onChange={(e) => setStack({ ...stack, frontend: e.target.value })}
                style={{
                  borderColor: auditData?.stack_verdicts?.frontend?.status === 'warning' ? 'var(--accent-rose)' : 'inherit'
                }}
              >
                <optgroup label="Mobile UI Systems">
                  <option value="Jetpack Compose (Material 3 UI)">Jetpack Compose (Material 3) ⭐ (Android)</option>
                  <option value="Flutter Material 3">Flutter Material 3 ⭐</option>
                  <option value="SwiftUI (Apple HIG)">SwiftUI (Apple HIG) ⭐ (iOS)</option>
                  <option value="React Native Paper / NativeWind">React Native Paper / NativeWind</option>
                </optgroup>
                <optgroup label="Web UI Systems">
                  <option value="React (Vite SPA + Tailwind)">React (Vite SPA + Tailwind) ⭐</option>
                  <option value="Next.js 14+ (React Server Components)">Next.js 14+ (React Server Components)</option>
                  <option value="Vue.js 3 / Nuxt">Vue.js / Nuxt</option>
                  <option value="SvelteKit">SvelteKit</option>
                  <option value="Vanilla HTML / JS (No Framework)">Vanilla HTML / JS</option>
                </optgroup>
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
              placeholder={platform === 'android' ? "e.g. Target Android 15 (API 35), edge-to-edge Compose layout, BiometricPrompt lock..." : "e.g. Include rate limiting on /auth endpoints, support dark mode in UI..."}
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
