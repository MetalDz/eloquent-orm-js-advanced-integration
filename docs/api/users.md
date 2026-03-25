# User API

All user routes are mounted under `/api/users`.

Authentication:

- all routes require a bearer access token
- admin privileges are required for list, create, and delete
- self-or-admin access is allowed for `GET /:id` and `PATCH /:id`

## Endpoints

### `GET /api/users/me`

Returns the currently authenticated user.

Response shape:

```json
{
  "id": 1,
  "name": "Admin Author",
  "email": "admin@example.com",
  "role": "admin"
}
```

### `GET /api/users`

Returns the full user list for admins.

Response shape:

```json
[
  {
    "id": 1,
    "name": "Admin Author",
    "email": "admin@example.com",
    "role": "admin"
  }
]
```

### `GET /api/users/:id`

Returns one user record.

Access:

- admin may read any user
- non-admin may read only their own record

### `POST /api/users`

Creates a new user.

Request body:

```json
{
  "name": "Harness Reader",
  "email": "reader@example.com",
  "password": "ReaderPass123!",
  "role": "author"
}
```

Notes:

- password is hashed before persistence
- `password_hash` is never returned in API responses
- duplicate emails return `409`

### `PATCH /api/users/:id`

Updates a user.

Allowed fields:

- `name`
- `email`
- `password`
- `role`

Role updates are admin-only.

### `DELETE /api/users/:id`

Deletes a user.

Rules:

- admin-only
- the currently authenticated admin cannot delete their own active account through this route

## Metadata files

- [users.me.get.json](./metadata/users.me.get.json)
- [users.list.get.json](./metadata/users.list.get.json)
- [users.by-id.get.json](./metadata/users.by-id.get.json)
- [users.create.post.json](./metadata/users.create.post.json)
- [users.update.patch.json](./metadata/users.update.patch.json)
- [users.delete.delete.json](./metadata/users.delete.delete.json)
