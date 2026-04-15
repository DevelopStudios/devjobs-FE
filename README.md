# TalentBoard

A developer job board with in-browser semantic search — no backend, no API keys.

**Live:** [devjobs-fe-a0h85.kinsta.page](https://devjobs-fe-a0h85.kinsta.page)

---

## What makes it interesting

Standard job boards match on exact keywords. TalentBoard understands intent.

Search `"cloud engineer"` and it surfaces DevOps and SRE roles. Search `"mobile app"` and it finds iOS positions. The search runs entirely in the browser — embeddings computed in a Web Worker, no server round-trip.

---

## How it works

| Layer | Technology | Role |
|-------|-----------|------|
| Embeddings | `all-MiniLM-L6-v2` via Transformers.js | Converts text to 384-dim vectors in a Web Worker |
| Vector search | Orama | Hybrid BM25 + cosine similarity |
| Indexing | Web Worker | Non-blocking — UI stays responsive during index build |
| Framework | Angular 17+ | Signals, OnPush, lazy-loaded routes |

The worker waits for the model to finish loading before accepting embed requests — avoiding a race condition where messages arrive before the engine initialises.

---

## Stack

- Angular 17
- Transformers.js (`@huggingface/transformers`)
- Orama (`@orama/orama`)
- TypeScript

---

## Run locally

```bash
npm install
ng serve
```

Navigate to `http://localhost:4200`

---

## Try these searches

| Query | What it finds |
|-------|--------------|
| `cloud engineer` | SRE and DevOps roles |
| `mobile app` | iOS Engineer |
| `team management` | Tech Lead and Support Manager roles |
| `payment processing` | Fullstack roles with transaction volume |
| `containers` | Kubernetes and ECS positions |
