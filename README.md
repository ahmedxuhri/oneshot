# OneShot — Session Notes

## What Is This?

This directory contains everything needed to build **OneShot** — a precision AI instruction tool.

Open a new AGY session here, then say:

> "Read all .md files in this directory and start building OneShot following IMPLEMENTATION.md"

## Files to Read (in order)

1. [`VISION.md`](./VISION.md) — What OneShot is, the concept, Show HN pitch
2. [`ARCHITECTURE.md`](./ARCHITECTURE.md) — Full technical design, data flow, directory structure
3. [`ENVIRONMENT.md`](./ENVIRONMENT.md) — Server context, ports, nginx, AWS Bedrock setup
4. [`PATTERNS.md`](./PATTERNS.md) — Pattern database schema + 2 full examples + list of 20
5. [`IMPLEMENTATION.md`](./IMPLEMENTATION.md) — Step-by-step build guide (follow this)

## Key Facts

| Item | Value |
|------|-------|
| Domain | `sudolaps.top/oneshot` |
| Backend port | `3040` |
| Backend language | Python + FastAPI |
| AI provider | AWS Bedrock, region `us-east-1` |
| AI model | `anthropic.claude-3-5-sonnet-20241022-v2:0` |
| Pattern DB | JSON files |
| GitHub | `ahmedxuhri/oneshot` (public) |
| Git author | `ahmedxuhri` only |
| Frontend | React + Vite, base path `/oneshot/` |

## Critical Rules

- **DO NOT** modify existing nginx location blocks
- **DO NOT** touch ports 3010, 3012, 3014, 3020, 3025, 3030
- **DO NOT** commit `.env` or `venv/` to git
- **ALL** git commits must be authored as `ahmedxuhri`
- Always run `nginx -t` before `systemctl reload nginx`
