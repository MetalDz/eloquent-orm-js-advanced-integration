import test from "node:test";
import assert from "node:assert/strict";
import {
  closeOrmConnections,
  expectStatus,
  requestJson,
  runEloquent,
  startServer,
} from "./support/testHarness";

test("PostgreSQL blog API supports auth, refresh rotation, protected writes, and cache hits", async () => {
  runEloquent(["migrate:fresh", "--pg", "--force", "--yes"]);
  runEloquent(["db:seed", "--pg", "--class", "BlogScenarioSeeder"]);

  const runtime = await startServer();

  try {
    const login = await requestJson<{
      accessToken: string;
      refreshToken: string;
      user: { id: number; email: string };
    }>(runtime.baseUrl, "/api/auth/login", {
      method: "POST",
      body: {
        email: "admin@example.com",
        password: "Password123!",
      },
    });
    expectStatus(login, 200, "login");
    assert.ok(login.json.accessToken);
    assert.ok(login.json.refreshToken);

    const me = await requestJson<{ id: number; email: string; role: string }>(
      runtime.baseUrl,
      "/api/users/me",
      {
        token: login.json.accessToken,
      }
    );
    expectStatus(me, 200, "current user");
    assert.equal(me.json.email, "admin@example.com");
    assert.equal(me.json.role, "admin");

    const users = await requestJson<Array<{ id: number; email: string }>>(
      runtime.baseUrl,
      "/api/users",
      {
        token: login.json.accessToken,
      }
    );
    expectStatus(users, 200, "list users");
    assert.ok(users.json.length >= 2);

    const createdUser = await requestJson<{ id: number; email: string; role: string }>(
      runtime.baseUrl,
      "/api/users",
      {
        method: "POST",
        token: login.json.accessToken,
        body: {
          name: "Harness Reader",
          email: "reader@example.com",
          password: "ReaderPass123!",
          role: "author",
        },
      }
    );
    expectStatus(createdUser, 201, "create user");
    assert.equal(createdUser.json.email, "reader@example.com");

    const createdUserById = await requestJson<{ id: number; email: string }>(
      runtime.baseUrl,
      `/api/users/${createdUser.json.id}`,
      {
        token: login.json.accessToken,
      }
    );
    expectStatus(createdUserById, 200, "show user");
    assert.equal(createdUserById.json.email, "reader@example.com");

    const updatedUser = await requestJson<{ name: string; email: string }>(
      runtime.baseUrl,
      `/api/users/${createdUser.json.id}`,
      {
        method: "PATCH",
        token: login.json.accessToken,
        body: {
          name: "Harness Reader Updated",
          email: "reader.updated@example.com",
        },
      }
    );
    expectStatus(updatedUser, 200, "update user");
    assert.equal(updatedUser.json.email, "reader.updated@example.com");

    const publicIndexMiss = await requestJson<Array<{ slug: string }>>(
      runtime.baseUrl,
      "/api/posts"
    );
    expectStatus(publicIndexMiss, 200, "public index miss");
    assert.equal(publicIndexMiss.headers.get("x-cache"), "MISS");
    assert.ok(publicIndexMiss.json.length >= 2);

    const publicIndexHit = await requestJson<Array<{ slug: string }>>(
      runtime.baseUrl,
      "/api/posts"
    );
    expectStatus(publicIndexHit, 200, "public index hit");
    assert.equal(publicIndexHit.headers.get("x-cache"), "HIT");

    const unauthorizedCreate = await requestJson(runtime.baseUrl, "/api/posts", {
      method: "POST",
      body: {
        title: "Unauthorized write",
        body: "This should not be accepted without auth.",
      },
    });
    expectStatus(unauthorizedCreate, 401, "unauthorized create");

    const created = await requestJson<{ id: number; slug: string; title: string }>(
      runtime.baseUrl,
      "/api/posts",
      {
        method: "POST",
        token: login.json.accessToken,
        body: {
          title: "JWT Protected Blog Post",
          excerpt: "Cached and protected post.",
          body: "A fully routed backend post created through the Express integration harness.",
        },
      }
    );
    expectStatus(created, 201, "create post");
    assert.equal(created.json.title, "JWT Protected Blog Post");

    const updated = await requestJson<{ title: string; slug: string }>(
      runtime.baseUrl,
      `/api/posts/${created.json.id}`,
      {
        method: "PATCH",
        token: login.json.accessToken,
        body: {
          title: "JWT Protected Blog Post Updated",
          excerpt: "Updated excerpt.",
          body: "Updated post body for the PostgreSQL integration path.",
        },
      }
    );
    expectStatus(updated, 200, "update post");
    assert.equal(updated.json.title, "JWT Protected Blog Post Updated");

    const showUpdatedMiss = await requestJson<{ slug: string; title: string }>(
      runtime.baseUrl,
      `/api/posts/${updated.json.slug}`
    );
    expectStatus(showUpdatedMiss, 200, "show updated miss");
    assert.equal(showUpdatedMiss.headers.get("x-cache"), "MISS");

    const showUpdatedHit = await requestJson<{ slug: string; title: string }>(
      runtime.baseUrl,
      `/api/posts/${updated.json.slug}`
    );
    expectStatus(showUpdatedHit, 200, "show updated hit");
    assert.equal(showUpdatedHit.headers.get("x-cache"), "HIT");

    const refresh = await requestJson<{
      accessToken: string;
      refreshToken: string;
    }>(runtime.baseUrl, "/api/auth/refresh", {
      method: "POST",
      body: { refreshToken: login.json.refreshToken },
    });
    expectStatus(refresh, 200, "refresh");
    assert.notEqual(refresh.json.refreshToken, login.json.refreshToken);

    const deleted = await requestJson(runtime.baseUrl, `/api/posts/${created.json.id}`, {
      method: "DELETE",
      token: refresh.json.accessToken,
    });
    expectStatus(deleted, 204, "delete post");

    const logout = await requestJson(runtime.baseUrl, "/api/auth/logout", {
      method: "POST",
      body: { refreshToken: refresh.json.refreshToken },
    });
    expectStatus(logout, 204, "logout");

    const revokedRefresh = await requestJson(runtime.baseUrl, "/api/auth/refresh", {
      method: "POST",
      body: { refreshToken: refresh.json.refreshToken },
    });
    expectStatus(revokedRefresh, 401, "revoked refresh");

    const deletedUser = await requestJson(runtime.baseUrl, `/api/users/${createdUser.json.id}`, {
      method: "DELETE",
      token: login.json.accessToken,
    });
    expectStatus(deletedUser, 204, "delete user");
  } finally {
    await runtime.disposeCache();
    await runtime.close();
    await closeOrmConnections();
  }
});
