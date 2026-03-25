import express from "express";
import { registerModels } from "@alpha.consultings/eloquent-orm.js";
import { createApiRouter } from "../router";
import { errorHandler } from "../middleware/errorHandler";
import { User } from "../models/User";
import { Post } from "../models/Post";
import { Comment } from "../models/Comment";
import { RefreshToken } from "../models/RefreshToken";
import { MemcachedPostCache } from "../cache/MemcachedPostCache";

let modelsRegistered = false;

export function createBlogApiApp() {
  if (!modelsRegistered) {
    registerModels([User, Post, Comment, RefreshToken], { strict: false });
    modelsRegistered = true;
  }

  const cache = new MemcachedPostCache();
  const app = express();

  app.use(express.json());
  app.get("/health", (_req, res) => {
    res.status(200).json({ ok: true });
  });
  app.use("/api", createApiRouter(cache));
  app.use(errorHandler);

  return { app, cache };
}
