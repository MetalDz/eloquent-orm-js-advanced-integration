# Blog Backend Test Harness

## Purpose

This app is a consumer-side integration harness for `@alpha.consultings/eloquent-orm.js`.

It is intentionally larger than a smoke app so that it can expose:

- schema mismatches
- migration regressions
- auth flow bugs
- route wiring mistakes
- PostgreSQL runtime issues
- Memcached cache invalidation issues

## Stack

- Express for routing
- `@alpha.consultings/eloquent-orm.js` for models and migrations
- PostgreSQL for the primary integration path
- Memcached for response caching
- Node test runner for repeatable route coverage
- Docker Compose for reproducible infrastructure

## Commands

```bash
npm run migrate:pg
npm run seed:pg
npm test
npm run test:coverage
npm run test:docker
```

## Expected Runtime Ports

- PostgreSQL: `5432`
- Memcached: `11211`
- App server during manual local dev: `3100`

## Security Notes

- all external network destinations are configuration-driven through `.env`
- bearer authentication is enforced in middleware on write routes
- refresh tokens are rotated and revoked on logout
- the app itself chooses which API port is exposed; production hardening remains the consumer app's responsibility
