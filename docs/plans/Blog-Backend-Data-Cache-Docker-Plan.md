# Blog Backend Data, Cache, and Docker Plan

## Data Path

- use `@alpha.consultings/eloquent-orm.js` models for PostgreSQL persistence
- use generated `src/app` scenario as the base and harden it into a real backend
- seed one known admin plus multiple posts for deterministic login and read tests

## Cache Path

- cache public post list and single-post reads in Memcached
- include an explicit response header for cache observability:
  - `x-cache: HIT`
  - `x-cache: MISS`
- invalidate related keys on create, update, and delete

## Docker Path

- service stack:
  - PostgreSQL
  - Memcached
- runner flow:
  - start services
  - wait for health
  - run migrations
  - run seeders
  - execute Node test suite
  - stop services

## Coverage Files

- `src/tests/blog-api-pg.integration.test.ts`
- `src/tests/blog-auth-cache.test.ts`
- `docs/Blog-Backend-Test-Harness.md`
