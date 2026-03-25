import type { NextFunction, Request, Response } from "express";
import { AppError } from "../http/AppError";

export function errorHandler(
  error: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  if (error instanceof AppError) {
    res.status(error.statusCode).json({
      error: error.message,
      details: error.details ?? null,
    });
    return;
  }

  res.status(500).json({
    error: "Unexpected server error.",
    details: error instanceof Error ? error.message : String(error),
  });
}
