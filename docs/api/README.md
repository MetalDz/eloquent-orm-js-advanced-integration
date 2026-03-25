# API Documentation

This directory documents the REST API exposed by the advanced integration harness.

Pages:

- [Health API](./health.md)
- [Auth API](./auth.md)
- [User API](./users.md)
- [Post API](./posts.md)
- [Comment API](./comments.md)

Metadata:

- per-endpoint JSON metadata lives in [`./metadata`](./metadata)
- each JSON file records method, route, auth requirements, role requirements, and request/response shapes

## Server lifecycle

Foreground:

```bash
npm run dev
```

Live reload:

```bash
npm run app:start
```

Stop it with `Ctrl+C`.

Health endpoint:

```text
GET /health
```

Health:

- `GET /health`

## Route groups

Auth:

- `POST /api/auth/login`
- `POST /api/auth/refresh`
- `POST /api/auth/logout`

Users:

- `GET /api/users/me`
- `GET /api/users`
- `GET /api/users/:id`
- `POST /api/users`
- `PATCH /api/users/:id`
- `DELETE /api/users/:id`

Posts:

- `GET /api/posts`
- `GET /api/posts/:slug`
- `POST /api/posts`
- `PATCH /api/posts/:id`
- `DELETE /api/posts/:id`

Comments scaffold:

- `GET /api/comments`
- `GET /api/comments/:id`
- `POST /api/comments`
- `PATCH /api/comments/:id`
- `DELETE /api/comments/:id`

The comment controller/service scaffolding exists, but those routes are not mounted in the active router yet.
