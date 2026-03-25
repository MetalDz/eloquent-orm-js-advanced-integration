# eloquent-orm-js-advanced-integration
[![docs](https://img.shields.io/badge/docs-official-blue)](https://alphaconsultings.mintlify.app/)
[![package](https://img.shields.io/badge/npm-@alpha.consultings%2Feloquent--orm.js-CB3837?logo=npm)](https://www.npmjs.com/package/@alpha.consultings/eloquent-orm.js)
[![license](https://img.shields.io/badge/license-Apache%202.0-green)](./LICENSE)
[![stack](https://img.shields.io/badge/stack-Express%20%7C%20PostgreSQL%20%7C%20Memcached-0f766e)](#)
[![auth](https://img.shields.io/badge/auth-JWT%20%2B%20refresh%20tokens-1d4ed8)](#)
[![docker](https://img.shields.io/badge/tests-Docker--backed-2496ED?logo=docker&logoColor=white)](#)

Advanced consumer-project validation harness for @alpha.consultings/eloquent-orm.js with Express, JWT auth, refresh tokens, PostgreSQL, Memcached, and Docker-backed integration tests.
Use this for the new repo `README.md`:

```md
# Eloquent ORM JS Real Backend Harness

Advanced consumer-project validation harness for `@alpha.consultings/eloquent-orm.js` with Express, JWT auth, refresh tokens, PostgreSQL, Memcached, and Docker-backed integration tests.

## What this repo is

This project is a real consumer-side backend used to validate `@alpha.consultings/eloquent-orm.js` in a realistic integration scenario.

It is not a package-internal example. It is a separate app that exercises the package the way a real adopter would use it.

## Stack

- `@alpha.consultings/eloquent-orm.js`
- Express
- JWT access tokens
- refresh token rotation
- PostgreSQL
- Memcached
- Docker Compose
- TypeScript

## Goals

- validate ORM behavior in a real backend architecture
- test generated models, services, controllers, and migrations in a consumer project
- verify protected REST routes with JWT auth
- verify refresh token persistence and rotation
- verify cache-backed public reads
- catch integration bugs early
- document the exact runtime and test flow

## Architecture

```text
src/
  app/
    auth/
    cache/
    config/
    http/
    middleware/
    models/
    router/
    services/
    database/
      migrations/pg/
      seeds/
  tests/
    support/
scripts/
docs/
  plans/
docker-compose.blog-api-test.yml
```

## Main API flow

Auth:
- `POST /api/auth/login`
- `POST /api/auth/refresh`
- `POST /api/auth/logout`

Posts:
- `GET /api/posts`
- `GET /api/posts/:slug`
- `POST /api/posts`
- `PATCH /api/posts/:id`
- `DELETE /api/posts/:id`

## Local setup

```bash
npm install
```

Create and review your `.env`, then run PostgreSQL migrations and seed data:

```bash
npx eloquent migrate:fresh --pg --force --yes
npx eloquent db:seed --pg --class BlogScenarioSeeder
```

## Run the app

```bash
npm run dev
```

## Run tests

Unit-style tests:

```bash
npm test
```

Coverage:

```bash
npm run test:coverage
```

PostgreSQL integration suite:

```bash
npm run test:integration
```

Docker-backed infrastructure test flow:

```bash
npm run test:docker
```

## Why this harness matters

This consumer project already helped catch and fix real integration issues such as:

- stale seeded password hashes
- cache invalidation behaving too aggressively
- integration cache state leakage between runs
- Windows Docker command orchestration issues
- PostgreSQL runtime lifecycle rough edges

That is the purpose of this repo: improving package reliability through realistic usage.

## Related package docs

Official package docs:
- https://alphaconsultings.mintlify.app/

Advanced package page related to this harness:
- https://alphaconsultings.mintlify.app/test/real-backend-harness

## Package under test

- npm: https://www.npmjs.com/package/@alpha.consultings/eloquent-orm.js
- source: https://github.com/MetalDz/Eloquent-ORM.js
```

## License

This repository is licensed under the Apache 2.0 License.

See [LICENSE](./LICENSE).

