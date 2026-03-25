import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { request as httpRequest } from "node:http";
import type { AddressInfo, Server } from "node:net";
import { createBlogApiApp } from "../../app/http/createBlogApiApp";

type JsonResponse<T = unknown> = {
  status: number;
  json: T;
  headers: Headers;
};

const npxCommand = process.platform === "win32" ? "npx.cmd" : "npx";

export function runEloquent(args: string[]): void {
  const result = spawnSync(npxCommand, ["eloquent", ...args], {
    cwd: process.cwd(),
    encoding: "utf8",
    shell: process.platform === "win32",
    env: {
      ...process.env,
      DB_CONNECTION: "pg",
      DB_TEST_CONNECTION: "pg_test",
      APP_ENV: "development",
      ELOQUENT_ALLOW_PROD_DESTRUCTIVE: "true",
    },
  });

  if (result.status !== 0) {
    throw new Error(
      `eloquent ${args.join(" ")} failed:\nERROR:\n${result.error ?? "none"}\nSTDOUT:\n${
        result.stdout ?? "none"
      }\nSTDERR:\n${result.stderr ?? "none"}`
    );
  }
}

export async function startServer(): Promise<{
  server: Server;
  baseUrl: string;
  close: () => Promise<void>;
  disposeCache: () => Promise<void>;
}> {
  const { app, cache } = createBlogApiApp();
  try {
    await cache.flushAll();
  } catch {
    // best-effort cache hygiene only
  }

  const server = await new Promise<Server>((resolve) => {
    const instance = app.listen(0, "127.0.0.1", () => resolve(instance));
  });

  const address = server.address() as AddressInfo;
  return {
    server,
    baseUrl: `http://127.0.0.1:${address.port}`,
    close: () =>
      new Promise<void>((resolve, reject) => {
        server.close((error) => {
          if (error) {
            reject(error);
            return;
          }
          resolve();
        });
      }),
    disposeCache: async () => {
      try {
        await cache.flushAll();
      } catch {
        // best-effort cache hygiene only
      } finally {
        cache.close();
      }
    },
  };
}

export async function requestJson<T = unknown>(
  baseUrl: string,
  path: string,
  options?: {
    method?: string;
    body?: Record<string, unknown>;
    token?: string;
  }
): Promise<JsonResponse<T>> {
  const url = new URL(path, baseUrl);
  const body = options?.body ? JSON.stringify(options.body) : undefined;

  return new Promise<JsonResponse<T>>((resolve, reject) => {
    const req = httpRequest(
      {
        protocol: url.protocol,
        hostname: url.hostname,
        port: url.port,
        path: `${url.pathname}${url.search}`,
        method: options?.method ?? "GET",
        headers: {
          ...(body ? { "content-type": "application/json" } : {}),
          ...(body ? { "content-length": Buffer.byteLength(body) } : {}),
          ...(options?.token ? { authorization: `Bearer ${options.token}` } : {}),
          connection: "close",
        },
      },
      (response) => {
        const chunks: Buffer[] = [];
        response.on("data", (chunk) => {
          chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
        });
        response.on("end", () => {
          const raw = Buffer.concat(chunks).toString("utf8");
          let json: unknown = null;
          if (response.statusCode !== 204 && raw.length > 0) {
            json = JSON.parse(raw);
          }

          resolve({
            status: response.statusCode ?? 500,
            json: json as T,
            headers: new Headers(
              Object.entries(response.headers).flatMap(([key, value]) =>
                value === undefined
                  ? []
                  : [[key, Array.isArray(value) ? value.join(", ") : String(value)]]
              )
            ),
          });
        });
      }
    );

    req.on("error", reject);
    if (body) {
      req.write(body);
    }
    req.end();
  });
}

export function expectStatus<T>(
  response: JsonResponse<T>,
  expectedStatus: number,
  label: string
): void {
  assert.equal(
    response.status,
    expectedStatus,
    `${label} expected ${expectedStatus} but received ${response.status}: ${JSON.stringify(
      response.json
    )}`
  );
}

export async function closeOrmConnections(): Promise<void> {
  try {
    const connectionFactoryModule =
      "@alpha.consultings/eloquent-orm.js/dist/core/connection/ConnectionFactory.js";
    const internal = await import(connectionFactoryModule);
    if (typeof internal.closeAllConnections === "function") {
      await internal.closeAllConnections();
    }
  } catch {
    // best-effort cleanup only
  }
}
