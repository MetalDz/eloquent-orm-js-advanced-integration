import { Router, type NextFunction, type Request, type Response } from "express";
import { BlogPostService } from "../services/BlogPostService";
import { authenticateAccessToken } from "../middleware/authenticateAccessToken";

const wrap =
  (
    handler: (req: Request, res: Response, next: NextFunction) => Promise<void>
  ) =>
  (req: Request, res: Response, next: NextFunction) => {
    void handler(req, res, next).catch(next);
  };

export function createPostRouter(postService: BlogPostService): Router {
  const router = Router();

  router.get(
    "/",
    wrap(async (_req, res) => {
      const result = await postService.listPublishedPosts();
      res.setHeader("x-cache", result.cacheStatus);
      res.status(200).json(result.payload);
    })
  );

  router.get(
    "/:slug",
    wrap(async (req, res) => {
      const result = await postService.getPostBySlug(String(req.params.slug));
      res.setHeader("x-cache", result.cacheStatus);
      res.status(200).json(result.payload);
    })
  );

  router.post(
    "/",
    authenticateAccessToken,
    wrap(async (req, res) => {
      const result = await postService.createPost(
        {
          title: String(req.body?.title ?? ""),
          excerpt: req.body?.excerpt ? String(req.body.excerpt) : null,
          body: String(req.body?.body ?? ""),
        },
        {
          userId: Number(req.auth?.userId),
          role: String(req.auth?.role ?? "author"),
        }
      );
      res.status(201).json(result);
    })
  );

  router.patch(
    "/:id",
    authenticateAccessToken,
    wrap(async (req, res) => {
      const result = await postService.updatePost(
        Number(req.params.id),
        {
          title: String(req.body?.title ?? ""),
          excerpt: req.body?.excerpt ? String(req.body.excerpt) : null,
          body: String(req.body?.body ?? ""),
        },
        {
          userId: Number(req.auth?.userId),
          role: String(req.auth?.role ?? "author"),
        }
      );
      res.status(200).json(result);
    })
  );

  router.delete(
    "/:id",
    authenticateAccessToken,
    wrap(async (req, res) => {
      await postService.deletePost(Number(req.params.id), {
        userId: Number(req.auth?.userId),
        role: String(req.auth?.role ?? "author"),
      });
      res.status(204).end();
    })
  );

  return router;
}
