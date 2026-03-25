# Health API

The harness exposes a simple health endpoint for runtime checks.

## Endpoint

### `GET /health`

Response:

```json
{
  "ok": true
}
```

Use this for:

- local smoke checks
- container or reverse-proxy readiness checks
- quick confirmation that the Express app booted successfully

## Metadata files

- [health.get.json](./metadata/health.get.json)
