import { User } from "../models/User";
import { RefreshToken } from "../models/RefreshToken";
import { PasswordService } from "../auth/PasswordService";
import { TokenService } from "../auth/TokenService";
import { AppError } from "../http/AppError";

type AuthUser = {
  id: number;
  name: string;
  email: string;
  role: string;
};

type RegisterInput = {
  name: string;
  email: string;
  password: string;
};

type LoginInput = {
  email: string;
  password: string;
};

export class AuthService {
  private readonly passwords = new PasswordService();
  private readonly tokens = new TokenService();

  private toSafeUser(user: User): AuthUser {
    return {
      id: Number(user.id),
      name: String(user.name ?? ""),
      email: String(user.email ?? ""),
      role: String(user.role ?? "author"),
    };
  }

  private async createSession(user: User) {
    const safeUser = this.toSafeUser(user);
    const accessToken = this.tokens.createAccessToken({
      id: safeUser.id,
      email: safeUser.email,
      role: safeUser.role,
    });
    const refreshToken = this.tokens.createRefreshToken({
      id: safeUser.id,
      email: safeUser.email,
      role: safeUser.role,
    });

    const refreshPayload = this.tokens.verifyRefreshToken(refreshToken);
    await RefreshToken.create({
      user_id: safeUser.id,
      token_hash: this.tokens.hashToken(refreshToken),
      expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      revoked_at: null,
      jti: refreshPayload.jti,
    });

    return {
      user: safeUser,
      accessToken,
      refreshToken,
    };
  }

  async register(input: RegisterInput) {
    const email = input.email.trim().toLowerCase();
    const existing = await User.findOneBy("email", email);
    if (existing) {
      throw new AppError("Email address already exists.", 409);
    }

    const created = await User.create({
      name: input.name.trim(),
      email,
      password_hash: this.passwords.hash(input.password),
      role: "author",
    });

    if (!created) {
      throw new AppError("Unable to register user.", 500);
    }

    return this.createSession(created as User);
  }

  async login(input: LoginInput) {
    const email = input.email.trim().toLowerCase();
    const user = await User.findOneBy("email", email);
    if (!user) {
      throw new AppError("Invalid email or password.", 401);
    }

    if (!this.passwords.verify(input.password, String(user.password_hash ?? ""))) {
      throw new AppError("Invalid email or password.", 401);
    }

    return this.createSession(user as User);
  }

  async refresh(refreshToken: string) {
    const payload = this.tokens.verifyRefreshToken(refreshToken);
    const tokenHash = this.tokens.hashToken(refreshToken);
    const stored = await RefreshToken.findOneBy("token_hash", tokenHash);

    if (!stored) {
      throw new AppError("Refresh token is not recognized.", 401);
    }
    if (stored.revoked_at) {
      throw new AppError("Refresh token has been revoked.", 401);
    }
    if (new Date(String(stored.expires_at)).getTime() <= Date.now()) {
      throw new AppError("Refresh token has expired.", 401);
    }
    if (String(stored.jti) !== payload.jti) {
      throw new AppError("Refresh token does not match stored session.", 401);
    }

    await stored.patch({ revoked_at: new Date().toISOString() });

    const user = await User.find(Number(payload.sub));
    if (!user) {
      throw new AppError("User no longer exists.", 401);
    }

    return this.createSession(user as User);
  }

  async logout(refreshToken: string): Promise<void> {
    const tokenHash = this.tokens.hashToken(refreshToken);
    const stored = await RefreshToken.findOneBy("token_hash", tokenHash);
    if (!stored) {
      return;
    }
    if (!stored.revoked_at) {
      await stored.patch({ revoked_at: new Date().toISOString() });
    }
  }
}
