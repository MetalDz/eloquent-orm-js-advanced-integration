# Post API

All post routes are mounted under `/api/posts`.

## Endpoints

### `GET /api/posts`

Lists published posts.

Cache behavior:

- first read returns `x-cache: MISS`
- repeated read returns `x-cache: HIT`

### `GET /api/posts/:slug`

Returns one post by slug with the same cache behavior.

### `POST /api/posts`

Creates a post for the authenticated user.

### `PATCH /api/posts/:id`

Updates a post.

Rules:

- the author may update their own post
- admins may update any post

### `DELETE /api/posts/:id`

Deletes a post.

Rules:

- the author may delete their own post
- admins may delete any post

## Metadata files

- [posts.list.get.json](./metadata/posts.list.get.json)
- [posts.by-slug.get.json](./metadata/posts.by-slug.get.json)
- [posts.create.post.json](./metadata/posts.create.post.json)
- [posts.update.patch.json](./metadata/posts.update.patch.json)
- [posts.delete.delete.json](./metadata/posts.delete.delete.json)
