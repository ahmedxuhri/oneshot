# OneShot — Pattern Database

## Schema for Each Pattern File

Each pattern is a JSON file in `/backend/patterns/`. Pattern files define a known, proven system type with its data models, constraints, clarifying questions, and common tech choices.

```json
{
  "id": "pattern_id",
  "name": "Human Readable Name",
  "category": "category",
  "description": "What this system does",
  "keywords": ["keyword1", "keyword2"],
  "data_models": {
    "model_name": {
      "table": "table_name",
      "fields": [
        { "name": "id", "type": "UUID", "primary": true },
        { "name": "field_name", "type": "VARCHAR(255)", "nullable": false }
      ],
      "indexes": ["field1", "field2"],
      "proven_uses": 12000
    }
  },
  "clarifying_questions": [
    {
      "id": "question_id",
      "question": "Question text?",
      "options": ["Option A", "Option B", "Option C"],
      "impacts": "what this affects in the spec"
    }
  ],
  "common_stacks": ["Python+PostgreSQL", "Node+MongoDB"],
  "known_constraints": {
    "security": ["OWASP_TOP_10"],
    "typical_latency_ms": 200
  },
  "known_failure_modes": [
    "Description of common mistake and how to avoid it"
  ],
  "confidence_score": 0.97
}
```

---

## Initial Pattern Library (20 Patterns for v1)

### 1. Authentication System (`auth.json`)
```json
{
  "id": "auth_jwt_refresh",
  "name": "JWT Authentication with Refresh Tokens",
  "category": "auth",
  "keywords": ["login", "auth", "authentication", "JWT", "signup", "register", "users"],
  "data_models": {
    "users": {
      "table": "users",
      "fields": [
        { "name": "id", "type": "UUID", "primary": true },
        { "name": "email", "type": "VARCHAR(255)", "unique": true, "nullable": false },
        { "name": "password_hash", "type": "VARCHAR(255)", "nullable": false },
        { "name": "email_verified", "type": "BOOLEAN", "default": false },
        { "name": "created_at", "type": "TIMESTAMP", "default": "NOW()" },
        { "name": "updated_at", "type": "TIMESTAMP" }
      ],
      "indexes": ["email"],
      "proven_uses": 50000
    },
    "refresh_tokens": {
      "table": "refresh_tokens",
      "fields": [
        { "name": "id", "type": "UUID", "primary": true },
        { "name": "user_id", "type": "UUID", "foreign_key": "users.id" },
        { "name": "token_hash", "type": "VARCHAR(255)", "unique": true },
        { "name": "expires_at", "type": "TIMESTAMP", "nullable": false },
        { "name": "revoked", "type": "BOOLEAN", "default": false },
        { "name": "created_at", "type": "TIMESTAMP", "default": "NOW()" }
      ],
      "indexes": ["token_hash", "user_id"],
      "proven_uses": 40000
    }
  },
  "clarifying_questions": [
    {
      "id": "oauth_providers",
      "question": "Social login providers?",
      "options": ["Email only", "Google", "Google + GitHub", "Google + GitHub + Apple"],
      "impacts": "adds oauth_accounts table and OAuth flow"
    },
    {
      "id": "mfa",
      "question": "Multi-factor authentication?",
      "options": ["No MFA", "TOTP (Google Authenticator)", "SMS OTP"],
      "impacts": "adds mfa_secrets table"
    },
    {
      "id": "roles",
      "question": "User roles?",
      "options": ["Single role (user)", "Two roles (user + admin)", "Custom RBAC"],
      "impacts": "adds roles/permissions tables"
    }
  ],
  "known_constraints": {
    "security": ["OWASP_TOP_10", "bcrypt_rounds_12", "JWT_RS256"],
    "access_token_expiry": "15m",
    "refresh_token_expiry": "30d",
    "typical_latency_ms": 100
  },
  "known_failure_modes": [
    "Storing JWT in localStorage — use httpOnly cookies instead",
    "Not rotating refresh tokens on use — implement refresh token rotation",
    "Weak bcrypt rounds — use minimum 12 rounds"
  ],
  "confidence_score": 0.98
}
```

### 2. Two-sided Marketplace (`marketplace.json`)
```json
{
  "id": "marketplace_two_sided",
  "name": "Two-sided Marketplace",
  "category": "marketplace",
  "keywords": ["marketplace", "airbnb", "uber", "fiverr", "booking", "listing", "sellers", "buyers", "hosts", "guests"],
  "data_models": {
    "users": { "ref": "auth_jwt_refresh.users" },
    "listings": {
      "table": "listings",
      "fields": [
        { "name": "id", "type": "UUID", "primary": true },
        { "name": "owner_id", "type": "UUID", "foreign_key": "users.id" },
        { "name": "title", "type": "VARCHAR(255)", "nullable": false },
        { "name": "description", "type": "TEXT" },
        { "name": "price_cents", "type": "INTEGER", "nullable": false },
        { "name": "currency", "type": "VARCHAR(3)", "default": "USD" },
        { "name": "status", "type": "ENUM('active','inactive','deleted')", "default": "active" },
        { "name": "lat", "type": "DECIMAL(9,6)" },
        { "name": "lng", "type": "DECIMAL(9,6)" },
        { "name": "created_at", "type": "TIMESTAMP", "default": "NOW()" }
      ],
      "indexes": ["owner_id", "status", "lat+lng"],
      "proven_uses": 15000
    },
    "bookings": {
      "table": "bookings",
      "fields": [
        { "name": "id", "type": "UUID", "primary": true },
        { "name": "listing_id", "type": "UUID", "foreign_key": "listings.id" },
        { "name": "buyer_id", "type": "UUID", "foreign_key": "users.id" },
        { "name": "start_date", "type": "DATE", "nullable": false },
        { "name": "end_date", "type": "DATE", "nullable": false },
        { "name": "total_cents", "type": "INTEGER", "nullable": false },
        { "name": "status", "type": "ENUM('pending','confirmed','cancelled','completed')", "default": "pending" },
        { "name": "payment_intent_id", "type": "VARCHAR(255)" },
        { "name": "created_at", "type": "TIMESTAMP", "default": "NOW()" }
      ],
      "indexes": ["listing_id", "buyer_id", "status", "start_date"],
      "proven_uses": 10000
    },
    "reviews": {
      "table": "reviews",
      "fields": [
        { "name": "id", "type": "UUID", "primary": true },
        { "name": "booking_id", "type": "UUID", "foreign_key": "bookings.id", "unique": true },
        { "name": "reviewer_id", "type": "UUID", "foreign_key": "users.id" },
        { "name": "reviewee_id", "type": "UUID", "foreign_key": "users.id" },
        { "name": "rating", "type": "SMALLINT", "check": "rating BETWEEN 1 AND 5" },
        { "name": "comment", "type": "TEXT" },
        { "name": "created_at", "type": "TIMESTAMP", "default": "NOW()" }
      ],
      "proven_uses": 8000
    }
  },
  "clarifying_questions": [
    {
      "id": "payment_provider",
      "question": "Payment provider?",
      "options": ["Stripe", "PayPal", "Custom"],
      "impacts": "payment integration + webhook handling"
    },
    {
      "id": "geography",
      "question": "Geographic scope?",
      "options": ["Single country", "Global (multi-currency)"],
      "impacts": "currency handling, tax logic, geosearch"
    },
    {
      "id": "messaging",
      "question": "In-app messaging between users?",
      "options": ["No messaging", "Basic messaging", "Real-time chat (WebSocket)"],
      "impacts": "adds messages table + optional WebSocket server"
    },
    {
      "id": "media",
      "question": "Listing media (photos/videos)?",
      "options": ["No media", "Photos (S3)", "Photos + Video (S3 + CloudFront)"],
      "impacts": "adds media table + S3 bucket setup"
    }
  ],
  "known_constraints": {
    "double_booking_prevention": "database-level locking on booking creation",
    "P_double_booking": 0.0001,
    "search_latency_ms": 300,
    "payment_idempotency": true
  },
  "known_failure_modes": [
    "Double booking race condition — use SELECT FOR UPDATE or optimistic locking",
    "Storing prices as floats — always store as integer cents",
    "Not handling Stripe webhook failures — implement idempotent webhook handler"
  ],
  "confidence_score": 0.94
}
```

### Additional Patterns to Implement (v1 list)

Create a JSON file for each of these in `/backend/patterns/`:

```
3.  saas_subscription.json      — SaaS with subscription billing (Stripe)
4.  ecommerce.json              — E-commerce store (products, cart, orders)
5.  blog_cms.json               — Blog / CMS (posts, categories, authors)
6.  social_network.json         — Social platform (follow, feed, posts)
7.  api_service.json            — REST API service (rate limiting, API keys)
8.  admin_dashboard.json        — Admin panel (CRUD, roles, analytics)
9.  real_time_chat.json         — Real-time chat app (WebSocket, rooms)
10. notification_system.json    — Push/email/SMS notification service
11. file_storage.json           — File upload/management (S3 backed)
12. search_engine.json          — Full-text search (Elasticsearch/Postgres)
13. analytics_platform.json     — Event tracking + dashboards
14. crm.json                    — Customer relationship management
15. booking_calendar.json       — Appointment/calendar booking system
16. payment_gateway.json        — Payment processing integration
17. iot_data_pipeline.json      — IoT device data ingestion
18. multi_tenant_saas.json      — Multi-tenant SaaS architecture
19. recommendation_engine.json  — Content/product recommendations
20. workflow_automation.json    — Task queue + workflow engine
```

---

## How the Interpreter AI Uses Patterns

```python
# Pseudo-code for pattern matching in interpret.py

def match_pattern(user_prompt: str) -> PatternMatch:
    # 1. Load all patterns from /patterns/*.json
    patterns = load_all_patterns()
    
    # 2. Ask Bedrock to match
    prompt = f"""
    User wants to build: "{user_prompt}"
    
    Available patterns:
    {json.dumps([{p.id, p.name, p.keywords} for p in patterns])}
    
    Return the best matching pattern_id and confidence (0-1).
    Also return 2-3 web search queries to find best practices.
    """
    
    response = bedrock_client.invoke(prompt)
    
    # 3. Web search for additional context
    search_results = web_search(response.search_queries)
    
    # 4. Return matched pattern with questions
    pattern = patterns[response.pattern_id]
    return PatternMatch(
        pattern=pattern,
        confidence=response.confidence,
        clarifying_questions=pattern.clarifying_questions,
        web_context=search_results
    )
```
