# OneShot ⚡

> Zero-ambiguity AI instructions — get it right the first time.

**Try it live**: [sudolaps.top/oneshot](https://sudolaps.top/oneshot)

---

## What is OneShot?

Stop re-prompting your AI 10 times. Natural language is inherently lossy and ambiguous. OneShot converts your rough idea into a precision specification (`.spec`) that any LLM understands perfectly.

```
TODAY:
Human intent → [LOSSY natural language] → AI guesses → wrong thing built → re-prompt 10x

WITH ONESHOT:
Human intent → [LOSSLESS selection UI] → Formal spec → AI builds → done
```

1. **Type a rough idea** (messy is fine)
2. **Answer 3–5 visual clarifying questions**
3. **Receive a precision `.spec` file & LLM directives**
4. **Paste into Claude, GPT, or Cursor → builds correctly first time**

---

## How It Works

OneShot pairs an intelligent architectural interpreter with a curated database of 20 verified system patterns to:
- **Identify system target**: Classifies human intent to canonical architecture types.
- **Pull proven data models**: Injects production-grade relational schemas with indexes, primary keys, and relations.
- **Enforce critical constraints**: Integrates security rules, latency budgets, and idempotency guarantees.
- **Guard against known failure modes**: Explicitly prevents common race conditions, bad token storage, and double-booking bugs.

---

## Tech Stack

- **Frontend**: React + Vite (Vanilla CSS, high-craft dark mode, responsive, zero external UI kits)
- **Backend**: Python + FastAPI (Systemd daemon on port `3040`)
- **AI Layer**: AWS Bedrock (`anthropic.claude-3-5-sonnet-20241022-v2:0`) with resilient semantic classification
- **Web Search**: DuckDuckGo search integration for live architecture best practices
- **Pattern Database**: 20 production-grade JSON architecture patterns

---

## Pattern Library (20 System Patterns)

| # | Pattern Name | Category | Key Models |
|---|--------------|----------|------------|
| 1 | **JWT Authentication with Refresh Tokens** | `auth` | `users`, `refresh_tokens` |
| 2 | **Two-sided Marketplace** | `marketplace` | `users`, `listings`, `bookings`, `reviews` |
| 3 | **SaaS Subscription & Billing Engine** | `saas` | `organizations`, `subscriptions`, `usage_records` |
| 4 | **E-Commerce & Digital Storefront** | `ecommerce` | `products`, `product_variants`, `orders`, `order_items` |
| 5 | **Headless CMS & Content Publishing** | `cms` | `articles`, `tags` |
| 6 | **Social Network & Feed Engine** | `social` | `follows`, `posts`, `comments` |
| 7 | **Public API Gateway & Developer Platform** | `developer_tools` | `api_keys`, `api_requests_log` |
| 8 | **Enterprise Admin & Internal Backoffice** | `admin` | `audit_logs` |
| 9 | **Real-time Messaging & Team Chat** | `communication` | `channels`, `channel_members`, `messages` |
| 10 | **Multi-Channel Notification Dispatcher** | `notifications` | `notification_templates`, `notification_logs` |
| 11 | **Cloud Object & Media Storage Service** | `storage` | `files` |
| 12 | **Full-Text Search & Discovery Engine** | `search` | `search_documents` |
| 13 | **Event Ingestion & Analytics Engine** | `analytics` | `events` |
| 14 | **CRM & Sales Pipeline Management** | `crm` | `contacts`, `deals` |
| 15 | **Appointment Scheduling & Calendar Booking** | `booking` | `availability_rules`, `appointments` |
| 16 | **Payment Processing & Checkout Gateway** | `payments` | `transactions` |
| 17 | **IoT Telemetry & Device Ingestion Pipeline** | `iot` | `devices`, `sensor_readings` |
| 18 | **Multi-Tenant Enterprise Architecture** | `saas` | `tenants` |
| 19 | **Vector-Based Recommendation Engine** | `ai_ml` | `item_embeddings`, `user_interactions` |
| 20 | **Async Task Queue & Workflow Automation** | `infrastructure` | `workflow_runs`, `task_executions` |

---

## Directory Structure

```
/root/mad/sessions/oneshot/
├── backend/
│   ├── main.py                  # FastAPI app entry point
│   ├── routers/
│   │   ├── interpret.py         # POST /interpret — Intent interpreter
│   │   └── generate.py          # POST /generate-spec — Spec generator
│   ├── services/
│   │   ├── bedrock.py           # AWS Bedrock & classifier service
│   │   ├── search.py            # Architecture web search service
│   │   ├── pattern_loader.py    # Pattern DB loader & index
│   │   └── spec_generator.py    # .spec compiler & prompt formatter
│   ├── patterns/                # 20 JSON pattern definitions
│   └── requirements.txt
│
└── frontend/
    ├── src/
    │   ├── App.jsx              # 3-state state machine
    │   ├── components/
    │   │   ├── PromptInput.jsx  # State 1: Rough idea input + presets
    │   │   ├── MCQPanel.jsx     # State 2: Clarifying questions & stack
    │   │   ├── SpecOutput.jsx   # State 3: Precision spec & copy tools
    │   │   ├── LoadingState.jsx # Animated analysis step indicator
    │   │   └── PatternCatalogModal.jsx # 20-pattern database browser
    │   ├── styles/index.css     # Premium dark design system
    │   ├── api.js               # API client
    │   └── main.jsx
    ├── index.html
    └── vite.config.js           # Base path /oneshot/
```

---

## Documentation

- [`VISION.md`](./VISION.md) — Product vision & concept
- [`ARCHITECTURE.md`](./ARCHITECTURE.md) — Full technical architecture
- [`PATTERNS.md`](./PATTERNS.md) — Pattern schema & specifications
- [`IMPLEMENTATION.md`](./IMPLEMENTATION.md) — Step-by-step build log
- [`ENVIRONMENT.md`](./ENVIRONMENT.md) — Server & hosting environment
