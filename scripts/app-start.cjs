const fs = require("node:fs");
const path = require("node:path");
const { spawn } = require("node:child_process");

const root = path.resolve(__dirname, "..");
const pidFile = path.join(root, ".app-server.pid");
const npmCommand = process.platform === "win32" ? "npm.cmd" : "npm";

function processExists(pid) {
  try {
    process.kill(pid, 0);
    return true;
  } catch {
    return false;
  }
}

if (fs.existsSync(pidFile)) {
  const existingPid = Number(fs.readFileSync(pidFile, "utf8"));
  if (Number.isFinite(existingPid) && processExists(existingPid)) {
    console.log(`Server already running with PID ${existingPid}.`);
    process.exit(0);
  }
  fs.rmSync(pidFile, { force: true });
}

const child = spawn(npmCommand, ["run", "dev"], {
  cwd: root,
  detached: true,
  stdio: "ignore",
  shell: process.platform === "win32",
});

child.unref();
fs.writeFileSync(pidFile, String(child.pid));
console.log(`Server started with PID ${child.pid}.`);
console.log("Health: http://127.0.0.1:3100/health");
