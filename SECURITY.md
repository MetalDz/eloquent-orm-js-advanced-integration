Use this for `SECURITY.md` in the harness repo:

```md
# Security Policy

## Scope

This repository is a consumer-side validation harness for `@alpha.consultings/eloquent-orm.js`.

It includes:

- Express REST API routes
- JWT access token authentication
- refresh token persistence and rotation
- PostgreSQL integration
- Memcached-backed cache reads
- Docker-backed test infrastructure

This repository is intended for integration validation, architecture proof, and runtime testing.

## Security model

This project does not claim to be a production-ready turnkey auth server out of the box.

It demonstrates:

- route protection with middleware
- JWT access token verification
- refresh token rotation and revocation
- service-layer access control boundaries
- infrastructure-backed runtime validation

The deploying application owner is still responsible for production hardening.

## Production responsibilities for adopters

If you reuse patterns from this harness in a real deployment, you must still secure:

- secret management
- HTTPS/TLS termination
- reverse proxy rules
- firewall and network exposure
- rate limiting
- CORS policy
- JWT secret rotation
- cookie/token transport policy
- monitoring and audit logging
- least-privilege database credentials
- cache exposure and network segmentation

## Network access

This harness performs intentional network access for infrastructure it is designed to test.

That includes:

- PostgreSQL connections
- Memcached connections
- local HTTP server binding for the Express API

Network targets are configuration-driven through `.env` and runtime connection settings.

This project does not “phone home” to unrelated external services as part of its backend logic.

## Authentication and authorization

The harness demonstrates:

- bearer-token middleware
- protected write routes
- refresh token persistence
- token revocation on logout
- rotation on refresh

Protected write routes in the example app include:

- `POST /api/posts`
- `PATCH /api/posts/:id`
- `DELETE /api/posts/:id`

This repository is a reference architecture and validation harness, not a complete security product.

## Secrets

Do not commit real credentials, keys, or production tokens.

Use environment variables for:

- database credentials
- JWT secrets
- cache hosts and ports
- runtime environment selection

Rotate any real secrets immediately if they are ever exposed.

## Docker and local infrastructure

Docker Compose is used only to provide repeatable local/integration infrastructure for:

- PostgreSQL
- Memcached

Before using similar flows in production, apply your own hardening for:

- container image policy
- secret injection
- network segmentation
- port exposure
- runtime user permissions

## Reporting a vulnerability

If you discover a security issue in this harness repo, open a private or controlled report through the owning GitHub organization if available.

If the issue is actually in the package under test, report it to the main package repository:

- https://github.com/MetalDz/Eloquent-ORM.js

## Related docs

- Official package docs: https://alphaconsultings.mintlify.app/
- Package security policy: https://github.com/MetalDz/Eloquent-ORM.js/blob/ai_master/SECURITY.md
- npm package: https://www.npmjs.com/package/@alpha.consultings/eloquent-orm.js
```
