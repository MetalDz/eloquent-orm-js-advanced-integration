import dotenv from "dotenv";

dotenv.config();

const requireValue = (name: string, fallback?: string): string => {
  const value = process.env[name] ?? fallback;
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
};

const toNumber = (value: string, name: string): number => {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) {
    throw new Error(`Environment variable ${name} must be numeric.`);
  }
  return parsed;
};

export const appEnv = {
  port: toNumber(process.env.APP_PORT ?? "3100", "APP_PORT"),
  dbConnection: process.env.DB_CONNECTION ?? "pg",
  memcachedHost: requireValue("MEMCACHED_HOST", "127.0.0.1"),
  memcachedPort: toNumber(process.env.MEMCACHED_PORT ?? "11211", "MEMCACHED_PORT"),
  memcachedTtlSeconds: toNumber(
    process.env.MEMCACHED_DEFAULT_TTL ?? "120",
    "MEMCACHED_DEFAULT_TTL"
  ),
  jwtAccessSecret: requireValue("JWT_ACCESS_SECRET"),
  jwtRefreshSecret: requireValue("JWT_REFRESH_SECRET"),
  jwtAccessTtl: requireValue("JWT_ACCESS_TTL", "15m"),
  jwtRefreshTtl: requireValue("JWT_REFRESH_TTL", "7d"),
};

export const memcachedServer = `${appEnv.memcachedHost}:${appEnv.memcachedPort}`;
