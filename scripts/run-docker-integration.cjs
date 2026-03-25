const net = require("net");
const path = require("path");
const { spawnSync } = require("child_process");

const root = path.resolve(__dirname, "..");
const composeFile = path.join(root, "docker-compose.blog-api-test.yml");
const npmCommand = process.platform === "win32" ? "npm.cmd" : "npm";
const dockerCommand = process.platform === "win32" ? "docker.exe" : "docker";

function run(command, args) {
  const result = spawnSync(command, args, {
    cwd: root,
    stdio: "inherit",
    env: process.env,
    shell: process.platform === "win32",
  });
  if (result.status !== 0) {
    throw new Error(
      `${command} ${args.join(" ")} failed with exit code ${result.status} signal ${
        result.signal ?? "none"
      } error ${result.error?.message ?? "none"}`
    );
  }
}

function waitForPort(host, port, timeoutMs) {
  const started = Date.now();

  return new Promise((resolve, reject) => {
    const attempt = () => {
      const socket = net.createConnection({ host, port }, () => {
        socket.destroy();
        resolve();
      });

      socket.on("error", () => {
        socket.destroy();
        if (Date.now() - started >= timeoutMs) {
          reject(new Error(`Timed out waiting for ${host}:${port}`));
          return;
        }
        setTimeout(attempt, 500);
      });
    };

    attempt();
  });
}

async function main() {
  try {
    run(dockerCommand, ["compose", "-f", composeFile, "up", "-d", "postgres", "memcached"]);
    await waitForPort("127.0.0.1", 5432, 30000);
    await waitForPort("127.0.0.1", 11211, 15000);
    run(npmCommand, ["run", "test:integration"]);
  } finally {
    spawnSync(dockerCommand, ["compose", "-f", composeFile, "down", "-v"], {
      cwd: root,
      stdio: "inherit",
      env: process.env,
    });
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
});
