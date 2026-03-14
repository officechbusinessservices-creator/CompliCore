# OpenViking Infra

This directory tracks infrastructure notes for the OpenViking context backbone.

## Compose profile

OpenViking and context-gateway are optional and are enabled with:

```bash
docker compose --profile context up -d openviking context-gateway
```

## Environment

- `OPENVIKING_BASE_URL` (used by API/worker context client)
  - default local: `http://localhost:9701`

If OpenViking is unavailable, context retrieval falls back to local workspace files.
