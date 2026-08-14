# OneShot — Vision & Concept

## What Is OneShot?

OneShot is a **precision AI instruction tool** that eliminates ambiguity between humans and AI when building software systems.

Instead of typing a vague natural language prompt to an AI and re-prompting 10 times until it understands — OneShot lets you:

1. Type a rough idea (one sentence, messy is fine)
2. Answer 3–5 visual MCQ/dropdown questions
3. Receive a **precision `.spec` file** — a structured, formal specification
4. Send that spec to any LLM (Claude, GPT, Gemini, Cursor, etc.)
5. **AI builds it correctly. First time. Zero re-prompting.**

---

## The Problem It Solves

```
TODAY:
Human intent → [LOSSY natural language] → AI guesses → wrong thing built → re-prompt 10x

WITH ONESHOT:
Human intent → [LOSSLESS selection UI] → Formal spec → AI builds → done
```

Most software systems are not new. Auth, payments, notifications, search, dashboards — these have been built millions of times. The solutions are known. The mistakes are documented. Why re-describe them in lossy language every time?

**OneShot packages the knowledge, not the description.**

---

## The Core Insight (Origin of This Idea)

This tool was born from a conversation about how LLMs communicate internally — using token embeddings, probability distributions, and attention patterns — all of which are **lossless and precise**. Natural language, by contrast, is inherently **lossy and ambiguous**.

The realization: humans can approximate that precision by selecting from pre-validated, formally defined system patterns — turning vague descriptions into structured specifications that any LLM can interpret without ambiguity.

---

## Target Users

- **Developers** who use AI coding tools (Claude, Cursor, Copilot, GPT)
- **Technical founders** who want to build faster with AI
- **Non-technical builders** who know WHAT they want but struggle to explain it to AI

---

## Show HN Headline

> "Show HN: I got tired of re-prompting my AI 10 times, so I built a way to get it right the first time"

---

## Output Format

The tool outputs a `.spec` file — a new, purposeful format:

```json
{
  "oneshot_version": "1.0",
  "system": "authentication",
  "pattern": "JWT_refresh_tokens",
  "confidence": 0.94,
  "data_models": {
    "users":    "schema://proven/users_v3",
    "sessions": "schema://proven/sessions_v2"
  },
  "constraints": {
    "latency_ms": { "max": 200 },
    "security": "OWASP_TOP_10",
    "P_breach": 0.001
  },
  "stack": {
    "backend": "Python",
    "database": "PostgreSQL",
    "cache": "Redis"
  },
  "scale": { "users": 10000 },
  "uncertainty_zones": [],
  "generated_by": "oneshot"
}
```

This spec is **copy-pasted into any AI chat** or used via the OneShot MCP server.

---

## Distribution Strategy

| Channel | Description |
|---|---|
| **Web App** (v1) | Primary — anyone opens `sudolaps.top/oneshot`, uses instantly, no signup |
| **MCP Server** (v2) | Power users integrate into Cursor/Claude/Windsurf directly |
| **CLI / SDK** (v3) | Teams pipe it into their own dev pipelines |

---

## Future: MCP Integration Vision

```
User in Cursor types:
"@oneshot build me a marketplace like Airbnb"

OneShot MCP:
- Interprets rough intent
- Web searches best practices
- Pulls proven patterns from DB
- Asks 3 clarifying questions in chat
- Injects precision spec directly into Cursor context
- Cursor builds it correctly

User never left their editor.
```
