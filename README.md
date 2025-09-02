# ChatBotAI
It is a TypeScript/Node.js chatbot + voicebot with a React UI, REST/WebSocket services. 

# DTS Virtual Agent (Chatbot + Voicebot) — 1‑Page README

**Goal:** Production‑style personal project demonstrating **chatbots/voicebots**, **REST/WebSockets**, **SSO (OAuth2/OIDC, JWT)**, **Postman automation**, **CI/CD**, **dialogue management**, and **NLU adapters** (Dialogflow, Rasa, Microsoft Bot Framework; Cognigy/Watson/Lex stubs). Fully runnable via Docker Compose.

---

## 1) Overview

* **Stack:** TypeScript • Node.js (Express) • WebSockets • React (Vite) • PostgreSQL • Redis • Docker • Jest • Postman
* **Services:** `gateway` (API + auth + WS) • `bot-service` (dialogue manager + NLU adapters) • `analytics-service` (keyword/topic extraction, reports) • `web` (chat widget + admin console)
* **Why it fits the JD:** virtual agents (chat/voice), REST & sockets, **SSO/JWT**, **API integrations**, **Postman/CI**, **keyword/topic extraction**, **dialogue mgmt**, **Cognigy/Dialogflow/Rasa/MS Bot** adapters.

---

## 2) Architecture

```
User (Web/Voice)
   ↓ WebSocket/HTTP
[web (React)]  →  [gateway: Express/API + OAuth2/OIDC → JWT]
                        │      │
                        │      ├── REST calls to external APIs (e.g., catalog)
                        │      └── Webhook intake (HMAC + idempotency)
                        ↓
                [bot-service: intent routing + dialogue policies + NLU adapters]
                        │
           ┌────────────┴────────────┐
           │                         │
    [analytics-service]         [Redis] (sessions, rate limits)
    (keywords/topics,           
     no-match analyzer)         [PostgreSQL] (users, transcripts, configs)
```

---

## 3) Quickstart (Docker Compose)

**Prereqs:** Docker Desktop 4.x, Docker Compose v2

```bash
# 1) Clone & env
cp .env.example .env
# set secrets: JWT_SECRET, HMAC_SECRET, POSTGRES_PASSWORD, OIDC_* (optional), NLU_PROVIDER=local

# 2) Launch
docker compose -f infra/compose/docker-compose.yml up -d --build

# 3) Open apps
# Gateway API:    http://localhost:8080/health
# Web (UI):       http://localhost:5173
# Postgres:       localhost:5432  | Redis: localhost:6379
```

> **Note:** Seeded admin credentials print in `web` logs on first run (change immediately).

---

## 4) Configuration (key env vars)

* **Core:** `NODE_ENV=production`, `PORT=8080`, `WEB_PORT=5173`
* **Auth:** `JWT_SECRET`, `JWT_EXP=900s`, `REFRESH_EXP=7d`, `OIDC_ISSUER_URL`, `OIDC_CLIENT_ID`, `OIDC_CLIENT_SECRET`
* **NLU:** `NLU_PROVIDER=local` *(options: `dialogflow|rasa|msbot|local`)*, `INTENT_THRESHOLD=0.6`
* **Data:** `POSTGRES_HOST`, `POSTGRES_DB`, `POSTGRES_USER`, `POSTGRES_PASSWORD`, `REDIS_URL`
* **Security:** `HMAC_SECRET`, `RATE_LIMIT_RPS=10`

---

## 5) API (high level)

* `POST /api/v1/auth/login` → `{accessToken, refreshToken}`
* `POST /api/v1/auth/refresh` → rotate access token
* `POST /api/v1/bot/message` → `{userId, channel, text}` → bot reply (WS stream/SSE)
* `POST /api/v1/bot/webhook/:provider` → inbound events (**HMAC** verified)
* `POST /api/v1/nlu/train` → upload chat logs → keywords/topics + intent suggestions
* `GET  /api/v1/analytics/funnels` → greet→intent→success funnel metrics

**Docs:** OpenAPI spec at `apps/gateway/openapi.yaml` (typed client in `packages/shared-types`).

---

## 6) Frontend

* **Chat widget:** typing indicator, quick replies, retry on network, theming.
* **Voice mode:** Web Speech API (STT/TTS); graceful fallback to text if unsupported.
* **Admin console:** upload logs, run training, view topics/keywords, set thresholds, test intents.

---

## 7) Testing & Tooling

```bash
# Unit tests (backend)
npm run test
# Lint & types
npm run lint && npm run typecheck
```

* **Postman:** import `packages/postman/DTS-Virtual-Agent.postman_collection.json` + `*.environment.json`; run auth → bot (happy/fallback) → webhook negative (bad signature). Assertions check schema/status and **p95 < 250ms**.

---

## 8) CI/CD

* **GitHub Actions:** build → lint/type → unit → Postman API tests → Docker build & tag.
* **Bitbucket/Bamboo:** sample YAML/specs included (commented) mirroring GH Actions.

---

## 9) Folder Snapshot

```
apps/{gateway,bot-service,analytics-service,voice-bridge,web}
packages/shared-types  packages/postman
infra/docker  infra/compose  infra/migrations
```

---

## 10) Demo Script

1. **Auth & Chat:** login → send “Find headphones under ₹5,000” → product cards → switch to **Voice** and ask order status.
2. **Training:** upload sample logs → get keywords/topics → adjust thresholds → test new utterances.
3. **Automation:** run Postman collection; observe metrics at `/metrics` and health at `/health`.

---

## 11) Security Notes

* OAuth2/OIDC → **JWT** access/refresh; Redis rate limiting; CSRF for web clients.
* Webhooks: **HMAC** signature + **idempotency-key** on mutating actions.

---

## License

MIT (personal portfolio). Replace or remove third‑party trademarks when publishing.
