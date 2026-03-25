import test from "node:test";
import assert from "node:assert/strict";
import { PasswordService } from "../app/auth/PasswordService";
import { TokenService } from "../app/auth/TokenService";

test("PasswordService hashes and verifies passwords without plain-text equality", () => {
  const service = new PasswordService();
  const password = "Password123!";
  const hash = service.hash(password);

  assert.notEqual(hash, password);
  assert.equal(service.verify(password, hash), true);
  assert.equal(service.verify("WrongPassword!", hash), false);
});

test("TokenService issues verifiable access and refresh tokens with distinct semantics", () => {
  const tokens = new TokenService();
  const user = {
    id: 7,
    email: "reader@example.com",
    role: "author",
  };

  const accessToken = tokens.createAccessToken(user);
  const refreshToken = tokens.createRefreshToken(user);

  const access = tokens.verifyAccessToken(accessToken);
  const refresh = tokens.verifyRefreshToken(refreshToken);

  assert.equal(access.userId, 7);
  assert.equal(access.email, "reader@example.com");
  assert.equal(refresh.sub, "7");
  assert.equal(refresh.email, "reader@example.com");
  assert.ok(refresh.jti);
  assert.notEqual(tokens.hashToken(accessToken), tokens.hashToken(refreshToken));
});
