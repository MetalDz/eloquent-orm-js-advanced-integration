const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const pidFile = path.join(root, ".app-server.pid");

if (!fs.existsSync(pidFile)) {
  console.log("No server PID file found.");
  process.exit(0);
}

const pid = Number(fs.readFileSync(pidFile, "utf8"));
if (!Number.isFinite(pid)) {
  fs.rmSync(pidFile, { force: true });
  console.log("Removed invalid PID file.");
  process.exit(0);
}

try {
  process.kill(pid);
  console.log(`Stopped server PID ${pid}.`);
} catch (error) {
  console.log(
    `Server PID ${pid} was not running: ${error instanceof Error ? error.message : String(error)}`
  );
}

fs.rmSync(pidFile, { force: true });
