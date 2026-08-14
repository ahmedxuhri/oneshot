# OneShot — Server Environment

## Machine Context

This is a Linux server running multiple web apps behind nginx. All apps run as separate services on different internal ports. **Do not touch any existing apps.**

---

## Domain & Routing

- **Main domain**: `sudolaps.top` (HTTPS via nginx + Cloudflare)
- **SSL cert**: `/etc/nginx/ssl/sudolaps-origin.crt` (already in place)
- **Nginx config**: `/etc/nginx/sites-enabled/` (single file with all server blocks)

### OneShot routes to add to nginx:
- `sudolaps.top/oneshot/` → static frontend files
- `sudolaps.top/oneshot/api/` → FastAPI backend on port 3040

---

## Existing Applications (DO NOT TOUCH)

| Port | App | Route |
|------|-----|-------|
| 3010 (Docker) | Main site | `/` |
| 3012 | General API | `/api/` |
| 3014 | CAD app backend | `/api/cad/` |
| 3020 | vestadoc Next.js | vestadoc.com |
| 3025 | Postroom | `/postroom/` |
| 3030 | szmatch | szmatch.sudolaps.top |
| 8000 | OAuth callback (Python/gunicorn) | internal |
| 8127 | Django app (gunicorn) | internal |

### Static sites already served by nginx:
- `/powergym/` → `/var/www/sudolaps/powergym/`
- `/clinic/` → `/var/www/sudolaps/clinic/`
- `/cad` → `/root/volume2/cad/`

---

## OneShot Assignment

- **Frontend static files**: `/root/mad/sessions/oneshot/frontend/dist/`
- **Backend port**: `3040` (not in use by any existing app)
- **Systemd service**: `oneshot.service`

---

## Node.js

- **Location**: `/root/.nvm/versions/node/v22.21.1/bin/node`
- **npm available**: yes

## Python

- **System Python**: available at `/usr/bin/python3`
- **Pattern**: Use a virtualenv at `/root/mad/sessions/oneshot/backend/venv/`
- Install: `python3 -m venv venv && venv/bin/pip install -r requirements.txt`

---

## AWS Bedrock

- **Region**: `us-east-1`
- **Auth**: IAM credentials already configured on this machine (check with `aws sts get-caller-identity`)
- **SDK**: `boto3` — install via pip
- **Model to use**: `anthropic.claude-3-5-sonnet-20241022-v2:0`
  - If not available in region, fallback: `anthropic.claude-3-sonnet-20240229-v1:0`
- **Invocation**: Use `bedrock-runtime` client, `invoke_model` or `converse` API

```python
import boto3
import json

client = boto3.client("bedrock-runtime", region_name="us-east-1")

response = client.converse(
    modelId="anthropic.claude-3-5-sonnet-20241022-v2:0",
    messages=[
        {"role": "user", "content": [{"text": "your prompt here"}]}
    ]
)
result = response["output"]["message"]["content"][0]["text"]
```

---

## GitHub CLI

- **Installed**: yes (`gh` command available)
- **Logged in as**: `ahmedxuhri`
- **All git operations**: use `ahmedxuhri` as author

```bash
git config user.name "ahmedxuhri"
git config user.email "ahmedxuhri@users.noreply.github.com"
```

---

## Web Search (for Interpreter AI)

Use `duckduckgo-search` Python package (no API key needed):

```python
from duckduckgo_search import DDGS

def web_search(queries: list[str]) -> list[dict]:
    results = []
    with DDGS() as ddgs:
        for query in queries:
            for r in ddgs.text(query, max_results=3):
                results.append(r)
    return results
```

Install: `pip install duckduckgo-search`

---

## Nginx Config File Location

The nginx config is in `/etc/nginx/sites-enabled/` — one big file.
After editing, always validate before reloading:

```bash
nginx -t && systemctl reload nginx
```

The nginx block to ADD for OneShot (insert BEFORE the `location /` block in the sudolaps.top server block):

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
