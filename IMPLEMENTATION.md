# OneShot — Implementation Guide

Read ALL .md files in this directory before starting. Then follow these phases in order.

## Phase 0: Setup (Do First)

### 0.1 — Create GitHub Repo

```bash
cd /root/mad/sessions/oneshot
git init
git config user.name "ahmedxuhri"
git config user.email "ahmedxuhri@users.noreply.github.com"

# Create repo on GitHub
gh repo create ahmedxuhri/oneshot \
  --public \
  --description "Zero-ambiguity AI instruction tool — get it right the first time" \
  --clone=false

git remote add origin https://github.com/ahmedxuhri/oneshot.git
git branch -M main
```

### 0.2 — Create .gitignore

```
backend/venv/
backend/.env
frontend/node_modules/
frontend/dist/
__pycache__/
*.pyc
.env
.DS_Store
```

---

## Phase 1: Pattern Database (Pure Data, No AI Needed)

**Goal**: Create all 20 pattern JSON files in `/backend/patterns/`

1. Create the directory: `mkdir -p /root/mad/sessions/oneshot/backend/patterns/`
2. Start with `auth.json` and `marketplace.json` — schemas are in `PATTERNS.md`
3. Create the remaining 18 patterns. Use the schemas and field types from `PATTERNS.md` as reference. For each pattern, define:
   - `id`, `name`, `category`, `keywords[]`
   - `data_models{}` with proper SQL field types
   - `clarifying_questions[]` with options
   - `known_constraints{}` and `known_failure_modes[]`
   - `confidence_score`

**Commit after Phase 1:**
```bash
git add .
git commit -m "feat: add pattern database (20 system patterns)"
git push origin main
```

---

## Phase 2: FastAPI Backend

**Goal**: Working API at `127.0.0.1:3040`

### 2.1 — Setup Python Environment

```bash
cd /root/mad/sessions/oneshot/backend
python3 -m venv venv
source venv/bin/activate
pip install fastapi uvicorn boto3 duckduckgo-search python-dotenv pydantic
pip freeze > requirements.txt
```

### 2.2 — Create `.env` file

```env
AWS_DEFAULT_REGION=us-east-1
BEDROCK_MODEL_ID=anthropic.claude-3-5-sonnet-20241022-v2:0
PATTERNS_DIR=/root/mad/sessions/oneshot/backend/patterns
```

### 2.3 — Create `main.py`

```python
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import interpret, generate

app = FastAPI(title="OneShot API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://sudolaps.top"],
    allow_methods=["GET", "POST"],
    allow_headers=["*"],
)

app.include_router(interpret.router, prefix="/interpret")
app.include_router(generate.router, prefix="/generate-spec")

@app.get("/health")
def health():
    return {"status": "ok", "service": "oneshot"}
```

### 2.4 — Create `services/bedrock.py`

```python
import boto3
import json
import os

class BedrockService:
    def __init__(self):
        self.client = boto3.client("bedrock-runtime", region_name=os.getenv("AWS_DEFAULT_REGION", "us-east-1"))
        self.model_id = os.getenv("BEDROCK_MODEL_ID")
    
    def ask(self, prompt: str, system: str = None) -> str:
        messages = [{"role": "user", "content": [{"text": prompt}]}]
        kwargs = {"modelId": self.model_id, "messages": messages}
        if system:
            kwargs["system"] = [{"text": system}]
        
        response = self.client.converse(**kwargs)
        return response["output"]["message"]["content"][0]["text"]

bedrock = BedrockService()
```

### 2.5 — Create `services/search.py`

```python
from duckduckgo_search import DDGS

def web_search(queries: list[str], max_per_query: int = 3) -> list[dict]:
    results = []
    try:
        with DDGS() as ddgs:
            for query in queries:
                for r in ddgs.text(query, max_results=max_per_query):
                    results.append({
                        "title": r.get("title"),
                        "body": r.get("body"),
                        "href": r.get("href")
                    })
    except Exception as e:
        pass  # Search failure is non-critical
    return results
```

### 2.6 — Create `services/pattern_loader.py`

```python
import json
import os
from pathlib import Path

PATTERNS_DIR = Path(os.getenv("PATTERNS_DIR", "./patterns"))

def load_all_patterns() -> list[dict]:
    patterns = []
    for f in PATTERNS_DIR.glob("*.json"):
        with open(f) as fh:
            patterns.append(json.load(fh))
    return patterns

def get_pattern(pattern_id: str) -> dict | None:
    path = PATTERNS_DIR / f"{pattern_id}.json"
    if path.exists():
        with open(path) as fh:
            return json.load(fh)
    return None
```

### 2.7 — Create `routers/interpret.py`

```python
from fastapi import APIRouter
from pydantic import BaseModel
from services.bedrock import bedrock
from services.search import web_search
from services.pattern_loader import load_all_patterns
import json

router = APIRouter()

class InterpretRequest(BaseModel):
    prompt: str

@router.post("")
async def interpret(req: InterpretRequest):
    patterns = load_all_patterns()
    pattern_index = [{"id": p["id"], "name": p["name"], "keywords": p["keywords"]} for p in patterns]
    
    ai_prompt = f"""
User wants to build: "{req.prompt}"

Available patterns (id, name, keywords):
{json.dumps(pattern_index, indent=2)}

Return JSON only, no explanation:
{{
  "pattern_id": "best matching pattern id",
  "confidence": 0.0-1.0,
  "search_queries": ["query1", "query2"]
}}
"""
    
    raw = bedrock.ask(ai_prompt, system="You are a system architecture classifier. Return only valid JSON.")
    
    try:
        parsed = json.loads(raw)
    except:
        # fallback: extract JSON from response
        import re
        match = re.search(r'\{.*\}', raw, re.DOTALL)
        parsed = json.loads(match.group()) if match else {"pattern_id": patterns[0]["id"], "confidence": 0.5, "search_queries": []}
    
    # Find matching pattern
    matched = next((p for p in patterns if p["id"] == parsed.get("pattern_id")), patterns[0])
    
    # Web search
    search_results = web_search(parsed.get("search_queries", []))
    
    return {
        "matched_pattern": matched["id"],
        "pattern_name": matched["name"],
        "pattern_confidence": parsed.get("confidence", 0.8),
        "clarifying_questions": matched["clarifying_questions"],
        "data_models": list(matched["data_models"].keys()),
        "known_failure_modes": matched.get("known_failure_modes", []),
        "web_sources": search_results[:5]
    }
```

### 2.8 — Create `routers/generate.py`

```python
from fastapi import APIRouter
from pydantic import BaseModel
from services.pattern_loader import get_pattern
import uuid
from datetime import datetime

router = APIRouter()

class GenerateRequest(BaseModel):
    pattern_id: str
    answers: dict
    stack: dict = {"backend": "Python", "database": "PostgreSQL"}

@router.post("")
async def generate_spec(req: GenerateRequest):
    pattern = get_pattern(req.pattern_id)
    if not pattern:
        return {"error": "Pattern not found"}
    
    spec = {
        "oneshot_version": "1.0",
        "generated_at": datetime.utcnow().isoformat(),
        "spec_id": str(uuid.uuid4()),
        "system": pattern["name"],
        "pattern": pattern["id"],
        "confidence": pattern.get("confidence_score", 0.9),
        "data_models": pattern["data_models"],
        "user_choices": req.answers,
        "stack": req.stack,
        "constraints": pattern.get("known_constraints", {}),
        "known_failure_modes": pattern.get("known_failure_modes", []),
        "generated_by": "oneshot"
    }
    
    # Build human-readable instruction string for LLM
    spec_instruction = f"""
# OneShot Precision Specification

Build a **{spec['system']}** system.

## Pattern
{pattern['id']} (confidence: {spec['confidence']})

## Data Models
{spec['data_models']}

## Configuration Choices
{req.answers}

## Stack
Backend: {req.stack.get('backend', 'Python')}
Database: {req.stack.get('database', 'PostgreSQL')}

## Constraints
{spec['constraints']}

## Known Failure Modes to Avoid
{chr(10).join(f'- {fm}' for fm in spec['known_failure_modes'])}

---
Generated by OneShot — sudolaps.top/oneshot
"""
    
    return {
        "spec": spec,
        "spec_instruction": spec_instruction,
        "filename": f"{pattern['id']}_{datetime.utcnow().strftime('%Y%m%d')}.spec"
    }
```

### 2.9 — Test Backend Locally

```bash
cd /root/mad/sessions/oneshot/backend
source venv/bin/activate
uvicorn main:app --host 127.0.0.1 --port 3040 --reload

# Test health:
curl http://127.0.0.1:3040/health

# Test interpret:
curl -X POST http://127.0.0.1:3040/interpret \
  -H "Content-Type: application/json" \
  -d '{"prompt": "I need a marketplace like Airbnb"}'
```

**Commit after Phase 2:**
```bash
git add .
git commit -m "feat: FastAPI backend with Bedrock interpreter and spec generator"
git push origin main
```

---

## Phase 3: Systemd Service

```bash
cat > /etc/systemd/system/oneshot.service << 'EOF'
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
EOF

systemctl daemon-reload
systemctl enable oneshot
systemctl start oneshot
systemctl status oneshot
```

---

## Phase 4: Frontend (React + Vite)

**Goal**: Beautiful, minimal web UI at `sudolaps.top/oneshot`

### 4.1 — Initialize Vite

```bash
cd /root/mad/sessions/oneshot/frontend
npx create-vite@latest . --template react
npm install
```

### 4.2 — Configure Vite for `/oneshot/` base path

In `vite.config.js`:
```js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/oneshot/',
  server: {
    proxy: {
      '/oneshot/api': {
        target: 'http://127.0.0.1:3040',
        rewrite: (path) => path.replace(/^\/oneshot\/api/, '')
      }
    }
  },
  build: {
    outDir: 'dist'
  }
})
```

### 4.3 — UI Design Specification

The OneShot UI has **3 states**:

**State 1: Input**
- Full-page centered layout
- Large, clean text input: "What do you want to build?"
- Subtext: "Be rough. Be vague. We'll figure it out."
- One "OneShot →" button
- Dark, premium feel. Think Linear.app meets Vercel.

**State 2: Clarify (MCQ)**
- Shows: "We found a match: [Pattern Name] (94% confident)"
- 3–5 cards with question + radio/button options
- Each card animates in
- "Generate Spec →" button at bottom

**State 3: Spec Output**
- Shows the generated spec in a code block
- Large copy button: "Copy to Claude" / "Copy to GPT" / "Copy to Cursor"
- Download as `.spec` file button
- Share link (future)
- "Start over" link

### 4.4 — Components to Build

```
src/
├── App.jsx                 — state machine (input → clarify → output)
├── components/
│   ├── PromptInput.jsx     — State 1: rough idea input
│   ├── MCQPanel.jsx        — State 2: clarifying questions
│   ├── SpecOutput.jsx      — State 3: spec display + copy
│   └── LoadingState.jsx    — thinking animation between states
├── styles/
│   └── index.css           — design system
└── api.js                  — fetch calls to /oneshot/api/
```

### 4.5 — API calls in `api.js`

```js
const BASE = '/oneshot/api'

export async function interpret(prompt) {
  const res = await fetch(`${BASE}/interpret`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt })
  })
  return res.json()
}

export async function generateSpec(patternId, answers, stack) {
  const res = await fetch(`${BASE}/generate-spec`, {
    method: 'POST', 
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ pattern_id: patternId, answers, stack })
  })
  return res.json()
}
```

### 4.6 — Build for Production

```bash
cd /root/mad/sessions/oneshot/frontend
npm run build
# Output: /root/mad/sessions/oneshot/frontend/dist/
```

**Commit after Phase 4:**
```bash
git add .
git commit -m "feat: React frontend with 3-state UI flow"
git push origin main
```

---

## Phase 5: Nginx Configuration

Add to `/etc/nginx/sites-enabled/` config, inside the `server_name sudolaps.top` block, **BEFORE** `location /`:

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

```bash
nginx -t && systemctl reload nginx
```

**Test live:**
```bash
curl https://sudolaps.top/oneshot/api/health
# should return: {"status":"ok","service":"oneshot"}
```

---

## Phase 6: Final Commit & GitHub Polish

### Create GitHub README.md

```markdown
# OneShot ⚡

> Zero-ambiguity AI instructions — get it right the first time.

**Try it**: [sudolaps.top/oneshot](https://sudolaps.top/oneshot)

## What is it?

Stop re-prompting your AI 10 times. OneShot converts your rough idea into a 
precision specification that any LLM understands perfectly.

1. Type a rough idea
2. Answer 3–5 quick questions  
3. Get a `.spec` file
4. Paste into Claude/GPT/Cursor → it builds correctly

## How it works

OneShot uses AWS Bedrock + a database of 20 proven system patterns to:
- Identify what you're building
- Pull pre-validated data models and constraints
- Generate a formal, unambiguous specification

## Tech Stack
- **Frontend**: React + Vite
- **Backend**: Python + FastAPI
- **AI**: AWS Bedrock (Claude Sonnet)
- **Pattern DB**: JSON (20 system patterns)

## Self-host
See [IMPLEMENTATION.md](./IMPLEMENTATION.md)
```

```bash
git add .
git commit -m "docs: README and complete documentation"
git push origin main
```

---

## Build Order Summary

```
Phase 0: Setup GitHub repo                    (15 min)
Phase 1: 20 pattern JSON files                (2-3 hours)  ← most work
Phase 2: FastAPI backend + Bedrock            (2 hours)
Phase 3: Systemd service                      (15 min)
Phase 4: React frontend                       (3-4 hours)  ← most visible
Phase 5: Nginx config + deploy                (30 min)
Phase 6: GitHub polish                        (30 min)

Total: ~1 day of focused work
```
