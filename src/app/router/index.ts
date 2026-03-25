import { Router } from "express";
import { AuthService } from "../services/AuthService";
import { BlogPostService } from "../services/BlogPostService";
import { UserApiService } from "../services/UserApiService";
import { createAuthRouter } from "./authRouter";
import { createPostRouter } from "./postRouter";
import { createUserRouter } from "./userRouter";
import { MemcachedPostCache } from "../cache/MemcachedPostCache";

export function createApiRouter(cache = new MemcachedPostCache()): Router {
  const router = Router();
  const authService = new AuthService();
  const postService = new BlogPostService(cache);
  const userService = new UserApiService();

  router.use("/auth", createAuthRouter(authService));
  router.use("/users", createUserRouter(userService));
  router.use("/posts", createPostRouter(postService));

  return router;
}
