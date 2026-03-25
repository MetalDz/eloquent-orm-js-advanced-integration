# Auth API

All auth routes are mounted under `/api/auth`.

## Endpoints

### `POST /api/auth/login`

Authenticates a user and returns:

- access token
- refresh token
- safe user payload

### `POST /api/auth/refresh`

Rotates the refresh token and issues a new access token.

### `POST /api/auth/logout`

Revokes the current refresh token session.

## Metadata files

- [auth.login.post.json](./metadata/auth.login.post.json)
- [auth.refresh.post.json](./metadata/auth.refresh.post.json)
- [auth.logout.post.json](./metadata/auth.logout.post.json)
