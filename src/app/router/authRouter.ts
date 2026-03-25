import { Router, type NextFunction, type Request, type Response } from "express";
import { AuthService } from "../services/AuthService";

const wrap =
  (
    handler: (req: Request, res: Response, next: NextFunction) => Promise<void>
  ) =>
  (req: Request, res: Response, next: NextFunction) => {
    void handler(req, res, next).catch(next);
  };

export function createAuthRouter(authService: AuthService): Router {
  const router = Router();

  router.post(
    "/register",
    wrap(async (req, res) => {
      const result = await authService.register({
        name: String(req.body?.name ?? ""),
        email: String(req.body?.email ?? ""),
        password: String(req.body?.password ?? ""),
      });
      res.status(201).json(result);
    })
  );

  router.post(
    "/login",
    wrap(async (req, res) => {
      const result = await authService.login({
        email: String(req.body?.email ?? ""),
        password: String(req.body?.password ?? ""),
      });
      res.status(200).json(result);
    })
  );

  router.post(
    "/refresh",
    wrap(async (req, res) => {
      const result = await authService.refresh(String(req.body?.refreshToken ?? ""));
      res.status(200).json(result);
    })
  );

  router.post(
    "/logout",
    wrap(async (req, res) => {
      await authService.logout(String(req.body?.refreshToken ?? ""));
      res.status(204).end();
    })
  );

  return router;
}
