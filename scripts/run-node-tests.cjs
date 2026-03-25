const fs = require("fs");
const path = require("path");
const { spawnSync } = require("child_process");

const root = path.resolve(__dirname, "..");
const srcDir = path.join(root, "src");

function walk(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...walk(fullPath));
      continue;
    }
    if (entry.isFile() && fullPath.endsWith(".test.ts")) {
      files.push(fullPath);
    }
  }

  return files;
}

const testFiles = walk(srcDir).sort();
const includeIntegration = process.argv.includes("--integration");
const selectedFiles = testFiles.filter((file) =>
  includeIntegration ? true : !file.endsWith(".integration.test.ts")
);

if (selectedFiles.length === 0) {
  console.error("No .test.ts files found under src/.");
  process.exit(1);
}

const args = [];
if (process.argv.includes("--coverage")) {
  args.push("--experimental-test-coverage");
}
args.push(
  "--test-concurrency=1",
  "--test-force-exit",
  "--require",
  "ts-node/register/transpile-only",
  "--test",
  ...selectedFiles
);

const result = spawnSync(process.execPath, args, {
  cwd: root,
  stdio: "inherit",
  env: {
    ...process.env,
    TS_NODE_TRANSPILE_ONLY: "1",
  },
});

process.exit(result.status ?? 1);
