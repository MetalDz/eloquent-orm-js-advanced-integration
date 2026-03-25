import { AppError } from "../http/AppError";
import { PasswordService } from "../auth/PasswordService";
import { User } from "../models/User";

type CurrentUser = {
  userId: number;
  role: string;
};

type CreateUserInput = {
  name: string;
  email: string;
  password: string;
  role?: string;
};

type UpdateUserInput = {
  name?: string;
  email?: string;
  password?: string;
  role?: string;
};

type SafeUser = {
  id: number;
  name: string;
  email: string;
  role: string;
  created_at?: string | Date | null;
  updated_at?: string | Date | null;
};

export class UserApiService {
  private readonly passwords = new PasswordService();

  private assertAdmin(currentUser: CurrentUser): void {
    if (currentUser.role !== "admin") {
      throw new AppError("Admin privileges are required.", 403);
    }
  }

  private assertSelfOrAdmin(targetUserId: number, currentUser: CurrentUser): void {
    if (currentUser.role === "admin" || currentUser.userId === targetUserId) {
      return;
    }
    throw new AppError("You are not allowed to access this user.", 403);
  }

  private normalizeEmail(email: string): string {
    return email.trim().toLowerCase();
  }

  private sanitize(user: User): SafeUser {
    return {
      id: Number(user.id),
      name: String(user.name ?? ""),
      email: String(user.email ?? ""),
      role: String(user.role ?? "author"),
      created_at: user.created_at ?? null,
      updated_at: user.updated_at ?? null,
    };
  }

  async current(currentUser: CurrentUser): Promise<SafeUser> {
    const user = (await User.find(currentUser.userId)) as User | null;
    if (!user) {
      throw new AppError("Authenticated user no longer exists.", 404);
    }
    return this.sanitize(user);
  }

  async listUsers(currentUser: CurrentUser): Promise<SafeUser[]> {
    this.assertAdmin(currentUser);
    const rows = await new User().all();
    return rows.map((row) => this.sanitize(row as User));
  }

  async getUserById(id: number, currentUser: CurrentUser): Promise<SafeUser> {
    this.assertSelfOrAdmin(id, currentUser);
    const user = (await User.find(id)) as User | null;
    if (!user) {
      throw new AppError("User not found.", 404);
    }
    return this.sanitize(user);
  }

  async createUser(input: CreateUserInput, currentUser: CurrentUser): Promise<SafeUser> {
    this.assertAdmin(currentUser);
    const email = this.normalizeEmail(input.email);
    const existing = (await User.findOneBy("email", email)) as User | null;
    if (existing) {
      throw new AppError("Email address already exists.", 409);
    }

    const created = await User.create({
      name: input.name.trim(),
      email,
      password_hash: this.passwords.hash(input.password),
      role: (input.role ?? "author").trim() || "author",
    });

    if (!created) {
      throw new AppError("Unable to create user.", 500);
    }

    return this.sanitize(created as User);
  }

  async updateUser(id: number, input: UpdateUserInput, currentUser: CurrentUser): Promise<SafeUser> {
    this.assertSelfOrAdmin(id, currentUser);
    const user = (await User.find(id)) as (User & {
      patch(data: Record<string, unknown>): Promise<void>;
    }) | null;
    if (!user) {
      throw new AppError("User not found.", 404);
    }

    const patch: Record<string, unknown> = {};

    if (typeof input.name === "string" && input.name.trim()) {
      patch.name = input.name.trim();
    }

    if (typeof input.email === "string" && input.email.trim()) {
      const email = this.normalizeEmail(input.email);
      const existing = (await User.findOneBy("email", email)) as User | null;
      if (existing && Number(existing.id) !== Number(user.id)) {
        throw new AppError("Email address already exists.", 409);
      }
      patch.email = email;
    }

    if (typeof input.password === "string" && input.password.trim()) {
      patch.password_hash = this.passwords.hash(input.password);
    }

    if (typeof input.role === "string" && input.role.trim()) {
      this.assertAdmin(currentUser);
      patch.role = input.role.trim();
    }

    if (Object.keys(patch).length === 0) {
      return this.sanitize(user);
    }

    await user.patch(patch);
    return this.sanitize(user);
  }

  async deleteUser(id: number, currentUser: CurrentUser): Promise<void> {
    this.assertAdmin(currentUser);
    if (id === currentUser.userId) {
      throw new AppError("You cannot delete the currently authenticated admin.", 400);
    }

    const existing = (await User.find(id)) as User | null;
    if (!existing) {
      throw new AppError("User not found.", 404);
    }

    await User.deleteById(id);
  }
}
