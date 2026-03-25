# Blog Backend Auth Plan

## Scope

Add authentication without collapsing the blog API into controller-heavy logic.

## Rules

- access token uses JWT bearer auth
- refresh token is rotated on refresh
- refresh tokens are stored in PostgreSQL as hashed values
- passwords are hashed with Node `crypto.scrypt`
- route middleware is responsible only for token extraction and principal validation
- auth service owns registration, login, refresh, and logout logic

## API Contract

- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/refresh`
- `POST /api/auth/logout`
- protected post write routes require `Authorization: Bearer <token>`

## Persistence Contract

- `users`
  - `name`
  - `email`
  - `password_hash`
  - `role`
- `refresh_tokens`
  - `user_id`
  - `token_hash`
  - `expires_at`
  - `revoked_at`

## Test Contract

- invalid password fails login
- missing bearer token blocks write routes
- refresh returns a new access token
- logout revokes refresh-token reuse
