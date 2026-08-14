const BASE = '/oneshot/api';

export async function interpretPrompt(prompt) {
  const res = await fetch(`${BASE}/interpret`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt })
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.detail || `Server returned ${res.status}`);
  }
  return res.json();
}

export async function generateSpec(patternId, answers, stack, customRequirements = '', domainMeta = {}) {
  const res = await fetch(`${BASE}/generate-spec`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      pattern_id: patternId,
      answers,
      stack,
      custom_requirements: customRequirements,
      domain_title: domainMeta.domain_title,
      domain_summary: domainMeta.domain_summary,
      domain_models: domainMeta.domain_models,
      user_prompt: domainMeta.user_prompt,
      design_theme: domainMeta.design_theme || 'linear_dark'
    })
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.detail || `Server returned ${res.status}`);
  }
  return res.json();
}

export async function fetchAllPatterns() {
  const res = await fetch(`${BASE}/patterns`);
  if (!res.ok) {
    throw new Error('Failed to load pattern catalog');
  }
  return res.json();
}

export async function auditStack(patternId, stack, answers = {}) {
  const res = await fetch(`${BASE}/audit-stack`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      pattern_id: patternId,
      stack,
      answers
    })
  });
  if (!res.ok) {
    return null;
  }
  return res.json();
}
