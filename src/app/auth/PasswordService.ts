import { randomBytes, scryptSync, timingSafeEqual } from "crypto";

export class PasswordService {
  hash(password: string): string {
    const salt = randomBytes(16).toString("hex");
    const derived = scryptSync(password, salt, 64).toString("hex");
    return `${salt}:${derived}`;
  }

  verify(password: string, hashedValue: string): boolean {
    const [salt, stored] = hashedValue.split(":");
    if (!salt || !stored) return false;

    const candidate = scryptSync(password, salt, 64);
    const storedBuffer = Buffer.from(stored, "hex");
    if (candidate.byteLength !== storedBuffer.byteLength) {
      return false;
    }

    return timingSafeEqual(candidate, storedBuffer);
  }
}
