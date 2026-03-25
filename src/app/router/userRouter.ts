import { Router, type NextFunction, type Request, type Response } from "express";
import { authenticateAccessToken } from "../middleware/authenticateAccessToken";
import { UserApiService } from "../services/UserApiService";

const wrap =
  (
    handler: (req: Request, res: Response, next: NextFunction) => Promise<void>
  ) =>
  (req: Request, res: Response, next: NextFunction) => {
    void handler(req, res, next).catch(next);
  };

export function createUserRouter(userService: UserApiService): Router {
  const router = Router();

  router.use(authenticateAccessToken);

  router.get(
    "/me",
    wrap(async (req, res) => {
      const user = await userService.current({
        userId: Number(req.auth?.userId),
        role: String(req.auth?.role ?? "author"),
      });
      res.status(200).json(user);
    })
  );

  router.get(
    "/",
    wrap(async (req, res) => {
      const users = await userService.listUsers({
        userId: Number(req.auth?.userId),
        role: String(req.auth?.role ?? "author"),
      });
      res.status(200).json(users);
    })
  );

  router.get(
    "/:id",
    wrap(async (req, res) => {
      const user = await userService.getUserById(Number(req.params.id), {
        userId: Number(req.auth?.userId),
        role: String(req.auth?.role ?? "author"),
      });
      res.status(200).json(user);
    })
  );

  router.post(
    "/",
    wrap(async (req, res) => {
      const created = await userService.createUser(
        {
          name: String(req.body?.name ?? ""),
          email: String(req.body?.email ?? ""),
          password: String(req.body?.password ?? ""),
          role: req.body?.role ? String(req.body.role) : undefined,
        },
        {
          userId: Number(req.auth?.userId),
          role: String(req.auth?.role ?? "author"),
        }
      );
      res.status(201).json(created);
    })
  );

  router.patch(
    "/:id",
    wrap(async (req, res) => {
      const updated = await userService.updateUser(
        Number(req.params.id),
        {
          name: req.body?.name ? String(req.body.name) : undefined,
          email: req.body?.email ? String(req.body.email) : undefined,
          password: req.body?.password ? String(req.body.password) : undefined,
          role: req.body?.role ? String(req.body.role) : undefined,
        },
        {
          userId: Number(req.auth?.userId),
          role: String(req.auth?.role ?? "author"),
        }
      );
      res.status(200).json(updated);
    })
  );

  router.delete(
    "/:id",
    wrap(async (req, res) => {
      await userService.deleteUser(Number(req.params.id), {
        userId: Number(req.auth?.userId),
        role: String(req.auth?.role ?? "author"),
      });
      res.status(204).end();
    })
  );

  return router;
}
