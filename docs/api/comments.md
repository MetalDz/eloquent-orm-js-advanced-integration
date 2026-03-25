# Comment API

This harness includes generated comment controller and service scaffolding, but comment routes are **not currently mounted** in `createApiRouter`.

That means these endpoints are documented as scaffold surface, not as active runtime routes today.

Potential generated routes:

- `GET /api/comments`
- `GET /api/comments/:id`
- `POST /api/comments`
- `PATCH /api/comments/:id`
- `DELETE /api/comments/:id`

Why document them anyway:

- they are part of the generated scenario surface
- they represent the next table-backed REST slice if comment routing is enabled
- the metadata keeps the harness explicit about what is active vs scaffold-only

## Metadata files

- [comments.list.get.json](./metadata/comments.list.get.json)
- [comments.by-id.get.json](./metadata/comments.by-id.get.json)
- [comments.create.post.json](./metadata/comments.create.post.json)
- [comments.update.patch.json](./metadata/comments.update.patch.json)
- [comments.delete.delete.json](./metadata/comments.delete.delete.json)
