# OneShot — Technical Architecture

## System Overview

```
┌─────────────────────────────────────────────────────────────┐
│                     ONESHOT TOOL                            │
│                                                             │
│  LAYER 1: FRONTEND (React/Vite SPA)                         │
│  Served: sudolaps.top/oneshot                               │
│  Static files: /root/mad/sessions/oneshot/frontend/dist/    │
│                                                             │
│  LAYER 2: INTERPRETER AI (FastAPI + AWS Bedrock)            │
│  Internal: 127.0.0.1:3040                                   │
│  Proxied: sudolaps.top/oneshot/api/ → 127.0.0.1:3040        │
│                                                             │
│  LAYER 3: PATTERN DATABASE (JSON files)                     │
│  Location: /root/mad/sessions/oneshot/backend/patterns/     │
│                                                             │
│  LAYER 4: SPEC GENERATOR (Python logic)                     │
│  Part of FastAPI backend                                    │
└─────────────────────────────────────────────────────────────┘
```

---

## Full Data Flow

```
1. User types: "I need a marketplace like Airbnb"
        ↓
2. Frontend sends to: POST /oneshot/api/interpret
        ↓
3. Interpreter AI (AWS Bedrock Claude Sonnet):
   - Understands rough intent
   - Web searches best practices (via Tavily or DuckDuckGo API)
   - Identifies matching patterns from /patterns/ JSON files
   - Returns: matched_pattern + uncertainty_zones
        ↓
4. Frontend shows MCQ UI:
   - Pattern confirmed: "Two-sided Marketplace" ✅
   - Payment provider? [Stripe / PayPal / Custom]
   - Geography? [Single country / Global]
   - Scale? [< 10k / 10k–100k / 100k+]
        ↓
5. User answers (3–5 clicks max)
        ↓
6. Frontend sends to: POST /oneshot/api/generate-spec
        ↓
7. Spec Generator builds formal .spec JSON
        ↓
8. Frontend displays spec + "Copy to clipboard" button
   User pastes into Claude / GPT / Cursor → builds correctly
```

---

## Tech Stack

### Frontend
- **Framework**: React + Vite (fast build, SPA)
- **Styling**: Vanilla CSS (no Tailwind)
- **Build output**: `/root/mad/sessions/oneshot/frontend/dist/`
- **Served by**: nginx static files at `/oneshot/` path

### Backend
- **Framework**: Python + FastAPI
- **Port**: `3040` (internal)
- **Process manager**: systemd service `oneshot.service`
- **Location**: `/root/mad/sessions/oneshot/backend/`

### AI Layer
- **Provider**: AWS Bedrock
- **Region**: `us-east-1`
- **Model**: `anthropic.claude-3-5-sonnet-20241022-v2:0` (start here, adjustable)
- **SDK**: `boto3`
- **Auth**: IAM role or environment credentials (already configured on machine)

### Pattern Database
- **Format**: JSON files
- **Location**: `/root/mad/sessions/oneshot/backend/patterns/`
- **Schema**: See `PATTERNS.md`

### Web Search (for Interpreter AI)
- **Option A**: DuckDuckGo (no API key needed, use `duckduckgo-search` Python package)
- **Option B**: Tavily API (better quality, needs API key)
- **Start with**: DuckDuckGo (no keys needed to get started)

---

## Directory Structure

```
/root/mad/sessions/oneshot/
├── VISION.md                    # What OneShot is
├── ARCHITECTURE.md              # This file
├── PATTERNS.md                  # Pattern database schema + initial patterns
├── IMPLEMENTATION.md            # Step by step build guide
├── ENVIRONMENT.md               # Machine/server context
│
├── backend/                     # FastAPI Python backend
│   ├── main.py                  # FastAPI app entry point
│   ├── routers/
│   │   ├── interpret.py         # POST /interpret — AI interpretation
│   │   └── generate.py          # POST /generate-spec — spec generation
│   ├── services/
│   │   ├── bedrock.py           # AWS Bedrock client
│   │   ├── search.py            # Web search service
│   │   └── spec_generator.py    # Spec builder logic
│   ├── patterns/                # JSON pattern files
│   │   ├── auth.json
│   │   ├── marketplace.json
│   │   ├── saas.json
│   │   └── ...
│   ├── requirements.txt
│   └── .env                     # AWS creds, config (DO NOT COMMIT)
│
└── frontend/                    # React + Vite SPA
    ├── src/
    │   ├── App.jsx
    │   ├── components/
    │   │   ├── PromptInput.jsx   # Rough idea text input
    │   │   ├── MCQPanel.jsx      # Clarification questions UI
    │   │   └── SpecOutput.jsx    # Final spec display + copy button
    │   ├── styles/
    │   │   └── index.css
    │   └── main.jsx
    ├── index.html
    ├── vite.config.js           # base: '/oneshot/' 
    └── package.json
```

---

## Nginx Configuration to Add

Add this block to the existing nginx config **BEFORE** the `location /` block in the `sudolaps.top` server block.
**DO NOT modify any existing location blocks.**

```nginx
# OneShot - Static Frontend
location /oneshot/ {
    alias /root/mad/sessions/oneshot/frontend/dist/;
    index index.html;
    try_files $uri $uri/ /oneshot/index.html;
    add_header Cache-Control "public, max-age=3600";
}

# OneShot - API Backend
location /oneshot/api/ {
    proxy_pass http://127.0.0.1:3040/;
    proxy_http_version 1.1;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto https;
    proxy_read_timeout 120s;
    proxy_connect_timeout 30s;
    proxy_send_timeout 120s;
}
```

After adding, run: `nginx -t && systemctl reload nginx`

---

## Systemd Service for Backend

Create `/etc/systemd/system/oneshot.service`:

```ini
[Unit]
Description=OneShot FastAPI Backend
After=network.target

[Service]
Type=simple
User=root
WorkingDirectory=/root/mad/sessions/oneshot/backend
ExecStart=/root/mad/sessions/oneshot/backend/venv/bin/uvicorn main:app --host 127.0.0.1 --port 3040
Restart=always
RestartSec=5
EnvironmentFile=/root/mad/sessions/oneshot/backend/.env

[Install]
WantedBy=multi-user.target
```

Enable and start:
```bash
systemctl daemon-reload
systemctl enable oneshot
systemctl start oneshot
```

---

## API Endpoints

### POST /interpret
Receives rough human text, returns pattern match + clarifying questions.

**Request:**
```json
{
  "prompt": "I need a marketplace like Airbnb"
}
```

**Response:**
```json
{
  "matched_pattern": "marketplace_two_sided",
  "pattern_confidence": 0.87,
  "pattern_name": "Two-sided Marketplace",
  "clarifying_questions": [
    {
      "id": "payment_provider",
      "question": "Payment provider?",
      "options": ["Stripe", "PayPal", "Custom"]
    },
    {
      "id": "geography",
      "question": "Geographic scope?",
      "options": ["Single country", "Global (multi-currency)"]
    },
    {
      "id": "scale",
      "question": "Expected scale?",
      "options": ["< 10k users", "10k–100k users", "100k+ users"]
    }
  ],
  "web_search_sources": ["..."],
  "preloaded_data_models": ["users_v3", "listings_v2", "bookings_v2"]
}
```

### POST /generate-spec
Receives pattern + user answers, returns formal .spec JSON.

**Request:**
```json
{
  "pattern": "marketplace_two_sided",
  "answers": {
    "payment_provider": "Stripe",
    "geography": "Single country",
    "scale": "< 10k users"
  },
  "stack": {
    "backend": "Python",
    "database": "PostgreSQL"
  }
}
```

**Response:**
```json
{
  "spec": { ... },
  "spec_string": "...",
  "download_filename": "myapp.spec"
}
```

---

## GitHub Repository

- **Account**: `ahmedxuhri`
- **Repo name**: `oneshot`
- **Visibility**: Public
- **All commits**: authored as `ahmedxuhri` only

```bash
cd /root/mad/sessions/oneshot
git init
git remote add origin https://github.com/ahmedxuhri/oneshot.git
gh repo create ahmedxuhri/oneshot --public --description "Zero-ambiguity AI instruction tool — get it right the first time"
git add .
git commit -m "init: OneShot — precision AI spec generator"
git push -u origin main
```
