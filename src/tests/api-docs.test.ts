import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

const rootDir = process.cwd();

function read(filePath: string): string {
  return fs.readFileSync(path.resolve(rootDir, filePath), "utf8");
}

function readJson(filePath: string): Record<string, unknown> {
  return JSON.parse(read(filePath)) as Record<string, unknown>;
}

test("API docs index links auth, user, post, and metadata pages", () => {
  const apiIndex = read("docs/api/README.md");
  assert.match(apiIndex, /Auth API/);
  assert.match(apiIndex, /User API/);
  assert.match(apiIndex, /Post API/);
  assert.match(apiIndex, /Health API/);
  assert.match(apiIndex, /Comment API/);
  assert.match(apiIndex, /per-endpoint JSON metadata/);
  assert.match(apiIndex, /GET \/health/);
  assert.match(apiIndex, /GET \/api\/users\/me/);
  assert.match(apiIndex, /POST \/api\/posts/);
  assert.match(apiIndex, /GET \/api\/comments/);
});

test("user api docs describe all user routes and metadata files", () => {
  const usersDoc = read("docs/api/users.md");
  assert.match(usersDoc, /GET \/api\/users\/me/);
  assert.match(usersDoc, /GET \/api\/users/);
  assert.match(usersDoc, /GET \/api\/users\/:id/);
  assert.match(usersDoc, /POST \/api\/users/);
  assert.match(usersDoc, /PATCH \/api\/users\/:id/);
  assert.match(usersDoc, /DELETE \/api\/users\/:id/);
  assert.match(usersDoc, /password_hash[\s\S]*never returned/i);
  assert.match(usersDoc, /users\.create\.post\.json/);
});

test("per-endpoint json metadata exists for auth, users, and posts", () => {
  const metadataFiles = [
    "docs/api/metadata/health.get.json",
    "docs/api/metadata/auth.login.post.json",
    "docs/api/metadata/auth.refresh.post.json",
    "docs/api/metadata/auth.logout.post.json",
    "docs/api/metadata/users.me.get.json",
    "docs/api/metadata/users.list.get.json",
    "docs/api/metadata/users.by-id.get.json",
    "docs/api/metadata/users.create.post.json",
    "docs/api/metadata/users.update.patch.json",
    "docs/api/metadata/users.delete.delete.json",
    "docs/api/metadata/posts.list.get.json",
    "docs/api/metadata/posts.by-slug.get.json",
    "docs/api/metadata/posts.create.post.json",
    "docs/api/metadata/posts.update.patch.json",
    "docs/api/metadata/posts.delete.delete.json",
    "docs/api/metadata/comments.list.get.json",
    "docs/api/metadata/comments.by-id.get.json",
    "docs/api/metadata/comments.create.post.json",
    "docs/api/metadata/comments.update.patch.json",
    "docs/api/metadata/comments.delete.delete.json"
  ];

  for (const file of metadataFiles) {
    assert.equal(fs.existsSync(path.resolve(rootDir, file)), true, `${file} should exist`);
    const doc = readJson(file);
    assert.ok(typeof doc.operationId === "string");
    assert.ok(typeof doc.method === "string");
    assert.ok(typeof doc.path === "string");
    assert.ok(typeof doc.authRequired === "boolean");
  }
});

test("comments and health docs describe active vs scaffold route status", () => {
  const commentsDoc = read("docs/api/comments.md");
  const healthDoc = read("docs/api/health.md");
  const commentsMetadata = readJson("docs/api/metadata/comments.list.get.json");
  const healthMetadata = readJson("docs/api/metadata/health.get.json");

  assert.match(commentsDoc, /not currently mounted/i);
  assert.match(commentsDoc, /generated comment controller and service scaffolding/i);
  assert.match(healthDoc, /GET \/health/);
  assert.equal(commentsMetadata.mounted, false);
  assert.equal(healthMetadata.mounted, true);
});
