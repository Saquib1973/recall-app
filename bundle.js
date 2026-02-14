#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

const root = process.cwd();
const outputArg = process.argv[2];
const outputPath = outputArg
  ? path.resolve(root, outputArg)
  : path.join(root, "all-code.txt");

const dirNames = [
  "app",
  "components",
  "assets",
  "constants",
  "context",
  "hooks",
  "hools",
  "services",
  "servies",
  "types",
  "utils",
];

const allowedExtensions = new Set([
  ".js",
  ".jsx",
  ".ts",
  ".tsx",
  ".mjs",
  ".cjs",
  ".json",
  ".md",
  ".css",
  ".scss",
  ".sass",
  ".less",
  ".txt",
  ".yaml",
  ".yml",
]);

const toPosix = (p) => p.split(path.sep).join("/");

const isDirectory = (p) => {
  try {
    return fs.statSync(p).isDirectory();
  } catch {
    return false;
  }
};

const isBinaryBuffer = (buf) => {
  for (let i = 0; i < buf.length; i += 1) {
    if (buf[i] === 0) return true;
  }
  return false;
};

const shouldIncludeFile = (filePath) => {
  const lower = filePath.toLowerCase();
  const isDts = lower.endsWith(".d.ts");
  const ext = path.extname(lower);
  return isDts || allowedExtensions.has(ext);
};

const walkDir = async (dir) => {
  const entries = await fs.promises.readdir(dir, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      files.push(...(await walkDir(fullPath)));
      continue;
    }

    if (!entry.isFile()) continue;
    if (!shouldIncludeFile(fullPath)) continue;

    files.push(fullPath);
  }

  return files;
};

const main = async () => {
  const targetDirs = Array.from(
    new Set(
      dirNames
        .map((name) => path.join(root, name))
        .filter((dirPath) => isDirectory(dirPath)),
    ),
  );

  if (targetDirs.length === 0) {
    console.error("No target directories found.");
    process.exit(1);
  }

  const allFiles = [];
  for (const dir of targetDirs) {
    allFiles.push(...(await walkDir(dir)));
  }

  const sortedFiles = allFiles.sort((a, b) => a.localeCompare(b));
  const chunks = [];

  for (const filePath of sortedFiles) {
    const buf = await fs.promises.readFile(filePath);
    if (isBinaryBuffer(buf)) continue;

    const content = buf.toString("utf8");
    const relPath = toPosix(path.relative(root, filePath));

    chunks.push(`===== ${relPath} =====`);
    chunks.push(content.replace(/\s*$/, ""));
    chunks.push("");
  }

  await fs.promises.writeFile(outputPath, chunks.join("\n"), "utf8");
  console.log(`Wrote ${sortedFiles.length} files to ${outputPath}`);
};

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
