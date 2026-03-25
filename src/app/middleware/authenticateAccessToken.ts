import type { NextFunction, Request, Response } from "express";
import { TokenService } from "../auth/TokenService";
import { AppError } from "../http/AppError";

const tokenService = new TokenService();

export function authenticateAccessToken(
  req: Request,
  _res: Response,
  next: NextFunction
): void {
  try {
    const header = req.headers.authorization;
    if (!header || !header.startsWith("Bearer ")) {
      throw new AppError("Missing bearer token.", 401);
    }

    req.auth = tokenService.verifyAccessToken(header.slice("Bearer ".length).trim());
    next();
  } catch (error) {
    next(error);
  }
}
