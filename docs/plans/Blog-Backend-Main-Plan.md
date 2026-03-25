# Blog Backend Main Plan

## Goal

Build a real backend integration harness in `TESTING_PACKAGE` around `@alpha.consultings/eloquent-orm.js` to validate:

- PostgreSQL CRUD correctness
- Express REST routing
- clean router/service/auth boundaries
- JWT access tokens plus refresh-token rotation
- Memcached-backed read caching
- Docker-backed repeatable integration tests

## Architecture Targets

- `src/app/router`
  - HTTP route composition only
- `src/app/middleware`
  - authentication and error boundaries
- `src/app/services`
  - auth and blog business rules
- `src/app/auth`
  - password hashing and JWT token issuance/verification
- `src/app/cache`
  - Memcached adapter for public post reads
- `src/app/models`
  - Eloquent ORM-backed data access models
- `src/tests`
  - integration and service-level coverage tests

## Execution Order

1. Align environment and scripts for PostgreSQL-first execution.
2. Add auth-capable blog schema and seed data.
3. Implement routers, middleware, auth services, and cache-backed post reads.
4. Add integration tests that migrate, seed, boot the app, and exercise the API.
5. Add Docker orchestration and written usage/testing docs.

## Done Definition

- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/refresh`
- `POST /api/auth/logout`
- `GET /api/posts`
- `GET /api/posts/:slug`
- `POST /api/posts`
- `PATCH /api/posts/:id`
- `DELETE /api/posts/:id`
- PostgreSQL integration test passes
- Memcached hit/miss behavior is asserted
- Docker test flow is documented and scripted
