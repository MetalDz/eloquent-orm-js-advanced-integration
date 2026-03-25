import { createHash, randomUUID } from "crypto";
import jwt, { type SignOptions } from "jsonwebtoken";
import { appEnv } from "../config/env";
import type {
  AccessTokenPayload,
  AuthPrincipal,
  RefreshTokenPayload,
} from "./authTypes";
import { AppError } from "../http/AppError";

type TokenUser = {
  id: number;
  email: string;
  role: string;
};

export class TokenService {
  createAccessToken(user: TokenUser): string {
    const payload: AccessTokenPayload = {
      userId: user.id,
      email: user.email,
      role: user.role,
      type: "access",
    };

    return jwt.sign(payload, appEnv.jwtAccessSecret, {
      expiresIn: appEnv.jwtAccessTtl,
      subject: String(user.id),
    } as SignOptions);
  }

  createRefreshToken(user: TokenUser): string {
    const payload: RefreshTokenPayload = {
      sub: String(user.id),
      email: user.email,
      role: user.role,
      jti: randomUUID(),
      type: "refresh",
    };

    return jwt.sign(payload, appEnv.jwtRefreshSecret, {
      expiresIn: appEnv.jwtRefreshTtl,
    } as SignOptions);
  }

  verifyAccessToken(token: string): AuthPrincipal {
    try {
      const payload = jwt.verify(token, appEnv.jwtAccessSecret) as jwt.JwtPayload &
        Partial<AccessTokenPayload>;
      if (payload.type !== "access" || !payload.sub || !payload.email || !payload.role) {
        throw new AppError("Invalid access token payload.", 401);
      }

      return {
        userId: Number(payload.sub),
        email: payload.email,
        role: payload.role,
      };
    } catch (error) {
      throw new AppError("Access token is invalid or expired.", 401, {
        cause: error instanceof Error ? error.message : String(error),
      });
    }
  }

  verifyRefreshToken(token: string): RefreshTokenPayload {
    try {
      const payload = jwt.verify(token, appEnv.jwtRefreshSecret) as jwt.JwtPayload &
        Partial<RefreshTokenPayload>;
      if (
        payload.type !== "refresh" ||
        !payload.sub ||
        !payload.email ||
        !payload.role ||
        !payload.jti
      ) {
        throw new AppError("Invalid refresh token payload.", 401);
      }

      return {
        sub: String(payload.sub),
        email: payload.email,
        role: payload.role,
        jti: payload.jti,
        type: "refresh",
      };
    } catch (error) {
      throw new AppError("Refresh token is invalid or expired.", 401, {
        cause: error instanceof Error ? error.message : String(error),
      });
    }
  }

  hashToken(token: string): string {
    return createHash("sha256").update(token).digest("hex");
  }
}
